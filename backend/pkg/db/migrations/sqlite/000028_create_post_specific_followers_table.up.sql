CREATE TABLE
    IF NOT EXISTS post_specific_followers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        follower_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
        FOREIGN KEY (follower_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE (post_id, follower_id)
    );