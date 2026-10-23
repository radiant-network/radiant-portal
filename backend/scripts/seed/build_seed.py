"""Build a fake tenant (cbtn by default) from the de-identified PCX CSVs.

  python3 build_seed.py [--tenant cbtn] [--name "..."] [--env local|qa] [--id-base N] [--deid data/deid] [--out out]

Writes, in load order:
  postgres_seed.sql   tenant cbtn: roles, organizations, demo users, portal patients, cases, tasks, interpretations
  starrocks_seed.sql  shared database `radiant` (annotations, references), `cbtn_tenant` occurrence tables,
                      `cbtn_pcx_source` PCX source tables (`radiant_data_dev` in PRD)
  starrocks_views.sql the secured PCX views and the patient list view; needs the auth.* and cbtn_tenant.* views
                      the API creates at startup (VIEW_REFRESH_ON_STARTUP_ENABLED)
Everything is derived from the CSVs and hashes of the research ids: the same input gives the same SQL, except the\npatient URL keys (uuid4), which are only inserted for patients without one.
"""
import argparse, datetime as dt, json, os, re, sys, uuid

import genomics, pcx

HERE = os.path.dirname(os.path.abspath(__file__))
# The PCX views, organization reference and data dictionary, maintained by the RADIANT-Timeline-Abstraction team.
PCX_DIR = os.path.join(HERE, "..", "pcx_tables")
# The upstream templates hard-code PRD's names; only the tenant code is a placeholder.
TEMPLATE_VIEW_DB, TEMPLATE_SOURCE_DB = "cbtn_tenant", "radiant_data_dev"
SHARED_DB = "radiant"
JDBC_PATIENT_JOIN = "LEFT JOIN radiant_jdbc.public.patient p"

cli = argparse.ArgumentParser()
cli.add_argument("--deid", default=os.path.join(HERE, "data", "deid"), help="directory of the pcx_30_*_deid.csv files")
cli.add_argument("--out", default=os.path.join(HERE, "out"))
cli.add_argument("--env", choices=["local", "qa"], default="local",
                 help="qa: an environment that already holds data (see README): ids after --id-base, the shared database's "
                      "tables and reference data left alone, no demo users, the tenant's roles and grants never deleted")
cli.add_argument("--id-base", type=int, help="first integer id of the tenant's rows (default 0 local, 1000000 qa)")
cli.add_argument("--loci", help="qa only: real loci exported with sql/qa_loci_export.sql. The variants are taken from it, so the "
                                "shared annotation tables (consequences, ClinVar, gnomAD) are read as they are, never written")
cli.add_argument("--like-tenant", help="qa only: an existing tenant whose tables the tenant's are copied from (CREATE TABLE LIKE), "
                                       "so they have the pipeline's layout rather than the local schema's")
cli.add_argument("--tenant", default="cbtn", help="tenant code, [a-z][a-z0-9_]*")
cli.add_argument("--name", help="tenant display name")
cli.add_argument("--source-db", help="StarRocks database of the PCX source tables (default <tenant>_pcx_source; PRD: radiant_data_dev). "
                                     "One per tenant: the secured views read it without a tenant filter")
cli.add_argument("--migrate-from", help="qa only: the deid directory the environment was seeded from. Instead of a full seed, writes "
                                        "migrate_postgres.sql and migrate_starrocks.sql, which bring it to --deid (see README)")
cli.add_argument("--new-id-base", type=int, help="with --migrate-from: first integer id of the rows the migration adds, above every "
                                               "id of the environment")
args = cli.parse_args()
if not re.fullmatch(r"[a-z][a-z0-9_]*", args.tenant):
    sys.exit(f"invalid tenant code {args.tenant!r}: [a-z][a-z0-9_]*")
TENANT, TENANT_DB = args.tenant, f"{args.tenant}_tenant"
TENANT_NAME = args.name or ("Children's Brain Tumor Network" if TENANT == "cbtn" else f"{TENANT.upper()} (fake)")
SOURCE_DB = args.source_db or f"{TENANT}_pcx_source"
QA = args.env == "qa"
ID_BASE = args.id_base if args.id_base is not None else (1_000_000 if QA else 0)
if (args.loci or args.like_tenant) and not QA:
    sys.exit("--loci and --like-tenant need --env qa")
if args.migrate_from and not (QA and args.loci and args.new_id_base):
    sys.exit("--migrate-from needs --env qa, --loci and --new-id-base")
LOCI = genomics.read_loci(args.loci) if args.loci else None

# Demo users: Keycloak ids of scripts/init-keycloak/radiant.json (password = username). One per branch of the PHI rule.
# provision.sh grants them through cmd/create-user; the roles are create-tenant's defaults (postgres.DefaultRoles).
DEMO_USERS = [
    ("6f0c4a1e-0c3b-4d4e-9d1a-2b7f3c1a0001", "cbtn-admin", "Ada", "Admin",
     [(None, "member"), (None, "tenant_admin"), ("*", "geneticist"), ("*", "data_manager")]),
    ("6f0c4a1e-0c3b-4d4e-9d1a-2b7f3c1a0002", "cbtn-phi-chop", "Charlotte", "Philly", [(None, "member"), ("CHOP", "geneticist")]),
    ("6f0c4a1e-0c3b-4d4e-9d1a-2b7f3c1a0003", "cbtn-phi-sch", "Samuel", "Seattle", [(None, "member"), ("SCH", "geneticist")]),
    ("6f0c4a1e-0c3b-4d4e-9d1a-2b7f3c1a0004", "cbtn-lab", "Laura", "Lab", [(None, "member"), ("DGD", "geneticist")]),
    ("6f0c4a1e-0c3b-4d4e-9d1a-2b7f3c1a0005", "cbtn-nophi", "Nina", "Nophi", [(None, "member")]),
]
DIAGNOSIS_LAB = ("DGD", "Division of Genomic Diagnostics, CHOP", "diagnostic_laboratory")
SEQUENCING_CENTER = ("Broad", "Broad Institute", "sequencing_center")


def q(v):
    if v is None:
        return "NULL"
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return repr(v)
    if isinstance(v, dt.datetime):
        return f"'{v.isoformat(sep=' ')}'"
    if isinstance(v, list):
        return "[" + ", ".join(q(x) for x in v) + "]"
    return "'" + str(v).replace("\\", "\\\\").replace("'", "''") + "'"


def pg_q(v):
    if isinstance(v, list):
        raise ValueError("no arrays in Postgres rows")
    return q(v).replace("\\\\", "\\")


