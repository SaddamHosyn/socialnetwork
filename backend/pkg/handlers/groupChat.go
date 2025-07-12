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

// SendGroupMessage handles sending a message to a group chat
func SendGroupMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var req struct {
		GroupID int    `json:"group_id"`
		Content string `json:"content"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate input
	if req.GroupID <= 0 {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	if strings.TrimSpace(req.Content) == "" {
		utils.Fail(w, http.StatusBadRequest, "Message content cannot be empty")
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsUserGroupMember(userID, req.GroupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You are not a member of this group")
		return
	}

	// Get user's nickname for the message
	user, err := db.GetUserByID(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to get user info")
		return
	}

	// Save the message
	messageID, err := db.SaveGroupMessage(req.GroupID, userID, strings.TrimSpace(req.Content))
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to save message")
		return
	}

	// Broadcast the message to the group via WebSocket
	message := models.Message{
		Type:       "group_message",
		ID:         int(messageID),
		GroupID:    req.GroupID,
		SenderID:   userID,
		Message:    strings.TrimSpace(req.Content),
		SenderName: user.Nickname,
		Time:       time.Now().Format(time.RFC3339),
	}

	// Broadcast to WebSocket clients
	if chat.GlobalManager != nil {
		messageBytes, _ := json.Marshal(message)
		chat.GlobalManager.Broadcast <- messageBytes
	}

	// Return success response with the message info
	response := map[string]interface{}{
		"success":     true,
		"group_id":    req.GroupID,
		"sender_id":   userID,
		"content":     strings.TrimSpace(req.Content),
		"sender_name": user.Nickname,
	}

	utils.Success(w, http.StatusCreated, response)
}

// GetGroupMessages handles fetching messages for a group chat
func GetGroupMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Get group ID from query parameters
	groupIDStr := r.URL.Query().Get("group_id")
	if groupIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "Group ID is required")
		return
	}

	groupID, err := strconv.Atoi(groupIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsUserGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You are not a member of this group")
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
	messages, err := db.GetGroupMessages(groupID, limit, offset)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch messages")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"messages": messages,
		"group_id": groupID,
		"limit":    limit,
		"offset":   offset,
	})
}

// GetLatestGroupMessage handles fetching the latest message for a group
func GetLatestGroupMessage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Get group ID from query parameters
	groupIDStr := r.URL.Query().Get("group_id")
	if groupIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "Group ID is required")
		return
	}

	groupID, err := strconv.Atoi(groupIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsUserGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You are not a member of this group")
		return
	}

	// Fetch latest message
	message, err := db.GetLatestGroupMessage(groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch latest message")
		return
	}

	utils.Success(w, http.StatusOK, message)
}
