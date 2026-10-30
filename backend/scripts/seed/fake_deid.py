"""Fake stand-ins for the de-identified PCX 3.0 release CSVs (the pcx_30_*_deid tables).

The real CSVs come from the RADIANT-Timeline-Abstraction team; until they arrive this writes files with exactly their
columns (pcx_demo_table_sql_objects/data_dictionary/data_dictionary_table.sql), values and unknown-value conventions,
so build_seed.py can be developed against the real format. No PHI: research ids, organization names, birth years,
ages in days, de-identified postal codes.

  python3 fake_deid.py            # writes data/deid/pcx_30_*_deid.csv
"""
import csv, datetime as dt, hashlib, os, random

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "data", "deid")
TODAY = dt.date(2026, 10, 1)
rng = random.Random(30)

# Names exactly as in organization_ref.csv: the real views map organization_name to its code through that table.
CHOP, SCH, LCH = "The Children's Hospital of Philadelphia", "Seattle Children's Hospital", "Lurie Children's Hospital"
BCH, CNMC, OHSU = "UCSF Benioff Children's Hospital", "Children's National Medical Center (CNMC)", "OHSU Doernbecher Children's Hospital"
PROVIDERS = [(CHOP, 40), (SCH, 15), (LCH, 12), (BCH, 12), (CNMC, 11), (OHSU, 10)]
ZIP3 = {CHOP: ["191", "190", "080", "194"], SCH: ["981", "980", "983"], LCH: ["606", "600", "604"],
        BCH: ["941", "945", "946"], CNMC: ["200", "208", "220"], OHSU: ["972", "970", "973"]}
RESTRICTED_ZIP3 = {"036", "059", "102", "203", "556", "692", "790", "821", "823", "830", "831", "878", "879", "884", "890", "893"}

ATRT_COHORT = ATRT_CATEGORY = "Atypical teratoid/rhabdoid tumor"
# (diagnosis_type_cohort, cns_diagnosis_category, cns_integrated_diagnosis, tumor_locations)
PROFILES = {
    "ATRT_TYR": (ATRT_COHORT, ATRT_CATEGORY, "ATRT-TYR", "Cerebellum/Posterior Fossa"),
    "ATRT_SHH": (ATRT_COHORT, ATRT_CATEGORY, "ATRT-SHH", "Frontal Lobe;Ventricles"),
    "ATRT_MYC": (ATRT_COHORT, ATRT_CATEGORY, "ATRT-MYC", "Temporal Lobe"),
    "ATRT_NOS": (ATRT_COHORT, ATRT_CATEGORY, "ATRT, NOS or NEC", "Brain Stem- Pons"),
    "MB_SHH": ("Medulloblastoma", "Embryonal tumor", "Medulloblastoma, SHH-activated and TP53-wildtype", "Cerebellum/Posterior Fossa"),
    "MB_G4": ("Medulloblastoma", "Embryonal tumor", "Medulloblastoma, non-WNT/non-SHH, group 4", "Cerebellum/Posterior Fossa;Ventricles"),
    "MB_G3": ("Medulloblastoma", "Embryonal tumor", "Medulloblastoma, non-WNT/non-SHH, group 3", "Cerebellum/Posterior Fossa"),
    "MB_WNT": ("Medulloblastoma", "Embryonal tumor", "Medulloblastoma, WNT-activated", "Cerebellum/Posterior Fossa;Brain Stem-Medulla"),
    "LGG": ("Low-grade glioma", "Low-grade glioma", "Pilocytic astrocytoma, KIAA1549::BRAF fusion", "Cerebellum/Posterior Fossa"),
    "LGG_OPT": ("Low-grade glioma", "Low-grade glioma", "Pilocytic astrocytoma, BRAF V600E-mutant", "Optic Pathway;Suprasellar/Hypothalamic/Pituitary"),
    "HGG": ("High-grade glioma", "High-grade glioma", "Diffuse midline glioma, H3 K27-altered", "Brain Stem-Pons"),
    "EPN_PF": ("Ependymoma", "Ependymal tumor", "Posterior fossa group A (PFA) ependymoma", "Cerebellum/Posterior Fossa;Ventricles"),
    "EPN_ST": ("Ependymoma", "Ependymal tumor", "Supratentorial ependymoma, ZFTA fusion-positive", "Frontal Lobe"),
}
ATRT = [k for k in PROFILES if k.startswith("ATRT")]
OPENPEDCAN_SUBTYPES = ["ATRT-SHH", "ATRT-TYR", "ATRT-MYC"]

