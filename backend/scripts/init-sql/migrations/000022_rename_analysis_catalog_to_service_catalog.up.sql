-- =============================================================================
-- Generalize the case-level analysis catalog into a service catalog holding both
-- analysis-level services (RGDI, MMG — ordered for a case) and experiment-level
-- services (MSSS 75020/75022/65241/65240 — ordered for a sequencing request).
-- Both are ServiceRequest.code in FHIR, so they share one table discriminated by
-- `type`, which is why `sequencing_request` (000023) depends on this migration.
--
-- Decisions:
--   * Pure rename + additive columns. No constraint relaxation, no null backfill:
--     cases.service_id stays NOT NULL (the case-level analysis is always known at
--     order time).
--   * `type` is NOT part of the unique key, which stays UNIQUE (code, tenant_code).
--     A code therefore cannot be reused across types within a tenant. Widening the
--     key would force a type column into every inbound FK.
--   * No DEFAULT on `type` — same reasoning as tenant_code in 000013: a default
--     would silently classify a future sequencing seed as 'case'. Nothing in Go
--     inserts catalog rows (seeds only), so a stale seed fails loudly instead.
--   * API field aliases and JSON keys do NOT change (analysis_catalog_code,
--     analysis_catalog_name, prescriber, the batch key analysis_code). Those
--     strings are persisted inside saved_filter.queries (jsonb) as filter/sort
--     identifiers, so renaming one silently breaks every saved filter using it.
--     The only externally visible change is the value-set URL segment.
--   * Forward-only: the repo has no .down.sql. Any correction is a new migration.
-- =============================================================================

ALTER TABLE public.analysis_catalog RENAME TO service_catalog;

-- name -> name_en aligns with every other reference table and fixes
-- GET /value_sets/service_catalog, which selects name_en on a table that only had
-- name and therefore errored on every call.
ALTER TABLE public.service_catalog RENAME COLUMN name TO name_en;
ALTER TABLE public.service_catalog ADD COLUMN name_fr text;
-- The radiant rows are seeded in English; every other tenant's rows come from the
-- qlin seed, which is French. Copy those into name_fr so the French label survives:
-- nothing in the repo re-applies scripts/init-sql/qlin/*.sql, so this migration is
-- the only thing that carries it over.
UPDATE public.service_catalog SET name_fr = name_en WHERE tenant_code <> 'radiant';

ALTER TABLE public.service_catalog ADD COLUMN type text;
UPDATE public.service_catalog SET type = 'case';
ALTER TABLE public.service_catalog ALTER COLUMN type SET NOT NULL;

-- The table was renamed from case_analysis long ago; its constraints, index and
-- identity sequence still carry that name. This is the migration that touches them.
ALTER TABLE public.service_catalog RENAME CONSTRAINT case_analysis_pkey TO service_catalog_pkey;
ALTER TABLE public.service_catalog RENAME CONSTRAINT case_analysis_code_key TO service_catalog_code_key;
ALTER TABLE public.service_catalog RENAME CONSTRAINT case_analysis_panel_id_fkey TO service_catalog_panel_id_fkey;
ALTER INDEX public.ix_analysis_catalog_tenant_code RENAME TO ix_service_catalog_tenant_code;
ALTER SEQUENCE public.case_analysis_id_seq RENAME TO service_catalog_id_seq;

-- =============================================================================
-- cases: request-level fields. None of these is a practitioner FK, so none was
-- blocked on the practitioner model. requester / supervisor stay free text (no FK,
-- no validation); requester_organization_code stays a real compound FK to
-- organization(code, tenant_code) — rename only, no type change.
-- =============================================================================

ALTER TABLE public.cases RENAME COLUMN analysis_catalog_id TO service_id;
ALTER TABLE public.cases RENAME COLUMN ordering_physician TO requester;
ALTER TABLE public.cases RENAME COLUMN ordering_organization_code TO requester_organization_code;
ALTER TABLE public.cases ADD COLUMN supervisor text;

-- PostgreSQL updates a constraint's definition on column rename but keeps its name.
ALTER TABLE public.cases RENAME CONSTRAINT case_case_analysis_id_fkey TO cases_service_fkey;
ALTER TABLE public.cases RENAME CONSTRAINT cases_ordering_organization_fkey TO cases_requester_organization_fkey;
