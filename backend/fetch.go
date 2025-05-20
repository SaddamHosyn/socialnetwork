package backend

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func FetchCategories(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	rows, err := db.Query(`SELECT id, name FROM categories ORDER BY name ASC`)
	if err != nil {
		log.Printf("Error fetching categories: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer rows.Close()

	var cats []Category
	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name); err != nil {
			log.Printf("Error scanning category: %v", err)
			continue
		}
		cats = append(cats, c)
	}
	if err := rows.Err(); err != nil {
		log.Printf("Error iterating categories: %v", err)
		// not fatal—you’ll still return whatever you got
	}

	success(w, http.StatusOK, cats)
}

func FetchAllPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Parse filters
	q := r.URL.Query()
	var categoryID int
	if s := q.Get("category_id"); s != "" {
		id, err := strconv.Atoi(s)
		if err != nil {
			fail(w, http.StatusBadRequest, "Invalid category ID")
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

	// Grab current user from context (if any)
	var currentUserID any = nil
	if uid, ok := r.Context().Value(userIDKey).(int); ok {
		currentUserID = uid
	}

	const sqlQuery = `
SELECT 
  p.id, p.user_id, u.nickname, p.title, p.content, 
  p.image_path, p.created_at,
  COALESCE(v.total_votes, 0) AS votes,
  COALESCE(uv.user_vote, 0) AS user_vote,
  GROUP_CONCAT(DISTINCT c.name) AS cats,
  GROUP_CONCAT(pi.image_path) AS extra_images
FROM posts p
LEFT JOIN post_images pi ON pi.post_id = p.id
JOIN users u ON u.id = p.user_id
LEFT JOIN (
  SELECT post_id, SUM(vote_type) AS total_votes 
  FROM votes 
  WHERE post_id IS NOT NULL 
  GROUP BY post_id
) v ON v.post_id = p.id
LEFT JOIN (
  SELECT post_id, vote_type AS user_vote 
  FROM votes 
  WHERE user_id = ? AND post_id IS NOT NULL
) uv ON uv.post_id = p.id
LEFT JOIN post_categories pc ON pc.post_id = p.id
LEFT JOIN categories c ON c.id = pc.category_id
WHERE ? = 0 OR EXISTS (
  SELECT 1 FROM post_categories pc2 
  WHERE pc2.post_id = p.id AND pc2.category_id = ?
)
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;
`
	rows, err := db.Query(
		sqlQuery,
		currentUserID,
		categoryID,
		categoryID,
		limit,
		offset,
	)
	if err != nil {
		log.Printf("FetchAllPosts query error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		var catNames, extraImages sql.NullString
		if err := rows.Scan(
			&p.ID, &p.UserID, &p.Nickname, &p.Title, &p.Content,
			&p.ImagePath, &p.CreatedAt, &p.Votes, &p.UserVote, &catNames, &extraImages,
		); err != nil {
			log.Printf("FetchAllPosts scan error: %v", err)
			continue
		}
		p.ImagePaths = []string{p.ImagePath}
		if extraImages.Valid && extraImages.String != "" {
			p.ImagePaths = append(p.ImagePaths, strings.Split(extraImages.String, ",")...)
		}
		if catNames.Valid && catNames.String != "" {
			p.Categories = strings.Split(catNames.String, ",")
		} else {
			p.Categories = []string{}
		}
		posts = append(posts, p)
	}
	if err := rows.Err(); err != nil {
		log.Printf("FetchAllPosts rows error: %v", err)
	}
	if len(posts) == 0 {
		posts = []Post{} // Explicit empty array
	}

	success(w, http.StatusOK, posts)
}

func FetchOnePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	idStr := r.URL.Query().Get("id")
	postID, err := strconv.Atoi(idStr)
	if idStr == "" || err != nil {
		fail(w, http.StatusBadRequest, "Invalid or missing post ID")
		return
	}

	var post Post
	var catNames sql.NullString
	err = db.QueryRow(
		`SELECT p.id, p.user_id, u.nickname, p.title, p.content, p.image_path, p.created_at,
		   IFNULL(GROUP_CONCAT(DISTINCT c.name), '') AS cats
		 FROM posts p
		 JOIN users u ON p.user_id = u.id
		 LEFT JOIN post_categories pc ON pc.post_id = p.id
		 LEFT JOIN categories c ON c.id = pc.category_id
		 WHERE p.id = ?
		 GROUP BY p.id`,
		postID,
	).Scan(
		&post.ID, &post.UserID, &post.Nickname, &post.Title,
		&post.Content, &post.ImagePath, &post.CreatedAt,
		&catNames,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			fail(w, http.StatusNotFound, "Post not found")
		} else {
			log.Printf("Post fetch error: %v", err)
			fail(w, http.StatusInternalServerError, "Server error")
		}
		return
	}
	if catNames.Valid && catNames.String != "" {
		post.Categories = strings.Split(catNames.String, ",")
	}

	// fetch extra images
	rows, err := db.Query(`SELECT image_path FROM post_images WHERE post_id = ? ORDER BY position`, postID)
	if err != nil {
		log.Printf("post_images query error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer rows.Close()

	post.ImagePaths = []string{post.ImagePath}
	for rows.Next() {
		var img string
		if err := rows.Scan(&img); err != nil {
			log.Printf("post_images scan error: %v", err)
			continue
		}
		post.ImagePaths = append(post.ImagePaths, img)
	}

	post.Votes, _ = FetchVotes(post.ID, 0)

	success(w, http.StatusOK, map[string]any{
		"post": post,
	})
}

func FetchUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// get the session token
	cookie, err := r.Cookie("session_token")
	if err != nil {
		http.Error(w, "Missing session token", http.StatusUnauthorized)
		log.Println("Missing session token:", err)
		return
	}

	token := cookie.Value

	//get the current user
	currentUser, err := CurrentUser("forum.db", token)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Println("Error getting current user:", err)
		return
	}

	// anything older than 10m is "offline"
	threshold := time.Now().UTC().Add(-10 * time.Minute)

	rows, err := db.Query(`
SELECT DISTINCT u.id, u.nickname, u.last_active_at
FROM users u
LEFT JOIN (
    SELECT 
        CASE 
            WHEN sender_id = ? THEN receiver_id 
            ELSE sender_id 
        END AS other_user_id,
        MAX(sent_at) AS last_message_at
    FROM messages
    WHERE sender_id = ? OR receiver_id = ?
    GROUP BY other_user_id
) m ON u.id = m.other_user_id
WHERE u.id != ?
ORDER BY 
    CASE 
        WHEN m.last_message_at IS NOT NULL THEN 0 
        ELSE 1 
    END,
    m.last_message_at DESC,
    u.nickname;
    `, currentUser.ID, currentUser.ID, currentUser.ID, currentUser.ID)

	if err != nil {
		log.Printf("Fetch users error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer rows.Close()

	var users []PublicUser
	for rows.Next() {
		var user PublicUser
		var lastActive sql.NullTime
		if err := rows.Scan(&user.ID, &user.Nickname, &lastActive); err != nil {
			log.Printf("User scan error: %v", err)
			continue
		}
		user.Online = lastActive.Valid && lastActive.Time.After(threshold)
		users = append(users, user)
	}
	if err := rows.Err(); err != nil {
		log.Printf("Error iterating users: %v", err)
	}

	success(w, http.StatusOK, users)
}

func FetchProfile(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(userIDKey).(int)
	if !ok {
		fail(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// 1) Fetch basic user info
	var (
		uid      int
		nick     string
		fn, ln   string
		age      int
		genderID int
		email    string
	)
	err := db.QueryRow(`
        SELECT id, nickname, first_name, last_name, age, gender, email
          FROM users
         WHERE id = ?`,
		userID,
	).Scan(&uid, &nick, &fn, &ln, &age, &genderID, &email)
	if err == sql.ErrNoRows {
		fail(w, http.StatusNotFound, "User not found")
		return
	} else if err != nil {
		log.Printf("FetchProfile user query error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}

	// Map gender code → string
	var gender string
	switch genderID {
	case 1:
		gender = "Male"
	case 2:
		gender = "Female"
	case 3:
		gender = "Alien"
	default:
		gender = "Unknown"
	}

	// 2) Fetch all of the user's posts in one go
	postRows, err := db.Query(`
      SELECT
        p.id,
        p.title,
        p.content,
        p.image_path,
        p.created_at,
        COALESCE(SUM(v.vote_type),0)  AS votes,
        IFNULL(GROUP_CONCAT(DISTINCT c.name), '') AS categories
      FROM posts p
      LEFT JOIN votes v   ON v.post_id = p.id
      LEFT JOIN post_categories pc ON pc.post_id = p.id
      LEFT JOIN categories c       ON c.id = pc.category_id
     WHERE p.user_id = ?
     GROUP BY p.id
     ORDER BY p.created_at DESC
    `, userID)
	if err != nil {
		log.Printf("FetchProfile posts query error: %v", err)
		fail(w, http.StatusInternalServerError, "Failed to fetch posts")
		return
	}
	defer postRows.Close()

	var posts []Post
	for postRows.Next() {
		var p Post
		var cats sql.NullString
		if err := postRows.Scan(
			&p.ID, &p.Title, &p.Content, &p.ImagePath, &p.CreatedAt,
			&p.Votes, &cats,
		); err != nil {
			log.Printf("FetchProfile post scan error: %v", err)
			continue
		}
		p.UserID = uid
		p.Nickname = nick
		if cats.Valid && cats.String != "" {
			p.Categories = strings.Split(cats.String, ",")
		}
		p.ImagePaths = []string{p.ImagePath}

		imgRows, err := db.Query(
			`SELECT image_path
           FROM post_images
          WHERE post_id = ?
       ORDER BY position`,
			p.ID,
		)
		if err != nil {
			log.Printf("FetchProfile images query error: %v", err)
		} else {
			defer imgRows.Close()
			for imgRows.Next() {
				var extra string
				if err := imgRows.Scan(&extra); err != nil {
					log.Printf("FetchProfile image scan error: %v", err)
					continue
				}
				p.ImagePaths = append(p.ImagePaths, extra)
			}
		}
		posts = append(posts, p)
	}
	if err := postRows.Err(); err != nil {
		log.Printf("FetchProfile posts iteration error: %v", err)
	}

	// 3) Fetch all of the user's comments in one go
	commentRows, err := db.Query(`
      SELECT
        c.id,
        c.post_id,
        c.content,
        c.created_at,
        COALESCE(SUM(v.vote_type),0) AS votes
      FROM comments c
      LEFT JOIN votes v ON v.comment_id = c.id
     WHERE c.user_id = ?
     GROUP BY c.id
     ORDER BY c.created_at DESC
    `, userID)
	if err != nil {
		log.Printf("FetchProfile comments query error: %v", err)
		fail(w, http.StatusInternalServerError, "Failed to fetch comments")
		return
	}
	defer commentRows.Close()

	var comments []Comment
	for commentRows.Next() {
		var c Comment
		if err := commentRows.Scan(
			&c.ID, &c.PostID, &c.Content, &c.CreatedAt, &c.Votes,
		); err != nil {
			log.Printf("FetchProfile comment scan error: %v", err)
			continue
		}
		c.UserID = uid
		c.Nickname = nick
		comments = append(comments, c)
	}
	if err := commentRows.Err(); err != nil {
		log.Printf("FetchProfile comments iteration error: %v", err)
	}

	// 4) Assemble and send
	profile := UserProfile{
		User: struct {
			ID        int    `json:"id"`
			Nickname  string `json:"nickname"`
			FirstName string `json:"first_name"`
			LastName  string `json:"last_name"`
			Age       int    `json:"age"`
			Gender    string `json:"gender"`
			Email     string `json:"email"`
		}{
			ID:        uid,
			Nickname:  nick,
			FirstName: fn,
			LastName:  ln,
			Age:       age,
			Gender:    gender,
			Email:     email,
		},
		Posts:    posts,
		Comments: comments,
	}

	success(w, http.StatusOK, profile)
}

func FetchComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		fail(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	q := r.URL.Query()
	postID, err := strconv.Atoi(q.Get("post_id"))
	if err != nil {
		fail(w, http.StatusBadRequest, "Invalid post ID")
		return
	}

	// pagination
	limit, _ := strconv.Atoi(q.Get("limit"))
	if limit <= 0 || limit > 100 {
		limit = 50
	}
	offset, _ := strconv.Atoi(q.Get("offset"))
	if offset < 0 {
		offset = 0
	}

	rows, err := db.Query(`
      SELECT c.id, c.user_id, u.nickname, c.content, c.created_at,
             COALESCE(SUM(v.vote_type),0) AS votes
      FROM comments c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN votes v ON v.comment_id = c.id
      WHERE c.post_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `, postID, limit, offset)
	if err != nil {
		log.Printf("FetchComments error: %v", err)
		fail(w, http.StatusInternalServerError, "Server error")
		return
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var c Comment
		if err := rows.Scan(&c.ID, &c.UserID, &c.Nickname, &c.Content, &c.CreatedAt, &c.Votes); err != nil {
			log.Printf("FetchComments scan error: %v", err)
			continue
		}
		comments = append(comments, c)
	}
	if err := rows.Err(); err != nil {
		log.Printf("FetchComments rows error: %v", err)
	}

	success(w, http.StatusOK, comments)
}

func FetchVotes(postID, commentID int) (int, error) {
	var total int
	var err error

	if postID != 0 {
		err = db.QueryRow("SELECT IFNULL(SUM(vote_type), 0) FROM votes WHERE post_id = ?", postID).Scan(&total)
	} else if commentID != 0 {
		err = db.QueryRow("SELECT IFNULL(SUM(vote_type), 0) FROM votes WHERE comment_id = ?", commentID).Scan(&total)
	} else {
		return 0, errors.New("invalid vote target")
	}

	return total, err
}

func CurrentUser(path, val string) (User, error) {
	log.Println("fetching current user")

	query, err := db.Query(`
		SELECT users.id, users.nickname, users.first_name, users.last_name, users.gender, users.email 
		FROM sessions 
		INNER JOIN users ON sessions.user_id = users.id 
		WHERE sessions.token = ?`, val)
	if err != nil {
		return User{}, err
	}
	defer query.Close()

	users, err := ConvertRowToUser(query)
	if err != nil {
		return User{}, err
	}

	log.Println("users: ", users)

	if len(users) == 0 {
		return User{}, errors.New("no users found")
	}

	return users[0], nil
}

// Convert the database row into a user struct
func ConvertRowToUser(rows *sql.Rows) ([]User, error) {
	var users []User

	for rows.Next() {
		var user User

		// Store the row data in the temporary user struct
		err := rows.Scan(
			&user.ID,
			&user.Nickname,
			&user.FirstName,
			&user.LastName,
			&user.Gender,
			&user.Email)

		if err != nil {
			log.Printf("Row scan error: %v", err)
			break
		}
		log.Println("user", user)

		// Append the temporary user struct to the users slice
		users = append(users, user)
	}

	return users, nil
}
