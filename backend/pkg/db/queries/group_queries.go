package db

import (
	"database/sql"
	"fmt"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
	"time"
)

// CreateGroup creates a new group and adds the creator as owner
func CreateGroup(userID int, title, description string) (int, error) {
	db := sqlite.GetDB()
	tx, err := db.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// Insert the group
	result, err := tx.Exec(`
		INSERT INTO groups (name, description, creator_id, created_at) 
		VALUES (?, ?, ?, ?)`,
		title, description, userID, time.Now())
	if err != nil {
		return 0, err
	}

	groupID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	// Add creator as owner in group_members
	_, err = tx.Exec(`
		INSERT INTO group_members (group_id, user_id, role, joined_at) 
		VALUES (?, ?, 'owner', ?)`,
		groupID, userID, time.Now())
	if err != nil {
		return 0, err
	}

	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return int(groupID), nil
}

// GetAllGroups returns all groups with pagination and member info
func GetAllGroups(limit, offset int) ([]models.Group, error) {
	db := sqlite.GetDB()
	query := `
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm.user_id) as member_count
		FROM groups g
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm ON g.id = gm.group_id
		GROUP BY g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at
		ORDER BY g.created_at DESC
		LIMIT ? OFFSET ?`

	rows, err := db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(
			&group.ID, &group.Title, &group.Description, &group.CreatorID,
			&group.CreatorName, &group.CreatedAt, &group.MemberCount,
		)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	return groups, nil
}

// GetUserGroups returns groups where the user is a member
func GetUserGroups(userID int) ([]models.Group, error) {
	db := sqlite.GetDB()
	query := `
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm2.user_id) as member_count,
			   CASE WHEN gm.role = 'owner' THEN 1 ELSE 0 END as is_creator
		FROM groups g
		JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = ?
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm2 ON g.id = gm2.group_id
		GROUP BY g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at, gm.role
		ORDER BY g.created_at DESC`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(
			&group.ID, &group.Title, &group.Description, &group.CreatorID,
			&group.CreatorName, &group.CreatedAt, &group.MemberCount, &group.IsCreator,
		)
		if err != nil {
			return nil, err
		}
		group.IsMember = true // User is always a member in this query
		groups = append(groups, group)
	}

	return groups, nil
}

// GetGroupDetails returns detailed information about a group
func GetGroupDetails(groupID, userID int) (*models.GroupDetails, error) {
	db := sqlite.GetDB()
	// Get basic group info
	var details models.GroupDetails
	err := db.QueryRow(`
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm.user_id) as member_count,
			   CASE WHEN gm2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_member,
			   CASE WHEN g.creator_id = ? THEN 1 ELSE 0 END as is_creator
		FROM groups g
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm ON g.id = gm.group_id
		LEFT JOIN group_members gm2 ON g.id = gm2.group_id AND gm2.user_id = ?
		WHERE g.id = ?
		GROUP BY g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at, gm2.user_id`,
		userID, userID, groupID).Scan(
		&details.ID, &details.Title, &details.Description, &details.CreatorID,
		&details.CreatorName, &details.CreatedAt, &details.MemberCount,
		&details.IsMember, &details.IsCreator,
	)
	if err != nil {
		return nil, err
	}

	// Get members
	members, err := getGroupMembers(groupID)
	if err != nil {
		return nil, err
	}
	details.Members = members

	// Get recent posts
	posts, err := getGroupRecentPosts(groupID, 10)
	if err != nil {
		return nil, err
	}
	details.Posts = posts

	// Get upcoming events
	events, err := getGroupUpcomingEvents(groupID, userID)
	if err != nil {
		return nil, err
	}
	details.Events = events

	return &details, nil
}

// Helper function to get group members
func getGroupMembers(groupID int) ([]models.GroupMember, error) {
	db := sqlite.GetDB()
	query := `
		SELECT gm.user_id, u.nickname, gm.joined_at,
			   CASE WHEN gm.role = 'owner' THEN 1 ELSE 0 END as is_creator
		FROM group_members gm
		JOIN users u ON gm.user_id = u.id
		WHERE gm.group_id = ?
		ORDER BY gm.role DESC, gm.joined_at ASC`

	rows, err := db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []models.GroupMember
	for rows.Next() {
		var member models.GroupMember
		err := rows.Scan(&member.UserID, &member.Nickname, &member.JoinedAt, &member.IsCreator)
		if err != nil {
			return nil, err
		}
		members = append(members, member)
	}

	return members, nil
}

