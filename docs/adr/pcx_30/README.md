# PCX 3.0 Patient View — technical analysis and plan

Patient list and 8-tab patient page in Radiant, fed by the PCX 3.0 clinical views, for a CBTN demo.

Snapshot of the shared plan doc as of 2026-10-05. The live doc may have moved on since: https://claude.ai/code/artifact/181660b4-d95e-40c9-a03c-9120652ad04d

| File | Content |
| --- | --- |
| [01-context-and-plan.md](01-context-and-plan.md) | Context, scope, data model and PHI rules, backend and frontend design, decisions log, risks, open questions |
| [02-api-spec.md](02-api-spec.md) | Endpoints, models, frontend alignment |
| [03-realisation.md](03-realisation.md) | Stories, estimates, timeline, milestones |
| [04-test-data-and-demo.md](04-test-data-and-demo.md) | QA seed, demo users, demo script |

Related files:

- Fake data generator and QA seed: `backend/scripts/pcx-30/`
- Patient list view template: `backend/scripts/pcx-30/views/v_pcx_30_patient_list.sql.tmpl`
- Reference SQL for the secured views: the RADIANT-Timeline-Abstraction repository (`pcx_demo_table_sql_objects/access_controlled_views/`)
