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
	chat.SetManager(manager)
	go manager.Run()

	sqlite.SetDB(database)

	http.Handle("/", http.FileServer(http.Dir("frontend")))
	http.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	http.HandleFunc("/api/register", handlers.RegisterHandler)
	http.HandleFunc("/api/login", handlers.LoginHandler)
	http.Handle("/api/posts", handlers.OptionalAuthMiddleware(http.HandlerFunc(handlers.FetchAllPosts)))
	http.HandleFunc("/api/post", handlers.FetchOnePost)
	http.Handle("/api/users", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchUsers)))
	http.Handle("/api/users/discover", handlers.AuthMiddleware(http.HandlerFunc(handlers.DiscoverUsersHandler)))
	http.HandleFunc("/api/categories", handlers.FetchCategories)
	http.HandleFunc("/api/comment/fetch", handlers.FetchComments)

	http.Handle("/api/logout", handlers.AuthMiddleware(http.HandlerFunc(handlers.LogoutHandler)))
	http.Handle("/api/me", handlers.AuthMiddleware(http.HandlerFunc(handlers.MeHandler)))
	http.Handle("/api/heartbeat", handlers.AuthMiddleware(http.HandlerFunc(handlers.Heartbeat)))
	http.Handle("/api/post/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.PostHandler)))
	http.Handle("/api/comment/create", handlers.AuthMiddleware(http.HandlerFunc(handlers.CommentHandler)))
	http.Handle("/api/vote", handlers.AuthMiddleware(http.HandlerFunc(handlers.VoteHandler)))
	http.Handle("/api/profile", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchProfile)))
	http.Handle("/api/profile/user", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchUserProfile)))
	http.Handle("/api/profile/privacy", handlers.AuthMiddleware(http.HandlerFunc(handlers.UpdatePrivacyHandler)))
	http.Handle("/api/post/delete", handlers.AuthMiddleware(http.HandlerFunc(handlers.DeletePostHandler)))
	http.Handle("/api/comment/delete", handlers.AuthMiddleware(http.HandlerFunc(handlers.DeleteCommentHandler)))

	// Notification endpoints
	http.Handle("/api/notifications", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetNotificationsHandler)))
	http.Handle("/api/notifications/read", handlers.AuthMiddleware(http.HandlerFunc(handlers.MarkNotificationReadHandler)))
	// Group notification endpoints  
	http.Handle("/api/notifications/group/invitation/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToGroupInvitationHandler)))
	http.Handle("/api/notifications/group/join/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToJoinRequestHandler)))
	http.Handle("/api/notifications/follow/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToFollowNotificationHandler)))

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
	http.Handle("/api/groups/members", handlers.AuthMiddleware(http.HandlerFunc(handlers.FetchGroupMembers)))

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

	// Group chat routes
	http.Handle("/api/groups/chat/send", handlers.AuthMiddleware(http.HandlerFunc(handlers.SendGroupMessage)))
	http.Handle("/api/groups/chat/messages", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetGroupMessages)))
	http.Handle("/api/groups/chat/latest", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetLatestGroupMessage)))

	// Private chat routes
	http.Handle("/api/private/chat/send", handlers.AuthMiddleware(http.HandlerFunc(handlers.SendPrivateMessage)))
	http.Handle("/api/private/chat/messages", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetPrivateMessages)))
	http.Handle("/api/private/chat/users", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetPrivateChats)))
	http.Handle("/api/private/chat/available", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetChatUsers)))

	// Follow system routes
	http.Handle("/api/follow", handlers.AuthMiddleware(http.HandlerFunc(handlers.FollowUserHandler)))
	http.Handle("/api/unfollow", handlers.AuthMiddleware(http.HandlerFunc(handlers.UnfollowUserHandler)))
	http.Handle("/api/follow/status", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowStatusHandler)))
	http.Handle("/api/follow/requests", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowRequestsHandler)))
	http.Handle("/api/follow/requests/respond", handlers.AuthMiddleware(http.HandlerFunc(handlers.RespondToFollowRequestHandler)))
	http.Handle("/api/follow/followers", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowersHandler)))
	http.Handle("/api/follow/following", handlers.AuthMiddleware(http.HandlerFunc(handlers.GetFollowingHandler)))

	// WebSocket and Chat
	http.HandleFunc("/ws", manager.ServeWebSocket)
	http.HandleFunc("/api/chat", chat.HandleChatRequest)
	http.HandleFunc("/api/chat/history", chat.HandleChatHistory)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