# Hand-written patients with stable research ids: the long timelines and the edge cases of the data dictionary.
# radiant=True: in the RADIANT cohort, so build_seed.py also makes them portal patients with cases.
SHOWCASE = [
    dict(rid="PCX30-0001", org=CHOP, prof="ATRT_SHH", born=2019, dx=900, radiant=True),
    dict(rid="PCX30-0002", org=CHOP, prof="ATRT_TYR", born=2021, dx=250, radiant=True),
    dict(rid="PCX30-0003", org=SCH, prof="HGG", born=2014, dx=3650, events=[("Progressive", 290)], deceased=520, radiant=True),
    dict(rid="PCX30-0004", org=CHOP, prof="EPN_PF", born=2006, dx=1500, radiant=True,
         events=[("Recurrence", 1400), ("Progressive", 2100), ("Recurrence", 2900), ("Progressive", 3500)]),
    dict(rid="PCX30-0005", org=LCH, prof="ATRT_MYC", born=2017, dx=1400, meta=True, radiant=True),
    dict(rid="PCX30-0006", org=BCH, prof="LGG", born=2009, dx=2000, zip_missing=True, events=[("Not Reported", 400), ("Progressive", 900)]),
    dict(rid="PCX30-0007", org=CNMC, prof="ATRT_TYR", born=2020, dx=500, events=[("Recurrence", 420)], radiant=True),
    dict(rid="PCX30-0008", org=CHOP, prof="ATRT_NOS", born=2021, dx=400, vital_unknown=True, radiant=True),
    dict(rid="PCX30-0009", org=SCH, prof="ATRT_SHH", born=2020, dx=700, no_rt=True),
    dict(rid="PCX30-0010", org=CHOP, prof="ATRT_NOS", born=2012, dx=2800, events=[("Progressive", 250)], deceased=380, radiant=True),
    dict(rid="PCX30-0011", org=OHSU, prof="MB_WNT", born=2009, dx=3300, gender="not reported", events=[("Unavailable", 1500)]),
    dict(rid="PCX30-0012", org=BCH, prof="LGG_OPT", born=2015, dx=900, surgery_unknown=True, radiant=True),
    dict(rid="PCX30-0013", org=LCH, prof="EPN_ST", born=2011, dx=2000, events=[("Second Malignancy", 2600)], regimen_unknown=True),
    dict(rid="PCX30-0014", org=CNMC, prof="ATRT_TYR", born=2017, dx=250, deceased=500, radiant=True),
    dict(rid="PCX30-0015", org=CHOP, prof="MB_G3", born=2011, dx=2200, events=[("Recurrence", 700), ("Progressive", 1000)],
         meta=True, deceased=1250, radiant=True),
]

ENROLLED = "Treatment follows a protocol and subject is enrolled"
NOT_ENROLLED = "Treatment follows a protocol but subject is not enrolled"
SOC = "Treatment follows other standard of care, not associated with a protocol"
RACES = [("White", 64), ("Black or African American", 10), ("Asian", 9), ("More Than One Race", 4),
         ("American Indian or Alaska Native", 1), ("Not Reported", 12)]
ETHNICITIES = [("Not Hispanic or Latino", 80), ("Hispanic or Latino", 13), ("Not Reported", 7)]


def weighted(pairs):
    return rng.choices([v for v, _ in pairs], weights=[w for _, w in pairs])[0]


