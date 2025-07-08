CREATE TABLE
    IF NOT EXISTS group_join_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        requester_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
        FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE (group_id, requester_id)
    );