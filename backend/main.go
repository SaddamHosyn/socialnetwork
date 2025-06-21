package main

import (
	_ "github.com/mattn/go-sqlite3"
	"log"
	"net/http"
	"social-network/backend/pkg/chat"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/handlers"
)

func main() {
	database := sqlite.InitDB("backend/database/forum.db")
	defer database.Close()

	err := sqlite.ApplyMigrations(database)
	if err != nil {
		log.Fatalf("Migration error: %v", err)
	}

	manager := chat.NewManager()
	go manager.Run()

	sqlite.SetDB(database)

	http.Handle("/", http.FileServer(http.Dir("frontend")))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads"))))

	http.HandleFunc("/api/register", handlers.RegisterHandler)
	http.HandleFunc("/api/login", handlers.LoginHandler)
	http.HandleFunc("/api/posts", handlers.FetchAllPosts)
	http.HandleFunc("/api/post", handlers.FetchOnePost)
	http.HandleFunc("/api/users", handlers.FetchUsers)
	http.HandleFunc("/api/categories", handlers.FetchCategories)
	http.HandleFunc("/api/comment/fetch", handlers.FetchComments)

	http.Handle("/api/logout", handlers.AuthMiddleware(http.HandlerFunc(handlers.LogoutHandler)))
	http.Handle("/api/me", handlers.AuthMiddleware(http.HandlerFunc(handlers.MeHandler)))
	http.Handle("/api/heartbeat", handlers.AuthMiddleware(http.HandlerFunc(handlers.Heartbeat)))
	http.Handle("/api/post/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.PostHandler)))
	http.Handle("/api/comment/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CommentHandler)))
	http.Handle("/api/vote", handlers.AuthMiddleware(http.HandlerFunc(handlers.VoteHandler)))
	http.Handle("/api/profile", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchProfile)))
	http.Handle("/api/post/delete", handlers.AuthMiddleware(http.HandlerFunc(handlers.DeletePostHandler)))
	http.Handle("/api/comment/delete", handlers.AuthMiddleware(http.HandlerFunc(handlers.DeleteCommentHandler)))

	http.HandleFunc("/ws", manager.ServeWebSocket)
	http.HandleFunc("/api/chat", chat.HandleChatRequest)
	http.HandleFunc("/api/chat/history", chat.HandleChatHistory)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
