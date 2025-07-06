package db

import (
	"database/sql"
	"time"
)

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

// CreateFollowRequest creates a new follow request
func CreateFollowRequest(db *sql.DB, requesterID, requesteeID int) error {
	query := `
		INSERT INTO follow_requests (requester_id, requestee_id, status)
		VALUES (?, ?, 'pending')
	`
	_, err := db.Exec(query, requesterID, requesteeID)
	return err
}

// GetFollowRequest gets a specific follow request
func GetFollowRequest(db *sql.DB, requesterID, requesteeID int) (*FollowRequest, error) {
	query := `
		SELECT fr.id, fr.requester_id, fr.requestee_id, fr.status, fr.created_at, u.nickname
		FROM follow_requests fr
		JOIN users u ON fr.requester_id = u.id
		WHERE fr.requester_id = ? AND fr.requestee_id = ? AND fr.status = 'pending'
	`
	var req FollowRequest
	err := db.QueryRow(query, requesterID, requesteeID).Scan(
		&req.ID, &req.RequesterID, &req.RequesteeID, &req.Status, &req.CreatedAt, &req.RequesterNickname,
	)
	if err != nil {
		return nil, err
	}
	return &req, nil
}

// GetPendingFollowRequests gets all pending follow requests for a user
func GetPendingFollowRequests(db *sql.DB, userID int) ([]FollowRequest, error) {
	query := `
		SELECT fr.id, fr.requester_id, fr.requestee_id, fr.status, fr.created_at, u.nickname
		FROM follow_requests fr
		JOIN users u ON fr.requester_id = u.id
		WHERE fr.requestee_id = ? AND fr.status = 'pending'
		ORDER BY fr.created_at DESC
	`
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []FollowRequest
	for rows.Next() {
		var req FollowRequest
		err := rows.Scan(&req.ID, &req.RequesterID, &req.RequesteeID, &req.Status, &req.CreatedAt, &req.RequesterNickname)
		if err != nil {
			return nil, err
		}
		requests = append(requests, req)
	}
	return requests, nil
}

// UpdateFollowRequestStatus updates a follow request status (accept/decline)
func UpdateFollowRequestStatus(db *sql.DB, requestID int, status string) error {
	query := `UPDATE follow_requests SET status = ? WHERE id = ?`
	_, err := db.Exec(query, status, requestID)
	return err
}

// CreateFollowRelationship creates a follower relationship
func CreateFollowRelationship(db *sql.DB, followerID, followeeID int) error {
	query := `
		INSERT INTO followers (follower_id, followee_id)
		VALUES (?, ?)
	`
	_, err := db.Exec(query, followerID, followeeID)
	return err
}

// DeleteFollowRelationship removes a follower relationship
func DeleteFollowRelationship(db *sql.DB, followerID, followeeID int) error {
	query := `DELETE FROM followers WHERE follower_id = ? AND followee_id = ?`
	_, err := db.Exec(query, followerID, followeeID)
	return err
}

// IsFollowing checks if userA is following userB
func IsFollowing(db *sql.DB, followerID, followeeID int) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND followee_id = ?)`
	var exists bool
	err := db.QueryRow(query, followerID, followeeID).Scan(&exists)
	return exists, err
}

// GetUserPrivacySetting gets user's privacy setting
func GetUserPrivacySetting(db *sql.DB, userID int) (bool, error) {
	query := `SELECT is_private FROM users WHERE id = ?`
	var isPrivate bool
	err := db.QueryRow(query, userID).Scan(&isPrivate)
	return isPrivate, err
}

// GetFollowers gets all followers of a user
func GetFollowers(db *sql.DB, userID int) ([]Follower, error) {
	query := `
		SELECT f.follower_id, f.followee_id, f.followed_at, u.nickname
		FROM followers f
		JOIN users u ON f.follower_id = u.id
		WHERE f.followee_id = ?
		ORDER BY f.followed_at DESC
	`
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []Follower
	for rows.Next() {
		var follower Follower
		err := rows.Scan(&follower.FollowerID, &follower.FolloweeID, &follower.FollowedAt, &follower.Nickname)
		if err != nil {
			return nil, err
		}
		followers = append(followers, follower)
	}
	return followers, nil
}

// GetFollowing gets all users that a user is following
func GetFollowing(db *sql.DB, userID int) ([]Follower, error) {
	query := `
		SELECT f.follower_id, f.followee_id, f.followed_at, u.nickname
		FROM followers f
		JOIN users u ON f.followee_id = u.id
		WHERE f.follower_id = ?
		ORDER BY f.followed_at DESC
	`
	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var following []Follower
	for rows.Next() {
		var follower Follower
		err := rows.Scan(&follower.FollowerID, &follower.FolloweeID, &follower.FollowedAt, &follower.Nickname)
		if err != nil {
			return nil, err
		}
		following = append(following, follower)
	}
	return following, nil
}

// HasPendingFollowRequest checks if there's already a pending follow request
func HasPendingFollowRequest(db *sql.DB, requesterID, requesteeID int) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM follow_requests 
			WHERE requester_id = ? AND requestee_id = ? AND status = 'pending'
		)
	`
	var exists bool
	err := db.QueryRow(query, requesterID, requesteeID).Scan(&exists)
	return exists, err
}
