package backend

import (
	//"encoding/json"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	//"fmt"
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
	fmt.Println("Running websocket manager...")

	for {
		message := <-m.broadcast

		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("Error decoding message:", err)
			continue
		}
		//fmt.Println("Broadcasting: ", msg.Message)
		//fmt.Println("Message from: ", msg.SenderName)
		//fmt.Println("Message to: ", msg.ReceiverID)

		for wsclient := range m.clients {
			if msg.Type == "update" {
				fmt.Println("Sending update message to all clients")
				wsclient.send <- message
			} else {
				if wsclient.userID == msg.ReceiverID {
					fmt.Println("add message to clients send channel: ", wsclient.userName)
					fmt.Println("wsclient.userID: ", wsclient.userID)
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
		log.Println("Cookie not found!!!!!!")
		return
	}

	token := cookie.Value

	log.Println("Session toke: ", token)

	currentUser, err := CurrentUser("forum.db", token)
	if err != nil {
		log.Println("User is not authorized, closeing websocket")
		return
	}
	fmt.Println("currentUser.ID: ", currentUser.ID)

	// create a new client and add it to the manager
	client := NewClient(currentUser.ID, currentUser.Nickname, conn, m)
	m.addClient(client)

	// Add a message with type "update" to the broadcast channel to notify all clients and update userlist
	updateMessage := Message{
		Type: "update",
	}
	updatePayload, _ := json.Marshal(updateMessage)
	m.broadcast <- updatePayload

	// start go routines listening for the messages
	go client.readMessages()
	client.writeMessages()

}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()

	m.clients[client] = true
	fmt.Println(client)

}

// Upgrade HTTP connection to WebSocket
var upgrader = websocket.Upgrader{
	//ReadBufferSize:  1024,
	//WriteBufferSize: 1024,

	// Allow any origin for development (⚠️ don't use this in production)
	//CheckOrigin: func(r *http.Request) bool {
	//	return true
	//},

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
