"""Portal side of the seed: the RADIANT patients of the PCX cohort as portal patients, with cases and variants.

Every PCX patient whose data_type_cohort is 'radiant' and who has a diagnosis gets:
  * a somatic case: tumor (solid_tissue) + normal (blood) sequencing, radiant_somatic_annotation over both,
    tumor_only_variant_calling on the tumor;
  * a germline case on the same normal sequencing: alignment_germline_variant_calling + radiant_germline_annotation.
Somatic drivers follow the diagnosis (ATRT -> SMARCB1, LGG -> BRAF V600E, HGG -> H3 K27M, ...); some patients carry a
germline predisposition variant (SMARCB1, TP53, ELP1, SUFU). Joins follow what the API reads (see README): every
occurrence has its snv__variant row and a picked consequence, every sequencing has its staging row with the same part.
Coordinates are GRCh38-like and the transcripts are MANE-like, but this is fake data: never read a variant as real.
"""
import datetime as dt, hashlib, random

import pcx

PART = 1
CREATED = dt.datetime(2026, 3, 2, 9, 0)

# symbol: (chromosome, start, end, gene_id, transcript, strand, description)
GENES = {
    "SMARCB1": ("22", 23786931, 23838008, "ENSG00000099956", "ENST00000644036", "+", "SWI/SNF related BAF chromatin remodeling complex subunit B1"),
    "SMARCA4": ("19", 10960932, 11062276, "ENSG00000127616", "ENST00000646693", "+", "SWI/SNF related BAF chromatin remodeling complex subunit ATPase 4"),
    "TP53": ("17", 7661779, 7687538, "ENSG00000141510", "ENST00000269305", "-", "tumor protein p53"),
    "BRAF": ("7", 140719327, 140924929, "ENSG00000157764", "ENST00000646891", "-", "B-Raf proto-oncogene, serine/threonine kinase"),
    "H3-3A": ("1", 226061851, 226072019, "ENSG00000163041", "ENST00000366696", "+", "H3.3 histone A"),
    "PTCH1": ("9", 95442980, 95517057, "ENSG00000185920", "ENST00000331920", "-", "patched 1"),
    "SUFU": ("10", 102503986, 102633535, "ENSG00000107882", "ENST00000369902", "+", "SUFU negative regulator of hedgehog signaling"),
    "ELP1": ("9", 108867966, 108934232, "ENSG00000070061", "ENST00000374647", "-", "elongator acetyltransferase complex subunit 1"),
    "CTNNB1": ("3", 41194741, 41260096, "ENSG00000168036", "ENST00000349496", "+", "catenin beta 1"),
    "DDX3X": ("X", 41333348, 41364472, "ENSG00000215301", "ENST00000644876", "+", "DEAD-box helicase 3 X-linked"),
    "KMT2D": ("12", 49018975, 49060794, "ENSG00000167548", "ENST00000301067", "-", "lysine methyltransferase 2D"),
    "ATRX": ("X", 77504880, 77786233, "ENSG00000085224", "ENST00000373344", "-", "ATRX chromatin remodeler"),
    "NF1": ("17", 31094927, 31382116, "ENSG00000196712", "ENST00000358273", "+", "neurofibromin 1"),
    "FGFR1": ("8", 38411138, 38468834, "ENSG00000077782", "ENST00000447712", "-", "fibroblast growth factor receptor 1"),
    "PTEN": ("10", 87863113, 87971930, "ENSG00000171862", "ENST00000371953", "+", "phosphatase and tensin homolog"),
    "APC": ("5", 112707498, 112846239, "ENSG00000134982", "ENST00000257430", "+", "APC regulator of WNT signaling pathway"),
    "TTN": ("2", 178525989, 178830802, "ENSG00000155657", "ENST00000589042", "-", "titin"),
    "MUC16": ("19", 8848844, 8981342, "ENSG00000181143", "ENST00000397910", "-", "mucin 16, cell surface associated"),
    "LRP1B": ("2", 140231423, 142131016, "ENSG00000168702", "ENST00000389484", "-", "LDL receptor related protein 1B"),
    "CSMD1": ("8", 2935353, 4994914, "ENSG00000183117", "ENST00000635120", "-", "CUB and Sushi multiple domains 1"),
    "SYNE1": ("6", 152121687, 152637801, "ENSG00000131018", "ENST00000367255", "-", "spectrin repeat containing nuclear envelope protein 1"),
    "RYR2": ("1", 237042205, 237833988, "ENSG00000198626", "ENST00000366574", "+", "ryanodine receptor 2"),
    "FLG": ("1", 152302175, 152325239, "ENSG00000143631", "ENST00000368799", "-", "filaggrin"),
    "OBSCN": ("1", 228208132, 228378874, "ENSG00000154358", "ENST00000570156", "+", "obscurin, cytoskeletal calmodulin and titin-interacting RhoGEF"),
}
BACKGROUND = ["TTN", "MUC16", "LRP1B", "CSMD1", "SYNE1", "RYR2", "FLG", "OBSCN", "KMT2D", "APC", "NF1", "SMARCA4", "PTEN", "FGFR1", "ATRX"]

