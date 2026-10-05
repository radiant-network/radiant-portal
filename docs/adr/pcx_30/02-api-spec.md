# API spec

## Conventions

Every response is already filtered by the caller's PHI access: the API reads the secured views as the user and never adds or removes identifiers itself.

- **Base path.** `/{tenant}/patients`, under the existing tenant routes (`RequireTenantAccess`, per-user StarRocks pool). Every route requires `can_search_case`.
- **Feature flag.** The routes are registered only when `PATIENT_VIEW_ENABLED` is on (off: 404), like the other `*_ENABLED` flags; the frontend hides the nav entry behind the "Patient View" beta feature.
- **Identifier.** Each patient carries `patient_id` + `patient_id_type` (`mrn` | `research_id`) + `can_read_phi`. The type can differ row by row when a user has PHI access at some organizations only. MRN and research ID are never returned together.
- **Patient key.** `patient_key` is a random UUID per (`organization_code`, MRN), stored in the source table `pcx_30_patient_key` and exposed by the secured view `v_pcx_30_patient_key` (and so by the list view). It is the same for every user, so links can be shared; it carries no identifier and needs no secret. The API resolves it to (`organization_code`, `patient_id_type`, `patient_id`) as the caller, then reads the other views with that triple.
- **Names.** `given_name` / `family_name` hold placeholders (`<research_id>_given_name`) when `can_read_phi` is false; the frontend shows "Restricted" instead.
- **Days and dates.** A `day` is the patient's age in days since birth (`age_at_*_days`); unknown values (`-1`, `Not Reported`, `Not Available`) become `null`. A `date` is ISO `YYYY-MM-DD`, present only when `can_read_phi` is true, `null` otherwise.
- **Codes.** Enumerated values are lowercase snake_case codes translated by the frontend: `gender`, `vital_status`, `event_type`, `patient_id_type`, key-date `source`. Clinical vocabularies (diagnoses, locations, agents, protocols) stay as free text.
- **Lists in text.** Semicolon-separated source values (tumor locations, metastasis locations, chemotherapy agents) are returned as string arrays.
- **Errors.** 403 without `can_search_case`; 404 for an unknown or malformed `patient_key` (no hint that the patient exists); 400 for an invalid search body.

## Endpoints

Five read-only routes (plus a tentative sixth for the tumor board report), all gated by `can_search_case`, sit next to the existing `/patients/batch` ingestion routes.

| Method and path | Request | Response | Operation id |
| --- | --- | --- | --- |
| `POST /{tenant}/patients/search` | `ListBodyWithCriteria` | `PatientsSearchResponse` = `{ list: PatientListItem[], count }` | `searchPatients` |
| `GET /{tenant}/patients/autocomplete?prefix=&limit=` | query prefix (min. 1 character), limit (default 10) | `AutocompleteResult[]` = `[{ type, value }]`, the type shared with the case list | `autocompletePatients` |
| `GET /{tenant}/patients/filters` | none | `PatientFilters` | `patientsFilters` |
| `GET /{tenant}/patients/statistics` | none | `PatientStatistics` | `patientsStatistics` |
| `GET /{tenant}/patients/{patient_key}` | path `patient_key` | `PatientEntity` | `patientEntity` |
| `GET /{tenant}/patients/{patient_key}/tumor-board/{report_id}/download` (tentative) | path `patient_key`, `report_id` | `{ url, expires_at }`: presigned S3 URL, only after the entity check passes | `patientTumorBoardReportDownload` |

**Search body.** The existing `ListBodyWithCriteria`: `search_criteria` (`field`, `value[]`, `operator`, default `in`), `limit`, `page_index`, `sort` (`field`, `order` asc/desc). Default sort: `can_read_phi` desc, then `organization_code` asc, then `patient_id` asc (patients the user can identify first, then by site, then by identifier; stable for pagination). Default limit 10.

| Field | Filter | Sort | Operator |
| --- | --- | --- | --- |
| `vital_status` | yes | yes | `in` |
| `organization_code` | yes | yes | `in` |
| `cns_integrated_diagnosis` | yes | yes | `in` |
| `patient_id` (set by a selected suggestion) | yes | yes | `in` |
| `patient_name` (virtual: `given_name` + `family_name`, set by a selected suggestion) | yes, only on rows where `can_read_phi` is true | no | `in` |
| `can_read_phi` | no | yes (default sort) | none |
| `birth_year`, `gender`, `survival_days` | no | yes | none |

