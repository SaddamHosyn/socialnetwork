package backend

import (
	"database/sql"
)

func findOrCreateChat(userId, receivingUserId int) (int, error) {
    // Check if a chat already exists between the two users
    query := `
        SELECT id 
        FROM chats 
        WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
    `
    var chatId int
    err := db.QueryRow(query, userId, receivingUserId, receivingUserId, userId).Scan(&chatId)
    
    if err == nil {
       // fmt.Println("Chat found with ID:", chatId)
        return chatId, nil

    } else if err == sql.ErrNoRows {
        // No chat found, create a new one
        insertQuery := `INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)`
        res, err := db.Exec(insertQuery, userId, receivingUserId)
        if err != nil {
            return 0, err
        }

        insertedId, err := res.LastInsertId()
        if err != nil {
            return 0, err
        }
       // fmt.Println("New chat created with ID:", insertedId)

        return int(insertedId), nil
    }

    return 0, err 
}
