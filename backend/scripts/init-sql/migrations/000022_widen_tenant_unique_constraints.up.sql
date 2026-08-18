-- Widen patient's UNIQUE(organization_code, submitter_patient_id) to include tenant_code.
--
-- Migration 000010 added this constraint before multi-tenancy existed; 000009/000013 added
-- patient.tenant_code but never widened this key, so two tenants could not each hold a patient
-- with the same (organization_code, submitter_patient_id) — the same class of oversight 000014
-- fixed for project.code.

ALTER TABLE public.patient DROP CONSTRAINT patient_org_submitter_id_key;
ALTER TABLE public.patient ADD CONSTRAINT patient_org_submitter_id_key UNIQUE (organization_code, tenant_code, submitter_patient_id);

-- patient_jhn_key (000010) is the same class of oversight: global across tenants, never widened
-- when tenant_code was added. Recreate it including tenant_code, keeping the partial clause so a
-- missing/blank jhn (newborns/fetuses) still doesn't collide.
DROP INDEX public.patient_jhn_key;
CREATE UNIQUE INDEX patient_jhn_key ON public.patient (jhn, tenant_code) WHERE jhn IS NOT NULL AND jhn <> '';

-- fetus_org_submitter_id_key (000021) has the same bug: fetus carries tenant_code NOT NULL but
-- its unique key never included it.
ALTER TABLE public.fetus DROP CONSTRAINT fetus_org_submitter_id_key;
ALTER TABLE public.fetus ADD CONSTRAINT fetus_org_submitter_id_key UNIQUE (organization_code, tenant_code, submitter_fetus_id);
