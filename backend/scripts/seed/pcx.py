"""PCX side of the seed: the de-identified CSVs + fake PHI -> the source tables the secured views read.

Each pcx_30_*_deid CSV becomes the identified v_pcx_30_*_combined table of the source database (radiant_data_dev in PRD), so the
templates of scripts/pcx_tables render with only the tenant substituted. The fake PHI is derived from the research id (a hash,
not a random draw), so a patient keeps the same MRN, names and birth date when the CSVs are exported again.
MRI sessions and labs have no CSV yet: they are generated from each patient's timeline.
"""
import csv, datetime as dt, hashlib, os, re

TODAY = dt.date(2026, 10, 1)
FIRST_DIGITAL_MRI = dt.date(2010, 1, 1)
FLYWHEEL = "https://flywheel.example.org"

FIRST_F = ["Olivia", "Emma", "Sophia", "Isabella", "Harper", "Amelia", "Evelyn", "Abigail", "Ella", "Scarlett", "Grace", "Lily", "Aria",
           "Zoe", "Nora", "Maya", "Leah", "Hannah", "Chloe", "Layla", "Riley", "Stella", "Hazel", "Violet"]
FIRST_M = ["Noah", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Theodore", "Jack", "Levi", "Mateo", "Owen", "Caleb",
           "Ezra", "Isaac", "Julian", "Adrian", "Miles", "Hudson", "Wyatt", "Leo", "Asher", "Grayson", "Luca"]
LAST = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
        "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Lee", "Perez", "Thompson", "White", "Harris", "Clark", "Lewis",
        "Young", "Patel", "Kim", "Nguyen", "Carter", "Robinson", "Walsh", "Chen", "Ramirez", "Rivera", "Murphy"]


def h(*key):
    """A stable integer for a key: every fake value is a function of the research id, never of the row order."""
    return int(hashlib.md5("/".join(map(str, key)).encode()).hexdigest()[:12], 16)


def age(v):
    """An age in days, or None for the unknowns: -1 and the sentinel strings (Not Available, Not Reported, ...)."""
    try:
        n = int(float(v))
    except (TypeError, ValueError):
        return None
    return n if n >= 0 else None


def read_csv(path):
    with open(path, encoding="utf-8") as f:
        return [{k: (v if v != "" else None) for k, v in r.items()} for r in csv.DictReader(f)]


class Patient:
    def __init__(self, demo, org_code):
        self.rid = demo["research_id"]
        self.demo = demo
        self.org_name = demo["organization_name"]
        self.org = org_code
        self.ages = []

    def finish(self, used_mrns):
        """Fake identity, fitted to the patient's oldest recorded age so that no date falls after today."""
        rid = self.rid
        self.mrn = None
        while self.mrn is None or self.mrn in used_mrns:
            self.mrn = str(10_000_000 + h("mrn", rid, len(used_mrns)) % 90_000_000)
        used_mrns.add(self.mrn)
        gender = self.demo["gender"] or "not reported"
        self.sex = gender if gender in ("female", "male") else "unknown"
        names = FIRST_F if gender == "female" else FIRST_M if gender == "male" else FIRST_F + FIRST_M
        self.given = names[h("given", rid) % len(names)]
        self.family = LAST[h("family", rid) % len(LAST)]
        year = int(self.demo["birth_year"])
        oldest = max(self.ages, default=0)
        last_dob = min(dt.date(year, 12, 31), TODAY - dt.timedelta(days=oldest))
        span = max((last_dob - dt.date(year, 1, 1)).days, 0)
        self.dob = dt.date(year, 1, 1) + dt.timedelta(days=h("dob", rid) % (span + 1))
        deid = self.demo["address_postal_code"]
        self.zip = None if not deid or deid == "XXXXX" else deid[:3] + f"{h('zip', rid) % 100:02d}"

    def date(self, v):
        a = age(v)
        return None if a is None else (self.dob + dt.timedelta(days=a)).isoformat() + " 00:00:00"


