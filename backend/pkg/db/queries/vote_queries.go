package db

import (
	"database/sql"
	"errors"
	"social-network/backend/pkg/db/sqlite"
)

func nullInt(v int) any {
	if v == 0 {
		return nil
	}
	return v
}

// InsertVote now returns the user's new vote status (1, -1, or 0)
func InsertVote(userID, postID, commentID, voteType int) (int, error) {
	var existingVote int
	query := "SELECT vote_type FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?"
	err := sqlite.GetDB().QueryRow(query, userID, nullInt(postID), nullInt(commentID)).Scan(&existingVote)

	if err == sql.ErrNoRows {
		// Case 1: No previous vote. Insert new vote.
		_, err = sqlite.GetDB().Exec(
			`INSERT INTO votes (user_id, post_id, comment_id, vote_type)
             VALUES (?, ?, ?, ?)`,
			userID, nullInt(postID), nullInt(commentID), voteType)
		if err != nil {
			return 0, err
		}
		return voteType, nil // New user vote is the vote they just made
	} else if err == nil {
		// Case 2: A vote already exists.
		if existingVote == voteType {
			// Case 2a: User is clicking the same button again (un-voting).
			_, err = sqlite.GetDB().Exec(
				`DELETE FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				userID, nullInt(postID), nullInt(commentID))
			if err != nil {
				return 0, err
			}
			return 0, nil // New user vote is 0 (neutral)
		} else {
			// Case 2b: User is changing their vote (e.g., from down to up).
			_, err = sqlite.GetDB().Exec(
				`UPDATE votes SET vote_type = ? WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				voteType, userID, nullInt(postID), nullInt(commentID))
			if err != nil {
				return 0, err
			}
			return voteType, nil // New user vote is the vote they just made
		}
	} else {
		// Case 3: A database error occurred.
		return 0, err
	}
}

func GetVoteSum(postID, commentID int) (int, error) {
	var total int
	var err error

	if postID != 0 {
		err = sqlite.GetDB().QueryRow("SELECT IFNULL(SUM(vote_type), 0) FROM votes WHERE post_id = ?", postID).Scan(&total)
	} else if commentID != 0 {
		err = sqlite.GetDB().QueryRow("SELECT IFNULL(SUM(vote_type), 0) FROM votes WHERE comment_id = ?", commentID).Scan(&total)
	} else {
		return 0, errors.New("invalid vote target")
	}

	return total, err
}
