package handlers

import (
	"log"
	"net/http"
	"social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
	"strconv"
)

func VoteHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	err := r.ParseForm()
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Bad request")
		return
	}

	postIDStr := r.FormValue("post_id")
	commentIDStr := r.FormValue("comment_id")
	voteStr := r.FormValue("vote")

	voteType, err := strconv.Atoi(voteStr)
	if err != nil || (voteType != 1 && voteType != -1) {
		utils.Fail(w, http.StatusBadRequest, "Invalid vote type")
		return
	}

	var postID, commentID int
	if postIDStr != "" {
		postID, err = strconv.Atoi(postIDStr)
		if err != nil {
			utils.Fail(w, http.StatusBadRequest, "Invalid post ID")
			return
		}
	} else if commentIDStr != "" {
		commentID, err = strconv.Atoi(commentIDStr)
		if err != nil {
			utils.Fail(w, http.StatusBadRequest, "Invalid comment ID")
			return
		}
	} else {
		utils.Fail(w, http.StatusBadRequest, "Vote must target a post or comment")
		return
	}

	userID := r.Context().Value(userIDKey).(int)

	err = db.InsertVote(userID, postID, commentID, voteType)
	if err != nil {
		log.Printf("Vote error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, nil)
}
