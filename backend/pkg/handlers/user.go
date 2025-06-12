package backend

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
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
	case 3:
		gender = "Alien"
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
			ID        int    `json:"id"`
			Nickname  string `json:"nickname"`
			FirstName string `json:"first_name"`
			LastName  string `json:"last_name"`
			Age       int    `json:"age"`
			Gender    string `json:"gender"`
			Email     string `json:"email"`
		}{
			ID:        user.ID,
			Nickname:  user.Nickname,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Age:       user.Age,
			Gender:    gender,
			Email:     user.Email,
		},
		Posts:    posts,
		Comments: comments,
	}

	utils.Success(w, http.StatusOK, profile)
}

func CurrentUser(path, val string) (models.User, error) {
	query, err := db.Query(`
		SELECT users.id, users.nickname, users.first_name, users.last_name, users.gender, users.email 
		FROM sessions 
		INNER JOIN users ON sessions.user_id = users.id 
		WHERE sessions.token = ?`, val)
	if err != nil {
		return models.User{}, err
	}
	defer query.Close()

	users, err := ConvertRowToUser(query)
	if err != nil {
		return models.User{}, err
	}

	if len(users) == 0 {
		return models.User{}, errors.New("no users found")
	}

	return users[0], nil
}

// Convert the database row into a user struct
func ConvertRowToUser(rows *sql.Rows) ([]models.User, error) {
	var users []models.User

	for rows.Next() {
		var user models.User

		// Store the row data in the temporary user struct
		err := rows.Scan(
			&user.ID,
			&user.Nickname,
			&user.FirstName,
			&user.LastName,
			&user.Gender,
			&user.Email)

		if err != nil {
			log.Printf("Row scan error: %v", err)
			break
		}

		// Append the temporary user struct to the users slice
		users = append(users, user)
	}

	return users, nil
}
