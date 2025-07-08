package main

import (
	"log"
	"net/http"
	"social-network/backend/pkg/chat"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/handlers"

	"os"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// Create database directory if it doesn't exist
	if err := os.MkdirAll("database", 0755); err != nil {
		log.Fatalf("Failed to create database directory: %v", err)
	}

	database := sqlite.InitDB("database/forum.db")
	defer database.Close()

	err := sqlite.ApplyMigrations(database)
	if err != nil {
		log.Fatalf("Migration error: %v", err)
	}

	manager := chat.NewManager()
	go manager.Run()

	sqlite.SetDB(database)

	// Simple API status endpoint for root path
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"API Server Running","port":8080,"message":"Social Network Backend API"}`))
	})

	// File uploads
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	// Public API endpoints
	http.HandleFunc("/api/register", handlers.RegisterHandler)
	http.HandleFunc("/api/login", handlers.LoginHandler)
	http.HandleFunc("/api/posts", handlers.FetchAllPosts)
	http.HandleFunc("/api/post", handlers.FetchOnePost)
	http.HandleFunc("/api/users", handlers.FetchAllUsers)
	http.HandleFunc("/api/categories", handlers.FetchCategories)
	http.HandleFunc("/api/comment/fetch", handlers.FetchComments)

	// Protected API endpoints (require authentication)
	http.Handle("/api/logout", handlers.AuthMiddleware(http.HandlerFunc(handlers.LogoutHandler)))
	http.Handle("/api/me", handlers.AuthMiddleware(http.HandlerFunc(handlers.MeHandler)))
	http.Handle("/api/heartbeat", handlers.AuthMiddleware(http.HandlerFunc(handlers.Heartbeat)))
	http.Handle("/api/post/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.PostHandler)))
	http.Handle("/api/comment/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CommentHandler)))
	http.Handle("/api/vote", handlers.AuthMiddleware(http.HandlerFunc(handlers.VoteHandler)))
	http.Handle("/api/profile", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchProfile)))
	http.Handle("/api/post/delete", handlers.AuthMiddleware(http.HandlerFunc(handlers.DeletePostHandler)))
	http.Handle("/api/comment/delete", handlers.AuthMiddleware(http.HandlerFunc(handlers.DeleteCommentHandler)))

	// Group notification endpoints
	http.Handle("/api/notifications/group/invitation/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToGroupInvitationHandler)))
	http.Handle("/api/notifications/group/join/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToJoinRequestHandler)))

	// Notification endpoints
	http.Handle("/api/notifications", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetNotificationsHandler)))
	http.Handle("/api/notifications/read", handlers.AuthMiddleware(http.HandlerFunc(handlers.MarkNotificationReadHandler)))
	http.Handle("/api/notifications/follow/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToFollowNotificationHandler)))

	// Follower system endpoints
	http.Handle("/api/follow", handlers.AuthMiddleware(http.HandlerFunc(handlers.FollowUserHandler)))
	http.Handle("/api/unfollow", handlers.AuthMiddleware(http.HandlerFunc(handlers.UnfollowUserHandler)))
	http.Handle("/api/follow/request/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToFollowRequestHandler)))
	http.Handle("/api/follow/requests", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowRequestsHandler)))
	http.Handle("/api/follow/status", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowStatusHandler)))
	http.Handle("/api/followers", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowersHandler)))
	http.Handle("/api/following", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowingHandler)))

	// WebSocket and Chat endpoints
	http.HandleFunc("/ws", manager.ServeWebSocket)
	http.HandleFunc("/api/chat", chat.HandleChatRequest)
	http.HandleFunc("/api/chat/history", chat.HandleChatHistory)

	log.Println("🚀 Backend API Server starting on :8080")
	log.Println("📡 API endpoints available at http://localhost:8080/api/")
	log.Println("🔔 Notifications: http://localhost:8080/api/notifications")
	log.Println("👥 Follow system: http://localhost:8080/api/follow")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

/*




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

	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	http.HandleFunc("/api/register", handlers.RegisterHandler)
	http.HandleFunc("/api/login", handlers.LoginHandler)
	http.HandleFunc("/api/posts", handlers.FetchAllPosts)
	http.HandleFunc("/api/post", handlers.FetchOnePost)
	http.HandleFunc("/api/users", handlers.FetchAllUsers)
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
	http.Handle("/api/notifications/follow/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToFollowNotificationHandler)))

	// Follower system endpoints
	http.Handle("/api/follow", handlers.AuthMiddleware(http.HandlerFunc(handlers.FollowUserHandler)))
	http.Handle("/api/unfollow", handlers.AuthMiddleware(http.HandlerFunc(handlers.UnfollowUserHandler)))
	http.Handle("/api/follow/request/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToFollowRequestHandler)))
	http.Handle("/api/follow/requests", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowRequestsHandler)))
	http.Handle("/api/follow/status", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowStatusHandler)))
	http.Handle("/api/followers", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowersHandler)))
	http.Handle("/api/following", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowingHandler)))

	// ADD THESE GROUP ROUTES:
	// Group management routes
	http.Handle("/api/groups", handlers.AuthMiddleware(http.HandlerFunc(handlers.GroupsHandler)))

	http.Handle("/api/groups/user", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchUserGroups)))
	http.Handle("/api/groups/details", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupDetails)))

	// Group membership routes
	http.Handle("/api/groups/invite", handlers.AuthMiddleware(http.HandlerFunc(handlers.InviteToGroupHandler)))
	http.Handle("/api/groups/join-request", handlers.AuthMiddleware(http.HandlerFunc(handlers.RequestJoinGroupHandler)))
	http.Handle("/api/groups/handle-invitation", handlers.AuthMiddleware(http.HandlerFunc(handlers.HandleInvitationHandler)))
	http.Handle("/api/groups/handle-join-request", handlers.AuthMiddleware(http.HandlerFunc(handlers.HandleJoinRequestHandler)))
	http.Handle("/api/groups/leave", handlers.AuthMiddleware(http.HandlerFunc(handlers.LeaveGroupHandler)))

	// Group invitations and requests
	http.Handle("/api/groups/invitations", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupInvitations)))
	http.Handle("/api/groups/join-requests", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupJoinRequests)))

	// Group events routes
	http.Handle("/api/groups/events/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CreateGroupEventHandler)))

	http.HandleFunc("/ws", manager.ServeWebSocket)
	http.HandleFunc("/api/chat", chat.HandleChatRequest)
	http.HandleFunc("/api/chat/history", chat.HandleChatHistory)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}



*/
