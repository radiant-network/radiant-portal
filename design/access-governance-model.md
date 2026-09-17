# [Design Notes] Access governance model — target schema for the consortium proposal

**Status:** discussion draft (2026-09-10). No ticket yet. Nothing here is implemented.
**Input:** the external "Consortium Access Governance" handoff (R2, 2026-09-08): core developer
specification + Keycloak/Ranger/StarRocks addendum v1.2.
**Assumptions:** the StarRocks Ranger view-access bypass (#72910) is fixed in the next release, so the
per-tenant view databases remain the enforced resources; the per-user StarRocks connection through
`mysql-proxy` becomes mandatory for every `/:tenant` read.

---

## 1. What stays, what changes

| Keep as is | Extend | New |
|---|---|---|
| Keycloak `sub` as the single identity across Keycloak / Postgres / Ranger / StarRocks | `user_role` → `role_assignment` (typed scope + validity + history) | protocol layer: participation, enrollment, enrollment-site relationship |
| `tenant`, `organization`, `users` | `project` → `protocol` (status, tenant) | `care_relationship` (from the practitioner ADR's case assignment) |
| `role`, `action`, `role_action` (roles are data, actions are capabilities) | `cases` gets `enrollment_id` | `data_package`, `representation_profile` |
| Ranger enforces; the entitlement is a StarRocks view over Postgres tables (`auth.*`) | `auth.pii_grant` / `auth.pii_lab_patient` → `auth.entitlement` (one complete path per row) | `publication`, `release_event`, `restriction` |
| `/:tenant` routing, `RequireAction*` middlewares | org resolvers → participation resolvers | `access_decision`, `policy_change_audit` |

The **grant mechanism does not change**: a user holds a role, a role carries actions, a grant has a
scope. What changes is the *scope object* (a lab in a protocol, or an explicit patient set, instead of a
bare lab), the *time dimension*, and the *representation* (a named profile instead of `can_read_pii`).

---

## 2. Entity map: handoff → Radiant

| Handoff entity | Radiant table | Status |
|---|---|---|
| Tenant | `tenant` (+ `policy_epoch`) | extend |
| Organization / TenantOrganization | `organization` (already tenant-scoped) | keep |
| OrgUnit | not needed initially | skip |
| Principal | `users` | keep |
| PrincipalAffiliation | `user_affiliation` | new (small) |
| RoleDefinition / capabilities | `role`, `action`, `role_action`, `role_profile` | extend |
| RoleAssignment | `role_assignment` (replaces `user_role`) | extend |
| Protocol | `protocol` (today `project`) | extend |
| ProtocolParticipation | `protocol_participation` | new |
| TenantSubject | `patient` | keep |
| Enrollment | `enrollment` | new |
| EnrollmentSiteRelationship | `enrollment_site_relationship` | new |
| CareRelationship | `care_relationship` (generalizes `case_practitioner_assignment`) | new |
| DataPackage | `data_package` | new |
| GovernedSlice | **derived**: `auth.governed_slice` view over cases / sequencing experiments | derived |
| RepresentationProfile | `representation_profile` (with `fields` jsonb) | new |
| PublicationPolicy / Publication / ReleaseEvent | `publication_policy`, `publication`, `release_event` | new |
| Restriction / ParticipantDirective | `restriction` | new |
| AccessDecision / PolicyChangeAudit | `access_decision`, `policy_change_audit` | new |
| EffectiveEntitlement (compiler output) | `auth.entitlement` StarRocks view | derived |
| PolicyDeployment / FieldResourceBinding | `representation_profile.fields` + tenant view templates | partially covered |

---

## 3. Target schema

Conventions follow the existing auth schema: `tenant_code` on every row, composite FKs
`(x_code, tenant_code)`, `varchar` codes, `timestamptz`, half-open validity `valid_from <= now() < valid_to`
with `valid_to NULL` = open-ended. Nothing is deleted to revoke: rows get `revoked_at` / `valid_to`.

### 3.1 Identity and affiliation (existing + one table)

```sql
ALTER TABLE tenant ADD COLUMN policy_epoch bigint NOT NULL DEFAULT 0;  -- bumped on any permission-affecting change

CREATE TABLE user_affiliation (            -- "acting organization" candidates for a user
    user_id      varchar(255) NOT NULL,     -- Keycloak sub
    tenant_code  varchar(50)  NOT NULL,
    org_code     varchar(50)  NOT NULL,
    verified_by  varchar(255),
    valid_from   timestamptz  NOT NULL DEFAULT now(),
    valid_to     timestamptz,
    PRIMARY KEY (user_id, tenant_code, org_code, valid_from),
    FOREIGN KEY (org_code, tenant_code) REFERENCES organization(code, tenant_code)
);
```

Optional in stage 1: if a user has grants at exactly one organization, the affiliation is implied.

### 3.2 Protocol layer (new)

```sql
-- project becomes protocol: same rows, tenant-scoped, with a lifecycle
CREATE TABLE protocol (
    tenant_code  varchar(50) NOT NULL REFERENCES tenant(code),
    code         varchar(50) NOT NULL,
    name         varchar(200) NOT NULL,
    status       varchar(20) NOT NULL CHECK (status IN ('active','completed','closed')),
    enrollment_mode varchar(20) NOT NULL DEFAULT 'implicit_on_ingest'
                 CHECK (enrollment_mode IN ('implicit_on_ingest','explicit_required')),
    PRIMARY KEY (tenant_code, code)
);

CREATE TABLE protocol_participation (      -- "lab X is an enrolling site of protocol P"
    id            bigserial PRIMARY KEY,
    tenant_code   varchar(50) NOT NULL,
    protocol_code varchar(50) NOT NULL,
    org_code      varchar(50) NOT NULL,
    function      varchar(30) NOT NULL CHECK (function IN ('enrolling_site','treating_site','coordinating_center')),
    valid_from    timestamptz NOT NULL DEFAULT now(),
    valid_to      timestamptz,
    UNIQUE (tenant_code, protocol_code, org_code, function),
    FOREIGN KEY (tenant_code, protocol_code) REFERENCES protocol(tenant_code, code),
    FOREIGN KEY (org_code, tenant_code)      REFERENCES organization(code, tenant_code)
);

CREATE TABLE enrollment (                  -- one patient in one protocol (episode allows re-enrollment)
    id            bigserial PRIMARY KEY,
    tenant_code   varchar(50) NOT NULL,
    protocol_code varchar(50) NOT NULL,
    patient_id    integer     NOT NULL,
    episode       smallint    NOT NULL DEFAULT 1,
    status        varchar(20) NOT NULL CHECK (status IN ('active','withdrawn','completed')),
    enrolled_on   date,
    ended_on      date,
    UNIQUE (tenant_code, protocol_code, patient_id, episode),
    FOREIGN KEY (tenant_code, protocol_code) REFERENCES protocol(tenant_code, code),
    FOREIGN KEY (patient_id) REFERENCES patient(id)
);

CREATE TABLE enrollment_site_relationship ( -- "these are lab X's patients for protocol P"
    enrollment_id     bigint      NOT NULL REFERENCES enrollment(id),
    participation_id  bigint      NOT NULL REFERENCES protocol_participation(id),
    relationship_type varchar(20) NOT NULL CHECK (relationship_type IN ('enrolling','treating','follow_up','transfer','closeout')),
    valid_from        timestamptz NOT NULL DEFAULT now(),
    valid_to          timestamptz,
    record_from       timestamptz,          -- which records the site may see (NULL = all)
    record_to         timestamptz,
    PRIMARY KEY (enrollment_id, participation_id, relationship_type, valid_from)
);

-- No enrollment column on cases. A case is a proband plus family members; each of them is a patient
-- with their own enrollment in the case's protocol. case → enrollments is derived through `family`
-- (the join auth.pii_lab_patient already does today). Optional cache maintained by ingestion:
CREATE TABLE case_enrollment (case_id integer REFERENCES cases(id), enrollment_id bigint REFERENCES enrollment(id),
                              PRIMARY KEY (case_id, enrollment_id));
```

**Bootstrap for existing tenants:** one protocol per existing `project`; one `enrolling_site`
participation per `(protocol, diagnosis_lab_code)` seen in `cases`; one enrollment per
`(project, patient)` for every patient of a case (proband and family members, via `family`); one `enrolling`
relationship per `(enrollment, participation of the case's lab)`. A patient in several cases at several labs has
one enrollment and several site relationships.
Ingestion maintains these going forward. Behaviour is unchanged: a lab still sees the cases it runs.

**Organization columns on clinical tables stay.** `cases.diagnosis_lab_code`, `cases.ordering_organization_code`,
`patient.organization_code`, `sample.organization_code`, `sequencing_experiment.sequencing_lab_code` remain as
clinical / provenance facts and as ingestion input that seeds the relationship rows. They stop being an
authorization scope (the handoff: source, enrolling, treating, custodian and coordinating institution are
separate facts; hosting a hospital's data is not a grant). They can diverge from the relationship rows over
time (transfer + closeout), which is why both exist. `patient.organization_code` drops out of the PII path
entirely. `can_ingest_data` keeps an org meaning (acting organization), checked against `user_affiliation`
or a tenant-level assignment, not an enrollment path.

**When is a patient enrolled?** Per protocol, `protocol.enrollment_mode`:

| mode | enrollment created by | case for an unenrolled patient |
|---|---|---|
| `implicit_on_ingest` (default, lab tenants) | case import, for the proband and every family member; `enrolled_on` from the case date or a payload field | allowed; enrollment created |
| `explicit_required` (research protocols) | enrollment import / endpoint fed by the study registry, with a consent/basis reference | rejected, batch validation error (unenrolled data is quarantined, not admitted) |

In both modes the case import never ends an enrollment; withdrawal is a status change or a restriction.
Patient import cannot enroll (it names no project).

### 3.3 Care relationship (new, generalizes practitioner assignment)

```sql
CREATE TABLE care_relationship (
    id                  bigserial PRIMARY KEY,
    tenant_code         varchar(50)  NOT NULL,
    user_id             varchar(255) NOT NULL,   -- the clinician's Keycloak sub
    patient_id          integer      NOT NULL REFERENCES patient(id),
    org_code            varchar(50)  NOT NULL,   -- organization under which they treat
    verification_source varchar(50)  NOT NULL,   -- 'case_assignment' | 'ehr_sync' | 'manual'
    case_id             integer,                 -- when it originates from a case assignment
    valid_from          timestamptz  NOT NULL DEFAULT now(),
    valid_to            timestamptz,
    FOREIGN KEY (org_code, tenant_code) REFERENCES organization(code, tenant_code)
);
```

`case_practitioner_assignment` from the practitioner ADR can stay as the UI-facing table and feed
`care_relationship` rows with `verification_source = 'case_assignment'`.

### 3.4 Roles, profiles and assignments (extend)

```sql
CREATE TABLE representation_profile (      -- replaces the binary can_read_pii
    tenant_code    varchar(50) NOT NULL REFERENCES tenant(code),
    code           varchar(50) NOT NULL,     -- 'identified', 'coded', 'deidentified_v1', ...
    version        integer     NOT NULL DEFAULT 1,
    classification varchar(20) NOT NULL CHECK (classification IN ('identified','coded_phi','limited_data_set','deidentified')),
    status         varchar(20) NOT NULL CHECK (status IN ('draft','approved','retired')),
    fields         jsonb       NOT NULL,     -- {"patient.first_name":"redact","patient.date_of_birth":"year_only",...}
                                             -- treatments: pass (default, unlisted) | redact | year_only | absent
    approved_by    varchar(255),
    approved_at    timestamptz,
    PRIMARY KEY (tenant_code, code, version)
);
-- No separate profile_field table: with two profiles and a handful of masked columns, the per-column
-- definition lives in `fields`, versioned and approved with the profile. allow_filter/sort are unnecessary
-- (StarRocks rewrites masked columns in predicates too); export is an action + restriction, not a column flag.

CREATE TABLE role_profile (                -- which output profiles a role may request
    tenant_code  varchar(50) NOT NULL,
    role_code    varchar(50) NOT NULL,
    profile_code varchar(50) NOT NULL,
    PRIMARY KEY (tenant_code, role_code, profile_code),
    FOREIGN KEY (tenant_code, role_code) REFERENCES role(tenant_code, code) ON DELETE CASCADE
);

CREATE TABLE role_assignment (             -- replaces user_role
    id                bigserial PRIMARY KEY,
    user_id           varchar(255) NOT NULL,
    tenant_code       varchar(50)  NOT NULL,
    role_code         varchar(50)  NOT NULL,
    scope_type        varchar(20)  NOT NULL CHECK (scope_type IN ('tenant','participation','enrollment_set')),
    participation_id  bigint REFERENCES protocol_participation(id),
    enrollment_set_id bigint,                -- FK to enrollment_set(id) when scope_type = 'enrollment_set'
    purposes          varchar(30)[] NOT NULL DEFAULT '{protocol_operations}',
    valid_from        timestamptz  NOT NULL DEFAULT now(),
    valid_to          timestamptz,
    granted_by        varchar(255) NOT NULL,
    granted_at        timestamptz  NOT NULL DEFAULT now(),
    revoked_by        varchar(255),
    revoked_at        timestamptz,
    reason            varchar(500),
    CHECK ((scope_type = 'tenant')         = (participation_id IS NULL AND enrollment_set_id IS NULL)),
    CHECK ((scope_type = 'participation')  = (participation_id IS NOT NULL)),
    CHECK ((scope_type = 'enrollment_set') = (enrollment_set_id IS NOT NULL)),
    FOREIGN KEY (tenant_code, role_code) REFERENCES role(tenant_code, code)
);

CREATE TABLE enrollment_set        (id bigserial PRIMARY KEY, tenant_code varchar(50) NOT NULL, name varchar(200));
CREATE TABLE enrollment_set_member (enrollment_set_id bigint REFERENCES enrollment_set(id), enrollment_id bigint REFERENCES enrollment(id), PRIMARY KEY (enrollment_set_id, enrollment_id));
```

**Migration from `user_role`:** `org_code IS NULL` → `scope_type='tenant'`; `org_code = <lab>` → one
`participation` row per (default protocol, lab); `org_code = '*'` → one row per participation in the tenant
at migration time (the wildcard becomes explicit, as the handoff requires). `can_read_pii` in a role →
`role_profile(role, 'identified')`; every role gets `'deidentified_v1'` (today's masked view).

### 3.5 Packages, publication, restrictions (new)

```sql
CREATE TABLE data_package (                -- policy bucket per data type within a protocol
    tenant_code   varchar(50) NOT NULL,
    protocol_code varchar(50) NOT NULL,
    code          varchar(50) NOT NULL,     -- 'clinical','germline_snv','germline_cnv','somatic','documents'
    template_code varchar(50) NOT NULL,     -- 'shared_registry_default' | 'trial_local_sites_and_cc_until_release' | ...
    PRIMARY KEY (tenant_code, protocol_code, code),
    FOREIGN KEY (tenant_code, protocol_code) REFERENCES protocol(tenant_code, code)
);

CREATE TABLE publication (                 -- audience state of a package
    id             bigserial PRIMARY KEY,
    tenant_code    varchar(50) NOT NULL,
    protocol_code  varchar(50) NOT NULL,
    package_code   varchar(50) NOT NULL,
    state          varchar(20) NOT NULL CHECK (state IN ('RESTRICTED','ELIGIBLE','RELEASED','SUSPENDED','WITHDRAWN')),
    mode           varchar(20) NOT NULL CHECK (mode IN ('snapshot','continuous')),
    profile_code   varchar(50) NOT NULL,     -- the de-identified profile served to the shared audience
    activated_at   timestamptz,
    approved_by    varchar(255),
    manifest_ref   varchar(255),             -- snapshot: immutable list of included slices
    FOREIGN KEY (tenant_code, protocol_code, package_code) REFERENCES data_package(tenant_code, protocol_code, code)
);

CREATE TABLE release_event (               -- verified trigger (db lock, study completion...)
    id             bigserial PRIMARY KEY,
    tenant_code    varchar(50) NOT NULL,
    protocol_code  varchar(50) NOT NULL,
    event_type     varchar(50) NOT NULL,
    occurred_at    timestamptz NOT NULL,
    attested_by    varchar(255) NOT NULL,
    evidence_ref   varchar(255)
);

CREATE TABLE restriction (                 -- applies on top of every path; never widens
    id                  bigserial PRIMARY KEY,
    tenant_code         varchar(50) NOT NULL,
    target_type         varchar(20) NOT NULL CHECK (target_type IN ('patient','enrollment','package','protocol')),
    target_id           varchar(64) NOT NULL,
    prohibited_actions  varchar(50)[] NOT NULL DEFAULT '{}',    -- e.g. {can_download_file}
    prohibited_profiles varchar(50)[] NOT NULL DEFAULT '{}',    -- e.g. {identified}
    non_overridable     boolean NOT NULL DEFAULT true,
    valid_from          timestamptz NOT NULL DEFAULT now(),
    valid_to            timestamptz,
    reason              varchar(500),
    evidence_ref        varchar(255)
);
```

`publication_policy` (the 4 handoff templates with their 20 state gates each) is **configuration**, not
a table: a versioned JSON/Go map keyed by `template_code`, validated at startup. Only `data_package.template_code`
is stored.

### 3.6 Audit (new)

```sql
CREATE TABLE access_decision (             -- protected; one row per authorization decision at the API
    id            bigserial PRIMARY KEY,
    request_id    varchar(128) NOT NULL,
    decided_at    timestamptz  NOT NULL DEFAULT now(),
    user_id       varchar(255) NOT NULL,
    tenant_code   varchar(50)  NOT NULL,
    acting_org    varchar(50),
    action        varchar(50)  NOT NULL,
    profile_code  varchar(50),
    resource_type varchar(30),               -- 'case','patient','seq_exp','document', ...
    resource_id   varchar(64),
    effect        varchar(5)   NOT NULL CHECK (effect IN ('allow','deny')),
    reason_code   varchar(40)  NOT NULL,     -- handoff taxonomy: ALLOW_COMPLETE_PATH, SCOPE_NOT_AUTHORIZED, ...
    policy_epoch  bigint       NOT NULL,
    query_id      varchar(64)               -- StarRocks last_query_id() when a read was issued
);

CREATE TABLE policy_change_audit (         -- who changed what in any table of §3.2–3.5
    id          bigserial PRIMARY KEY,
    changed_at  timestamptz NOT NULL DEFAULT now(),
    actor       varchar(255) NOT NULL,
    tenant_code varchar(50)  NOT NULL,
    table_name  varchar(63)  NOT NULL,
    row_id      varchar(64)  NOT NULL,
    before      jsonb,
    after       jsonb,
    reason      varchar(500)
);
```

---

## 4. The compiled entitlement (`auth.entitlement`)

Today `auth.pii_grant` and `auth.pii_lab_patient` are already a compiled entitlement: user → patient set.
The target keeps that approach and widens the tuple to the handoff's `EffectiveEntitlement`. The view is
defined **once in Postgres** (schema `auth`) and read by both consumers: the API for `RequireActionAt`,
and StarRocks through the `radiant_jdbc` catalog for the tenant view masks.

Grain: one row = *this user may see this patient's data in this package, in this representation,
through this path, until this time*.

```
auth.entitlement (user_id, tenant_code, protocol_code, package_code, enrollment_id, patient_id,
                  profile_code, path, valid_to)
```

Additional columns assumed: `data_package.cc_phi_allowed boolean`, and a `template_gate(template_code,
state, site_study, verified_care, coordinating, shared_reader)` table seeded from configuration at startup
(the four handoff templates × five states, validated in Go, joined in SQL).

```sql
CREATE VIEW auth.entitlement AS
WITH
live_assignment AS (
    SELECT ra.* FROM role_assignment ra
    WHERE ra.revoked_at IS NULL
      AND ra.valid_from <= now() AND (ra.valid_to IS NULL OR now() < ra.valid_to)
),
live_participation AS (
    SELECT pp.* FROM protocol_participation pp
    WHERE pp.valid_from <= now() AND (pp.valid_to IS NULL OR now() < pp.valid_to)
),
live_site_rel AS (
    SELECT esr.* FROM enrollment_site_relationship esr
    WHERE esr.valid_from <= now() AND (esr.valid_to IS NULL OR now() < esr.valid_to)
),
package_state AS (            -- no publication row = RESTRICTED
    SELECT dp.tenant_code, dp.protocol_code, dp.code AS package_code, dp.cc_phi_allowed,
           COALESCE(pub.state, 'RESTRICTED') AS state, pub.profile_code AS shared_profile,
           g.site_study, g.verified_care, g.coordinating, g.shared_reader
    FROM data_package dp
    LEFT JOIN publication pub ON pub.tenant_code = dp.tenant_code AND pub.protocol_code = dp.protocol_code
                             AND pub.package_code = dp.code
    JOIN template_gate g ON g.template_code = dp.template_code AND g.state = COALESCE(pub.state, 'RESTRICTED')
),
role_profiles AS (
    SELECT rp.tenant_code, rp.role_code, rp.profile_code, prof.classification
    FROM role_profile rp
    JOIN representation_profile prof ON prof.tenant_code = rp.tenant_code AND prof.code = rp.profile_code
                                    AND prof.status = 'approved'
),
-- PATH 1: site study staff
path_site AS (
    SELECT a.user_id, a.tenant_code, pp.protocol_code, ps.package_code, e.id AS enrollment_id, e.patient_id,
           rp.profile_code, 'SITE_STUDY' AS path,
           LEAST(COALESCE(a.valid_to,'infinity'), COALESCE(pp.valid_to,'infinity'), COALESCE(esr.valid_to,'infinity')) AS valid_to
    FROM live_assignment a
    JOIN live_participation pp ON pp.id = a.participation_id AND pp.function IN ('enrolling_site','treating_site')
    JOIN live_site_rel esr     ON esr.participation_id = pp.id
    JOIN enrollment e          ON e.id = esr.enrollment_id AND e.status <> 'withdrawn'
    JOIN package_state ps      ON ps.tenant_code = pp.tenant_code AND ps.protocol_code = pp.protocol_code AND ps.site_study
    JOIN role_profiles rp      ON rp.tenant_code = a.tenant_code AND rp.role_code = a.role_code
    WHERE a.scope_type = 'participation'
),
-- PATH 2: verified treating clinician (care relationship, not a role; profiles from tenant-level roles)
path_care AS (
    SELECT cr.user_id, cr.tenant_code, e.protocol_code, ps.package_code, e.id, e.patient_id,
           rp.profile_code, 'VERIFIED_CARE', COALESCE(cr.valid_to,'infinity')
    FROM care_relationship cr
    JOIN enrollment e      ON e.tenant_code = cr.tenant_code AND e.patient_id = cr.patient_id AND e.status <> 'withdrawn'
    JOIN package_state ps  ON ps.tenant_code = e.tenant_code AND ps.protocol_code = e.protocol_code AND ps.verified_care
    JOIN live_assignment a ON a.user_id = cr.user_id AND a.tenant_code = cr.tenant_code AND a.scope_type = 'tenant'
    JOIN role_profiles rp  ON rp.tenant_code = a.tenant_code AND rp.role_code = a.role_code
    WHERE cr.valid_from <= now() AND (cr.valid_to IS NULL OR now() < cr.valid_to)
),
-- PATH 3: coordinating center (whole protocol; identified only if the package allows CC PHI)
path_cc AS (
    SELECT a.user_id, a.tenant_code, pp.protocol_code, ps.package_code, e.id, e.patient_id,
           rp.profile_code, 'COORDINATING', LEAST(COALESCE(a.valid_to,'infinity'), COALESCE(pp.valid_to,'infinity'))
    FROM live_assignment a
    JOIN live_participation pp ON pp.id = a.participation_id AND pp.function = 'coordinating_center'
    JOIN enrollment e          ON e.tenant_code = pp.tenant_code AND e.protocol_code = pp.protocol_code AND e.status <> 'withdrawn'
    JOIN package_state ps      ON ps.tenant_code = pp.tenant_code AND ps.protocol_code = pp.protocol_code AND ps.coordinating
    JOIN role_profiles rp      ON rp.tenant_code = a.tenant_code AND rp.role_code = a.role_code
                              AND (rp.classification = 'deidentified' OR ps.cc_phi_allowed)
    WHERE a.scope_type = 'participation'
),
-- PATH 4: consortium shared reader (tenant role + RELEASED publication, its profile only)
path_shared AS (
    SELECT a.user_id, a.tenant_code, e.protocol_code, ps.package_code, e.id, e.patient_id,
           ps.shared_profile, 'CONSORTIUM_SHARED', COALESCE(a.valid_to,'infinity')
    FROM live_assignment a
    JOIN role_profiles rp ON rp.tenant_code = a.tenant_code AND rp.role_code = a.role_code
    JOIN package_state ps ON ps.tenant_code = a.tenant_code AND ps.shared_reader AND ps.state = 'RELEASED'
                         AND ps.shared_profile = rp.profile_code
    JOIN enrollment e     ON e.tenant_code = ps.tenant_code AND e.protocol_code = ps.protocol_code AND e.status <> 'withdrawn'
    WHERE a.scope_type = 'tenant'
),
all_paths AS (
    SELECT * FROM path_site UNION SELECT * FROM path_care UNION SELECT * FROM path_cc UNION SELECT * FROM path_shared
)
-- restrictions apply on top of every path and only ever remove rows
SELECT p.* FROM all_paths p
WHERE NOT EXISTS (
    SELECT 1 FROM restriction r
    WHERE r.tenant_code = p.tenant_code
      AND r.valid_from <= now() AND (r.valid_to IS NULL OR now() < r.valid_to)
      AND (   (r.target_type = 'patient'    AND r.target_id = p.patient_id::text)
           OR (r.target_type = 'enrollment' AND r.target_id = p.enrollment_id::text)
           OR (r.target_type = 'package'    AND r.target_id = p.protocol_code || '/' || p.package_code)
           OR (r.target_type = 'protocol'   AND r.target_id = p.protocol_code))
      AND (   (r.prohibited_profiles = '{}' AND r.prohibited_actions = '{}')   -- total block
           OR p.profile_code = ANY (r.prohibited_profiles))
);
```

Example for a lab geneticist with an identified grant at her lab who is also a consortium member:

| user_id | protocol | package | enrollment | patient | profile | path |
|---|---|---|---|---|---|---|
| alice | P035 | germline_snv | 101 | 1001 | identified | SITE_STUDY |
| alice | P035 | germline_snv | 101 | 1001 | deidentified_v1 | SITE_STUDY |
| alice | P035 | germline_snv | 102 | 1002 | deidentified_v1 | CONSORTIUM_SHARED |
| alice | P030 | clinical | 250 | 2001 | deidentified_v1 | CONSORTIUM_SHARED |

**Collapsing before joining.** `auth.entitlement` keeps one row per profile (so the API can `EXISTS`
on an exact profile). A masking view must never join it directly or rows duplicate. It joins a collapsed
view that resolves one profile per user and patient (the most identified any path allows):

```sql
CREATE VIEW auth.profile_rank AS
SELECT tenant_code, code AS profile_code,
       CASE classification WHEN 'identified' THEN 4 WHEN 'coded_phi' THEN 3
                           WHEN 'limited_data_set' THEN 2 ELSE 1 END AS rank
FROM representation_profile WHERE status = 'approved';

CREATE VIEW auth.package_profile AS          -- one row per (user, tenant, patient, package)
SELECT e.user_id, e.tenant_code, e.patient_id, e.package_code,
       (array_agg(e.profile_code ORDER BY r.rank DESC))[1] AS profile_code
FROM auth.entitlement e
JOIN auth.profile_rank r ON r.tenant_code = e.tenant_code AND r.profile_code = e.profile_code
GROUP BY e.user_id, e.tenant_code, e.patient_id, e.package_code;

CREATE VIEW auth.patient_profile AS          -- one row per (user, tenant, patient), across packages
SELECT e.user_id, e.tenant_code, e.patient_id,
       (array_agg(e.profile_code ORDER BY r.rank DESC))[1] AS profile_code
FROM auth.entitlement e
JOIN auth.profile_rank r ON r.tenant_code = e.tenant_code AND r.profile_code = e.profile_code
GROUP BY e.user_id, e.tenant_code, e.patient_id;
```

**Consumers and where masking lives.** Same split as today: the view carries scope and a per-row
profile column; **Ranger masks**. Nothing in the view SQL masks a value.

| Layer | Today | Target |
|---|---|---|
| Postgres `auth.*` | `pii_grant`, `pii_lab_patient` (who has `can_read_pii` where) | `entitlement`, `patient_profile`, `package_profile` (who sees which rows at which profile) |
| StarRocks `<tenant>_tenant.patient` | joins entitlement, adds boolean `can_read_pii`, no masking | joins `auth.patient_profile`, adds `profile_code`, filters rows, no masking |
| Ranger mask policies | `CASE WHEN can_read_pii THEN {col} ELSE '***' END` (`sr_mask_pii_redact`, `sr_mask_dob`) | one policy per column **generated from `representation_profile.fields`**, keyed on `profile_code` |
| Ranger access policies | tenant DB access at login, `admin_role` bypass | unchanged |
| Ranger row filter | `user_id = current_user()` on `auth.*` views | unchanged (+ optional patient row scope, see below) |

```sql
-- patient.sql.tmpl: scope + profile column only
SELECT p.*, pp.profile_code
FROM radiant_jdbc.public.patient p
JOIN radiant_jdbc.auth.patient_profile pp
  ON pp.patient_id = p.id AND pp.tenant_code = '{{.TenantCode}}'
 AND pp.user_id = substring_index(substr(current_user(), 2), char(39), 1)
-- occurrence views join auth.package_profile with their package_code, same shape
```

`representation_profile.fields` is the FieldResourceBinding and the input of the policy generator (`ranger_masking.go`
grown into the handoff's compiler). Per column, treatments across profiles become one Ranger mask:

| `fields` treatment (`identified` / `deidentified_v1`) | generated mask expression |
|---|---|
| `pass` / `redact`    | `CASE WHEN profile_code = 'identified' THEN {col} ELSE '***' END` |
| `pass` / `year_only` | `CASE WHEN profile_code = 'identified' THEN {col} ELSE date_trunc('year', {col}) END` |
| `pass` / `absent`    | `CASE WHEN profile_code = 'identified' THEN {col} ELSE NULL END` |

More profiles → one `WHEN` per profile. The generated set is deterministic from the approved profiles, so it
can be diffed against Ranger (drift detection, handoff §7.6).

**Row scope: view join vs Ranger row filter.** The join above filters rows inside the view (proven
pattern, and needed anyway to bring `profile_code` onto the row). The handoff prefers a native Ranger
row-filter policy on the view (`id IN (SELECT patient_id FROM auth.patient_profile WHERE user_id = ...)`).
Keep the join for the pilot; add the Ranger row filter as hardening once subqueries in row filters are
validated on our StarRocks build (I14-style test).

- "De-identified mode" for a user who also holds identified rights is **not** resolved by these views
  (they always return the best profile). The backend routes such requests to a separate view database
  built on the de-identified profile only; mode narrowing stays a backend responsibility (REQ-S05).
- The API replaces the org resolver: case → proband's enrollment → `EXISTS` a row in `auth.entitlement` for
  the caller, package and requested profile; actions come from `role_action` of the assignment behind
  that path. A requested profile with no row is a deny, never a downgrade (REQ-C23).

**Materialization.** The view fans out to users × enrollments × packages × profiles. Small for a lab
tenant; for a consortium it becomes a table refreshed on every `tenant.policy_epoch` bump. Same SQL,
different materialization; that refresh *is* the handoff's compiler. Actions are deliberately not in the
grain (they would multiply rows); the API resolves them in Postgres.

---

## 5. Request contract and middleware

- **Acting organization:** optional header `X-Acting-Org`; defaults to the single affiliation when there
  is one; validated against `user_affiliation`; recorded in `access_decision.acting_org`. Multi-affiliation
  users must send it (handoff `ACTING_ORG_MISMATCH`).
- **Representation:** optional query parameter `profile=` on read endpoints; default = the most
  identified profile the entitlement allows; a requested-but-unavailable profile is a **deny**, not a
  silent downgrade (handoff REQ-C23) unless `fallback=deidentified` is passed and labelled in the response.
- `RequireAction` / `RequireAnyAction` unchanged for tenant-scoped actions.
- `RequireActionAt` keeps its signature; `org_resolvers.go` becomes *participation* resolvers:
  `case → proband enrollment → enrollment_site_relationship → participation`, and the check is "caller holds a
  valid `role_assignment` on one of those participations, or a valid care relationship, or a coordinating
  assignment on the protocol". The 403 stays generic.
- Every decision writes one `access_decision` row (allow and deny). The request-id middleware already
  supplies `request_id`; the per-user pool middleware captures `last_query_id()` before returning the
  connection.
- `tenant.policy_epoch` is read at admission and stored in the per-user pool key; any change to
  §3.2–3.5 tables bumps it, which invalidates cached pools and result caches (handoff REQ-S08).

---

### 5.1 Two families of checks: visibility vs capability

| Family | Question | Checked against |
|---|---|---|
| Data visibility (reads; writes on an existing case: interpret, comment, flag, download) | may the user reach *these patient rows* at *this profile* | `auth.entitlement`, then `role_action` of the assignment behind the matching path |
| Capabilities without a target row yet (`can_ingest_data`, `can_manage_*`) | may the user act *for this organization in this protocol* | `role_assignment` scope directly; no enrollment involved |

**Case creation (`POST /:tenant/cases/batch`).** The payload names `project` (→ protocol) and
`diagnosis_lab_code` per case; together they identify a `protocol_participation`.

1. Resolve each case's `(protocol, diagnosis_lab)` to a participation with function `enrolling_site` or
   `treating_site`. Unknown → batch validation error (new rule code). Ingestion never creates participations.
2. Authorize once per distinct participation (today's `RequireActionAtEvery`, scope = participation):

```sql
SELECT 1
FROM role_assignment a
JOIN role_action ra ON ra.tenant_code = a.tenant_code AND ra.role_code = a.role_code
                   AND ra.action_code = 'can_ingest_data'
LEFT JOIN protocol_participation pp ON pp.id = a.participation_id
WHERE a.user_id = :sub AND a.tenant_code = :tenant AND a.revoked_at IS NULL
  AND a.valid_from <= now() AND (a.valid_to IS NULL OR now() < a.valid_to)
  AND (  a.scope_type = 'tenant'                                   -- replaces today's '*'
      OR (a.scope_type = 'participation' AND pp.protocol_code = :protocol AND pp.org_code = :diagnosis_lab
          AND pp.function IN ('enrolling_site','treating_site')
          AND pp.valid_from <= now() AND (pp.valid_to IS NULL OR now() < pp.valid_to)))
```

3. Write the case, then the governance rows: for **every patient of the case** (proband and family members),
   an `enrollment (protocol, patient)` if absent, and an `enrollment_site_relationship` of type `enrolling` to
   the participation (added, never replaced, when the patient is already enrolled through another site).
   Case visibility = entitlement on the proband's enrollment; each patient row is masked by their own.
4. The `SITE_STUDY` path now yields rows for everyone assigned to that participation. No Ranger change.

`cases.diagnosis_lab_code` is what ingestion *reads* to find the participation; it is not consulted for
authorization afterwards. Both families share one resolver shape: existing case → enrollment → site
relationships → participations; new case → payload → participation. `RequireActionAt` keeps its signature.

## 6. Staged delivery

| Stage | Adds | Depends on protocol data? | Visible behaviour change |
|---|---|---|---|
| 1 | `role_assignment` with validity/history, `access_decision`, `policy_change_audit`, `policy_epoch`, per-user pool on by default | no | none (admin UI gets validity dates) |
| 2 | `protocol`, `protocol_participation`, `enrollment`, `enrollment_site_relationship`, `case_enrollment`, participation resolvers, bootstrap from existing cases | no (bootstrapped) | none; transfers/closeouts become expressible |
| 3 | `representation_profile`, `role_profile`, `auth.entitlement`, profile-driven view templates, `profile=` parameter | no | `can_read_pii` retired in favour of profiles |
| 4 | `care_relationship`, `data_package`, `publication`, `release_event`, `restriction`, template gates, `X-Acting-Org` | yes | consortium sharing and embargoes exist |

Stages 1–3 are valuable for a clinical-lab tenant on their own. Stage 4 is only needed if Radiant hosts
research protocols with an expanded audience.

---

## 7. Open questions

1. Is `project` really the protocol, or does one project contain several protocols? Decides whether
   `protocol` extends `project` or sits under it.
2. Enrollment is per patient; a case spans the enrollments of its proband and family members (via `family`).
   Confirm that family members are participants of the protocol in every tenant, or add an enrollment role
   (proband | relative) with its own consent basis.
3. Who approves a `representation_profile`? The handoff wants an IRB/privacy sign-off recorded; today we
   have no such role. A `can_approve_profile` action on `tenant_admin` is the minimal answer.
4. Should `purposes` on the assignment be stored at all in stages 1–3? It costs a column now and avoids
   a migration later, but nothing evaluates it until stage 4.
5. Ranger policy shape after #72910: does the fixed check target the view or its base table? Determines
   whether `sr_access_*` policies need to move.
