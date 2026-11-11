-- Widen project's UNIQUE(code) to UNIQUE(code, tenant_code).
--
-- Migration 000013 tenant-scoped public.project (added tenant_code + FK + index) but
-- forgot to widen its unique constraint, leaving UNIQUE(code) global. project keeps its
-- integer PK, so tenant_code is a plain column and inbound FKs (cases.project_id → id)
-- are untouched; widening the unique key lets two tenants reuse the same project code —
-- the same treatment analysis_catalog & panel already got in 000013.

ALTER TABLE public.project DROP CONSTRAINT project_code_key;                  -- was UNIQUE (code)
ALTER TABLE public.project ADD CONSTRAINT project_code_key UNIQUE (code, tenant_code);