S, L, DEC = "VARCHAR(65533)", "VARCHAR(1048576)", "DECIMAL(38,9)"
IDENT = [("organization_name", "VARCHAR(256)"), ("organization_code", "VARCHAR(64)"), ("mrn", "VARCHAR(256)"), ("research_id", "VARCHAR(256)")]
DATES = {  # the identified table's date column next to each age the deid CSV carries
    "age_at_event_days": "event_date", "age_at_regimen_start_days": "regimen_start_date", "age_at_regimen_stop_days": "regimen_stop_date",
    "age_at_vital_status_days": "vital_status_date", "age_at_radiation_start_days": "radiation_start_date",
    "age_at_radiation_stop_days": "radiation_stop_date", "age_at_surgery_days": "surgery_date",
    "age_at_initial_dx_days": "initial_dx_date", "age_at_first_event_days": "first_event_date",
    "age_at_first_radiation_ever_days": "first_radiation_ever_date", "age_at_initial_radiation_days": "initial_radiation_date",
    "age_at_first_chemo_ever_days": "first_chemo_ever_date", "age_at_initial_chemo_days": "initial_chemo_date",
    "age_at_first_methotrexate_ever_days": "first_methotrexate_ever_date",
}
INT_AGES = {"age_at_event_days", "age_at_vital_status_days", "age_at_initial_dx_days", "age_at_first_event_days",
            "age_at_first_radiation_ever_days", "age_at_initial_radiation_days", "age_at_first_chemo_ever_days",
            "age_at_initial_chemo_days", "age_at_first_methotrexate_ever_days"}

# deid CSV -> identified source table: its name, and the identified columns in the order of the PRD view.
TABLES = {
    "event_level": "v_pcx_30_event_level_combined",
    "medical_therapy_level": "v_pcx_30_medical_therapy_level_combined",
    "patient_level": "v_pcx_30_patient_level_combined",
    "radiation_level": "v_pcx_30_radiation_level_combined",
    "surgery_level": "v_pcx_30_surgery_level_combined",
    "treatment_summary": "v_pcx_30_treatment_summary_combined",
}


def identified(name, header):
    """The identified table's columns: the identifiers, then each deid column with its date before every age."""
    cols = list(IDENT)
    for c in header:
        if c in ("organization_name", "research_id"):
            continue
        if c in DATES:
            cols.append((DATES[c], "DATETIME"))
            cols.append((c, "INT" if c in INT_AGES else "VARCHAR(1000)"))
        else:
            cols.append((c, S))
    return cols


# Organizations the de-identified CSVs reference that organization_ref_table.sql does not carry yet
# (reported to the data team 2026-10-06). Added only while still absent upstream, so this list stops
# having any effect once they land — delete it then, and keep the codes if upstream picks different
# ones only after checking nothing is already seeded against these.
PENDING_ORGS = [
    {"code": "NCH", "name": "Nicklaus Children's Hospital", "category_code": "healthcare_provider", "tenant_code": "radiant"},
    {"code": "NYU", "name": "NYU Langone Health", "category_code": "healthcare_provider", "tenant_code": "radiant"},
]


def read_organization_ref(pcx_dir):
    """organization_name -> code, from the INSERT of radiant-prod/organization_ref/organization_ref_table.sql."""
    path = os.path.join(pcx_dir, "radiant-prod", "organization_ref", "organization_ref_table.sql")
    sql = open(path, encoding="utf-8").read()
    rows = [dict(zip(["code", "name", "category_code", "tenant_code"], [v.replace("''", "'") for v in r]))
            for r in re.findall(r"\('((?:[^']|'')*)', '((?:[^']|'')*)', '([^']*)', '([^']*)'\)", sql)]
    if not rows:
        raise SystemExit(f"no organization found in {path}")
    names = {r["name"] for r in rows}
    return rows + [o for o in PENDING_ORGS if o["name"] not in names]


