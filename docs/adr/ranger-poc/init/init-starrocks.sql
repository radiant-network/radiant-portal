-- =============================================================================
-- StarRocks Auth-Tables POC — RBAC Model
--   1. auth_db        – roles, actions, role-action mappings, user assignments
--   2. poc_db         – clinical data (read-only for humans)
--   3. operational_db – operational data (writable by humans with roles)
--   4. StarRocks users (JWT authentication via Keycloak)
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
    role_id     VARCHAR(50)  NOT NULL,
    role_name   VARCHAR(200) NOT NULL,
    scope       VARCHAR(10)  NOT NULL,
    description VARCHAR(500)
) ENGINE=OLAP
PRIMARY KEY(role_id)
DISTRIBUTED BY HASH(role_id) BUCKETS 1;

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
    role_id   VARCHAR(50) NOT NULL,
    action_id VARCHAR(50) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(role_id, action_id)
DISTRIBUTED BY HASH(role_id) BUCKETS 1;

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
-- Seed: roles
-- =============================================================================

INSERT INTO auth_db.role (role_id, role_name, scope, description) VALUES
    -- Org-scoped roles
    ('geneticist',       'Geneticist',       'org',    'Interprets variants, manages cases, reads PHI'),
    ('bioinformatician', 'Bioinformatician',  'org',    'Creates cases, generates reports, reads PHI'),
    ('submitter',        'Submitter',         'org',    'Creates and edits cases'),
    ('data_analyst',     'Data Analyst',      'org',    'Read-only PHI access'),
    -- Tenant-scoped roles
    ('researcher',       'Researcher',        'tenant', 'Search cases and view knowledge base across tenant'),
    ('tenant_admin',     'Tenant Admin',      'tenant', 'Manage projects, users, code systems, gene panels, orgs'),
    ('tenant_owner',     'Tenant Owner',      'tenant', 'All tenant_admin actions + delete organizations');

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
-- Seed: role → action mappings
-- =============================================================================

-- Geneticist: full clinical workflow + PII
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('geneticist', 'can_read_pii'),
    ('geneticist', 'can_create_case'),
    ('geneticist', 'can_edit_case'),
    ('geneticist', 'can_assign_case'),
    ('geneticist', 'can_interpret_variant'),
    ('geneticist', 'can_comment_variant'),
    ('geneticist', 'can_generate_report'),
    ('geneticist', 'can_download_file');

-- Bioinformatician: case management + reports + PII
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('bioinformatician', 'can_read_pii'),
    ('bioinformatician', 'can_create_case'),
    ('bioinformatician', 'can_edit_case'),
    ('bioinformatician', 'can_generate_report'),
    ('bioinformatician', 'can_download_file');

-- Submitter: case creation only (no PII)
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('submitter', 'can_create_case'),
    ('submitter', 'can_edit_case');

-- Data Analyst: read-only PII
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('data_analyst', 'can_read_pii');

-- Researcher: tenant-wide search
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('researcher', 'can_search_case'),
    ('researcher', 'can_view_kb');

-- Tenant Admin: all tenant management
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('tenant_admin', 'can_search_case'),
    ('tenant_admin', 'can_view_kb'),
    ('tenant_admin', 'can_manage_project'),
    ('tenant_admin', 'can_invite_user'),
    ('tenant_admin', 'can_manage_codesystem'),
    ('tenant_admin', 'can_manage_genepanel'),
    ('tenant_admin', 'can_manage_org');

-- Tenant Owner: tenant_admin + delete org
INSERT INTO auth_db.role_action (role_id, action_id) VALUES
    ('tenant_owner', 'can_search_case'),
    ('tenant_owner', 'can_view_kb'),
    ('tenant_owner', 'can_manage_project'),
    ('tenant_owner', 'can_invite_user'),
    ('tenant_owner', 'can_manage_codesystem'),
    ('tenant_owner', 'can_manage_genepanel'),
    ('tenant_owner', 'can_manage_org'),
    ('tenant_owner', 'can_delete_org');

