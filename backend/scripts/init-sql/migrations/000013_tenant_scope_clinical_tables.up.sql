-- Tenant-scope the remaining PostgreSQL transactional tables.
--
-- Migration 000009 added tenant_code to the org-linked "root" tables
-- (organization, cases, patient, sample, sequencing_experiment) via compound FKs
-- to organization(code, tenant_code). This migration finishes the job: it adds
-- tenant_code to every other tenant-scoped table so the Go API can scope queries
-- to the active tenant (set by the SJRA-1444 middleware) in a follow-up.
--
-- Decisions (documented per ticket):
--   * FK references public.tenant(code) directly
--   * Backfill is an EXPLICIT `UPDATE ... SET tenant_code = 'radiant'`
--   * History tables get the column (+ NOT NULL + index) but NO FK. They are
--     append-only audit snapshots populated by tp_history_func via `SELECT ..., $5.*`
--     (positional), so the column MUST be appended last to both the live table and
--     its _history twin to keep the column order aligned; an FK on an audit log is
--     unusual and the trigger swallows foreign_key_violation, which would silently
--     drop history rows — so the FK belongs only on the live table.
--   * No DB DEFAULT: a default would silently route future inserts to radiant.
--     Inserts now set tenant_code explicitly — worker writes via types.DefaultTenantCode,
--     API writes via the same shared constant (TODO(multi-tenant): use the active
--     tenant from context).
--
-- Classification (instance = shared across the whole deployment; tenant = per-tenant):
--   * TENANT-scoped, added here: document, family, family_history, obs_categorical,
--     obs_string, occurrence_note, occurrence_flag, project, task, batch,
--     interpretation_germline/somatic (+ _history), analysis_catalog, panel, user_set.
--     (organization/cases/patient/sample/sequencing_experiment were done in 000009;
--     role/role_action/user_role already carry tenant_code.)
--   * analysis_catalog / panel / user_set keep their existing PK (integer id / uuid),
--     so tenant_code is a plain column and inbound FKs (which target id/uuid) are
--     untouched. analysis_catalog & panel widen their UNIQUE(code) → UNIQUE(code,
--     tenant_code) so two tenants can reuse a code.
--   * INSTANCE (left untouched): the 24 enum dictionaries (sex, status, sample_type,
--     priority, …); saved_filter, user_preference (user-global; saved_filter queries
--     are tenant-agnostic); pure join tables (case_has_sequencing_experiment,
--     task_context, task_has_document, panel_has_genes, user_set_*); and the identity/
--     global auth tables (tenant, users, action).

-- =============================================================================
-- 1. Clinical + operational tables: add tenant_code, backfill existing rows to
--    'radiant', then make it NOT NULL and index it. No DEFAULT (see header).
-- =============================================================================

-- File references
ALTER TABLE public.document ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.document SET tenant_code = 'radiant';
ALTER TABLE public.document ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_document_tenant_code ON public.document (tenant_code);

-- Clinical children of cases
ALTER TABLE public.family ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.family SET tenant_code = 'radiant';
ALTER TABLE public.family ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_family_tenant_code ON public.family (tenant_code);

ALTER TABLE public.family_history ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.family_history SET tenant_code = 'radiant';
ALTER TABLE public.family_history ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_family_history_tenant_code ON public.family_history (tenant_code);

ALTER TABLE public.obs_categorical ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.obs_categorical SET tenant_code = 'radiant';
ALTER TABLE public.obs_categorical ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_obs_categorical_tenant_code ON public.obs_categorical (tenant_code);

ALTER TABLE public.obs_string ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.obs_string SET tenant_code = 'radiant';
ALTER TABLE public.obs_string ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_obs_string_tenant_code ON public.obs_string (tenant_code);

-- Variant annotations on occurrences
ALTER TABLE public.occurrence_note ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.occurrence_note SET tenant_code = 'radiant';
ALTER TABLE public.occurrence_note ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_occurrence_note_tenant_code ON public.occurrence_note (tenant_code);

ALTER TABLE public.occurrence_flag ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.occurrence_flag SET tenant_code = 'radiant';
ALTER TABLE public.occurrence_flag ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_occurrence_flag_tenant_code ON public.occurrence_flag (tenant_code);

