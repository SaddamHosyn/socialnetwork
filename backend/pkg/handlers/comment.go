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

func CommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Parse form data - handle both multipart and url-encoded
	contentType := r.Header.Get("Content-Type")
	if strings.Contains(contentType, "multipart/form-data") {
		if err := r.ParseMultipartForm(50 << 20); err != nil {
			utils.Fail(w, http.StatusBadRequest, "Invalid form data")
			return
		}
	} else {
		if err := r.ParseForm(); err != nil {
			utils.Fail(w, http.StatusBadRequest, "Bad request")
			return
		}
	}

	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}
	content := strings.TrimSpace(r.FormValue("content"))

	userID := r.Context().Value(userIDKey).(int)

	// Handle optional image upload
	var imagePath *string
	if r.MultipartForm != nil {
		files := r.MultipartForm.File["image"]
		if len(files) > 1 {
			utils.Fail(w, http.StatusBadRequest, "Max 1 image per comment")
			return
		}
		if len(files) == 1 {
			imgPath, verr := utils.SaveUploadFile(files[0])
			if verr != nil {
				utils.Fail(w, http.StatusBadRequest, verr.Message)
				return
			}
			imagePath = &imgPath
		}
	}

	// Validate that either content or image is provided
	if content == "" && imagePath == nil {
		utils.Fail(w, http.StatusBadRequest, "Comment must have either text content or an image")
		return
	}

	// If content is provided, validate it
	if content != "" {
		if ve := utils.ValidateComment(content); ve != nil {
			utils.Fail(w, http.StatusBadRequest, ve.Message)
			return
		}
	}

	commentID, err := db.InsertComment(postID, userID, content, imagePath)
	if err != nil {
		log.Printf("Comment insert error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusCreated, map[string]any{
		"message":    "Comment posted",
		"comment_id": commentID,
	})
}

func DeleteCommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	uid := r.Context().Value(userIDKey).(int)
	commentID, err := strconv.Atoi(r.FormValue("comment_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid comment ID")
		return
	}

	isOwner, err := db.IsCommentOwner(commentID, uid)
	if err == sql.ErrNoRows {
		utils.Fail(w, http.StatusNotFound, "Comment not found")
		return
	}
	if err != nil {
		log.Printf("Lookup comment owner: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	if !isOwner {
		utils.Fail(w, http.StatusForbidden, "Not allowed")
		return
	}

	if err := db.DeleteCommentByID(commentID); err != nil {
		log.Printf("Delete comment error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Could not delete comment")
		return
	}

	utils.Success(w, http.StatusOK, map[string]string{"message": "Comment deleted"})
}

func FetchComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	q := r.URL.Query()
	postID, err := strconv.Atoi(q.Get("post_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	limit, _ := strconv.Atoi(q.Get("limit"))
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	offset, err := strconv.Atoi(q.Get("offset"))
	if err != nil {
		offset = 0
	}

	comments, err := db.GetCommentsByPost(postID, limit, offset)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, comments)
}
