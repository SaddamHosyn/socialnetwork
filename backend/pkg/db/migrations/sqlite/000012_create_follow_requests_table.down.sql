CREATE TABLE IF NOT EXISTS follow_requests (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id INTEGER NOT NULL,
    requestee_id INTEGER NOT NULL,
    status       TEXT    NOT NULL CHECK (status IN ('pending','accepted','declined')),
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requestee_id) REFERENCES users(id) ON DELETE CASCADE
);
