#!/usr/bin/env python3
"""
Regenerate docs/pcx_30_deid_schema.yml -- the schema reference for the seven
pcx_30_*_deid release tables.

WHY THIS SCRIPT EXISTS. The schema reference is GENERATED rather than hand-written,
so that data types, nullability and column order always match what is actually
deployed, and field descriptions always match the authored dictionary. Hand-writing
it would create a third place for the same facts to drift.

SOURCES
  information_schema.columns            data types, nullability, ordinal position
  radiant_data_dev.pcx_30_data_dictionary   field + table descriptions
                                        (edit the dbt seed pcx_30_data_dictionary_src
                                         to change a description, then re-run this)
  live COUNT queries                    row / populated / distinct counts

WHAT IS AUTHORED HERE, NOT DERIVED
  GRAIN    -- stated per table, because it is not inferable from column names
  CAVEATS  -- the measured gotchas carried forward from the dbt model headers. A
              consumer reading only names and types would get several of these
              wrong, so they are part of the contract.
  Keep both in step with the model headers when the models change.

USAGE
  python3 docs/generate_pcx_30_deid_schema.py            # writes the yml in place
  python3 docs/generate_pcx_30_deid_schema.py --stdout    # print instead

CREDENTIALS are read from ~/.dbt/profiles.yml (profile `starrocks_radiant`, target
`dev`) -- the same place dbt reads them. Nothing is hardcoded here, so this file is
safe to commit. Override the profile/target with --profile / --target.
"""
from __future__ import annotations

import argparse
import collections
import json
import pathlib
import re
import sys
from datetime import date

import yaml

# Columns never emitted as `permitted_values`, regardless of cardinality: free text,
# identifiers, and multi-value list fields where a low distinct count would be
# misleading.
FREE_TEXT = re.compile(r"(research_id|_text$|^description$|_other$|protocol_name|agents|locations?$|_id$)")

MAX_ENUM_CARDINALITY = 12

GRAIN = {
    "pcx_30_demographics_deid": "one row per patient",
    "pcx_30_event_level_deid": "one row per (patient, disease event)",
    "pcx_30_medical_therapy_level_deid": "one row per (patient, chemotherapy regimen)",
    "pcx_30_patient_level_deid": "one row per patient",
    "pcx_30_radiation_level_deid": "one row per (patient, radiation course)",
    "pcx_30_surgery_level_deid": "one row per (patient, surgical procedure)",
    "pcx_30_treatment_summary_deid": "one row per patient",
}

TESTS = {
    "pcx_30_demographics_deid": ["research_id: not_null"],
    "pcx_30_event_level_deid": ["research_id: not_null"],
    "pcx_30_medical_therapy_level_deid": ["research_id: not_null"],
    "pcx_30_patient_level_deid": ["research_id: not_null, unique", "vital_status: not_null"],
    "pcx_30_radiation_level_deid": ["research_id: not_null"],
    "pcx_30_surgery_level_deid": ["research_id: not_null"],
    "pcx_30_treatment_summary_deid": ["research_id: not_null, unique"],
}

CAVEATS = {
    "pcx_30_demographics_deid": [
        "given_name and family_name are SYNTHETIC placeholders derived from research_id; they contain no real name information.",
        "birth_year replaces the full date of birth. Month and day are removed.",
        "address_postal_code is truncated to the first 3 digits plus 'XX', and fully suppressed to 'XXXXX' for the 17 HIPAA low-population ZIP3 prefixes and for empty values.",
        "data_type_cohort is derived from whether the patient resolved in the FHIR identifier list, NOT from the RADIANT MRN list used elsewhere in the slate. The two are probably equivalent but are not provably so.",
    ],
    "pcx_30_event_level_deid": [
        "age_at_event_days uses -1 as an UNKNOWN-DATE SENTINEL, not a real age. Filter it out before any time-based analysis.",
        "cns_integrated_diagnosis may have been upgraded from the CBTN value to a more specific OpenPedCan molecular subtype; cns_integrated_diagnosis_source records which source won ('CBTN' or 'OpenPedCan').",
        "A subtype upgrade is EVENT-SCOPED and never broadcast across a patient's other events, EXCEPT that a partially-matched Initial CNS Tumor group is lifted whole. Test diagnosis attribution at the per-ROW grain, not per (patient, event_type).",
        "KNOWN NON-DETERMINISM: metastasis_location and tumor_location_other are assembled with group_concat and a non-total ORDER BY, so the order of the ';'-separated elements can differ between rebuilds. Compare as a SET, not as a string.",
    ],
    "pcx_30_medical_therapy_level_deid": [
        "age_at_regimen_start_days / age_at_regimen_stop_days are VARCHAR and carry the sentinel strings 'Not Available', 'Not Applicable' and 'Not Reported'. cast(... as int) yields NULL for those. Test cast(age_at_regimen_start_days as int) is null -- NOT `is null`, which matches nothing.",
        "protocol_name and protocol_arm are derived by splitting protocol_name_and_arm on its FIRST colon. protocol_arm keeps any further colons; it is 'Not Applicable' when there is no colon, which covers BOTH a protocol with no arm AND a protocol that is itself unrecorded.",
    ],
    "pcx_30_patient_level_deid": [
        "age_at_vital_status_days IS NULL means 'most recent status, date unknown' -- not 'no status'. The source -1 unknown sentinel is mapped to NULL here, so -1 never appears.",
        "vital_status is 'deceased' when any source reports death (deceased outranks alive regardless of recency); otherwise it is the raw lowercased clinical status from the source, so new source vocabulary flows through rather than being bucketed.",
    ],
    "pcx_30_radiation_level_deid": [
        "age_at_radiation_start_days / age_at_radiation_stop_days are VARCHAR and carry 'Not Available' / 'Not Reported'. Catch with cast(... as int) is null. Unlike surgery there are no negative values here.",
        "Doses are NOT unit-normalized -- read total_radiation_dose_unit alongside the value.",
    ],
    "pcx_30_surgery_level_deid": [
        "age_at_surgery_days carries BOTH unknown conventions: string sentinels (which cast to NULL) AND the value -1 / other negatives (which cast cleanly and compare as real numbers). Detecting unknowns needs TWO tests: cast(... as int) is null AND cast(... as int) < 0.",
    ],
    "pcx_30_treatment_summary_deid": [
        "TWO AGE SCALES, both published. age_at_first_*_ever_days is the first course EVER; age_at_initial_*_days is the first course that is INITIAL (frontline) treatment. They differ, and the had_initial_* flags and initial_treatment_order are computed from the latter.",
        "age_at_initial_dx_days and age_at_first_event_days pass the -1 UNKNOWN-DATE SENTINEL through deliberately, unlike the per-row treatment tables which guard against it.",
        "age_at_first_event_days has no '_ever_' infix because it is a DISEASE EVENT, not a treatment.",
    ],
}

