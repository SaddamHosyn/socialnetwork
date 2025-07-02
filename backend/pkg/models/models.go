package models

import (
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
	User     User      `json:"user"`
	Posts    []Post    `json:"posts"`
	Comments []Comment `json:"comments"`
}

type User struct {
	ID          int       `json:"id"`
	Nickname    string    `json:"nickname"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Gender      string    `json:"gender"`
	Email       string    `json:"email"`
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

// Group represents a group in the social network
type Group struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CreatorID   int       `json:"creator_id"`
	CreatorName string    `json:"creator_name"`
	CreatedAt   time.Time `json:"created_at"`
	MemberCount int       `json:"member_count"`
	IsMember    bool      `json:"is_member"`
	IsCreator   bool      `json:"is_creator"`
}

// GroupDetails represents detailed information about a group
type GroupDetails struct {
	Group
	Members []GroupMember `json:"members"`
	Posts   []GroupPost   `json:"posts"`
	Events  []GroupEvent  `json:"events"`
}

// GroupMember represents a member of a group
type GroupMember struct {
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	JoinedAt  time.Time `json:"joined_at"`
	IsCreator bool      `json:"is_creator"`
}

// GroupPost represents a post within a group
type GroupPost struct {
	ID         int       `json:"id"`
	GroupID    int       `json:"group_id"`
	UserID     int       `json:"user_id"`
	Nickname   string    `json:"nickname"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	ImagePaths []string  `json:"image_paths"`
	CreatedAt  time.Time `json:"created_at"`
	Votes      int       `json:"votes"`
	UserVote   int       `json:"user_vote"`
}

// GroupComment represents a comment on a group post
type GroupComment struct {
	ID        int       `json:"id"`
	PostID    int       `json:"post_id"`
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	Votes     int       `json:"votes"`
}

// GroupEvent represents an event in a group
type GroupEvent struct {
	ID           int                  `json:"id"`
	GroupID      int                  `json:"group_id"`
	CreatorID    int                  `json:"creator_id"`
	CreatorName  string               `json:"creator_name"`
	Title        string               `json:"title"`
	Description  string               `json:"description"`
	EventDate    time.Time            `json:"event_date"`
	CreatedAt    time.Time            `json:"created_at"`
	Responses    []GroupEventResponse `json:"responses"`
	UserResponse *GroupEventResponse  `json:"user_response,omitempty"`
}

// GroupEventResponse represents a user's response to an event
type GroupEventResponse struct {
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	Response  string    `json:"response"` // "going" or "not_going"
	CreatedAt time.Time `json:"created_at"`
}

// GroupInvitation represents an invitation to join a group
type GroupInvitation struct {
	ID          int       `json:"id"`
	GroupID     int       `json:"group_id"`
	GroupTitle  string    `json:"group_title"`
	InviterID   int       `json:"inviter_id"`
	InviterName string    `json:"inviter_name"`
	InviteeID   int       `json:"invitee_id"`
	Status      string    `json:"status"` // "pending", "accepted", "declined"
	CreatedAt   time.Time `json:"created_at"`
}

// GroupJoinRequest represents a request to join a group
type GroupJoinRequest struct {
	ID            int       `json:"id"`
	GroupID       int       `json:"group_id"`
	GroupTitle    string    `json:"group_title"`
	RequesterID   int       `json:"requester_id"`
	RequesterName string    `json:"requester_name"`
	Status        string    `json:"status"` // "pending", "accepted", "declined"
	CreatedAt     time.Time `json:"created_at"`
}

// GroupMessage represents a message in a group chat
type GroupMessage struct {
	ID         int       `json:"id"`
	GroupID    int       `json:"group_id"`
	SenderID   int       `json:"sender_id"`
	SenderName string    `json:"sender_name"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"created_at"`
}
