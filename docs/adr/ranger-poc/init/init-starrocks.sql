-- =============================================================================
-- StarRocks Auth-Tables POC — RBAC Model
--   1. auth_db        – roles, actions, role-action mappings, user assignments
--   2. cbtn_db        – clinical + operational data for tenant cbtn
--   3. udn_db         – clinical + operational data for tenant udn
--   4. base           – cross-tenant physical tables (root-only access)
--                       exposed to each tenant DB via SECURITY NONE views
--   5. StarRocks users (JWT authentication via Keycloak)
--
-- Database visibility (cbtn_db / udn_db) is enforced by Ranger access policies
-- bound to Ranger roles cbtn_member / udn_member. Auth_db remains the source
-- of truth; the admin API maintains Ranger role membership on every grant.
-- The `base` database has no Ranger policy — Ranger denies by default for
-- everyone except root (root bypass). Tenant users reach base.variants only
-- through cbtn_db.variants / udn_db.variants views (default SECURITY NONE).
-- =============================================================================

-- =============================================================================
-- 1. Authorization database
-- =============================================================================

CREATE DATABASE IF NOT EXISTS auth_db;

-- Identity registry
CREATE TABLE IF NOT EXISTS auth_db.users (
    username    VARCHAR(100) NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    disabled_at DATETIME     NULL
) ENGINE=OLAP
PRIMARY KEY(username)
DISTRIBUTED BY HASH(username) BUCKETS 1;

