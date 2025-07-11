package handlers

import (
	"database/sql"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/models"
	"social-network/backend/pkg/utils"
	"time"
)

func FetchUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	cookie, err := r.Cookie("session_token")
	if err != nil {
		utils.Fail(w, http.StatusUnauthorized, "Missing session token")
		return
	}

	currentUser, err := db.GetUserBySessionToken(cookie.Value)
	if err != nil {
		utils.Fail(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	threshold := time.Now().UTC().Add(-10 * time.Minute)
	users, err := db.GetChatUserList(currentUser.ID, threshold)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, users)
}

func FetchProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(userIDKey).(int)
	if !ok {
		utils.Fail(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Fetch user data using the corrected query function
	userFromDB, err := db.GetUserProfileInfo(userID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "User not found")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error fetching profile")
		}
		return
	}

	// Map genderID to string
	gender := "Unknown"
	switch userFromDB.GenderID {
	case 1:
		gender = "Male"
	case 2:
		gender = "Female"
	case 3:
		gender = "Alien"
	}

	// Convert the UserFromDB to a plain User struct for the JSON response.
	// This is where we handle the NULL values.
	userForJSON := models.User{
		ID:          userFromDB.ID,
		Email:       userFromDB.Email,
		FirstName:   userFromDB.FirstName,
		LastName:    userFromDB.LastName,
		DateOfBirth: userFromDB.DateOfBirth,
		Gender:      gender,
		// If Nickname is valid (not NULL), use its string value. Otherwise, use an empty string.
		Nickname: userFromDB.Nickname.String,
		Avatar:   userFromDB.Avatar.String,
		AboutMe:  userFromDB.AboutMe.String,
	}

	// The nickname passed to GetPostsByUser and GetCommentsByUser should also be the safe string.
	posts, err := db.GetPostsByUser(userID, userForJSON.Nickname)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch posts")
		return
	}

	comments, err := db.GetCommentsByUser(userID, userForJSON.Nickname)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch comments")
		return
	}

	// Get follower and following counts - FIXED: removed database parameter
	followerCount, err := db.GetFollowerCount(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch follower count")
		return
	}

	followingCount, err := db.GetFollowingCount(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch following count")
		return
	}

	// Build the final profile with the safe-for-JSON user struct
	profile := models.UserProfile{
		User:           userForJSON,
		Posts:          posts,
		Comments:       comments,
		FollowerCount:  followerCount,
		FollowingCount: followingCount,
	}

	utils.Success(w, http.StatusOK, profile)
}

func FetchAllUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	cookie, err := r.Cookie("session_token")
	if err != nil {
		utils.Fail(w, http.StatusUnauthorized, "Missing session token")
		return
	}

	currentUser, err := db.GetUserBySessionToken(cookie.Value)
	if err != nil {
		utils.Fail(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Get all users except the current user
	users, err := db.GetAllUsers(currentUser.ID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, users)
}

// UpdatePrivacyHandler handles privacy setting updates
func UpdatePrivacyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID, ok := r.Context().Value(userIDKey).(int)
	if !ok {
		utils.Fail(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Parse the privacy setting from form data
	privacyStr := r.FormValue("privacy")
	if privacyStr == "" {
		utils.Fail(w, http.StatusBadRequest, "Privacy setting is required")
		return
	}

	var isPrivate bool
	switch privacyStr {
	case "private":
		isPrivate = true
	case "public":
		isPrivate = false
	default:
		utils.Fail(w, http.StatusBadRequest, "Invalid privacy setting. Use 'public' or 'private'")
		return
	}

	// Update the user's privacy setting in the database
	err := db.UpdateUserPrivacy(userID, isPrivate)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update privacy setting")
		return
	}

	// Return success with the new privacy setting
	privacyStatus := "public"
	if isPrivate {
		privacyStatus = "private"
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message": "Privacy setting updated successfully",
		"privacy": privacyStatus,
	})
}
