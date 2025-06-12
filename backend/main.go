package main

import (
	"log"
	"net/http"
	"social-network/backend/pkg/handlers"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db := initDB("backend/forum.db")

	defer db.Close()

	manager := backend.NewManager()
	go manager.Run()

	backend.SetDB(db)	
    
	http.Handle("/", http.FileServer(http.Dir("public")))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	http.HandleFunc("/api/register", backend.RegisterHandler)
	http.HandleFunc("/api/login", backend.LoginHandler)
	http.HandleFunc("/api/posts", backend.FetchAllPosts)
	http.HandleFunc("/api/post", backend.FetchOnePost)
	http.HandleFunc("/api/users", backend.FetchUsers)
	http.HandleFunc("/api/categories", backend.FetchCategories)
	http.HandleFunc("/api/comment/fetch", backend.FetchComments)

	http.Handle("/api/logout", backend.AuthMiddleware(http.HandlerFunc(backend.LogoutHandler)))
	http.Handle("/api/me", backend.AuthMiddleware(http.HandlerFunc(backend.MeHandler)))
	http.Handle("/api/heartbeat", backend.AuthMiddleware(http.HandlerFunc(backend.Heartbeat)))
	http.Handle("/api/post/create", backend.AuthMiddleware(http.HandlerFunc(backend.PostHandler)))
	http.Handle("/api/comment/create", backend.AuthMiddleware(http.HandlerFunc(backend.CommentHandler)))
	http.Handle("/api/vote", backend.AuthMiddleware(http.HandlerFunc(backend.VoteHandler)))
	http.Handle("/api/profile", backend.AuthMiddleware(http.HandlerFunc(backend.FetchProfile)))
	http.Handle("/api/post/delete", backend.AuthMiddleware(http.HandlerFunc(backend.DeletePostHandler)))
	http.Handle("/api/comment/delete", backend.AuthMiddleware(http.HandlerFunc(backend.DeleteCommentHandler)))

	http.HandleFunc("/ws", manager.ServeWebSocket)
	http.HandleFunc("/api/chat", backend.HandleChatRequest)
	http.HandleFunc("/api/chat/history", backend.HandleChatHistory)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