def build(deid_dir, organizations):
    """Read the deid CSVs, give every patient a fake identity. Returns (patients by rid, {table: (cols, rows)})."""
    codes = {r["name"]: r["code"] for r in organizations}
    demo = read_csv(os.path.join(deid_dir, "pcx_30_demographics_deid.csv"))
    patients = {}
    for r in demo:
        if r["organization_name"] not in codes:
            raise SystemExit(f"{r['research_id']}: organization {r['organization_name']!r} is not in the organization reference")
        patients[r["research_id"]] = Patient(r, codes[r["organization_name"]])
    data = {name: read_csv(os.path.join(deid_dir, f"pcx_30_{name}_deid.csv")) for name in TABLES}
    for rows in data.values():
        for r in rows:
            p = patients[r["research_id"]]
            p.ages += [a for c, v in r.items() if c.startswith("age_at") and (a := age(v)) is not None]
    used = set()
    for rid in sorted(patients):
        patients[rid].finish(used)

    tables = {}
    demo_cols = IDENT + [("given_name", S), ("given_name_deid", S), ("family_name", S), ("family_name_deid", S), ("birth_date", S),
                         ("birth_year", "VARCHAR(256)"), ("race", S), ("ethnicity", S), ("gender", S), ("address_postal_code", S),
                         ("address_postal_code_deid", S), ("diagnosis_type_cohort", "VARCHAR(500)"), ("data_type_cohort", S)]
    tables["v_pcx_30_demographics_combined"] = (demo_cols, [
        [p.org_name, p.org, p.mrn, p.rid, p.given, r["given_name"], p.family, r["family_name"], p.dob.isoformat(), r["birth_year"],
         r["race"], r["ethnicity"], r["gender"], p.zip, r["address_postal_code"] or "XXXXX", r["diagnosis_type_cohort"], r["data_type_cohort"]]
        for r in demo for p in [patients[r["research_id"]]]])
    for name, table in TABLES.items():
        header = list(read_csv_header(os.path.join(deid_dir, f"pcx_30_{name}_deid.csv")))
        cols = identified(name, header)
        rows = []
        for r in data[name]:
            p = patients[r["research_id"]]
            row = [p.org_name, p.org, p.mrn, p.rid]
            for c in header:
                if c in ("organization_name", "research_id"):
                    continue
                if c in DATES:
                    row.append(p.date(r[c]))
                    if c in INT_AGES:  # an INT column keeps -1 and loses a sentinel string, as the PRD cast does
                        row.append(int(r[c]) if r[c] is not None and re.fullmatch(r"-?\d+", r[c]) else None)
                    else:
                        row.append(r[c])
                else:
                    row.append(r[c])
            rows.append(row)
        tables[table] = (cols, rows)
    return patients, data, tables


def read_csv_header(path):
    with open(path, encoding="utf-8") as f:
        return next(csv.reader(f))


def timeline(p, data):
    """The facts MRI and labs are generated from: diagnosis day, disease events, regimens, metastasis, last day."""
    rid = p.rid
    events = [(r["event_type"], age(r["age_at_event_days"])) for r in data["event_level"] if r["research_id"] == rid]
    initial = [a for t, a in events if t == "Initial CNS Tumor" and a is not None]
    if not initial:
        return None
    meta = any(r["metastasis"] == "Yes" for r in data["event_level"] if r["research_id"] == rid)
    regimens = [(age(r["age_at_regimen_start_days"]), age(r["age_at_regimen_stop_days"]), r["chemotherapy_agents"] or "")
                for r in data["medical_therapy_level"] if r["research_id"] == rid]
    radiations = [(age(r["age_at_radiation_start_days"]), age(r["age_at_radiation_stop_days"]))
                  for r in data["radiation_level"] if r["research_id"] == rid]
    vital = next((r for r in data["patient_level"] if r["research_id"] == rid), None)
    end = age(vital["age_at_vital_status_days"]) if vital else None
    end = end if end is not None else max(p.ages, default=min(initial))
    return dict(dx=min(initial), events=[(t, a) for t, a in events if a is not None], meta=meta, regimens=regimens,
                radiations=radiations, end=end, deceased=bool(vital and vital["vital_status"] == "deceased"),
                cohort=p.demo["diagnosis_type_cohort"] or "")