def insert(table, cols, rows, quote=q, suffix=""):
    if not rows:
        return f"/* {table}: no rows */"
    out = []
    for i in range(0, len(rows), 500):
        values = ",\n    ".join("(" + ", ".join(quote(v) for v in r) + ")" for r in rows[i:i + 500])
        out.append(f"INSERT INTO {table} ({', '.join(cols)}) VALUES\n    {values}{suffix};")
    return "\n".join(out)


def organization_rows(providers):
    return insert("organization", ["code", "name", "category_code", "tenant_code"],
                  [[c, org_ref[c]["name"], "healthcare_provider", TENANT] for c in providers]
                  + [[*DIAGNOSIS_LAB, TENANT], [*SEQUENCING_CENTER, TENANT]], pg_q,
                  " ON CONFLICT (code, tenant_code) DO UPDATE SET name = EXCLUDED.name, category_code = EXCLUDED.category_code")


def portal_rows(pg):
    """Postgres inserts of what genomics.build made: patients, samples, sequencing, cases, tasks, interpretations."""
    out = [insert("patient", ["id", "submitter_patient_id", "submitter_patient_id_type", "organization_code", "sex_code", "date_of_birth",
                              "life_status_code", "first_name", "last_name", "tenant_code"], [r + [TENANT] for r in pg["patient"]], pg_q),
           insert("fetus", ["id", "submitter_fetus_id", "mother_id", "organization_code", "life_status_code", "sex_code",
                            "last_menstrual_period", "estimated_due_date", "tenant_code"], [r + [TENANT] for r in pg["fetus"]], pg_q),
           insert("sample", ["id", "type_code", "parent_sample_id", "tissue_site", "histology_code", "submitter_sample_id", "patient_id",
                             "organization_code", "fetus_id", "tenant_code"], [r + [TENANT] for r in pg["sample"]], pg_q),
           insert("sequencing_experiment", ["id", "sample_id", "status_code", "aliquot", "sequencing_lab_code", "run_name", "run_alias",
                                            "run_date", "created_on", "updated_on", "experimental_strategy_code",
                                            "sequencing_read_technology_code", "platform_code", "tenant_code"],
                  [r + [TENANT] for r in pg["sequencing_experiment"]], pg_q)]
    case_rows = []
    for cid, pid, catalog, status, lab, condition, created, updated, priority, ctype, category, physician, ordering, submitter in pg["cases"]:
        case_rows.append(f"({cid}, {pid}, (SELECT id FROM project WHERE code = 'CBTN' AND tenant_code = '{TENANT}'), "
                         f"(SELECT id FROM analysis_catalog WHERE code = '{catalog}' AND tenant_code = '{TENANT}'), {pg_q(status)}, {pg_q(lab)}, "
                         f"'{TENANT}', {pg_q(condition)}, 'mondo', {pg_q(created)}, {pg_q(updated)}, {pg_q(priority)}, {pg_q(ctype)}, "
                         f"{pg_q(category)}, {pg_q(physician)}, {pg_q(ordering)}, {pg_q(submitter)})")
    out.append("INSERT INTO cases (id, proband_id, project_id, analysis_catalog_id, status_code, diagnosis_lab_code, tenant_code, "
               "primary_condition, condition_code_system, created_on, updated_on, priority_code, case_type_code, case_category_code, "
               "ordering_physician, ordering_organization_code, submitter_case_id) VALUES\n    " + ",\n    ".join(case_rows) + ";"
               if case_rows else "/* cases: no rows */")
    out += [insert("family", ["id", "case_id", "family_member_id", "relationship_to_proband_code", "affected_status_code", "fetus_id",
                              "tenant_code"],
                   [r + [TENANT] for r in pg["family"]], pg_q),
            insert("case_has_sequencing_experiment", ["sequencing_experiment_id", "case_id"], pg["case_has_sequencing_experiment"], pg_q),
            insert("task", ["id", "task_type_code", "pipeline_name", "pipeline_version", "genome_build", "created_on", "tenant_code"],
                   [r + [TENANT] for r in pg["task"]], pg_q),
            insert("task_context", ["task_id", "sequencing_experiment_id", "case_id"], pg["task_context"], pg_q),
            insert("document", ["id", "name", "data_category_code", "data_type_code", "format_code", "size", "url", "hash", "created_on",
                                "tenant_code"], [r + [TENANT] for r in pg["document"]], pg_q),
            insert("task_has_document", ["task_id", "document_id", "type"], pg["task_has_document"], pg_q),
            insert("obs_categorical", ["id", "case_id", "patient_id", "observation_code", "coding_system", "code_value", "onset_code",
                                       "interpretation_code", "note", "tenant_code"], [r + [TENANT] for r in pg["obs_categorical"]], pg_q),
            insert("interpretation_germline", ["sequencing_id", "case_id", "locus_id", "transcript_id", "condition", "classification",
                                               "classification_criterias", "transmission_modes", "interpretation", "created_by_name",
                                               "created_at", "updated_by_name", "updated_at", "tenant_code"],
                   [r + [r[9], r[10], TENANT] for r in pg["interpretation_germline"]], pg_q),
            insert("interpretation_somatic", ["sequencing_id", "case_id", "locus_id", "transcript_id", "tumoral_type", "oncogenicity",
                                              "oncogenicity_classification_criterias", "clinical_utility", "interpretation", "created_by_name",
                                              "created_at", "updated_by_name", "updated_at", "tenant_code"],
                   [r + [r[9], r[10], TENANT] for r in pg["interpretation_somatic"]], pg_q),
            insert("occurrence_flag", ["case_id", "occurrence_id", "seq_id", "task_id", "flag_type", "tenant_code"],
                   [r + [TENANT] for r in pg["occurrence_flag"]], pg_q)]
    note_user = DEMO_USERS[3]
    out.append(insert("occurrence_note", ["case_id", "seq_id", "task_id", "occurrence_id", "content", "user_id", "user_name", "tenant_code"],
                      [r + [note_user[0], f"{note_user[2]} {note_user[3]}", TENANT] for r in pg["occurrence_note"]], pg_q))
    return out


def sequence_resets():
    return [f"SELECT setval('{seq}', GREATEST((SELECT COALESCE(MAX(id), 1) FROM {table}), 1));"
            for seq, table in [("patient_id_seq", "patient"), ("fetus_id_seq", "fetus"), ("sample_id_seq", "sample"), ("sequencing_experiment_id_seq", "sequencing_experiment"),
                               ("case_id_seq", "cases"), ("family_id_seq", "family"), ("task_id_seq", "task"), ("document_id_seq", "document"),
                               ("observation_coding_id_seq", "obs_categorical"), ("project_id_seq", "project")]]


