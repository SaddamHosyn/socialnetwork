package chat

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"social-network/backend/pkg/models"
)

func (m *Manager) Run() {

	var msg models.Message
	//fmt.Println("Running websocket manager...")
	for {
		message := <-m.Broadcast

		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("Error decoding message:", err)
			continue
		}

		for wsclient := range m.Clients {
			if msg.Type == "update" {
				//Sending update message to all clients
				wsclient.Send <- message
			} else {
				if wsclient.UserID == msg.ReceiverID || wsclient.UserID == msg.SenderID {
					wsclient.Send <- message
				}
			}
		}
	}
}

func (m *Manager) ServeWebSocket(w http.ResponseWriter, r *http.Request) {

	// start new web socket connection
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println("Error upgrading connection: ", err)
		return
	} else {
		log.Println("new connection!")
	}

	defer conn.Close()

	// get the session token and find matching user from the db:
	cookie, err := r.Cookie("session_token")
	if err != nil {
		log.Println("Cookie not found!")
		return
	}

	token := cookie.Value

	currentUser, err := CurrentUser("forum.db", token)
	if err != nil {
		log.Println("User is not authorized, closeing websocket")
		return
	}
	//fmt.Println("currentUser.ID: ", currentUser.ID)

	// create a new client and add it to the manager
	client := NewClient(currentUser.ID, currentUser.Nickname, conn, m)
	m.AddClient(client)

	// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
	updateMessage := models.Message{
		Type: "update",
	}
	updatePayload, _ := json.Marshal(updateMessage)
	m.Broadcast <- updatePayload

	// start go routine listening for the messages
	go client.ReadMessages()
	client.WriteMessages()
}

func (m *Manager) AddClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	m.Clients[client] = true
	//fmt.Println(client)

}

// Upgrade HTTP connection to WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (m *Manager) RemoveClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.Clients[client]; ok { // check if exists and delete
		client.Connection.Close()
		delete(m.Clients, client)
	}
	// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
	updateMessage := models.Message{
		Type: "update",
	}
	updatePayload, _ := json.Marshal(updateMessage)
	m.Broadcast <- updatePayload
}

func NewManager() *Manager {
	return &Manager{
		Clients:   make(ClientList),
		Broadcast: make(chan []byte),
	}
}
