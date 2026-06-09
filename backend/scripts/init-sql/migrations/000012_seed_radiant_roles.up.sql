-- Seed the role catalog for the `radiant` tenant.
--
-- Migration 000009 created the tenant + action catalog but intentionally seeded
-- NO roles ("tenants define their own"). Before the user backfill (cmd/migrate-authdb)
-- can grant anything, the roles those grants reference must exist. This migration
-- defines the three roles that encode the two authorization use-cases that exist
-- today, plus the read/interpret split:
--
--   member       — base "see data" role: search cases, view the knowledge base,
--                  download files. Every existing portal user gets this.
--   geneticist   — clinical write/PII role: read PII, interpret/comment/flag
--                  variants. Granted alongside `member` to existing users to
--                  preserve today's full-portal behaviour; kept as a separate
--                  role so read-only users can be split off later without
--                  touching this catalog.
--   data_manager — batch-ingestion role (maps the Keycloak `data_manager` role):
--                  submit batches. Granted on top of member+geneticist to users
--                  who hold the Keycloak `data_manager` client role.
--
-- Data-safe and idempotent: ON CONFLICT DO NOTHING throughout, so re-running on a
-- database that already has these rows is a no-op. Action codes reference the
-- catalog seeded in 000009; scope (org vs tenant) is a property of the action, not
-- the role_action row.

-- =============================================================================
-- 1. Roles (per-tenant catalog)
-- =============================================================================
INSERT INTO public.role (tenant_code, code, name, description) VALUES
    ('radiant', 'member',       'Member',       'Search cases, view the knowledge base, and download files.'),
    ('radiant', 'geneticist',   'Geneticist',   'Read PII and interpret, comment on, and flag variants.'),
    ('radiant', 'data_manager', 'Data Manager', 'Submit batches (cases, patients, samples, sequencing).')
ON CONFLICT (tenant_code, code) DO NOTHING;

-- =============================================================================
-- 2. Role → action mappings
-- =============================================================================
INSERT INTO public.role_action (tenant_code, role_code, action_code) VALUES
    -- member: read-only portal access
    ('radiant', 'member',       'can_search_case'),    -- tenant-scoped
    ('radiant', 'member',       'can_view_kb'),         -- tenant-scoped
    ('radiant', 'member',       'can_download_file'),   -- org-scoped

    -- geneticist: PII + clinical writes
    ('radiant', 'geneticist',   'can_read_pii'),        -- org-scoped
    ('radiant', 'geneticist',   'can_interpret_variant'),-- org-scoped
    ('radiant', 'geneticist',   'can_comment_variant'), -- org-scoped
    ('radiant', 'geneticist',   'can_flag_variant'),    -- org-scoped

    -- data_manager: batch ingestion
    ('radiant', 'data_manager', 'can_ingest_data')      -- org-scoped
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;