VAR_COLS = ["locus_id", "chromosome", "start", "end", "reference", "alternate", "locus", "hgvsg", "hgvsc", "hgvsp", "dna_change", "aa_change",
            "variant_class", "symbol", "transcript_id", "mane_select", "is_mane_select", "is_mane_plus", "is_canonical", "consequences",
            "vep_impact", "impact_score", "clinvar_interpretation", "clinvar_name", "rsnumber", "gnomad_v3_af", "omim_inheritance_code",
            "germline_pc_wgs", "germline_pn_wgs", "germline_pf_wgs", "germline_pc_wgs_affected", "germline_pn_wgs_affected",
            "germline_pf_wgs_affected", "germline_pc_wgs_not_affected", "germline_pn_wgs_not_affected", "germline_pf_wgs_not_affected",
            "somatic_pc_tn_wgs", "somatic_pn_tn_wgs", "somatic_pf_tn_wgs", "cmc_mutation_url", "cmc_sample_mutated", "cmc_sample_ratio",
            "cmc_tier"]
omim_symbols = {o[0] for o in genomics.OMIM}
# Annotation columns of snv__variant taken from the export as they are; the rest (frequencies) is the fake cohort's.
REAL_COLS = {"is_mane_select": ("mane", lambda x: x == "1"), "is_canonical": ("canonical", lambda x: x == "1")}


def variant_row(v, pc, pn, sc, sn):
    hgvsg = f"chr{v.chrom}:g.{v.pos}{v.ref}>{v.alt}"
    row = [v.locus_id, v.chrom, v.pos, v.pos, v.ref, v.alt, v.locus, hgvsg, f"{v.transcript}:{v.hgvsc}" if v.hgvsc else None,
           f"{v.transcript}:{v.aa}" if v.aa else None, v.hgvsc, v.aa, "SNV", v.symbol, v.transcript, v.transcript, True, False, True,
           [v.consequence], v.impact, genomics.IMPACT[v.impact], [v.clinvar] if v.clinvar else None,
           f"{v.symbol}({v.hgvsc})" if v.clinvar and v.hgvsc else None, v.rs, v.af, ["AD"] if v.symbol in omim_symbols else None,
           pc, pn, round(pc / pn, 6) if pn else 0.0, pc, pn, round(pc / pn, 6) if pn else 0.0, 0, 0, 0.0,
           sc, sn, round(sc / sn, 6) if sn else 0.0]
    # One variant in three is in the COSMIC Cancer Mutation Census; one of those in four has no mutated sample.
    cosmic = genomics.h("cosmic", v.locus_id) % 12
    if cosmic < 4:
        mutated = 0 if cosmic == 3 else 5 + genomics.h("cosmic_n", v.locus_id) % 300
        row += [f"https://cancer.sanger.ac.uk/cosmic/mutation/overview?id={v.locus_id % 1000000}&genome=37", mutated, mutated / 1000,
                ["1", "2", "3", "Other"][cosmic]]
    else:
        row += [None, None, None, None]
    if v.real:
        for col, (key, conv) in REAL_COLS.items():
            row[VAR_COLS.index(col)] = None if v.real[key] is None else conv(v.real[key])
        row[VAR_COLS.index("mane_select")] = v.transcript if row[VAR_COLS.index("is_mane_select")] else None
        row[VAR_COLS.index("is_mane_plus")] = False
    return row


def occurrence_rows(sr):
    return [
        insert(f"{SHARED_DB}.staging_sequencing_experiment",
               ["case_id", "seq_id", "task_id", "task_type", "part", "analysis_type", "aliquot", "patient_id", "experimental_strategy",
                "histology_type", "created_at", "updated_at", "ingested_at", "tenant_code"],
               [r + [TENANT] for r in sr["staging_sequencing_experiment"]]),
        insert(f"{TENANT_DB}.germline__snv__occurrence",
               ["part", "seq_id", "task_id", "locus_id", "ad_ratio", "gq", "dp", "ad_total", "ad_ref", "ad_alt", "zygosity", "calls",
                "quality", "filter", "info_qd", "exomiser_moi", "exomiser_acmg_classification", "exomiser_acmg_evidence",
                "exomiser_variant_score", "exomiser_gene_combined_score", "parental_origin", "father_zygosity", "mother_zygosity",
                "transmission_mode", "phased"],
               [r + [False] for r in sr["germline__snv__occurrence"]]),
        insert(f"{TENANT_DB}.somatic__snv__occurrence",
               ["part", "task_id", "tumor_seq_id", "locus_id", "normal_seq_id", "quality", "filter", "info_hotspot", "info_qd", "info_aq",
                "tumor_dp", "tumor_af", "tumor_zygosity", "tumor_ad_ref", "tumor_ad_alt", "tumor_ad_total", "tumor_ad_ratio", "tumor_sq",
                "normal_dp", "normal_af", "normal_zygosity", "normal_ad_ref", "normal_ad_alt", "normal_ad_total", "normal_ad_ratio"],
               sr["somatic__snv__occurrence"]),
        insert(f"{TENANT_DB}.germline__cnv__occurrence",
               ["part", "seq_id", "task_id", "cnv_id", "aliquot", "chromosome", "start", "end", "type", "length", "name", "quality", "calls",
                "filter", "cn", "pe", "sm", "svtype", "svlen", "reflen", "ciend", "cipos", "symbol", "nb_genes", "nb_snv", "gnomad_af"],
               sr["germline__cnv__occurrence"]),
        insert(f"{TENANT_DB}.somatic__cnv__occurrence",
               ["part", "seq_id", "task_id", "cnv_id", "aliquot", "chromosome", "start", "end", "type", "alternate", "length", "name",
                "quality", "calls", "filter", "bc", "pe", "sm", "svtype", "svlen", "reflen", "ciend", "cipos", "cn", "cnf", "cnq", "mcn",
                "mcnf", "mcnq", "maf", "sd", "ascn_as", "cytoband", "symbol", "nb_genes", "nb_snv"], sr["somatic__cnv__occurrence"]),
        insert(f"{TENANT_DB}.exomiser", ["part", "seq_id", "locus_id", "id", "locus_hash", "moi", "variant_score", "gene_combined_score",
                                          "variant_rank", "rank", "symbol", "acmg_classification", "acmg_evidence"], sr["exomiser"])]


