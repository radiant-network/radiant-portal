-- Distribution list of a laboratory for the data-availability notifications, comma-separated.
-- NULL = no list. Stored as text (not text[]) so it federates through the StarRocks JDBC catalog.
ALTER TABLE public.organization ADD COLUMN IF NOT EXISTS notification_emails text;
