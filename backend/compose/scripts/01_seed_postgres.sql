-- =============================================================================
-- 01_seed_postgres.sql — multi-tenant PII-masking seed data
-- =============================================================================
-- Run directly against Postgres (JDBC-catalog inserts are unsupported, so we
-- seed the source DB and let StarRocks federate it via radiant_jdbc):
--
--   PGPASSWORD=radiant psql -h localhost -U radiant -d radiant -p 5432 \
--       -f 01_seed_postgres.sql
--
-- Idempotent: safe to re-run. Uses the real auth model from migration 000009
-- (public.tenant / organization / users / role / action / role_action /
-- user_role). Rule simulated downstream: a user sees a patient's PII only if
-- they hold can_read_pii for that patient's organization.
-- =============================================================================

BEGIN;

-- --- 2 tenants --------------------------------------------------------------
INSERT INTO public.tenant (code, name) VALUES
    ('tenant_a', 'Tenant A'),
    ('tenant_b', 'Tenant B')
ON CONFLICT (code) DO NOTHING;

-- --- Organizations (same schema across tenants) -----------------------------
INSERT INTO public.organization (code, tenant_code, name, category_code) VALUES
    ('ORG_A1', 'tenant_a', 'Tenant A — Hospital 1', 'healthcare_provider'),
    ('ORG_A2', 'tenant_a', 'Tenant A — Hospital 2', 'healthcare_provider'),
    ('ORG_B1', 'tenant_b', 'Tenant B — Hospital 1', 'healthcare_provider'),
    ('ORG_B2', 'tenant_b', 'Tenant B — Hospital 2', 'healthcare_provider')
ON CONFLICT (code, tenant_code) DO NOTHING;

-- --- Patients (ids >= 1001 to avoid colliding with existing seed 1..3) -------
INSERT INTO public.patient
    (id, submitter_patient_id, submitter_patient_id_type, organization_code,
     tenant_code, sex_code, date_of_birth, life_status_code, first_name, last_name, jhn)
VALUES
    -- tenant_a / ORG_A1
    (1001, 'MRN-A1-0001', 'mrn', 'ORG_A1', 'tenant_a', 'female', '2011-04-12', 'alive', 'Alice', 'Martin',   'MAR1104120011'),
    (1002, 'MRN-A1-0002', 'mrn', 'ORG_A1', 'tenant_a', 'male',   '1989-09-30', 'alive', 'Bob',   'Tremblay', 'TRE8909300022'),
    -- tenant_a / ORG_A2
    (1003, 'MRN-A2-0001', 'mrn', 'ORG_A2', 'tenant_a', 'female', '2004-01-08', 'alive', 'Carol', 'Roy',      'ROY0401080033'),
    -- tenant_b / ORG_B1
    (2001, 'MRN-B1-0001', 'mrn', 'ORG_B1', 'tenant_b', 'male',   '1995-12-19', 'alive', 'David', 'Smith',    'SMI9512190044'),
    -- tenant_b / ORG_B2
    (2002, 'MRN-B2-0001', 'mrn', 'ORG_B2', 'tenant_b', 'female', '2018-06-25', 'alive', 'Eve',   'Johnson',  'JOH1806250055')
ON CONFLICT (id) DO NOTHING;

-- --- Roles (one per tenant; each grants can_read_pii) ------------------------
INSERT INTO public.role (tenant_code, code, name, description) VALUES
    ('tenant_a', 'geneticist', 'Geneticist', 'Clinician who may read PII at their org'),
    ('tenant_b', 'geneticist', 'Geneticist', 'Clinician who may read PII at their org')
ON CONFLICT (tenant_code, code) DO NOTHING;

INSERT INTO public.role_action (tenant_code, role_code, action_code) VALUES
    ('tenant_a', 'geneticist', 'can_read_pii'),
    ('tenant_b', 'geneticist', 'can_read_pii')
ON CONFLICT (tenant_code, role_code, action_code) DO NOTHING;

-- --- Demo users -------------------------------------------------------------
-- user_id is the StarRocks/IdP login identifier (Keycloak `sub` in prod; a
-- readable handle here). StarRocks usernames cannot contain '@', so the bridge
-- between StarRocks current_user() and the email-keyed auth model is user_id,
-- not email. ON CONFLICT updates user_id so re-runs converge.
-- dora is a platform admin: she has NO can_read_pii grant anywhere, yet will
-- see all PII because Ranger admin_role bypasses masking (role-based bypass,
-- independent of the action model).
INSERT INTO public.users (email, user_id, first_name, last_name) VALUES
    ('alice@demo.org', 'alice', 'Alice', 'Demo'),
    ('bob@demo.org',   'bob',   'Bob',   'Demo'),
    ('wendy@demo.org', 'wendy', 'Wendy', 'Demo'),
    ('dora@demo.org',  'dora',  'Dora',  'Admin')
ON CONFLICT (email) DO UPDATE SET user_id = EXCLUDED.user_id;

-- --- Grants -----------------------------------------------------------------
--   alice → geneticist @ ORG_A1 (tenant_a)  → PII only for ORG_A1
--   bob   → geneticist @ ORG_B1 (tenant_b)  → PII only for ORG_B1
--   wendy → geneticist @ '*'    (tenant_a)  → PII for EVERY tenant_a org
INSERT INTO public.user_role (email, tenant_code, org_code, role_code, granted_by) VALUES
    ('alice@demo.org', 'tenant_a', 'ORG_A1', 'geneticist', 'sim'),
    ('bob@demo.org',   'tenant_b', 'ORG_B1', 'geneticist', 'sim'),
    ('wendy@demo.org', 'tenant_a', '*',      'geneticist', 'sim')
ON CONFLICT DO NOTHING;

COMMIT;

\echo '--- tenants ---'
SELECT code, name FROM public.tenant WHERE code IN ('tenant_a','tenant_b');
\echo '--- patients ---'
SELECT id, submitter_patient_id, first_name, last_name, organization_code, tenant_code
FROM public.patient WHERE id >= 1001 ORDER BY id;
\echo '--- effective can_read_pii grants ---'
SELECT ur.email, ur.tenant_code, ur.org_code, ur.role_code
FROM public.user_role ur
JOIN public.role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
WHERE ra.action_code = 'can_read_pii' AND ur.email LIKE '%@demo.org'
ORDER BY ur.email;
