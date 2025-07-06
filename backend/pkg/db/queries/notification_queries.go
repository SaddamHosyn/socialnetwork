package db

import (
	"social-network/backend/pkg/db/sqlite"
	"social-network/backend/pkg/models"
)

// CreateNotification inserts a new notification
func CreateNotification(userID int, notifType string, refID int, content string) error {
	_, err := sqlite.GetDB().Exec(`
		INSERT INTO notifications (user_id, type, reference_id, content)
		VALUES (?, ?, ?, ?)`, userID, notifType, refID, content)
	return err
}

// GetNotificationsForUser returns all notifications for a user
func GetNotificationsForUser(userID int) ([]models.Notification, error) {
	rows, err := sqlite.GetDB().Query(`
		SELECT id, user_id, type, reference_id, content, is_read, created_at
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
		var isRead int
		if err := rows.Scan(&n.ID, &n.UserID, &n.Type, &n.ReferenceID, &n.Content, &isRead, &n.CreatedAt); err != nil {
			return nil, err
		}
		n.IsRead = isRead == 1
		notifications = append(notifications, n)
	}
	return notifications, nil
}

// MarkNotificationAsRead sets is_read = 1
func MarkNotificationAsRead(notifID int) error {
	_, err := sqlite.GetDB().Exec(`UPDATE notifications SET is_read = 1 WHERE id = ?`, notifID)
	return err
}
