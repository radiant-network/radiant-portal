-- =============================================================================
-- StarRocks Ranger POC: test database, tables, users, and sample data
-- =============================================================================

CREATE DATABASE IF NOT EXISTS poc_db;

USE poc_db;

-- Patients table with tenant and organization columns for row-level filtering
CREATE TABLE IF NOT EXISTS patients (
    id                INT          NOT NULL,
    first_name        VARCHAR(100) NOT NULL,
    last_name         VARCHAR(100) NOT NULL,
    mrn               VARCHAR(20)  NOT NULL,
    date_of_birth     DATE         NOT NULL,
    tenant            VARCHAR(50)  NOT NULL,
    organization      VARCHAR(50)  NOT NULL,
    diagnosis         VARCHAR(200)
) ENGINE=OLAP
PRIMARY KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 1;

-- Sample data: 2 tenants (cbtn, udp), 2 organizations per tenant
INSERT INTO patients (id, first_name, last_name, mrn, date_of_birth, tenant, organization, diagnosis) VALUES
    -- Tenant: CBTN, Organization: CHOP
    (1, 'Alice',   'Smith',    'MRN-000001', '1992-03-15', 'cbtn', 'chop',    'Glioblastoma'),
    (2, 'Bob',     'Johnson',  'MRN-000002', '1988-07-22', 'cbtn', 'chop',    'Medulloblastoma'),
    (3, 'Charlie', 'Williams', 'MRN-000003', '2001-11-08', 'cbtn', 'chop',    'Ependymoma'),
    -- Tenant: CBTN, Organization: Seattle
    (4, 'Diana',   'Brown',    'MRN-000004', '1995-01-30', 'cbtn', 'seattle', 'Astrocytoma'),
    (5, 'Eve',     'Davis',    'MRN-000005', '1999-06-12', 'cbtn', 'seattle', 'Craniopharyngioma'),
    -- Tenant: UDP, Organization: NIH
    (6, 'Frank',   'Wilson',   'MRN-000006', '2003-09-25', 'udp',  'nih',     'Undiagnosed syndrome A'),
    (7, 'Grace',   'Moore',    'MRN-000007', '1990-12-03', 'udp',  'nih',     'Undiagnosed syndrome B'),
    -- Tenant: UDP, Organization: Duke
    (8, 'Hank',    'Taylor',   'MRN-000008', '2005-04-17', 'udp',  'duke',    'Dravet syndrome'),
    (9, 'Ivy',     'Anderson', 'MRN-000009', '1997-08-29', 'udp',  'duke',    'Lennox-Gastaut syndrome');

-- Create test users (local authentication, passwords for POC)
-- StarRocks handles authentication only. Ranger handles all authorization.
-- Users are prefixed with user_ to distinguish from Ranger roles (role_).
CREATE USER IF NOT EXISTS user_cbtn_all     IDENTIFIED BY 'cbtnallpass';
CREATE USER IF NOT EXISTS user_cbtn_chop    IDENTIFIED BY 'cbtnchoppass';
CREATE USER IF NOT EXISTS user_cbtn_seattle IDENTIFIED BY 'cbtnseattlepass';
CREATE USER IF NOT EXISTS user_udp_all      IDENTIFIED BY 'udpallpass';

-- Note: with access_control=ranger, StarRocks native GRANT is bypassed.
-- All access control is managed through Ranger policies and roles.
