package db

import (
	"database/sql"
	"errors"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
	"strings"
	"time"
)

func BeginTx() (*sql.Tx, error) {
	return sqlite.GetDB().Begin()
}

func InsertPost(tx *sql.Tx, userID int, title, content string) (int64, error) {
	res, err := tx.Exec(`INSERT INTO posts(user_id, title, content, image_path) VALUES(?,?,?,?)`, userID, title, content, "")
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func SetPostCoverImage(tx *sql.Tx, postID int64, path string) error {
	_, err := tx.Exec(`UPDATE posts SET image_path = ? WHERE id = ?`, path, postID)
	return err
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
  p.id, p.user_id, u.nickname, p.title, p.content, 
  p.image_path, p.created_at,
  COALESCE(v.total_votes, 0) AS votes,
  COALESCE(uv.user_vote, 0) AS user_vote,
  GROUP_CONCAT(DISTINCT c.name) AS cats,
  GROUP_CONCAT(pi.image_path) AS extra_images
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
			&p.ImagePath, &p.CreatedAt, &p.Votes, &p.UserVote, &catNames, &extraImages,
		); err != nil {
			continue
		}
		p.ImagePaths = []string{p.ImagePath}
		if extraImages.Valid && extraImages.String != "" {
			p.ImagePaths = append(p.ImagePaths, strings.Split(extraImages.String, ",")...)
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
		`SELECT p.id, p.user_id, u.nickname, p.title, p.content, p.image_path, p.created_at,
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
		&post.Content, &post.ImagePath, &post.CreatedAt,
		&catNames,
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

	post.ImagePaths = []string{post.ImagePath}
	for rows.Next() {
		var img string
		if err := rows.Scan(&img); err != nil {
			continue
		}
		post.ImagePaths = append(post.ImagePaths, img)
	}
	return post, nil
}

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
		return cats, err // Return what you have, but note the error
	}
	return cats, nil
}

func nullInt(v int) any {
	if v == 0 {
		return nil
	}
	return v
}

func InsertVote(userID, postID, commentID, voteType int) error {
	var existingVote int
	query := "SELECT vote_type FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?"
	err := sqlite.GetDB().QueryRow(query, userID, nullInt(postID), nullInt(commentID)).Scan(&existingVote)

	if err == sql.ErrNoRows {
		_, err = sqlite.GetDB().Exec(
			`INSERT INTO votes (user_id, post_id, comment_id, vote_type)
             VALUES (?, ?, ?, ?)`,
			userID, nullInt(postID), nullInt(commentID), voteType)
		return err
	} else if err == nil {
		if existingVote == voteType {
			_, err = sqlite.GetDB().Exec(
				`DELETE FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				userID, nullInt(postID), nullInt(commentID))
		} else {
			_, err = sqlite.GetDB().Exec(
				`UPDATE votes SET vote_type = ? WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				voteType, userID, nullInt(postID), nullInt(commentID))
		}
		return err
	} else {
		return err
	}
}

func GetVoteSum(postID, commentID int) (int, error) {
	var total int
	var err error

	if postID != 0 {
		err = sqlite.GetDB().QueryRow("SELECT IFNULL(SUM(vote_type), 0) FROM votes WHERE post_id = ?", postID).Scan(&total)
	} else if commentID != 0 {
		err = sqlite.GetDB().QueryRow("SELECT IFNULL(SUM(vote_type), 0) FROM votes WHERE comment_id = ?", commentID).Scan(&total)
	} else {
		return 0, errors.New("invalid vote target")
	}

	return total, err
}

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
	var age int
	err := sqlite.GetDB().QueryRow(`
        SELECT id, nickname, first_name, last_name, age, gender, email
        FROM users WHERE id = ?`, userID,
	).Scan(&user.ID, &user.Nickname, &user.FirstName, &user.LastName, &age, &genderID, &user.Email)
	if err != nil {
		return user, 0, err
	}
	user.Age = age
	return user, genderID, nil
}

func GetUserProfile(userID int) (models.UserProfile, error) {
	var profile models.UserProfile
	err := sqlite.GetDB().QueryRow(`
        SELECT id, nickname, first_name, last_name, age, gender, email
        FROM users WHERE id = ?`, userID,
	).Scan(
		&profile.User.ID,
		&profile.User.Nickname,
		&profile.User.FirstName,
		&profile.User.LastName,
		&profile.User.Age,
		&profile.User.Gender,
		&profile.User.Email,
	)
	return profile, err
}

func GetPostsByUser(userID int, nick string) ([]models.Post, error) {
	rows, err := sqlite.GetDB().Query(`
      SELECT p.id, p.title, p.content, p.image_path, p.created_at,
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
			&p.ID, &p.Title, &p.Content, &p.ImagePath, &p.CreatedAt,
			&p.Votes, &cats,
		); err != nil {
			continue
		}
		p.UserID = userID
		p.Nickname = nick
		if cats.Valid && cats.String != "" {
			p.Categories = strings.Split(cats.String, ",")
		}
		p.ImagePaths = []string{p.ImagePath}
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

func InsertComment(postID, userID int, content string) error {
	_, err := sqlite.GetDB().Exec(
		`INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`,
		postID, userID, content,
	)
	return err
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

func RegisterUser(nickname, email, hashedPassword, firstName, lastName string, age, gender int) error {
	_, err := sqlite.GetDB().Exec(
		`INSERT INTO users (nickname, email, password, age, gender, first_name, last_name)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		nickname, email, hashedPassword, age, gender, firstName, lastName)
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

func FindOrCreateChat(userId, receivingUserId int) (int, error) {
	// Check if a chat already exists between the two users
	query := `
        SELECT id 
        FROM chats 
        WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
    `
	var chatId int
	err := sqlite.GetDB().QueryRow(query, userId, receivingUserId, receivingUserId, userId).Scan(&chatId)

	if err == nil {
		return chatId, nil
	} else if err == sql.ErrNoRows {
		// No chat found, create a new one
		insertQuery := `INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)`
		res, err := sqlite.GetDB().Exec(insertQuery, userId, receivingUserId)
		if err != nil {
			return 0, err
		}

		insertedId, err := res.LastInsertId()
		if err != nil {
			return 0, err
		}
		return int(insertedId), nil
	}

	return 0, err
}

func SaveMessage(msg models.Message) error {
	_, err := sqlite.GetDB().Exec(
		`INSERT INTO messages (sender_id, receiver_id, content, sent_at) VALUES (?, ?, ?, ?)`,
		msg.SenderID, msg.ReceiverID, msg.Message, msg.Time,
	)
	return err
}

func GetMessages(senderID, receiverID, limit, offset int) ([]models.Message, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT 
			m.id,
			m.sender_id,
			m.receiver_id,
			m.content,
			m.sent_at,
			us.nickname AS sender_nickname
		FROM messages m
		LEFT JOIN users us ON m.sender_id = us.id
		LEFT JOIN users ur ON m.receiver_id = ur.id
		WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
		ORDER BY m.sent_at DESC
		LIMIT ? OFFSET ?;
	`, senderID, receiverID, receiverID, senderID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var msg models.Message
		if err := rows.Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Message, &msg.Time, &msg.SenderName); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}
