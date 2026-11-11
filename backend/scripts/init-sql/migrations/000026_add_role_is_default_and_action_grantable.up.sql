-- Admin API MVP: the metadata the role and action management endpoints read.
--   role.is_default  — the seeded roles are locked: they cannot be edited or deleted, and the
--                      roles list returns the flag so the UI can hide those affordances.
--   action.grantable — can_manage_user is reserved for administrators: it stays out of the
--                      create-role action picker, so no custom role can ever confer it (which
--                      also makes tenant_admin un-duplicable).
-- Data-safe and idempotent.

ALTER TABLE public.role   ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;
ALTER TABLE public.action ADD COLUMN IF NOT EXISTS grantable  boolean NOT NULL DEFAULT true;

-- The four roles seeded by 000012 and 000018, in every tenant that has them.
UPDATE public.role SET is_default = true
WHERE code IN ('tenant_admin', 'member', 'geneticist', 'data_manager');

UPDATE public.action SET grantable = false WHERE code = 'can_manage_user';
