-- =============================================================================
-- StarRocks Auth-Tables POC
--   1. auth_db        – authorization model (source of truth)
--   2. poc_db         – clinical data (read-only for humans)
--   3. operational_db – operational data (writable by humans with roles)
--   4. Users
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

-- Tenant-scoped role assignments
-- role IN ('tenant_owner', 'tenant_admin', 'tenant_member')
CREATE TABLE IF NOT EXISTS auth_db.user_tenant_role (
    username   VARCHAR(100) NOT NULL,
    tenant_id  VARCHAR(50)  NOT NULL,
    role       VARCHAR(50)  NOT NULL,
    granted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(100) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(username, tenant_id, role)
DISTRIBUTED BY HASH(username) BUCKETS 1;

-- Organization-scoped role assignments
-- role IN ('org_owner', 'org_admin', 'org_editor', 'org_member')
CREATE TABLE IF NOT EXISTS auth_db.user_org_role (
    username   VARCHAR(100) NOT NULL,
    org_id     VARCHAR(50)  NOT NULL,
    role       VARCHAR(50)  NOT NULL,
    granted_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(100) NOT NULL
) ENGINE=OLAP
PRIMARY KEY(username, org_id, role)
DISTRIBUTED BY HASH(username) BUCKETS 1;

-- Seed: tenants
INSERT INTO auth_db.tenant (tenant_id, tenant_name) VALUES
    ('cbtn', 'Children Brain Tumor Network'),
    ('udn',  'Undiagnosed Diseases Network');

-- Seed: organizations
INSERT INTO auth_db.organization (org_id, tenant_id, org_name) VALUES
    ('chop',    'cbtn', 'Children Hospital of Philadelphia'),
    ('bch',     'cbtn', 'Boston Children Hospital'),
    ('nih-udn', 'udn',  'NIH Undiagnosed Diseases Network');

-- Seed: users
INSERT INTO auth_db.users (username) VALUES
    ('jane'),
    ('alice'),
    ('bob'),
    ('carol'),
    ('dan');

-- Seed: tenant role assignments
-- Jane:  tenant_member(cbtn)
-- Alice: tenant_member(cbtn)
-- Bob:   tenant_owner(cbtn)
-- Carol: tenant_member(cbtn) + tenant_member(udn)
-- Dan:   tenant_member(cbtn)
INSERT INTO auth_db.user_tenant_role (username, tenant_id, role, granted_by) VALUES
    ('jane',  'cbtn', 'tenant_member', 'root'),
    ('alice', 'cbtn', 'tenant_member', 'root'),
    ('bob',   'cbtn', 'tenant_owner',  'root'),
    ('carol', 'cbtn', 'tenant_member', 'root'),
    ('carol', 'udn',  'tenant_member', 'root'),
    ('dan',   'cbtn', 'tenant_member', 'root');

-- Seed: organization role assignments
-- Jane:  org_member at ALL orgs in CBTN (chop + bch)
-- Alice: org_member(chop)
-- Bob:   (none — tenant_owner implies full access)
-- Carol: org_member(chop)
-- Dan:   (none)
INSERT INTO auth_db.user_org_role (username, org_id, role, granted_by) VALUES
    ('jane',  'chop', 'org_member', 'root'),
    ('jane',  'bch',  'org_member', 'root'),
    ('alice', 'chop', 'org_member', 'root'),
    ('carol', 'chop', 'org_member', 'root');

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
    -- Tenant: CBTN, Organization: CHOP
    (1, 'Patient_A', 'Smith',    'MRN-CHOP-001', '2010-03-15', 'cbtn', 'chop', 'Glioblastoma'),
    (2, 'Patient_B', 'Johnson',  'MRN-CHOP-002', '2012-07-22', 'cbtn', 'chop', 'Medulloblastoma'),
    (3, 'Patient_C', 'Williams', 'MRN-CHOP-003', '2008-11-08', 'cbtn', 'chop', 'Ependymoma'),
    -- Tenant: CBTN, Organization: BCH
    (4, 'Patient_D', 'Brown',    'MRN-BCH-001',  '2011-01-30', 'cbtn', 'bch',  'Astrocytoma'),
    (5, 'Patient_E', 'Davis',    'MRN-BCH-002',  '2009-06-12', 'cbtn', 'bch',  'Craniopharyngioma'),
    -- Tenant: UDN, Organization: NIH-UDN
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
-- Users authenticate with JWT tokens issued by Keycloak.
-- StarRocks validates the token signature against Keycloak's JWKS endpoint.
-- The preferred_username claim in the JWT maps to the StarRocks username.
-- Clients connect via the mysql-proxy which translates native_password → authentication_jwt.

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

-- NOTE: With access_control=ranger, StarRocks delegates all authorization to Ranger.
-- The Ranger policy "sr_select_auth" (created in init-all.sh) grants role_authenticated
-- SELECT on auth_db.*, which allows subqueries in row-filter/mask expressions to work.
