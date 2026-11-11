-- Drop the last dependency on the uuid-ossp extension.
--
-- 000001 came from a pg_dump that installed pgcrypto and uuid-ossp; CREATE EXTENSION needs
-- CREATE on the database, which the app role doesn't have on managed Postgres, so both lines
-- were removed from 000001. pgcrypto was already unused (gen_random_uuid() is core since
-- Postgres 13) and user_set.id was the only object still defaulting to uuid_generate_v4().
-- Fresh databases now get gen_random_uuid() straight from 000001; this realigns the databases
-- that already ran the old 000001, so every environment ends up with the same schema.

ALTER TABLE public.user_set ALTER COLUMN id SET DEFAULT gen_random_uuid();
