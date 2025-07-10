package handlers

import (
	"net/http"
	"strconv"

	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/utils"
)

func GetNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey).(int)

	notifs, err := db.GetNotificationsForUser(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Could not fetch notifications")
		return
	}

	utils.Success(w, http.StatusOK, notifs)
}

func MarkNotificationReadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Invalid method")
		return
	}

	idStr := r.URL.Query().Get("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid notification ID")
		return
	}

	err = db.MarkNotificationAsRead(notifID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Could not mark as read")
		return
	}

	utils.Success(w, http.StatusOK, "Notification marked as read")
}

// RespondToFollowNotificationHandler handles follow request responses from notifications
func RespondToFollowNotificationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Parse notification ID and action
	notifIDStr := r.FormValue("notification_id")
	action := r.FormValue("action") // "accept" or "decline"

	if notifIDStr == "" || action == "" {
		utils.Fail(w, http.StatusBadRequest, "notification_id and action are required")
		return
	}

	if action != "accept" && action != "decline" {
		utils.Fail(w, http.StatusBadRequest, "action must be 'accept' or 'decline'")
		return
	}

	notifID, err := strconv.Atoi(notifIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid notification_id")
		return
	}

	database := sqlite.GetDB()

	// Get the notification to verify it belongs to the current user and get the follow request ID
	var notifUserID, referenceID, senderID int
	var notifType string
	query := `SELECT user_id, type, reference_id, sender_id FROM notifications WHERE id = ?`
	err = database.QueryRow(query, notifID).Scan(&notifUserID, &notifType, &referenceID, &senderID)
	if err != nil {
		utils.Fail(w, http.StatusNotFound, "Notification not found")
		return
	}

	// Verify the current user owns this notification
	if notifUserID != userID {
		utils.Fail(w, http.StatusForbidden, "Not authorized to respond to this notification")
		return
	}

	// Verify it's a follow request notification
	if notifType != "follow_request" {
		utils.Fail(w, http.StatusBadRequest, "Not a follow request notification")
		return
	}

	// Update the follow request status - FIXED: removed database parameter
	newStatus := "declined"
	if action == "accept" {
		newStatus = "accepted"
	}

	err = db.UpdateFollowRequestStatus(referenceID, newStatus)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update follow request status")
		return
	}

	// Update the notification action
	err = db.UpdateNotificationAction(notifID, action)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update notification")
		return
	}

	// Mark notification as read
	err = db.MarkNotificationAsRead(notifID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to mark notification as read")
		return
	}

	// If accepted, create the follow relationship - FIXED: removed database parameter
	if action == "accept" {
		err = db.CreateFollowRelationship(senderID, userID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to create follow relationship")
			return
		}
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message": "Follow request " + newStatus,
		"action":  action,
	})
}

// RespondToGroupInvitationHandler handles group invitation responses from notifications
func RespondToGroupInvitationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Parse notification ID and action
	notifIDStr := r.FormValue("notification_id")
	action := r.FormValue("action") // "accept" or "decline"

	if notifIDStr == "" || action == "" {
		utils.Fail(w, http.StatusBadRequest, "notification_id and action are required")
		return
	}

	if action != "accept" && action != "decline" {
		utils.Fail(w, http.StatusBadRequest, "action must be 'accept' or 'decline'")
		return
	}

	notifID, err := strconv.Atoi(notifIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid notification_id")
		return
	}

	database := sqlite.GetDB()

	// Get the notification to verify it belongs to the current user
	var notifUserID, referenceID, senderID int
	var notifType string
	query := `SELECT user_id, type, reference_id, sender_id FROM notifications WHERE id = ?`
	err = database.QueryRow(query, notifID).Scan(&notifUserID, &notifType, &referenceID, &senderID)
	if err != nil {
		utils.Fail(w, http.StatusNotFound, "Notification not found")
		return
	}

	// Verify the current user owns this notification
	if notifUserID != userID {
		utils.Fail(w, http.StatusForbidden, "Not authorized to respond to this notification")
		return
	}

	// Verify it's a group invitation notification
	if notifType != "group_invitation" {
		utils.Fail(w, http.StatusBadRequest, "Not a group invitation notification")
		return
	}

	// Handle the group invitation
	err = db.HandleGroupInvitation(referenceID, userID, action == "accept")
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to handle group invitation")
		return
	}

	// Update the notification action
	err = db.UpdateNotificationAction(notifID, action)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update notification")
		return
	}

	// Mark notification as read
	err = db.MarkNotificationAsRead(notifID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to mark notification as read")
		return
	}

	message := "Group invitation declined"
	if action == "accept" {
		message = "Group invitation accepted successfully"
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message": message,
		"action":  action,
	})
}

// RespondToJoinRequestHandler handles join request responses from notifications
func RespondToJoinRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Parse notification ID and action
	notifIDStr := r.FormValue("notification_id")
	action := r.FormValue("action") // "accept" or "decline"

	if notifIDStr == "" || action == "" {
		utils.Fail(w, http.StatusBadRequest, "notification_id and action are required")
		return
	}

	if action != "accept" && action != "decline" {
		utils.Fail(w, http.StatusBadRequest, "action must be 'accept' or 'decline'")
		return
	}

	notifID, err := strconv.Atoi(notifIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid notification_id")
		return
	}

	database := sqlite.GetDB()

	// Get the notification to verify it belongs to the current user
	var notifUserID, referenceID, senderID int
	var notifType string
	query := `SELECT user_id, type, reference_id, sender_id FROM notifications WHERE id = ?`
	err = database.QueryRow(query, notifID).Scan(&notifUserID, &notifType, &referenceID, &senderID)
	if err != nil {
		utils.Fail(w, http.StatusNotFound, "Notification not found")
		return
	}

	// Verify the current user owns this notification
	if notifUserID != userID {
		utils.Fail(w, http.StatusForbidden, "Not authorized to respond to this notification")
		return
	}

	// Verify it's a join request notification
	if notifType != "group_join_request" {
		utils.Fail(w, http.StatusBadRequest, "Not a join request notification")
		return
	}

	// Handle the join request
	err = db.HandleJoinRequest(referenceID, action == "accept")
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to handle join request")
		return
	}

	// Update the notification action
	err = db.UpdateNotificationAction(notifID, action)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update notification")
		return
	}

	// Mark notification as read
	err = db.MarkNotificationAsRead(notifID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to mark notification as read")
		return
	}

	message := "Join request declined"
	if action == "accept" {
		message = "Join request accepted successfully"
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message": message,
		"action":  action,
	})
}
