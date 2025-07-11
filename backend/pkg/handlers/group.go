package handlers

import (
	"database/sql"
	"log"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
)

// CreateGroupHandler creates a new group
func GroupsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		// Handle GET request - fetch all groups
		q := r.URL.Query()
		limit, _ := strconv.Atoi(q.Get("limit"))
		if limit <= 0 || limit > 100 {
			limit = 20
		}
		offset, _ := strconv.Atoi(q.Get("offset"))
		if offset < 0 {
			offset = 0
		}

		userID := r.Context().Value(userIDKey).(int)

		groups, err := db.GetAllGroupsWithUserStatus(userID, limit, offset)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
			return
		}

		utils.Success(w, http.StatusOK, groups)

	case http.MethodPost:
		// Parse multipart form data for FormData compatibility
		err := r.ParseMultipartForm(10 << 20) // 10MB max memory
		if err != nil {
			// Fallback to regular form parsing for URL-encoded data
			err = r.ParseForm()
			if err != nil {
				utils.Fail(w, http.StatusBadRequest, "Bad request")
				return
			}
		}

		userID := r.Context().Value(userIDKey).(int)
		title := strings.TrimSpace(r.FormValue("title"))
		description := strings.TrimSpace(r.FormValue("description"))

		if validationErr := utils.ValidateGroup(title, description); validationErr != nil {
			utils.Fail(w, http.StatusBadRequest, validationErr.Message)
			return
		}

		groupID, err := db.CreateGroup(userID, title, description)
		if err != nil {
			log.Printf("Create group error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
			return
		}

		utils.Success(w, http.StatusCreated, map[string]any{
			"message":  "Group created successfully",
			"group_id": groupID,
		})

	default:
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

// FetchUserGroups returns groups where the user is a member
func FetchUserGroups(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	groups, err := db.GetUserGroups(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, groups)
}

// FetchGroupDetails returns detailed information about a specific group
func FetchGroupDetails(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	groupIDStr := r.URL.Query().Get("id")
	groupID, err := strconv.Atoi(groupIDStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	group, err := db.GetGroupDetails(groupID, userID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "Group not found")
		} else {
			log.Printf("Get group details error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	utils.Success(w, http.StatusOK, group)
}

// InviteToGroupHandler sends an invitation to join a group
func InviteToGroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	inviteeID, err := strconv.Atoi(r.FormValue("invitee_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid invitee ID")
		return
	}

	// Check if user is a member of the group
	isMember, err := db.IsGroupMember(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isMember {
		utils.Fail(w, http.StatusForbidden, "You must be a group member to invite others")
		return
	}

	err = db.CreateGroupInvitation(groupID, userID, inviteeID)
	if err != nil {
		if strings.Contains(err.Error(), "already invited") || strings.Contains(err.Error(), "UNIQUE constraint failed") {
			utils.Fail(w, http.StatusConflict, "User already invited")
		} else if strings.Contains(err.Error(), "already member") {
			utils.Fail(w, http.StatusConflict, "User is already a member")
		} else {
			log.Printf("Create invitation error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	utils.Success(w, http.StatusCreated, map[string]string{
		"message": "Invitation sent successfully",
	})
}

// RequestJoinGroupHandler creates a request to join a group
func RequestJoinGroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	err = db.CreateJoinRequest(groupID, userID)
	if err != nil {
		if strings.Contains(err.Error(), "already requested") || strings.Contains(err.Error(), "UNIQUE constraint failed") {
			utils.Fail(w, http.StatusConflict, "Join request already sent")
		} else if strings.Contains(err.Error(), "already member") {
			utils.Fail(w, http.StatusConflict, "You are already a member")
		} else {
			log.Printf("Create join request error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	utils.Success(w, http.StatusCreated, map[string]string{
		"message": "Join request sent successfully",
	})
}

// HandleInvitationHandler accepts or declines a group invitation
func HandleInvitationHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	invitationID, err := strconv.Atoi(r.FormValue("invitation_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid invitation ID")
		return
	}

	action := r.FormValue("action") // "accept" or "decline"
	if action != "accept" && action != "decline" {
		utils.Fail(w, http.StatusBadRequest, "Action must be 'accept' or 'decline'")
		return
	}

	err = db.HandleGroupInvitation(invitationID, userID, action == "accept")
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "Invitation not found")
		} else {
			log.Printf("Handle invitation error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	message := "Invitation declined"
	if action == "accept" {
		message = "Invitation accepted successfully"
	}

	utils.Success(w, http.StatusOK, map[string]string{
		"message": message,
	})
}

// HandleJoinRequestHandler accepts or declines a join request (group creator only)
func HandleJoinRequestHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	requestID, err := strconv.Atoi(r.FormValue("request_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid request ID")
		return
	}

	action := r.FormValue("action") // "accept" or "decline"
	if action != "accept" && action != "decline" {
		utils.Fail(w, http.StatusBadRequest, "Action must be 'accept' or 'decline'")
		return
	}

	// Check if user is the group creator
	isCreator, err := db.IsGroupCreator(requestID, userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isCreator {
		utils.Fail(w, http.StatusForbidden, "Only group creator can handle join requests")
		return
	}

	err = db.HandleJoinRequest(requestID, action == "accept")
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "Join request not found")
		} else {
			log.Printf("Handle join request error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	message := "Join request declined"
	if action == "accept" {
		message = "Join request accepted successfully"
	}

	utils.Success(w, http.StatusOK, map[string]string{
		"message": message,
	})
}

// LeaveGroupHandler allows a user to leave a group
func LeaveGroupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	// Check if user is the group creator
	isCreator, err := db.IsGroupCreatorByGroupID(userID, groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if isCreator {
		utils.Fail(w, http.StatusForbidden, "Group creator cannot leave the group")
		return
	}

	err = db.RemoveGroupMember(userID, groupID)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.Fail(w, http.StatusNotFound, "You are not a member of this group")
		} else {
			log.Printf("Leave group error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	utils.Success(w, http.StatusOK, map[string]string{
		"message": "Left group successfully",
	})
}

// FetchGroupInvitations returns pending invitations for the current user
func FetchGroupInvitations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	invitations, err := db.GetUserGroupInvitations(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, invitations)
}

// FetchGroupJoinRequests returns pending join requests for groups created by the user
func FetchGroupJoinRequests(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	requests, err := db.GetGroupJoinRequests(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, requests)
}

// FetchGroupMembers returns all members of a specific group
func FetchGroupMembers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupIDStr := r.URL.Query().Get("group_id")
	if groupIDStr == "" {
		utils.Fail(w, http.StatusBadRequest, "Group ID is required")
		return
	}

	groupID, err := strconv.Atoi(groupIDStr)
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
		utils.Fail(w, http.StatusForbidden, "You must be a group member to view members")
		return
	}

	members, err := db.GetGroupMembers(groupID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, members)
}
