package handlers

import (
	"log"
	"net/http"
	db "social-network/backend/pkg/db/queries"
	"social-network/backend/pkg/models"
	"social-network/backend/pkg/utils"
	"strconv"
	"strings"
)

func PostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// parse both fields and files
	if err := r.ParseMultipartForm(50 << 20); err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid form data")
		return
	}

	uid := r.Context().Value(userIDKey).(int)
	title := strings.TrimSpace(r.FormValue("title"))
	content := strings.TrimSpace(r.FormValue("content"))
	privacy := strings.TrimSpace(r.FormValue("privacy"))
	specificFollowers := r.Form["specific_followers"] // for private posts

	// Validate privacy setting
	if privacy == "" {
		privacy = "public" // default
	}
	if privacy != "public" && privacy != "followers" && privacy != "private" {
		utils.Fail(w, http.StatusBadRequest, "Invalid privacy setting")
		return
	}

	if verr := utils.ValidatePost(title, content); verr != nil {
		utils.Fail(w, http.StatusBadRequest, verr.Message)
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

	postID, err := db.InsertPost(tx, uid, title, content, privacy)
	if err != nil {
		log.Printf("post insert error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Server error creating post")
		return
	}

	// Handle specific followers for private posts
	if privacy == "private" && len(specificFollowers) > 0 {
		for _, followerIDStr := range specificFollowers {
			followerID, err := strconv.Atoi(strings.TrimSpace(followerIDStr))
			if err != nil {
				log.Printf("invalid follower ID: %v", err)
				continue // skip invalid IDs but don't fail the whole request
			}
			if err := db.AddPostSpecificFollower(tx, postID, followerID); err != nil {
				log.Printf("error adding specific follower: %v", err)
				// continue with other followers
			}
		}
	}

	for idx, fh := range files {
		imgPath, verr := utils.SaveUploadFile(fh)
		if verr != nil {
			utils.Fail(w, http.StatusBadRequest, verr.Message)
			return
		}
		if err := db.AddPostImage(tx, postID, imgPath, idx+1); err != nil {
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

	// Fetch the complete post data to return
	post, err := db.GetPostByIDWithVotes(int(postID), uid)
	if err != nil {
		log.Printf("Failed to fetch created post: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Post created but failed to retrieve")
		return
	}

	utils.Success(w, http.StatusCreated, map[string]any{
		"message": "Post created successfully",
		"post_id": postID,
		"post":    post,
	})
}

func DeletePostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	uid := r.Context().Value(userIDKey).(int)
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	isOwner, err := db.IsPostOwner(uid, postID)
	if err != nil {
		if err.Error() == "not found" {
			utils.Fail(w, http.StatusNotFound, "Post not found")
		} else {
			log.Printf("Lookup owner error: %v", err)
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}
	if !isOwner {
		utils.Fail(w, http.StatusForbidden, "Not allowed")
		return
	}

	if err := db.DeletePost(postID); err != nil {
		log.Printf("Delete post error: %v", err)
		utils.Fail(w, http.StatusInternalServerError, "Could not delete post")
		return
	}

	utils.Success(w, http.StatusOK, map[string]string{"message": "Post deleted"})
}

func FetchAllPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Parse filters
	q := r.URL.Query()
	var categoryID int
	if s := q.Get("category_id"); s != "" {
		id, err := strconv.Atoi(s)
		if err != nil {
			utils.Fail(w, http.StatusBadRequest, "Invalid category ID")
			return
		}
		categoryID = id
	}

	// Parse pagination
	limit, err := strconv.Atoi(q.Get("limit"))
	if err != nil || limit < 1 || limit > 100 {
		limit = 20
	}
	offset, err := strconv.Atoi(q.Get("offset"))
	if err != nil || offset < 0 {
		offset = 0
	}

	var currentUserID int
	if uid, ok := r.Context().Value(userIDKey).(int); ok {
		currentUserID = uid
	}

	posts, err := db.GetPostsFeed(currentUserID, categoryID, limit, offset)
	if err != nil {
		utils.Fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	if posts == nil {
		posts = []models.Post{}
	}

	utils.Success(w, http.StatusOK, posts)
}

func FetchOnePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	idStr := r.URL.Query().Get("id")
	postID, err := strconv.Atoi(idStr)
	if idStr == "" || err != nil {
		utils.Fail(w, http.StatusBadRequest, "Invalid or missing post ID")
		return
	}

	var currentUserID int
	if uid, ok := r.Context().Value(userIDKey).(int); ok {
		currentUserID = uid
	}

	post, err := db.GetPostByIDWithPrivacy(postID, currentUserID)
	if err != nil {
		if err.Error() == "not found" {
			utils.Fail(w, http.StatusNotFound, "Post not found")
		} else {
			utils.Fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}

	post.Votes, _ = db.GetVoteSum(post.ID, 0)

	utils.Success(w, http.StatusOK, map[string]any{"post": post})
}