# Named variants: (key, symbol, pos, ref, alt, consequence, impact, aa_change, hgvsc, clinvar, gnomad_af, rs, hotspot)
NAMED = [
    ("SMARCB1_R40X", "SMARCB1", 23787208, "C", "T", "stop_gained", "HIGH", "p.Arg40Ter", "c.118C>T", "Pathogenic", None, "rs121907898", False),
    ("SMARCB1_Q318X", "SMARCB1", 23834186, "C", "T", "stop_gained", "HIGH", "p.Gln318Ter", "c.952C>T", "Pathogenic", None, None, False),
    ("SMARCB1_R377H", "SMARCB1", 23837665, "G", "A", "missense_variant", "MODERATE", "p.Arg377His", "c.1130G>A", "Likely pathogenic", None, None, False),
    ("TP53_R248Q", "TP53", 7674220, "C", "T", "missense_variant", "MODERATE", "p.Arg248Gln", "c.743G>A", "Pathogenic", 0.0000066, "rs11540652", True),
    ("TP53_R273H", "TP53", 7673802, "C", "T", "missense_variant", "MODERATE", "p.Arg273His", "c.818G>A", "Pathogenic", None, "rs28934576", True),
    ("BRAF_V600E", "BRAF", 140753336, "A", "T", "missense_variant", "MODERATE", "p.Val600Glu", "c.1799T>A", "Pathogenic", None, "rs113488022", True),
    ("H3_K28M", "H3-3A", 226064434, "A", "T", "missense_variant", "MODERATE", "p.Lys28Met", "c.83A>T", "Pathogenic", None, "rs1057519902", True),
    ("PTCH1_TRUNC", "PTCH1", 95485834, "G", "A", "stop_gained", "HIGH", "p.Arg1132Ter", "c.3394C>T", "Pathogenic", None, None, False),
    ("SUFU_TRUNC", "SUFU", 102506312, "C", "T", "stop_gained", "HIGH", "p.Arg123Ter", "c.367C>T", "Pathogenic", None, None, False),
    ("ELP1_TRUNC", "ELP1", 108899816, "G", "A", "stop_gained", "HIGH", "p.Arg696Ter", "c.2086C>T", "Likely pathogenic", 0.00012, None, False),
    ("CTNNB1_S33C", "CTNNB1", 41224610, "C", "G", "missense_variant", "MODERATE", "p.Ser33Cys", "c.98C>G", "Pathogenic", None, "rs121913400", True),
    ("DDX3X_R534H", "DDX3X", 41346638, "G", "A", "missense_variant", "MODERATE", "p.Arg534His", "c.1601G>A", "Likely pathogenic", None, None, True),
    ("KMT2D_TRUNC", "KMT2D", 49031203, "G", "A", "stop_gained", "HIGH", "p.Arg2635Ter", "c.7903C>T", "Pathogenic", None, None, False),
    ("ATRX_TRUNC", "ATRX", 77682500, "G", "A", "stop_gained", "HIGH", "p.Arg1426Ter", "c.4276C>T", "Pathogenic", None, None, False),
    ("FGFR1_N546K", "FGFR1", 38417331, "G", "T", "missense_variant", "MODERATE", "p.Asn546Lys", "c.1638C>A", "Likely pathogenic", None, "rs779707422", True),
]
IMPACT = {"HIGH": 4, "MODERATE": 3, "LOW": 2, "MODIFIER": 1}
AA3 = ["Ala", "Arg", "Asn", "Asp", "Cys", "Gln", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"]
CHROM_N = {**{str(i): i for i in range(1, 23)}, "X": 23, "Y": 24}

# Somatic drivers and germline predisposition by diagnosis (from the PCX initial event).
SOMATIC_DRIVERS = [
    ("ATRT", ["SMARCB1_R40X", "SMARCB1_Q318X"]), ("Medulloblastoma, SHH", ["PTCH1_TRUNC", "TP53_R273H"]),
    ("Medulloblastoma, WNT", ["CTNNB1_S33C", "DDX3X_R534H"]), ("Medulloblastoma, non-WNT", ["KMT2D_TRUNC", "DDX3X_R534H"]),
    ("BRAF V600E", ["BRAF_V600E"]), ("KIAA1549::BRAF", ["FGFR1_N546K"]), ("H3 K27", ["H3_K28M", "TP53_R248Q", "ATRX_TRUNC"]),
    ("ependymoma", []),
]
PREDISPOSITION = [("ATRT", "SMARCB1_R377H", 0.3), ("Medulloblastoma, SHH", "ELP1_TRUNC", 0.3), ("Medulloblastoma, SHH", "SUFU_TRUNC", 0.15),
                  ("H3 K27", "TP53_R248Q", 0.15)]
# Somatic copy-number drivers: (symbol(s), chromosome, start, end, type, cn, cytoband)
SOMATIC_CNV = [
    ("ATRT", (["SMARCB1"], "22", 23700000, 23900000, "LOSS", 0, ["q11.23"])),
    ("Medulloblastoma, non-WNT", (["TP53", "NF1"], "17", 1, 25000000, "LOSS", 1, ["p13.1", "p11.2"])),
    ("KIAA1549::BRAF", (["BRAF"], "7", 138800000, 140800000, "GAIN", 3, ["q34"])),
    ("H3 K27", (["PTEN"], "10", 87000000, 89000000, "LOSS", 1, ["q23.31"])),
]
MONDO = {"ATRT": ("MONDO:0020560", "atypical teratoid/rhabdoid tumor"), "Medulloblastoma": ("MONDO:0007959", "medulloblastoma"),
         "astrocytoma": ("MONDO:0016691", "pilocytic astrocytoma"), "glioma": ("MONDO:0002816", "diffuse midline glioma, H3 K27-altered"),
         "ependymoma": ("MONDO:0016698", "ependymoma")}
EXTRA_MONDO = [("MONDO:0012583", "rhabdoid tumor predisposition syndrome 1"), ("MONDO:0018875", "Li-Fraumeni syndrome"),
               ("MONDO:0700092", "neurodevelopmental disorder")]
HPO = [("HP:0002664", "Neoplasm"), ("HP:0002315", "Headache"), ("HP:0002013", "Vomiting"), ("HP:0001251", "Ataxia"),
       ("HP:0000238", "Hydrocephalus"), ("HP:0001250", "Seizure"), ("HP:0000639", "Nystagmus"), ("HP:0001263", "Global developmental delay")]
# Phenotypes of the prenatal examples: the parents' own signs and the fetuses' ultrasound findings.
PRENATAL_HPO = [("HP:0009800", "Maternal diabetes"), ("HP:0100622", "Maternal seizure"), ("HP:0000479", "Abnormal retinal morphology"),
                ("HP:0010818", "Generalized tonic seizure"), ("HP:0010819", "Atonic seizure"), ("HP:0001561", "Polyhydramnios"),
                ("HP:0001562", "Oligohydramnios"), ("HP:0010519", "Increased fetal movement"),
                ("HP:0000003", "Multicystic kidney dysplasia"), ("HP:0012443", "Abnormal brain morphology"),
                ("HP:0004325", "Decreased body weight"), ("HP:0007068", "Inferior cerebellar vermis hypoplasia"),
                ("HP:0002011", "Morphological central nervous system abnormality")]
# The exams of the prenatal examples, with the codes and labels of the QLIN catalog (scripts/init-sql/qlin/exam.sql).
EXAMS = [("irmc", "Cerebral MRI", "IRM cérébrale"), ("opht", "Ophthalmological Examination", "Examen ophtalmologique")]
OMIM = [("SMARCB1", "Rhabdoid tumor predisposition syndrome 1", "601607", "609322", ["AD"], ["Autosomal dominant"]),
        ("TP53", "Li-Fraumeni syndrome", "191170", "151623", ["AD"], ["Autosomal dominant"]),
        ("SUFU", "Medulloblastoma, desmoplastic", "607035", "155255", ["AD"], ["Autosomal dominant"]),
        ("PTCH1", "Basal cell nevus syndrome 1", "601309", "109400", ["AD"], ["Autosomal dominant"]),
        ("APC", "Familial adenomatous polyposis 1", "611731", "175100", ["AD"], ["Autosomal dominant"]),
        ("NF1", "Neurofibromatosis, type 1", "613113", "162200", ["AD"], ["Autosomal dominant"])]
CYTOBANDS = [("22", "q11.23", 23100000, 25500000), ("17", "p13.1", 7200000, 10700000), ("17", "p11.2", 16100000, 22700000),
             ("7", "q34", 138500000, 143400000), ("10", "q23.31", 87200000, 89300000), ("2", "q31.2", 177000000, 180600000),
             ("1", "q42.13", 226000000, 227400000), ("19", "p13.2", 6900000, 12600000)]


def h(*key):
    return int(hashlib.md5("/".join(map(str, key)).encode()).hexdigest()[:12], 16)


class Variant:
    def __init__(self, symbol, pos, ref, alt, consequence, impact, aa, hgvsc, clinvar=None, af=None, rs=None, hotspot=False):
        chrom = GENES[symbol][0]
        self.symbol, self.chrom, self.pos, self.ref, self.alt = symbol, chrom, pos, ref, alt
        self.locus_id = CHROM_N[chrom] * 10**12 + pos * 10 + "ACGT".index(alt[0])
        self.consequence, self.impact, self.aa, self.hgvsc = consequence, impact, aa, hgvsc
        self.clinvar, self.af, self.rs, self.hotspot = clinvar, af, rs, hotspot
        self.transcript = GENES[symbol][4]
        self.real = None
        self.germline_seqs, self.somatic_seqs = set(), set()

    @classmethod
    def from_export(cls, r):
        """A real locus of the environment (read_loci): its id and annotation are kept as they are."""
        v = cls.__new__(cls)
        v.symbol, v.chrom, v.pos, v.ref, v.alt = r["symbol"], r["chr"], int(r["start"]), r["ref"], r["alt"]
        v.locus_id = int(r["locus_id"])
        v.consequence, v.impact, v.aa, v.hgvsc = r["consequence"], r["vep_impact"] or "MODIFIER", r["aa_change"], r["dna_change"]
        v.clinvar, v.rs, v.hotspot = r["clinvar"], r["rsnumber"], False
        v.af = float(r["af"]) if r["af"] else None
        v.transcript, v.real = r["transcript_id"], r
        v.germline_seqs, v.somatic_seqs = set(), set()
        return v

    @property
    def locus(self):
        return f"{self.chrom}-{self.pos}-{self.ref}-{self.alt}"


def mutate(rng, symbol, consequence):
    chrom, start, end, *_ = GENES[symbol]
    pos = rng.randrange(start + 500, end - 500)
    ref = rng.choice("ACGT")
    alt = rng.choice([b for b in "ACGT" if b != ref])
    codon = rng.randrange(20, 1500)
    if consequence == "missense_variant":
        a, b = rng.sample(AA3, 2)
        aa, impact = f"p.{a}{codon}{b}", "MODERATE"
    elif consequence == "synonymous_variant":
        a = rng.choice(AA3)
        aa, impact = f"p.{a}{codon}=", "LOW"
    elif consequence == "stop_gained":
        aa, impact = f"p.{rng.choice(AA3)}{codon}Ter", "HIGH"
    else:
        aa, impact = None, "MODIFIER"
    return Variant(symbol, pos, ref, alt, consequence, impact, aa, f"c.{codon * 3 - 2 + rng.randrange(3)}{ref}>{alt}")


def read_loci(path):
    """The loci export of sql/qa_loci_export.sql: mysql -B output (tab-separated), or the result table of an interactive
    mysql session copied into a file (| separated, +---+ borders). NULL is the string NULL in both."""
    with open(path, encoding="utf-8") as f:
        lines = [l.rstrip("\n") for l in f if l.strip() and not l.startswith("+")]
    if any(l.startswith("|") for l in lines):
        rows = [[c.strip() for c in l.strip().strip("|").split("|")] for l in lines if l.startswith("|")]
    else:
        rows = [l.split("\t") for l in lines]
    header = rows[0]
    return [dict(zip(header, (None if x == "NULL" else x for x in r))) for r in rows[1:] if r != header and len(r) == len(header)]


def match(diagnosis, table):
    return [v for k, v in table if k.lower() in (diagnosis or "").lower()]


class Genomics:
    def __init__(self, loci=None):
        rng = random.Random(4242)
        self.variants = {}
        self.named = {}
        self.pool = None
        if loci:
            self.use_real(rng, loci)
            return
        for key, symbol, pos, ref, alt, csq, impact, aa, hgvsc, clinvar, af, rs, hotspot in NAMED:
            v = Variant(symbol, pos, ref, alt, csq, impact, aa, hgvsc, clinvar, af, rs, hotspot)
            self.named[key] = self.variants[v.locus_id] = v
        # Common germline polymorphisms: carried by many probands, benign.
        self.common = []
        for i in range(70):
            v = mutate(rng, rng.choice(list(GENES)), rng.choice(["synonymous_variant", "intron_variant", "missense_variant", "intron_variant"]))
            v.af, v.rs = round(rng.uniform(0.02, 0.6), 4), f"rs{rng.randrange(1_000_000, 80_000_000)}"
            v.clinvar = rng.choice(["Benign", "Likely benign", None])
            self.common.append(self.variants.setdefault(v.locus_id, v))
        self.rng = rng

    def use_real(self, rng, loci):
        """Every variant is a real locus of the export, so the environment's own annotations apply to it."""
        self.pool = sorted((Variant.from_export(r) for r in loci), key=lambda v: v.locus_id)
        by_locus = {v.locus: v for v in self.pool}
        for key, symbol, pos, ref, alt, csq, *_, hotspot in NAMED:
            v = by_locus.get(f"{GENES[symbol][0]}-{pos}-{ref}-{alt}") or self.pick(rng, [symbol], [csq])
            v.hotspot = hotspot
            self.named[key] = self.variants.setdefault(v.locus_id, v)
        frequent = sorted((v for v in self.pool if v.af and v.af >= 0.01), key=lambda v: -v.af)[:70]
        rest = [v for v in self.pool if v not in frequent]
        self.common = [self.variants.setdefault(v.locus_id, v) for v in frequent + rng.sample(rest, max(0, 70 - len(frequent)))]
        self.rng = rng

    def pick(self, rng, symbols, consequences):
        in_genes = [v for v in self.pool if v.symbol in symbols]
        return rng.choice([v for v in in_genes if v.consequence in consequences] or in_genes or self.pool)

    def rare(self, rng, symbols, consequences):
        if self.pool:
            v = self.pick(rng, symbols, consequences)
            return self.variants.setdefault(v.locus_id, v)
        v = mutate(rng, rng.choice(symbols), rng.choice(consequences))
        v.af = rng.choice([None, None, round(rng.uniform(0.00001, 0.001), 6)])
        v.clinvar = rng.choice([None, None, "Uncertain significance"])
        return self.variants.setdefault(v.locus_id, v)


def germline_snv(rng, seq, task, v, hom, total, alt, exo, pathogenic, origin, transmission):
    """A germline__snv__occurrence row. origin None: no parent was sequenced, so the parental columns stay empty."""
    return [PART, seq, task, v.locus_id, round(alt / total, 3), rng.randrange(40, 99), total, total, total - alt, alt,
            "HOM" if hom else "HET", [1, 1] if hom else [0, 1], round(rng.uniform(200, 3000), 1), "PASS",
            round(rng.uniform(10, 30), 2),
            "AD" if exo else None,
            ("PATHOGENIC" if pathogenic else "UNCERTAIN_SIGNIFICANCE") if exo else None,
            (["PVS1", "PM2"] if pathogenic else ["PM2"]) if exo else None,
            round(rng.uniform(0.85, 0.99) if pathogenic else rng.uniform(0.3, 0.7), 3) if exo else None,
            round(rng.uniform(0.8, 0.98) if pathogenic else rng.uniform(0.2, 0.6), 3) if exo else None,
            origin, None if origin is None else "HET" if origin in ("father", "both") else "WT",
            None if origin is None else "HET" if origin in ("mother", "both") else "WT", transmission]


def build(patients, pcx_data, id_base=0, loci=None):
    """patients: pcx.Patient by rid. Every integer id starts after id_base, so the tenant's rows cannot collide with an
    environment that already holds data (QA). Returns (genomics, postgres rows by table, starrocks rows by table, ids)."""
    g = Genomics(loci)
    pg = {t: [] for t in ["patient", "fetus", "sample", "sequencing_experiment", "cases", "family", "case_has_sequencing_experiment", "task",
                          "task_context", "document", "task_has_document", "obs_categorical", "obs_string", "family_history",
                          "interpretation_germline", "interpretation_somatic", "occurrence_flag", "occurrence_note"]}
    sr = {t: [] for t in ["germline__snv__occurrence", "somatic__snv__occurrence", "germline__cnv__occurrence", "somatic__cnv__occurrence",
                          "exomiser", "staging_sequencing_experiment"]}
    diagnosis = {r["research_id"]: r["cns_integrated_diagnosis"] for r in pcx_data["event_level"] if r["event_type"] == "Initial CNS Tumor"}
    ids = dict.fromkeys(["patient", "fetus", "sample", "seq", "case", "family", "task", "document", "obs", "obs_string",
                         "family_history", "cnv"], id_base)

    def nid(kind):
        ids[kind] += 1
        return ids[kind]

    portal = [p for rid, p in sorted(patients.items()) if p.demo["data_type_cohort"] == "radiant" and rid in diagnosis]
    statuses = ["in_progress", "in_review", "completed", "in_progress", "draft", "resolved", "submitted", "completed"]
    for n, p in enumerate(portal):
        rng = random.Random(h("genomics", p.rid))
        dx = diagnosis[p.rid] or ""
        p.portal_id = pid = nid("patient")
        vital = next((r for r in pcx_data["patient_level"] if r["research_id"] == p.rid), {})
        life = vital.get("vital_status") if vital.get("vital_status") in ("alive", "deceased") else "unknown"
        pg["patient"].append([pid, p.mrn, "mrn", p.org, p.sex, p.dob.isoformat(), life, p.given, p.family])
        made = CREATED + dt.timedelta(days=n * 3)

        def sample(type_code, histology, parent=None, site=None):
            sid = nid("sample")
            pg["sample"].append([sid, type_code, parent, site, histology, f"S{100000 + sid}", pid, p.org, None])
            return sid

        tumor_specimen = sample("solid_tissue", "tumoral", site="Brain")
        tumor_dna = sample("dna", "tumoral", tumor_specimen)
        blood = sample("blood", "normal")
        normal_dna = sample("dna", "normal", blood)

        def seq(sample_id, aliquot):
            sq = nid("seq")
            pg["sequencing_experiment"].append([sq, sample_id, "completed", aliquot, "Broad", f"{2400 + sq}", f"RUN{sq:05d}",
                                                (made - dt.timedelta(days=20)).date().isoformat(), made, made, "wgs", "short_read", "illumina"])
            return sq

        t_seq, n_seq = seq(tumor_dna, f"{p.rid}-T"), seq(normal_dna, f"{p.rid}-N")
        mondo = next((m for k, m in MONDO.items() if k.lower() in dx.lower()), MONDO["glioma"])

        def case(case_type, catalog, status):
            cid = nid("case")
            pg["cases"].append([cid, pid, catalog, status, "DGD", mondo[0], made, made + dt.timedelta(days=rng.randrange(1, 60)),
                                rng.choice(["routine", "routine", "urgent", "asap"]), case_type, "postnatal",
                                rng.choice(["Dr. Phillip Storm", "Dr. Adam Resnick", "Dr. Angela Waanders", "Dr. Jena Lilly"]), p.org,
                                f"{p.rid}-{case_type[:4].upper()}", None])
            pg["family"].append([nid("family"), cid, pid, "proband", "affected", None])
            return cid

        def task(task_type, pipeline, version, contexts):
            tid = nid("task")
            pg["task"].append([tid, task_type, pipeline, version, "GRCh38", made])
            for sq, cid in contexts:
                pg["task_context"].append([tid, sq, cid])
            return tid

        # Somatic tumor-normal case.
        som = case("somatic", "CBTN-SOM", statuses[n % len(statuses)])
        pg["case_has_sequencing_experiment"] += [[t_seq, som], [n_seq, som]]
        s_task = task("radiant_somatic_annotation", "radiant-somatic", "2.1.0", [(t_seq, som), (n_seq, som)])
        cnv_task = task("tumor_only_variant_calling", "Dragen", "4.4.4", [(t_seq, som)])
        for sq, tid, ttype, hist in [(t_seq, s_task, "radiant_somatic_annotation", "tumoral"), (n_seq, s_task, "radiant_somatic_annotation", "normal"),
                                     (t_seq, cnv_task, "tumor_only_variant_calling", "tumoral")]:
            sr["staging_sequencing_experiment"].append([som, sq, tid, ttype, PART, "somatic", f"{p.rid}-{'T' if hist == 'tumoral' else 'N'}",
                                                        str(pid), "wgs", hist, made, made, made + dt.timedelta(hours=6)])

        # Germline case on the normal sequencing.
        germ = case("germline", "CBTN-GERM", statuses[(n + 3) % len(statuses)])
        pg["case_has_sequencing_experiment"].append([n_seq, germ])
        g_align = task("alignment_germline_variant_calling", "Dragen", "4.4.4", [(n_seq, None)])
        g_task = task("radiant_germline_annotation", "radiant-germline", "2.1.0", [(n_seq, germ)])
        for tid, ttype in [(g_task, "radiant_germline_annotation"), (g_align, "alignment_germline_variant_calling")]:
            sr["staging_sequencing_experiment"].append([germ, n_seq, tid, ttype, PART, "germline", f"{p.rid}-N", str(pid), "wgs", "normal",
                                                        made, made, made + dt.timedelta(hours=6)])
        for ext, fmt, size in [("cram", "cram", 98_000_000_000 + h("cram", n_seq) % 9_000_000_000), ("cram.crai", "crai", 2_400_000)]:
            did = nid("document")
            pg["document"].append([did, f"{p.rid}-N.{ext}", "genomic", "alignment", fmt, size,
                                   f"s3://radiant-fake-genomics/{p.rid}/{p.rid}-N.{ext}", hashlib.md5(f"{did}".encode()).hexdigest(), made])
            pg["task_has_document"].append([g_align, did, "output"])

        # Phenotypes of the germline proband.
        for code, _ in rng.sample(HPO, 3):
            pg["obs_categorical"].append([nid("obs"), germ, pid, "phenotype", "HPO", code, rng.choice(["childhood", "infantile", "unknown"]),
                                          "positive", None, None, None])

        # Germline SNVs.
        carried = rng.sample(g.common, 26)
        rare = [g.rare(rng, BACKGROUND, ["missense_variant", "synonymous_variant", "intron_variant"]) for _ in range(4)]
        predisposition = [g.named[key] for diag, key, prob in PREDISPOSITION if diag.lower() in dx.lower() and rng.random() < prob][:1]
        # A small --loci pool can draw a locus twice; one occurrence per locus and sequencing.
        for v in dict.fromkeys(carried + rare + predisposition):
            hom = v in carried and (v.af or 0) > 0.3 and rng.random() < 0.3
            total = rng.randrange(28, 60)
            alt = total if hom else rng.randrange(int(total * 0.35), int(total * 0.6))
            exo = v in predisposition or (v in rare and rng.random() < 0.5)
            pathogenic = v in predisposition
            origin = "both" if hom else ["mother", "father", "denovo"][h("origin", n_seq, v.locus_id) % 3]
            transmission = {"both": "autosomal_recessive", "denovo": "autosomal_dominant_de_novo"}.get(origin, "autosomal_dominant")
            sr["germline__snv__occurrence"].append(germline_snv(rng, n_seq, g_task, v, hom, total, alt, exo, pathogenic, origin,
                                                                transmission))
            v.germline_seqs.add(n_seq)
            if exo:
                sr["exomiser"].append([PART, n_seq, v.locus_id, f"{v.locus}-{n_seq}", hashlib.md5(v.locus.encode()).hexdigest(), "AD",
                                       round(rng.uniform(0.85, 0.99) if pathogenic else rng.uniform(0.3, 0.7), 3),
                                       round(rng.uniform(0.8, 0.98) if pathogenic else rng.uniform(0.2, 0.6), 3),
                                       1, 1 if pathogenic else rng.randrange(2, 20), v.symbol,
                                       "PATHOGENIC" if pathogenic else "UNCERTAIN_SIGNIFICANCE", ["PVS1", "PM2"] if pathogenic else ["PM2"]])
            if pathogenic:
                syndrome = "MONDO:0012583" if v.symbol == "SMARCB1" else "MONDO:0018875" if v.symbol == "TP53" else mondo[0]
                pg["interpretation_germline"].append([str(n_seq), str(germ), str(v.locus_id), v.transcript, syndrome,
                                                      "LA6668-3" if v.clinvar == "Pathogenic" else "LA26332-9", "PVS1,PM2,PP4",
                                                      "autosomal_dominant", "Constitutional variant consistent with the tumor type.",
                                                      "Dr. Jena Lilly", made + dt.timedelta(days=12)])
                pg["occurrence_flag"].append([germ, str(v.locus_id), n_seq, g_task, "flag"])
        vus = next((v for v in rare if v.consequence == "missense_variant"), None)
        if vus:
            pg["interpretation_germline"].append([str(n_seq), str(germ), str(vus.locus_id), vus.transcript, mondo[0], "LA26333-7", "PM2",
                                                  "autosomal_dominant", "Rare missense of uncertain significance.", "Dr. Jena Lilly",
                                                  made + dt.timedelta(days=13)])

        # Germline CNVs: a couple of common, benign events.
        for _ in range(rng.randrange(1, 4)):
            symbol = rng.choice(BACKGROUND)
            chrom, gs, ge, *_ = GENES[symbol]
            start = rng.randrange(gs, ge - 20000)
            length = rng.randrange(2000, 20000)
            kind = rng.choice(["DEL", "DUP"])
            cnv_id = nid("cnv")
            sr["germline__cnv__occurrence"].append([PART, n_seq, g_align, cnv_id, f"{p.rid}-N", chrom, start, start + length, kind, length,
                                                    f"DRAGEN:{kind}:{chrom}:{start}-{start + length}", round(rng.uniform(40, 150), 1), [0, 1],
                                                    "PASS", 1 if kind == "DEL" else 3, [0, rng.randrange(5, 30)], round(rng.uniform(0.4, 1.6), 2),
                                                    kind, length, length, [0, 0], [0, 0], [symbol], 1, 0,
                                                    round(rng.uniform(0.01, 0.2), 4)])

        # Somatic SNVs: the drivers of the diagnosis, then passengers.
        drivers = [g.named[k] for keys in match(dx, SOMATIC_DRIVERS) for k in keys][:2]
        if drivers and "ATRT" in dx and len(drivers) > 1:
            drivers = [drivers[h("atrt", p.rid) % 2]]
        passengers = [g.rare(rng, BACKGROUND, ["missense_variant", "missense_variant", "synonymous_variant", "stop_gained"])
                      for _ in range(rng.randrange(8, 20))]
        for v in dict.fromkeys(drivers + passengers):
            t_total, n_total = rng.randrange(60, 140), rng.randrange(30, 60)
            vaf = rng.uniform(0.3, 0.55) if v in drivers else rng.uniform(0.05, 0.35)
            t_alt = max(3, int(t_total * vaf))
            sr["somatic__snv__occurrence"].append([PART, s_task, t_seq, v.locus_id, n_seq, round(rng.uniform(80, 900), 1), "PASS",
                                                   v.hotspot, round(rng.uniform(10, 35), 2), round(rng.uniform(20, 60), 2),
                                                   t_total, round(t_alt / t_total, 3), "HET", t_total - t_alt, t_alt, t_total,
                                                   round(t_alt / t_total, 3), round(rng.uniform(20, 70), 1),
                                                   n_total, 0.0, "HOM", n_total, 0, n_total, 0.0])
            v.somatic_seqs.add(t_seq)
            if v in drivers:
                pg["interpretation_somatic"].append([str(t_seq), str(som), str(v.locus_id), v.transcript, mondo[0], "oncogenic",
                                                     "OS1,OM1,OP4" if v.hotspot else "OVS1,OP4",
                                                     "category_ia" if v.symbol == "BRAF" else "category_iic",
                                                     "Driver alteration consistent with the histology.", "Dr. Angela Waanders",
                                                     made + dt.timedelta(days=15)])
                pg["occurrence_flag"].append([som, str(v.locus_id), t_seq, s_task, "star"])
                pg["occurrence_note"].append([som, t_seq, s_task, str(v.locus_id),
                                              f"{v.symbol} {v.aa} reviewed at tumor board; matches the {dx} diagnosis."])

        # Somatic CNVs: the copy-number driver of the diagnosis, then a few passengers.
        events = match(dx, SOMATIC_CNV)[:1]
        for _ in range(rng.randrange(1, 4)):
            symbol = rng.choice(BACKGROUND)
            chrom, gs, ge, *_ = GENES[symbol]
            events.append(([symbol], chrom, gs, min(ge, gs + rng.randrange(100000, 2000000)), rng.choice(["GAIN", "LOSS"]), None, []))
        for symbols, chrom, start, end, kind, cn, bands in events:
            cn = cn if cn is not None else (3 if kind == "GAIN" else 1)
            cnv_id = nid("cnv")
            sr["somatic__cnv__occurrence"].append([PART, t_seq, cnv_task, cnv_id, f"{p.rid}-T", chrom, start, end, kind,
                                                   "<DUP>" if kind == "GAIN" else "<DEL>", end - start,
                                                   f"DRAGEN:{kind}:{chrom}:{start}-{end}", round(rng.uniform(30, 120), 1), [0, 1], "PASS",
                                                   rng.randrange(10, 400), [0, rng.randrange(5, 40)], round(rng.uniform(0.2, 1.8), 2),
                                                   "DUP" if kind == "GAIN" else "DEL", end - start, end - start, [0, 0], [0, 0],
                                                   cn, round(cn + rng.uniform(-0.2, 0.2), 2), round(rng.uniform(20, 60), 1), 1,
                                                   round(rng.uniform(0.8, 1.2), 2), round(rng.uniform(15, 40), 1), round(rng.uniform(0, 0.5), 2),
                                                   round(rng.uniform(0.05, 0.2), 2), 1, bands, symbols, len(symbols), rng.randrange(0, 40)])

    return g, pg, sr, ids


def add_relapse_samples(pg, ids, count=3):
    """Each somatic case of the cohort sequenced one tumor. The first few also get a relapse tumor, sequenced later and
    not annotated yet, so some cases have several proband samples (the case list shows them behind "See more")."""
    def nid(kind):
        ids[kind] += 1
        return ids[kind]

    samples = {r[0]: r for r in pg["sample"]}
    sequencings = {r[0]: r for r in pg["sequencing_experiment"]}
    somatic = [r[0] for r in pg["cases"] if r[9] == "somatic"][:count]
    for cid in somatic:
        tumor_seq = next(sequencings[sq] for sq, c in pg["case_has_sequencing_experiment"]
                         if c == cid and samples[sequencings[sq][1]][4] == "tumoral")
        pid, org = samples[tumor_seq[1]][6], samples[tumor_seq[1]][7]
        made = tumor_seq[8] + dt.timedelta(days=180)
        specimen = nid("sample")
        pg["sample"].append([specimen, "solid_tissue", None, "Brain", "tumoral", f"S{100000 + specimen}", pid, org, None])
        dna = nid("sample")
        pg["sample"].append([dna, "dna", specimen, None, "tumoral", f"S{100000 + dna}", pid, org, None])
        sq = nid("seq")
        pg["sequencing_experiment"].append([sq, dna, "completed", f"{tumor_seq[3]}R", "Broad", f"{2400 + sq}", f"RUN{sq:05d}",
                                            (made - dt.timedelta(days=20)).date().isoformat(), made, made, "wgs", "short_read", "illumina"])
        pg["case_has_sequencing_experiment"].append([sq, cid])


def add_prenatal_case(g, pg, sr, ids, org):
    """The PCX cohort is pediatric, so none of its cases is prenatal: this adds one, whose proband is a mother outside the
    cohort. Like the API's prenatal fixtures, the fetus's sample is drawn from the mother (patient_id) and attributed to the
    fetus (fetus_id); the mother is sequenced too. She carries SMARCB1_R377H, which the fetus inherited."""
    rng = random.Random(h("genomics", "prenatal"))

    def nid(kind):
        ids[kind] += 1
        return ids[kind]

    made = CREATED + dt.timedelta(days=1)
    used = {r[1] for r in pg["patient"]}
    retry = 0
    mrn = None
    while mrn is None or mrn in used:
        mrn = str(10_000_000 + h("mrn", "prenatal", retry) % 90_000_000)
        retry += 1
    pid = nid("patient")
    pg["patient"].append([pid, mrn, "mrn", org, "female", "1992-05-14", "alive", pcx.FIRST_F[h("given", "prenatal") % len(pcx.FIRST_F)],
                          pcx.LAST[h("family", "prenatal") % len(pcx.LAST)]])
    fid = nid("fetus")
    pg["fetus"].append([fid, f"F-{mrn}-1", pid, org, "alive", "male", (made - dt.timedelta(weeks=20)).date().isoformat(), None])

    def sample(type_code, parent=None, fetus=None):
        sid = nid("sample")
        pg["sample"].append([sid, type_code, parent, None, "normal", f"S{100000 + sid}", pid, org, fetus])
        return sid

    mother_dna = sample("dna", sample("blood"))
    fetus_dna = sample("dna", fetus=fid)

    def seq(sample_id, aliquot):
        sq = nid("seq")
        pg["sequencing_experiment"].append([sq, sample_id, "completed", aliquot, "Broad", f"{2400 + sq}", f"RUN{sq:05d}",
                                            (made - dt.timedelta(days=10)).date().isoformat(), made, made, "wgs", "short_read", "illumina"])
        return sq

    m_seq, f_seq = seq(mother_dna, "PRENATAL-M"), seq(fetus_dna, "PRENATAL-F")
    cid = nid("case")
    pg["cases"].append([cid, pid, "CBTN-GERM", "in_progress", "DGD", EXTRA_MONDO[0][0], made, made + dt.timedelta(days=4), "asap",
                        "germline", "prenatal", "Dr. Jena Lilly", org, "PRENATAL-1", None])
    pg["family"] += [[nid("family"), cid, pid, "proband", "affected", None], [nid("family"), cid, None, "fetus", "unknown", fid]]
    pg["case_has_sequencing_experiment"] += [[m_seq, cid], [f_seq, cid]]

    def task(task_type, pipeline, version, contexts):
        tid = nid("task")
        pg["task"].append([tid, task_type, pipeline, version, "GRCh38", made])
        for sq, case_id in contexts:
            pg["task_context"].append([tid, sq, case_id])
        return tid

    g_task = task("radiant_germline_annotation", "radiant-germline", "2.1.0", [(m_seq, cid), (f_seq, cid)])
    for sq, aliquot in [(m_seq, "PRENATAL-M"), (f_seq, "PRENATAL-F")]:
        align = task("alignment_germline_variant_calling", "Dragen", "4.4.4", [(sq, None)])
        for tid, ttype in [(g_task, "radiant_germline_annotation"), (align, "alignment_germline_variant_calling")]:
            sr["staging_sequencing_experiment"].append([cid, sq, tid, ttype, PART, "germline", aliquot, str(pid), "wgs", "normal",
                                                        made, made, made + dt.timedelta(hours=6)])
        for ext, fmt, size in [("cram", "cram", 98_000_000_000 + h("cram", sq) % 9_000_000_000), ("cram.crai", "crai", 2_400_000)]:
            did = nid("document")
            pg["document"].append([did, f"{aliquot}.{ext}", "genomic", "alignment", fmt, size,
                                   f"s3://radiant-fake-genomics/prenatal/{aliquot}.{ext}", hashlib.md5(f"{did}".encode()).hexdigest(), made])
            pg["task_has_document"].append([align, did, "output"])

    # The mother's variants, unphased (her parents are not sequenced); the fetus inherits about half of them, the
    # predisposition variant included, and gets the rest from the father.
    predisposition = g.named["SMARCB1_R377H"]
    mother = list(dict.fromkeys(rng.sample(g.common, 20) + [predisposition]))
    inherited = [v for v in mother if v is predisposition or rng.random() < 0.5]
    paternal = [v for v in dict.fromkeys(rng.sample(g.common, 10)) if v not in mother]
    for sq, variants in [(m_seq, [(v, None) for v in mother]), (f_seq, [(v, "mother") for v in inherited] + [(v, "father") for v in paternal])]:
        for v, origin in variants:
            total = rng.randrange(28, 60)
            alt = rng.randrange(int(total * 0.35), int(total * 0.6))
            sr["germline__snv__occurrence"].append(germline_snv(rng, sq, g_task, v, False, total, alt, False, False, origin,
                                                                None if origin is None else "autosomal_dominant"))
            v.germline_seqs.add(sq)


def add_prenatal_examples(g, pg, sr, ids, org):
    """The other prenatal layouts the case page renders, after PRENATAL-1:
      PRENATAL-2  only the fetus sequenced; the case also carries the rest of the clinical data (exams, notes, ethnicity,
                  consanguinity, family history, diagnostic hypothesis);
      PRENATAL-3  twins, one deceased, and their mother sequenced;
      PRENATAL-4  a trio: mother, father and fetus sequenced;
      PRENATAL-5  a fetus alone: the affected subject, its mother only the administrative anchor, with no observation.
    Each member carries its own phenotypes, observed and excluded, so a set shown on the wrong member stands out."""
    def nid(kind):
        ids[kind] += 1
        return ids[kind]

    used = {r[1] for r in pg["patient"]}

    def patient(key, sex, dob, family=None):
        retry, mrn = 0, None
        while mrn is None or mrn in used:
            mrn = str(10_000_000 + h("mrn", key, retry) % 90_000_000)
            retry += 1
        used.add(mrn)
        given = pcx.FIRST_F if sex == "female" else pcx.FIRST_M
        row = [nid("patient"), mrn, "mrn", org, sex, dob, "alive", given[h("given", key) % len(given)],
               family or pcx.LAST[h("family", key) % len(pcx.LAST)]]
        pg["patient"].append(row)
        return row

    def case(n, mother_dob, fetuses, father_dob=None, mother_sequenced=False, fetus_affected=False, hypothesis=None):
        """fetuses: (life status, sex, "lmp" | "due" | None) each. Returns the case id and its members as (patient_id,
        fetus_id): the mother, the father (None without one) and the fetuses. Every fetus and the father are sequenced."""
        made = CREATED + dt.timedelta(days=n)
        rng = random.Random(h("genomics", "prenatal", n))
        mother = patient(f"prenatal-{n}", "female", mother_dob)
        father = patient(f"prenatal-{n}-father", "male", father_dob, mother[8]) if father_dob else None
        cid = nid("case")
        pg["cases"].append([cid, mother[0], "CBTN-GERM", "in_progress", "DGD", EXTRA_MONDO[2][0], made, made + dt.timedelta(days=4),
                            "asap", "germline", "prenatal", "Dr. Jena Lilly", org, f"PRENATAL-{n}", hypothesis])
        pg["family"].append([nid("family"), cid, mother[0], "proband", "non_affected" if fetus_affected else "affected", None])
        if father:
            pg["family"].append([nid("family"), cid, father[0], "father", "non_affected", None])
        fetus_ids = []
        for rank, (life, sex, dated) in enumerate(fetuses, 1):
            fid = nid("fetus")
            pg["fetus"].append([fid, f"F-{mother[1]}-{rank}", mother[0], org, life, sex,
                                (made - dt.timedelta(weeks=20)).date().isoformat() if dated == "lmp" else None,
                                (made + dt.timedelta(weeks=20)).date().isoformat() if dated == "due" else None])
            pg["family"].append([nid("family"), cid, None, "fetus", "affected" if fetus_affected else "unknown", fid])
            fetus_ids.append(fid)

        def sample(type_code, pid, parent=None, fetus=None):
            sid = nid("sample")
            pg["sample"].append([sid, type_code, parent, None, "normal", f"S{100000 + sid}", pid, org, fetus])
            return sid

        sequenced = []

        def seq(tag, pid, fetus=None):
            dna = sample("dna", pid, fetus=fetus) if fetus else sample("dna", pid, sample("blood", pid))
            sq, aliquot = nid("seq"), f"PRENATAL-{n}-{tag}"
            pg["sequencing_experiment"].append([sq, dna, "completed", aliquot, "Broad", f"{2400 + sq}", f"RUN{sq:05d}",
                                                (made - dt.timedelta(days=10)).date().isoformat(), made, made, "wgs", "short_read", "illumina"])
            pg["case_has_sequencing_experiment"].append([sq, cid])
            sequenced.append((sq, aliquot, pid))
            return sq

        m_seq = seq("M", mother[0]) if mother_sequenced else None
        p_seq = seq("P", father[0]) if father else None
        # A fetus's sample is drawn from its mother.
        f_seqs = [seq(f"F{rank}" if len(fetus_ids) > 1 else "F", mother[0], fid) for rank, fid in enumerate(fetus_ids, 1)]

        def task(task_type, pipeline, version, contexts):
            tid = nid("task")
            pg["task"].append([tid, task_type, pipeline, version, "GRCh38", made])
            for sq, case_id in contexts:
                pg["task_context"].append([tid, sq, case_id])
            return tid

        g_task = task("radiant_germline_annotation", "radiant-germline", "2.1.0", [(sq, cid) for sq, _, _ in sequenced])
        for sq, aliquot, pid in sequenced:
            align = task("alignment_germline_variant_calling", "Dragen", "4.4.4", [(sq, None)])
            for tid, ttype in [(g_task, "radiant_germline_annotation"), (align, "alignment_germline_variant_calling")]:
                sr["staging_sequencing_experiment"].append([cid, sq, tid, ttype, PART, "germline", aliquot, str(pid), "wgs", "normal",
                                                            made, made, made + dt.timedelta(hours=6)])
            for ext, fmt, size in [("cram", "cram", 98_000_000_000 + h("cram", sq) % 9_000_000_000), ("cram.crai", "crai", 2_400_000)]:
                did = nid("document")
                pg["document"].append([did, f"{aliquot}.{ext}", "genomic", "alignment", fmt, size,
                                       f"s3://radiant-fake-genomics/prenatal/{aliquot}.{ext}", hashlib.md5(f"{did}".encode()).hexdigest(), made])
                pg["task_has_document"].append([align, did, "output"])

        # A fetus inherits about half of each parent's variants. The parental origin needs the mother's genome (what she
        # lacks is then the father's, as in PRENATAL-1): without it, it stays empty.
        maternal = list(dict.fromkeys(rng.sample(g.common, 20)))
        paternal = [v for v in dict.fromkeys(rng.sample(g.common, 20)) if v not in maternal]
        carried = [(m_seq, [(v, None) for v in maternal]), (p_seq, [(v, None) for v in paternal])]
        for sq in f_seqs:
            inherited = [(v, "mother") for v in maternal if rng.random() < 0.5] + [(v, "father") for v in paternal if rng.random() < 0.5]
            carried.append((sq, [(v, origin if m_seq else None) for v, origin in inherited]))
        for sq, variants in carried:
            if sq is None:
                continue
            for v, origin in variants:
                total = rng.randrange(28, 60)
                alt = rng.randrange(int(total * 0.35), int(total * 0.6))
                sr["germline__snv__occurrence"].append(germline_snv(rng, sq, g_task, v, False, total, alt, False, False, origin,
                                                                    None if origin is None else "autosomal_dominant"))
                v.germline_seqs.add(sq)
        return cid, (mother[0], None), (father[0], None) if father else None, [(None, fid) for fid in fetus_ids]

    def coded(cid, member, observation, system, value, onset=None, interpretation=None, exam=None):
        pid, fid = member
        pg["obs_categorical"].append([nid("obs"), cid, pid, observation, system, value, onset, interpretation, None, fid, exam])

    def text(cid, member, observation, value, interpretation=None, exam=None):
        pid, fid = member
        pg["obs_string"].append([nid("obs_string"), cid, pid, observation, value, interpretation, fid, exam])

    def phenotypes(cid, member, onset, observed, excluded=()):
        for code in observed:
            coded(cid, member, "phenotype", "HPO", code, onset, "positive")
        # An excluded sign never started: no onset.
        for code in excluded:
            coded(cid, member, "phenotype", "HPO", code, None, "negative")

    cid, mother, _, (fetus,) = case(2, "1992-04-10", [("alive", "male", "lmp")],
                                    hypothesis="Suspected congenital myotonic dystrophy (maternal transmission)")
    phenotypes(cid, mother, "young_adult", ["HP:0009800", "HP:0100622"], ["HP:0000479"])
    phenotypes(cid, fetus, "antenatal", ["HP:0001561", "HP:0010519", "HP:0000003"], ["HP:0002011"])
    # An abnormal exam whose finding has no code: its value is free text under the 'exam' coding system.
    coded(cid, fetus, "exam", "exam", "Bilateral ventriculomegaly", interpretation="abnormal", exam="irmc")
    text(cid, mother, "exam", "normal", "normal", "opht")
    coded(cid, mother, "ancestry", "radiant", "LAT-AM")
    coded(cid, mother, "consanguinity", "radiant", "consanguinity")
    text(cid, mother, "note", "High-risk pregnancy, ultrasound every two weeks.")
    text(cid, fetus, "note", "Anomalies seen on the second-trimester ultrasound.")
    # family_history has no fetus_id: on a prenatal case, the mother carries it.
    pg["family_history"].append([nid("family_history"), cid, mother[0], "sister", "Myotonic dystrophy"])

    cid, mother, _, (twin_1, twin_2) = case(3, "1988-11-02", [("alive", "female", "due"), ("deceased", "unknown", None)],
                                            mother_sequenced=True)
    phenotypes(cid, mother, "young_adult", ["HP:0009800"], ["HP:0100622"])
    # Opposite amniotic-fluid findings keep the twins apart; the deceased one excludes nothing, the empty state.
    phenotypes(cid, twin_1, "antenatal", ["HP:0001561", "HP:0012443"], ["HP:0007068"])
    phenotypes(cid, twin_2, "antenatal", ["HP:0001562", "HP:0004325"])

    cid, mother, father, (fetus,) = case(4, "1990-06-15", [("alive", "male", "lmp")], father_dob="1987-03-22",
                                         mother_sequenced=True)
    phenotypes(cid, mother, "young_adult", ["HP:0100622"], ["HP:0009800"])
    phenotypes(cid, father, "young_adult", ["HP:0010818"], ["HP:0010819"])
    phenotypes(cid, fetus, "antenatal", ["HP:0007068", "HP:0002011"], ["HP:0000003"])

    cid, _, _, (fetus,) = case(5, "1994-09-08", [("alive", "female", "due")], fetus_affected=True)
    phenotypes(cid, fetus, "antenatal", ["HP:0001562", "HP:0004325"], ["HP:0000003"])
