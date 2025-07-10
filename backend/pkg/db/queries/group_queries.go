package db

import (
	"database/sql"
	"fmt"
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
	"time"
)

// CreateGroup creates a new group and adds the creator as owner
// CreateGroup creates a new group and adds the creator as owner
func CreateGroup(userID int, title, description string) (int, error) {
	tx, err := sqlite.GetDB().Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// Insert group
	var groupID int
	err = tx.QueryRow(`
		INSERT INTO groups (name, description, creator_id, created_at) 
		VALUES (?, ?, ?, ?)
		RETURNING id
	`, title, description, userID, time.Now()).Scan(&groupID)
	if err != nil {
		return 0, err
	}

	// Add creator as owner
	_, err = tx.Exec(`
		INSERT INTO group_members (group_id, user_id, role, joined_at) 
		VALUES (?, ?, 'owner', ?)
	`, groupID, userID, time.Now())
	if err != nil {
		return 0, err
	}

	// Commit the transaction first
	if err = tx.Commit(); err != nil {
		return 0, err
	}

	// Notify followers about group creation (in goroutine to avoid blocking)
	go func() {
		err = NotifyFollowersOfGroupActivity(userID, groupID, title, "created")
		if err != nil {
			// Log error but don't fail the group creation
			return
		}
	}()

	return groupID, nil
}

// GetAllGroups returns all groups with pagination
func GetAllGroups(limit, offset int) ([]models.Group, error) {
	query := `
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm.user_id) as member_count
		FROM groups g
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm ON g.id = gm.group_id
		GROUP BY g.id
		ORDER BY g.created_at DESC
		LIMIT ? OFFSET ?
	`

	rows, err := sqlite.GetDB().Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(&group.ID, &group.Title, &group.Description,
			&group.CreatorID, &group.CreatorName, &group.CreatedAt, &group.MemberCount)
		if err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	return groups, nil
}

// GetUserGroups returns groups where the user is a member
func GetUserGroups(userID int) ([]models.Group, error) {
	query := `
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm2.user_id) as member_count,
			   CASE WHEN g.creator_id = ? THEN 1 ELSE 0 END as is_creator
		FROM groups g
		JOIN group_members gm ON g.id = gm.group_id
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm2 ON g.id = gm2.group_id
		WHERE gm.user_id = ?
		GROUP BY g.id
		ORDER BY g.created_at DESC
	`

	rows, err := sqlite.GetDB().Query(query, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var group models.Group
		err := rows.Scan(&group.ID, &group.Title, &group.Description,
			&group.CreatorID, &group.CreatorName, &group.CreatedAt,
			&group.MemberCount, &group.IsCreator)
		if err != nil {
			return nil, err
		}
		group.IsMember = true
		groups = append(groups, group)
	}

	return groups, nil
}

// GetGroupDetails returns detailed information about a group
func GetGroupDetails(groupID, userID int) (*models.GroupDetails, error) {
	var details models.GroupDetails

	// Get basic group info
	query := `
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm.user_id) as member_count,
			   CASE WHEN gm2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_member,
			   CASE WHEN g.creator_id = ? THEN 1 ELSE 0 END as is_creator
		FROM groups g
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm ON g.id = gm.group_id
		LEFT JOIN group_members gm2 ON g.id = gm2.group_id AND gm2.user_id = ?
		WHERE g.id = ?
		GROUP BY g.id
	`

	err := sqlite.GetDB().QueryRow(query, userID, userID, groupID).Scan(
		&details.ID, &details.Title, &details.Description, &details.CreatorID,
		&details.CreatorName, &details.CreatedAt, &details.MemberCount,
		&details.IsMember, &details.IsCreator)
	if err != nil {
		return nil, err
	}

	// Get members
	details.Members, err = getGroupMembers(groupID)
	if err != nil {
		return nil, err
	}

	// Get recent posts
	details.Posts, err = GetGroupPosts(groupID, 10, 0)
	if err != nil {
		return nil, err
	}

	// Get events
	details.Events, err = GetGroupEvents(groupID)
	if err != nil {
		return nil, err
	}

	return &details, nil
}

