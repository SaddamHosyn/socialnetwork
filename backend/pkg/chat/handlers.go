package chat

import (
	"encoding/json"
	"log"
	"net/http"
	"social-network/backend/pkg/db/queries"
	"strconv"
)

func HandleChatRequest(w http.ResponseWriter, r *http.Request) {
	// get the session token
	cookie, err := r.Cookie("session_token")
	if err != nil {
		http.Error(w, "Missing session token", http.StatusUnauthorized)
		log.Println("Missing session token:", err)
		return
	}
	token := cookie.Value

	//get the current user
	user1, err := CurrentUser("forum.db", token)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Error getting current user:", err)
		return
	}

	// Get the other user's ID from the URL
	user2_id_str := r.URL.Query().Get("user")
	if user2_id_str == "" {
		http.Error(w, "Missing target user ID", http.StatusBadRequest)
		log.Println("No user ID in query")
		return
	}

	//convert to int
	user2_id, err := strconv.Atoi(user2_id_str)
	if err != nil {
		http.Error(w, "Invalid target user ID", http.StatusBadRequest)
		log.Println("Invalid user ID:", user2_id_str)
		return
	}

	// Check if the user is trying to chat with themselves
	if user1.ID == user2_id {
		http.Error(w, "Cannot chat with yourself", http.StatusBadRequest)
		log.Println("User tried to start chat with themselves")
		return
	}

	// Find or create the chat
	chatId, err := db.FindOrCreateChat(user1.ID, user2_id)
	if err != nil {
		http.Error(w, "Error finding/creating chat", http.StatusInternalServerError)
		log.Println("Error in findOrCreateChat:", err)
		return
	}

	// in‑memory map whose keys are strings and whose values can be anything:
	response := map[string]interface{}{
		"success": true,
		"chatId":  chatId,
	}

	//fmt.Println("Chat ID:", chatId)
	w.Header().Set("Content-Type", "application/json") // tells the client “we’re sending JSON”
	json.NewEncoder(w).Encode(response)                // creates a JSON encoder that writes directly to the HTTP response writer
}

// fetch(`/api/chat/history?receiverId=${receiverId}&limit=${limit}&offset=${offset}`
func HandleChatHistory(w http.ResponseWriter, r *http.Request) {
	limit := 10

	// get the session token
	cookie, err := r.Cookie("session_token")
	if err != nil {
		http.Error(w, "Missing session token", http.StatusUnauthorized)
		log.Println("Missing session token:", err)
		return
	}

	token := cookie.Value

	//get the current user
	user1, err := CurrentUser("forum.db", token)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Error getting current user:", err)
		return
	}

	// Get the other user's ID from the URL
	user2_id_str := r.URL.Query().Get("receiverId")
	if user2_id_str == "" {
		http.Error(w, "Missing target user ID", http.StatusBadRequest)
		log.Println("No user ID in query")
		return
	}
	user2, err := strconv.Atoi(user2_id_str)
	if err != nil {
		http.Error(w, "Wrong receiverId", http.StatusInternalServerError)
		log.Println("Error getting receiverId:", err)
		return
	}

	// Get the offset value from the URL
	offset_str := r.URL.Query().Get("offset")
	if offset_str == "" {
		offset_str = "0"
	}

	offset, err := strconv.Atoi(offset_str)
	if err != nil {
		http.Error(w, "Wrong offset value", http.StatusInternalServerError)
		log.Println("Error getting offset value:", err)
		return
	}

	messages, err := db.GetMessages(user1.ID, user2, limit, offset) // query “SELECT sender_id, content, sent_at …”
	if err != nil {
		http.Error(w, "Failed to load history", 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"messages": messages,
	})
}
