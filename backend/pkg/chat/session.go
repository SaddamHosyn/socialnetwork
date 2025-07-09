package chat

import (
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

func CurrentUser(val string) (models.User, error) {
	row := sqlite.GetDB().QueryRow(`
		SELECT users.id, users.nickname, users.first_name, users.last_name, users.gender, users.email 
		FROM sessions 
		INNER JOIN users ON sessions.user_id = users.id 
		WHERE sessions.token = ?`, val)

	var user models.User
	err := row.Scan(&user.ID, &user.Nickname, &user.FirstName, &user.LastName, &user.Gender, &user.Email)
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}