There is no free-text search, as in the case list: the box only suggests, and a selected suggestion becomes an `in` criterion on the field named by its `type`, replacing the previous one. Names are suggested and filtered only on rows where `can_read_phi` is true, so a user cannot find a restricted patient by name.

```json
// POST /radiant/patients/search, after selecting the suggestion { "type": "patient_id", "value": "PCX30-0004" }
{
  "search_criteria": [
    { "field": "vital_status", "value": ["deceased"] },
    { "field": "organization_code", "value": ["CHOP", "UCSF"] },
    { "field": "patient_id", "value": ["PCX30-0004"] }
  ],
  "limit": 10,
  "page_index": 0,
  "sort": [{ "field": "can_read_phi", "order": "desc" }, { "field": "organization_code", "order": "asc" }, { "field": "patient_id", "order": "asc" }]
}
```

**Autocomplete.** Same behaviour as the case list search box (`DataTableFilters` with `filterSearch`, `minSearchLength` 1, 10 results grouped by type): a case-insensitive prefix match on `patient_id` (type `patient_id`) and on the full name (type `patient_name`, only where `can_read_phi` is true), read from `v_pcx_30_patient_list` as the user, ordered by value, capped by `limit`. It returns the shared `AutocompleteResult` so the existing component works unchanged.

**Filters.** Values only (key, label), like the case filters; probably no per-value counts (to confirm at the grooming).

**Statistics.** Computed on the whole cohort the user can see, not on the current filters, as in the prototype.

**Entity.** About 9 queries on the secured views filtered by `organization_code`, `patient_id_type`, `patient_id`, plus the portal cases when `radiant_patient_id` is set. Returns 404 when the demographics row is not found.

## Models

The OpenAPI schema names below are the Go types' `@Name`; the generated TypeScript client will expose them as-is. Shapes in TypeScript notation; `| null` marks a value that can be missing or masked.

