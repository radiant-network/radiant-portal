-- =============================================================================
-- StarRocks Ranger POC: Simplified model
-- Roles have no org suffix. Orgs are user attributes.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS poc_db;

USE poc_db;

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

INSERT INTO patients (id, first_name, last_name, mrn, date_of_birth, tenant, organization, diagnosis) VALUES
    (1, 'Alice',   'Smith',    'MRN-000001', '1992-03-15', 'cbtn', 'chop',    'Glioblastoma'),
    (2, 'Bob',     'Johnson',  'MRN-000002', '1988-07-22', 'cbtn', 'chop',    'Medulloblastoma'),
    (3, 'Charlie', 'Williams', 'MRN-000003', '2001-11-08', 'cbtn', 'chop',    'Ependymoma'),
    (4, 'Diana',   'Brown',    'MRN-000004', '1995-01-30', 'cbtn', 'seattle', 'Astrocytoma'),
    (5, 'Eve',     'Davis',    'MRN-000005', '1999-06-12', 'cbtn', 'seattle', 'Craniopharyngioma'),
    (6, 'Frank',   'Wilson',   'MRN-000006', '2003-09-25', 'udp',  'nih',     'Undiagnosed syndrome A'),
    (7, 'Grace',   'Moore',    'MRN-000007', '1990-12-03', 'udp',  'nih',     'Undiagnosed syndrome B'),
    (8, 'Hank',    'Taylor',   'MRN-000008', '2005-04-17', 'udp',  'duke',    'Dravet syndrome'),
    (9, 'Ivy',     'Anderson', 'MRN-000009', '1997-08-29', 'udp',  'duke',    'Lennox-Gastaut syndrome');

-- Users: realistic names, no role/org encoded in username
CREATE USER IF NOT EXISTS user_alice IDENTIFIED BY 'alice123';
CREATE USER IF NOT EXISTS user_bob   IDENTIFIED BY 'bob123';
CREATE USER IF NOT EXISTS user_carol IDENTIFIED BY 'carol123';
CREATE USER IF NOT EXISTS user_dave  IDENTIFIED BY 'dave123';
