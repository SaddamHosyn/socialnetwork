package handlers

import (
	"context"
	"database/sql"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
	"time"
)

type contextKey string

const (
	userIDKey       contextKey = "userID"
	sessionTokenKey contextKey = "sessionToken"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request - use application/x-www-form-urlencoded")
		return
	}

	nickname := strings.ToLower(strings.TrimSpace(r.FormValue("nickname")))
	email := strings.ToLower(strings.TrimSpace(r.FormValue("email")))
	password := strings.TrimSpace(r.FormValue("password"))
	firstName := strings.TrimSpace(r.FormValue("first_name"))
	lastName := strings.TrimSpace(r.FormValue("last_name"))
	dateOfBirth := strings.TrimSpace(r.FormValue("date_of_birth"))
	genderStr := r.FormValue("gender")

	dob, err := time.Parse("2006-01-02", dateOfBirth)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid date format (YYYY-MM-DD)")
		return
	}

	genderInt, err := strconv.Atoi(genderStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid gender format")
		return
	}

	if validationErr := utils.ValidateRegister(nickname, email, password, firstName, lastName, dob, genderInt); validationErr != nil {
		utils.Fail(w, http.StatusBadRequest, validationErr.Message)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error: password")
		return
	}

	err = db.RegisterUser(nickname, email, string(hashedPassword), firstName, lastName, dob, genderInt)
	if err != nil {
		log.Printf("REGISTER ERROR: %v", err)
		if strings.Contains(err.Error(), "UNIQUE constraint") {
			utils.Fail(w, http.StatusConflict, "Nickname or email already taken")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	utils.Success(w, http.StatusCreated, map[string]string{
		"message": "User registered successfully",
	})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request - use application/x-www-form-urlencoded")
		return
	}

	login := strings.TrimSpace(r.FormValue("login"))
	password := strings.TrimSpace(r.FormValue("password"))

	if validationErr := utils.ValidateLogin(login, password); validationErr != nil {
		utils.Fail(w, http.StatusBadRequest, validationErr.Message)
		return
	}

	userID, storedHash, err := db.GetLoginCredentials(login)
	if err == sql.ErrNoRows || bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password)) != nil {
		utils.Fail(w, http.StatusUnauthorized, "Invalid credentials")
		return
	} else if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	_ = db.UpdateUserLastActive(userID)

	token := uuid.New().String()
	expiresAt := time.Now().UTC().Add(7 * 24 * time.Hour)
	if err := db.InsertSession(userID, token, expiresAt); err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error: session create failed")
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

	utils.Success(w, http.StatusOK, map[string]any{
		"message": "Logged in successfully",
		"user_id": userID,
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	token := r.Context().Value(sessionTokenKey).(string)

	_ = db.SetUserInactive(userID)

	if err := db.DeleteSessionByToken(token); err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error: couldn't delete session")
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

	utils.Success(w, http.StatusOK, "Logged out successfully")
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_token")
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userID, expiresAtStr, err := db.GetSessionInfo(cookie.Value)
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
			db.DeleteSessionByToken(cookie.Value)
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
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	userID := r.Context().Value(userIDKey).(int)
	_ = db.UpdateUserLastActive(userID)
	utils.Success(w, http.StatusOK, nil)
}

func MeHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey).(int)
	profile, err := db.GetUserProfile(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	utils.Success(w, http.StatusOK, profile)
}
