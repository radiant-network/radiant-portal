# PCX Patient Demo — Technical Analysis & Plan

Started 2026-09-29 · Celine Pelletier

## Context and goals

We are building a patient list and an 8-tab patient page in Radiant for a CBTN demo, fed by the PCX 3.0 clinical views, in about 14 to 18 dev days. The design is the prototype `radiant_patient_v6.2_clean.html`; the demo runs on tenant `radiant` in QA, with fake data consistent with the portal's seeded patients.

Goals:

- A clinician browses the cohort (mostly ATRT), filters it and opens a patient.
- The patient page tells the clinical story: diagnosis, timeline, treatments, imaging, genomics.
- PHI follows the portal rule exactly: identified at the organizations where the user holds `can_read_pii`, de-identified everywhere else.
- Portal patients link to their genomic cases, so the demo shows clinical and genomic data joined up.

## Scope

Every prototype screen is in scope, including the D.A.V.I.D assistant on LibreChat (at risk). Four tabs are fully covered by today's views; the rest wait on another team's views or stay static.

| Area | Data source | Status |
| --- | --- | --- |
| Patient list: table, search, filters | Secured views (new list view) | Covered |
| Cohort analytics: diagnosis, age, vital status by site, imaging share | Aggregations over the list view | Covered |
| Kaplan-Meier survival | YAC (R-16, HIDIVE), fed by our survival data | Built by YAC; integration to define |
| Overview: diagnosis, tumour, metastasis, demographics | Event and demographics views | Partial: laterality, M-stage, symptoms, source of diagnosis, MR diagnosis date missing |
| Overview: cancer predispositions | Other team | Missing |
| Timeline | Event, surgery, radiation, therapy views | Covered |
| Treatments | Surgery, radiation, therapy views | Covered |
| Genomics | Portal cases via `radiant_patient_id` | Covered for portal patients; empty state otherwise |
| Tumor Board | A dedicated view from the other team (not ready yet); report through a presigned URL | Waiting for its view |
| Laboratory | Four lab views (CBC, CSF results, CSF tumor analysis, Lansky/Karnofsky), seeded | Covered by data; in the demo if the PO confirms |
| Imaging | MRI view (Flywheel links) | Covered |
| Clinical Trials | Other team | Missing |
| External records (TEFCA) | None | Static card |
| Evidence link on the initial diagnosis | Link to BRIM, format unclear | In scope, unclear |
| D.A.V.I.D assistant (and the KM chat) | LibreChat | Separate track (LibreChat) |
| Feature toggle | Frontend beta feature "Patient View" + a backend flag that registers the /patients routes | In scope |

Tabs whose data is missing ship with an empty "data coming" state and are wired once the other team's schema is known.

## Data model and PHI rules

PHI is decided in StarRocks, per row and per user, by the secured `v_pcx_30_*` views in the tenant database (`radiant_tenant` for the demo); the API and the frontend only display what the view returns.

- **Layering.** Raw PCX tables (`radiant_data_dev` in PRD, `pcx_30_source` in QA) hold MRN, research ID, names and dates side by side and are never granted to users. Users read only the secured views, covered by the tenant's existing `view: *` Ranger policy.
- **One identifier column.** Each view collapses `mrn` / `research_id` into `patient_id`, with `patient_id_type` saying which. Name pairs collapse the same way (`given_name` or its `_deid` placeholder). A user can never get both identifiers of the same row.
- **Dates.** Calendar dates are NULL without PHI access; `age_at_*` columns are always visible. The UI shows "Day N · age X.Xy" for everyone and adds the date when present.
- **`can_read_phi` = the portal's `can_read_pii`.** A grant at the patient's organization (`auth.pii_grant`) or at the diagnosis lab of one of the patient's cases (`auth.pii_lab_patient`). It must stay identical to `views/patient.sql.tmpl`: otherwise matching `radiant_patient_id` against the portal would line up MRN and research ID.
- **`radiant_patient_id`.** The portal's `patient.id`, joined on the raw MRN from `radiant_jdbc.public.patient` (the tenant patient view masks it). NULL for patients not in the portal. `UNIQUE (organization_code, submitter_patient_id)` guarantees no duplicate rows.
- **Queries run as the user.** `STARROCKS_PROXY_READ_ENABLED` is on in every environment, so `current_user()` in the views is the caller. A request that missed the per-user pool falls back to root, which matches no grant: de-identified, fail-safe.

Portal patients are a subset of PCX patients: every portal patient has a PCX record, not the reverse.

## Backend design

