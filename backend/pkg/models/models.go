package models

import (
	"database/sql"
	"time"
)

type Post struct {
	ID         int       `json:"id"`
	UserID     int       `json:"user_id"`
	Nickname   string    `json:"nickname"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	ImagePaths []string  `json:"image_paths"`
	CreatedAt  time.Time `json:"created_at"`
	Votes      int       `json:"votes"`
	UserVote   int       `json:"user_vote"`
	Categories []string  `json:"categories"`
}

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Comment struct {
	ID        int       `json:"id"`
	PostID    int       `json:"post_id"`
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	Votes     int       `json:"votes"`
}

type PublicUser struct {
	ID       int    `json:"id"`
	Nickname string `json:"nickname"`
	Online   bool   `json:"online"`
}

type UserProfile struct {
	User           User      `json:"user"`
	Posts          []Post    `json:"posts"`
	Comments       []Comment `json:"comments"`
	FollowerCount  int       `json:"follower_count"`
	FollowingCount int       `json:"following_count"`
}

type User struct {
	ID          int       `json:"id"`
	Email       string    `json:"email"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Gender      string    `json:"gender"`
	Nickname    string    `json:"nickname"`
	Avatar      string    `json:"avatar"`
	AboutMe     string    `json:"about_me"`
	IsPrivate   bool      `json:"is_private"`
	CreatedAt   time.Time `json:"created_at"`
}

type UserFromDB struct {
	ID          int
	Email       string
	FirstName   string
	LastName    string
	DateOfBirth time.Time
	GenderID    int
	Nickname    sql.NullString // Can be NULL
	Avatar      sql.NullString // Can be NULL
	AboutMe     sql.NullString // Can be NULL
}

type Message struct {
	Type       string `json:"type"`
	ID         int    `json:"id"`
	SenderID   int    `json:"sender_id"`
	SenderName string `json:"sender_name"`
	ReceiverID int    `json:"receiverId"`
	Message    string `json:"message"`
	Time       string `json:"time"`
}

type Notification struct {
	ID             int       `json:"id"`
	UserID         int       `json:"user_id"`
	Type           string    `json:"type"`
	ReferenceID    int       `json:"reference_id"`
	Content        string    `json:"content"`
	IsRead         bool      `json:"is_read"`
	CreatedAt      time.Time `json:"created_at"`
	RequiresAction bool      `json:"requires_action"`
	ActionTaken    string    `json:"action_taken"`
	SenderID       int       `json:"sender_id"`
	SenderName     string    `json:"sender_name"`
}

type FollowRequest struct {
	ID                int       `json:"id"`
	RequesterID       int       `json:"requester_id"`
	RequesteeID       int       `json:"requestee_id"`
	Status            string    `json:"status"`
	CreatedAt         time.Time `json:"created_at"`
	RequesterNickname string    `json:"requester_nickname"`
}

type Follower struct {
	FollowerID int       `json:"follower_id"`
	FolloweeID int       `json:"followee_id"`
	FollowedAt time.Time `json:"followed_at"`
	Nickname   string    `json:"nickname"`
}
