package chat

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/models"

	"github.com/gorilla/websocket"
)

var GlobalManager *Manager

func SetManager(manager *Manager) {
	GlobalManager = manager
}

func (m *Manager) Run() {

	var msg models.Message
	//fmt.Println("Running websocket manager...")
	for {
		message := <-m.Broadcast

		if err := json.Unmarshal(message, &msg); err != nil {
			fmt.Println("Error decoding message:", err)
			continue
		}

		// Track which users have already received this message to avoid duplicates
		sentToUsers := make(map[int]bool)

		fmt.Printf("Broadcasting message: Type=%s, SenderID=%d, ReceiverID=%d, Content=%s\n",
			msg.Type, msg.SenderID, msg.ReceiverID, msg.Message)

		for wsclient := range m.Clients {
			if msg.Type == "update" {
				//Sending update message to all clients
				wsclient.Send <- message
			} else if msg.Type == "group_message" {
				// Handle group messages - send only to group members
				// First check if this user is a member of the group
				if !sentToUsers[wsclient.UserID] {
					isMember, err := db.IsUserGroupMember(wsclient.UserID, msg.GroupID)
					if err != nil {
						fmt.Printf("Error checking group membership for user %d in group %d: %v\n",
							wsclient.UserID, msg.GroupID, err)
						continue
					}

					if isMember {
						fmt.Printf("Sending group message to group member UserID=%d for GroupID=%d\n",
							wsclient.UserID, msg.GroupID)
						wsclient.Send <- message
						sentToUsers[wsclient.UserID] = true
					} else {
						fmt.Printf("NOT sending group message to UserID=%d (not a member of GroupID=%d)\n",
							wsclient.UserID, msg.GroupID)
					}
				}
			} else {
				if wsclient.UserID == msg.ReceiverID || wsclient.UserID == msg.SenderID {
					fmt.Printf("Sending private message to client UserID=%d\n", wsclient.UserID)
					wsclient.Send <- message
				} else {
					fmt.Printf("NOT sending message to client UserID=%d (not sender or receiver)\n", wsclient.UserID)
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
	var token string

	// First try to get token from cookie
	cookie, err := r.Cookie("session_token")
	if err != nil {
		// If cookie not found, try to get token from query parameter
		token = r.URL.Query().Get("token")
		if token == "" {
			log.Printf("Cookie and query token not found! Available cookies: %v", r.Cookies())
			return
		}
		log.Printf("Using token from query parameter: %s", token[:10]+"...")
	} else {
		token = cookie.Value
		log.Printf("Using token from cookie: %s", token[:10]+"...")
	}

	currentUser, err := CurrentUser("forum.db", token)
	if err != nil {
		log.Printf("User is not authorized, closing websocket: %v", err)
		return
	}

	log.Printf("Successfully authenticated user %d (%s) for WebSocket", currentUser.ID, currentUser.Nickname)

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
	log.Printf("Added client for user %d (%s). Total connected clients: %d",
		client.UserID, client.UserName, len(m.Clients))
}

// Upgrade HTTP connection to WebSocket
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
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
