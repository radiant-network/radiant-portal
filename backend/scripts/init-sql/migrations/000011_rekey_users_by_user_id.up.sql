-- Re-key identity from email to user_id (the Keycloak `sub`).
--
-- Migration 000009 keyed users by email (the identifier known at invite time,
-- before first login). We now make user_id the required, unique identity and
-- demote email to an optional attribute. Consequence: a user must exist in
-- Keycloak (have a `sub`) before they can be granted roles — pre-provisioning by
-- email alone is no longer possible. The backfill source (cmd/migrate-authdb)
-- reads the Keycloak admin API, which supplies `sub` for every user, so this is a
-- natural fit and lets users without an email be migrated.
--
-- Data-safe: public.users and public.user_role are empty in every environment
-- (the backfill has not run yet), so no row migration is required.

-- The user_role → users(email) FK must go before users' email PK can be dropped.
ALTER TABLE public.user_role DROP CONSTRAINT user_role_email_fkey;

-- =============================================================================
-- 1. users: user_id becomes the identity; email becomes an optional attribute.
-- =============================================================================
ALTER TABLE public.users DROP CONSTRAINT users_pkey;        -- was PRIMARY KEY (email)
ALTER TABLE public.users ALTER COLUMN email DROP NOT NULL;  -- PK implied NOT NULL; lift it
ALTER TABLE public.users ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.users ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

-- =============================================================================
-- 2. user_role: re-key from email to user_id.
-- =============================================================================
-- The two partial unique indexes are keyed on email; drop them before the column.
DROP INDEX public.user_role_unique_org_grant;
DROP INDEX public.user_role_unique_tenant_grant;

ALTER TABLE public.user_role ADD COLUMN user_id varchar(255);
ALTER TABLE public.user_role ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_role DROP COLUMN email;
ALTER TABLE public.user_role
    ADD CONSTRAINT user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);

-- Recreate uniqueness on (user_id, ...) — same two-partial-index trick as 000009
-- (PG 14 lacks NULLS NOT DISTINCT): one index for org-scoped grants, one for
-- tenant-wide grants (org_code IS NULL).
CREATE UNIQUE INDEX user_role_unique_org_grant ON public.user_role
    (user_id, tenant_code, role_code, org_code) WHERE org_code IS NOT NULL;
CREATE UNIQUE INDEX user_role_unique_tenant_grant ON public.user_role
    (user_id, tenant_code, role_code) WHERE org_code IS NULL;
