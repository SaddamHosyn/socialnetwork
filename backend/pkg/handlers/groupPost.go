package handlers

import (
	"log"
	"mime/multipart"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
)

// CreateGroupPostHandler creates a post within a specific group
func CreateGroupPostHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("CreateGroupPostHandler called with method: %s", r.Method)
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Parse form data - handle both multipart and url-encoded
	contentType := r.Header.Get("Content-Type")
	log.Printf("Request Content-Type: %s", contentType)

	if strings.Contains(contentType, "multipart/form-data") {
		if err := r.ParseMultipartForm(50 << 20); err != nil {
			log.Printf("Error parsing multipart form: %v", err)
			utils.Fail(w, http.StatusBadRequest, "Invalid form data")
			return
		}
	} else {
		if err := r.ParseForm(); err != nil {
			log.Printf("Error parsing form: %v", err)
			utils.Fail(w, http.StatusBadRequest, "Invalid form data")
			return
		}
	}

	// Get user ID from context with proper error handling
	userIDValue := r.Context().Value(userIDKey)
	if userIDValue == nil {
		log.Printf("userIDKey not found in context")
		utils.Fail(w, http.StatusUnauthorized, "User not authenticated")
		return
	}

	userID, ok := userIDValue.(int)
	if !ok {
		log.Printf("userID type assertion failed, got type: %T, value: %v", userIDValue, userIDValue)
		utils.Fail(w, http.StatusInternalServerError, "Invalid user context")
		return
	}
	log.Printf("User ID from context: %d", userID)

	// Check if user is authenticated
	if userID == 0 {
		log.Printf("User not authenticated or userID is 0")
		utils.Fail(w, http.StatusUnauthorized, "User not authenticated")
		return
	}

	groupIDStr := r.FormValue("group_id")
	log.Printf("Group ID string from form: '%s'", groupIDStr)
	groupID, err := strconv.Atoi(groupIDStr)
	if err != nil {
		log.Printf("Error parsing group ID '%s': %v", groupIDStr, err)
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}
	log.Printf("Parsed group ID: %d", groupID)

	title := strings.TrimSpace(r.FormValue("title"))
	content := strings.TrimSpace(r.FormValue("content"))

	log.Printf("Post data - Title: '%s', Content length: %d", title, len(content))

	// Validate title and content
	if title == "" || content == "" {
		utils.Fail(w, http.StatusBadRequest, "Title and content are required")
		return
	}

	if len(title) > 100 {
		utils.Fail(w, http.StatusBadRequest, "Title too long (max 100 characters)")
		return
	}

	if len(content) > 2000 {
		utils.Fail(w, http.StatusBadRequest, "Content too long (max 2000 characters)")
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

	// Handle file uploads only if it's a multipart form
	var files []*multipart.FileHeader
	if strings.Contains(contentType, "multipart/form-data") && r.MultipartForm != nil {
		files = r.MultipartForm.File["images"]
	}

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

	var postID int
	postID, err = db.InsertGroupPost(tx, userID, groupID, title, content)
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
		if err := db.AddGroupPostImage(tx, int64(postID), imgPath, idx+1); err != nil {
			log.Printf("image link error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error linking images")
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
	log.Printf("FetchGroupPosts called with method: %s", r.Method)
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	groupID, err := strconv.Atoi(r.URL.Query().Get("group_id"))
	if err != nil {
		log.Printf("Error parsing group_id: %v", err)
		utils.Fail(w, http.StatusBadRequest, "Invalid group ID")
		return
	}
	log.Printf("Fetching posts for group %d, user %d", groupID, userID)

	// Check if user is a member of the group
	isMember, err := db.IsGroupMember(userID, groupID)
	if err != nil {
		log.Printf("Error checking group membership for user %d in group %d: %v", userID, groupID, err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	log.Printf("User %d membership in group %d: %t", userID, groupID, isMember)
	if !isMember {
		log.Printf("User %d is not a member of group %d, denying access", userID, groupID)
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
		log.Printf("Error fetching posts: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	log.Printf("Successfully fetched %d posts for group %d", len(posts), groupID)
	utils.Success(w, http.StatusOK, posts)
}

// CreateGroupCommentHandler creates a comment on a group post
func CreateGroupCommentHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("CreateGroupCommentHandler called with method: %s", r.Method)
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Parse form data - handle both multipart and url-encoded
	contentType := r.Header.Get("Content-Type")
	log.Printf("Comment Request Content-Type: %s", contentType)

	if strings.Contains(contentType, "multipart/form-data") {
		if err := r.ParseMultipartForm(50 << 20); err != nil {
			log.Printf("Error parsing multipart form: %v", err)
			utils.Fail(w, http.StatusBadRequest, "Invalid form data")
			return
		}
	} else {
		if err := r.ParseForm(); err != nil {
			log.Printf("Error parsing form: %v", err)
			utils.Fail(w, http.StatusBadRequest, "Invalid form data")
			return
		}
	}

	// Get user ID from context with proper error handling
	userIDValue := r.Context().Value(userIDKey)
	if userIDValue == nil {
		log.Printf("userIDKey not found in context")
		utils.Fail(w, http.StatusUnauthorized, "User not authenticated")
		return
	}

	userID, ok := userIDValue.(int)
	if !ok {
		log.Printf("userID type assertion failed, got type: %T, value: %v", userIDValue, userIDValue)
		utils.Fail(w, http.StatusInternalServerError, "Invalid user context")
		return
	}
	log.Printf("User ID from context: %d", userID)

	// Check if user is authenticated
	if userID == 0 {
		log.Printf("User not authenticated or userID is 0")
		utils.Fail(w, http.StatusUnauthorized, "User not authenticated")
		return
	}

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

	// Handle file upload - only support one image per comment
	var imagePath string
	if strings.Contains(contentType, "multipart/form-data") && r.MultipartForm != nil {
		files := r.MultipartForm.File["image"]
		if len(files) > 1 {
			utils.Fail(w, http.StatusBadRequest, "Only one image per comment is allowed")
			return
		}

		if len(files) == 1 {
			imgPath, verr := utils.SaveUploadFile(files[0])
			if verr != nil {
				utils.Fail(w, http.StatusBadRequest, verr.Message)
				return
			}
			imagePath = imgPath
		}
	}

	commentID, err := db.InsertGroupComment(userID, postID, content, imagePath)
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

// FetchGroupCommentsHandler fetches comments for a group post
func FetchGroupCommentsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	userID := r.Context().Value(userIDKey).(int)
	postID, err := strconv.Atoi(r.URL.Query().Get("post_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid post ID")
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
			utils.Fail(w, http.StatusForbidden, "You must be a group member to view comments")
			return
		}
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

	comments, err := db.GetGroupComments(postID, limit, offset)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	utils.Success(w, http.StatusOK, comments)
}
