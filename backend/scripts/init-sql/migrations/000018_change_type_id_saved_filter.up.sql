CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE saved_filter ADD COLUMN new_id UUID DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE saved_filter DROP CONSTRAINT saved_filter_pkey;
ALTER TABLE saved_filter ADD PRIMARY KEY (new_id);
ALTER TABLE saved_filter DROP COLUMN id;
ALTER TABLE saved_filter RENAME COLUMN new_id TO id;
