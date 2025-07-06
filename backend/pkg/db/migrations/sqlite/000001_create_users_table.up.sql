CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE COLLATE NOCASE NOT NULL,
    password TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender INTEGER NOT NULL CHECK (gender IN (1, 2, 3)),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    nickname TEXT UNIQUE COLLATE NOCASE,
    avatar TEXT,
    about_me TEXT,
    is_private INTEGER NOT NULL DEFAULT 0 CHECK(is_private IN (0,1)),
    last_active_at DATETIME
);