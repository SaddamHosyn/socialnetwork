package chat

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"social-network/backend/pkg/handlers"
	"sync"
)

type Manager struct {
	clients   ClientList
	broadcast chan []byte
	sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		clients:   make(ClientList),
		broadcast: make(chan []byte),
	}
}

func (m *Manager) Run() {

	var msg Message
	//fmt.Println("Running websocket manager...")
	for {
		message := <-m.broadcast

		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("Error decoding message:", err)
			continue
		}

		for wsclient := range m.clients {
			if msg.Type == "update" {
				//Sending update message to all clients
				wsclient.send <- message
			} else {
				if wsclient.userID == msg.ReceiverID || wsclient.userID == msg.SenderID {
					wsclient.send <- message
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

	currentUser, err := handlers.CurrentUser("forum.db", token)
	if err != nil {
		log.Println("User is not authorized, closeing websocket")
		return
	}
	//fmt.Println("currentUser.ID: ", currentUser.ID)

	// create a new client and add it to the manager
	client := NewClient(currentUser.ID, currentUser.Nickname, conn, m)
	m.addClient(client)

	// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
	updateMessage := Message{
		Type: "update",
	}
	updatePayload, _ := json.Marshal(updateMessage)
	m.broadcast <- updatePayload

	// start go routine listening for the messages
	go client.readMessages()
	client.writeMessages()

}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	m.clients[client] = true
	//fmt.Println(client)

}

// Upgrade HTTP connection to WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	if _, ok := m.clients[client]; ok { // check if exists and delete
		client.connection.Close()
		delete(m.clients, client)
	}
	// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
	updateMessage := Message{
		Type: "update",
	}
	updatePayload, _ := json.Marshal(updateMessage)
	m.broadcast <- updatePayload
}
