# ADR: Practitioner Model for Radiant Portal

- **Status:** Proposed
- **Date:** 2026-05-11
- **Authors:** Architecture Team
- **Stakeholders:** Clinical product, platform engineers
- **Related:** [Security & Multi-Tenancy Architecture](./multi-tenancy-security.md)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Decision Drivers](#2-decision-drivers)
3. [Solution](#3-solution)
   - [Data Model](#data-model)
   - [Authorization Model](#authorization-model)
   - [Admin Flows](#admin-flows)
4. [Alternatives Considered](#4-alternatives-considered)
5. [Implementation Impact](#5-implementation-impact)
6. [Open Questions](#6-open-questions)

---

## 1. Problem Statement

The portal needs to model **Practitioners** — health professionals such as physicians, geneticists, and referring clinicians — as first-class entities distinct from portal Users.

Key requirements:

- A Practitioner **may or may not** be a portal User. External practitioners who never log in must still be representable.
- The `cases.practitioner_id` column references a Practitioner (not a User), so case creation does not require the practitioner to have a portal account.
- When adding a User who is also a clinician, the admin must be able to **link the User to an existing Practitioner** or **create a new Practitioner inline**.
- The same real-world clinician can act as a Practitioner at **multiple tenants** (e.g. a geneticist consulting for both CBTN and UDN).
- Some portal actions are practitioner-specific (be listed as practitioner, be assigned a case, sign reports) and should be controlled by a dedicated role.

This concept aligns with FHIR's [`Practitioner`](https://www.hl7.org/fhir/practitioner.html) resource — a domain identity for healthcare professionals, independent of authentication.

---

## 2. Decision Drivers

| Driver | Implication |
|---|---|
| **External practitioners exist** | Practitioner cannot be derived from the `users` table — it must stand alone. |
| **Tenant isolation** | Each tenant owns its own Practitioner catalog. Data hygiene rules vary (license jurisdictions, specialty notation, contact info). |
| **Same person, multiple tenants** | A single User identity may correspond to one Practitioner row **per tenant** — not a single global record. |
| **Historical case integrity** | Deleting a User must not orphan or delete the Practitioner record referenced by historical cases. |
| **Action authorization** | Practitioner-specific actions (prescribing, case assignment, report signing) plug into the existing `auth_db` role/action model rather than creating a parallel authorization system. |

---

## 3. Solution

### Data Model

The Practitioner table lives in the **main PostgreSQL schema** (not `auth_db`). It is a domain entity, referenced by `cases` and optionally linked to `auth_db.users`.

```sql
CREATE SEQUENCE public.practitioner_id_seq;

CREATE TABLE public.practitioner (
    id               integer      NOT NULL DEFAULT nextval('public.practitioner_id_seq'),
    tenant_id        VARCHAR(50)  NOT NULL REFERENCES auth_db.tenant(tenant_id),
    first_name       VARCHAR(200) NOT NULL,
    last_name        VARCHAR(200) NOT NULL,
    email            VARCHAR(200),
    license_number   VARCHAR(100),
    specialty        VARCHAR(100),
    active           BOOLEAN      NOT NULL DEFAULT TRUE,
    username         VARCHAR(100) REFERENCES auth_db.users(username) ON DELETE SET NULL,
    created_at       TIMESTAMP    NOT NULL DEFAULT now(),
    created_by       VARCHAR(100),
    PRIMARY KEY (id),
    -- One practitioner row per (user, tenant) when linked.
    -- Unlinked rows (username IS NULL) are unconstrained — NULLs are distinct in PostgreSQL UNIQUE.
    UNIQUE (username, tenant_id),
    -- Composite UNIQUE so other tables can reference (id, tenant_id) as a composite FK,
    -- structurally enforcing same-tenant linkage. id is already unique via PK, so this
    -- constraint is essentially free.
    UNIQUE (id, tenant_id)
);
CREATE INDEX idx_practitioner_tenant   ON public.practitioner(tenant_id);
CREATE INDEX idx_practitioner_username ON public.practitioner(username);
```

#### Key design choices

| Choice | Rationale |
|---|---|
| **Per-tenant rows** (composite `UNIQUE(username, tenant_id)`) | A clinician working at two tenants gets two rows. Each tenant's admin owns its catalog. Data may legitimately differ (license per jurisdiction, recorded specialty, contact details). |
| **No `org_id` column** | A User who is a Practitioner can serve at multiple orgs within a tenant; their org membership is already captured by `auth_db.user_org_role`. Storing org on the practitioner row would either duplicate that data or force one-row-per-org. External (non-User) practitioners simply have no org granularity recorded — acceptable, since they don't carry portal permissions. |
| **`username` nullable** | External (non-user) practitioners are first-class. |
| **`ON DELETE SET NULL`** on `username` FK | Deleting a User de-links but preserves the Practitioner record — historical case practitioners remain valid. |
| **`active` flag instead of hard delete** | Same as above: historical cases keep their reference to deactivated practitioners. |
| **`integer` primary key with explicit sequence** | Matches the project-wide PostgreSQL convention (all existing tables use `id integer NOT NULL` driven by a `*_id_seq` sequence). |
| **Composite `UNIQUE (id, tenant_id)`** | Allows other tables (notably `cases`) to reference `(id, tenant_id)` as a composite FK, structurally enforcing same-tenant linkage. Defense-in-depth: cross-tenant references fail at the DB layer, not just in the API. |

#### Behavior summary

| Scenario | Allowed | Reason |
|---|---|---|
| Same user, different tenants (e.g. `alice` at CBTN and UDN) | ✅ | Composite UNIQUE permits two rows |
| Same user, same tenant, multiple orgs | ✅ — one row covers all orgs | Org membership is captured in `auth_db.user_org_role`, not on the practitioner row |
| Same user, same tenant | ❌ duplicate | `UNIQUE(username, tenant_id)` catches it |
| Multiple unlinked practitioners per tenant | ✅ | `username IS NULL` rows coexist (PG treats NULLs as distinct) |

### Cases — practitioner column

```sql
ALTER TABLE public.cases ADD COLUMN practitioner_id integer;
CREATE INDEX idx_cases_practitioner ON public.cases(practitioner_id);

-- Composite FK against (id, tenant_id) — guarantees the practitioner row and the
-- case row share the same tenant_id at the database level.
ALTER TABLE public.cases
    ADD CONSTRAINT cases_practitioner_fk
    FOREIGN KEY (practitioner_id, tenant_id)
    REFERENCES public.practitioner (id, tenant_id);
```

`practitioner_id` is the **resolved FK** to a `practitioner` row. It is nullable: cases may be created without a practitioner, and a practitioner can be assigned later through the admin UI.

**Eligibility rule for `practitioner_id`** (API-enforced — see [Authorization Model](#authorization-model)): a case may only be linked to a practitioner that is **(a)** linked to a User (`practitioner.username IS NOT NULL`), and **(b)** holds the `practitioner` role at the case's `(tenant_id, org_id)` — i.e. a matching row in `auth_db.user_org_role` with `role_id = 'practitioner'`, either at the case's specific `org_id` or via the `*` wildcard. External (non-User) practitioner records may exist for historical or pending-resolution data but cannot be attached to a case.

**At case creation**, the API accepts an optional `practitioner_submitter_id` field in the request payload — an external identifier (license number or equivalent, format TBD; see [Open Questions](#6-open-questions)). The handler resolves it to a `practitioner` row in the active tenant:

- **Field absent** → case created with `practitioner_id = NULL`.
- **Field present and matches an eligible practitioner** → `practitioner_id` set to the resolved row. *Eligible* = User-linked **and** holds the `practitioner` role at the case's `(tenant_id, org_id)` (see [Eligibility rule](#cases--practitioner-column)).
- **Field present and no match** → rejected with a dedicated error code (e.g. `422 practitioner_not_found`); the case is **not** created.
- **Field present, practitioner found, but ineligible** (no User link, or User lacks the `practitioner` role at the case's org) → rejected with a distinct error code (e.g. `422 practitioner_not_eligible`); the case is **not** created. This forces the caller to either correct the identifier or grant the missing role, rather than silently dropping the reference or creating a case with an unauthorized practitioner.

**`practitioner_submitter_id` is not persisted on the case** — only the resolved FK is stored. Cases without a practitioner at creation time are attached later through the admin UI (see [Admin Flows](#admin-flows)).

The composite FK on `(practitioner_id, tenant_id)` enforces tenant alignment at the database level: any attempt to attach a UDN practitioner to a CBTN case (or vice versa) fails with a constraint violation, regardless of whether the API filtered correctly. This is the same defense-in-depth principle the security ADR applies to row visibility — the database is authoritative, the application is the convenience layer.

### Authorization Model

Two additions to the existing `auth_db` model (see [Security & Multi-Tenancy ADR §5](./multi-tenancy-security.md#5-authorization-model-auth_db)):

#### New role: `practitioner` (org-scoped)

Granted to Users who act as clinicians in the portal. Default actions:

| Action | Purpose |
|---|---|
| `can_be_assigned_as_practitioner` | Appears in the practitioner picker on case create/edit |
| `can_be_assigned_case` | Appears in the case-assignee picker |
| `can_sign_report` | Sign or approve the final genetic report |

The `practitioner` role is **orthogonal** to clinical-skill roles like `geneticist` and `bioinformatician`. A user typically holds both: `geneticist` grants interpretation actions, `practitioner` grants prescribing/assignment actions.

#### New action: `can_manage_practitioner` (tenant-scoped)

CRUD authority over the Practitioner catalog. Defaults: `tenant_admin`, `tenant_owner`.

#### Invariants

**I1 — Tenant-scoped role/link consistency.** The `practitioner` role at tenant T can only be granted to a User who has a linked Practitioner row at tenant T. Granting at CBTN does not require a UDN practitioner row. Enforced at the admin API layer.

**I2 — Case-practitioner eligibility.** A `cases.practitioner_id` may only reference a practitioner that is **(a)** linked to a User (`practitioner.username IS NOT NULL`), and **(b)** holds the `practitioner` role at the case's `(tenant_id, org_id)` — i.e. has a matching `auth_db.user_org_role` row with `role_id = 'practitioner'`, with `org_id` either matching exactly or via the `*` wildcard. Enforced at the API layer on every operation that writes `practitioner_id` (case create, post-creation assignment, bulk import). External practitioners may exist as records but cannot satisfy this invariant.

### Admin Flows

#### User edit panel (per active tenant)

The Practitioner-link section operates within the active tenant only — a CBTN admin sees only the CBTN practitioner row, a UDN admin sees only theirs.

Three states:

- **Not linked** — the User is not a clinician at this tenant.
- **Linked to existing** — searches the active tenant's practitioner catalog.
- **Create new** — inline form. Creates a Practitioner row at the active tenant and links it in a single transaction.

If the `practitioner` role is granted at the active tenant, the link is required at that tenant.

#### Case creation

Case creation is API-driven (typically from an external submitter or ETL). The request payload optionally includes `practitioner_submitter_id` (an external identifier). The handler resolves it to a `practitioner` row in the active tenant per the rules in [Cases — practitioner column](#cases--practitioner-column):

- Absent → case created with no practitioner.
- Present and resolved → case created with `practitioner_id` set.
- Present and unresolved → request rejected with a dedicated error code; no case created.

There is **no inline practitioner-creation step** during case creation. Practitioner records are managed exclusively by holders of `can_manage_practitioner` (see [Practitioner directory](#practitioner-directory-new-admin-page)) — the set of users who submit/assign cases is operationally distinct from the set of users who maintain the practitioner catalog.

#### Practitioner assignment after case creation

Cases created without a resolved practitioner can have one attached later. An authorized user opens the case, picks a practitioner from a typeahead over `practitioner` filtered to **eligible candidates only** — `active = true`, `username IS NOT NULL`, and holding the `practitioner` role at the case's `(tenant_id, org_id)` (specific match or `*` wildcard). External practitioners and Users without the role at the case org do not appear. The handler re-validates eligibility (invariant **I2**) and the composite FK before writing `practitioner_id`. If the desired practitioner does not yet exist in the catalog, or lacks the role, the user contacts a `can_manage_practitioner` (for the record) or `can_invite_user`/`tenant_admin` (for the role grant) holder first — assignment and provisioning remain separate flows.

#### Practitioner directory (new admin page)

- List and search practitioners for the active tenant.
- Full CRUD, gated by `can_manage_practitioner`.
- Shows the linked User (if any) with a shortcut to that User's admin page.

---

## 4. Alternatives Considered

### Single global Practitioner identity (tenant-agnostic)

Model Practitioner as tenant-agnostic, with a separate `practitioner_tenant` join table for tenant membership — analogous to how `users` relates to `user_tenant_role`.

**Pros:**
- Single source of truth per real-world person.
- Closer to FHIR's tenant-agnostic Practitioner resource.

**Cons:**
- Cross-tenant data sharing of Practitioner records contradicts the tenant-isolation philosophy of the rest of the architecture (per ADR §3 — every other PostgreSQL table is tenant-scoped via a `tenant_id` column).
- A Practitioner referenced in CBTN cases would be visible to UDN admins through the shared catalog.
- More complex queries (every read joins through the membership table).
- No realistic use case yet for cross-tenant deduplication.

**Verdict:** rejected. The per-tenant model aligns with the rest of the schema; if cross-tenant identity becomes a need, a nullable `external_id` (NPI, ORCID, etc.) on the per-tenant row can bridge it without schema rework.

### Modeling Practitioner as a role only (no entity table)

Drop the Practitioner table entirely; treat "is a practitioner" as the boolean condition "User holds the `practitioner` role at tenant T". Store practitioner on cases as a `practitioner_username` FK to `users`.

**Pros:**
- Fewer tables.

**Cons:**
- Cannot represent external (non-User) practitioners — the central requirement.
- Couples domain identity to authentication: an external referring clinician becomes a phantom User with no login.
- Practitioner-specific fields (license, specialty, NPI) have no natural home.

**Verdict:** rejected. The requirement to represent non-User practitioners is fundamental.

### `UNIQUE(username)` (single global link per User)

Original proposal before the multi-tenant edge case was raised.

**Cons:**
- Blocks the legitimate scenario of one User being a Practitioner at multiple tenants.
- Forces a single canonical record across tenants, contradicting tenant isolation.

**Verdict:** rejected in favor of `UNIQUE(username, tenant_id)`.

---

## 5. Implementation Impact

This work slots into the [Security & Multi-Tenancy](./multi-tenancy-security.md) epic as a parallel track of tickets (`PR-1` through `PR-6`). It does not change the critical path of the main epic but adds ~1 week to the Phase 1 / Phase 2 timeline.

| Ticket | Phase | Depends on | Scope |
|---|---|---|---|
| **PR-1** — Practitioner table + repository | Phase 1 (after E1b) | A1, E1b | PostgreSQL migration with composite UNIQUE; Go model + repository with `tenant_id` filtering |
| **PR-2** — `practitioner` role + actions in seeds | Phase 1 | A1 | Adds the role, 3 org-scoped actions, and `can_manage_practitioner`. Extends A1 seeds |
| **PR-3** — Practitioner admin API + tenant-scoped invariant | Phase 1 (parallel with A6) | PR-1, PR-2, A6 | CRUD endpoints + grant invariant ("`practitioner` role at T requires practitioner row at T") |
| **PR-4** — User ↔ practitioner linking in Users admin tab | Phase 1 (after A7) | PR-3, A7 | Per-tenant link/create-inline flow |
| **PR-5** — Practitioner directory page | Phase 1 (after A8) | PR-3 | New admin page (catalog UI) |
| **PR-6** — `cases.practitioner_id` + submitter resolution + post-creation picker | Phase 2 (after E1b) | PR-1, E1b | Schema migration (composite FK); case-create handler resolves `practitioner_submitter_id` → returns dedicated error on unresolved; post-creation practitioner picker on the case detail view |

PR-1, PR-2, and PR-3 can run in parallel with the A6/A7 wave. PR-6 piggybacks on E1b.

---

## 6. Open Questions

1. **Identifier fields.** `license_number` + `specialty` is a placeholder. Confirm what identifiers are actually required: US NPI, jurisdiction-specific license code, ORCID, or other.
2. **`practitioner_submitter_id` format and resolution field.** What is the format of the external identifier supplied at case-create time, and which column on `practitioner` is the resolution target — `license_number`, a new dedicated `submitter_id` column, or something else? Whichever column is chosen must be unique per tenant for unambiguous lookup; add an appropriate UNIQUE constraint once decided.
3. **Global identity bridge.** Do we anticipate needing "this CBTN practitioner is the same person as that UDN practitioner" for reporting or de-duplication? If yes, a nullable `external_id` can be added later without schema rework.