def plan(p):
    """Surgeries, regimens and radiation courses (ages in days), reacting to every relapse."""
    k, dx = p["prof"], p["dx"]
    relapses = [o for et, o in p["events"] if et in ("Recurrence", "Progressive")]
    s, c, r = [], [], []
    if k.startswith("ATRT"):
        s.append((dx + 2, p.get("extent", "Gross/Near total resection")))
        if dx < 1095:
            c.append(("ACNS0333", ENROLLED, dx + 21, dx + 150, "Methotrexate;Vincristine;Etoposide;Cyclophosphamide;Cisplatin"))
            if p.get("no_rt"):
                c.append(("ACNS0333", ENROLLED, dx + 170, dx + 260, "Carboplatin;Thiotepa"))
            elif dx >= 365:
                r.append((dx + 160, dx + 200, "Focal/Tumor bed", "Protons", None, "5400"))
                c.append(("ACNS0333", ENROLLED, dx + 215, dx + 305, "Carboplatin;Thiotepa"))
            else:
                c.append(("ACNS0333", ENROLLED, dx + 165, dx + 255, "Carboplatin;Thiotepa"))
                r.append((dx + 280, dx + 320, "Focal/Tumor bed", "Protons", None, "5040"))
        else:
            if p.get("meta"):
                r.append((dx + 35, dx + 80, "Craniospinal with focal boost", "Protons", "3600", "5400"))
            else:
                r.append((dx + 35, dx + 77, "Focal/Tumor bed", "Protons", None, "5400"))
            c.append(("DFCI Modified IRS-III", p.get("ctype", ENROLLED), dx + 14, dx + 365,
                      "Vincristine;Dactinomycin;Cyclophosphamide;Doxorubicin;Cisplatin;Temozolomide;Methotrexate"))
        for i, off in enumerate(relapses):
            if i == 0:
                if off % 2:
                    s.append((dx + off + 6, "Partial resection"))
                c.append(("MEMMAT", NOT_ENROLLED, dx + off + 20, dx + off + 380,
                          "Bevacizumab;Thalidomide;Celecoxib;Fenofibrate;Etoposide;Cyclophosphamide;Methotrexate"))
            elif i == 1:
                c.append(("APEC1621", ENROLLED, dx + off + 14, dx + off + 200, "Tazemetostat"))
            else:
                c.append(("Not Applicable", SOC, dx + off + 14, dx + off + 120, "Etoposide"))
    elif k.startswith("MB"):
        s.append((dx + 1, "Gross/Near total resection"))
        proto = "ACNS0332: Arm C" if p.get("meta") else "ACNS0331: Arm A"
        r.append((dx + 30, dx + 72, "Craniospinal with focal boost", "Protons", "3600" if p.get("meta") else "2340", "5400"))
        c.append((proto, ENROLLED, dx + 30, dx + 72, "Vincristine"))
        c.append((proto, ENROLLED, dx + 110, dx + 330, "Cisplatin;Cyclophosphamide;Vincristine;Lomustine"))
        for i, off in enumerate(relapses):
            if i == 0:
                r.append((dx + off + 21, dx + off + 42, "Spine", "Photons", None, "3060"))
                c.append(("Not Applicable", SOC, dx + off + 21, dx + off + 200, "Temozolomide;Irinotecan"))
            else:
                c.append(("Not Applicable", SOC, dx + off + 14, dx + off + 180, "Bevacizumab;Irinotecan;Temozolomide"))
    elif k.startswith("LGG"):
        s.append((-1 if p.get("surgery_unknown") else dx + 3, "Partial resection" if k == "LGG_OPT" else "Gross/Near total resection"))
        if k == "LGG_OPT":
            c.append(("Not Applicable", SOC, dx + 40, dx + 400, "Dabrafenib;Trametinib"))
        for off in relapses[:1]:
            c.append(("ACNS0223", NOT_ENROLLED, dx + off + 20, dx + off + 420, "Carboplatin;Vincristine"))
    elif k == "HGG":
        s.append((dx + 1, "Biopsy only"))
        r.append((dx + 14, dx + 56, "Focal/Tumor bed", "Photons", None, "5400"))
        c.append(("Not Applicable", SOC, dx + 14, dx + 240, "Temozolomide"))
        for off in relapses[:1]:
            r.append((dx + off + 20, dx + off + 34, "Focal/Tumor bed", "Photons", None, "2400"))
            c.append(("Not Applicable", SOC, dx + off + 20, dx + off + 120, "ONC201"))
    elif k.startswith("EPN"):
        s.append((dx + 2, "Gross/Near total resection"))
        r.append((dx + 35, dx + 77, "Focal/Tumor bed", "Protons", None, "5940"))
        for i, off in enumerate(relapses):
            if i == 0:
                s.append((dx + off + 5, "Partial resection"))
                r.append((dx + off + 40, dx + off + 70, "Focal/Tumor bed", "Protons", None, "5400"))
            elif i % 2:
                c.append(("Not Applicable", SOC, dx + off + 14, dx + off + 380, "Bevacizumab;Irinotecan"))
            else:
                s.append((dx + off + 6, "Gross/Near total resection"))
                c.append(("Not Applicable", SOC, dx + off + 30, dx + off + 400, "Etoposide"))
        if p.get("regimen_unknown"):
            c.append(("ACNS0831: Arm 2", ENROLLED, "Not Reported", "Not Reported", "Vincristine;Carboplatin;Cyclophosphamide;Etoposide"))
    for et, off in p["events"]:
        if et == "Second Malignancy":
            s.append((dx + off + 10, "Gross/Near total resection"))
            r.append((dx + off + 30, dx + off + 72, "Focal/Tumor bed", "Photons", None, "5400"))
            c.append(("Not Applicable", SOC, dx + off + 30, dx + off + 250, "Temozolomide"))
    return s, c, r


