DELETE from user_preference WHERE content is not null;
ALTER TABLE user_preference DROP CONSTRAINT user_preference_pkey;
ALTER TABLE user_preference RENAME COLUMN content to table_display;
ALTER TABLE user_preference DROP COLUMN key;
ALTER TABLE user_preference ADD CONSTRAINT user_preference_pkey PRIMARY KEY (user_id);