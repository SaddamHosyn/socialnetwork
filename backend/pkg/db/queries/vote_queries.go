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

func InsertVote(userID, postID, commentID, voteType int) error {
	var existingVote int
	query := "SELECT vote_type FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?"
	err := sqlite.GetDB().QueryRow(query, userID, nullInt(postID), nullInt(commentID)).Scan(&existingVote)

	if err == sql.ErrNoRows {
		_, err = sqlite.GetDB().Exec(
			`INSERT INTO votes (user_id, post_id, comment_id, vote_type)
             VALUES (?, ?, ?, ?)`,
			userID, nullInt(postID), nullInt(commentID), voteType)
		return err
	} else if err == nil {
		if existingVote == voteType {
			_, err = sqlite.GetDB().Exec(
				`DELETE FROM votes WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				userID, nullInt(postID), nullInt(commentID))
		} else {
			_, err = sqlite.GetDB().Exec(
				`UPDATE votes SET vote_type = ? WHERE user_id = ? AND post_id IS ? AND comment_id IS ?`,
				voteType, userID, nullInt(postID), nullInt(commentID))
		}
		return err
	} else {
		return err
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