// getGroupMembers is a helper function to get group members
func getGroupMembers(groupID int) ([]models.GroupMember, error) {
	query := `
		SELECT gm.user_id, u.nickname, gm.joined_at,
			   CASE WHEN gm.role = 'owner' THEN 1 ELSE 0 END as is_creator
		FROM group_members gm
		JOIN users u ON gm.user_id = u.id
		WHERE gm.group_id = ?
		ORDER BY gm.joined_at
	`

	rows, err := sqlite.GetDB().Query(query, groupID)
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

// IsGroupMember checks if a user is a member of a group or the creator
func IsGroupMember(userID, groupID int) (bool, error) {
	var count int
	err := sqlite.GetDB().QueryRow(`
		SELECT COUNT(*) FROM (
			SELECT 1 FROM group_members WHERE user_id = ? AND group_id = ?
			UNION
			SELECT 1 FROM groups WHERE creator_id = ? AND id = ?
		)
	`, userID, groupID, userID, groupID).Scan(&count)
	return count > 0, err
}

// IsGroupCreator checks if a user is the creator of a group (for join requests)
func IsGroupCreator(requestID, userID int) (bool, error) {
	var count int
	err := sqlite.GetDB().QueryRow(`
		SELECT COUNT(*) FROM group_invitations gi
		JOIN groups g ON gi.group_id = g.id
		WHERE gi.id = ? AND g.creator_id = ?
	`, requestID, userID).Scan(&count)
	return count > 0, err
}

// IsGroupCreatorByGroupID checks if a user is the creator of a group by group ID
func IsGroupCreatorByGroupID(userID, groupID int) (bool, error) {
	var count int
	err := sqlite.GetDB().QueryRow(`
		SELECT COUNT(*) FROM groups 
		WHERE id = ? AND creator_id = ?
	`, groupID, userID).Scan(&count)
	return count > 0, err
}

// CreateGroupInvitation creates a new group invitation and sends notification
func CreateGroupInvitation(groupID, inviterID, inviteeID int) (int, error) {
	database := sqlite.GetDB()

	// Start transaction
	tx, err := database.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// Check if user is already a member
	var exists bool
	err = tx.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?)
	`, groupID, inviteeID).Scan(&exists)
	if err != nil {
		return 0, err
	}
	if exists {
		return 0, fmt.Errorf("user is already member")
	}

	// Check if invitation already exists and is pending
	err = tx.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM group_invitations WHERE group_id = ? AND invitee_id = ? AND status = 'pending')
	`, groupID, inviteeID).Scan(&exists)
	if err != nil {
		return 0, err
	}
	if exists {
		return 0, fmt.Errorf("user already invited")
	}

	// Create the invitation
	var invitationID int
	err = tx.QueryRow(`
		INSERT INTO group_invitations (group_id, inviter_id, invitee_id, status, created_at)
		VALUES (?, ?, ?, 'pending', ?)
		RETURNING id
	`, groupID, inviterID, inviteeID, time.Now()).Scan(&invitationID)
	if err != nil {
		return 0, err
	}

	// Get group and inviter details for notification
	var groupName, inviterName string
	err = tx.QueryRow(`
		SELECT g.name, u.nickname 
		FROM groups g, users u 
		WHERE g.id = ? AND u.id = ?
	`, groupID, inviterID).Scan(&groupName, &inviterName)
	if err != nil {
		return 0, err
	}

	// Create notification
	content := inviterName + " invited you to join the group '" + groupName + "'"
	_, err = tx.Exec(`
		INSERT INTO notifications (user_id, type, reference_id, content, requires_action, sender_id, sender_name, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, inviteeID, "group_invitation", invitationID, content, true, inviterID, inviterName, time.Now())
	if err != nil {
		return 0, err
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return invitationID, nil
}

// CreateJoinRequest creates a new join request and sends notification
func CreateJoinRequest(groupID, userID int) (int, error) {
	database := sqlite.GetDB()

	// Start transaction
	tx, err := database.Begin()
	if err != nil {
		return 0, err
	}
	defer tx.Rollback()

	// Check if user is already a member
	var exists bool
	err = tx.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?)
	`, groupID, userID).Scan(&exists)
	if err != nil {
		return 0, err
	}
	if exists {
		return 0, fmt.Errorf("user is already member")
	}

	// Check if join request already exists and is pending
	err = tx.QueryRow(`
		SELECT EXISTS(SELECT 1 FROM group_invitations WHERE group_id = ? AND invitee_id = ? AND inviter_id = ? AND status = 'pending')
	`, groupID, userID, userID).Scan(&exists)
	if err != nil {
		return 0, err
	}
	if exists {
		return 0, fmt.Errorf("join request already exists")
	}

	// Create the join request (using same table as invitations, but inviter_id = invitee_id for join requests)
	var requestID int
	err = tx.QueryRow(`
		INSERT INTO group_invitations (group_id, inviter_id, invitee_id, status, created_at)
		VALUES (?, ?, ?, 'pending', ?)
		RETURNING id
	`, groupID, userID, userID, time.Now()).Scan(&requestID)
	if err != nil {
		return 0, err
	}

	// Get group and requester details for notification
	var groupName, requesterName string
	var creatorID int
	err = tx.QueryRow(`
		SELECT g.name, g.creator_id, u.nickname 
		FROM groups g, users u 
		WHERE g.id = ? AND u.id = ?
	`, groupID, userID).Scan(&groupName, &creatorID, &requesterName)
	if err != nil {
		return 0, err
	}

	// Create notification for group creator
	content := requesterName + " requested to join your group '" + groupName + "'"
	_, err = tx.Exec(`
		INSERT INTO notifications (user_id, type, reference_id, content, requires_action, sender_id, sender_name, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, creatorID, "group_join_request", requestID, content, true, userID, requesterName, time.Now())
	if err != nil {
		return 0, err
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}

	return requestID, nil
}

// HandleGroupInvitation accepts or declines a group invitation



// HandleGroupInvitation accepts or declines a group invitation
func HandleGroupInvitation(invitationID, userID int, accept bool) error {
	tx, err := sqlite.GetDB().Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get invitation details
	var groupID int
	err = tx.QueryRow(`
		SELECT group_id FROM group_invitations 
		WHERE id = ? AND invitee_id = ? AND status = 'pending'
	`, invitationID, userID).Scan(&groupID)
	if err != nil {
		return err
	}

	status := "declined"
	if accept {
		status = "accepted"
		// Add user to group
		_, err = tx.Exec(`
			INSERT INTO group_members (group_id, user_id, role, joined_at)
			VALUES (?, ?, 'member', ?)
		`, groupID, userID, time.Now())
		if err != nil {
			return err
		}
	}

	// Update invitation status
	_, err = tx.Exec(`
		UPDATE group_invitations 
		SET status = ? 
		WHERE id = ?
	`, status, invitationID)
	if err != nil {
		return err
	}

	// Update notification as action taken
	_, err = tx.Exec(`
		UPDATE notifications 
		SET action_taken = ?, is_read = 1
		WHERE reference_id = ? AND type = 'group_invitation'
	`, status, invitationID)
	if err != nil {
		return err
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return err
	}

	// If user accepted, notify existing members and followers
	if accept {
		go func() {
			// Get group details
			groupName, _ := GetGroupNameByID(groupID)
			userName, _ := GetUserNameByID(userID)
			
			// Notify existing group members
			memberIDs, err := GetGroupMembersForNotification(groupID)
			if err == nil {
				for _, memberID := range memberIDs {
					if memberID != userID { // Don't notify the new member
						CreateGroupMembershipNotification(memberID, userID, userName, groupName, groupID)
					}
				}
			}
			
			// Notify user's followers
			NotifyFollowersOfGroupActivity(userID, groupID, groupName, "joined")
		}()
	}

	return nil
}










// HandleJoinRequest accepts or declines a join request
// HandleJoinRequest accepts or declines a join request
func HandleJoinRequest(requestID int, accept bool) error {
	tx, err := sqlite.GetDB().Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get request details
	var groupID, requesterID int
	err = tx.QueryRow(`
		SELECT group_id, invitee_id FROM group_invitations 
		WHERE id = ? AND status = 'pending' AND inviter_id = invitee_id
	`, requestID).Scan(&groupID, &requesterID)
	if err != nil {
		return err
	}

	status := "declined"
	if accept {
		status = "accepted"
		// Add user to group
		_, err = tx.Exec(`
			INSERT INTO group_members (group_id, user_id, role, joined_at)
			VALUES (?, ?, 'member', ?)
		`, groupID, requesterID, time.Now())
		if err != nil {
			return err
		}
	}

	// Update request status
	_, err = tx.Exec(`
		UPDATE group_invitations 
		SET status = ? 
		WHERE id = ?
	`, status, requestID)
	if err != nil {
		return err
	}

	// Update notification as action taken
	_, err = tx.Exec(`
		UPDATE notifications 
		SET action_taken = ?, is_read = 1
		WHERE reference_id = ? AND type = 'group_join_request'
	`, status, requestID)
	if err != nil {
		return err
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		return err
	}

	// If user accepted, notify existing members and followers
	if accept {
		go func() {
			// Get group details
			groupName, _ := GetGroupNameByID(groupID)
			userName, _ := GetUserNameByID(requesterID)
			
			// Notify existing group members
			memberIDs, err := GetGroupMembersForNotification(groupID)
			if err == nil {
				for _, memberID := range memberIDs {
					if memberID != requesterID { // Don't notify the new member
						CreateGroupMembershipNotification(memberID, requesterID, userName, groupName, groupID)
					}
				}
			}
			
			// Notify user's followers
			NotifyFollowersOfGroupActivity(requesterID, groupID, groupName, "joined")
		}()
	}

	return nil
}

// RemoveGroupMember removes a user from a group
func RemoveGroupMember(userID, groupID int) error {
	result, err := sqlite.GetDB().Exec(`
		DELETE FROM group_members 
		WHERE user_id = ? AND group_id = ?
	`, userID, groupID)
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
	query := `
		SELECT gi.id, gi.group_id, g.name, gi.inviter_id, u.nickname, gi.created_at
		FROM group_invitations gi
		JOIN groups g ON gi.group_id = g.id
		JOIN users u ON gi.inviter_id = u.id
		WHERE gi.invitee_id = ? AND gi.status = 'pending' AND gi.inviter_id != gi.invitee_id
		ORDER BY gi.created_at DESC
	`

	rows, err := sqlite.GetDB().Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var invitations []models.GroupInvitation
	for rows.Next() {
		var inv models.GroupInvitation
		err := rows.Scan(&inv.ID, &inv.GroupID, &inv.GroupTitle,
			&inv.InviterID, &inv.InviterName, &inv.CreatedAt)
		if err != nil {
			return nil, err
		}
		inv.Status = "pending"
		invitations = append(invitations, inv)
	}

	return invitations, nil
}

// GetGroupJoinRequests returns pending join requests for groups created by a user
func GetGroupJoinRequests(userID int) ([]models.GroupJoinRequest, error) {
	query := `
		SELECT gi.id, gi.group_id, g.name, gi.invitee_id, u.nickname, gi.created_at
		FROM group_invitations gi
		JOIN groups g ON gi.group_id = g.id
		JOIN users u ON gi.invitee_id = u.id
		WHERE g.creator_id = ? AND gi.status = 'pending' AND gi.inviter_id = gi.invitee_id
		ORDER BY gi.created_at DESC
	`

	rows, err := sqlite.GetDB().Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var requests []models.GroupJoinRequest
	for rows.Next() {
		var req models.GroupJoinRequest
		err := rows.Scan(&req.ID, &req.GroupID, &req.GroupTitle,
			&req.RequesterID, &req.RequesterName, &req.CreatedAt)
		if err != nil {
			return nil, err
		}
		req.Status = "pending"
		requests = append(requests, req)
	}

	return requests, nil
}

// GetAllGroupsWithUserStatus returns all groups with pagination and user membership status
func GetAllGroupsWithUserStatus(userID int, limit, offset int) ([]models.Group, error) {
	query := `
		SELECT g.id, g.name, g.description, g.creator_id, u.nickname, g.created_at,
			   COUNT(gm.user_id) as member_count,
			   CASE WHEN gm2.user_id IS NOT NULL THEN 1 ELSE 0 END as is_member,
			   CASE WHEN g.creator_id = ? THEN 1 ELSE 0 END as is_creator,
			   CASE WHEN gi.id IS NOT NULL THEN 1 ELSE 0 END as has_pending_request
		FROM groups g
		LEFT JOIN users u ON g.creator_id = u.id
		LEFT JOIN group_members gm ON g.id = gm.group_id
		LEFT JOIN group_members gm2 ON g.id = gm2.group_id AND gm2.user_id = ?
		LEFT JOIN group_invitations gi ON g.id = gi.group_id AND gi.invitee_id = ? AND gi.inviter_id = gi.invitee_id AND gi.status = 'pending'
		GROUP BY g.id
		ORDER BY g.created_at DESC
		LIMIT ? OFFSET ?
	`

	rows, err := sqlite.GetDB().Query(query, userID, userID, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []models.Group
	for rows.Next() {
		var group models.Group
		var hasPendingRequest int
		err := rows.Scan(&group.ID, &group.Title, &group.Description,
			&group.CreatorID, &group.CreatorName, &group.CreatedAt, &group.MemberCount,
			&group.IsMember, &group.IsCreator, &hasPendingRequest)
		if err != nil {
			return nil, err
		}
		group.HasPendingRequest = hasPendingRequest == 1
		groups = append(groups, group)
	}

	return groups, nil
}

// GetGroupFollowers returns followers who are also group members for targeted notifications
func GetGroupFollowers(groupID, userID int) ([]int, error) {
	query := `
		SELECT DISTINCT f.follower_id
		FROM followers f
		JOIN group_members gm ON f.follower_id = gm.user_id
		WHERE f.followee_id = ? AND gm.group_id = ?
	`

	rows, err := sqlite.GetDB().Query(query, userID, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followerIDs []int
	for rows.Next() {
		var followerID int
		err := rows.Scan(&followerID)
		if err != nil {
			return nil, err
		}
		followerIDs = append(followerIDs, followerID)
	}

	return followerIDs, nil
}