def add_mri_labs_dictionary(pcx_tables, patients, data):
    mri, labs = [], {k: [] for k in pcx.LAB_TABLES}
    for p in patients.values():
        t = pcx.timeline(p, data)
        if t:
            mri += pcx.mri(p, t)
            for k, rows in pcx.labs(p, t).items():
                labs[k] += rows
    pcx_tables["v_pcx_30_mri_images_combined"] = (pcx.MRI_COLS, mri)
    for k, cols in pcx.LAB_TABLES.items():
        pcx_tables[k] = (cols, labs[k])
    dictionary = pcx.read_csv(os.path.join(PCX_DIR, "view_data_dictionary_access_policy.csv"))
    pcx_tables["v_pcx_30_data_dictionary"] = ([("display_order", "INT"), ("table_name", "VARCHAR(128)"), ("source_file", "VARCHAR(128)"),
                                               ("field_name", "VARCHAR(128)"), ("description", "VARCHAR(2000)")],
                                              [[i + 1, r["view"], None, r["field"], r["description"]] for i, r in enumerate(dictionary)])


def source_tables(pcx_tables, swap=False):
    """The PCX source tables. swap: loaded next to the live table, then swapped with it, so the views never read an empty
    or missing table."""
    out = []
    for name, (cols, rows) in pcx_tables.items():
        for r in rows:
            assert len(r) == len(cols), (name, len(r), len(cols))
        table = f"{SOURCE_DB}.`{name}__next`" if swap else f"{SOURCE_DB}.`{name}`"
        out.append(f"DROP TABLE IF EXISTS {table};")
        coldefs = ",\n    ".join(f"`{c}` {t} NULL" for c, t in cols)
        out.append(f"CREATE TABLE {table} (\n    {coldefs}\n)\nDUPLICATE KEY(`{cols[0][0]}`)\n"
                   f"DISTRIBUTED BY HASH(`{cols[0][0]}`) BUCKETS 1\nPROPERTIES (\"replication_num\" = \"1\");")
        out.append(insert(table, [f"`{c}`" for c, _ in cols], rows))
        if swap:
            out += [f"ALTER TABLE {SOURCE_DB}.`{name}` SWAP WITH `{name}__next`;", f"DROP TABLE {table};"]
    return out


def patient_keys(patients):
    """The URL keys (sql/pcx_30_patient_key.sql): the table is never dropped and only gets keys for patients without one,
    so a re-run keeps every link. Keys are uuid4 (cryptographic): the one part of the output that differs between builds."""
    key_ddl = open(os.path.join(HERE, "sql", "pcx_30_patient_key.sql"), encoding="utf-8").read()
    key_ddl = key_ddl[key_ddl.index("CREATE TABLE"):].replace(f"{TEMPLATE_SOURCE_DB}.", f"{SOURCE_DB}.").rstrip()
    key_table, candidates = f"{SOURCE_DB}.pcx_30_patient_key", f"{SOURCE_DB}.pcx_30_patient_key_candidate"
    return [key_ddl, f"DROP TABLE IF EXISTS {candidates};", key_ddl.replace(key_table, candidates),
            insert(candidates, ["organization_code", "mrn", "patient_key"],
                   [[p.org, p.mrn, str(uuid.uuid4())] for p in patients.values() if p.org and p.mrn]),
            f"INSERT INTO {key_table} (organization_code, mrn, patient_key)\nSELECT c.organization_code, c.mrn, c.patient_key "
            f"FROM {candidates} c\nLEFT JOIN {key_table} k ON k.organization_code = c.organization_code AND k.mrn = c.mrn\n"
            f"WHERE k.patient_key IS NULL;",
            f"DROP TABLE {candidates};"]