The backend copies the case pattern (handler → StarRocks repository, `Field` registry, `TenantQualifiedName(ctx)`, `SearchResponse`) and adds four read endpoints plus one list view.

**New secured list view `v_pcx_30_patient_list`.** One row per patient: identifiers, demographics, vital status, initial diagnosis (from the first event), `age_at_initial_dx_days`, survival days, `has_imaging`, portal case count. It joins the source tables on the raw MRN and applies the PHI rule once, so every list column is filterable and sortable through the standard registry with no joins in Go.

Five read-only endpoints (search, autocomplete, filters, statistics, entity) gated by `can_search_case`, with a random `patient_key` in the URL. Endpoints, models and the frontend alignment: [API spec](02-api-spec.md).

## Frontend design

A new `apps/patient` app reuses the case list and case entity building blocks; the timeline is the only new component. The prototype already mirrors the portal's shadcn class names, so porting it is mostly mechanical.

- **App and routes.** Scaffold with `cli/create-application`; routes `patient/` and `patient/entity/:patientKey` under the `:tenant` layout in `portals/radiant/app/routes.ts`. Nav link behind a beta feature flag, so it shows only for the demo.
- **Data.** SWR over a new `patientApi` in `utils/api.ts` (generated client). The frontend never builds a patient key; it uses the one from the list row.
- **List page.** Copy of `case-exploration`: `DataTable` with server pagination and sort, `DataTableFilters` for vital status, site and diagnosis, the same search box as the case list, analytics card with the existing recharts bar charts, and a button opening YAC's Kaplan-Meier (HIDIVE).
- **Entity page.** Copy of `case-entity`: `HeaderNavigation` with diagnosis and vital status badges, `TabsNav` synced to `?tab=`, a context holding the entity, one component per tab built from shadcn `Card`s.
- **Identity display.** When `can_read_phi` is false: "Restricted" with a lock instead of the placeholder names, research ID as the identifier. Dates as "Day N · age X.Xy", calendar date added when present.
- **Timeline component.** Vertical list with phase bands opened at each disease event, glyphs per event type, kind toggles (diagnosis, surgery, radiation, treatment). No chart library. Needs a Storybook story.
- **Genomics tab.** Case table with links to the existing case pages; empty state for patients outside the portal.
- **Missing-data tabs.** Laboratory (beyond CBC), Clinical Trials and predispositions render an empty "data coming" state until the other team's views exist.
- **i18n.** `patient_exploration.*` and `patient_entity.*` keys in en and fr.

## Test data

QA gets fake PCX data on tenant `radiant`, consistent with the portal's seeded patients, and four demo users cover every branch of the PHI rule. Seed, users and demo script: [Test data & demo](04-test-data-and-demo.md).

## Decisions log

| Decision | Why |
| --- | --- |
| Demo on tenant `radiant` in QA, fake data consistent with the seeded portal patients | PRD data stays untouched; QA mirrors the real tenant |
| All prototype tabs, D.A.V.I.D included (on LibreChat, at risk) | Product scope for the demo |
| Fake cohort mostly ATRT | ATRT is the real use case |
| Missing data comes from the other team's future views; no invented schemas | Avoids rework when their views land |
| PHI decided in the views; `can_read_phi` = portal `can_read_pii`, both paths | One rule everywhere; `radiant_patient_id` would otherwise let users link MRN and research ID |
| `radiant_patient_id` joined on the raw MRN from `radiant_jdbc` | The tenant patient view masks the MRN for users without PII access |
| Patient URL key = random UUID from a lookup table (`pcx_30_patient_key` in the source database, exposed by the secured view `v_pcx_30_patient_key`); never a hash, never encrypted | MRN and research ID never side by side; a hash of an MRN can be brute-forced; no secret to hold (2026-10-05) |
| Links work for every user: the key is the same whether the caller sees the MRN or the research ID | The key carries no identifier; the view resolves it to what the caller may see |
| `/patients` routes gated by `can_search_case` | Same audience as case search; no migration |
| Queries run as the user (`STARROCKS_PROXY_READ_ENABLED` on everywhere) | Ranger and `current_user()` see the real caller |
| `pcx_30_source` / `radiant_data_dev` never granted to users | Users only reach the secured views |
| PHI follows `view_data_dictionary_access_policy.csv` and the portal's `can_read_pii` rule (organization or diagnosis lab), not the Notion page's "closed list": all calendar dates and lab free text masked, birth year visible to all, one identifier column (MRN or research ID, never both) | The access policy is the source of truth; same rule as the portal's patient views (confirmed 2026-10-02) |
| Search box behaves exactly like the case list's: autocomplete from 1 character, a selected suggestion becomes a filter, no free-text search | Consistency across the portal; the existing component is reused (2026-10-02) |
| Default sort: patients the user can identify first, then site, then identifier | No "last updated" source exists; dates are PHI-only and can't drive the order (2026-10-02) |
| Kaplan-Meier is done with YAC (HIDIVE); D.A.V.I.D on LibreChat is another track | Owned by other teams; we provide data and the entry points (2026-10-02) |
| Tumor board comes from its own view (not ready), not derived from events; radiation doses stay raw as in the views | Data owners decide the content; no unit conversion in the API (2026-10-02) |

