package db

import (
	"social-network/backend/pkg/models"
	"time"
)

// CreateGroupEvent creates a new event in a group
func CreateGroupEvent(groupID, creatorID int, title, description string, eventDate time.Time) (int, error) {
	result, err := db.Exec(`
		INSERT INTO group_events (group_id, creator_id, title, description, event_date, created_at)
		VALUES (?, ?, ?, ?, ?, ?)`,
		groupID, creatorID, title, description, eventDate, time.Now())
	if err != nil {
		return 0, err
	}

	eventID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(eventID), nil
}

// GetGroupEvents returns all events for a specific group
func GetGroupEvents(groupID int) ([]models.GroupEvent, error) {
	query := `
		SELECT ge.id, ge.group_id, ge.creator_id, u.nickname, ge.title,
			   ge.description, ge.event_date, ge.created_at
		FROM group_events ge
		JOIN users u ON ge.creator_id = u.id
		WHERE ge.group_id = ?
		ORDER BY ge.event_date ASC`

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

		events = append(events, event)
	}

	return events, nil
}

// GetEventDetails returns detailed information about a specific event
func GetEventDetails(eventID, userID int) (*models.GroupEvent, error) {
	var event models.GroupEvent
	err := db.QueryRow(`
		SELECT ge.id, ge.group_id, ge.creator_id, u.nickname, ge.title,
			   ge.description, ge.event_date, ge.created_at
		FROM group_events ge
		JOIN users u ON ge.creator_id = u.id
		WHERE ge.id = ?`,
		eventID).Scan(
		&event.ID, &event.GroupID, &event.CreatorID, &event.CreatorName,
		&event.Title, &event.Description, &event.EventDate, &event.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Get all responses
	responses, err := getEventResponses(eventID)
	if err != nil {
		return nil, err
	}
	event.Responses = responses

	// Get user's response if it exists
	userResponse, err := getUserEventResponse(eventID, userID)
	if err == nil {
		event.UserResponse = userResponse
	}

	return &event, nil
}

// GetEventGroupID returns the group ID for an event
func GetEventGroupID(eventID int) (int, error) {
	var groupID int
	err := db.QueryRow(`
		SELECT group_id FROM group_events WHERE id = ?`,
		eventID).Scan(&groupID)
	return groupID, err
}

// RespondToEvent records a user's response to an event
func RespondToEvent(eventID, userID int, response string) error {
	_, err := db.Exec(`
		INSERT INTO group_event_responses (event_id, user_id, response, created_at)
		VALUES (?, ?, ?, ?)
		ON CONFLICT(event_id, user_id) DO UPDATE SET
		response = excluded.response,
		created_at = excluded.created_at`,
		eventID, userID, response, time.Now())
	return err
}

// Helper function to get event responses
func getEventResponses(eventID int) ([]models.GroupEventResponse, error) {
	query := `
		SELECT ger.user_id, u.nickname, ger.response, ger.created_at
		FROM group_event_responses ger
		JOIN users u ON ger.user_id = u.id
		WHERE ger.event_id = ?
		ORDER BY ger.created_at ASC`

	rows, err := db.Query(query, eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var responses []models.GroupEventResponse
	for rows.Next() {
		var response models.GroupEventResponse
		err := rows.Scan(
			&response.UserID, &response.Nickname, &response.Response, &response.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		responses = append(responses, response)
	}

	return responses, nil
}

// Helper function to get user's event response
func getUserEventResponse(eventID, userID int) (*models.GroupEventResponse, error) {
	var response models.GroupEventResponse
	err := db.QueryRow(`
		SELECT ger.user_id, u.nickname, ger.response, ger.created_at
		FROM group_event_responses ger
		JOIN users u ON ger.user_id = u.id
		WHERE ger.event_id = ? AND ger.user_id = ?`,
		eventID, userID).Scan(
		&response.UserID, &response.Nickname, &response.Response, &response.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &response, nil
}
