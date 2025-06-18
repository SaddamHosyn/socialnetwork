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
