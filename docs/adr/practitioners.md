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
   - [Cases — requester and supervisor columns](#cases--requester-and-supervisor-columns)
   - [Case practitioner assignments](#case-practitioner-assignments)
   - [Authorization Model](#authorization-model)
   - [Admin Flows](#admin-flows)
4. [Alternatives Considered](#4-alternatives-considered)
5. [Implementation Impact](#5-implementation-impact)
6. [Open Questions](#6-open-questions)

---

## 1. Problem Statement

The portal needs to model **Practitioners** — health professionals such as physicians, geneticists, and referring clinicians — as first-class entities distinct from portal Users.

Key requirements:

- A Practitioner **may or may not** be a portal User. External practitioners who never log in must still be representable — they appear on cases as **requester** and/or **supervisor** without needing a portal account.
- Each case has a **mandatory requester** (the ordering clinician) and an **optional supervisor** (required by business rule when the requester is a resident — enforced at the API layer).
- Each case can have **zero or more practitioner assignments** (clinicians actively working the case in the portal) managed via a join table. Unlike requester/supervisor, an assignee **must** be a portal User holding the `practitioner` role at the case's `(tenant_id, org_id)`.
- When adding a User who is also a clinician, the admin must be able to **link the User to an existing Practitioner** or **create a new Practitioner inline**.
- The same real-world clinician can act as a Practitioner at **multiple tenants** (e.g. a geneticist consulting for both CBTN and UDN).
- Some portal actions (case assignment, report signing) are practitioner-specific and controlled by a dedicated role.

This concept aligns with FHIR's [`Practitioner`](https://www.hl7.org/fhir/practitioner.html) resource — a domain identity for healthcare professionals, independent of authentication.

---

## 2. Decision Drivers

| Driver | Implication |
|---|---|
| **External practitioners exist** | Practitioner cannot be derived from the `users` table — it must stand alone. Requester and supervisor relationships do **not** require a portal account. |
| **Portal-active practitioners require auth** | Practitioners who *work cases inside the portal* (the assignment join) must be Users with the `practitioner` role at the case's `(tenant_id, org_id)`. Two-tier model: requester/supervisor = identity only; assignments = identity + authorization. |
| **Tenant isolation** | Each tenant owns its own Practitioner catalog. Data hygiene rules vary (license jurisdictions, specialty notation, contact info). |
| **Same person, multiple tenants** | A single User identity may correspond to one Practitioner row **per tenant** — not a single global record. |
| **Historical case integrity** | Deleting a User must not orphan or delete the Practitioner record referenced by historical cases (requester/supervisor relationships in particular outlive User accounts). |
| **Action authorization** | Practitioner-specific actions (case assignment, report signing) plug into the existing `auth_db` role/action model rather than creating a parallel authorization system. |

---

## 3. Solution

### Data Model

The Practitioner table lives in the **main PostgreSQL schema** (not `auth_db`). It is a domain entity, referenced by `cases` (as requester and supervisor) and by the [case practitioner assignment join table](#case-practitioner-assignments), and optionally linked to `auth_db.users`.

#### Prerequisite — `auth_db.users` gets a `user_id` column

The Practitioner ↔ User link uses the Keycloak `sub` (UUID) rather than `username`. This requires extending the `auth_db.users` table from the [Security & Multi-Tenancy ADR §5](./multi-tenancy-security.md#5-authorization-model-auth_db):

```sql
ALTER TABLE auth_db.users ADD COLUMN user_id UUID NOT NULL UNIQUE;
-- Backfilled from Keycloak `sub` during the existing user-migration script (A5).
-- `username` remains the PK (referenced by user_tenant_role / user_org_role) — user_id is an alternate key.
```

#### Practitioner table

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
    user_id          UUID         REFERENCES auth_db.users(user_id) ON DELETE SET NULL,  -- Keycloak sub; nullable for external practitioners
    created_at       TIMESTAMP    NOT NULL DEFAULT now(),
    created_by       VARCHAR(100),
    PRIMARY KEY (id),
    -- One practitioner row per (user, tenant) when linked.
    -- Unlinked rows (user_id IS NULL) are unconstrained — NULLs are distinct in PostgreSQL UNIQUE.
    UNIQUE (user_id, tenant_id),
    -- Composite UNIQUE so other tables can reference (id, tenant_id) as a composite FK,
    -- structurally enforcing same-tenant linkage. id is already unique via PK, so this
    -- constraint is essentially free.
    UNIQUE (id, tenant_id)
    -- Note: an additional UNIQUE constraint on the case-create lookup column
    -- (email or other) will be added once the resolution mechanism is finalized —
    -- see Open Questions.
);
CREATE INDEX idx_practitioner_tenant  ON public.practitioner(tenant_id);
CREATE INDEX idx_practitioner_user_id ON public.practitioner(user_id);
CREATE INDEX idx_practitioner_email   ON public.practitioner(email);
```

#### Key design choices

| Choice | Rationale |
|---|---|
| **Per-tenant rows** (composite `UNIQUE(user_id, tenant_id)`) | A clinician working at two tenants gets two rows. Each tenant's admin owns its catalog. Data may legitimately differ (license per jurisdiction, recorded specialty, contact details). |
| **No `org_id` column** | A User who is a Practitioner can serve at multiple orgs within a tenant; their org membership is already captured by `auth_db.user_org_role`. Storing org on the practitioner row would either duplicate that data or force one-row-per-org. External (non-User) practitioners simply have no org granularity recorded — acceptable, since they don't carry portal permissions. |
| **`user_id` nullable** (UUID, Keycloak `sub`) | External (non-user) practitioners are first-class. Using the Keycloak UUID rather than `username` decouples the link from the username-may-change concern and aligns with Keycloak's canonical identifier. |
| **`ON DELETE SET NULL`** on `user_id` FK | Deleting a User de-links but preserves the Practitioner record — historical case relationships remain valid. |
| **`active` flag instead of hard delete** | Same as above: historical cases keep their reference to deactivated practitioners. |
| **`integer` primary key with explicit sequence** | Matches the project-wide PostgreSQL convention (all existing tables use `id integer NOT NULL` driven by a `*_id_seq` sequence). |
| **Composite `UNIQUE (id, tenant_id)`** | Allows other tables (`cases` for requester/supervisor, the assignment join) to reference `(id, tenant_id)` as a composite FK, structurally enforcing same-tenant linkage. Defense-in-depth: cross-tenant references fail at the DB layer, not just in the API. |

#### Behavior summary

| Scenario | Allowed | Reason |
|---|---|---|
| Same user, different tenants (e.g. `alice` at CBTN and UDN) | ✅ | Composite UNIQUE permits two rows |
| Same user, same tenant, multiple orgs | ✅ — one row covers all orgs | Org membership is captured in `auth_db.user_org_role`, not on the practitioner row |
| Same user, same tenant | ❌ duplicate | `UNIQUE(user_id, tenant_id)` catches it |
| Multiple unlinked practitioners per tenant | ✅ | `user_id IS NULL` rows coexist (PG treats NULLs as distinct) |

### Cases — requester and supervisor columns

```sql
ALTER TABLE public.cases ADD COLUMN requester_id  integer NOT NULL;
ALTER TABLE public.cases ADD COLUMN supervisor_id integer;
CREATE INDEX idx_cases_requester  ON public.cases(requester_id);
CREATE INDEX idx_cases_supervisor ON public.cases(supervisor_id);

-- Composite FKs against (id, tenant_id) — guarantee the referenced practitioner
-- and the case share the same tenant_id at the database level.
ALTER TABLE public.cases
    ADD CONSTRAINT cases_requester_fk
    FOREIGN KEY (requester_id, tenant_id)
    REFERENCES public.practitioner (id, tenant_id);

ALTER TABLE public.cases
    ADD CONSTRAINT cases_supervisor_fk
    FOREIGN KEY (supervisor_id, tenant_id)
    REFERENCES public.practitioner (id, tenant_id);
```

Two FKs to `practitioner`:

- **`requester_id`** (NOT NULL) — the clinician who ordered the case. **No portal account required** and **no role check**: the requester may be an external practitioner. The single requirement is that the practitioner row belongs to the same tenant as the case (enforced structurally by the composite FK).
- **`supervisor_id`** (nullable) — required by business rule when the requester is a resident, optional otherwise. Same constraints as requester: tenant-aligned, no User/role requirement. The "is a resident" check is enforced at the API layer; the schema cannot express it directly. See [Open Questions](#6-open-questions) for how "resident" is determined.

Both columns capture **identity**, not portal authorization. Practitioners who actually *work* the case inside the portal are captured separately by the [case practitioner assignment join table](#case-practitioner-assignments), which carries the User-link + role requirement.

The composite FKs on `(requester_id, tenant_id)` and `(supervisor_id, tenant_id)` enforce tenant alignment at the database level: any attempt to attach a UDN practitioner to a CBTN case (or vice versa) fails with a constraint violation, regardless of whether the API filtered correctly. This is the same defense-in-depth principle the security ADR applies to row visibility — the database is authoritative, the application is the convenience layer.

### Case practitioner assignments

A separate join table captures the set of portal-active practitioners assigned to each case. Unlike requester/supervisor, every row in this table must be a User-linked practitioner holding the `practitioner` role at the case's `(tenant_id, org_id)`.

```sql
CREATE TABLE public.case_practitioner_assignment (
    case_id          integer     NOT NULL,
    practitioner_id  integer     NOT NULL,
    tenant_id        VARCHAR(50) NOT NULL,
    assigned_at      TIMESTAMP   NOT NULL DEFAULT now(),
    assigned_by      VARCHAR(100),
    PRIMARY KEY (case_id, practitioner_id),
    -- Tenant-aligned composite FKs.
    FOREIGN KEY (case_id, tenant_id)
        REFERENCES public.cases (id, tenant_id),
    FOREIGN KEY (practitioner_id, tenant_id)
        REFERENCES public.practitioner (id, tenant_id)
);
CREATE INDEX idx_cpa_case         ON public.case_practitioner_assignment(case_id);
CREATE INDEX idx_cpa_practitioner ON public.case_practitioner_assignment(practitioner_id);
```

> Requires `cases` to have `UNIQUE (id, tenant_id)` (parallel to the practitioner table). 

**Eligibility rule for assignments** (invariant **I3**, API-enforced — see [Authorization Model](#authorization-model)): a row in `case_practitioner_assignment` is valid only if the referenced practitioner is **(a)** linked to a User (`practitioner.user_id IS NOT NULL`), and **(b)** that User holds the `practitioner` role at the case's `(tenant_id, org_id)` — i.e. a matching row in `auth_db.user_org_role` with `role_id = 'practitioner'`, with `org_id` either matching exactly or via the `*` wildcard. External (non-User) practitioners and Users without the role at the case's org cannot be assigned. Enforced at the API layer on every INSERT.

### Authorization Model

Two additions to the existing `auth_db` model (see [Security & Multi-Tenancy ADR §5](./multi-tenancy-security.md#5-authorization-model-auth_db)):

#### New role: `practitioner` (org-scoped)

Granted to Users who act as clinicians in the portal. Default actions:

| Action | Purpose |
|---|---|
| `can_be_assigned_to_case` | Eligible to appear in `case_practitioner_assignment` for cases at the user's org |
| `can_sign_report` | Sign or approve the final genetic report |

The `practitioner` role is **orthogonal** to clinical-skill roles like `geneticist` and `bioinformatician`. A user typically holds both: `geneticist` grants interpretation actions, `practitioner` grants case-assignment actions.

Note: the requester and supervisor columns on `cases` do **not** gate on this role — they record an identity only, not a portal authorization. A practitioner can be the requester on hundreds of cases without ever logging in.

#### New action: `can_manage_practitioner` (tenant-scoped)

CRUD authority over the Practitioner catalog. Defaults: `tenant_admin`, `tenant_owner`.

#### Invariants

**I1 — Tenant-scoped role/link consistency.** The `practitioner` role at tenant T can only be granted to a User who has a linked Practitioner row at tenant T. Granting at CBTN does not require a UDN practitioner row. Enforced at the admin API layer.

**I2 — Requester/supervisor tenant alignment.** `cases.requester_id` and `cases.supervisor_id` must reference practitioner rows in the same tenant as the case. **Structurally enforced** by the composite FKs `(requester_id, tenant_id)` and `(supervisor_id, tenant_id)` against `practitioner (id, tenant_id)`. No User-link or role required — these are identity-only relationships.

**I3 — Assignment eligibility.** Every row in `case_practitioner_assignment` must reference a practitioner that is **(a)** linked to a User (`practitioner.user_id IS NOT NULL`), and **(b)** that User holds the `practitioner` role at the case's `(tenant_id, org_id)` — matching `auth_db.user_org_role.role_id = 'practitioner'`, with `org_id` either an exact match or `*`. Enforced at the API layer on INSERT (the composite FKs cover tenant alignment; user-link + role are application-level checks). External practitioners cannot be assigned.

**I4 — Supervisor required for resident requesters.** When `cases.requester_id` references a practitioner classified as a resident, `cases.supervisor_id` must be NOT NULL. Enforced at the API layer on case create/update. The exact mechanism for classifying a practitioner as a resident is open ([see Open Questions](#6-open-questions)).

### Admin Flows

#### User edit panel (per active tenant)

The Practitioner-link section operates within the active tenant only — a CBTN admin sees only the CBTN practitioner row, a UDN admin sees only theirs.

Three states:

- **Not linked** — the User is not a clinician at this tenant.
- **Linked to existing** — searches the active tenant's practitioner catalog.
- **Create new** — inline form. Creates a Practitioner row at the active tenant and links it in a single transaction.

If the `practitioner` role is granted at the active tenant, the link is required at that tenant.

#### Case creation

Case creation is API-driven, typically through the batch import endpoint described in [Import Case](https://www.notion.so/ferlab/Import-Case-2b1b0fcecb3d80318b07e6d430d82609). The request payload carries two external identifiers that the handler resolves into practitioner rows in the active tenant:

- **Requester identifier** (required) → resolves to `cases.requester_id`.
- **Supervisor identifier** (optional, required when the requester is a resident) → resolves to `cases.supervisor_id`.

**The exact identifier and resolution mechanism is an open question** ([see Open Questions](#6-open-questions)). The leading candidate is matching on `practitioner.email` within the active tenant, but this hasn't been confirmed — alternatives include `license_number`, a dedicated `submitter_id` column, or some other authoritative identifier supplied by the upstream system. Whichever field is chosen will get a `UNIQUE (<field>, tenant_id)` constraint for unambiguous lookup.

Resolution failures follow the existing batch-import validation rule format (Level / Error code / Path / Message — see the [Import Case](https://www.notion.so/ferlab/Import-Case-2b1b0fcecb3d80318b07e6d430d82609) spec). Existing CASE codes go up to `CASE-011`; new rules continue the sequence (final numbers to be confirmed against the codebase at implementation time):

| Rule | Level | Error code | Path | Message |
|---|---|---|---|---|
| Requester identifier is unknown. | error | `CASE-012` | `case[index]` | Requester `{requester_identifier}` for case `{index}` does not exist. |
| Supervisor identifier is unknown. | error | `CASE-013` | `case[index]` | Supervisor `{supervisor_identifier}` for case `{index}` does not exist. |
| Supervisor is missing while the requester is a resident (invariant **I4**). | error | `CASE-014` | `case[index]` | Supervisor is required for case `{index}` because requester is a resident. |

The existing `CASE-002` rule ("Value provided for a field not within acceptable values, or is missing if mandatory") already covers a missing required `requester_email`/identifier field — no new code is needed for the structural "field absent" case.

Tenant mismatch (a practitioner from another tenant referenced from a case) is caught structurally by the composite FKs and should never surface as a user-facing validation rule in normal operation. If it does, treat it as a server-side defect rather than user input error.

There is **no inline practitioner-creation step** during case creation. Practitioner records are managed exclusively by holders of `can_manage_practitioner` (see [Practitioner directory](#practitioner-directory-new-admin-page)) — the set of users who submit cases is operationally distinct from the set of users who maintain the practitioner catalog. The lookup never falls back to fuzzy matching: either the practitioner exists in the tenant catalog or the rule fails.

The submitted identifiers themselves are **not persisted on the case** — only the resolved `requester_id` and `supervisor_id` FKs. Changes to the practitioner record (e.g. corrected email) remain consistent because the case references the practitioner row, not a snapshot of the identifier at submission time.

#### Practitioner assignment after case creation

Adding a practitioner to a case's assignment list (a row in `case_practitioner_assignment`) is a separate operation, performed by users with the appropriate admin permission. An authorized user opens the case, picks a practitioner from a typeahead over `practitioner` filtered to **eligible candidates only** — `active = true`, `user_id IS NOT NULL`, and the linked User holds the `practitioner` role at the case's `(tenant_id, org_id)` (specific match or `*` wildcard). External practitioners and Users without the role at the case org do not appear. The handler re-validates eligibility (invariant **I3**) before INSERT. Removal is symmetric. If the desired practitioner does not yet exist in the catalog, or lacks the role, the user contacts a `can_manage_practitioner` (for the record) or `can_invite_user`/`tenant_admin` (for the role grant) holder first — assignment and provisioning remain separate flows.

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

Drop the Practitioner table entirely; treat "is a practitioner" as the boolean condition "User holds the `practitioner` role at tenant T". Store requester/supervisor on cases as `requester_user_id` / `supervisor_user_id` FKs to `users`.

**Pros:**
- Fewer tables.

**Cons:**
- Cannot represent external (non-User) practitioners — the central requirement. External requesters/supervisors are common and don't have portal accounts.
- Couples domain identity to authentication: an external referring clinician becomes a phantom User with no login.
- Practitioner-specific fields (license, specialty, NPI) have no natural home.

**Verdict:** rejected. The requirement to represent non-User practitioners is fundamental.

### `UNIQUE(user_id)` (single global link per User)

Original proposal before the multi-tenant edge case was raised.

**Cons:**
- Blocks the legitimate scenario of one User being a Practitioner at multiple tenants.
- Forces a single canonical record across tenants, contradicting tenant isolation.

**Verdict:** rejected in favor of `UNIQUE(user_id, tenant_id)`.

### Single `cases.practitioner_id` column (no requester/supervisor split, no assignment join)

Earlier iteration of this ADR proposed a single `practitioner_id` FK on cases gated by an eligibility rule (User-linked + `practitioner` role at the case's org). Equivalent of "one practitioner per case, must be a portal user".

**Cons:**
- Cannot model the requester/supervisor relationship for external practitioners — external referring physicians make up most case originators.
- Cannot model multiple practitioners working a case in the portal (the assignment fan-out).
- Conflates identity (who ordered the test) with portal authorization (who is working the case).

**Verdict:** rejected. The two-tier model — identity-only requester/supervisor on the case row, plus an authorization-gated assignment join — separates concerns cleanly and matches the actual operational use cases.

---

## 5. Implementation Impact

This work is sequenced **after** the [Security & Multi-Tenancy](./multi-tenancy-security.md) epic is complete. It assumes the following are already in place: `auth_db.users` (and the user-backfill from Keycloak), the tenant-scoped admin API, the `practitioner` role infrastructure in the role/action catalog, and `tenant_id` on the `cases` table. Within this practitioner epic, the only dependencies tracked below are between the `PR-X` tickets themselves.

| Ticket | Depends on | Scope |
|---|---|---|
| **PR-0** — Extend `auth_db.users` with `user_id UUID` | — | `ALTER TABLE auth_db.users ADD COLUMN user_id UUID NOT NULL UNIQUE`; backfill from Keycloak `sub`. Blocks PR-1 |
| **PR-1** — Practitioner table + repository | PR-0 | PostgreSQL migration (composite UNIQUEs on `(user_id, tenant_id)` and `(id, tenant_id)`; case-create lookup UNIQUE deferred to PR-6 once the resolution field is chosen); Go model + repository with `tenant_id` filtering |
| **PR-2** — `practitioner` role + actions in seeds | — | Adds the role, `can_be_assigned_to_case`, `can_sign_report`, and `can_manage_practitioner` to the existing role/action seed pipeline |
| **PR-3** — Practitioner admin API + tenant-scoped invariant (I1) | PR-1, PR-2 | CRUD endpoints + grant invariant ("`practitioner` role at T requires practitioner row at T") |
| **PR-4** — User ↔ practitioner linking in Users admin tab | PR-3 | Per-tenant link/create-inline flow on the existing Users admin tab |
| **PR-5** — Practitioner directory page | PR-3 | New admin page (catalog UI) |
| **PR-6** — Cases requester/supervisor columns + identifier resolution | PR-1 (**blocked by Open Question 3**) | Schema migration (requester_id NOT NULL, supervisor_id nullable, composite FKs, `UNIQUE(id, tenant_id)` on cases, `UNIQUE` on the chosen lookup column once Open Question 3 is resolved); case-create handler resolves requester/supervisor and emits validation rules matching the [Import Case](https://www.notion.so/ferlab/Import-Case-2b1b0fcecb3d80318b07e6d430d82609) format (proposed codes `CASE-012` / `CASE-013` / `CASE-014`, finalized against the codebase at implementation time); invariant I4 enforcement |
| **PR-7** — Case practitioner assignment join + admin UI | PR-1, PR-2 | `case_practitioner_assignment` schema + composite FKs; API to add/remove assignments enforcing invariant I3; assignment picker on the case detail view |

PR-0, PR-1, and PR-2 are the foundation; once they're in, PR-3/4/5/6/7 fan out and can run in parallel.

---

## 6. Open Questions

1. **Identifier fields.** `license_number` + `specialty` is a placeholder. Confirm what identifiers are actually required: US NPI, jurisdiction-specific license code, ORCID, or other.
2. **"Resident" classification.** Invariant **I4** requires the API to know whether the requester is a resident. The current schema has no such field. Options: add `is_resident BOOLEAN`, repurpose `specialty` with a controlled value, add a `level`/`rank` enum (`resident` / `attending` / `fellow` / …), or treat it as a derived attribute via a join to another reference table. Decide before PR-6.
3. **Case-create resolution mechanism for requester/supervisor.** *Major open question — blocks PR-6 schema finalization.* What identifier does the case-create API payload carry, and which `practitioner` column does the handler match against? Candidates:
   - **Email** — natural identifier, but assumes every practitioner (including external referrers) has an email on file. Would require `email` NOT NULL + `UNIQUE(email, tenant_id)`.
   - **License number** — likely available for clinicians but format varies by jurisdiction; UNIQUE per tenant.
   - **Dedicated `submitter_id` column** — an opaque identifier owned by the upstream submitter; decouples lookup from clinical identifiers but adds a new column.
   - **Multiple fallback fields** (try email first, then license_number) — flexible but harder to enforce uniqueness.

   Whichever is chosen needs a `UNIQUE (<field>, tenant_id)` constraint and shapes the case-create API contract. Decide before PR-6.
4. **Global identity bridge.** Do we anticipate needing "this CBTN practitioner is the same person as that UDN practitioner" for reporting or de-duplication? If yes, a nullable `external_id` can be added later without schema rework.
5. **Username column on `auth_db.users` after `user_id` is added.** Should the existing `user_tenant_role` / `user_org_role` FK chain stay on `username`, or migrate to `user_id` for consistency with the new practitioner link? Staying on `username` is non-disruptive; migrating is a larger change to A1 / A4 / A6.