def migrate(old_patients, old_data):
    """--migrate-from: the SQL that brings an environment seeded from the old CSVs (same --tenant, --id-base) to --deid.
    - The MRN and birth date of every patient seen before are kept (pcx.build pins), so URL keys and portal patients still match.
    - The PCX source tables are reloaded whole: they hold nothing but the CSVs and the fake identity.
    - A portal patient whose genomics would come out differently (diagnosis changed, ...) is replaced: deleted, then created
      again with ids after --new-id-base, like the added ones. One whose patient row alone changed is updated in place.
      Replacing a patient deletes what users added to its cases (notes, flags, interpretations), as a full reseed would.
    - The ids of the existing rows are those of the old build: the Postgres script stops before any change when the
      environment does not hold them, so it runs first, and once.
    - snv__variant frequencies are recounted from the occurrences in the environment, whichever loci export --loci is."""
    old = genomics.build(old_patients, old_data, ID_BASE, LOCI)[1]
    old_portal = {p.rid: p.portal_id for p in old_patients.values() if hasattr(p, "portal_id")}
    genomics.build(patients, data, ID_BASE, LOCI)
    new_portal = {p.rid for p in patients.values() if hasattr(p, "portal_id")}

    def alone(p, d):
        pg_, sr_ = genomics.build({p.rid: p}, d, 0, LOCI)[1:3]
        return pg_.pop("patient"), pg_, sr_

    replaced, updated = [], []
    for rid in sorted(old_portal.keys() & new_portal):
        (old_row, *old_rest), (new_row, *new_rest) = alone(old_patients[rid], old_data), alone(patients[rid], data)
        if old_rest != new_rest:
            replaced.append(rid)
        elif old_row != new_row:
            updated.append((rid, old_portal[rid], new_row[0][1:]))
    removed, added = sorted(old_portal.keys() - new_portal), sorted(new_portal - old_portal.keys())
    g, pg, sr, _ = genomics.build({rid: patients[rid] for rid in added + replaced}, data, args.new_id_base, LOCI)

    pids = {old_portal[rid] for rid in removed + replaced}
    samples = {r[0] for r in old["sample"] if r[6] in pids}
    seqs = {r[0] for r in old["sequencing_experiment"] if r[1] in samples}
    cases = {r[0] for r in old["cases"] if r[1] in pids}
    tasks = {r[0] for r in old["task_context"] if r[1] in seqs}
    documents = {r[1] for r in old["task_has_document"] if r[0] in tasks}
    ids = lambda xs: ", ".join(map(str, sorted(xs))) or "NULL"
    texts = lambda xs: ", ".join(f"'{x}'" for x in sorted(xs)) or "NULL"
    t = f"tenant_code = '{TENANT}'"
    expected = ",\n        ".join(f"({pid}, {pg_q(p.mrn)})" for rid, pid in sorted(old_portal.items()) for p in [old_patients[rid]])
    P = [f"""/* Tenant {TENANT}: data release {os.path.basename(os.path.normpath(args.deid))}, over the seed of
   {os.path.basename(os.path.normpath(args.migrate_from))} (--id-base {ID_BASE}). Generated by scripts/seed/build_seed.py --migrate-from;
   do not hand-edit. Run it before migrate_starrocks.sql, once: it stops before any change when the tenant does not hold
   the portal patients of the old seed, or when an id it adds is taken. */
BEGIN;""", f"""DO $$
BEGIN
    IF (SELECT count(*) FROM patient p JOIN (VALUES
        {expected}) AS e(id, mrn) ON p.id = e.id AND p.submitter_patient_id = e.mrn WHERE p.{t}) <> {len(old_portal)} THEN
        RAISE EXCEPTION 'tenant {TENANT} does not hold the portal patients seeded from --migrate-from with --id-base {ID_BASE} (already migrated?)';
    END IF;
    IF (SELECT max(m) FROM (SELECT max(id) m FROM patient UNION ALL SELECT max(id) FROM sample UNION ALL SELECT max(id) FROM sequencing_experiment
          UNION ALL SELECT max(id) FROM cases UNION ALL SELECT max(id) FROM task UNION ALL SELECT max(id) FROM family
          UNION ALL SELECT max(id) FROM document UNION ALL SELECT max(id) FROM obs_categorical) x) > {args.new_id_base} THEN
        RAISE EXCEPTION '--new-id-base {args.new_id_base} is not above every id';
    END IF;
END $$;""", organization_rows(providers), "-- Portal patients removed from the release, or replaced: " + (", ".join(removed + replaced) or "none") + ".",
         f"DELETE FROM occurrence_note WHERE {t} AND case_id IN ({ids(cases)});",
         f"DELETE FROM occurrence_flag WHERE {t} AND case_id IN ({ids(cases)});",
         f"DELETE FROM interpretation_germline WHERE {t} AND case_id IN ({texts(cases)});",
         f"DELETE FROM interpretation_somatic WHERE {t} AND case_id IN ({texts(cases)});",
         f"DELETE FROM obs_categorical WHERE {t} AND case_id IN ({ids(cases)});",
         f"DELETE FROM task_has_document WHERE task_id IN ({ids(tasks)});",
         f"DELETE FROM task_context WHERE task_id IN ({ids(tasks)});",
         f"DELETE FROM case_has_sequencing_experiment WHERE case_id IN ({ids(cases)});",
         f"DELETE FROM family WHERE {t} AND case_id IN ({ids(cases)});",
         f"DELETE FROM cases WHERE {t} AND id IN ({ids(cases)});",
         f"DELETE FROM task WHERE {t} AND id IN ({ids(tasks)});",
         f"DELETE FROM document WHERE {t} AND id IN ({ids(documents)});",
         f"DELETE FROM sequencing_experiment WHERE {t} AND id IN ({ids(seqs)});",
         f"DELETE FROM sample WHERE {t} AND id IN ({ids(samples)});",
         f"DELETE FROM patient WHERE {t} AND id IN ({ids(pids)});"]
    P += [f"UPDATE patient SET submitter_patient_id = {pg_q(mrn)}, organization_code = {pg_q(org)}, sex_code = {pg_q(sex)}, "
          f"date_of_birth = {pg_q(dob)}, life_status_code = {pg_q(life)}, first_name = {pg_q(first)}, last_name = {pg_q(last)} "
          f"WHERE {t} AND id = {pid};" for _, pid, (mrn, _, org, sex, dob, life, first, last) in updated]
    P += ["-- Portal patients added to the release, or replaced: " + (", ".join(added + replaced) or "none") + "."]
    P += portal_rows(pg) + sequence_resets() + ["COMMIT;"]

    # Re-runnable: the occurrences of the new ids are deleted along with the old ones before being inserted.
    seq_ids = ids(seqs | {r[0] for r in pg["sequencing_experiment"]})
    S = [f"""/* StarRocks for tenant {TENANT}: data release {os.path.basename(os.path.normpath(args.deid))}. Generated by
   scripts/seed/build_seed.py --migrate-from; do not hand-edit. Run it after migrate_postgres.sql; it can be run again. */""",
         f"DELETE FROM {TENANT_DB}.germline__snv__occurrence WHERE seq_id IN ({seq_ids});",
         f"DELETE FROM {TENANT_DB}.somatic__snv__occurrence WHERE tumor_seq_id IN ({seq_ids});",
         f"DELETE FROM {TENANT_DB}.germline__cnv__occurrence WHERE seq_id IN ({seq_ids});",
         f"DELETE FROM {TENANT_DB}.somatic__cnv__occurrence WHERE seq_id IN ({seq_ids});",
         f"DELETE FROM {TENANT_DB}.exomiser WHERE seq_id IN ({seq_ids});",
         f"DELETE FROM {SHARED_DB}.staging_sequencing_experiment WHERE case_id IN ({ids(cases | {r[0] for r in pg['cases']})});"]
    S += occurrence_rows(sr)
    # The variants of the inserted occurrences (an upsert of the ones already there), then every frequency recounted.
    S.append(insert(f"{TENANT_DB}.snv__variant", VAR_COLS, [variant_row(v, 0, 0, 0, 0) for v in sorted(g.variants.values(), key=lambda v: v.locus_id)
                                                            if v.germline_seqs or v.somatic_seqs]))
    S.append(f"""USE {TENANT_DB};
UPDATE snv__variant
SET germline_pc_wgs = f.pc, germline_pn_wgs = f.pn, germline_pf_wgs = f.pf,
    germline_pc_wgs_affected = f.pc, germline_pn_wgs_affected = f.pn, germline_pf_wgs_affected = f.pf,
    somatic_pc_tn_wgs = f.sc, somatic_pn_tn_wgs = f.sn, somatic_pf_tn_wgs = f.sf
FROM (
    SELECT v.locus_id, coalesce(g.pc, 0) AS pc, gn.pn, if(gn.pn = 0, 0, round(coalesce(g.pc, 0) / gn.pn, 6)) AS pf,
           coalesce(s.sc, 0) AS sc, sn.sn, if(sn.sn = 0, 0, round(coalesce(s.sc, 0) / sn.sn, 6)) AS sf
    FROM {TENANT_DB}.snv__variant v
    LEFT JOIN (SELECT locus_id, count(DISTINCT seq_id) AS pc FROM {TENANT_DB}.germline__snv__occurrence GROUP BY locus_id) g ON g.locus_id = v.locus_id
    LEFT JOIN (SELECT locus_id, count(DISTINCT tumor_seq_id) AS sc FROM {TENANT_DB}.somatic__snv__occurrence GROUP BY locus_id) s ON s.locus_id = v.locus_id
    CROSS JOIN (SELECT count(DISTINCT seq_id) AS pn FROM {TENANT_DB}.germline__snv__occurrence) gn
    CROSS JOIN (SELECT count(DISTINCT tumor_seq_id) AS sn FROM {TENANT_DB}.somatic__snv__occurrence) sn
) f
WHERE snv__variant.locus_id = f.locus_id;""")
    S.append(f"DELETE FROM {TENANT_DB}.snv__variant WHERE germline_pc_wgs = 0 AND somatic_pc_tn_wgs = 0;")
    S += source_tables(pcx_tables, swap=True) + patient_keys(patients)

    os.makedirs(args.out, exist_ok=True)
    for name, parts in [("migrate_postgres.sql", P), ("migrate_starrocks.sql", S)]:
        open(os.path.join(args.out, name), "w", encoding="utf-8").write("\n\n".join(parts) + "\n")
    print(json.dumps({"pcx_patients": {"before": len(old_patients), "after": len(patients),
                                       "added": sorted(patients.keys() - old_patients.keys()),
                                       "removed": sorted(old_patients.keys() - patients.keys())},
                      "portal_patients": {"added": added, "removed": removed, "replaced": replaced,
                                          "updated": [u[0] for u in updated]},
                      "reset_birth_dates": sorted(rid for rid, p in patients.items() if rid in old_patients and p.dob != old_patients[rid].dob)},
                     indent=1))


