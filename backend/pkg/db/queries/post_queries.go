package db

import (
	"database/sql"
	"errors"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
	"strings"
)

func BeginTx() (*sql.Tx, error) {
	return sqlite.GetDB().Begin()
}

func InsertPost(tx *sql.Tx, userID int, title, content string) (int64, error) {
	res, err := tx.Exec(`INSERT INTO posts(user_id, title, content) VALUES(?,?,?)`, userID, title, content)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func AddPostImage(tx *sql.Tx, postID int64, path string, pos int) error {
	_, err := tx.Exec(`INSERT INTO post_images(post_id, image_path, position) VALUES(?,?,?)`, postID, path, pos)
	return err
}

func LinkPostCategory(tx *sql.Tx, postID int64, catID int) error {
	_, err := tx.Exec(`INSERT INTO post_categories(post_id, category_id) VALUES(?,?)`, postID, catID)
	return err
}

func IsPostOwner(userID, postID int) (bool, error) {
	var owner int
	err := sqlite.GetDB().QueryRow("SELECT user_id FROM posts WHERE id = ?", postID).Scan(&owner)
	if err == sql.ErrNoRows {
		return false, errors.New("not found")
	} else if err != nil {
		return false, err
	}
	return owner == userID, nil
}

func DeletePost(postID int) error {
	_, err := sqlite.GetDB().Exec("DELETE FROM posts WHERE id = ?", postID)
	return err
}

func GetPostsFeed(currentUserID, categoryID, limit, offset int) ([]models.Post, error) {
	const sqlQuery = `
SELECT 
  p.id, p.user_id, u.nickname, p.title, p.content, p.created_at,
  COALESCE(v.total_votes, 0) AS votes,
  COALESCE(uv.user_vote, 0) AS user_vote,
  GROUP_CONCAT(DISTINCT c.name) AS cats,
  GROUP_CONCAT(pi.image_path) AS image_paths
FROM posts p
LEFT JOIN post_images pi ON pi.post_id = p.id
JOIN users u ON u.id = p.user_id
LEFT JOIN (
  SELECT post_id, SUM(vote_type) AS total_votes 
  FROM votes 
  WHERE post_id IS NOT NULL 
  GROUP BY post_id
) v ON v.post_id = p.id
LEFT JOIN (
  SELECT post_id, vote_type AS user_vote 
  FROM votes 
  WHERE user_id = ? AND post_id IS NOT NULL
) uv ON uv.post_id = p.id
LEFT JOIN post_categories pc ON pc.post_id = p.id
LEFT JOIN categories c ON c.id = pc.category_id
WHERE ? = 0 OR EXISTS (
  SELECT 1 FROM post_categories pc2 
  WHERE pc2.post_id = p.id AND pc2.category_id = ?
)
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;`

	rows, err := sqlite.GetDB().Query(
		sqlQuery,
		currentUserID,
		categoryID,
		categoryID,
		limit,
		offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var catNames, extraImages sql.NullString
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Nickname, &p.Title, &p.Content,
			&p.CreatedAt, &p.Votes, &p.UserVote, &catNames, &extraImages,
		); err != nil {
			continue
		}
		if extraImages.Valid && extraImages.String != "" {
			p.ImagePaths = strings.Split(extraImages.String, ",")
		} else {
			p.ImagePaths = []string{}
		}
		if catNames.Valid && catNames.String != "" {
			p.Categories = strings.Split(catNames.String, ",")
		} else {
			p.Categories = []string{}
		}
		posts = append(posts, p)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return posts, nil
}

func GetPostByID(postID int) (models.Post, error) {
	var post models.Post
	var catNames sql.NullString
	err := sqlite.GetDB().QueryRow(
		`SELECT p.id, p.user_id, u.nickname, p.title, p.content, p.created_at,
           IFNULL(GROUP_CONCAT(DISTINCT c.name), '') AS cats
         FROM posts p
         JOIN users u ON p.user_id = u.id
         LEFT JOIN post_categories pc ON pc.post_id = p.id
         LEFT JOIN categories c ON c.id = pc.category_id
         WHERE p.id = ?
         GROUP BY p.id`,
		postID,
	).Scan(
		&post.ID, &post.UserID, &post.Nickname, &post.Title,
		&post.Content, &post.CreatedAt, &catNames,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return post, errors.New("not found")
		}
		return post, err
	}
	if catNames.Valid && catNames.String != "" {
		post.Categories = strings.Split(catNames.String, ",")
	}

	// fetch extra images
	rows, err := sqlite.GetDB().Query(`SELECT image_path FROM post_images WHERE post_id = ? ORDER BY position`, postID)
	if err != nil {
		return post, err
	}
	defer rows.Close()

	post.ImagePaths = []string{}
	for rows.Next() {
		var img string
		if err := rows.Scan(&img); err != nil {
			continue
		}
		post.ImagePaths = append(post.ImagePaths, img)
	}
	return post, nil
}
