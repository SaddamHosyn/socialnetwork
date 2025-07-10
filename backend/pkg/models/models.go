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

type Group struct {
	ID                int       `json:"id"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	CreatorID         int       `json:"creator_id"`
	CreatorName       string    `json:"creator_name"`
	CreatedAt         time.Time `json:"created_at"`
	MemberCount       int       `json:"member_count"`
	IsMember          bool      `json:"is_member"`
	IsCreator         bool      `json:"is_creator"`
	HasPendingRequest bool      `json:"has_pending_request"`
}

// GroupDetails represents detailed information about a group
type GroupDetails struct {
	Group
	Members []GroupMember `json:"members"`
	Posts   []GroupPost   `json:"posts"`
	Events  []GroupEvent  `json:"events"`
}

type GroupMember struct {
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	JoinedAt  time.Time `json:"joined_at"`
	IsCreator bool      `json:"is_creator"`
}

type GroupPost struct {
	ID            int       `json:"id"`
	GroupID       int       `json:"group_id"`
	UserID        int       `json:"user_id"`
	Nickname      string    `json:"nickname"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	ImagePaths    []string  `json:"image_paths"`
	CreatedAt     time.Time `json:"created_at"`
	Votes         int       `json:"votes"`
	UserVote      int       `json:"user_vote"`
	CommentsCount int       `json:"comments_count"`
}

type GroupComment struct {
	ID        int       `json:"id"`
	PostID    int       `json:"post_id"`
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	Votes     int       `json:"votes"`
	Image     string    `json:"image"`
}

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

type GroupEventResponse struct {
	UserID    int       `json:"user_id"`
	Nickname  string    `json:"nickname"`
	Response  string    `json:"response"` // "going" or "not_going"
	CreatedAt time.Time `json:"created_at"`
}

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

type GroupJoinRequest struct {
	ID            int       `json:"id"`
	GroupID       int       `json:"group_id"`
	GroupTitle    string    `json:"group_title"`
	RequesterID   int       `json:"requester_id"`
	RequesterName string    `json:"requester_name"`
	Status        string    `json:"status"` // "pending", "accepted", "declined"
	CreatedAt     time.Time `json:"created_at"`
}

type GroupMessage struct {
	ID         int       `json:"id"`
	GroupID    int       `json:"group_id"`
	SenderID   int       `json:"sender_id"`
	SenderName string    `json:"sender_name"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"created_at"`
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