## Risks and dependencies

The biggest risk is data outside our control: the other team's views and the real identifiers.

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Other team's views arrive late or differ from what the prototype shows | Laboratory, Clinical Trials, predispositions and part of Overview stay empty | Get their draft schema now, fake exactly that shape in the seed, keep empty states |
| `research_id` missing in real data | Non-PHI users get a NULL `patient_id`: rows can't be told apart, pages can't open | Make it a hard requirement for the other team |
| MRN format or org codes differ between PCX and the portal | `radiant_patient_id` stays NULL: no Genomics tab, no lab path | The real views strip leading zeros on both sides; in PRD only 6 to 27 patients per view resolve, so Genomics will be sparse there |
| View SQL duplicated between the generator and the real scripts | The two drift; QA stops reflecting PRD | The RADIANT-Timeline-Abstraction scripts are the reference; on 2026-10-01 the generator's views were identical to them (12 of 12). Recheck after each change |
| The lab path is live but inert in PRD: no cbtn cases yet | Once cbtn cases are loaded, lab grants start revealing PHI with no change to the views, across enrolling institutions (same as the portal rule) | Expected behaviour; tell the cbtn admins before loading cases, and test with the lab demo user in QA |
| Portal seed data changes | PCX patients stop matching portal patients | The generator reads the seed file directly; rerun it after any change |
| Patient key table not filled after a source load | New patients have no key: missing from the list, no page | An insert of the missing keys after every load, run serially; keys are never deleted or regenerated, so bookmarks stay valid |
| Lookup SQL not yet tested on StarRocks | `uuid()` repeated across rows, an MRN too long for the 128-byte primary key, or a rerun that changes keys | Test on local StarRocks before the QA seed: distinct keys, rerun is a no-op, longest PRD MRN fits |
| D.A.V.I.D on LibreChat: integration not defined | SSO with Keycloak, hosting, and above all what patient context reaches the model: it must respect `can_read_phi` like every view | Separate track; feed it only what the API returned to that user; decide the integration early |
| Tumor board report location and format unknown | The download stays inert; a presigned URL on a PHI report must check access first | Serve it only through an access-checked endpoint, like the document downloads |
| BRIM evidence link format unknown | The evidence link can't be built | Optional field; hide the link when it is null |

Dependencies: the other team (schema, `research_id`) and whoever provisions the 4 demo users in QA.

## Realisation plan

The work totals 14 to 18 dev days; once the API contract is frozen, backend and frontend run in parallel and the elapsed time drops to about 9 to 12 days.

Jira tickets, timeline and milestones: [Realisation](03-realisation.md).

## Open questions

| Question | Who answers |
| --- | --- |
| Draft schema of the missing data (predispositions, laterality, M-stage, symptoms, source of diagnosis, trials, CSF, performance) | Other team |
| Is `research_id` always filled in the real data? | Other team |
| Source `describe` of `cbc_latest_results`, to seed it | Other team |
| The RADIANT-Timeline-Abstraction scripts don't have `is_initial_treatment` yet, but the live view does: which is current? | Dev team |
| Reverse link from the case page: in or out? | Product owner |
| When will the tumor board view be ready, and with which columns? | Product owner |
| Who creates the 4 demo users in QA? | Dev team |
| Who runs the patient-key insert after each source load (QA seed, PRD), and does `v_pcx_30_patient_key` live in RADIANT-Timeline-Abstraction with the other views? | Dev team / other team |
| Where are tumor board reports stored (S3 bucket, which view holds the URL), and are they PHI? | Other team |
| What does the BRIM evidence link look like, and does it need its own login? | Other team |
| How does D.A.V.I.D integrate with LibreChat (embed, API, SSO), and which patient data may it receive? | Product owner / dev team |
| YAC (Kaplan-Meier): standalone view or embedded component, and which survival data does it need from our API? | HIDIVE / dev team |
| Age chart: age today or age at initial diagnosis? | Product owner |