// Helper function to get recent group posts
func getGroupRecentPosts(groupID, limit int) ([]models.GroupPost, error) {
	db := sqlite.GetDB()
	query := `
		SELECT gp.id, gp.group_id, gp.user_id, u.nickname, gp.title, gp.content, 
			   gp.created_at, COALESCE(pv.total_votes, 0) as votes
		FROM group_posts gp
		JOIN users u ON gp.user_id = u.id
		LEFT JOIN (
			SELECT post_id, SUM(vote) as total_votes
			FROM post_votes 
			GROUP BY post_id
		) pv ON gp.id = pv.post_id
		WHERE gp.group_id = ?
		ORDER BY gp.created_at DESC
		LIMIT ?`

	rows, err := db.Query(query, groupID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.GroupPost
	for rows.Next() {
		var post models.GroupPost
		err := rows.Scan(
			&post.ID, &post.GroupID, &post.UserID, &post.Nickname,
			&post.Title, &post.Content, &post.CreatedAt, &post.Votes,
		)
		if err != nil {
			return nil, err
		}

		// Get image paths for this post
		images, err := getPostImages(post.ID)
		if err != nil {
			return nil, err
		}
		post.ImagePaths = images

		posts = append(posts, post)
	}

	return posts, nil
}

// Helper function to get upcoming group events
func getGroupUpcomingEvents(groupID, userID int) ([]models.GroupEvent, error) {
	db := sqlite.GetDB()
	query := `
		SELECT ge.id, ge.group_id, ge.creator_id, u.nickname, ge.title, 
			   ge.description, ge.event_date, ge.created_at
		FROM group_events ge
		JOIN users u ON ge.creator_id = u.id
		WHERE ge.group_id = ? AND ge.event_date >= datetime('now')
		ORDER BY ge.event_date ASC
		LIMIT 5`

	rows, err := db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []models.GroupEvent
	for rows.Next() {
		var event models.GroupEvent
		err := rows.Scan(
			&event.ID, &event.GroupID, &event.CreatorID, &event.CreatorName,
			&event.Title, &event.Description, &event.EventDate, &event.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		// Get responses for this event
		responses, err := getEventResponses(event.ID)
		if err != nil {
			return nil, err
		}
		event.Responses = responses

		// Get user's response
		userResponse, err := getUserEventResponse(event.ID, userID)
		if err == nil {
			event.UserResponse = userResponse
		}

		events = append(events, event)
	}

	return events, nil
}

// IsGroupMember checks if a user is a member of a group
func IsGroupMember(userID, groupID int) (bool, error) {
	db := sqlite.GetDB()
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*) FROM group_members 
		WHERE user_id = ? AND group_id = ?`,
		userID, groupID).Scan(&count)
	return count > 0, err
}

// IsGroupCreator checks if a user is the creator of a group (for join requests)
func IsGroupCreator(requestID, userID int) (bool, error) {
	db := sqlite.GetDB()
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*) 
		FROM group_join_requests gjr
		JOIN groups g ON gjr.group_id = g.id
		WHERE gjr.id = ? AND g.creator_id = ?`,
		requestID, userID).Scan(&count)
	return count > 0, err
}

