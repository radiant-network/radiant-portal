DELETE from user_preference WHERE table_display is not null;
ALTER TABLE user_preference DROP CONSTRAINT user_preference_pkey;
ALTER TABLE user_preference RENAME COLUMN table_display to content;
ALTER TABLE user_preference ADD COLUMN key TEXT NOT NULL;
ALTER TABLE user_preference ADD CONSTRAINT user_preference_pkey PRIMARY KEY (user_id, key);