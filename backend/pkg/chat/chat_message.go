package chat

type Message struct {
	Type       string `json:"type"`
	ID         int    `json:"id"`
	SenderID   int    `json:"sender_id"`
	SenderName string `json:"sender_name"`
	ReceiverID int    `json:"receiverId"`
	Message    string `json:"message"`
	Time       string `json:"time"`
}

func saveMessage(msg Message) error {
	// Save the message to the database
	query := `INSERT INTO messages (sender_id, receiver_id, content, sent_at) VALUES (?, ?, ?, ?)`
	_, err := db.Exec(query, msg.SenderID, msg.ReceiverID, msg.Message, msg.Time)
	if err != nil {
		return err
	}
	return nil
}
func getMessages(senderID, receiverID, limit, offset int) ([]Message, error) {
	// Retrieve messages between two users from the database
	//query := `SELECT id, sender_id, receiver_id, content, sent_at FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)`
	query := `SELECT 
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
LIMIT ? OFFSET ?;`

	rows, err := db.Query(query, senderID, receiverID, receiverID, senderID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Message, &msg.Time, &msg.SenderName); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}
