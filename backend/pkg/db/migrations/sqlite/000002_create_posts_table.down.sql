CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT COLLATE NOCASE NOT NULL,
    content TEXT NOT NULL,
    privacy TEXT NOT NULL DEFAULT 'public' CHECK(privacy IN ('public','followers','private')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);