```typescript
type PatientIdType = 'mrn' | 'research_id';
type Gender = 'female' | 'male' | 'unknown';
type VitalStatus = 'alive' | 'deceased';
type EventType = 'initial_cns_tumor' | 'progressive' | 'recurrence' | 'second_malignancy' | 'deceased' | 'unavailable';
type KeyDateSource = 'clinical' | 'registry';

interface PatientIdentity {
  patient_key: string;             // UUID from v_pcx_30_patient_key, goes in the URL
  patient_id: string;
  patient_id_type: PatientIdType;
  can_read_phi: boolean;
  radiant_patient_id: number | null; // portal patient.id, null outside the portal
  organization_code: string;
  organization_name: string;
  given_name: string;              // placeholder when !can_read_phi
  family_name: string;             // placeholder when !can_read_phi
}

interface PatientListItem extends PatientIdentity {
  birth_year: number | null;
  gender: Gender;
  cns_integrated_diagnosis: string | null; // from the initial event
  vital_status: VitalStatus;
  age_at_vital_status_days: number | null;
  age_at_initial_dx_days: number | null;
  survival_days: number | null;    // vital status day - initial diagnosis day
  has_imaging: boolean;
  case_count: number;              // portal cases, 0 outside the portal
}

interface PatientFilterValue { key: string; label?: string } // no counts, like the case filters (to confirm)

// Autocomplete reuses the shared AutocompleteResult { type, value } of the case list:
// type = 'patient_id' | 'patient_name' (names only where can_read_phi is true); it becomes a search criterion on that field.
interface PatientFilters {
  vital_status: PatientFilterValue[];
  organization_code: PatientFilterValue[]; // label = organization_name
  cns_integrated_diagnosis: PatientFilterValue[];
}

interface PatientStatistics {
  total: number;
  imaging_count: number;
  with_cases_count: number;
  by_diagnosis: { key: string; count: number }[];
  by_age_bucket: { key: '0-4' | '5-9' | '10-14' | '15-19' | '20+'; count: number }[]; // OPEN: age today (from birth_year) or age at initial diagnosis?
  by_organization: { organization_code: string; organization_name: string; alive: number; deceased: number }[];
  survival: { organization_code: string; cns_integrated_diagnosis: string | null; days: number; event: boolean }[]; // input for YAC's Kaplan-Meier (format to agree with HIDIVE), event = deceased
}

interface KeyDate { day: number | null; date: string | null; source: KeyDateSource }
interface DayDate { day: number | null; date: string | null }

interface PatientEntity extends PatientListItem {
  birth_date: string | null;
  race: string | null;
  ethnicity: string | null;
  postal_code: string;             // full when can_read_phi, 3 digits + XX otherwise
  diagnosis_type_cohort: string | null;
  data_type_cohort: string | null;
  key_dates: { initial_diagnosis: KeyDate; latest_encounter: KeyDate }; // hard-coded sources: clinical, registry
  initial_diagnosis_evidence_url: string | null; // BRIM link, format TBD
  tumor_board_reports: { report_id: string; day: number | null; date: string | null }[]; // TBD: from the tumor board view (not ready yet); its S3 URL is never returned
  vital_status_at: DayDate;
  events: PatientEvent[];
  surgeries: PatientSurgery[];
  radiations: PatientRadiation[];
  therapies: PatientTherapy[];
  imaging: PatientImagingSession[];
  treatment_summary: PatientTreatmentSummary | null;
  cases: PatientCase[];
}

interface PatientEvent extends DayDate {
  event_type: EventType;
  cns_diagnosis_category: string | null;
  cns_integrated_diagnosis: string | null;
  tumor_locations: string[];
  tumor_location_other: string | null;
  metastasis: string | null;       // Yes / No / Not Applicable, as in the source
  metastasis_locations: string[];
  metastasis_location_other: string | null;
}

interface PatientSurgery extends DayDate { extent_of_tumor_resection: string | null }

interface Dose { value: string | null; unit: string | null } // raw from the view (Gy, cGy or CGE), no normalization
interface PatientRadiation {
  start: DayDate;
  stop: DayDate;
  site: string | null;
  site_other: string | null;
  type: string | null;
  type_other: string | null;
  craniospinal_dose: Dose;         // total_radiation_dose
  focal_dose: Dose;                // total_radiation_dose_focal
}

interface PatientTherapy {
  start: DayDate;
  stop: DayDate;
  protocol_name_and_arm: string | null;
  chemotherapy_type: string | null;
  chemotherapy_agents: string[];
  is_initial_treatment: boolean | null; // source Yes / No; null when Not Reported
}

interface PatientImagingSession extends DayDate {
  session_id: string;
  session_name: string;
  anatomical_site: string | null;
  imaging_modality: string | null;
  flywheel_url: string | null;
}

interface PatientTreatmentSummary {
  initial_dx: DayDate;
  first_event: DayDate;
  first_radiation: DayDate;
  first_methotrexate: DayDate;
  had_initial_radiation: boolean;
  had_initial_methotrexate: boolean;
  initial_treatment_order: string | null;
}

interface PatientCase {
  case_id: number;
  relationship: 'proband' | string; // relationship_to_proband code otherwise
  status_code: string;
  priority_code: string | null;
  case_type_code: string;
  analysis_catalog_code: string | null;
  diagnosis_lab_code: string;
  updated_on: string;
}
```

The Laboratory (CBC), predisposition and clinical-trial models are added once the other team's views are described; until then those tabs have no API data.

## Frontend alignment

The frontend (PR #1677, SJRA-1977) runs on mocks in `frontend/apps/patient/src/api/patient.ts`; these are the changes agreed on 2026-10-01 before it switches to the generated client.

| Topic | Current mock | Change |
| --- | --- | --- |
| Identifier | `patient_id` shown under the name plus a separate MRN column | One ID column from `patient_id` + `patient_id_type` |
| URL | Route and link built from `patient_id`; header title = URL param | Route `/patient/entity/:patientKey` from the row's `patient_key`; title from `patient_id` |
| Names | Always shown | "Restricted" with a lock when `can_read_phi` is false |
| Organization | Fixed `UCSF \| CHOP \| Seattle` site type | `organization_code` + `organization_name` strings |
| Codes | `sex: Female \| Male` | `gender`, `vital_status` lowercase codes; `cns_integrated_diagnosis` |
| Sidebar | Separate `fetchPatientSidebarInfo` call | `key_dates` inside `PatientEntity` |
| Key dates | `{ day, source }` | `{ day, date, source }`; `source` hard-coded `clinical` / `registry` |
| External records (TEFCA) | `{ organization, linked, connected }` | Not in the API: static card for the demo; a status enum if it ever becomes real |
