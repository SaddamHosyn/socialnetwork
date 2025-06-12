CREATE TABLE IF NOT EXISTS followers (
    follower_id INTEGER NOT NULL,
    followee_id INTEGER NOT NULL,
    followed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, followee_id)
);