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
EXTRA_MONDO = [("MONDO:0012583", "rhabdoid tumor predisposition syndrome 1"), ("MONDO:0018875", "Li-Fraumeni syndrome")]
HPO = [("HP:0002664", "Neoplasm"), ("HP:0002315", "Headache"), ("HP:0002013", "Vomiting"), ("HP:0001251", "Ataxia"),
       ("HP:0000238", "Hydrocephalus"), ("HP:0001250", "Seizure"), ("HP:0000639", "Nystagmus"), ("HP:0001263", "Global developmental delay")]
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


def build(patients, pcx_data, id_base=0, loci=None):
    """patients: pcx.Patient by rid. Every integer id starts after id_base, so the tenant's rows cannot collide with an
    environment that already holds data (QA). Returns (genomics, postgres rows by table, starrocks rows by table, ids)."""
    g = Genomics(loci)
    pg = {t: [] for t in ["patient", "sample", "sequencing_experiment", "cases", "family", "case_has_sequencing_experiment", "task",
                          "task_context", "document", "task_has_document", "obs_categorical", "interpretation_germline",
                          "interpretation_somatic", "occurrence_flag", "occurrence_note"]}
    sr = {t: [] for t in ["germline__snv__occurrence", "somatic__snv__occurrence", "germline__cnv__occurrence", "somatic__cnv__occurrence",
                          "exomiser", "staging_sequencing_experiment"]}
    diagnosis = {r["research_id"]: r["cns_integrated_diagnosis"] for r in pcx_data["event_level"] if r["event_type"] == "Initial CNS Tumor"}
    ids = dict.fromkeys(["patient", "sample", "seq", "case", "family", "task", "document", "obs", "cnv"], id_base)

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
            pg["sample"].append([sid, type_code, parent, site, histology, f"S{100000 + sid}", pid, p.org])
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
                                f"{p.rid}-{case_type[:4].upper()}"])
            pg["family"].append([nid("family"), cid, pid, "proband", "affected"])
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
                                          "positive", None])

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
            sr["germline__snv__occurrence"].append([
                PART, n_seq, g_task, v.locus_id, round(alt / total, 3), rng.randrange(40, 99), total, total, total - alt, alt,
                "HOM" if hom else "HET", [1, 1] if hom else [0, 1], round(rng.uniform(200, 3000), 1), "PASS",
                round(rng.uniform(10, 30), 2),
                "AD" if exo else None,
                ("PATHOGENIC" if pathogenic else "UNCERTAIN_SIGNIFICANCE") if exo else None,
                (["PVS1", "PM2"] if pathogenic else ["PM2"]) if exo else None,
                round(rng.uniform(0.85, 0.99) if pathogenic else rng.uniform(0.3, 0.7), 3) if exo else None,
                round(rng.uniform(0.8, 0.98) if pathogenic else rng.uniform(0.2, 0.6), 3) if exo else None])
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
