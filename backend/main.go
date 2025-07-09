package main

import (
	"log"
	"net/http"
	"social-network/backend/pkg/chat"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/handlers"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	database := sqlite.InitDB("database/forum.db")
	defer database.Close()

	err := sqlite.ApplyMigrations(database)
	if err != nil {
		log.Fatalf("Migration error: %v", err)
	}

	manager := chat.NewManager()
	go manager.Run()

	sqlite.SetDB(database)

	http.Handle("/", http.FileServer(http.Dir("frontend")))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

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

	http.Handle("/api/notifications", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetNotificationsHandler)))
	http.Handle("/api/notifications/read", handlers.AuthMiddleware(http.HandlerFunc(handlers.MarkNotificationReadHandler)))

	// ADD THESE GROUP ROUTES:
	// Group management routes
	http.Handle("/api/groups", handlers.AuthMiddleware(http.HandlerFunc(handlers.GroupsHandler)))

	http.Handle("/api/groups/user", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchUserGroups)))
	http.Handle("/api/groups/details", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupDetails)))

	// Group membership routes
	http.Handle("/api/groups/invite", handlers.AuthMiddleware(http.HandlerFunc(handlers.InviteToGroupHandler)))
	http.Handle("/api/groups/request", handlers.AuthMiddleware(http.HandlerFunc(handlers.RequestJoinGroupHandler)))
	http.Handle("/api/groups/join-request", handlers.AuthMiddleware(http.HandlerFunc(handlers.RequestJoinGroupHandler)))
	http.Handle("/api/groups/handle-invitation", handlers.AuthMiddleware(http.HandlerFunc(handlers.HandleInvitationHandler)))
	http.Handle("/api/groups/handle-join-request", handlers.AuthMiddleware(http.HandlerFunc(handlers.HandleJoinRequestHandler)))
	http.Handle("/api/groups/leave", handlers.AuthMiddleware(http.HandlerFunc(handlers.LeaveGroupHandler)))

	// Group invitations and requests
	http.Handle("/api/groups/invitations", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupInvitations)))
	http.Handle("/api/groups/join-requests", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupJoinRequests)))

	// Group events routes
	http.Handle("/api/groups/events", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupEvents)))
	http.Handle("/api/groups/events/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CreateGroupEventHandler)))
	http.Handle("/api/groups/events/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToEventHandler)))
	http.Handle("/api/groups/events/details", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchEventDetails)))

	// Group posts routes
	http.Handle("/api/groups/posts", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupPosts)))
	http.Handle("/api/groups/posts/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CreateGroupPostHandler)))
	http.Handle("/api/groups/posts/comments", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupCommentsHandler)))
	http.Handle("/api/groups/posts/comments/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CreateGroupCommentHandler)))

	http.HandleFunc("/ws", manager.ServeWebSocket)
	http.HandleFunc("/api/chat", chat.HandleChatRequest)
	http.HandleFunc("/api/chat/history", chat.HandleChatHistory)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
