CREATE TABLE
    IF NOT EXISTS group_event_responses (
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        response TEXT NOT NULL CHECK (response IN ('going', 'not_going')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES group_events (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        PRIMARY KEY (event_id, user_id)
    );