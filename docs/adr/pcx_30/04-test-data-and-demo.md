# Test data and demo

## QA seed

QA gets fake PCX data on tenant `radiant`, consistent with the patients of `insert_clinical_data.sql`; it never touches `radiant_data_dev`, which exists only in PRD.

1. Regenerate if the portal seed changed: `python3 backend/scripts/pcx-30/generate_fake_pcx_30.py` writes `seed_fake_pcx_30_radiant.sql`.
2. Run that file as root on QA StarRocks. It drops and recreates the source tables in `pcx_30_source`, then creates the secured `v_pcx_30_*` views in `radiant_tenant` (`CREATE OR REPLACE`).
3. Check that `pcx_30_source` is not covered by any user-facing Ranger policy; the views are covered by the tenant's `view: *` policy.

| Content | Count |
| --- | --- |
| PCX patients | 105 |
| Portal patients among them (same MRN, organization, birth date, sex, names) | 66 |
| Patients with a clinical record (postnatal probands and non-portal patients) | 60, of which 38 ATRT |
| Non-portal patients (CHOP, UCSF) | 39, of which 18 deceased |
| Showcase patients with stable research IDs and the data dictionary's edge cases | 15 |
| MRI sessions | about 1,100 |

- **Long timelines:** PCX30-0004 (portal, 5 events, alive) and PCX30-0015 (non-portal, 4 events, deceased).
- **Edge cases:** surgery on the `-1` unknown day, a regimen with `Not Reported` ages, a vital status with no date, a missing and a restricted ZIP code, second malignancies.
- **Built-in checks:** every portal patient present, no duplicate MRN, nothing after death or last contact, no date after today.
- **Other tenants:** `--tenant <code> --portal-dir <dir>` reads CSV exports of that tenant instead (queries in the script header).

## Demo users

Four QA users cover every branch of the PHI rule; each is created with `cmd/create-user` (Keycloak, Postgres grants, Ranger role, StarRocks user) and is a member of tenant `radiant`.

| User | Grant | Expected in the views | Check on |
| --- | --- | --- | --- |
| PHI at CHUSJ | `can_read_pii` at CHUSJ | MRNs and dates for CHUSJ patients, research IDs and ages for CHOP and UCSF | PCX30-0001 shows `MRN-283782`; PCX30-0010 stays a research ID |
| PHI at CHOP | `can_read_pii` at CHOP | The mirror image: MRNs at CHOP only | PCX30-0010 shows `10483921`; PCX30-0001 stays a research ID |
| No PHI | Tenant member with `can_search_case` only | Research IDs, "Restricted" names, ages, no calendar dates, everywhere | Every row has `patient_id_type = research_id` |
| Lab user | `can_read_pii` at CQGC, the diagnosis lab of every seeded case | MRNs for the probands and relatives of CQGC cases, through the lab path; research IDs for non-portal patients | PCX30-0001 shows its MRN; PCX30-0010 stays a research ID |

A failed check means either a grant is missing or `can_read_phi` drifted from the portal rule; compare with the case page, where the same user must see the same identity.

## Demo script

About 15 minutes, logged in as the PHI-at-CHUSJ user, with the no-PHI user in a second browser for the comparison. Enable the "Patient View" beta feature first.

1. **Cohort.** Open Patients: 105 patients, mostly ATRT. Show the analytics card, then filter Diagnosis = ATRT and Vital status = Deceased.
2. **Survival.** Open the Kaplan-Meier modal, stratify by site.
3. **Identity.** Point out that CHUSJ rows show an MRN and a name, CHOP and UCSF rows a research ID and "Restricted".
4. **Long story.** Open PCX30-0004: Overview, then Timeline with its 5 events (initial tumor, two recurrences, two progressions) and their treatments.
5. **Treatments and imaging.** Treatments tab for doses and agents, Imaging tab for the Flywheel sessions.
6. **Clinical meets genomic.** Genomics tab on a portal patient: its real portal cases, then follow the link to the case page.
7. **De-identified view.** In the second browser, the same list as the no-PHI user: research IDs only, ages instead of dates; the PCX30-0004 link from the first browser opens the same patient, de-identified.
8. **Outcome.** Open PCX30-0015: a 4-event timeline ending in death.

Tabs without data yet (Laboratory beyond CBC, Clinical Trials, predispositions) show their "data coming" state; say so rather than skipping them.
