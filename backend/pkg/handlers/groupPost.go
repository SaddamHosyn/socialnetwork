package handlers

import (
	"log"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
)

// CreateGroupPostHandler creates a post within a specific group
func CreateGroupPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	if err := r.ParseMultipartForm(50 << 20); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid form data")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.FormValue("group_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}

	title := strings.TrimSpace(r.FormValue("title"))
	content := strings.TrimSpace(r.FormValue("content"))
	cats := r.Form["category"]

	if verr := utils.ValidatePost(title, content, cats); verr != nil {
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
		utils.Fail(w, http.StatusForbidden, "You must be a group member to create posts")
		return
	}

	files := r.MultipartForm.File["images"]
	if len(files) > 5 {
		utils.Fail(w, http.StatusBadRequest, "Max 5 images per post")
		return
	}

	tx, err := db.BeginTx()
	if err != nil {
		log.Printf("tx begin error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer tx.Rollback()

	postID, err := db.InsertGroupPost(tx, userID, groupID, title, content)
	if err != nil {
		log.Printf("group post insert error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error creating post")
		return
	}

	for idx, fh := range files {
		imgPath, verr := utils.SaveUploadFile(fh)
		if verr != nil {
			utils.Fail(w, http.StatusBadRequest, verr.Message)
			return
		}
		if err := db.AddPostImage(tx, int64(postID), imgPath, idx+1); err != nil {
			log.Printf("image link error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error linking images")
			return
		}
	}

	for _, cid := range cats {
		id, err := strconv.Atoi(cid)
		if err != nil {
			utils.Fail(w, http.StatusBadRequest, "Invalid category ID")
			return
		}
		if err := db.LinkPostCategory(tx, int64(postID), id); err != nil {
			log.Printf("cat link error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error linking category")
			return
		}
	}

	if err := tx.Commit(); err != nil {
		log.Printf("tx commit error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error saving post")
		return
	}

	utils.Success(w, http.StatusCreated, map[string]any{
		"message":  "Group post created successfully",
		"post_id":  postID,
		"group_id": groupID,
	})
}

// FetchGroupPosts returns posts for a specific group (members only)
func FetchGroupPosts(w http.ResponseWriter, r *http.Request) {
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
		utils.Fail(w, http.StatusForbidden, "You must be a group member to view posts")
		return
	}

	// Parse pagination
	q := r.URL.Query()
	limit, err := strconv.Atoi(q.Get("limit"))
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}
	offset, err := strconv.Atoi(q.Get("offset"))
	if err != nil || offset < 0 {
		offset = 0
	}

	posts, err := db.GetGroupPosts(groupID, limit, offset)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, posts)
}

// CreateGroupCommentHandler creates a comment on a group post
func CreateGroupCommentHandler(w http.ResponseWriter, r *http.Request) {
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
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	content := strings.TrimSpace(r.FormValue("content"))
	if verr := utils.ValidateComment(content); verr != nil {
		utils.Fail(w, http.StatusBadRequest, verr.Message)
		return
	}

	// Check if the post belongs to a group and if user is a member
	groupID, err := db.GetPostGroupID(postID)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if groupID > 0 { // This is a group post
		isMember, err := db.IsGroupMember(userID, groupID)
		if err != nil {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
			return
		}
		if !isMember {
			utils.Fail(w, http.StatusForbidden, "You must be a group member to comment")
			return
		}
	}

	commentID, err := db.InsertComment(userID, postID, content)
	if err != nil {
		log.Printf("comment insert error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusCreated, map[string]any{
		"message":    "Comment created successfully",
		"comment_id": commentID,
	})
}
