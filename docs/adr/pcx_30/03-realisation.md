# Realisation

## Jira tickets

About 15 to 19 dev days remain across 20 new stories, plus D.A.V.I.D (L1, not estimated); the app scaffold is done and the sidebar is in review. Ids D, B, F and X are working labels until the SJRA tickets are created; Phase refers to the timeline below.

| Ticket | Phase | Story | Estimate | Depends on | Status |
| --- | --- | --- | --- | --- | --- |
| SJRA-1956 | 4 | Patient app scaffold, routes, beta flag "Patient View" | done | | Done |
| SJRA-1977 | 5 | Shared entity sidebar: key dates, external records (PR #1677) | done | | In review |
| SJRA-1997 (D1) | 1 | Fake PCX data generator and `cbtn` seed | done | | Done |
| SJRA-1997 (D2) | 1 | Secured list view `v_pcx_30_patient_list`, built on the secured views (`backend/scripts/seed/views`) | done | D1 | Done |
| D3 | 1 | Rebuild the 8 real CBTN views: `radiant_patient_id`, lab path in `can_read_phi` | 0.5 d | | Done |
| SJRA-1997 (D4) | 1 | Run the seed in QA, provision the demo users, check the PHI matrix | done | D1, D2 | Done |
| SJRA-1998 (B1) | 2 | API types, swagger annotations, generated TS client (contract) | done | | Done |
| SJRA-2000 (B2) | 3 | Patient key lookup table (`pcx_30_patient_key`, `uuid4()` keys for patients without one) and secured view `v_pcx_30_patient_key`; `patient_key` in the list view | 0.5 d | B1 | In progress |
| SJRA-2001 (B3) | 3 | `POST /patients/search`, `GET /patients/autocomplete` and `GET /patients/filters` | 1.25 d | B1, D2 | In progress (search done) |
| B4 | 3 | `GET /patients/statistics` | 0.5 d | B3 | Not started |
| B5 | 3 | `GET /patients/{patient_key}` with portal cases | 1 to 1.5 d | B2 | Not started |
| B6 | 3 | Routing guard tests, integration tests, Postman | 0.5 d | B3, B4, B5 | Not started |
| F1 | 4 | Contract alignment: single identifier, `patient_key` route, "Restricted", codes | 0.5 d | B1 | Not started |
| F2 | 4 | List on the generated client: table, search, filters | 1 to 1.5 d | F1 | Not started |
| F3 | 4 | Cohort analytics and the button opening YAC's Kaplan-Meier (HIDIVE) | 1 to 1.5 d | F2 | Not started |
| F4 | 5 | Overview tab and timeline component with its Storybook story | 2 d | F1 | Not started |
| F5 | 5 | Treatments, Imaging and Genomics tabs | 1.5 d | F1 | Not started |
| F6 | 5 | Tumor Board (empty state until its view exists), Laboratory CBC, empty states for missing data | 1 d | F1 | Not started |
| X1 | 6 | i18n en/fr, polish, demo script, dry run with the product owner | 1 to 2 d | D4, B6, F3, F6 | Not started |
| SJRA-1999 (B7) | 3 | Backend feature flag `PATIENT_VIEW_ENABLED` registering the /patients routes | done | B1 | Done |
| F7 | 4 | Frontend toggle: nav entry and routes hidden unless the beta feature is on and the backend answers | 0.25 d | B7 | Not started |
| B8 | 3 | Tumor board report download: presigned S3 URL behind the entity check (unclear: where the report lives) | 0.5 to 1 d | B5, other team | Not started |
| F8 | 5 | Evidence link to BRIM on the initial diagnosis (unclear: link format) | 0.25 d | B5, other team | Not started |
| L1 | separate track | D.A.V.I.D assistant on LibreChat: integration, Keycloak SSO, patient context limited to what the API returns (unclear, at risk) | not estimated | B5 | Not started |

## Timeline

With one backend and one frontend developer, the elapsed time is about 9 to 12 days; the critical path is B1, the frontend stories F1 to F6, then X1.

```
Phase   Lane       Work                                   Estimate
1       Data       D2–D4 · view, users                    2–2.5 days
2       Backend    B1 · API contract, TS client           ½–1 day
        ── Gate: API contract frozen (B1) ──
3       Backend    B2–B6 · key table, routes, tests       3.5–4 days
4       Frontend   F1–F3 · patient list, KM               2.5–3.5 days
5       Frontend   F4–F6 · patient page, 8 tabs, timeline 4.5 days
6       Finish     X1 · script, dry run                   1–2 days
(dashed) Other team's views: labs, trials, predispositions — date unknown
```

The frontend works on the generated client before the endpoints exist; the QA data only has to be ready before phase 6. The other team's work only fills the tabs left empty.

Milestones:

1. API contract frozen (B1): swagger merged, TS client generated.
2. Data in QA (D4): seed run on `radiant`, the 4 demo users each see the expected identifiers.
3. End to end (B6, F3, F6): list and patient page on the real endpoints in QA.
4. Demo dry run with the product owner (X1).