-- Operational tables (tenant-owned: a tenant's projects, pipeline tasks, batches)
ALTER TABLE public.project ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.project SET tenant_code = 'radiant';
ALTER TABLE public.project ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_project_tenant_code ON public.project (tenant_code);

ALTER TABLE public.task ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.task SET tenant_code = 'radiant';
ALTER TABLE public.task ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_task_tenant_code ON public.task (tenant_code);

ALTER TABLE public.batch ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.batch SET tenant_code = 'radiant';
ALTER TABLE public.batch ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_batch_tenant_code ON public.batch (tenant_code);

-- =============================================================================
-- 2. Interpretations (highest-traffic clinical writes) + their history twins.
--    Composite (tenant_code, case_id) on the live tables — interpretations are
--    looked up by case. The leading tenant_code also serves tenant-only scans, so
--    no separate plain (tenant_code) index is needed on these two.
--    Add tenant_code to the _history twin before backfilling the live table, and
--    disable trg_interpretation_* during the backfill: the trigger copies the live
--    row into _history via `$5.*`, which fails (or floods the audit log) if the
--    history column is missing/not-yet-NOT-NULL. Column appended last on both so the
--    trigger stays positionally aligned; history tables get NO FK.
-- =============================================================================
ALTER TABLE public.interpretation_germline         ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
ALTER TABLE public.interpretation_germline_history ADD COLUMN tenant_code varchar(50);
ALTER TABLE public.interpretation_germline DISABLE TRIGGER trg_interpretation_germline;
UPDATE public.interpretation_germline         SET tenant_code = 'radiant';
UPDATE public.interpretation_germline_history SET tenant_code = 'radiant';
ALTER TABLE public.interpretation_germline ENABLE TRIGGER trg_interpretation_germline;
ALTER TABLE public.interpretation_germline         ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.interpretation_germline_history ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_interpretation_germline_tenant_case
    ON public.interpretation_germline (tenant_code, case_id);
CREATE INDEX ix_interpretation_germline_history_tenant_code
    ON public.interpretation_germline_history (tenant_code);

ALTER TABLE public.interpretation_somatic         ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
ALTER TABLE public.interpretation_somatic_history ADD COLUMN tenant_code varchar(50);
ALTER TABLE public.interpretation_somatic DISABLE TRIGGER trg_interpretation_somatic;
UPDATE public.interpretation_somatic         SET tenant_code = 'radiant';
UPDATE public.interpretation_somatic_history SET tenant_code = 'radiant';
ALTER TABLE public.interpretation_somatic ENABLE TRIGGER trg_interpretation_somatic;
ALTER TABLE public.interpretation_somatic         ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.interpretation_somatic_history ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_interpretation_somatic_tenant_case
    ON public.interpretation_somatic (tenant_code, case_id);
CREATE INDEX ix_interpretation_somatic_history_tenant_code
    ON public.interpretation_somatic_history (tenant_code);

-- =============================================================================
-- 3. Tenant-scoped reference catalogs (analysis_catalog, panel) and user_set.
--    These keep their existing surrogate PK (integer id / uuid), so tenant_code is
--    a plain column and the inbound FKs (cases.analysis_catalog_id,
--    analysis_catalog.panel_id, panel_has_genes.panel_id, user_set_*.user_set_id)
--    — all targeting id/uuid — need no change. analysis_catalog & panel widen their
--    UNIQUE(code) to (code, tenant_code) so a code can be reused across tenants.
-- =============================================================================
ALTER TABLE public.analysis_catalog ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.analysis_catalog SET tenant_code = 'radiant';
ALTER TABLE public.analysis_catalog ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.analysis_catalog DROP CONSTRAINT case_analysis_code_key;   -- was UNIQUE (code)
ALTER TABLE public.analysis_catalog ADD CONSTRAINT case_analysis_code_key UNIQUE (code, tenant_code);
CREATE INDEX ix_analysis_catalog_tenant_code ON public.analysis_catalog (tenant_code);

ALTER TABLE public.panel ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.panel SET tenant_code = 'radiant';
ALTER TABLE public.panel ALTER COLUMN tenant_code SET NOT NULL;
ALTER TABLE public.panel DROP CONSTRAINT panel_code_key;                      -- was UNIQUE (code)
ALTER TABLE public.panel ADD CONSTRAINT panel_code_key UNIQUE (code, tenant_code);
CREATE INDEX ix_panel_tenant_code ON public.panel (tenant_code);

ALTER TABLE public.user_set ADD COLUMN tenant_code varchar(50) REFERENCES public.tenant(code);
UPDATE public.user_set SET tenant_code = 'radiant';
ALTER TABLE public.user_set ALTER COLUMN tenant_code SET NOT NULL;
CREATE INDEX ix_user_set_tenant_code ON public.user_set (tenant_code);

-- =============================================================================
-- 4. Indexes for the tables 000009 gave a tenant_code column but no index.
--    The acceptance criterion is "every tenant-scoped table has tenant_code with
--    an index"; 000009 added the columns but omitted the indexes.
--
--    cases is the highest-traffic table. Rather than add a standalone composite,
--    fold tenant_code into the existing partial unique index
--    uc_cases_submitter_case_id_filtered (000003): submitter_case_id uniqueness
--    becomes per-tenant, and with tenant_code leading the index doubles as the
--    required (tenant_code, <filter>) composite — its leftmost prefix also serves
--    tenant-only scans, so cases needs no extra tenant_code index.
-- =============================================================================
DROP INDEX IF EXISTS public.uc_cases_submitter_case_id_filtered;
CREATE UNIQUE INDEX uc_cases_submitter_case_id_filtered
    ON public.cases (tenant_code, project_id, submitter_case_id)
    WHERE (submitter_case_id IS NOT NULL AND submitter_case_id <> '');

CREATE INDEX ix_patient_tenant_code ON public.patient (tenant_code);
CREATE INDEX ix_sample_tenant_code ON public.sample (tenant_code);
CREATE INDEX ix_sequencing_experiment_tenant_code ON public.sequencing_experiment (tenant_code);
CREATE INDEX ix_organization_tenant_code ON public.organization (tenant_code);
