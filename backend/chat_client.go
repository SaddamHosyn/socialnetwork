package backend

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type ClientList map[*Client]bool

type Client struct {
	userID int
	//user2ID int
	userName   string
	connection *websocket.Conn
	manager    *Manager
	send       chan []byte
}

func NewClient(id int, name string, conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		userID:     id,
		userName:   name,
		connection: conn,
		manager:    manager,
		send:       make(chan []byte),
	}
}

func (c *Client) readMessages() { //run as a goroutine "readPump"

	defer func() {
		// Graceful Close the Connection once this goroutine is done
		c.manager.removeClient(c)
	}()

	for {
		// Read message from WebSocket
		messageType, payload, err := c.connection.ReadMessage()
		log.Println("func readMessages called")

		if err != nil {
			// We only want to log Strange errors, but not simple Disconnection
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error reading message: %v", err)
			}
			break
		}
		// unmarshal to message struct
		var msg Message
		if err := json.Unmarshal(payload, &msg); err != nil {
			log.Println("Error decoding message:", err)
			continue
		}
		//log.Println("Message received: ", msg)
		//add sender_id and user name
		msg.SenderID = c.userID
		msg.SenderName = c.userName

		//log.Println("Message sender id added to payload: ", msg.SenderID)
		//log.Println("Message sender name added to payload: ", msg.SenderName)
		//log.Println("SenderName: ", msg.SenderName)
		//log.Println("Message: ", msg.Message)
		//log.Println("Time: ", msg.Time)

		//  save to DB
		if err := saveMessage(msg); err != nil {
			log.Println("Error saving message to DB:", err)
			continue
		}
		//log.Println("Message saved to DB: ", msg.Message)

		// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
		updateMessage := Message{
			Type: "update",
		}
		updatePayload, err := json.Marshal(updateMessage)
		if err != nil {
			log.Println("Error encoding update message:", err)
			continue
		}
		c.manager.broadcast <- updatePayload

		// marshal back to json
		payload, err = json.Marshal(msg)
		if err != nil {
			log.Println("Error encoding message:", err)
			continue
		}

		log.Println("MessageType: ", messageType)
		//log.Println("Payload (msgData): ", string(payload))

		// add to brodcast channel
		c.manager.broadcast <- payload
	}
}

// run as a goroutine "writePump"
func (c *Client) writeMessages() {
	defer func() {
		// Graceful close if this triggers a closing
		c.manager.removeClient(c)
	}()

	for {
		message, ok := <-c.send
		//log.Println("func writeMessages called")

		if !ok {
			// Manager has closed this connection channel, so communicate that to frontend
			if err := c.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
				// Log that the connection is closed and the reason
				log.Println("connection closed: ", err)
			}
			// Return to close the goroutine
			return
		}
		// Write a Regular text message to the connection
		if err := c.connection.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Println(err)
		}
		log.Println("Message sent to reseivers wsclient: ")
	}
}
