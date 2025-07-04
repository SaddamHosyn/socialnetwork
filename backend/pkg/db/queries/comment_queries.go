package db

import (
	"database/sql"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

func InsertComment(postID, userID int, content string) (int, error) {
	var commentID int
	err := sqlite.GetDB().QueryRow(
		`INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?) RETURNING id`,
		postID, userID, content,
	).Scan(&commentID)
	return commentID, err
}

func IsCommentOwner(commentID, userID int) (bool, error) {
	var owner int
	err := sqlite.GetDB().QueryRow("SELECT user_id FROM comments WHERE id = ?", commentID).Scan(&owner)
	if err == sql.ErrNoRows {
		return false, sql.ErrNoRows
	}
	if err != nil {
		return false, err
	}
	return owner == userID, nil
}

func DeleteCommentByID(commentID int) error {
	_, err := sqlite.GetDB().Exec("DELETE FROM comments WHERE id = ?", commentID)
	return err
}

func GetCommentsByPost(postID, limit, offset int) ([]models.Comment, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT c.id, c.user_id, u.nickname, c.content, c.created_at,
			   COALESCE(SUM(v.vote_type),0) AS votes
		FROM comments c
		JOIN users u ON u.id = c.user_id
		LEFT JOIN votes v ON v.comment_id = c.id
		WHERE c.post_id = ?
		GROUP BY c.id
		ORDER BY c.created_at DESC
		LIMIT ? OFFSET ?`,
		postID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var c models.Comment
		if err := rows.Scan(&c.ID, &c.UserID, &c.Nickname, &c.Content, &c.CreatedAt, &c.Votes); err != nil {
			continue
		}
		comments = append(comments, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return comments, nil
}
