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

	database := sqlite.GetDB()

	// Check if already following
	isFollowing, err := db.IsFollowing(database, userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if isFollowing {
		utils.Fail(w, http.StatusBadRequest, "Already following this user")
		return
	}

	// Check if there's already a pending request
	hasPendingRequest, err := db.HasPendingFollowRequest(database, userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if hasPendingRequest {
		utils.Fail(w, http.StatusBadRequest, "Follow request already sent")
		return
	}

	// Check if target user is private
	isPrivate, err := db.GetUserPrivacySetting(database, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if isPrivate {
		// Send follow request for private users
		err = db.CreateFollowRequest(database, userID, targetUserID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Failed to send follow request")
			return
		}
		utils.Success(w, http.StatusOK, map[string]interface{}{
			"message": "Follow request sent",
			"status":  "pending",
		})
	} else {
		// Directly follow public users
		err = db.CreateFollowRelationship(database, userID, targetUserID)
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

// UnfollowUserHandler handles unfollowing users
func UnfollowUserHandler(w http.ResponseWriter, r *http.Request) {
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

	database := sqlite.GetDB()

	// Check if actually following
	isFollowing, err := db.IsFollowing(database, userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	if !isFollowing {
		utils.Fail(w, http.StatusBadRequest, "Not following this user")
		return
	}

	// Unfollow the user
	err = db.DeleteFollowRelationship(database, userID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to unfollow user")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message": "Successfully unfollowed user",
	})
}

// RespondToFollowRequestHandler handles accepting/declining follow requests
func RespondToFollowRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get current user ID from context
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

	database := sqlite.GetDB()

	// Get the follow request to verify it belongs to the current user
	var requesterID, requesteeID int
	var status string
	query := `SELECT requester_id, requestee_id, status FROM follow_requests WHERE id = ?`
	err = database.QueryRow(query, requestID).Scan(&requesterID, &requesteeID, &status)
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

	// Update the request status
	newStatus := "declined"
	if action == "accept" {
		newStatus = "accepted"
	}

	err = db.UpdateFollowRequestStatus(database, requestID, newStatus)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update request status")
		return
	}

	// If accepted, create the follow relationship
	if action == "accept" {
		err = db.CreateFollowRelationship(database, requesterID, requesteeID)
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

// GetFollowRequestsHandler gets pending follow requests for the current user
func GetFollowRequestsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get current user ID from context
	userID := r.Context().Value(userIDKey).(int)

	database := sqlite.GetDB()

	// Get pending follow requests
	requests, err := db.GetPendingFollowRequests(database, userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch follow requests")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"follow_requests": requests,
	})
}

// GetFollowersHandler gets followers of a user
func GetFollowersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get target user ID from query params
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

	database := sqlite.GetDB()

	// Get followers
	followers, err := db.GetFollowers(database, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch followers")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"followers": followers,
	})
}

// GetFollowingHandler gets users that a user is following
func GetFollowingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get target user ID from query params
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

	database := sqlite.GetDB()

	// Get following
	following, err := db.GetFollowing(database, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch following")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"following": following,
	})
}

// GetFollowStatusHandler checks follow status between current user and target user
func GetFollowStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get current user ID from context
	currentUserID := r.Context().Value(userIDKey).(int)

	// Get target user ID from query params
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

	database := sqlite.GetDB()

	// Check if following
	isFollowing, err := db.IsFollowing(database, currentUserID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	// Check if there's a pending request
	hasPendingRequest, err := db.HasPendingFollowRequest(database, currentUserID, targetUserID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Database error")
		return
	}

	// Get user privacy setting
	isPrivate, err := db.GetUserPrivacySetting(database, targetUserID)
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