def mri(p, t):
    """Pre-op, post-op, end of radiation, before each relapse, then surveillance: every 3 months for 2 years,
    6 months up to 5 years, yearly after. Flywheel only holds digital studies (2010 onward)."""
    dx, end = t["dx"], t["end"]
    ages = {dx - 1, dx + 2} | {b + 30 for a, b in t["radiations"] if b is not None}
    ages |= {a - 2 for et, a in t["events"] if et in ("Recurrence", "Progressive", "Second Malignancy")}
    for anchor in [dx] + [a for et, a in t["events"] if et in ("Recurrence", "Progressive")]:
        a = anchor + 90
        while a < end:
            since = a - anchor
            ages.add(a)
            a += 90 if since < 730 else 180 if since < 1826 else 365
    sessions = [(a, "brain") for a in sorted(ages)]
    if t["meta"]:
        sessions += [(dx - 1, "spine")] + [(a - 2, "spine") for et, a in t["events"] if et == "Recurrence"]
    project, subject = oid("project", p.org), oid("subject", p.rid)
    rows = []
    for a, site in sorted(sessions):
        if a < 0 or a > end or p.dob + dt.timedelta(days=a) < FIRST_DIGITAL_MRI:
            continue
        sid = oid("session", p.rid, a, site)
        minutes = h("time", sid) % 600 + 7 * 60
        name = f"{a}d_{'B_brain' if site == 'brain' else 'S_spine'}_{minutes // 60:02d}h{minutes % 60:02d}m"
        rows.append([p.org_name, p.org, p.mrn, p.rid, subject, project, f"PCX30_{p.org}", sid, name, p.date(a), str(a), site, "MRI",
                     f"{FLYWHEEL}/#/projects/{project}/sessions/{sid}"])
    return rows


def oid(*key):
    # Flywheel ids are ObjectIds, deliberately unrelated to mrn/research_id so they link neither.
    return hashlib.md5("/".join(map(str, key)).encode()).hexdigest()[:24]


MRI_COLS = IDENT + [("flywheel_subject_id", "VARCHAR(128)"), ("flywheel_project_id", "VARCHAR(128)"), ("flywheel_project_name", "VARCHAR(128)"),
                    ("session_id", "VARCHAR(128)"), ("session_name", "VARCHAR(128)"), ("session_date", "DATETIME"),
                    ("age_at_session_days", "VARCHAR(128)"), ("anatomical_site", "VARCHAR(128)"), ("imaging_modality", "VARCHAR(128)"),
                    ("flywheel_url", S)]


LAB_IDENT = [("organization_name", S), ("organization_code", "VARCHAR(64)"), ("mrn", L), ("research_id", L)]


def analyte(name, extra=()):
    return [(f"{name}_value", DEC), (f"{name}_unit", L), (f"{name}_observed_at", "DATETIME"), (f"age_at_{name}_days", "INT"), *extra,
            (f"{name}_source_code_text", L)]


def csf_analyte(name, comparator=True):
    return [(f"{name}_display", L), (f"{name}_value", DEC)] + ([(f"{name}_comparator", L)] if comparator else []) + [
        (f"{name}_unit", L), (f"{name}_observed_at", "DATETIME"), (f"age_at_{name}_days", "INT")]


LAB_TABLES = {
    "v_cbc_latest_results": LAB_IDENT + [c for a in ["wbc", "hemoglobin", "platelets", "anc"] for c in analyte(a, [(f"{a}_loinc", L)])]
    + [("analytes_found", "BIGINT"), ("administrative_dates", "BIGINT")],
    "v_csf_results_latest_by_component": LAB_IDENT + [("patient_best_evidence", L)]
    + [c for a in ["protein", "glucose", "wbc", "rbc"] for c in csf_analyte(a, a in ("protein", "glucose")) + [(f"{a}_source_code_text", L)]]
    + [("cytology_evidence_tier", L), ("cytology_test_name", L), ("malignant_cells", L), ("multi_specimen_report", "TINYINT"),
       ("cytology_final_diagnosis", L), ("cytology_result_text", L), ("cytology_observed_at", "DATETIME"), ("age_at_cytology_days", "INT")]
    + csf_analyte("afp") + csf_analyte("hcg")
    + [("cea_display", L), ("cea_observed_at", "DATETIME"), ("age_at_cea_days", "INT"),
       ("cell_free_dna_observed_at", "DATETIME"), ("age_at_cell_free_dna_days", "INT"),
       ("malignant_cell_panel_observed_at", "DATETIME"), ("age_at_malignant_cell_panel_days", "INT"),
       ("pathology_review_text", L), ("pathology_review_observed_at", "DATETIME"), ("age_at_pathology_review_days", "INT"),
       ("components_present", "BIGINT"), ("csf_reports_total", "BIGINT"),
       ("first_csf_result_at", "DATETIME"), ("age_at_first_csf_result_days", "INT"),
       ("last_csf_result_at", "DATETIME"), ("age_at_last_csf_result_days", "INT")],
    "v_csf_tumor_analysis_latest": LAB_IDENT + [
        ("patient_best_evidence", L), ("evidence_tier", L), ("latest_test_family", L), ("latest_test_name", L),
        ("latest_analyzed_at", "DATETIME"), ("age_at_latest_analysis_days", "INT"), ("malignant_cells", L), ("multi_specimen_report", "TINYINT"),
        ("result_display", L), ("result_value", L), ("result_comparator", L), ("result_unit", L), ("final_diagnosis", L), ("result_text", L),
        ("result_sections", "BIGINT"), ("csf_analyses_total", "BIGINT"), ("first_analyzed_at", "DATETIME"), ("age_at_first_analysis_days", "INT"),
        ("distinct_families", "BIGINT"), ("families_ever", L)],
    "v_lansky_karnofsky_latest": LAB_IDENT + [
        ("scale", L), ("score", "INT"), ("scored_at", "DATETIME"), ("age_at_score_days", "INT"), ("score_text", L), ("scale_code", L),
        ("source_code_text", L), ("component_line", L), ("date_semantic", L)],
}
LANSKY = {100: "Fully active, normal", 90: "Minor restrictions in strenuous physical activity", 80: "Active, but tires more quickly",
          70: "Greater restriction of play and less time spent in play", 60: "Up and around, but minimal active play",
          50: "Gets dressed but lies around much of the day", 40: "Mostly in bed, participates in quiet activities",
          30: "In bed, needs assistance even for quiet play"}
