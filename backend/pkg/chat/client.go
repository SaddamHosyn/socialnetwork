package chat

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/models"
	"sync"
)

type ClientList map[*Client]bool

type Client struct {
	UserID     int
	UserName   string
	Connection *websocket.Conn
	Manager    *Manager
	Send       chan []byte
}

type Manager struct {
	Clients   ClientList
	Broadcast chan []byte
	sync.RWMutex
}

func NewClient(id int, name string, conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		UserID:     id,
		UserName:   name,
		Connection: conn,
		Manager:    manager,
		Send:       make(chan []byte),
	}
}

func (c *Client) ReadMessages() { //run as a goroutine "readPump"

	defer func() {
		// Graceful Close the Connection once this goroutine is done
		c.Manager.RemoveClient(c)
	}()

	for {
		// Read message from WebSocket
		_, payload, err := c.Connection.ReadMessage()

		if err != nil {
			// We only want to log Strange errors, but not simple Disconnection
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error reading message: %v", err)
			}
			break
		}
		// unmarshal to message struct
		var msg models.Message
		if err := json.Unmarshal(payload, &msg); err != nil {
			log.Println("Error decoding message:", err)
			continue
		}

		msg.SenderID = c.UserID
		msg.SenderName = c.UserName

		//  save to DB
		if err := db.SaveMessage(msg); err != nil {
			log.Println("Error saving message to DB:", err)
			continue
		}

		// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
		updateMessage := models.Message{
			Type: "update",
		}
		updatePayload, err := json.Marshal(updateMessage)
		if err != nil {
			log.Println("Error encoding update message:", err)
			continue
		}
		c.Manager.Broadcast <- updatePayload

		// marshal back to json
		payload, err = json.Marshal(msg)
		if err != nil {
			log.Println("Error encoding message:", err)
			continue
		}

		// add to brodcast channel
		c.Manager.Broadcast <- payload
	}
}

// run as a goroutine "writePump"
func (c *Client) WriteMessages() {
	defer func() {
		// Graceful close if this triggers a closing
		c.Manager.RemoveClient(c)
	}()

	for {
		message, ok := <-c.Send

		if !ok {
			// Manager has closed this connection channel, so communicate that to frontend
			if err := c.Connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
				// Log that the connection is closed and the reason
				log.Println("connection closed: ", err)
			}
			// Return to close the goroutine
			return
		}
		// Write a Regular text message to the connection
		if err := c.Connection.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println(err)
		}
	}
}