CONVENTIONS = collections.OrderedDict(
    [
        ("patient_key", "research_id -- the de-identified patient identifier. Join key across all seven tables."),
        (
            "age_at_x_days",
            "Whole days from date of birth to the event. Replaces calendar dates throughout; no table in this release carries a real date.",
        ),
        (
            "de_identification",
            "No MRN, no name, no calendar date, no full postal code. Dates are expressed as ages in days; names are synthetic; postal codes are ZIP3-masked. research_id is a CODED identifier -- a re-identification key exists outside this release, so treat these tables as a limited data set rather than fully de-identified data.",
        ),
        (
            "multi_value_fields",
            "Several fields hold ';'-separated lists (metastasis_location, tumor_locations, tumor_location_other). Element ORDER is not guaranteed -- compare as sets.",
        ),
    ]
)

HEADER = """\
# PCX-30 de-identified release tables -- schema reference
#
# GENERATED FILE. Do not hand-edit. Regenerate with:
#     python3 docs/generate_pcx_30_deid_schema.py
#
# It is produced from the live StarRocks schema plus
# radiant_data_dev.pcx_30_data_dictionary, so types and descriptions match what is
# actually deployed. To change a DESCRIPTION, edit the dbt seed
# seeds/pcx_30_data_dictionary_src.csv and regenerate. To change a TYPE or a column,
# change the dbt model. To change a GRAIN or CAVEAT, edit the generator -- those two
# are authored, not derived.
#
# Counts (row_count, populated, distinct_values) are a point-in-time snapshot as of
# the `generated` date. The underlying models are rebuilt from live sources, so treat
# them as indicative rather than guaranteed.
#
# `permitted_values` is emitted only for columns with {maxenum} or fewer distinct values
# and is the OBSERVED value set on the generated date -- it is not a declared
# constraint, and a new source value can appear without warning. Where a dbt
# accepted_values test enforces a set, that is noted under the table's dbt_tests.
#
# READ THE PER-TABLE `caveats` BEFORE ANALYSING. Several columns conflate "absent"
# with "unknown", and two different unknown-value conventions are in use.

"""


def connect(profile: str, target: str):
    """Connection params from ~/.dbt/profiles.yml -- never hardcoded."""
    import mysql.connector

    path = pathlib.Path.home() / ".dbt" / "profiles.yml"
    if not path.exists():
        sys.exit(f"could not find {path}")
    cfg = yaml.safe_load(path.read_text())
    try:
        out = cfg[profile]["outputs"][target]
    except KeyError:
        sys.exit(f"profile '{profile}' target '{target}' not found in {path}")
    return mysql.connector.connect(
        host=out["host"],
        port=int(out.get("port", 9030)),
        user=out.get("username") or out.get("user"),
        password=out["password"],
        database=out["schema"],
        buffered=True,
    )


