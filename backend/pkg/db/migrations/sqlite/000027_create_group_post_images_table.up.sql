CREATE TABLE
    IF NOT EXISTS group_post_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_post_id INTEGER NOT NULL,
        image_path TEXT,
        position INTEGER NOT NULL,
        FOREIGN KEY (group_post_id) REFERENCES group_posts (id) ON DELETE CASCADE
    );