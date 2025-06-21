CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    comment_id INTEGER,
    user_id INTEGER NOT NULL,
    vote_type INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE RESTRICT,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_votes_post_id    ON votes(post_id); 
CREATE INDEX IF NOT EXISTS idx_votes_comment_id ON votes(comment_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_post_vote
  ON votes(user_id, post_id)
  WHERE post_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_comment_vote
  ON votes(user_id, comment_id)
  WHERE comment_id IS NOT NULL;