-- =============================================================================
-- Seed: users
-- =============================================================================

INSERT INTO auth_db.users (username) VALUES
    ('jane'), ('alice'), ('bob'), ('carol'), ('dan');

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
    ('dan',   'cbtn', 'researcher',    'root');

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
-- 2. Clinical database (read-only for humans)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS poc_db;

CREATE TABLE IF NOT EXISTS poc_db.patients (
    id            INT          NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    mrn           VARCHAR(20)  NOT NULL,
    date_of_birth DATE         NOT NULL,
    tenant_id     VARCHAR(50)  NOT NULL,
    org_id        VARCHAR(50)  NOT NULL,
    diagnosis     VARCHAR(200)
) ENGINE=OLAP
PRIMARY KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 1;

INSERT INTO poc_db.patients (id, first_name, last_name, mrn, date_of_birth, tenant_id, org_id, diagnosis) VALUES
    (1, 'Patient_A', 'Smith',    'MRN-CHOP-001', '2010-03-15', 'cbtn', 'chop',    'Glioblastoma'),
    (2, 'Patient_B', 'Johnson',  'MRN-CHOP-002', '2012-07-22', 'cbtn', 'chop',    'Medulloblastoma'),
    (3, 'Patient_C', 'Williams', 'MRN-CHOP-003', '2008-11-08', 'cbtn', 'chop',    'Ependymoma'),
    (4, 'Patient_D', 'Brown',    'MRN-BCH-001',  '2011-01-30', 'cbtn', 'bch',     'Astrocytoma'),
    (5, 'Patient_E', 'Davis',    'MRN-BCH-002',  '2009-06-12', 'cbtn', 'bch',     'Craniopharyngioma'),
    (6, 'Patient_F', 'Wilson',   'MRN-NIH-001',  '2013-09-25', 'udn',  'nih-udn', 'Undiagnosed syndrome A'),
    (7, 'Patient_G', 'Moore',    'MRN-NIH-002',  '2007-12-03', 'udn',  'nih-udn', 'Undiagnosed syndrome B');

-- =============================================================================
-- 3. Operational database (writable by humans with roles)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS operational_db;

CREATE TABLE IF NOT EXISTS operational_db.cases (
    case_id    INT          NOT NULL,
    patient_id INT          NOT NULL,
    case_name  VARCHAR(200) NOT NULL,
    status     VARCHAR(50)  NOT NULL,
    tenant_id  VARCHAR(50)  NOT NULL,
    org_id     VARCHAR(50)  NOT NULL,
    created_by VARCHAR(100),
    created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
) ENGINE=OLAP
PRIMARY KEY(case_id)
DISTRIBUTED BY HASH(case_id) BUCKETS 1;

INSERT INTO operational_db.cases (case_id, patient_id, case_name, status, tenant_id, org_id, created_by) VALUES
    (1, 1, 'Case-CHOP-001', 'open', 'cbtn', 'chop',    'root'),
    (2, 2, 'Case-CHOP-002', 'open', 'cbtn', 'chop',    'root'),
    (3, 4, 'Case-BCH-001',  'open', 'cbtn', 'bch',     'root'),
    (4, 6, 'Case-NIH-001',  'open', 'udn',  'nih-udn', 'root');

-- =============================================================================
-- 4. StarRocks users (JWT authentication via Keycloak)
-- =============================================================================

CREATE USER IF NOT EXISTS jane IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://keycloak:8080/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS alice IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://keycloak:8080/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS bob IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://keycloak:8080/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS carol IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://keycloak:8080/realms/starrocks",
  "required_audience": "starrocks"
}';

CREATE USER IF NOT EXISTS dan IDENTIFIED WITH authentication_jwt AS '{
  "jwks_url": "http://keycloak:8080/realms/starrocks/protocol/openid-connect/certs",
  "principal_field": "preferred_username",
  "required_issuer": "http://keycloak:8080/realms/starrocks",
  "required_audience": "starrocks"
}';
