package backend

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"time"
)

type contextKey string

const (
    userIDKey      contextKey = "userID"
    sessionTokenKey contextKey = "sessionToken"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_token")
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var userID int
		var expiresAtStr string
		err = db.QueryRow(
			"SELECT user_id, expires_at FROM sessions WHERE token = ?",
			cookie.Value,
		).Scan(&userID, &expiresAtStr)

		if err == sql.ErrNoRows {
			http.SetCookie(w, &http.Cookie{
				Name:     "session_token",
				Value:    "",
				Expires:  time.Unix(0, 0),
				Path:     "/",
				HttpOnly: true,
			})
			http.Error(w, "Invalid session", http.StatusUnauthorized)
			return
		} else if err != nil {
			log.Printf("Auth DB lookup error: %v", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}

		expiresAt, err := time.Parse(time.RFC3339, expiresAtStr)
		if err != nil || time.Now().After(expiresAt) {
			db.Exec("DELETE FROM sessions WHERE token = ?", cookie.Value)
			http.Error(w, "Session expired", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userIDKey, userID)
		ctx = context.WithValue(ctx, sessionTokenKey, cookie.Value)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Heartbeat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	userID := r.Context().Value(userIDKey).(int)
	if _, err := db.Exec(
		`UPDATE users SET last_active_at = ? WHERE id = ?`,
		time.Now().UTC(), userID,
	); err != nil {
		log.Printf("Heartbeat update error for user %d: %v", userID, err)
	}
	success(w, http.StatusOK, nil)
}

func MeHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey).(int)

	var profile UserProfile
	err := db.QueryRow(`
        SELECT id, nickname, first_name, last_name, age, gender, email
        FROM users WHERE id = ?`,
		userID,
	).Scan(
		&profile.User.ID,
		&profile.User.Nickname,
		&profile.User.FirstName,
		&profile.User.LastName,
		&profile.User.Age,
		&profile.User.Gender,
		&profile.User.Email,
	)
	if err != nil {
		log.Printf("Profile fetch error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	success(w, http.StatusOK, profile)
}
