package handlers

import (
	"encoding/json"
	"net/http"
	"social-network/backend/pkg/chat"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/models"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
	"time"
)

// SendPrivateMessage handles sending a private message
func SendPrivateMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var req struct {
		ReceiverID int    `json:"receiver_id"`
		Content    string `json:"content"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate input
	if req.ReceiverID <= 0 {
		utils.Fail(w, http.StatusBadRequest, "Invalid receiver ID")
		return
	}

	if strings.TrimSpace(req.Content) == "" {
		utils.Fail(w, http.StatusBadRequest, "Message content cannot be empty")
		return
	}

	if req.ReceiverID == userID {
		utils.Fail(w, http.StatusBadRequest, "Cannot send message to yourself")
		return
	}

	// Check if user can send message to receiver
	canSend, err := db.CanSendPrivateMessage(userID, req.ReceiverID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if !canSend {
		utils.Fail(w, http.StatusForbidden, "You can only send messages to users you follow or who follow you")
		return
	}

	// Get user details for the message
	sender, err := db.GetUserByID(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to get sender info")
		return
	}

	// Save the message
	messageID, err := db.SavePrivateMessage(userID, req.ReceiverID, strings.TrimSpace(req.Content))
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to save message")
		return
	}

	// Broadcast the message via WebSocket
	senderName := sender.Nickname
	if strings.TrimSpace(senderName) == "" {
		senderName = sender.FirstName + " " + sender.LastName
	}

	message := models.Message{
		Type:       "private_message",
		ID:         int(messageID),
		SenderID:   userID,
		SenderName: senderName,
		ReceiverID: req.ReceiverID,
		Message:    strings.TrimSpace(req.Content),
		Time:       time.Now().Format(time.RFC3339),
	}

	// Broadcast to WebSocket clients
	if chat.GlobalManager != nil {
		messageBytes, _ := json.Marshal(message)
		chat.GlobalManager.Broadcast <- messageBytes
	}

	// Return success response
	utils.Success(w, http.StatusCreated, map[string]interface{}{
		"id":          messageID,
		"sender_id":   userID,
		"receiver_id": req.ReceiverID,
		"content":     strings.TrimSpace(req.Content),
		"sender_name": senderName,
	})
}

// GetPrivateMessages handles fetching messages between two users
func GetPrivateMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Get receiver ID from query parameters
	receiverIDStr := r.URL.Query().Get("receiver_id")
	if receiverIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "Receiver ID is required")
		return
	}

	receiverID, err := strconv.Atoi(receiverIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid receiver ID")
		return
	}

	// Check if user can view messages with this receiver
	canView, err := db.CanSendPrivateMessage(userID, receiverID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if !canView {
		utils.Fail(w, http.StatusForbidden, "You can only view messages with users you follow or who follow you")
		return
	}

	// Get pagination parameters
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	limit := 50 // default limit
	offset := 0 // default offset

	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 && parsedLimit <= 100 {
			limit = parsedLimit
		}
	}

	if offsetStr != "" {
		if parsedOffset, err := strconv.Atoi(offsetStr); err == nil && parsedOffset >= 0 {
			offset = parsedOffset
		}
	}

	// Fetch messages
	messages, err := db.GetPrivateMessages(userID, receiverID, limit, offset)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch messages")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"messages":    messages,
		"receiver_id": receiverID,
		"limit":       limit,
		"offset":      offset,
	})
}

// GetPrivateChats handles fetching the list of users the current user has chatted with
func GetPrivateChats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Get users that can receive private messages (following/followers with messages)
	users, err := db.GetPrivateChatUsers(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch chat users")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"users": users,
	})
}

// GetChatUsers handles fetching all users with their follow status and chat eligibility
func GetChatUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Get all users with their follow status and chat eligibility
	users, err := db.GetAllUsersForChat(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch all chat users")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"users": users,
	})
}
