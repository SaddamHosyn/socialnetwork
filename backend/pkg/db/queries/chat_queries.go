package db

import (
	"database/sql"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

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

// Group Chat Functions

// SaveGroupMessage saves a message to a group chat and returns the message ID
func SaveGroupMessage(groupID, userID int, content string) (int64, error) {
	result, err := sqlite.GetDB().Exec(`
		INSERT INTO group_messages (group_id, user_id, content) 
		VALUES (?, ?, ?)
	`, groupID, userID, content)
	if err != nil {
		return 0, err
	}

	messageID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return messageID, nil
}

// GetGroupMessages retrieves messages for a specific group
func GetGroupMessages(groupID, limit, offset int) ([]models.GroupMessage, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT 
			gm.id,
			gm.group_id,
			gm.user_id as sender_id,
			gm.content,
			gm.sent_at as created_at,
			u.nickname AS sender_name
		FROM group_messages gm
		LEFT JOIN users u ON gm.user_id = u.id
		WHERE gm.group_id = ?
		ORDER BY gm.sent_at ASC
		LIMIT ? OFFSET ?
	`, groupID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.GroupMessage
	for rows.Next() {
		var msg models.GroupMessage
		if err := rows.Scan(&msg.ID, &msg.GroupID, &msg.SenderID, &msg.Content, &msg.CreatedAt, &msg.SenderName); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}

// GetLatestGroupMessage gets the most recent message from a group
func GetLatestGroupMessage(groupID int) (*models.GroupMessage, error) {
	var msg models.GroupMessage
	err := sqlite.GetDB().QueryRow(`
		SELECT 
			gm.id,
			gm.group_id,
			gm.user_id as sender_id,
			gm.content,
			gm.sent_at as created_at,
			u.nickname AS sender_name
		FROM group_messages gm
		LEFT JOIN users u ON gm.user_id = u.id
		WHERE gm.group_id = ?
		ORDER BY gm.sent_at DESC
		LIMIT 1
	`, groupID).Scan(&msg.ID, &msg.GroupID, &msg.SenderID, &msg.Content, &msg.CreatedAt, &msg.SenderName)

	if err == sql.ErrNoRows {
		return nil, nil // No messages found
	}
	if err != nil {
		return nil, err
	}

	return &msg, nil
}

// GetGroupMessageByID retrieves a specific group message by its ID
func GetGroupMessageByID(messageID int) (*models.GroupMessage, error) {
	var msg models.GroupMessage
	err := sqlite.GetDB().QueryRow(`
		SELECT 
			gm.id,
			gm.group_id,
			gm.user_id,
			gm.content,
			gm.sent_at,
			u.nickname AS sender_nickname
		FROM group_messages gm
		LEFT JOIN users u ON gm.user_id = u.id
		WHERE gm.id = ?
	`, messageID).Scan(&msg.ID, &msg.GroupID, &msg.SenderID, &msg.Content, &msg.CreatedAt, &msg.SenderName)

	if err != nil {
		return nil, err
	}

	return &msg, nil
}

// Private Chat Functions

// CanSendPrivateMessage checks if a user can send private messages to another user
// Users can send messages only if at least one of them follows the other
func CanSendPrivateMessage(senderID, receiverID int) (bool, error) {
	// Check if at least one follows the other
	var count int
	err := sqlite.GetDB().QueryRow(`
		SELECT COUNT(*) FROM followers 
		WHERE (follower_id = ? AND followee_id = ?) 
		   OR (follower_id = ? AND followee_id = ?)
	`, senderID, receiverID, receiverID, senderID).Scan(&count)

	if err != nil {
		return false, err
	}

	return count > 0, nil // Can send only if at least one follows the other
}

// SavePrivateMessage saves a private message to the database
func SavePrivateMessage(senderID, receiverID int, content string) (int64, error) {
	result, err := sqlite.GetDB().Exec(`
		INSERT INTO private_messages (sender_id, receiver_id, content) 
		VALUES (?, ?, ?)
	`, senderID, receiverID, content)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// GetPrivateMessages retrieves private messages between two users
func GetPrivateMessages(userID, otherUserID, limit, offset int) ([]models.PrivateMessage, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT 
			pm.id,
			pm.sender_id,
			pm.receiver_id,
			pm.content,
			pm.sent_at,
			u1.nickname AS sender_name,
			u2.nickname AS receiver_name
		FROM private_messages pm
		JOIN users u1 ON pm.sender_id = u1.id
		JOIN users u2 ON pm.receiver_id = u2.id
		WHERE (pm.sender_id = ? AND pm.receiver_id = ?) 
		   OR (pm.sender_id = ? AND pm.receiver_id = ?)
		ORDER BY pm.sent_at ASC
		LIMIT ? OFFSET ?
	`, userID, otherUserID, otherUserID, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.PrivateMessage
	for rows.Next() {
		var msg models.PrivateMessage
		err := rows.Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.CreatedAt, &msg.SenderName, &msg.ReceiverName)
		if err != nil {
			continue
		}
		messages = append(messages, msg)
	}

	return messages, rows.Err()
}

