CREATE TABLE IF NOT EXISTS user_preference
(
    "user_id"    TEXT PRIMARY KEY NOT NULL,
    "table_display"    JSONB
);