def collect(cur, schema: str):
    cur.execute("set group_concat_max_len = 1048576")
    cur.execute(f"select distinct table_name from {schema}.pcx_30_data_dictionary order by 1")
    tables = [r[0] for r in cur.fetchall()]
    if not tables:
        sys.exit("pcx_30_data_dictionary returned no tables -- has the seed been loaded?")

    data = {}
    for t in tables:
        cur.execute(f"select count(*) from {schema}.{t}")
        rows = cur.fetchone()[0]
        cur.execute(f"select count(distinct research_id) from {schema}.{t}")
        patients = cur.fetchone()[0]
        cur.execute(
            f"select description from {schema}.pcx_30_data_dictionary "
            f"where table_name='{t}' and field_name is null"
        )
        row = cur.fetchone()
        tdesc = row[0] if row else ""
        cur.execute(
            f"""select c.ordinal_position, c.column_name, c.column_type, c.is_nullable, d.description
                from information_schema.columns c
                left join {schema}.pcx_30_data_dictionary d
                  on d.table_name='{t}' and d.field_name = c.column_name
                where c.table_schema='{schema}' and c.table_name='{t}'
                order by c.ordinal_position"""
        )
        cols = []
        for pos, name, ctype, nullable, desc in cur.fetchall():
            cur.execute(f"select count(`{name}`), count(distinct `{name}`) from {schema}.{t}")
            populated, distinct = cur.fetchone()
            values = None
            if distinct and distinct <= MAX_ENUM_CARDINALITY and not FREE_TEXT.search(name):
                cur.execute(
                    f"select distinct `{name}` from {schema}.{t} where `{name}` is not null order by 1"
                )
                values = [str(r[0]) for r in cur.fetchall()]
            cols.append(
                dict(pos=pos, name=name, type=ctype, nullable=(nullable == "YES"),
                     desc=desc or "", populated=populated, distinct=distinct, values=values)
            )
        missing = [c["name"] for c in cols if not c["desc"]]
        if missing:
            print(f"  WARNING {t}: no dictionary description for {missing}", file=sys.stderr)
        data[t] = dict(rows=rows, patients=patients, tdesc=tdesc, cols=cols)
    return data


def build(data, schema: str):
    out = collections.OrderedDict()
    out["version"] = 1
    out["title"] = "PCX-30 de-identified release tables -- schema reference"
    out["generated"] = str(date.today())
    out["generated_by"] = "docs/generate_pcx_30_deid_schema.py"
    out["generated_from"] = [
        f"{schema}.information_schema.columns (data types, nullability, ordinal position)",
        f"{schema}.pcx_30_data_dictionary (field and table descriptions; dbt seed pcx_30_data_dictionary_src)",
        "live row / populated / distinct counts as of the generated date",
    ]
    out["schema"] = schema
    out["dbt_project"] = "starrocks_radiant"
    out["scope"] = (
        "The seven pcx_30_*_deid release tables. The cbtn_clinical tables "
        "(cbc_latest_results, csf_results_latest_by_component, csf_tumor_analysis_latest, "
        "lansky_karnofsky_latest) are NOT included -- they are not part of the _deid release "
        "and are keyed on patient_fhir_id rather than research_id."
    )
    out["conventions"] = CONVENTIONS

    tbls = []
    for t in sorted(data):
        m = data[t]
        e = collections.OrderedDict()
        e["name"] = t
        e["dbt_model"] = t
        e["description"] = m["tdesc"]
        e["grain"] = GRAIN.get(t, "UNDOCUMENTED -- add to GRAIN in the generator")
        e["row_count"] = m["rows"]
        e["distinct_patients"] = m["patients"]
        e["dbt_tests"] = TESTS.get(t, [])
        e["caveats"] = CAVEATS.get(t, [])
        cols = []
        for c in m["cols"]:
            cd = collections.OrderedDict()
            cd["name"] = c["name"]
            cd["position"] = c["pos"]
            cd["data_type"] = c["type"]
            cd["nullable"] = c["nullable"]
            cd["populated"] = f"{c['populated']} of {m['rows']}"
            cd["distinct_values"] = c["distinct"]
            cd["description"] = c["desc"]
            if c["values"]:
                cd["permitted_values"] = c["values"]
            cols.append(cd)
        e["columns"] = cols
        tbls.append(e)
    out["tables"] = tbls
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--profile", default="starrocks_radiant")
    ap.add_argument("--target", default="dev")
    ap.add_argument("--schema", default="radiant_data_dev")
    ap.add_argument("--stdout", action="store_true", help="print instead of writing the file")
    args = ap.parse_args()

    cn = connect(args.profile, args.target)
    try:
        data = collect(cn.cursor(), args.schema)
    finally:
        cn.close()

    doc = build(data, args.schema)
    body = yaml.safe_dump(
        json.loads(json.dumps(doc)), sort_keys=False, width=94,
        allow_unicode=True, default_flow_style=False,
    )
    text = HEADER.replace("{maxenum}", str(MAX_ENUM_CARDINALITY)) + body

    if args.stdout:
        print(text)
        return
    dest = pathlib.Path(__file__).resolve().parent / "pcx_30_deid_schema.yml"
    dest.write_text(text)
    ncols = sum(len(t["columns"]) for t in doc["tables"])
    print(f"wrote {dest}")
    print(f"  {len(doc['tables'])} tables, {ncols} columns, {len(text.splitlines())} lines")


if __name__ == "__main__":
    main()