organizations = pcx.read_organization_ref(PCX_DIR)
org_ref = {r["code"]: r for r in organizations}
old_patients = old_data = None
if args.migrate_from:
    old_patients, old_data, _ = pcx.build(args.migrate_from, organizations)
patients, data, pcx_tables = pcx.build(args.deid, organizations, old_patients and {rid: (p.mrn, p.dob) for rid, p in old_patients.items()})
add_mri_labs_dictionary(pcx_tables, patients, data)
providers = sorted({p.org for p in patients.values()})
if args.migrate_from:
    migrate(old_patients, old_data)
    sys.exit()
g, pg, sr, ids = genomics.build(patients, data, ID_BASE, LOCI)
genomics.add_relapse_samples(pg, ids)
genomics.add_prenatal_case(g, pg, sr, ids, next(p.org for p in sorted(patients.values(), key=lambda p: p.rid) if hasattr(p, "portal_id")))

# ---------------------------------------------------------------- Postgres
P = [f"""/* Tenant {TENANT} for the local stack. Generated by scripts/seed/build_seed.py; do not hand-edit.
   Runs after the migrations, before provision.sh (roles, users, grants, Ranger) and the API. Re-runnable: the
   tenant's rows are deleted first. */
BEGIN;"""]
# In QA the tenant's roles and grants are managed by hand (create-tenant, admin UI): never delete them.
tenant_tables = ["occurrence_note", "occurrence_flag", "interpretation_germline", "interpretation_somatic", "obs_categorical",
                 "task_has_document", "task_context", "case_has_sequencing_experiment", "family", "cases", "task", "document",
                 "sequencing_experiment", "sample", "fetus", "patient", "analysis_catalog", "project"]
for table in tenant_tables + ([] if QA else ["user_role", "role_action", "role", "organization"]):
    if table == "task_has_document":
        P.append(f"DELETE FROM task_has_document WHERE task_id IN (SELECT id FROM task WHERE tenant_code = '{TENANT}');")
    elif table == "task_context":
        P.append(f"DELETE FROM task_context WHERE task_id IN (SELECT id FROM task WHERE tenant_code = '{TENANT}');")
    elif table == "case_has_sequencing_experiment":
        P.append(f"DELETE FROM case_has_sequencing_experiment WHERE case_id IN (SELECT id FROM cases WHERE tenant_code = '{TENANT}');")
    else:
        P.append(f"DELETE FROM {table} WHERE tenant_code = '{TENANT}';")
P.append(f"INSERT INTO tenant (code, name) VALUES ('{TENANT}', {pg_q(TENANT_NAME)}) ON CONFLICT (code) DO NOTHING;")
P.append(organization_rows(providers))
# The migrations insert analysis_catalog rows with explicit ids without moving the sequence.
for table in ("project", "analysis_catalog"):
    P.append(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), (SELECT COALESCE(MAX(id), 1) FROM {table}));")
P.append(insert("project", ["code", "name", "description", "tenant_code"],
                [["CBTN", "Children's Brain Tumor Network", "Pediatric CNS tumor cohort, tumor-normal and germline", TENANT]], pg_q))
P.append(insert("analysis_catalog", ["code", "name", "tenant_code"],
                [["CBTN-SOM", "Pediatric CNS tumor, tumor-normal", TENANT], ["CBTN-GERM", "Pediatric cancer predisposition, germline", TENANT]], pg_q))
P += portal_rows(pg)
P += sequence_resets()
P.append("COMMIT;")

# ---------------------------------------------------------------- StarRocks: tables and data
schema = open(os.path.join(HERE, "sql", "starrocks_schema.sql")).read().replace("{shared}", SHARED_DB).replace("{tenant}", TENANT_DB)
S = [f"""/* StarRocks for tenant {TENANT} ({args.env}). Generated by scripts/seed/build_seed.py; do not hand-edit.
   {SHARED_DB}: shared annotation and reference tables (SHARED_DATABASE). {TENANT_DB}: the tenant's occurrence tables
   (PerTenant), next to the views the API creates over Postgres. {SOURCE_DB}: the PCX source tables. */
CREATE DATABASE IF NOT EXISTS {TENANT_DB};
CREATE DATABASE IF NOT EXISTS {SOURCE_DB};"""]
if QA:
    # The shared database, its tables and the JDBC catalog already exist and hold the environment's real data: only the
    # tenant's own tables are (re)created, and the seed's rows in the shared tables are deleted before being inserted.
    names = re.findall(rf"CREATE TABLE IF NOT EXISTS {TENANT_DB}\.`(\w+)`", schema)
    S += [f"DROP TABLE IF EXISTS {TENANT_DB}.`{name}`;" for name in names]
    if args.like_tenant:
        S += [f"CREATE TABLE {TENANT_DB}.`{name}` LIKE {args.like_tenant}_tenant.`{name}`;" for name in names]
    else:
        S.append("\n\n".join(stmt + ";" for stmt in re.split(r";\s*\n", schema) if f"{TENANT_DB}." in stmt))
