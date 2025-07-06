package db

import (
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

func GetAllCategories() ([]models.Category, error) {
	rows, err := sqlite.GetDB().Query(`SELECT id, name FROM categories ORDER BY name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cats []models.Category
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name); err != nil {
			continue
		}
		cats = append(cats, c)
	}
	if err := rows.Err(); err != nil {
		return cats, err
	}
	return cats, nil
}