def random_patient(i):
    org = weighted(PROVIDERS)
    atrt = rng.random() < 0.85
    p = dict(rid=f"PCX30-{i:04d}", org=org)
    if atrt:
        p["prof"] = rng.choice(ATRT)
        p["dx"] = weighted([(rng.randrange(60, 1095), 60), (rng.randrange(1095, 2920), 30), (rng.randrange(2920, 5475), 10)])
        p["meta"] = rng.random() < 0.25
    else:
        p["prof"], p["dx"] = rng.choice(["MB_SHH", "MB_G4", "LGG", "EPN_PF", "HGG"]), rng.randrange(1000, 5000)
    dies = rng.random() < (0.45 if atrt else 0.15)
    death = rng.randrange(200, 1100)
    events = []
    if dies:
        if rng.random() < 0.7:
            events.append((rng.choice(["Progressive", "Recurrence"]), rng.randrange(120, death - 60)))
        p["deceased"] = death
    elif rng.random() < 0.3:
        events.append(("Recurrence", rng.randrange(300, 1500)))
    p["events"] = events
    span = p["dx"] + max([o for _, o in events] + [p.get("deceased", 0)]) + 120
    latest = (TODAY - dt.timedelta(days=span)).year
    p["born"] = rng.randrange(min(2006, latest - 1), latest + 1)
    if rng.random() < 0.3:
        p["extent"] = rng.choice(["Partial resection", "Biopsy only"])
    if not events and atrt and rng.random() < 0.2:
        p["ctype"] = NOT_ENROLLED
    p["radiant"] = rng.random() < 0.4
    p["no_record"] = rng.random() < 0.05
    return p


def initial_flag(age, dx, first_event):
    """is_initial_treatment as the base views compute it: start age between the initial diagnosis and the first
    subsequent event, both inclusive; 'no' also covers an unknown age (-1 or a sentinel string)."""
    return "yes" if isinstance(age, int) and age >= 0 and dx <= age <= (first_event if first_event is not None else 100000) else "no"


def split_protocol(value):
    name, sep, arm = value.partition(":")
    return (name.strip(), arm.strip()) if sep else (value, "Not Applicable")


def hashed(*key):
    return int(hashlib.md5("/".join(map(str, key)).encode()).hexdigest()[:8], 16)


def deid_zip(org, rid, missing):
    if missing:
        return "XXXXX"
    head = ZIP3[org][hashed("zip", rid) % len(ZIP3[org])]
    return "XXXXX" if head in RESTRICTED_ZIP3 else head + "XX"


def fit_birth_year(p, demo_row, ages):
    """Every age, counted from any day of the birth year, must fall before today."""
    oldest = max(a for a in ages if isinstance(a, int))
    latest = (TODAY - dt.timedelta(days=oldest)).year - 1
    if p["born"] > latest:
        p["born"] = demo_row[4] = latest


def unknown_if(cond, value, sentinel):
    return sentinel if cond else value


patients = SHOWCASE + [random_patient(i) for i in range(len(SHOWCASE) + 1, 121)]
tables = {k: [] for k in ["demographics", "event_level", "medical_therapy_level", "patient_level", "radiation_level",
                          "surgery_level", "treatment_summary"]}