else:
    S.append(f"""CREATE DATABASE IF NOT EXISTS {SHARED_DB};
CREATE EXTERNAL CATALOG IF NOT EXISTS radiant_jdbc PROPERTIES (
    "type" = "jdbc", "user" = "radiant", "password" = "radiant", "jdbc_uri" = "jdbc:postgresql://postgres:5432/radiant",
    "driver_url" = "https://repo1.maven.org/maven2/org/postgresql/postgresql/42.3.3/postgresql-42.3.3.jar",
    "driver_class" = "org.postgresql.Driver");""")
    for name in re.findall(r"CREATE TABLE IF NOT EXISTS (\w+\.`\w+`)", schema):
        S.append(f"DROP TABLE IF EXISTS {name};")
    S.append(schema)

variants = sorted(g.variants.values(), key=lambda v: v.locus_id)
germline_seqs = {r[1] for r in sr["germline__snv__occurrence"]}
tumor_seqs = {r[2] for r in sr["somatic__snv__occurrence"]}
var_rows, csq_rows, cf_rows, clinvar_rows, gnomad_rows = [], [], [], [], []
for v in variants:
    var_rows.append(variant_row(v, len(v.germline_seqs), len(germline_seqs), len(v.somatic_seqs), len(tumor_seqs)))
    if v.real:
        continue
    deleterious = v.impact in ("HIGH", "MODERATE")
    scores = (genomics.h("cadd", v.locus_id) % 300) / 10 + (15 if deleterious else 0)
    # The MANE pair of the gene: the Ensembl row carries the versioned RefSeq id, the RefSeq row points back.
    refseq = f"NM_{genomics.h('refseq', v.symbol) % 900000 + 100000:06d}"
    ens_version, refseq_version = str(genomics.h("version", v.transcript) % 9 + 1), str(genomics.h("version", refseq) % 9 + 1)
    exon_rank = genomics.h("exon", v.locus_id) % 20 + 1
    exon_total = exon_rank + genomics.h("exon_total", v.symbol) % 15
    annotation = [[v.consequence], genomics.IMPACT[v.impact], "protein_coding", "D" if deleterious else "T", "D" if deleterious else "B",
                  round(scores, 2), round(scores / 40, 3), v.impact, v.aa, v.hgvsc, 0.98 if v.symbol in omim_symbols else 0.12,
                  0.2 if v.symbol in omim_symbols else 0.9, exon_rank, exon_total]
    csq_rows.append([v.locus_id, v.symbol, v.transcript, ens_version, "Ensembl", True, True, True, False, f"{refseq}.{refseq_version}", refseq]
                    + annotation)
    csq_rows.append([v.locus_id, v.symbol, refseq, refseq_version, "RefSeq", False, False, True, False, None, v.transcript] + annotation)
    cf_rows.append([genomics.PART, v.locus_id, deleterious, genomics.IMPACT[v.impact], v.symbol, v.consequence, "protein_coding",
                    "D" if deleterious else "T", round(scores, 2), v.impact])
    if v.clinvar:
        clinvar_rows.append([v.locus_id, v.chrom, v.pos, v.pos, v.ref, v.alt, [v.clinvar], f"{v.symbol}({v.hgvsc})", [v.clinvar],
                             v.locus, str(genomics.h("locus", v.locus))])
    if v.af:
        gnomad_rows.append([v.locus_id, v.af, int(v.af * 152000), 152000, int(v.af * v.af * 76000)])

S.append(insert(f"{TENANT_DB}.snv__variant", VAR_COLS, var_rows))


def delete_in(table, column, values, extra=""):
    """Re-runnable inserts into a shared table that holds other rows: remove the seed's own rows first."""
    values = sorted(set(values))
    return "\n".join(f"DELETE FROM {table} WHERE {extra}{column} IN ({', '.join(map(str, values[i:i + 1000]))});"
                     for i in range(0, len(values), 1000))


if QA:
    S.append(delete_in(f"{SHARED_DB}.staging_sequencing_experiment", "case_id", [r[0] for r in sr["staging_sequencing_experiment"]]))
if QA and not LOCI:
    loci = [v.locus_id for v in variants]
    S.append(delete_in(f"{SHARED_DB}.snv__consequence", "locus_id", loci))
    S.append(delete_in(f"{SHARED_DB}.snv__consequence_filter_partitioned", "locus_id", loci, f"part = {genomics.PART} AND "))
    S.append(delete_in(f"{SHARED_DB}.clinvar", "locus_id", loci))
    S.append(delete_in(f"{SHARED_DB}.gnomad_genomes_v3", "locus_id", loci))
# With --loci the variants are real loci: their annotations are already in the shared database.
if not LOCI:
    S.append(insert(f"{SHARED_DB}.snv__consequence", ["locus_id", "symbol", "transcript_id", "transcript_version", "source", "is_canonical",
                                                       "is_picked", "is_mane_select", "is_mane_plus", "mane_select", "mane_pair_transcript_id",
                                                       "consequences", "impact_score", "biotype", "sift_pred", "polyphen2_hvar_pred",
                                                       "cadd_phred", "revel_score", "vep_impact", "aa_change", "dna_change", "gnomad_pli",
                                                       "gnomad_loeuf", "exon_rank", "exon_total"], csq_rows))
    S.append(insert(f"{SHARED_DB}.snv__consequence_filter_partitioned", ["part", "locus_id", "is_deleterious", "impact_score", "symbol",
                                                                          "consequence", "biotype", "sift_pred", "cadd_phred", "vep_impact"], cf_rows))
    S.append(insert(f"{SHARED_DB}.clinvar", ["locus_id", "chromosome", "start", "end", "reference", "alternate", "interpretations", "name",
                                              "clin_sig", "locus", "locus_hash"], clinvar_rows))
    S.append(insert(f"{SHARED_DB}.gnomad_genomes_v3", ["locus_id", "af", "ac", "an", "hom"], gnomad_rows))
