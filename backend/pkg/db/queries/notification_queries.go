package db

import (

	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

func CreateNotification(userID int, notifType string, refID int, content string, requiresAction bool, senderID int, senderName string) error {
	_, err := sqlite.GetDB().Exec(`
        INSERT INTO notifications (user_id, type, reference_id, content, requires_action, sender_id, sender_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
		userID, notifType, refID, content, requiresAction, senderID, senderName)
	return err
}

func GetNotificationsForUser(userID int) ([]models.Notification, error) {
	rows, err := sqlite.GetDB().Query(`
        SELECT id, user_id, type, reference_id, content, is_read, created_at, 
               requires_action, action_taken, sender_id, sender_name
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []models.Notification
	for rows.Next() {
		var n models.Notification
		var isRead, requiresAction int
		if err := rows.Scan(&n.ID, &n.UserID, &n.Type, &n.ReferenceID, &n.Content,
			&isRead, &n.CreatedAt, &requiresAction, &n.ActionTaken,
			&n.SenderID, &n.SenderName); err != nil {
			return nil, err
		}
		n.IsRead = isRead == 1
		n.RequiresAction = requiresAction == 1
		notifications = append(notifications, n)
	}
	return notifications, nil
}

func UpdateNotificationAction(notifID int, action string) error {
	_, err := sqlite.GetDB().Exec(`UPDATE notifications SET action_taken = ? WHERE id = ?`, action, notifID)
	return err
}

// MarkNotificationAsRead sets is_read = 1
func MarkNotificationAsRead(notifID int) error {
	_, err := sqlite.GetDB().Exec(`UPDATE notifications SET is_read = 1 WHERE id = ?`, notifID)
	return err
}

// GetNotificationByReference gets notification by type and reference ID
func GetNotificationByReference(userID int, notifType string, refID int) (*models.Notification, error) {
	query := `
        SELECT id, user_id, type, reference_id, content, is_read, created_at, 
               requires_action, action_taken, sender_id, sender_name
        FROM notifications
        WHERE user_id = ? AND type = ? AND reference_id = ?
        ORDER BY created_at DESC
        LIMIT 1`

	var n models.Notification
	var isRead, requiresAction int
	err := sqlite.GetDB().QueryRow(query, userID, notifType, refID).Scan(
		&n.ID, &n.UserID, &n.Type, &n.ReferenceID, &n.Content,
		&isRead, &n.CreatedAt, &requiresAction, &n.ActionTaken,
		&n.SenderID, &n.SenderName)

	if err != nil {
		return nil, err
	}

	n.IsRead = isRead == 1
	n.RequiresAction = requiresAction == 1
	return &n, nil
}

// CreateFollowRequestNotification creates a notification for follow requests
func CreateFollowRequestNotification(requesteeID, requesterID int, requesterName string, followRequestID int) error {
	content := requesterName + " sent you a follow request"
	return CreateNotification(requesteeID, "follow_request", followRequestID, content, true, requesterID, requesterName)
}



// CreateGroupInvitationNotification creates a notification for group invitations
func CreateGroupInvitationNotification(inviteeID, inviterID int, inviterName, groupName string, invitationID int) error {
    content := inviterName + " invited you to join the group '" + groupName + "'"
    return CreateNotification(inviteeID, "group_invitation", invitationID, content, true, inviterID, inviterName)
}

// CreateJoinRequestNotification creates a notification for group join requests
func CreateJoinRequestNotification(creatorID, requesterID int, requesterName, groupName string, requestID int) error {
    content := requesterName + " requested to join your group '" + groupName + "'"
    return CreateNotification(creatorID, "group_join_request", requestID, content, true, requesterID, requesterName)
}

// CreateGroupEventNotification creates a notification for new group events
func CreateGroupEventNotification(userID, creatorID int, creatorName, eventTitle, groupName string, eventID int) error {
    content := creatorName + " created a new event '" + eventTitle + "' in group '" + groupName + "'"
    return CreateNotification(userID, "group_event", eventID, content, false, creatorID, creatorName)
}

// GetGroupNameByID retrieves group name by ID
func GetGroupNameByID(groupID int) (string, error) {
    var groupName string
    err := sqlite.GetDB().QueryRow(`SELECT name FROM groups WHERE id = ?`, groupID).Scan(&groupName)
    return groupName, err
}

// GetGroupMembersForNotification retrieves all group members for event notifications
func GetGroupMembersForNotification(groupID int) ([]int, error) {
    rows, err := sqlite.GetDB().Query(`SELECT user_id FROM group_members WHERE group_id = ?`, groupID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var memberIDs []int
    for rows.Next() {
        var userID int
        if err := rows.Scan(&userID); err != nil {
            return nil, err
        }
        memberIDs = append(memberIDs, userID)
    }
    return memberIDs, nil
}

// GetUserNameByID retrieves username by user ID
func GetUserNameByID(userID int) (string, error) {
    var username string
    err := sqlite.GetDB().QueryRow(`SELECT nickname FROM users WHERE id = ?`, userID).Scan(&username)
    return username, err
}