for p in patients:
    p.setdefault("events", [])
    rid, org = p["rid"], p["org"]
    gender = p.get("gender") or rng.choice(["female", "male"])
    if hashed("gender", rid) % 100 < 4 and "gender" not in p:
        gender = "not available"
    cohort = None if p.get("no_record") else PROFILES[p["prof"]][0]
    tables["demographics"].append([org, rid, f"{rid}_given_name", f"{rid}_family_name", p["born"], weighted(RACES), weighted(ETHNICITIES),
                                   gender, deid_zip(org, rid, p.get("zip_missing") or hashed("nozip", rid) % 100 < 5),
                                   cohort, "radiant" if p.get("radiant") else "cbtn-non-radiant"])
    demo_row = tables["demographics"][-1]
    if p.get("no_record"):
        vital_age = 30 + hashed("vital", rid) % 3000
        tables["patient_level"].append([rid, None if p.get("vital_unknown") else vital_age, "alive"])
        fit_birth_year(p, demo_row, [vital_age])
        continue

    dx = p["dx"]
    _, cat, integ, loc = PROFILES[p["prof"]]
    if p["prof"] == "ATRT_NOS" and rid != "PCX30-0008":
        integ, source = OPENPEDCAN_SUBTYPES[hashed("opc", rid) % 3], "OpenPedCan"
    else:
        source = "CBTN"
    meta = "Yes" if p.get("meta") else "No"
    events = [("Initial CNS Tumor", dx, meta, "Spine;Leptomeningeal" if p.get("meta") else "Not Applicable")]
    for et, off in p["events"]:
        spread = et == "Recurrence" and p.get("meta")
        events.append((et, dx + off, "Yes" if spread else ("Not Reported" if et in ("Unavailable", "Not Reported") else "No"),
                       "Spine" if spread else "Not Applicable"))
    if p.get("deceased"):
        events.append(("Deceased", dx + p["deceased"], "Not Applicable", "Not Applicable"))
    for et, age, m, ml in events:
        loc_other = None
        ecat, einteg, esource, eloc = cat, integ, source, loc
        if et == "Second Malignancy":
            ecat, einteg, esource = "High-grade glioma", "Diffuse pediatric-type high-grade glioma, H3-wildtype and IDH-wildtype", "CBTN"
            eloc, loc_other = "Other locations NOS", "Right parietal lobe, within prior radiation field"
        elif et in ("Deceased", "Unavailable", "Not Reported"):
            eloc = "Not Applicable"
        tables["event_level"].append([org, rid, et, age, m, ml, None, ecat, einteg, esource, eloc, loc_other])

    first_event = min([a for et, a, *_ in events if et not in ("Initial CNS Tumor", "Unavailable", "Not Reported")], default=None)
    surgeries, regimens, radiations = plan(p)
    for age, extent in surgeries:
        tables["surgery_level"].append([org, rid, age, extent, initial_flag(age, dx, first_event)])
    for proto, ctype, start, stop, agents in regimens:
        tables["medical_therapy_level"].append([org, rid, proto, *split_protocol(proto), ctype, start, stop, agents,
                                                initial_flag(start, dx, first_event)])
    rad_starts = []
    for i, (start, stop, site, rtype, csi, focal) in enumerate(radiations):
        # About a third of the real radiation starts are 'Not Available': the course exists, its date does not.
        unknown = hashed("rad", rid, i) % 100 < 15
        unit = "CGE" if rtype == "Protons" else "cGy"
        if hashed("gy", rid, i) % 100 < 15:
            csi, focal, unit = (str(int(csi) / 100) if csi else None), str(int(focal) / 100), "Gy"
        start_v = unknown_if(unknown, start, "Not Available")
        rad_starts.append(start_v)
        tables["radiation_level"].append([org, rid, start_v, unknown_if(unknown, stop, "Not Available"), site, None, rtype, None,
                                          csi or "Not Applicable", unit if csi else "Not Applicable", focal, unit,
                                          initial_flag(start_v, dx, first_event)])

    end = dx + (p["deceased"] if p.get("deceased") else max([o for _, o in p["events"]] + [0]) + 30 + hashed("fu", rid) % 900)
    vital = "deceased" if p.get("deceased") else "alive"
    tables["patient_level"].append([rid, None if p.get("vital_unknown") else end, vital])

    started = [(s, a) for _, _, s, _, a in regimens if isinstance(s, int)]
    first_rad_ever = min([s for s in rad_starts if isinstance(s, int)], default=None)
    initial_rad = min([s for s in rad_starts if initial_flag(s, dx, first_event) == "yes"], default=None)
    first_chemo_ever = min([s for s, _ in started], default=None)
    initial_chemo = min([s for s, _ in started if initial_flag(s, dx, first_event) == "yes"], default=None)
    first_mtx_ever = min([s for s, a in started if "methotrexate" in a.lower()], default=None)
    had_mtx = any(initial_flag(s, dx, first_event) == "yes" for s, a in started if "methotrexate" in a.lower())
    had_rad, had_chemo = initial_rad is not None, initial_chemo is not None
    if had_rad and had_chemo:
        order = ("radiation_before_chemotherapy" if initial_rad < initial_chemo else
                 "chemo_before_radiation" if initial_chemo < initial_rad else "radiation_and_chemo_same_day")
    else:
        order = ("chemo_only_no_initial_radiation" if had_chemo else
                 "radiation_only_no_initial_chemo" if had_rad else "no_initial_radiation_or_chemo")
    yes_no = lambda flag: "yes" if flag else "no"
    fit_birth_year(p, demo_row, [a for _, a, *_ in events] + [a for a, _ in surgeries] + [end]
                   + [x for _, _, a, b, _ in regimens for x in (a, b)] + [x for a, b, *_ in radiations for x in (a, b)])
    tables["treatment_summary"].append([rid, org, dx, -1 if first_event is None else first_event, first_rad_ever, initial_rad,
                                        first_chemo_ever, initial_chemo, first_mtx_ever,
                                        yes_no(had_rad), yes_no(had_chemo), yes_no(had_mtx), order])

