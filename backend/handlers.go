package backend

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func SetDB(database *sql.DB) {
	if database == nil {
		log.Fatal("Database connection is nil")
	}
	db = database
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		log.Printf("Form parse error: %v", err)
		fail(w, http.StatusBadRequest, "Bad request - use application/x-www-form-urlencoded")
		return
	}

	nickname := strings.ToLower(strings.TrimSpace(r.FormValue("nickname")))
	email := strings.ToLower(strings.TrimSpace(r.FormValue("email")))
	password := strings.TrimSpace(r.FormValue("password"))
	firstName := strings.TrimSpace(r.FormValue("first_name"))
	lastName := strings.TrimSpace(r.FormValue("last_name"))
	ageStr := r.FormValue("age")
	genderStr := r.FormValue("gender")

	ageInt, err := strconv.Atoi(ageStr)
	if err != nil {
		fail(w, http.StatusBadRequest, "Invalid age format")
		return
	}

	genderInt, err := strconv.Atoi(genderStr)
	if err != nil {
		fail(w, http.StatusBadRequest, "Invalid gender format")
		return
	}

	if validationErr := ValidateRegister(nickname, email, password, firstName, lastName, ageInt, genderInt); validationErr != nil {
		fail(w, http.StatusBadRequest, validationErr.Message)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Password hashing error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error: password")
		return
	}

	_, err = db.Exec(`
        INSERT INTO users (nickname, email, password, age, gender, first_name, last_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
		nickname, email, hashedPassword, ageInt, genderInt, firstName, lastName)

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint") {
			fail(w, http.StatusConflict, "Nickname or email already taken")
		} else {
			log.Printf("DB insert error: %v", err)
			fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	success(w, http.StatusCreated, map[string]string{
		"message": "User registered successfully",
	})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		log.Printf("Form parse error: %v", err)
		fail(w, http.StatusBadRequest, "Bad request - use application/x-www-form-urlencoded")
		return
	}

	login := strings.TrimSpace(r.FormValue("login"))
	password := strings.TrimSpace(r.FormValue("password"))

	if validationErr := ValidateLogin(login, password); validationErr != nil {
		fail(w, http.StatusBadRequest, validationErr.Message)
		return
	}

	var storedHash string
	var userID int
	err = db.QueryRow(`
        SELECT id, password FROM users 
        WHERE nickname = ? OR email = LOWER(?)`,
		login, login).Scan(&userID, &storedHash)

	if err == sql.ErrNoRows || bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password)) != nil {
		fail(w, http.StatusUnauthorized, "Invalid credentials")
		return
	} else if err != nil {
		log.Printf("DB query error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	_, err = db.Exec("UPDATE users SET last_active_at = ? WHERE id = ?", time.Now().UTC(), userID)
	if err != nil {
		log.Printf("Failed to update user status for %d: %v", userID, err)
	}

	token := uuid.New().String()
	expiresAt := time.Now().UTC().Add(7 * 24 * time.Hour)
	_, err = db.Exec(`
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)`,
		userID, token, expiresAt.Format(time.RFC3339))

	if err != nil {
		log.Printf("Session insert error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error: session create failed")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Expires:  expiresAt,
		HttpOnly: true,
		Secure:   true,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
	})

	success(w, http.StatusOK, map[string]any{
		"message": "Logged in successfully",
		"user_id": userID,
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	token := r.Context().Value(sessionTokenKey).(string)

	// Update user status
	_, err := db.Exec("UPDATE users SET last_active_at = NULL WHERE id = ?", userID)
	if err != nil {
		log.Printf("User status update error on logout for user %d: %v", userID, err)
	}

	_, err = db.Exec("DELETE FROM sessions WHERE token = ?", token)
	if err != nil {
		log.Printf("Session delete error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error: couldn't delete session")
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
	})

	success(w, http.StatusOK, "Logged out successfully")
}

func PostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// parse both fields and files
	if err := r.ParseMultipartForm(50 << 20); err != nil {
		fail(w, http.StatusBadRequest, "Invalid form data")
		return
	}

	uid := r.Context().Value(userIDKey).(int)
	title := strings.TrimSpace(r.FormValue("title"))
	content := strings.TrimSpace(r.FormValue("content"))
	cats := r.Form["category"]

	if verr := ValidatePost(title, content, cats); verr != nil {
		fail(w, http.StatusBadRequest, verr.Message)
		return
	}

	files := r.MultipartForm.File["images"]
	if len(files) < 1 {
		fail(w, http.StatusBadRequest, "At least one image is required")
		return
	}
	if len(files) > 5 {
		fail(w, http.StatusBadRequest, "Max 5 images per post")
		return
	}

	tx, err := db.Begin()
	if err != nil {
		log.Printf("tx begin error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer tx.Rollback()

	res, err := tx.Exec(
		`INSERT INTO posts(user_id, title, content, image_path) VALUES(?,?,?,?)`,
		uid, title, content, "",
	)
	if err != nil {
		log.Printf("post insert error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error creating post")
		return
	}
	postID, err := res.LastInsertId()
	if err != nil {
		log.Printf("postID error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	// 1) cover image
	coverPath, verr := saveUploadFile(files[0])
	if verr != nil {
		fail(w, http.StatusBadRequest, verr.Message)
		return
	}
	if _, err := tx.Exec(
		`UPDATE posts SET image_path = ? WHERE id = ?`,
		coverPath, postID,
	); err != nil {
		log.Printf("update cover error: %v", err)
		fail(w, http.StatusInternalServerError, "Couldn't set cover image")
		return
	}

	// 2) extra images
	for idx, fh := range files[1:] {
		imgPath, verr := saveUploadFile(fh)
		if verr != nil {
			fail(w, http.StatusBadRequest, verr.Message)
			return
		}
		if _, err := tx.Exec(
			`INSERT INTO post_images(post_id, image_path, position) VALUES(?,?,?)`,
			postID, imgPath, idx+1,
		); err != nil {
			log.Printf("image link error: %v", err)
			fail(w, http.StatusInternalServerError, "Server error linking images")
			return
		}
	}

	// link categories
	for _, cid := range cats {
		id, err := strconv.Atoi(cid)
		if err != nil {
			fail(w, http.StatusBadRequest, "Invalid category ID")
			return
		}
		if _, err := tx.Exec(
			`INSERT INTO post_categories(post_id, category_id) VALUES(?,?)`, postID, id,
		); err != nil {
			log.Printf("cat link error: %v", err)
			fail(w, http.StatusInternalServerError, "Server error linking category")
			return
		}
	}

	if err := tx.Commit(); err != nil {
		log.Printf("tx commit error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error saving post")
		return
	}

	success(w, http.StatusCreated, map[string]any{"message": "Post created successfully", "post_id": postID})
}

func CommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}
	content := strings.TrimSpace(r.FormValue("content"))
	if ve := ValidateComment(content); ve != nil {
		fail(w, http.StatusBadRequest, ve.Message)
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	if _, err := db.Exec(
		`INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`,
		postID, userID, content,
	); err != nil {
		log.Printf("Comment insert error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	success(w, http.StatusCreated, map[string]string{"message": "Comment posted"})
}

func VoteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	postIDStr := r.FormValue("post_id")
	commentIDStr := r.FormValue("comment_id")
	voteStr := r.FormValue("vote")

	voteType, err := strconv.Atoi(voteStr)
	if err != nil || (voteType != 1 && voteType != -1) {
		fail(w, http.StatusBadRequest, "Invalid vote type")
		return
	}

	var postID, commentID int
	if postIDStr != "" {
		postID, err = strconv.Atoi(postIDStr)
		if err != nil {
			fail(w, http.StatusBadRequest, "Invalid post ID")
			return
		}
	} else if commentIDStr != "" {
		commentID, err = strconv.Atoi(commentIDStr)
		if err != nil {
			fail(w, http.StatusBadRequest, "Invalid comment ID")
			return
		}
	} else {
		fail(w, http.StatusBadRequest, "Vote must target a post or comment")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	var existingVote int
	query := "SELECT vote_type FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?"
	err = db.QueryRow(query, userID, nullInt(postID), nullInt(commentID)).Scan(&existingVote)

	if err == sql.ErrNoRows {
		_, err = db.Exec(`
			INSERT INTO votes (user_id, post_id, comment_id, vote_type)
			VALUES (?, ?, ?, ?)`,
			userID, nullInt(postID), nullInt(commentID), voteType)
	} else if err == nil {
		if existingVote == voteType {
			_, err = db.Exec(`
				DELETE FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				userID, nullInt(postID), nullInt(commentID))
		} else {
			_, err = db.Exec(`
				UPDATE votes SET vote_type = ? WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				voteType, userID, nullInt(postID), nullInt(commentID))
		}
	}

	if err != nil {
		log.Printf("Vote error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	success(w, http.StatusOK, nil)
}

func nullInt(v int) any {
	if v == 0 {
		return nil
	}

	return v
}

// DeletePostHandler allows a user to delete their own post (and cascades to images, categories, comments).
func DeletePostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	// must be authenticated
	uid := r.Context().Value(userIDKey).(int)

	// parse JSON or form
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	// ensure user owns the post
	var owner int
	err = db.QueryRow("SELECT user_id FROM posts WHERE id = ?", postID).Scan(&owner)
	if err == sql.ErrNoRows {
		fail(w, http.StatusNotFound, "Post not found")
		return
	} else if err != nil {
		log.Printf("Lookup owner error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if owner != uid {
		fail(w, http.StatusForbidden, "Not allowed")
		return
	}

	// delete it (with foreign keys ON DELETE CASCADE you’ll automatically clear images/comments)
	if _, err := db.Exec("DELETE FROM posts WHERE id = ?", postID); err != nil {
		log.Printf("Delete post error: %v", err)
		fail(w, http.StatusInternalServerError, "Could not delete post")
		return
	}

	success(w, http.StatusOK, map[string]string{"message": "Post deleted"})
}

// DeleteCommentHandler lets a user delete their own comment
func DeleteCommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	uid := r.Context().Value(userIDKey).(int)
	commentID, err := strconv.Atoi(r.FormValue("comment_id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "Invalid comment ID")
		return
	}
	// check ownership
	var owner int
	err = db.QueryRow("SELECT user_id FROM comments WHERE id=?", commentID).Scan(&owner)
	if err == sql.ErrNoRows {
		fail(w, http.StatusNotFound, "Comment not found")
		return
	} else if err != nil {
		log.Printf("Lookup comment owner: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if owner != uid {
		fail(w, http.StatusForbidden, "Not allowed")
		return
	}
	if _, err := db.Exec("DELETE FROM comments WHERE id=?", commentID); err != nil {
		log.Printf("Delete comment error: %v", err)
		fail(w, http.StatusInternalServerError, "Could not delete comment")
		return
	}
	success(w, http.StatusOK, map[string]string{"message": "Comment deleted"})
}

func HandleChatRequest(w http.ResponseWriter, r *http.Request) {
	// get the session token
	cookie, err := r.Cookie("session_token")
	if err != nil {
		http.Error(w, "Missing session token", http.StatusUnauthorized)
		log.Println("Missing session token:", err)
		return
	}
	token := cookie.Value

	//get the current user
	user1, err := CurrentUser("forum.db", token)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Error getting current user:", err)
		return
	}

	// Get the other user's ID from the URL
	user2_id_str := r.URL.Query().Get("user")
	if user2_id_str == "" {
		http.Error(w, "Missing target user ID", http.StatusBadRequest)
		log.Println("No user ID in query")
		return
	}

	//convert to int
	user2_id, err := strconv.Atoi(user2_id_str)
	if err != nil {
		http.Error(w, "Invalid target user ID", http.StatusBadRequest)
		log.Println("Invalid user ID:", user2_id_str)
		return
	}

	// Check if the user is trying to chat with themselves
	if user1.ID == user2_id {
		http.Error(w, "Cannot chat with yourself", http.StatusBadRequest)
		log.Println("User tried to start chat with themselves")
		return
	}

	// Find or create the chat
	chatId, err := findOrCreateChat(user1.ID, user2_id)
	if err != nil {
		http.Error(w, "Error finding/creating chat", http.StatusInternalServerError)
		log.Println("Error in findOrCreateChat:", err)
		return
	}

	// in‑memory map whose keys are strings and whose values can be anything:
	response := map[string]interface{}{
		"success": true,
		"chatId":  chatId,
	}

	fmt.Println("Chat ID:", chatId)
	w.Header().Set("Content-Type", "application/json") // tells the client “we’re sending JSON”
	json.NewEncoder(w).Encode(response)                // creates a JSON encoder that writes directly to the HTTP response writer
}

// fetch(`/api/chat/history?receiverId=${receiverId}&limit=${limit}&offset=${offset}`
// GET /api/chat/history?receiverId=123
func HandleChatHistory(w http.ResponseWriter, r *http.Request) {
	limit := 10

	// get the session token
	cookie, err := r.Cookie("session_token")
	if err != nil {
		http.Error(w, "Missing session token", http.StatusUnauthorized)
		log.Println("Missing session token:", err)
		return
	}

	token := cookie.Value

	//get the current user
	user1, err := CurrentUser("forum.db", token)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Error getting current user:", err)
		return
	}

	// Get the other user's ID from the URL
	user2_id_str := r.URL.Query().Get("receiverId")
	if user2_id_str == "" {
		http.Error(w, "Missing target user ID", http.StatusBadRequest)
		log.Println("No user ID in query")
		return
	}
	user2, err := strconv.Atoi(user2_id_str)
	if err != nil {
		http.Error(w, "Wrong receiverId", http.StatusInternalServerError)
		log.Println("Error getting receiverId:", err)
		return
	}

	// Get the offset value from the URL
	offset_str := r.URL.Query().Get("offset")
	if offset_str == "" {
		offset_str = "0"
	}

	offset, err := strconv.Atoi(offset_str)
	if err != nil {
		http.Error(w, "Wrong offset value", http.StatusInternalServerError)
		log.Println("Error getting offset value:", err)
		return
	}

	messages, err := getMessages(user1.ID, user2, limit, offset) // query “SELECT sender_id, content, sent_at …”
	if err != nil {
		http.Error(w, "Failed to load history", 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"messages": messages,
	})
}
