package chat

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/backend/pkg/models"

	"github.com/gorilla/websocket"
)

func (m *Manager) Run() {

	var msgEach models.Message

	for {
		message := <-m.Broadcast

		if err := json.Unmarshal(message, &msgEach); err != nil {
			fmt.Println("Error decoding message:", err)
			continue
		}

		for eachClient := range m.ClientsCheck {
			if msgEach.Type == "update" || eachClient.UserID == msgEach.ReceiverID || eachClient.UserID == msgEach.SenderID {
				eachClient.SendChannel <- message
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

	//checking git
	// get the session token and find matching user from the db:
	cookie, err := r.Cookie("session_token")
	if err != nil {
		log.Println("Cookie not found!")
		return
	}

	token := cookie.Value

	currentUser, err := CurrentUser(token)
	if err != nil {
		log.Println("User is not authorized, closing websocket")
		return
	}

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

	m.ClientsCheck[client] = true
	//fmt.Println(client)

}

// Upgrade HTTP connection to WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

func (m *Manager) RemoveClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.ClientsCheck[client]; ok { // check if exists and delete
		client.Connection.Close()
		delete(m.ClientsCheck, client)
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
		ClientsCheck: make(map[*Client]bool),
		Broadcast:    make(chan []byte),
	}
}
