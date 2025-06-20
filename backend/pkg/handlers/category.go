package handlers

import (
	"net/http"
	"social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
)

func FetchCategories(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	cats, err := db.GetAllCategories()
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, cats)
}