KARNOFSKY = {100: "Normal, no complaints", 90: "Able to carry on normal activity, minor signs of disease",
             80: "Normal activity with effort", 70: "Cares for self, unable to carry on normal activity",
             60: "Requires occasional assistance", 50: "Requires considerable assistance and frequent medical care",
             40: "Disabled, requires special care", 30: "Severely disabled"}


def labs(p, t):
    """Latest CBC, CSF and performance score, consistent with the course: counts drop on chemotherapy, CSF is
    positive when the disease spread, scores fall before death. One row per patient and table, like the real views."""
    import random
    rng = random.Random(h("labs", p.rid))
    ident = [p.org_name, p.org, p.mrn, p.rid]
    dx, end, dying = t["dx"], t["end"], t["deceased"]
    on_chemo = lambda day: any(a is not None and a <= day <= (b if b is not None else a) + 14 for a, b, _ in t["regimens"])
    out = {k: [] for k in LAB_TABLES}
    if rng.random() < 0.85:
        day = max(dx + 1, end - rng.randrange(3, 45))
        low = on_chemo(day) or dying
        values = {"wbc": round(rng.uniform(1.2, 3.5) if low else rng.uniform(4.5, 10.5), 1),
                  "hemoglobin": round(rng.uniform(7.5, 10) if low else rng.uniform(11, 14.5), 1),
                  "platelets": rng.randrange(20, 120) if low else rng.randrange(150, 400),
                  "anc": round(rng.uniform(0.2, 1.5) if low else rng.uniform(1.8, 6.5), 2)}
        meta_cbc = {"wbc": ("10*3/uL", "6690-2", "WBC"), "hemoglobin": ("g/dL", "718-7", "HGB"),
                    "platelets": ("10*3/uL", "777-3", "PLT"), "anc": ("10*3/uL", "751-8", "ANC (automated)")}
        row, found = [], 0
        for k in ["wbc", "hemoglobin", "platelets", "anc"]:
            if k == "anc" and rng.random() < 0.1:
                row += [None] * 6
                continue
            unit, loinc, text = meta_cbc[k]
            row += [values[k], unit, p.date(day), day, loinc, text]
            found += 1
        out["v_cbc_latest_results"].append(ident + row + [found, 0])

    atrt = "teratoid" in t["cohort"].lower()
    if (atrt or "medulloblastoma" in t["cohort"].lower()) and rng.random() < 0.8:
        relapses = [a for et, a in t["events"] if et in ("Recurrence", "Progressive")]
        first = dx + rng.randrange(10, 21)
        last = max(first, min(end, (relapses[-1] + rng.randrange(5, 20)) if relapses else first + rng.randrange(0, 400)))
        total = 1 + len(relapses) + rng.randrange(0, 4)
        positive = t["meta"] or (bool(relapses) and rng.random() < 0.5)
        protein = rng.randrange(60, 150) if positive else rng.randrange(15, 45)
        glucose, wbc, rbc = rng.randrange(40, 80), rng.randrange(5, 30) if positive else rng.randrange(0, 6), rng.randrange(0, 50)
        num = lambda name, v, unit, comparator=True: [f"{v} {unit}", v] + ([None] if comparator else []) + [unit, p.date(last), last, name]
        tier = "structured" if rng.random() < 0.7 else "narrative"
        dx_text = ("Positive for malignant cells, consistent with metastatic " + ("ATRT" if atrt else "medulloblastoma")) if positive \
            else "Negative for malignant cells"
        cfdna = last if atrt and rng.random() < 0.4 else None
        panel = last if positive and rng.random() < 0.5 else None
        review = ("Neuropathology review: tumor cells with loss of INI1 (SMARCB1) nuclear staining" if atrt else
                  "Neuropathology review: small round blue cells, synaptophysin positive") if positive else None
        components = 4 + 1 + 3 + (cfdna is not None) + (panel is not None) + (review is not None)
        out["v_csf_results_latest_by_component"].append(
            ident + ["structured_lab" if tier == "structured" else "pathology_report"]
            + num("CSF protein", protein, "mg/dL") + num("CSF glucose", glucose, "mg/dL")
            + num("CSF WBC", wbc, "cells/uL", False) + num("CSF RBC", rbc, "cells/uL", False)
            + [tier, "CSF cytology", "Positive" if positive else "Negative", 0 if rng.random() < 0.9 else 1,
               dx_text, ("Atypical cells present in clusters. " if positive else "No atypical cells identified. ") + dx_text + ".",
               p.date(last), last,
               "<2.0 ng/mL", 2.0, "<", "ng/mL", p.date(last), last,
               "<1.0 mIU/mL", 1.0, "<", "mIU/mL", p.date(last), last,
               "<0.5 ng/mL", p.date(last), last,
               p.date(cfdna) if cfdna else None, cfdna,
               p.date(panel) if panel else None, panel,
               review, p.date(last) if review else None, last if review else None,
               components, total, p.date(first), first, p.date(last), last])
        families = ["cytology"] + (["cell_free_dna"] if cfdna else [])
        if cfdna and positive:
            vaf = round(rng.uniform(0.8, 12), 1)
            latest = ["cell_free_dna", "CSF cell-free DNA, SMARCB1", f"SMARCB1 variant detected, VAF {vaf}%", str(vaf), None, "%",
                      "SMARCB1 loss detected in CSF cell-free DNA", f"SMARCB1 c.157C>T detected at {vaf}% variant allele fraction."]
        elif cfdna:
            latest = ["cell_free_dna", "CSF cell-free DNA, SMARCB1", "Not detected", None, None, None,
                      "No tumor-derived DNA detected", "No SMARCB1 variant detected above the 0.5% limit of detection."]
        else:
            latest = ["cytology", "CSF cytology", "Positive" if positive else "Negative", None, None, None, dx_text, dx_text + "."]
        family, test, display, value, comparator, unit, final, text = latest
        out["v_csf_tumor_analysis_latest"].append(
            ident + ["structured_lab" if tier == "structured" else "pathology_report", tier, family, test, p.date(last), last,
                     "Positive" if positive else "Negative", 0, display, value, comparator, unit, final, text,
                     1 + (review is not None), total, p.date(first), first, len(families), ";".join(families)])

    if rng.random() < 0.9:
        day = max(dx + 1, end - rng.randrange(0, 90))
        lansky = day < 16 * 365.25
        score = rng.choice([30, 40, 50, 60]) if dying else rng.choice([60, 70, 80]) if on_chemo(day) else rng.choice([80, 90, 90, 100, 100])
        scale = "Lansky" if lansky else "Karnofsky"
        out["v_lansky_karnofsky_latest"].append(
            ident + [scale, score, p.date(day), day, f"{score} - {(LANSKY if lansky else KARNOFSKY)[score]}", "LPS" if lansky else "KPS",
                     "Lansky Play-Performance Scale" if lansky else "Karnofsky Performance Status", f"{scale}: {score}",
                     "observation" if rng.random() < 0.8 else "encounter"])
    return out