-- Tenants
CREATE TABLE IF NOT EXISTS auth_db.tenant (
    tenant_id   VARCHAR(50)  NOT NULL,
    tenant_name VARCHAR(200) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(tenant_id)
DISTRIBUTED BY HASH(tenant_id) BUCKETS 1;

-- Organizations within tenants
CREATE TABLE IF NOT EXISTS auth_db.organization (
    org_id    VARCHAR(50)  NOT NULL,
    tenant_id VARCHAR(50)  NOT NULL,
    org_name  VARCHAR(200) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(org_id)
DISTRIBUTED BY HASH(org_id) BUCKETS 1;

-- ---------------------------------------------------------------------------
-- Role catalog
-- scope: 'org' (assigned per org) or 'tenant' (assigned per tenant)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_db.role (
    tenant_id   VARCHAR(50)  NOT NULL,
    role_id     VARCHAR(50)  NOT NULL,
    role_name   VARCHAR(200) NOT NULL,
    scope       VARCHAR(10)  NOT NULL,
    description VARCHAR(500)
) ENGINE=OLAP
PRIMARY KEY(tenant_id, role_id)
DISTRIBUTED BY HASH(tenant_id) BUCKETS 1;

-- ---------------------------------------------------------------------------
-- Action catalog
-- scope: 'org' (enforced at org level) or 'tenant' (enforced at tenant level)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_db.action (
    action_id   VARCHAR(50)  NOT NULL,
    scope       VARCHAR(10)  NOT NULL,
    description VARCHAR(500)
) ENGINE=OLAP
PRIMARY KEY(action_id)
DISTRIBUTED BY HASH(action_id) BUCKETS 1;

-- ---------------------------------------------------------------------------
-- Role → Action mapping
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_db.role_action (
    tenant_id VARCHAR(50) NOT NULL,
    role_id   VARCHAR(50) NOT NULL,
    action_id VARCHAR(50) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(tenant_id, role_id, action_id)
DISTRIBUTED BY HASH(tenant_id) BUCKETS 1;

-- ---------------------------------------------------------------------------
-- Tenant-scoped role assignments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_db.user_tenant_role (
    username   VARCHAR(100) NOT NULL,
    tenant_id  VARCHAR(50)  NOT NULL,
    role_id    VARCHAR(50)  NOT NULL,
    granted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(100) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(username, tenant_id, role_id)
DISTRIBUTED BY HASH(username) BUCKETS 1;

-- ---------------------------------------------------------------------------
-- Organization-scoped role assignments
-- org_id = '*' means all organizations in the given tenant
-- tenant_id scopes the wildcard
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_db.user_org_role (
    username   VARCHAR(100) NOT NULL,
    tenant_id  VARCHAR(50)  NOT NULL,
    org_id     VARCHAR(50)  NOT NULL,
    role_id    VARCHAR(50)  NOT NULL,
    granted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(100) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(username, tenant_id, org_id, role_id)
DISTRIBUTED BY HASH(username) BUCKETS 1;

-- =============================================================================
-- Seed: tenants & organizations
-- =============================================================================

INSERT INTO auth_db.tenant (tenant_id, tenant_name) VALUES
    ('cbtn', 'Children Brain Tumor Network'),
    ('udn',  'Undiagnosed Diseases Network');

INSERT INTO auth_db.organization (org_id, tenant_id, org_name) VALUES
    ('chop',    'cbtn', 'Children Hospital of Philadelphia'),
    ('bch',     'cbtn', 'Boston Children Hospital'),
    ('nih-udn', 'udn',  'NIH Undiagnosed Diseases Network');

-- =============================================================================
-- Seed: roles (per tenant — each tenant defines its own roles)
-- =============================================================================

-- CBTN roles
INSERT INTO auth_db.role (tenant_id, role_id, role_name, scope, description) VALUES
    ('cbtn', 'geneticist',       'Geneticist',       'org',    'Interprets variants, manages cases, reads PHI'),
    ('cbtn', 'bioinformatician', 'Bioinformatician',  'org',    'Creates cases, generates reports, reads PHI'),
    ('cbtn', 'submitter',        'Submitter',         'org',    'Creates and edits cases'),
    ('cbtn', 'data_analyst',     'Data Analyst',      'org',    'Read-only PHI access'),
    ('cbtn', 'researcher',       'Researcher',        'tenant', 'Search cases and view knowledge base'),
    ('cbtn', 'tenant_admin',     'Tenant Admin',      'tenant', 'Manage projects, users, code systems, gene panels, orgs'),
    ('cbtn', 'tenant_owner',     'Tenant Owner',      'tenant', 'All tenant_admin actions + delete organizations');

-- UDN roles (different set — no submitter, has clinical_coordinator instead)
INSERT INTO auth_db.role (tenant_id, role_id, role_name, scope, description) VALUES
    ('udn', 'geneticist',           'Geneticist',           'org',    'Interprets variants, manages cases, reads PHI'),
    ('udn', 'clinical_coordinator', 'Clinical Coordinator', 'org',    'Creates cases, reads PHI, assigns cases'),
    ('udn', 'data_analyst',         'Data Analyst',         'org',    'Read-only PHI access'),
    ('udn', 'researcher',           'Researcher',           'tenant', 'Search cases and view knowledge base'),
    ('udn', 'tenant_admin',         'Tenant Admin',         'tenant', 'Manage projects, users, orgs'),
    ('udn', 'tenant_owner',         'Tenant Owner',         'tenant', 'All tenant_admin actions + delete organizations');

-- =============================================================================
-- Seed: actions
-- =============================================================================

INSERT INTO auth_db.action (action_id, scope, description) VALUES
    -- Org-scoped actions
    ('can_read_pii',          'org',    'Read PHI columns unmasked'),
    ('can_create_case',       'org',    'Create a case'),
    ('can_edit_case',         'org',    'Edit a case'),
    ('can_delete_case',       'org',    'Delete a case'),
    ('can_assign_case',       'org',    'Assign a case'),
    ('can_interpret_variant', 'org',    'Interpret a variant'),
    ('can_comment_variant',   'org',    'Comment on a variant'),
    ('can_generate_report',   'org',    'Generate a report'),
    ('can_download_file',     'org',    'Download a file'),
    -- Tenant-scoped actions
    ('can_search_case',       'tenant', 'Search/view cases across tenant'),
    ('can_view_kb',           'tenant', 'View knowledge base'),
    ('can_manage_project',    'tenant', 'Create/manage projects'),
    ('can_invite_user',       'tenant', 'Invite users'),
    ('can_manage_codesystem', 'tenant', 'Manage code systems'),
    ('can_manage_genepanel',  'tenant', 'Manage gene panels'),
    ('can_manage_org',        'tenant', 'Create/manage organizations'),
    ('can_delete_org',        'tenant', 'Delete organizations');

-- =============================================================================
-- Seed: role → action mappings (per tenant)
-- =============================================================================

-- CBTN role-action mappings
INSERT INTO auth_db.role_action (tenant_id, role_id, action_id) VALUES
    ('cbtn', 'geneticist', 'can_read_pii'),
    ('cbtn', 'geneticist', 'can_create_case'),
    ('cbtn', 'geneticist', 'can_edit_case'),
    ('cbtn', 'geneticist', 'can_assign_case'),
    ('cbtn', 'geneticist', 'can_interpret_variant'),
    ('cbtn', 'geneticist', 'can_comment_variant'),
    ('cbtn', 'geneticist', 'can_generate_report'),
    ('cbtn', 'geneticist', 'can_download_file'),
    ('cbtn', 'bioinformatician', 'can_read_pii'),
    ('cbtn', 'bioinformatician', 'can_create_case'),
    ('cbtn', 'bioinformatician', 'can_edit_case'),
    ('cbtn', 'bioinformatician', 'can_generate_report'),
    ('cbtn', 'bioinformatician', 'can_download_file'),
    ('cbtn', 'submitter', 'can_create_case'),
    ('cbtn', 'submitter', 'can_edit_case'),
    ('cbtn', 'data_analyst', 'can_read_pii'),
    ('cbtn', 'researcher', 'can_search_case'),
    ('cbtn', 'researcher', 'can_view_kb'),
    ('cbtn', 'tenant_admin', 'can_search_case'),
    ('cbtn', 'tenant_admin', 'can_view_kb'),
    ('cbtn', 'tenant_admin', 'can_manage_project'),
    ('cbtn', 'tenant_admin', 'can_invite_user'),
    ('cbtn', 'tenant_admin', 'can_manage_codesystem'),
    ('cbtn', 'tenant_admin', 'can_manage_genepanel'),
    ('cbtn', 'tenant_admin', 'can_manage_org'),
    ('cbtn', 'tenant_owner', 'can_search_case'),
    ('cbtn', 'tenant_owner', 'can_view_kb'),
    ('cbtn', 'tenant_owner', 'can_manage_project'),
    ('cbtn', 'tenant_owner', 'can_invite_user'),
    ('cbtn', 'tenant_owner', 'can_manage_codesystem'),
    ('cbtn', 'tenant_owner', 'can_manage_genepanel'),
    ('cbtn', 'tenant_owner', 'can_manage_org'),
    ('cbtn', 'tenant_owner', 'can_delete_org');

-- UDN role-action mappings (different role set — clinical_coordinator instead of bioinformatician/submitter)
INSERT INTO auth_db.role_action (tenant_id, role_id, action_id) VALUES
    ('udn', 'geneticist', 'can_read_pii'),
    ('udn', 'geneticist', 'can_create_case'),
    ('udn', 'geneticist', 'can_edit_case'),
    ('udn', 'geneticist', 'can_interpret_variant'),
    ('udn', 'geneticist', 'can_comment_variant'),
    ('udn', 'geneticist', 'can_generate_report'),
    ('udn', 'geneticist', 'can_download_file'),
    ('udn', 'clinical_coordinator', 'can_read_pii'),
    ('udn', 'clinical_coordinator', 'can_create_case'),
    ('udn', 'clinical_coordinator', 'can_edit_case'),
    ('udn', 'clinical_coordinator', 'can_assign_case'),
    ('udn', 'data_analyst', 'can_read_pii'),
    ('udn', 'researcher', 'can_search_case'),
    ('udn', 'researcher', 'can_view_kb'),
    ('udn', 'tenant_admin', 'can_search_case'),
    ('udn', 'tenant_admin', 'can_view_kb'),
    ('udn', 'tenant_admin', 'can_manage_project'),
    ('udn', 'tenant_admin', 'can_invite_user'),
    ('udn', 'tenant_admin', 'can_manage_org'),
    ('udn', 'tenant_owner', 'can_search_case'),
    ('udn', 'tenant_owner', 'can_view_kb'),
    ('udn', 'tenant_owner', 'can_manage_project'),
    ('udn', 'tenant_owner', 'can_invite_user'),
    ('udn', 'tenant_owner', 'can_manage_org'),
    ('udn', 'tenant_owner', 'can_delete_org');

-- =============================================================================
-- Seed: users
-- =============================================================================

INSERT INTO auth_db.users (username) VALUES
    ('jane'), ('alice'), ('bob'), ('carol'), ('dan'), ('admin1');

-- =============================================================================
-- Seed: tenant role assignments
-- =============================================================================
-- Jane:  researcher(cbtn)
-- Alice: researcher(cbtn)
-- Bob:   tenant_owner(cbtn)
-- Carol: researcher(cbtn) + researcher(udn)
-- Dan:   researcher(cbtn)

INSERT INTO auth_db.user_tenant_role (username, tenant_id, role_id, granted_by) VALUES
    ('jane',  'cbtn', 'researcher',    'root'),
    ('alice', 'cbtn', 'researcher',    'root'),
    ('bob',   'cbtn', 'tenant_owner',  'root'),
    ('carol', 'cbtn', 'researcher',    'root'),
    ('carol', 'udn',  'researcher',    'root'),
    ('dan',   'cbtn', 'researcher',    'root'),
    ('admin1', 'cbtn', 'tenant_admin',  'root'),
    ('admin1', 'udn',  'tenant_admin',  'root');

-- =============================================================================
-- Seed: org role assignments
-- =============================================================================
-- Jane:  geneticist at ALL cbtn orgs (org_id = '*')
-- Alice: geneticist at chop only
-- Bob:   (none — tenant_owner manages, no PII)
-- Carol: bioinformatician at chop
-- Dan:   (none — researcher only)

INSERT INTO auth_db.user_org_role (username, tenant_id, org_id, role_id, granted_by) VALUES
    ('jane',  'cbtn', '*',    'geneticist',       'root'),
    ('alice', 'cbtn', 'chop', 'geneticist',       'root'),
    ('carol', 'cbtn', 'chop', 'bioinformatician', 'root');

-- =============================================================================
-- 2. Per-tenant data databases (cbtn_db, udn_db)
--    Each tenant has its own database. Tenant scoping is enforced at the
--    database-visibility layer via Ranger access policies bound to Ranger
--    roles. Tenant_id columns are dropped — implicit in the database name.
--    org_id is kept on data tables; the column-mask subqueries key on it.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS cbtn_db;
CREATE DATABASE IF NOT EXISTS udn_db;

CREATE TABLE IF NOT EXISTS cbtn_db.patients (
    id            INT          NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    mrn           VARCHAR(20)  NOT NULL,
    date_of_birth DATE         NOT NULL,
    org_id        VARCHAR(50)  NOT NULL,
    diagnosis     VARCHAR(200)
) ENGINE=OLAP
PRIMARY KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 1;

CREATE TABLE IF NOT EXISTS udn_db.patients (
    id            INT          NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    mrn           VARCHAR(20)  NOT NULL,
    date_of_birth DATE         NOT NULL,
    org_id        VARCHAR(50)  NOT NULL,
    diagnosis     VARCHAR(200)
) ENGINE=OLAP
PRIMARY KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 1;

INSERT INTO cbtn_db.patients (id, first_name, last_name, mrn, date_of_birth, org_id, diagnosis) VALUES
    (1, 'Patient_A', 'Smith',    'MRN-CHOP-001', '2010-03-15', 'chop', 'Glioblastoma'),
    (2, 'Patient_B', 'Johnson',  'MRN-CHOP-002', '2012-07-22', 'chop', 'Medulloblastoma'),
    (3, 'Patient_C', 'Williams', 'MRN-CHOP-003', '2008-11-08', 'chop', 'Ependymoma'),
    (4, 'Patient_D', 'Brown',    'MRN-BCH-001',  '2011-01-30', 'bch',  'Astrocytoma'),
    (5, 'Patient_E', 'Davis',    'MRN-BCH-002',  '2009-06-12', 'bch',  'Craniopharyngioma');

INSERT INTO udn_db.patients (id, first_name, last_name, mrn, date_of_birth, org_id, diagnosis) VALUES
    (6, 'Patient_F', 'Wilson', 'MRN-NIH-001', '2013-09-25', 'nih-udn', 'Undiagnosed syndrome A'),
    (7, 'Patient_G', 'Moore',  'MRN-NIH-002', '2007-12-03', 'nih-udn', 'Undiagnosed syndrome B');

CREATE TABLE IF NOT EXISTS cbtn_db.cases (
    case_id    INT          NOT NULL,
    patient_id INT          NOT NULL,
    case_name  VARCHAR(200) NOT NULL,
    status     VARCHAR(50)  NOT NULL,
    org_id     VARCHAR(50)  NOT NULL,
    created_by VARCHAR(100),
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=OLAP
PRIMARY KEY(case_id)
DISTRIBUTED BY HASH(case_id) BUCKETS 1;

CREATE TABLE IF NOT EXISTS udn_db.cases (
    case_id    INT          NOT NULL,
    patient_id INT          NOT NULL,
    case_name  VARCHAR(200) NOT NULL,
    status     VARCHAR(50)  NOT NULL,
    org_id     VARCHAR(50)  NOT NULL,
    created_by VARCHAR(100),
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=OLAP
PRIMARY KEY(case_id)
DISTRIBUTED BY HASH(case_id) BUCKETS 1;

INSERT INTO cbtn_db.cases (case_id, patient_id, case_name, status, org_id, created_by) VALUES
    (1, 1, 'Case-CHOP-001', 'open', 'chop', 'root'),
    (2, 2, 'Case-CHOP-002', 'open', 'chop', 'root'),
    (3, 4, 'Case-BCH-001',  'open', 'bch',  'root');

INSERT INTO udn_db.cases (case_id, patient_id, case_name, status, org_id, created_by) VALUES
    (4, 6, 'Case-NIH-001', 'open', 'nih-udn', 'root');

-- =============================================================================
-- 2b. Cross-tenant base tables — partitioned by tenant_id, root-only access.
--     Tenant users reach base.variants through cbtn_db.variants / udn_db.variants
--     views, which default to SECURITY NONE and therefore bypass the underlying-
--     table privilege check. No Ranger policy on `base` ⇒ non-root denied.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS base;

CREATE TABLE IF NOT EXISTS base.variants (
    id             INT          NOT NULL,
    tenant_id      VARCHAR(50)  NOT NULL,
    patient_id     INT          NOT NULL,
    gene_symbol    VARCHAR(50)  NOT NULL,
    classification VARCHAR(50)
) ENGINE=OLAP
PRIMARY KEY(id, tenant_id)
PARTITION BY LIST (tenant_id) (
    PARTITION p_cbtn VALUES IN ('cbtn'),
    PARTITION p_udn  VALUES IN ('udn')
)
DISTRIBUTED BY HASH(id) BUCKETS 1;

INSERT INTO base.variants (id, tenant_id, patient_id, gene_symbol, classification) VALUES
    (1, 'cbtn', 1, 'TP53',  'Pathogenic'),
    (2, 'cbtn', 1, 'BRCA2', 'VUS'),
    (3, 'cbtn', 2, 'MYCN',  'Pathogenic'),
    (4, 'cbtn', 4, 'EGFR',  'Likely_Pathogenic'),
    (5, 'udn',  6, 'SCN1A', 'Pathogenic'),
    (6, 'udn',  7, 'PTEN',  'VUS');

-- Per-tenant views — default SECURITY NONE bypasses the access check on
-- base.variants when a tenant user queries cbtn_db.variants / udn_db.variants.
CREATE VIEW IF NOT EXISTS cbtn_db.variants AS
SELECT id, patient_id, gene_symbol, classification
FROM base.variants WHERE tenant_id = 'cbtn';

CREATE VIEW IF NOT EXISTS udn_db.variants AS
SELECT id, patient_id, gene_symbol, classification
FROM base.variants WHERE tenant_id = 'udn';

-- =============================================================================
-- 3. StarRocks users (JWT authentication via Keycloak)
--    These are the seeded test users. New users granted via the admin UI
--    are created on-demand by the Go API (CREATE USER IF NOT EXISTS).
-- =============================================================================

CREATE USER IF NOT EXISTS jane IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8180/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS alice IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8180/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS bob IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8180/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS carol IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8180/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS dan IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8180/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS admin1 IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://localhost:8180/realms/starrocks",
  "required_audience": "starrocks"
}';
