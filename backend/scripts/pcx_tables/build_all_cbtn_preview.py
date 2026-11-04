#!/usr/bin/env python3
"""
Build the PREVIEW expanded-cohort copy of the pcx_30 _deid release tables.

NOT PART OF THE PRODUCTION BUILD. This exists to let the cohort expansion of
COHORT_EXPANSION_PLAN.md be measured and externally evaluated WITHOUT touching the
published 970-patient release. Read that plan first -- section 6 is what this script
produced, section 7 lists the tables and the drop statements, and section 9 is the
evaluation hand-off.

If the expansion is approved, the production path is a plain
`dbt build --vars '{pcx_30_cohort_scope: all_diagnosed}'` against the real models.
DO NOT promote these tables; rebuild from dbt. If it is rejected, drop the 11
tables (plan section 7) and this script goes with them.

Prerequisite: the compiled artifacts must already exist, from
    dbt compile --select +tag:deid --vars '{pcx_30_cohort_scope: all_diagnosed}'

Usage (needs the dbt venv interpreter -- pymysql is absent from system python3):
    starrocks-dbt/.starrocks-dbt/bin/python3 build_all_cbtn_preview.py --dry-run
    starrocks-dbt/.starrocks-dbt/bin/python3 build_all_cbtn_preview.py

Source of SQL: dbt's own compiled artifacts, so NO model logic is hand-transcribed.
The only transformation applied is a mechanical rename of the cohort-dependent
relations to a _all_cbtn suffix, on the exact backticked identifier, so a live table
can never be read or written by mistake. `guard()` aborts the whole run if any
unrewritten live reference survives.

Cohort-INDEPENDENT relations are deliberately NOT copied and are read live:
    radiant_patient_mrn_list, int_pcx_30_fhir_patient_attributes,
    int_pcx_30_openpedcan_subtype, and every dwh_source table.

Writes 4 scaffolding intermediates + 7 release tables. Drops nothing else.
"""
import os
import re
import sys

import pymysql

# Relative to this file, so the script travels with the repo rather than depending
# on one machine's home directory.
DBT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       "starrocks-dbt/starrocks_radiant")
COMPILED = os.path.join(DBT_DIR, "target/compiled/starrocks_radiant/models/pcx_30")
SCHEMA = "radiant_data_dev"
SUFFIX = "_all_cbtn"

# Cohort-dependent relations: every one of these gets a _all_cbtn copy, and every
# reference to one is rewritten to point at the copy.
COHORT_DEPENDENT = [
    "int_pcx_30_diagnosis_cohort",
    "int_pcx_30_cohort_roster",
    "int_pcx_30_initial_events",
    "int_pcx_30_vital_status_events",
    "pcx_30_event_level_deid",
    "pcx_30_demographics_deid",
    "pcx_30_surgery_level_deid",
    "pcx_30_radiation_level_deid",
    "pcx_30_medical_therapy_level_deid",
    "pcx_30_patient_level_deid",
    "pcx_30_treatment_summary_deid",
]

# Dependency order. Note int_pcx_30_initial_events depends on pcx_30_event_level_deid,
# so an intermediate lands BETWEEN two release tables -- not a mistake.
BUILD_ORDER = [
    "int_pcx_30_diagnosis_cohort",
    "int_pcx_30_cohort_roster",
    "pcx_30_event_level_deid",
    "int_pcx_30_initial_events",
    "int_pcx_30_vital_status_events",
    "pcx_30_demographics_deid",
    "pcx_30_surgery_level_deid",
    "pcx_30_radiation_level_deid",
    "pcx_30_medical_therapy_level_deid",
    "pcx_30_patient_level_deid",
    "pcx_30_treatment_summary_deid",
]


def rewrite(sql: str) -> str:
    """Point every cohort-dependent reference at its _all_cbtn copy."""
    for name in COHORT_DEPENDENT:
        # Exact backticked identifier only. `x` never matches `x_all_cbtn`
        # because of the closing backtick, so this is idempotent.
        sql = sql.replace(f"`{SCHEMA}`.`{name}`", f"`{SCHEMA}`.`{name}{SUFFIX}`")
    return sql


def guard(sql: str) -> None:
    """Refuse if any cohort-dependent live relation survived the rewrite."""
    for name in COHORT_DEPENDENT:
        if re.search(rf"`{SCHEMA}`\.`{name}`(?!{SUFFIX})", sql):
            raise SystemExit(f"REFUSING: unrewritten live reference to {name}")


def main() -> int:
    dry = "--dry-run" in sys.argv

    env = {}
    with open(os.path.expanduser("~/.radiant/starrocks-prod.env")) as fh:
        for line in fh:
            line = line.strip()
            if line.startswith("export "):
                line = line[len("export "):]
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")

    plan = []
    for name in BUILD_ORDER:
        path = os.path.join(COMPILED, f"{name}.sql")
        if not os.path.exists(path):
            raise SystemExit(f"missing compiled artifact: {path}")
        with open(path) as fh:
            sql = rewrite(fh.read())
        guard(sql)
        plan.append((f"{name}{SUFFIX}", sql))

    print(f"{len(plan)} relations to build into {SCHEMA}:")
    for target, _ in plan:
        print(f"  - {target}")
    if dry:
        print("\n--dry-run: nothing executed.")
        return 0

    conn = pymysql.connect(
        host=("celerdata-private-nlb-hnsIFJjH-47198fe90f6ce7c2"
              ".elb.us-east-1.amazonaws.com"),
        port=80,
        user=env["STARROCKS_PROD_USER"],
        password=env["STARROCKS_PROD_PASSWORD"],
        autocommit=True,
    )
    try:
        with conn.cursor() as cur:
            # Long text assembled by any group_concat must not silently truncate
            # at the 1024-byte default.
            cur.execute("set group_concat_max_len = 1048576")
            for target, sql in plan:
                print(f"\n==> {target}")
                cur.execute(f"drop table if exists `{SCHEMA}`.`{target}`")
                cur.execute(f"create table `{SCHEMA}`.`{target}` as {sql}")
                cur.execute(f"select count(*) from `{SCHEMA}`.`{target}`")
                print(f"    rows: {cur.fetchone()[0]:,}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