HEADERS = {
    "demographics": ["organization_name", "research_id", "given_name", "family_name", "birth_year", "race", "ethnicity", "gender",
                     "address_postal_code", "diagnosis_type_cohort", "data_type_cohort"],
    "event_level": ["organization_name", "research_id", "event_type", "age_at_event_days", "metastasis", "metastasis_location",
                    "metastasis_location_other", "cns_diagnosis_category", "cns_integrated_diagnosis", "cns_integrated_diagnosis_source",
                    "tumor_locations", "tumor_location_other"],
    "medical_therapy_level": ["organization_name", "research_id", "protocol_name_and_arm", "protocol_name", "protocol_arm",
                              "chemotherapy_type", "age_at_regimen_start_days", "age_at_regimen_stop_days", "chemotherapy_agents",
                              "is_initial_treatment"],
    "patient_level": ["research_id", "age_at_vital_status_days", "vital_status"],
    "radiation_level": ["organization_name", "research_id", "age_at_radiation_start_days", "age_at_radiation_stop_days", "radiation_site",
                        "radiation_site_other", "radiation_type", "radiation_type_other", "total_radiation_dose",
                        "total_radiation_dose_unit", "total_radiation_dose_focal", "total_radiation_dose_focal_unit", "is_initial_treatment"],
    "surgery_level": ["organization_name", "research_id", "age_at_surgery_days", "extent_of_tumor_resection", "is_initial_treatment"],
    "treatment_summary": ["research_id", "organization_name", "age_at_initial_dx_days", "age_at_first_event_days",
                          "age_at_first_radiation_ever_days", "age_at_initial_radiation_days", "age_at_first_chemo_ever_days",
                          "age_at_initial_chemo_days", "age_at_first_methotrexate_ever_days", "had_initial_radiation", "had_initial_chemo",
                          "had_initial_methotrexate", "initial_treatment_order"],
}

os.makedirs(OUT, exist_ok=True)
for name, rows in tables.items():
    with open(os.path.join(OUT, f"pcx_30_{name}_deid.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(HEADERS[name])
        for r in rows:
            assert len(r) == len(HEADERS[name]), (name, r)
            w.writerow(["" if v is None else v for v in r])
print({k: len(v) for k, v in tables.items()})
