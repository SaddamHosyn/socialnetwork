package db

import (
	"social-network/backend/pkg/db/sqlite"
	"time"
)

func RegisterUser(nickname, email, hashedPassword, firstName, lastName string, dob time.Time, gender int) error {
	_, err := sqlite.GetDB().Exec(
		`INSERT INTO users (nickname, email, password, date_of_birth, gender, first_name, last_name)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		nickname, email, hashedPassword, dob.Format("2006-01-02"), gender, firstName, lastName)
	return err
}

func GetLoginCredentials(login string) (int, string, error) {
	var userID int
	var storedHash string
	err := sqlite.GetDB().QueryRow(`
        SELECT id, password FROM users 
        WHERE nickname = ? OR email = LOWER(?)`,
		login, login).Scan(&userID, &storedHash)
	return userID, storedHash, err
}

func UpdateUserLastActive(userID int) error {
	_, err := sqlite.GetDB().Exec("UPDATE users SET last_active_at = ? WHERE id = ?", time.Now().UTC(), userID)
	return err
}

func InsertSession(userID int, token string, expiresAt time.Time) error {
	_, err := sqlite.GetDB().Exec(`
        INSERT INTO sessions (user_id, token, expires_at)
        VALUES (?, ?, ?)`,
		userID, token, expiresAt.Format(time.RFC3339))
	return err
}

func SetUserInactive(userID int) error {
	_, err := sqlite.GetDB().Exec("UPDATE users SET last_active_at = NULL WHERE id = ?", userID)
	return err
}

func DeleteSessionByToken(token string) error {
	_, err := sqlite.GetDB().Exec("DELETE FROM sessions WHERE token = ?", token)
	return err
}

func GetSessionInfo(token string) (int, string, error) {
	var userID int
	var expiresAt string
	err := sqlite.GetDB().QueryRow(
		"SELECT user_id, expires_at FROM sessions WHERE token = ?",
		token,
	).Scan(&userID, &expiresAt)
	return userID, expiresAt, err
}
