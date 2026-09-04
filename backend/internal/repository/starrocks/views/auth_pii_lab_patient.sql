-- Which patients a can_read_pii grant at a *diagnosis lab* reaches: the reveal follows the
-- work, so a grant at the lab running a case unmasks that case's patients whatever hospital
-- referred them. Complements auth.pii_grant, which the patient view keys on the patient's
-- own organization; a patient is unmasked by either path.
--
-- A patient reaches a case two ways and both count: as the proband (cases.proband_id) and as
-- a family member (family.family_member_id). Ingestion does write a family row per patient,
-- proband included, so the branches overlap on well-formed data — but only proband_id is
-- NOT NULL. Without its own branch, a case whose family rows were never written would keep
-- its proband masked from the lab running it, a reveal failing on data quality rather than
-- policy. The family branch is what covers everyone else (mother, father, siblings).
--
-- Reading through auth.pii_grant means '*' grants are already expanded to every org.
CREATE OR REPLACE VIEW auth.pii_lab_patient AS
SELECT g.user_id, g.tenant_code, c.proband_id AS patient_id
FROM auth.pii_grant g
JOIN radiant_jdbc.public.cases c
  ON c.tenant_code = g.tenant_code AND c.diagnosis_lab_code = g.org_code
UNION
SELECT g.user_id, g.tenant_code, f.family_member_id AS patient_id
FROM auth.pii_grant g
JOIN radiant_jdbc.public.cases c
  ON c.tenant_code = g.tenant_code AND c.diagnosis_lab_code = g.org_code
JOIN radiant_jdbc.public.family f
  ON f.case_id = c.id
