package handlers

import (
	"database/sql"
	"log"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
	"time"
)

// CreateGroupEventHandler creates a new event in a group
func CreateGroupEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	title := strings.TrimSpace(r.FormValue("title"))
	description := strings.TrimSpace(r.FormValue("description"))
	eventDateStr := r.FormValue("event_date")

	// Parse event date (expecting RFC3339 format)
	eventDate, err := time.Parse(time.RFC3339, eventDateStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid event date format")
		return
	}

	// Validate input
	if verr := utils.ValidateEvent(title, description, eventDate); verr != nil {
		utils.Fail(w, http.StatusBadRequest, verr.Message)
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You must be a group member to create events")
		return
	}

	eventID, err := db.CreateGroupEvent(groupID, userID, title, description, eventDate)
	if err != nil {
		log.Printf("Create event error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusCreated, map[string]any{
		"message":  "Event created successfully",
		"event_id": eventID,
	})
}

// FetchGroupEvents returns all events for a specific group
func FetchGroupEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.URL.Query().Get("group_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You must be a group member to view events")
		return
	}

	events, err := db.GetGroupEvents(groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, events)
}

// RespondToEventHandler allows a user to respond to an event (going/not_going)
func RespondToEventHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	if err := r.ParseForm(); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	eventID, err := strconv.Atoi(r.FormValue("event_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid event ID")
		return
	}

	response := r.FormValue("response") // "going" or "not_going"
	if response != "going" && response != "not_going" {
		utils.Fail(w, http.StatusBadRequest, "Response must be 'going' or 'not_going'")
		return
	}

	// Check if the event exists and user has access to it
	groupID, err := db.GetEventGroupID(eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "Event not found")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You must be a group member to respond to events")
		return
	}

	err = db.RespondToEvent(eventID, userID, response)
	if err != nil {
		log.Printf("Respond to event error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, map[string]string{
		"message": "Response recorded successfully",
	})
}

// FetchEventDetails returns detailed information about a specific event
func FetchEventDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	eventID, err := strconv.Atoi(r.URL.Query().Get("event_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid event ID")
		return
	}

	// Check if the event exists and user has access to it
	groupID, err := db.GetEventGroupID(eventID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "Event not found")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You must be a group member to view event details")
		return
	}

	event, err := db.GetEventDetails(eventID, userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, event)
}