// GetPrivateChatUsers gets users that the current user has exchanged messages with
func GetPrivateChatUsers(userID int) ([]models.ChatUser, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT DISTINCT
			u.id,
			u.nickname,
			u.avatar,
			CASE 
				WHEN pm_latest.content IS NOT NULL THEN pm_latest.content
				ELSE ''
			END as last_message,
			CASE 
				WHEN pm_latest.sent_at IS NOT NULL THEN pm_latest.sent_at
				ELSE datetime('now')
			END as last_message_time,
			0 as unread_count
		FROM users u
		JOIN (
			SELECT 
				CASE 
					WHEN sender_id = ? THEN receiver_id 
					ELSE sender_id 
				END as other_user_id
			FROM private_messages 
			WHERE sender_id = ? OR receiver_id = ?
			GROUP BY other_user_id
		) pm_users ON u.id = pm_users.other_user_id
		LEFT JOIN (
			SELECT 
				CASE 
					WHEN sender_id = ? THEN receiver_id 
					ELSE sender_id 
				END as other_user_id,
				content,
				sent_at,
				ROW_NUMBER() OVER (
					PARTITION BY CASE 
						WHEN sender_id = ? THEN receiver_id 
						ELSE sender_id 
					END 
					ORDER BY sent_at DESC
				) as rn
			FROM private_messages 
			WHERE sender_id = ? OR receiver_id = ?
		) pm_latest ON u.id = pm_latest.other_user_id AND pm_latest.rn = 1
		ORDER BY pm_latest.sent_at DESC
	`, userID, userID, userID, userID, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.ChatUser
	for rows.Next() {
		var user models.ChatUser
		var avatarPath, nickname sql.NullString
		err := rows.Scan(&user.ID, &nickname, &avatarPath, &user.LastMessage, &user.LastMessageTime, &user.UnreadCount)
		if err != nil {
			continue
		}

		user.Nickname = nickname.String
		if avatarPath.Valid {
			user.AvatarPath = avatarPath.String
		}
		users = append(users, user)
	}

	return users, rows.Err()
}

// GetChatEligibleUsers gets users that the current user can send messages to (must have follow relationship)
func GetChatEligibleUsers(userID int) ([]models.ChatUser, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT DISTINCT
			u.id,
			u.nickname,
			u.avatar,
			CASE 
				WHEN f1.follower_id IS NOT NULL AND f2.follower_id IS NOT NULL THEN 'mutual'
				WHEN f1.follower_id IS NOT NULL THEN 'you_follow'
				WHEN f2.follower_id IS NOT NULL THEN 'follows_you'
				ELSE 'none'
			END as follow_status
		FROM users u
		LEFT JOIN followers f1 ON f1.follower_id = ? AND f1.followee_id = u.id
		LEFT JOIN followers f2 ON f2.follower_id = u.id AND f2.followee_id = ?
		WHERE u.id != ? AND (
			-- Users the current user is following
			f1.follower_id IS NOT NULL
			OR
			-- Users following the current user
			f2.follower_id IS NOT NULL
		)
		ORDER BY u.nickname
	`, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.ChatUser
	for rows.Next() {
		var user models.ChatUser
		var avatarPath, nickname sql.NullString
		var followStatus string
		err := rows.Scan(&user.ID, &nickname, &avatarPath, &followStatus)
		if err != nil {
			continue
		}

		user.Nickname = nickname.String
		if avatarPath.Valid {
			user.AvatarPath = avatarPath.String
		}
		users = append(users, user)
	}

	return users, rows.Err()
}

// GetFollowStatusForChat returns the follow relationship between two users
func GetFollowStatusForChat(userID, otherUserID int) (string, error) {
	var youFollow, theyFollow bool

	// Check if you follow them
	err := sqlite.GetDB().QueryRow(`
		SELECT COUNT(*) > 0 FROM followers WHERE follower_id = ? AND followee_id = ?
	`, userID, otherUserID).Scan(&youFollow)
	if err != nil {
		return "", err
	}

	// Check if they follow you
	err = sqlite.GetDB().QueryRow(`
		SELECT COUNT(*) > 0 FROM followers WHERE follower_id = ? AND followee_id = ?
	`, otherUserID, userID).Scan(&theyFollow)
	if err != nil {
		return "", err
	}

	if youFollow && theyFollow {
		return "mutual", nil
	} else if youFollow {
		return "you_follow", nil
	} else if theyFollow {
		return "follows_you", nil
	}

	return "none", nil
}

// GetAllUsersForChat gets all users with their follow status for chat UI
func GetAllUsersForChat(userID int) ([]models.ChatUser, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT DISTINCT
			u.id,
			u.nickname,
			u.avatar,
			CASE 
				WHEN f1.follower_id IS NOT NULL AND f2.follower_id IS NOT NULL THEN 'mutual'
				WHEN f1.follower_id IS NOT NULL THEN 'you_follow'
				WHEN f2.follower_id IS NOT NULL THEN 'follows_you'
				ELSE 'none'
			END as follow_status
		FROM users u
		LEFT JOIN followers f1 ON f1.follower_id = ? AND f1.followee_id = u.id
		LEFT JOIN followers f2 ON f2.follower_id = u.id AND f2.followee_id = ?
		WHERE u.id != ?
		ORDER BY 
			CASE 
				WHEN f1.follower_id IS NOT NULL OR f2.follower_id IS NOT NULL THEN 0
				ELSE 1
			END,
			u.nickname
	`, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.ChatUser
	for rows.Next() {
		var user models.ChatUser
		var avatarPath, nickname sql.NullString
		var followStatus string
		err := rows.Scan(&user.ID, &nickname, &avatarPath, &followStatus)
		if err != nil {
			continue
		}

		user.Nickname = nickname.String
		if avatarPath.Valid {
			user.AvatarPath = avatarPath.String
		}
		user.FollowStatus = followStatus
		user.CanChat = followStatus != "none" // Can chat if there's any follow relationship
		users = append(users, user)
	}

	return users, rows.Err()
}
