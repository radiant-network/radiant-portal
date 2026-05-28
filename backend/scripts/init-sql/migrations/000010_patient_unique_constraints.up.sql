-- A patient is uniquely identified by its submitter id within an organization. The
-- multi-tenancy migration (000009) replaced organization_id with organization_code on patient.
ALTER TABLE public.patient
    ADD CONSTRAINT patient_org_submitter_id_key UNIQUE (organization_code, submitter_patient_id);

-- jhn (Joint Health Number) is unique when present, but optional: newborns/fetuses have
-- none yet, so allow many rows without a jhn via a partial unique index.
CREATE UNIQUE INDEX patient_jhn_key ON public.patient (jhn) WHERE jhn IS NOT NULL AND jhn <> '';
