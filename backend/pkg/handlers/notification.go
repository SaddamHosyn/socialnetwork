package handlers

import (
	"net/http"
	"strconv"

	"social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
)

func GetNotificationsHandler(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey).(int)

	notifs, err := db.GetNotificationsForUser(userID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Could not fetch notifications")
		return
	}

	utils.Success(w, http.StatusOK, notifs)
}

func MarkNotificationReadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Invalid method")
		return
	}

	idStr := r.URL.Query().Get("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid notification ID")
		return
	}

	err = db.MarkNotificationAsRead(notifID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Could not mark as read")
		return
	}

	utils.Success(w, http.StatusOK, "Notification marked as read")
}