# QA's shared database holds the real genes, terms and panels: the seed's reference rows would duplicate them.
REFERENCE = [] if QA else [
    insert(f"{SHARED_DB}.ensembl_gene", ["gene_id", "chromosome", "start", "end", "type", "strand", "name", "biotype", "description",
                                          "external_name", "length"],
           [[gid, c, s, e, "gene", strand, sym, "protein_coding", desc, sym, e - s] for sym, (c, s, e, gid, _, strand, desc) in
            sorted(genomics.GENES.items())]),
    insert(f"{SHARED_DB}.cytoband", ["chromosome", "cytoband", "start", "end", "gie_stain"],
                [[c, b, s, e, "gneg"] for c, b, s, e in genomics.CYTOBANDS]),
    insert(f"{SHARED_DB}.omim_gene_panel", ["symbol", "panel", "omim_gene_id", "omim_phenotype_id", "inheritance_code", "inheritance"],
                [list(o) for o in genomics.OMIM]),
    insert(f"{SHARED_DB}.hpo_gene_panel", ["symbol", "panel", "hpo_term_name", "hpo_term_id"],
                [["SMARCB1", "Neoplasm (HP:0002664)", "Neoplasm", "HP:0002664"], ["TP53", "Neoplasm (HP:0002664)", "Neoplasm", "HP:0002664"]]),
    insert(f"{SHARED_DB}.mondo_term", ["id", "name", "term"],
                [[i, n, f"{i} {n}"] for i, n in sorted(set(genomics.MONDO.values()) | set(genomics.EXTRA_MONDO))]),
    insert(f"{SHARED_DB}.hpo_term", ["id", "name", "term"], [[i, n, f"{i} {n}"] for i, n in genomics.HPO])]
S += REFERENCE
S += occurrence_rows(sr)

# PCX source tables, MRI and labs, the data dictionary, and the URL keys.
S += source_tables(pcx_tables)
S += patient_keys(patients)

# ---------------------------------------------------------------- StarRocks: views
V = [f"""/* PCX secured views for tenant {TENANT}, rendered from scripts/pcx_tables/access_controlled_views (owned by the
   RADIANT-Timeline-Abstraction team), then Radiant's own views (scripts/seed/views).
   Needs the auth.* and {TENANT_DB}.* views the API creates at startup. */"""]
views_dir = os.path.join(PCX_DIR, "access_controlled_views")
seeded = set(pcx_tables)
for file in sorted(os.listdir(views_dir)):
    if not file.endswith(".sql.tmpl"):
        continue
    sql = open(os.path.join(views_dir, file), encoding="utf-8").read()
    sql = sql[sql.index("CREATE OR REPLACE VIEW"):].rstrip().rstrip(";")
    source = re.search(rf"FROM {TEMPLATE_SOURCE_DB}\.(\w+)", sql).group(1)
    if source not in seeded:
        sys.exit(f"{file} reads {TEMPLATE_SOURCE_DB}.{source}, which the seed does not create")
    # StarRocks 4.0.16 drops a slot ("slot_id not found") when it broadcasts this JDBC table against a regexp_replace
    # join key; a shuffle join avoids it. The templates are upstream's, so the hint is added here.
    if sql.count(JDBC_PATIENT_JOIN) != 1:
        sys.exit(f"{file}: expected one '{JDBC_PATIENT_JOIN}' to add the [SHUFFLE] hint to")
    sql = sql.replace(JDBC_PATIENT_JOIN, JDBC_PATIENT_JOIN.replace("JOIN", "JOIN [SHUFFLE]"))
    sql = (sql.replace("{{.TenantCode}}", TENANT).replace(f"{TEMPLATE_VIEW_DB}.", f"{TENANT_DB}.")
              .replace(f"{TEMPLATE_SOURCE_DB}.", f"{SOURCE_DB}."))
    if "{{" in sql:
        sys.exit(f"{file} has a placeholder this script does not fill")
    V.append(sql + ";")
V.append(f"CREATE OR REPLACE VIEW {TENANT_DB}.v_pcx_30_data_dictionary AS\n"
         f"SELECT display_order, table_name, source_file, field_name, description FROM {SOURCE_DB}.v_pcx_30_data_dictionary;")
for file in sorted(os.listdir(os.path.join(HERE, "views"))):
    if file.endswith(".sql.tmpl"):
        sql = (open(os.path.join(HERE, "views", file), encoding="utf-8").read().replace("{{.TenantCode}}", TENANT)
               .replace(f"{TEMPLATE_SOURCE_DB}.", f"{SOURCE_DB}."))
        V.append(sql[sql.index("CREATE OR REPLACE VIEW"):].rstrip().rstrip(";") + ";")

# Provisioning through the real tools, as in QA: roles and Ranger policies (create-tenant, refresh-tenants), then each
# demo user's StarRocks JWT user, Postgres grants and Ranger role membership (create-user -sub: Keycloak is left alone,
# the users come from the realm import).
R = ["#!/bin/sh", "# Generated by scripts/seed/build_seed.py; do not hand-edit.", "set -eu",
     f"create-tenant -code {TENANT} -name {json.dumps(TENANT_NAME)}", "refresh-tenants"]
for uid, name, first, last, grants in ([] if QA else DEMO_USERS):
    flags = " ".join(f"-grant {TENANT}:{org or ''}:{role}" for org, role in grants)
    R.append(f"create-user -sub {uid} -email {name}@localstack.invalid -first {first} -last {last} {flags}")

os.makedirs(args.out, exist_ok=True)
open(os.path.join(args.out, "provision.sh"), "w").write("\n".join(R) + "\n")
for name, parts in [("postgres_seed.sql", P), ("starrocks_seed.sql", S), ("starrocks_views.sql", V)]:
    open(os.path.join(args.out, name), "w", encoding="utf-8").write("\n\n".join(parts) + "\n")
portal = [p for p in patients.values() if hasattr(p, "portal_id")]
print(json.dumps({"pcx_patients": len(patients), "portal_patients": len(portal), "cases": len(pg["cases"]),
                  "variants": len(variants), "germline_snv": len(sr["germline__snv__occurrence"]),
                  "somatic_snv": len(sr["somatic__snv__occurrence"]), "germline_cnv": len(sr["germline__cnv__occurrence"]),
                  "somatic_cnv": len(sr["somatic__cnv__occurrence"]), "interpretations": len(pg["interpretation_germline"]) +
                  len(pg["interpretation_somatic"]), "mri": len(pcx_tables["v_pcx_30_mri_images_combined"][1])}))
