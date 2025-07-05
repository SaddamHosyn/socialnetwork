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
