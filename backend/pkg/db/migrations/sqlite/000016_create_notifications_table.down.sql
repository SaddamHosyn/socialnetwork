CREATE TABLE IF NOT EXISTS notifications (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL,
    type          TEXT    NOT NULL,              
    reference_id  INTEGER,                      
    content       TEXT    NOT NULL,
    is_read       INTEGER NOT NULL DEFAULT 0 CHECK (is_read IN (0,1)),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);