// IsGroupCreatorByGroupID checks if a user is the creator of a group
func IsGroupCreatorByGroupID(userID, groupID int) (bool, error) {
	db := sqlite.GetDB()
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*) FROM groups 
		WHERE id = ? AND creator_id = ?`,
		groupID, userID).Scan(&count)
	return count > 0, err
}

// CreateGroupInvitation creates an invitation to join a group
func CreateGroupInvitation(groupID, inviterID, inviteeID int) error {
	db := sqlite.GetDB()
	// Check if user is already a member
	isMember, err := IsGroupMember(inviteeID, groupID)
	if err != nil {
		return err
	}
	if isMember {
		return fmt.Errorf("user is already member")
	}

	// Check if invitation already exists
	var count int
	err = db.QueryRow(`
		SELECT COUNT(*) FROM group_invitations 
		WHERE group_id = ? AND invitee_id = ? AND status = 'pending'`,
		groupID, inviteeID).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return fmt.Errorf("user already invited")
	}

	_, err = db.Exec(`
		INSERT INTO group_invitations (group_id, inviter_id, invitee_id, status, created_at)
		VALUES (?, ?, ?, 'pending', ?)`,
		groupID, inviterID, inviteeID, time.Now())
	return err
}

// CreateJoinRequest creates a request to join a group
func CreateJoinRequest(groupID, userID int) error {
	db := sqlite.GetDB()
	// Check if user is already a member
	isMember, err := IsGroupMember(userID, groupID)
	if err != nil {
		return err
	}
	if isMember {
		return fmt.Errorf("user is already member")
	}

	// Check if request already exists
	var count int
	err = db.QueryRow(`
		SELECT COUNT(*) FROM group_join_requests 
		WHERE group_id = ? AND requester_id = ? AND status = 'pending'`,
		groupID, userID).Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return fmt.Errorf("join request already requested")
	}

	_, err = db.Exec(`
		INSERT INTO group_join_requests (group_id, requester_id, status, created_at)
		VALUES (?, ?, 'pending', ?)`,
		groupID, userID, time.Now())
	return err
}

// HandleGroupInvitation accepts or declines a group invitation
func HandleGroupInvitation(invitationID, userID int, accept bool) error {
	db := sqlite.GetDB()
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get invitation details and verify it belongs to the user
	var groupID int
	var status string
	err = tx.QueryRow(`
		SELECT group_id, status FROM group_invitations 
		WHERE id = ? AND invitee_id = ?`,
		invitationID, userID).Scan(&groupID, &status)
	if err != nil {
		return err
	}

	if status != "pending" {
		return fmt.Errorf("invitation already processed")
	}

	// Update invitation status
	newStatus := "declined"
	if accept {
		newStatus = "accepted"
	}

	_, err = tx.Exec(`
		UPDATE group_invitations SET status = ? WHERE id = ?`,
		newStatus, invitationID)
	if err != nil {
		return err
	}

	// If accepted, add user to group
	if accept {
		_, err = tx.Exec(`
			INSERT INTO group_members (group_id, user_id, role, joined_at)
			VALUES (?, ?, 'member', ?)`,
			groupID, userID, time.Now())
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

// HandleJoinRequest accepts or declines a join request
func HandleJoinRequest(requestID int, accept bool) error {
	db := sqlite.GetDB()
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get request details
	var groupID, requesterID int
	var status string
	err = tx.QueryRow(`
		SELECT group_id, requester_id, status FROM group_join_requests 
		WHERE id = ?`, requestID).Scan(&groupID, &requesterID, &status)
	if err != nil {
		return err
	}

	if status != "pending" {
		return fmt.Errorf("request already processed")
	}

	// Update request status
	newStatus := "declined"
	if accept {
		newStatus = "accepted"
	}

	_, err = tx.Exec(`
		UPDATE group_join_requests SET status = ? WHERE id = ?`,
		newStatus, requestID)
	if err != nil {
		return err
	}

	// If accepted, add user to group
	if accept {
		_, err = tx.Exec(`
			INSERT INTO group_members (group_id, user_id, role, joined_at)
			VALUES (?, ?, 'member', ?)`,
			groupID, requesterID, time.Now())
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

// RemoveGroupMember removes a user from a group
func RemoveGroupMember(userID, groupID int) error {
	db := sqlite.GetDB()
	result, err := db.Exec(`
		DELETE FROM group_members 
		WHERE user_id = ? AND group_id = ?`,
		userID, groupID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

// GetUserGroupInvitations returns pending invitations for a user
func GetUserGroupInvitations(userID int) ([]models.GroupInvitation, error) {
	db := sqlite.GetDB()
	query := `
		SELECT gi.id, gi.group_id, g.name, gi.inviter_id, u.nickname, 
			   gi.invitee_id, gi.status, gi.created_at
		FROM group_invitations gi
		JOIN groups g ON gi.group_id = g.id
		JOIN users u ON gi.inviter_id = u.id
		WHERE gi.invitee_id = ? AND gi.status = 'pending'
		ORDER BY gi.created_at DESC`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var invitations []models.GroupInvitation
	for rows.Next() {
		var inv models.GroupInvitation
		err := rows.Scan(
			&inv.ID, &inv.GroupID, &inv.GroupTitle, &inv.InviterID,
			&inv.InviterName, &inv.InviteeID, &inv.Status, &inv.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		invitations = append(invitations, inv)
	}

	return invitations, nil
}

// GetGroupJoinRequests returns pending join requests for groups created by the user
func GetGroupJoinRequests(userID int) ([]models.GroupJoinRequest, error) {
	db := sqlite.GetDB()
	query := `
		SELECT gjr.id, gjr.group_id, g.name, gjr.requester_id, u.nickname,
			   gjr.status, gjr.created_at
		FROM group_join_requests gjr
		JOIN groups g ON gjr.group_id = g.id
		JOIN users u ON gjr.requester_id = u.id
		WHERE g.creator_id = ? AND gjr.status = 'pending'
		ORDER BY gjr.created_at DESC`

	rows, err := db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []models.GroupJoinRequest
	for rows.Next() {
		var req models.GroupJoinRequest
		err := rows.Scan(
			&req.ID, &req.GroupID, &req.GroupTitle, &req.RequesterID,
			&req.RequesterName, &req.Status, &req.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		requests = append(requests, req)
	}

	return requests, nil
}

// Additional helper functions that might be missing

// getPostImages helper function for group posts
func getPostImages(postID int) ([]string, error) {
	db := sqlite.GetDB()
	rows, err := db.Query(`SELECT image_path FROM post_images WHERE post_id = ? ORDER BY position`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []string
	for rows.Next() {
		var img string
		if err := rows.Scan(&img); err != nil {
			continue
		}
		images = append(images, img)
	}
	return images, nil
}

// InsertGroupPost creates a new post in a group
func InsertGroupPost(tx *sql.Tx, userID, groupID int, title, content string) (int64, error) {
	res, err := tx.Exec(`INSERT INTO group_posts(group_id, user_id, title, content, created_at) VALUES(?,?,?,?,?)`,
		groupID, userID, title, content, time.Now())
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

// GetGroupPosts returns posts for a specific group
func GetGroupPosts(groupID, limit, offset int) ([]models.GroupPost, error) {
	db := sqlite.GetDB()
	query := `
		SELECT gp.id, gp.group_id, gp.user_id, u.nickname, gp.title, gp.content, 
			   gp.created_at, COALESCE(pv.total_votes, 0) as votes
		FROM group_posts gp
		JOIN users u ON gp.user_id = u.id
		LEFT JOIN (
			SELECT post_id, SUM(vote) as total_votes
			FROM post_votes 
			GROUP BY post_id
		) pv ON gp.id = pv.post_id
		WHERE gp.group_id = ?
		ORDER BY gp.created_at DESC
		LIMIT ? OFFSET ?`

	rows, err := db.Query(query, groupID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.GroupPost
	for rows.Next() {
		var post models.GroupPost
		err := rows.Scan(
			&post.ID, &post.GroupID, &post.UserID, &post.Nickname,
			&post.Title, &post.Content, &post.CreatedAt, &post.Votes,
		)
		if err != nil {
			return nil, err
		}

		// Get image paths for this post
		images, err := getPostImages(post.ID)
		if err != nil {
			return nil, err
		}
		post.ImagePaths = images

		posts = append(posts, post)
	}

	return posts, nil
}

// GetPostGroupID returns the group ID for a post (0 if not a group post)
func GetPostGroupID(postID int) (int, error) {
	db := sqlite.GetDB()
	var groupID sql.NullInt64
	err := db.QueryRow(`SELECT group_id FROM group_posts WHERE id = ?`, postID).Scan(&groupID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil // Not a group post
		}
		return 0, err
	}
	if groupID.Valid {
		return int(groupID.Int64), nil
	}
	return 0, nil
}
