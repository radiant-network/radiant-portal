# Local seed: tenant `cbtn`

The local stack (`make docker-run`) holds one data tenant, `cbtn`, built from the de-identified PCX 3.0 CSVs:

- the PCX clinical data behind the patient view,
- the RADIANT patients of that cohort as portal patients, with cases, sequencing, occurrences and interpretations.

Fake identities are added on top of the CSVs: MRNs, names, birth dates, calendar dates and postal codes. They are derived from hashes of the research ids, so the same CSVs always give the same SQL.

## Pipeline

```
data/deid/pcx_30_*_deid.csv ─────┐
../pcx_tables/ (views, orgs, dict) ├─ build_seed.py ─> out/postgres_seed.sql
sql/starrocks_schema.sql ────────┘                   out/starrocks_seed.sql
views/*.sql.tmpl                                     out/starrocks_views.sql
```

| File | Role |
| --- | --- |
| `fake_deid.py` → `data/deid/` | Stand-ins for the real `pcx_30_*_deid` CSVs, same columns and unknown-value conventions. Replace the folder with the real export when it arrives. |
| `../pcx_tables/` | Maintained by the RADIANT-Timeline-Abstraction team, the source of truth for the PCX data. The seed reads the secured view templates (`access_controlled_views/*.sql.tmpl`), the organization reference (`radiant-prod/organization_ref/organization_ref_table.sql`, plus `pcx.PENDING_ORGS` until upstream adds them) and `view_data_dictionary_access_policy.csv`. |
| `pcx.py` | CSVs + fake identity → the identified `<tenant>_pcx_source.v_pcx_30_*_combined` tables (`radiant_data_dev` in PRD); MRI sessions and labs generated from each patient's timeline. |
| `genomics.py` | Portal patients (`data_type_cohort = 'radiant'`), one somatic tumor-normal case and one germline case each, variants and occurrences driven by the diagnosis, CNVs, Exomiser, interpretations, notes and flags. |
| `build_seed.py` | Assembles the three SQL files. |
| `sql/starrocks_schema.sql` | StarRocks DDL: `{shared}` = `radiant` (`SHARED_DATABASE`), `{tenant}` = `cbtn_tenant` (the `PerTenant` tables). |
| `views/` | Radiant's own views over the secured views (`v_pcx_30_patient_list`). |

```bash
python3 fake_deid.py                                  # regenerate the fake CSVs
python3 build_seed.py                                 # writes out/ (git-ignored)
```

## In compose

The services start in this order:

1. `seed-build` runs `build_seed.py` into the `seed-out` volume.
2. `pg-migrate` applies the migrations, using the same files and tracking table as the API.
3. `pg-seed` loads Postgres and `sr-seed` loads StarRocks.
4. `provision` runs `out/provision.sh` with the toolbox image, the same tools as QA:
   - `create-tenant` creates the default roles, the `cbtn_tenant` views, the Ranger role and the access policies.
   - `refresh-tenants` creates the masking, `auth` and shared-database policies.
   - `create-user -sub` runs for each demo user: StarRocks JWT user, Postgres grants and Ranger role membership. Keycloak is left alone; the users come from the realm import.
5. `api` starts.
6. `sr-views` creates the PCX views.

The API runs with `TENANT_VIEWS_READ_ENABLED`, `PATIENT_VIEW_ENABLED` and `STARROCKS_PROXY_READ_ENABLED` on, as in QA. Reads go through `mysql-proxy` as the logged-in user, so both kinds of masking apply:

- the PHI rule of the PCX views, through `current_user()`;
- the Ranger masks on the portal patient.

`STARROCKS_PROXY_READ_ENABLED=false make docker-run` reads as root instead. Everything then comes out de-identified, and the portal patient is unmasked.

### Checking the masking

```bash
python3 verify_phi.py
```

For each demo user, the script checks:
- in the PCX views (queried as that user through `mysql-proxy`), that `patient_id` is the MRN exactly where the user can read PHI, and that calendar dates are NULL everywhere else;
- through the API, that the portal patient of a CHOP case is masked for users without PHI access there.

It checks rules, not counts, so it keeps passing on the real CSVs. StarRocks needs about 30 seconds after `provision` to pick up the Ranger policies.

## Fake tenants (QA, or another local tenant)

`--env qa` builds the same data for any tenant code, for an environment that already holds data:

- **Ids start after `--id-base`** in every table, so they cannot collide with other tenants' rows.
- **The variants are real loci of the environment** (`--loci`, exported from an existing tenant), so their consequences, ClinVar and gnomAD rows are the environment's own. The fake cohort only decides who carries them. The tenant's `snv__variant` copies their annotation, with frequencies computed from the fake cohort.
- **The shared `radiant` database is left alone:** no DDL, no reference data (genes, MONDO/HPO terms, panels, cytobands), no annotation rows. The seed only writes `staging_sequencing_experiment` rows for its own cases (deleted and reinserted on a re-run).
- **The tenant's roles, grants and organizations are never deleted**, so a re-run keeps the users added by hand.
- **No demo users**, and the PCX source tables go to `<code>_pcx_source`. That database holds fake MRNs, names and dates side by side, like `radiant_data_dev` in PRD, so never grant it to users.

Recipe, for tenant `demo`. Toolbox commands run with the environment's settings (`DB_*`, `PG*`, `RANGER_*`); SQL files load as an admin user.

0. Pick an id base above every existing id, rounded up to the next million. On a re-run, reuse the same base.
   ```sql
   SELECT max(m) FROM (SELECT max(id) m FROM patient UNION ALL SELECT max(id) FROM sample UNION ALL SELECT max(id) FROM sequencing_experiment
     UNION ALL SELECT max(id) FROM cases UNION ALL SELECT max(id) FROM task UNION ALL SELECT max(id) FROM family
     UNION ALL SELECT max(id) FROM document UNION ALL SELECT max(id) FROM obs_categorical) x;
   ```
1. Export real loci from a tenant that already has variants: run `sql/qa_loci_export.sql` in that tenant's database (`USE <existing>_tenant;`) and copy the result table into `qa_loci.txt` (about 650 lines; the prompt, borders and footer are skipped). `mysql -B … > qa_loci.tsv` works too. The export keeps the SNVs annotated in part 1, the part the seed's occurrences use.
2. Build the SQL: `python3 build_seed.py --env qa --tenant demo --name "Demo (fake)" --id-base 2000000 --loci qa_loci.txt --like-tenant <existing> --out out/demo`
   `--like-tenant` creates the tenant's tables with `CREATE TABLE … LIKE <existing>_tenant.…`, so they have the pipeline's layout (partitions, colocation, every column) rather than the local schema's.
3. Create the tenant: `create-tenant -code demo -name "Demo (fake)"`
4. Seed Postgres: `psql -v ON_ERROR_STOP=1 -f out/demo/postgres_seed.sql`
5. Seed StarRocks: `mysql … < out/demo/starrocks_seed.sql`
6. Refresh the tenant (gene panel MV, Ranger masking): `refresh-tenants -code demo`
7. Load the PCX views: `mysql … < out/demo/starrocks_views.sql`
8. Grant users with the admin UI or `create-user -sub <keycloak sub> -grant demo::member -grant 'demo:*:geneticist'`.

For QA's `cbtn`, use `--tenant cbtn --name "Children's Brain Tumor Network"`. Before running it, check that the MONDO codes of `genomics.py` exist in QA's `mondo_term`.

## Demo users

The users live in Keycloak realm `radiant` (`scripts/init-keycloak/radiant.json`). The password is the username.

| User | Grants in `cbtn` |
| --- | --- |
| `cbtn-admin` | `member`, `tenant_admin`, `geneticist` and `data_manager` on every organization |
| `cbtn-phi-chop` | `member`, `geneticist` at CHOP |
| `cbtn-phi-sch` | `member`, `geneticist` at SCH |
| `cbtn-lab` | `member`, `geneticist` at DGD, the diagnosis lab of every case |
| `cbtn-nophi` | `member` |

```bash
TOKEN=$(curl -s http://localhost:8080/realms/radiant/protocol/openid-connect/token -d grant_type=password -d client_id=radiant \
  -d client_secret=<radiant client secret, in radiant.json> -d username=cbtn-admin -d password=cbtn-admin | jq -r .access_token)
curl -s -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' localhost:8090/cbtn/cases/search -d '{"limit":5}'
```

## Keeping the joins right

The API drops rows silently when a link is missing. `genomics.py` maintains these invariants:

- Every occurrence `locus_id` has a `cbtn_tenant.snv__variant` row (inner join) and a picked `radiant.snv__consequence` (expanded view).
- Every sequencing has `radiant.staging_sequencing_experiment` rows with the occurrences' `part`. The part is looked up by `seq_id` alone.
- Every annotation task has its `task_context` rows. The somatic annotation needs the tumor and the normal sequencing, with distinct aliquots, to count as tumor-normal.
- Germline classifications are one of the five LOINC answers accepted by `types/classification.go`; any other value makes the expanded view return a 500.
