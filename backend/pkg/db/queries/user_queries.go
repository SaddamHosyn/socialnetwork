package db

import (
	"database/sql"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
	"strings"
	"time"
)

func GetChatUserList(currentUserID int, threshold time.Time) ([]models.PublicUser, error) {
	rows, err := sqlite.GetDB().Query(`
        SELECT DISTINCT u.id, u.nickname, u.last_active_at
        FROM users u
        LEFT JOIN (
            SELECT 
                CASE 
                    WHEN sender_id = ? THEN receiver_id 
                    ELSE sender_id 
                END AS other_user_id,
                MAX(sent_at) AS last_message_at
            FROM messages
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY other_user_id
        ) m ON u.id = m.other_user_id
        WHERE u.id != ?
        ORDER BY 
            CASE 
                WHEN m.last_message_at IS NOT NULL THEN 0 
                ELSE 1 
            END,
            m.last_message_at DESC,
            u.nickname;
    `, currentUserID, currentUserID, currentUserID, currentUserID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.PublicUser
	for rows.Next() {
		var user models.PublicUser
		var lastActive sql.NullTime
		if err := rows.Scan(&user.ID, &user.Nickname, &lastActive); err != nil {
			continue
		}
		user.Online = lastActive.Valid && lastActive.Time.After(threshold)
		users = append(users, user)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return users, nil
}

func GetUserBySessionToken(token string) (models.User, error) {
	var user models.User
	err := sqlite.GetDB().QueryRow(`
        SELECT id, nickname, first_name, last_name, gender, email
        FROM users
        INNER JOIN sessions ON sessions.user_id = users.id
        WHERE sessions.token = ?`, token,
	).Scan(&user.ID, &user.Nickname, &user.FirstName, &user.LastName, &user.Gender, &user.Email)
	if err != nil {
		return user, err
	}
	return user, nil
}

func GetUserProfileInfo(userID int) (models.User, int, error) {
	var user models.User
	var genderID int
	err := sqlite.GetDB().QueryRow(`
        SELECT id, nickname, first_name, last_name, date_of_birth, gender, email
        FROM users WHERE id = ?`, userID,
	).Scan(&user.ID, &user.Nickname, &user.FirstName, &user.LastName, &user.DateOfBirth, &genderID, &user.Email)
	if err != nil {
		return user, 0, err
	}
	return user, genderID, nil
}

func GetUserProfile(userID int) (models.UserProfile, error) {
	var profile models.UserProfile
	err := sqlite.GetDB().QueryRow(`
        SELECT id, nickname, first_name, last_name, date_of_birth, gender, email
        FROM users WHERE id = ?`, userID,
	).Scan(
		&profile.User.ID,
		&profile.User.Nickname,
		&profile.User.FirstName,
		&profile.User.LastName,
		&profile.User.DateOfBirth,
		&profile.User.Gender,
		&profile.User.Email,
	)
	return profile, err
}

func GetPostsByUser(userID int, nick string) ([]models.Post, error) {
	rows, err := sqlite.GetDB().Query(`
      SELECT p.id, p.title, p.content, p.created_at,
             COALESCE(SUM(v.vote_type),0)  AS votes,
             IFNULL(GROUP_CONCAT(DISTINCT c.name), '') AS categories
        FROM posts p
        LEFT JOIN votes v   ON v.post_id = p.id
        LEFT JOIN post_categories pc ON pc.post_id = p.id
        LEFT JOIN categories c ON c.id = pc.category_id
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		var cats sql.NullString
		if err := rows.Scan(
			&p.ID, &p.Title, &p.Content, &p.CreatedAt,
			&p.Votes, &cats,
		); err != nil {
			continue
		}
		p.UserID = userID
		p.Nickname = nick
		if cats.Valid && cats.String != "" {
			p.Categories = strings.Split(cats.String, ",")
		}
		p.ImagePaths = []string{}
		// Fetch extra images
		imgRows, err := sqlite.GetDB().Query(`SELECT image_path FROM post_images WHERE post_id = ? ORDER BY position`, p.ID)
		if err == nil {
			defer imgRows.Close()
			for imgRows.Next() {
				var extra string
				if err := imgRows.Scan(&extra); err == nil {
					p.ImagePaths = append(p.ImagePaths, extra)
				}
			}
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func GetCommentsByUser(userID int, nick string) ([]models.Comment, error) {
	rows, err := sqlite.GetDB().Query(`
      SELECT c.id, c.post_id, c.content, c.created_at, COALESCE(SUM(v.vote_type),0) AS votes
      FROM comments c
      LEFT JOIN votes v ON v.comment_id = c.id
      WHERE c.user_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var c models.Comment
		if err := rows.Scan(&c.ID, &c.PostID, &c.Content, &c.CreatedAt, &c.Votes); err != nil {
			continue
		}
		c.UserID = userID
		c.Nickname = nick
		comments = append(comments, c)
	}
	return comments, rows.Err()
}
