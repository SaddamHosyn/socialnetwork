package handlers

import (
	"database/sql"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
	"social-network/backend/pkg/utils"
	"strconv"
	"time"
)

func FetchUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	users, err := db.GetUsersWithFollowStatus(userID)
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

	user, genderID, err := db.GetUserProfileInfo(userID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "User not found")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	// Map genderID to string
	gender := "Unknown"
	switch genderID {
	case 1:
		gender = "Male"
	case 2:
		gender = "Female"
	}

	posts, err := db.GetPostsByUser(userID, user.Nickname)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch posts")
		return
	}

	comments, err := db.GetCommentsByUser(userID, user.Nickname)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch comments")
		return
	}

	profile := models.UserProfile{
		User: struct {
			ID          int       `json:"id"`
			Email       string    `json:"email"`
			FirstName   string    `json:"first_name"`
			LastName    string    `json:"last_name"`
			DateOfBirth time.Time `json:"date_of_birth"`
			Gender      string    `json:"gender"`
			Nickname    string    `json:"nickname"`
			Avatar      string    `json:"avatar"`
			AboutMe     string    `json:"about_me"`
			IsPrivate   bool      `json:"is_private"`
		}{
			ID:          user.ID,
			Email:       user.Email,
			FirstName:   user.FirstName,
			LastName:    user.LastName,
			DateOfBirth: user.DateOfBirth,
			Gender:      gender,
			Nickname:    user.Nickname,
			Avatar:      user.Avatar,
			AboutMe:     user.AboutMe,
			IsPrivate:   user.IsPrivate,
		},
		Posts:    posts,
		Comments: comments,
	}

	utils.Success(w, http.StatusOK, profile)
}

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

	if err := r.ParseForm(); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	isPrivateStr := r.FormValue("is_private")
	if isPrivateStr != "0" && isPrivateStr != "1" {
		utils.Fail(w, http.StatusBadRequest, "Invalid privacy setting")
		return
	}

	isPrivate := isPrivateStr == "1"

	err := db.UpdateUserPrivacy(userID, isPrivate)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to update privacy settings")
		return
	}

	utils.Success(w, http.StatusOK, map[string]interface{}{
		"message":    "Privacy settings updated successfully",
		"is_private": isPrivate,
	})
}

func DiscoverUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	users, err := db.GetUsersWithFollowStatus(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, users)
}

func FetchUserProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get current user ID from context
	currentUserID, ok := r.Context().Value(userIDKey).(int)
	if !ok {
		utils.Fail(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

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

	// Get the target user's profile info
	user, genderID, err := db.GetUserProfileInfo(targetUserID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "User not found")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	// Map genderID to string
	gender := "Unknown"
	switch genderID {
	case 1:
		gender = "Male"
	case 2:
		gender = "Female"
	case 3:
		gender = "Alien"
	}

	// Check if the target user's profile is private
	if user.IsPrivate && currentUserID != targetUserID {
		// Check if current user is following target user
		isFollowing, err := db.IsFollowing(sqlite.GetDB(), currentUserID, targetUserID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Database error")
			return
		}

		if !isFollowing {
			// Return limited profile info for private users not being followed
			profile := models.UserProfile{
				User: struct {
					ID          int       `json:"id"`
					Email       string    `json:"email"`
					FirstName   string    `json:"first_name"`
					LastName    string    `json:"last_name"`
					DateOfBirth time.Time `json:"date_of_birth"`
					Gender      string    `json:"gender"`
					Nickname    string    `json:"nickname"`
					Avatar      string    `json:"avatar"`
					AboutMe     string    `json:"about_me"`
					IsPrivate   bool      `json:"is_private"`
				}{
					ID:        user.ID,
					Nickname:  user.Nickname,
					Avatar:    user.Avatar,
					IsPrivate: user.IsPrivate,
					// Don't show other sensitive info for private profiles
				},
				Posts:    []models.Post{},
				Comments: []models.Comment{},
			}
			utils.Success(w, http.StatusOK, profile)
			return
		}
	}

	// Get posts for the user (full access if public or following)
	posts, err := db.GetPostsByUser(targetUserID, user.Nickname)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch posts")
		return
	}

	comments, err := db.GetCommentsByUser(targetUserID, user.Nickname)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Failed to fetch comments")
		return
	}

	profile := models.UserProfile{
		User: struct {
			ID          int       `json:"id"`
			Email       string    `json:"email"`
			FirstName   string    `json:"first_name"`
			LastName    string    `json:"last_name"`
			DateOfBirth time.Time `json:"date_of_birth"`
			Gender      string    `json:"gender"`
			Nickname    string    `json:"nickname"`
			Avatar      string    `json:"avatar"`
			AboutMe     string    `json:"about_me"`
			IsPrivate   bool      `json:"is_private"`
		}{
			ID:          user.ID,
			Email:       user.Email,
			FirstName:   user.FirstName,
			LastName:    user.LastName,
			DateOfBirth: user.DateOfBirth,
			Gender:      gender,
			Nickname:    user.Nickname,
			Avatar:      user.Avatar,
			AboutMe:     user.AboutMe,
			IsPrivate:   user.IsPrivate,
		},
		Posts:    posts,
		Comments: comments,
	}

	utils.Success(w, http.StatusOK, profile)
}
