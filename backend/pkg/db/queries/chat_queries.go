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
			gm.user_id,
			gm.content,
			gm.sent_at,
			u.nickname AS sender_nickname
		FROM group_messages gm
		LEFT JOIN users u ON gm.user_id = u.id
		WHERE gm.group_id = ?
		ORDER BY gm.sent_at DESC
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
			gm.user_id,
			gm.content,
			gm.sent_at,
			u.nickname AS sender_nickname
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
