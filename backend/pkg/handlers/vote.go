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

	// The InsertVote function handles all logic: insert, update, or delete.
	newVoteStatus, err := db.InsertVote(userID, postID, commentID, voteType)
	if err != nil {
		log.Printf("Vote error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error processing vote")
		return
	}

	// After the vote is processed, get the new total sum.
	newVoteTotal, err := db.GetVoteSum(postID, commentID)
	if err != nil {
		log.Printf("GetVoteSum error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error calculating new total")
		return
	}

	// Return the new state to the frontend.
	utils.Success(w, http.StatusOK, map[string]any{
		"message":        "Vote processed",
		"new_vote_total": newVoteTotal,
		"user_vote":      newVoteStatus,
	})
}
