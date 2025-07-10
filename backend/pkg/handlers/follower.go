package handlers

import (
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/utils"
	"strconv"
)

// FollowUserHandler handles follow requests
func FollowUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get current user ID from context
	userID := r.Context().Value(userIDKey).(int)

	// Parse the target user ID
	targetUserIDStr := r.FormValue("user_id")
	if targetUserIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "user_id is required")
		return
	}

	targetUserID, err := strconv.Atoi(targetUserIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid user_id")
		return
	}

	// Prevent self-follow
	if userID == targetUserID {
		utils.Fail(w, http.StatusBadRequest, "Cannot follow yourself")
		return
	}

	// Check if already following - FIXED: removed database parameter
	isFollowing, err := db.IsFollowing(userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if isFollowing {
		utils.Fail(w, http.StatusBadRequest, "Already following this user")
		return
	}

	// Check if there's already a pending request - FIXED: removed database parameter
	hasPendingRequest, err := db.HasPendingFollowRequest(userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if hasPendingRequest {
		utils.Fail(w, http.StatusBadRequest, "Follow request already sent")
		return
	}

	// Check if target user is private - FIXED: removed database parameter
	isPrivate, err := db.GetUserPrivacySetting(targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if isPrivate {
		// Get requester's nickname for notification - FIXED: removed database parameter
		requesterNickname, err := db.GetUserDetails(userID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to get user details")
			return
		}

		// Send follow request for private users - FIXED: removed database parameter and return ID
		followRequestID, err := db.CreateFollowRequest(userID, targetUserID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to send follow request")
			return
		}

		// Create notification for the target user
		err = db.CreateFollowRequestNotification(targetUserID, userID, requesterNickname, followRequestID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to create notification")
			return
		}

		utils.Success(w, http.StatusOK, map[string]interface{}{
			"message": "Follow request sent",
			"status":  "pending",
		})
	} else {
		// Directly follow public users - FIXED: removed database parameter
		err = db.CreateFollowRelationship(userID, targetUserID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to follow user")
			return
		}
		utils.Success(w, http.StatusOK, map[string]interface{}{
			"message": "Now following user",
			"status":  "following",
		})
	}
}

// RespondToFollowRequestHandler handles accepting/declining follow requests
func RespondToFollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Parse request ID and action
	requestIDStr := r.FormValue("request_id")
	action := r.FormValue("action") // "accept" or "decline"

	if requestIDStr == "" || action == "" {
		utils.Fail(w, http.StatusBadRequest, "request_id and action are required")
		return
	}

	if action != "accept" && action != "decline" {
		utils.Fail(w, http.StatusBadRequest, "action must be 'accept' or 'decline'")
		return
	}

	requestID, err := strconv.Atoi(requestIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid request_id")
		return
	}

	// Get the follow request to verify it belongs to the current user
	// FIXED: Use direct database query since this is handler-specific logic
	var requesterID, requesteeID int
	var status string
	query := `SELECT requester_id, requestee_id, status FROM follow_requests WHERE id = ?`
	err = sqlite.GetDB().QueryRow(query, requestID).Scan(&requesterID, &requesteeID, &status)
	if err != nil {
		utils.Fail(w, http.StatusNotFound, "Follow request not found")
		return
	}

	// Verify the current user is the requestee
	if requesteeID != userID {
		utils.Fail(w, http.StatusForbidden, "Not authorized to respond to this request")
		return
	}

	// Check if request is still pending
	if status != "pending" {
		utils.Fail(w, http.StatusBadRequest, "Request has already been processed")
		return
	}

	// Update the request status - FIXED: removed database parameter
	newStatus := "declined"
	if action == "accept" {
		newStatus = "accepted"
	}

	err = db.UpdateFollowRequestStatus(requestID, newStatus)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update request status")
		return
	}

	// Update the notification action
	notification, err := db.GetNotificationByReference(userID, "follow_request", requestID)
	if err == nil {
		err = db.UpdateNotificationAction(notification.ID, action)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to update notification")
			return
		}
	}

	// If accepted, create the follow relationship - FIXED: removed database parameter
	if action == "accept" {
		err = db.CreateFollowRelationship(requesterID, requesteeID)
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

// UnfollowUserHandler allows unfollowing users
func UnfollowUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	targetUserIDStr := r.FormValue("user_id")
	if targetUserIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "user_id is required")
		return
	}

	targetUserID, err := strconv.Atoi(targetUserIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid user_id")
		return
	}

	// Check if actually following - FIXED: removed database parameter
	isFollowing, err := db.IsFollowing(userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if !isFollowing {
		utils.Fail(w, http.StatusBadRequest, "Not following this user")
		return
	}

	// Unfollow the user - FIXED: removed database parameter
	err = db.DeleteFollowRelationship(userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to unfollow user")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message": "Successfully unfollowed user",
	})
}

// GetFollowRequestsHandler gets pending follow requests
func GetFollowRequestsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	// Get pending follow requests - FIXED: removed database parameter
	requests, err := db.GetPendingFollowRequests(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch follow requests")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"follow_requests": requests,
	})
}

// GetFollowersHandler gets user's followers
func GetFollowersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userIDStr := r.URL.Query().Get("user_id")
	if userIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "user_id is required")
		return
	}

	targetUserID, err := strconv.Atoi(userIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid user_id")
		return
	}

	// Get followers - FIXED: removed database parameter
	followers, err := db.GetFollowers(targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch followers")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"followers": followers,
	})
}

// GetFollowingHandler gets users that someone is following
func GetFollowingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userIDStr := r.URL.Query().Get("user_id")
	if userIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "user_id is required")
		return
	}

	targetUserID, err := strconv.Atoi(userIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid user_id")
		return
	}

	// Get following - FIXED: removed database parameter
	following, err := db.GetFollowing(targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch following")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"following": following,
	})
}

// GetFollowStatusHandler gets follow relationship status
func GetFollowStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	currentUserID := r.Context().Value(userIDKey).(int)
	targetUserIDStr := r.URL.Query().Get("user_id")
	if targetUserIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "user_id is required")
		return
	}

	targetUserID, err := strconv.Atoi(targetUserIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid user_id")
		return
	}

	// Check if following - FIXED: removed database parameter
	isFollowing, err := db.IsFollowing(currentUserID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	// Check if there's a pending request - FIXED: removed database parameter
	hasPendingRequest, err := db.HasPendingFollowRequest(currentUserID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	// Get user privacy setting - FIXED: removed database parameter
	isPrivate, err := db.GetUserPrivacySetting(targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	status := "not_following"
	if isFollowing {
		status = "following"
	} else if hasPendingRequest {
		status = "pending"
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"follow_status":       status,
		"is_following":        isFollowing,
		"has_pending_request": hasPendingRequest,
		"target_is_private":   isPrivate,
	})
}
