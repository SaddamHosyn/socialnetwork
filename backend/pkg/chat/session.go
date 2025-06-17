package chat

import (
	"database/sql"
	"errors"
	"log"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

func CurrentUser(path, val string) (models.User, error) {
	query, err := sqlite.GetDB().Query(`
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
