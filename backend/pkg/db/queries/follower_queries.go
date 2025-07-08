package db

import (
	"database/sql"
	"social-network/backend/pkg/models"
)

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
func GetFollowRequest(db *sql.DB, requesterID, requesteeID int) (*models.FollowRequest, error) {
	query := `
		SELECT fr.id, fr.requester_id, fr.requestee_id, fr.status, fr.created_at, u.nickname
		FROM follow_requests fr
		JOIN users u ON fr.requester_id = u.id
		WHERE fr.requester_id = ? AND fr.requestee_id = ? AND fr.status = 'pending'
	`
	var req models.FollowRequest
	err := db.QueryRow(query, requesterID, requesteeID).Scan(
		&req.ID, &req.RequesterID, &req.RequesteeID, &req.Status, &req.CreatedAt, &req.RequesterNickname,
	)
	if err != nil {
		return nil, err
	}
	return &req, nil
}

// GetPendingFollowRequests gets all pending follow requests for a user
func GetPendingFollowRequests(db *sql.DB, userID int) ([]models.FollowRequest, error) {
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

	var requests []models.FollowRequest
	for rows.Next() {
		var req models.FollowRequest
		err := rows.Scan(&req.ID, &req.RequesterID, &req.RequesteeID, &req.Status, &req.CreatedAt, &req.RequesterNickname)
		if err != nil {
			return nil, err
		}
		requests = append(requests, req)
	}
	return requests, nil
}

// GetFollowers gets all followers of a user
func GetFollowers(db *sql.DB, userID int) ([]models.Follower, error) {
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

	var followers []models.Follower
	for rows.Next() {
		var follower models.Follower
		err := rows.Scan(&follower.FollowerID, &follower.FolloweeID, &follower.FollowedAt, &follower.Nickname)
		if err != nil {
			return nil, err
		}
		followers = append(followers, follower)
	}
	return followers, nil
}

// GetFollowing gets all users that a user is following
func GetFollowing(db *sql.DB, userID int) ([]models.Follower, error) {
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

	var following []models.Follower
	for rows.Next() {
		var follower models.Follower
		err := rows.Scan(&follower.FollowerID, &follower.FolloweeID, &follower.FollowedAt, &follower.Nickname)
		if err != nil {
			return nil, err
		}
		following = append(following, follower)
	}
	return following, nil
}

// Rest of your functions remain the same...
func UpdateFollowRequestStatus(db *sql.DB, requestID int, status string) error {
	query := `UPDATE follow_requests SET status = ? WHERE id = ?`
	_, err := db.Exec(query, status, requestID)
	return err
}

func CreateFollowRelationship(db *sql.DB, followerID, followeeID int) error {
	query := `
		INSERT INTO followers (follower_id, followee_id)
		VALUES (?, ?)
	`
	_, err := db.Exec(query, followerID, followeeID)
	return err
}

func DeleteFollowRelationship(db *sql.DB, followerID, followeeID int) error {
	query := `DELETE FROM followers WHERE follower_id = ? AND followee_id = ?`
	_, err := db.Exec(query, followerID, followeeID)
	return err
}

func IsFollowing(db *sql.DB, followerID, followeeID int) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND followee_id = ?)`
	var exists bool
	err := db.QueryRow(query, followerID, followeeID).Scan(&exists)
	return exists, err
}

func GetUserPrivacySetting(db *sql.DB, userID int) (bool, error) {
	query := `SELECT is_private FROM users WHERE id = ?`
	var isPrivate bool
	err := db.QueryRow(query, userID).Scan(&isPrivate)
	return isPrivate, err
}

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

func GetFollowerCount(db *sql.DB, userID int) (int, error) {
	query := `SELECT COUNT(*) FROM followers WHERE followee_id = ?`
	var count int
	err := db.QueryRow(query, userID).Scan(&count)
	return count, err
}

func GetFollowingCount(db *sql.DB, userID int) (int, error) {
	query := `SELECT COUNT(*) FROM followers WHERE follower_id = ?`
	var count int
	err := db.QueryRow(query, userID).Scan(&count)
	return count, err
}

func GetUserDetails(db *sql.DB, userID int) (string, error) {
	query := `SELECT nickname FROM users WHERE id = ?`
	var nickname string
	err := db.QueryRow(query, userID).Scan(&nickname)
	return nickname, err
}
