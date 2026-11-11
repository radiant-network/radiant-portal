"""``second_hit``: germline SNV + deletion, compound heterozygous pairs and somatic two-hit genes."""

import re
import sqlite3

from conftest import CNV_KEY, PORTAL, SNV_KEY, bound_value

from radiant_mcp import sql as _sql
from radiant_mcp.domain import rules
from radiant_mcp.domain.criteria import build_criteria
from radiant_mcp.enums import ENUMS
from radiant_mcp.queries import carriers
from radiant_mcp.queries import hits as hit_queries
from radiant_mcp.queries.impact import IMPACTS, impact_label, impact_rank
from radiant_mcp.queries.quality import germline_qualifies
from radiant_mcp.services import cases as case_service
from radiant_mcp.tools import hits
from radiant_mcp.tools.hits import second_hit


def _case_api(fake_api, case_type, keys):
    fake_api.on("cases", "case_entity", {
        "case_id": 1, "case_type": case_type,
        "members": [{"patient_id": 100, "relationship_to_proband": "proband"}],
        "sequencing_experiments": [{"seq_id": 10, "has_variants": True, "relationship_to_proband": "proband",
                                    "sample_submitter_id": "S1"}],
    })
    fake_api.on("cases", "case_tasks_with_occurrences", lambda data_type, **_: keys.get(data_type, []))


def test_second_hit_germline(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}], "germline_cnv": [{"id": 21}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5, (10, 21): 5}, None))
    fake_sql.on("germline__cnv__occurrence", [{
        "gene": "SCN1A", "locus_id": 1001, "clinvar_interpretation": '["Pathogenic"]', "cnv_id": 501,
        "snv_inside_cnv": 0,
    }])
    fake_sql.on("germline__snv__comphet", [
        {"gene": "SCN1A", "locus_id": 1001, "partner_locus_id": 1002},
        {"gene": "SCN1A", "locus_id": 1002, "partner_locus_id": 1001},
    ])

    result = run(second_hit(1, tenant="demo"))

    [seq] = result["data"]["sequencings"]
    [hit] = seq["snv_cnv"]
    assert hit["clinvar_interpretation"] == ["Pathogenic"] and hit["snv_inside_cnv"] is False
    assert hit["portal_url"] == f"{PORTAL}/demo/case/entity/1?tab=variants&seq_id=10&task_id=20&variant_section=snv&selectedVariant=1001"
    assert hit["cnv_portal_url"].endswith("task_id=21&variant_section=cnv")
    assert [(p["locus_id"], p["partner_locus_id"]) for p in seq["compound_heterozygous"]] == [(1001, 1002)]
    assert "rare = gnomAD v3 AF < 0.01" in result["data"]["rules"]
    # AC 4: every occurrence table is filtered on the part of its key.
    for sql, values in fake_sql.queries:
        for alias in re.findall(r"\b(o|c)\.part = ", sql):
            assert bound_value(sql, values, f"{alias}.part = ") == 5


def test_second_hit_reports_a_family_case_as_germline(fake_api, fake_sql, run, monkeypatch):
    # The portal says germline_family for a germline case with more than one member.
    _case_api(fake_api, "germline_family", {"germline_snv": [{"id": 20}], "germline_cnv": [{"id": 21}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5, (10, 21): 5}, None))
    data = run(second_hit(1, tenant="demo"))["data"]
    assert data["case_type"] == "germline" and data["rules"].startswith("SNV + CNV")


def test_second_hit_reads_the_loaded_task_while_a_re_analysis_is_imported(fake_api, fake_sql, run, monkeypatch):
    # Task 22 re-analyses seq 10 but is not imported yet: task 20 must be read.
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}, {"id": 22}], "germline_cnv": [{"id": 21}]})
    fake_sql.on("staging_sequencing_experiment", [
        {"seq_id": 10, "task_id": 20, "part": 5, "imported": 1},
        {"seq_id": 10, "task_id": 21, "part": 5, "imported": 1},
        {"seq_id": 10, "task_id": 22, "part": 5, "imported": 0},
    ])
    result = run(second_hit(1, tenant="demo"))
    snv_sql = [(sql, v) for sql, v in fake_sql.queries if "germline__snv__occurrence" in sql]
    assert snv_sql and all(bound_value(sql, v, "o.task_id = ") == 20 for sql, v in snv_sql)
    assert any("task_id=22 (germline_snv): not imported yet" in w for w in result["warnings"])


def test_a_token_that_expires_mid_call_fails_second_hit_instead_of_finding_nothing(fake_api, fake_sql, run):
    # The part lookup used to swallow it: every key skipped, ok, "no second hit".
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}]})
    fake_sql.on("staging_sequencing_experiment", _sql.SqlError("Authentication expired", "expired"))
    result = run(second_hit(1, tenant="demo"))
    assert result["ok"] is False and result["error"]["code"] == "auth_required"


def test_second_hit_skips_keys_without_part(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({}, "part lookup failed: boom"))
    result = run(second_hit(1, tenant="demo"))
    assert result["data"]["sequencings"] == []
    assert any("no `part`, skipped" in w for w in result["warnings"])
    assert fake_sql.queries == []


def test_second_hit_somatic(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}], "somatic_cnv": [{"id": 41}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7, (10, 41): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [{"case_id": 9, "seq_id": 11, "task_id": 22, "part": 15}])
    fake_sql.on("germline__snv__occurrence", [
        {"gene": "BRCA1", "locus_id": 1003, "clinvar_interpretation": "[]", "interpreted_plp": 1},
        {"gene": "SCN1A", "locus_id": 1001, "clinvar_interpretation": '["Pathogenic"]', "interpreted_plp": 0},
    ])
    fake_sql.on("somatic__snv__occurrence", [{"gene": "BRCA1", "locus_id": 1005, "vep_impact": "HIGH"}])
    fake_sql.on("somatic__cnv__occurrence", [{"gene": "BRCA1", "cnv_id": 601, "cnv_type": "CNLOH"}])

    result = run(second_hit(1, tenant="demo"))

    [gene] = result["data"]["genes"]
    assert gene["gene"] == "BRCA1" and gene["germline"][0]["interpreted_plp"] is True
    assert gene["germline"][0]["portal_url"].startswith(f"{PORTAL}/demo/case/entity/9?")
    assert [r["locus_id"] for r in gene["somatic_snv"]] == [1005] and gene["somatic_snv"][0]["data_type"] == "somatic_snv_tn"
    assert [r["cnv_id"] for r in gene["somatic_cnv"]] == [601]
    assert result["data"]["germline_plp_without_somatic_event"] == ["SCN1A"]
    [(sql, values)] = fake_sql.matching("germline__snv__occurrence")
    assert bound_value(sql, values, "o.part = ") == 15 and bound_value(sql, values, "v.part = ") == 1
    [(sql, values)] = fake_sql.matching("staging_sequencing_experiment")
    assert bound_value(sql, values, "task_type = ") == "radiant_germline_annotation"


def test_a_somatic_call_with_too_few_tumor_reads_is_kept_and_marked(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [{"case_id": 9, "seq_id": 11, "task_id": 22, "part": 15}])
    fake_sql.on("germline__snv__occurrence", [{"gene": "TP53", "locus_id": 3, "clinvar_interpretation": "[]"}])
    fake_sql.on("somatic__snv__occurrence", [{"gene": "TP53", "locus_id": 5, "vep_impact": "HIGH", "low_quality": 1, "tumor_ad_alt": 1},
                                             {"gene": "TP53", "locus_id": 6, "vep_impact": "HIGH", "low_quality": 0, "tumor_ad_alt": 9}])
    data = run(second_hit(1, tenant="demo"))["data"]
    [gene] = data["genes"]
    assert [(r["locus_id"], r["low_quality"]) for r in gene["somatic_snv"]] == [(5, True), (6, False)]
    assert "tumor alternate depth >= 2" in data["rules"]
    [(sql, values)] = fake_sql.matching("somatic__snv__occurrence")
    assert bound_value(sql, values, "o.tumor_ad_alt >= ") == 2 and bound_value(sql, values, "o.filter = ") == "PASS"
    # Kept and marked, not filtered: the depth rule is only in the selected low_quality flag.
    assert sql.count("o.tumor_ad_alt >=") == 1
    assert re.search(r"NOT COALESCE\(o\.filter = %\(p\d+\)s AND o\.tumor_ad_alt >= %\(p\d+\)s, FALSE\) AS low_quality", sql)


def test_a_variant_of_two_germline_sequencings_is_listed_once(fake_api, fake_sql, run, monkeypatch):
    # WES and WGS of the same patient: the same P/LP variant once, the qualifying call kept.
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [{"case_id": 9, "seq_id": 11, "task_id": 22, "part": 915},
                                                  {"case_id": 9, "seq_id": 12, "task_id": 23, "part": 916}])
    fake_sql.on("germline__snv__occurrence", lambda values: [{
        "gene": "TP53", "locus_id": 3, "zygosity": "HET", "clinvar_interpretation": '["Pathogenic"]',
        "low_quality": 0 if 916 in values.values() else 1}])
    fake_sql.on("somatic__snv__occurrence", [{"gene": "TP53", "locus_id": 5, "vep_impact": "HIGH"}])
    [gene] = run(second_hit(1, tenant="demo"))["data"]["genes"]
    assert len(gene["germline"]) == 1 and gene["germline"][0]["low_quality"] is False
    assert "seq_id=12" in gene["germline"][0]["portal_url"]


def test_a_first_hit_locus_is_no_second_hit_of_an_overlapping_gene_without_a_qualifying_impact(
        fake_api, fake_sql, run, monkeypatch):
    # Locus 3 is P/LP for TP53 and only intronic (MODIFIER) in the overlapping WRAP53, which has
    # its own germline P/LP variant. The tumor calls locus 3: it comes back for both genes.
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [{"case_id": 9, "seq_id": 11, "task_id": 22, "part": 15}])
    fake_sql.on("germline__snv__occurrence", [
        {"gene": "TP53", "locus_id": 3, "zygosity": "HET", "clinvar_interpretation": '["Pathogenic"]'},
        {"gene": "WRAP53", "locus_id": 7, "zygosity": "HET", "clinvar_interpretation": '["Pathogenic"]'},
    ])
    fake_sql.on("somatic__snv__occurrence", [
        {"gene": "TP53", "locus_id": 3, "vep_impact": "HIGH", "tumor_ad_ratio": 0.5},
        {"gene": "WRAP53", "locus_id": 3, "vep_impact": "MODIFIER", "tumor_ad_ratio": 0.5},
    ])
    data = run(second_hit(1, tenant="demo"))["data"]
    assert data["genes"] == [] and data["germline_plp_without_somatic_event"] == ["TP53", "WRAP53"]


def test_the_germline_variant_called_in_the_tumor_is_not_a_second_hit(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [{"case_id": 9, "seq_id": 11, "task_id": 22, "part": 15}])
    fake_sql.on("germline__snv__occurrence", [
        {"gene": "TP53", "locus_id": 3, "zygosity": "HET", "clinvar_interpretation": '["Pathogenic"]'},
        {"gene": "RB1", "locus_id": 7, "zygosity": "HET", "clinvar_interpretation": '["Pathogenic"]'},
        {"gene": "ATRX", "locus_id": 9, "zygosity": "HEM", "clinvar_interpretation": '["Pathogenic"]'},
    ])
    fake_sql.on("somatic__snv__occurrence", [
        {"gene": "TP53", "locus_id": 3, "tumor_ad_ratio": 0.48, "tumor_zygosity": "HET"},
        {"gene": "RB1", "locus_id": 7, "tumor_ad_ratio": 0.71, "tumor_zygosity": "HET"},
        {"gene": "ATRX", "locus_id": 9, "tumor_ad_ratio": 0.99, "tumor_zygosity": "HET"},
    ])
    data = run(second_hit(1, tenant="demo"))["data"]
    assert data["genes"] == [] and data["germline_plp_without_somatic_event"] == ["ATRX", "RB1", "TP53"]
    seen = {e["gene"]: e["calls"][0] for e in data["germline_variant_in_tumor"]}
    assert seen["TP53"]["possible_allelic_imbalance"] is False
    # A high tumor ratio of a germline HET may be loss of the normal allele: flagged, never counted.
    assert seen["RB1"]["possible_allelic_imbalance"] is True and seen["RB1"]["same_variant_as_germline_hit"] is True
    # A male X-linked (HEM) or homozygous germline variant is expected near 1: not an imbalance.
    assert seen["ATRX"]["possible_allelic_imbalance"] is False
    assert "not a second hit" in data["rules"]


def test_a_germline_task_shared_by_two_cases_is_not_called_older_than_itself():
    warnings: list[str] = []
    keys = [{"case_id": 1, "seq_id": 11, "task_id": 22}, {"case_id": 2, "seq_id": 11, "task_id": 22}]
    assert len(hits._latest_task(keys, "germline_snv", warnings)) == 1 and warnings == []


def test_a_tumor_only_analysis_is_not_searched_for_second_hits(fake_api, fake_sql, run, monkeypatch):
    # A tumor-only analysis keeps the germline variants: a common germline missense would be a "second hit".
    _case_api(fake_api, "somatic", {"somatic_snv_to": [{"id": 40}], "somatic_cnv": [{"id": 41}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7, (10, 41): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [{"case_id": 9, "seq_id": 11, "task_id": 22, "part": 15}])
    fake_sql.on("germline__snv__occurrence", [
        {"gene": "TP53", "locus_id": 3, "zygosity": "HET", "clinvar_interpretation": '["Pathogenic"]'}])
    fake_sql.on("somatic__cnv__occurrence", [{"gene": "TP53", "cnv_id": 601, "cnv_type": "LOSS"}])
    result = run(second_hit(1, tenant="demo"))
    assert fake_sql.matching("somatic__snv__occurrence") == []
    [gene] = result["data"]["genes"]
    assert gene["somatic_snv"] == [] and [c["cnv_id"] for c in gene["somatic_cnv"]] == [601]
    assert any("tumor-only SNV analyses are not searched" in w for w in result["warnings"])


def test_second_hit_somatic_without_germline_sequencing(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7}, None))
    result = run(second_hit(1, tenant="demo"))
    assert result["ok"] and any("no germline sequencing" in w for w in result["warnings"])


def test_second_hit_rejects_a_non_numeric_case(fake_api, run):
    assert "invalid integer" in run(second_hit("1 OR 1=1"))["error"]["message"]
    assert fake_api.calls == []


def test_second_hit_finds_a_hemizygous_snv_inside_a_deletion(fake_api, fake_sql, run, monkeypatch):
    """Case 1129: CLCNKB p.Ala77Pro called HOM in the proband because it sits inside his deletion
    (LOSS, CN 1); the mother carries the deletion (her WT call), the father the SNV. slivar
    reports uniparental_disomy; the deletion explains it."""
    seqs = [(1032, "proband", 1070, 1071), (1033, "mother", None, 1072), (1034, "father", None, 1073)]
    fake_api.on("cases", "case_entity", {
        "case_id": 1129, "case_type": "germline", "members": [],
        "sequencing_experiments": [{"seq_id": s, "has_variants": True, "relationship_to_proband": r} for s, r, _, _ in seqs],
    })
    fake_api.on("cases", "case_tasks_with_occurrences", lambda seq_id, data_type, **_: [
        {"id": snv if data_type == "germline_snv" else cnv} for s, _, snv, cnv in seqs
        if s == seq_id and (snv if data_type == "germline_snv" else cnv)])
    parts = {(s, t): 2 for s, _, snv, cnv in seqs for t in (snv, cnv) if t}
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: (parts, None))
    fake_sql.on("WITH snv AS", [{
        "gene": "CLCNKB", "locus_id": 42, "hgvsg": "chr1:g.16045686G>C", "snv_start": 16045686, "zygosity": "HOM",
        "transmission_mode": "uniparental_disomy", "clinvar_interpretation": '["Pathogenic"]', "cnv_id": 7,
        "cnv_chromosome": "1", "cnv_start": 16033040, "cnv_end": 16057606, "cnv_cn": 1, "snv_inside_cnv": 1,
    }])
    fake_sql.on("SELECT g.symbol AS gene, c.seq_id", lambda values: [
        {"gene": "CLCNKB", "seq_id": 1033, "cnv_id": 8, "chromosome": "1", "start": 16037075, "end": 16057606, "cn": 1}
    ] if 1033 in values.values() else [])

    result = run(second_hit(1129, tenant="pragmatiq"))

    [proband] = [s for s in result["data"]["sequencings"] if s["seq_id"] == 1032]
    [hit] = proband["snv_cnv"]
    assert hit["zygosity"] == "HOM" and hit["snv_inside_cnv"] is True and hit["mechanism"].startswith("hemizygous")
    assert hit["family_deletions"] == [{
        "gene": "CLCNKB", "seq_id": 1033, "cnv_id": 8, "chromosome": "1", "start": 16037075, "end": 16057606,
        "cn": 1, "relationship_to_proband": "mother", "covers_snv": True,
    }]
    assert "apparent uniparental disomy" in result["data"]["rules"]
    [(sql, values)] = fake_sql.matching("WITH snv AS")
    assert {"HET", "HOM", "HEM"} <= set(values.values())
    assert "snv.zygosity = %(" in sql and "snv.start BETWEEN cnv.start AND cnv.end)" in sql


def test_mechanism_wording():
    assert hits.mechanism("HOM", True).startswith("hemizygous")
    assert hits.mechanism("HET", True).startswith("HET call inside")
    assert hits.mechanism("HET", False).startswith("SNV and deletion on the same gene")


def test_second_hit_flags_a_cut_list(fake_api, fake_sql, run, monkeypatch):
    monkeypatch.setattr(hits, "ROW_LIMIT", 2)
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5}, None))
    fake_sql.on("germline__snv__comphet", [
        {"gene": g, "locus_id": i, "partner_locus_id": i + 100} for i, g in enumerate(["A", "B", "C"], 1)
    ])
    result = run(second_hit(1, tenant="demo"))
    assert [p["gene"] for p in result["data"]["sequencings"][0]["compound_heterozygous"]] == ["A", "B"]
    assert result["truncated"]["lists"] == ["seq_id=10 compound_heterozygous"]
    assert "alphabet" in result["truncated"]["reason"]
    [(sql, values)] = fake_sql.matching("germline__snv__comphet")
    assert "LEAST(c.locus_id, c.partner_locus_id)" in sql and values[re.findall(r"LIMIT %\((p\d+)\)s", sql)[0]] == 201


def test_second_hit_keeps_a_pair_per_gene(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5}, None))
    fake_sql.on("germline__snv__comphet", [
        {"gene": "GENE1", "locus_id": 1, "partner_locus_id": 2},
        {"gene": "GENE2", "locus_id": 1, "partner_locus_id": 2},
    ])
    result = run(second_hit(1, tenant="demo"))
    assert [p["gene"] for p in result["data"]["sequencings"][0]["compound_heterozygous"]] == ["GENE1", "GENE2"]
    assert "truncated" not in result


def test_second_hit_reads_the_latest_task_of_a_rerun(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "somatic", {"somatic_snv_tn": [{"id": 40}, {"id": 42}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 40): 7, (10, 42): 7}, None))
    fake_sql.on("staging_sequencing_experiment", [
        {"case_id": 9, "seq_id": 11, "task_id": 22, "part": 15},
        {"case_id": 9, "seq_id": 11, "task_id": 23, "part": 15},
    ])
    fake_sql.on("germline__snv__occurrence", [{"gene": "BRCA1", "locus_id": 1003, "clinvar_interpretation": "[]"}])
    fake_sql.on("somatic__snv__occurrence", [{"gene": "BRCA1", "locus_id": 1005, "vep_impact": "HIGH"}])
    result = run(second_hit(1, tenant="demo"))
    assert [k["task_id"] for k in result["data"]["germline_sequencings"]] == [23]
    [gene] = result["data"]["genes"]
    assert len(gene["germline"]) == 1 and len(gene["somatic_snv"]) == 1
    assert sum("older task" in w for w in result["warnings"]) == 2
    [(sql, values)] = fake_sql.matching("germline__snv__occurrence")
    assert bound_value(sql, values, "o.task_id = ") == 23


def test_second_hit_matches_every_gene_of_a_variant():
    for sql, _ in (hit_queries.snv_cnv_query("demo_tenant", SNV_KEY, CNV_KEY),
                        hit_queries.germline_plp_query("demo_tenant", SNV_KEY),
                        hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["BRCA1"])):
        assert "JOIN radiant.snv__consequence_filter cf ON cf.locus_id = o.locus_id" in sql
        # The picked gene only decides whether a P/LP classification counts for a gene, never membership.
        assert not re.search(r"\bv\.symbol", sql.replace("cf.symbol = v.symbol", ""))
    sql, params = hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["BRCA1"])
    assert bound_value(sql, params.values, "cf.symbol IN (") == "BRCA1"
    assert bound_value(sql, params.values, "cf.vep_impact IN (") == "HIGH"


def test_a_plp_classification_counts_for_the_picked_gene_or_where_the_variant_has_an_effect():
    import sqlite3

    for sql, _ in (hit_queries.snv_cnv_query("demo_tenant", SNV_KEY, CNV_KEY),
                   hit_queries.germline_plp_query("demo_tenant", SNV_KEY)):
        assert "cf.symbol = v.symbol OR cf.vep_impact IN (" in sql
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE cf (gene, consequence, vep_impact)")
    db.execute("CREATE TABLE v (symbol)")
    db.execute("INSERT INTO v VALUES ('A')")  # pathogenic for A, its picked gene
    db.executemany("INSERT INTO cf VALUES (?, ?, ?)", [
        ("A", "stop_gained", "HIGH"),
        ("B", "intron_variant", "MODIFIER"),     # only intronic in the nested gene B
        ("C", "missense_variant", "MODERATE"),   # a real effect on the overlapping gene C
    ])
    p = _sql.Params()
    condition = re.sub(r"%\((p\d+)\)s", r":\1", hit_queries._plp_on_gene(p)).replace("cf.symbol", "cf.gene")
    genes = [r[0] for r in db.execute(f"SELECT cf.gene FROM cf, v WHERE {condition} ORDER BY 1", p.values)]
    assert genes == ["A", "C"]
    # A deep intronic pathogenic variant still counts for its own (picked) gene.
    db.execute("UPDATE cf SET consequence = 'intron_variant', vep_impact = 'MODIFIER' WHERE gene = 'A'")
    assert [r[0] for r in db.execute(f"SELECT cf.gene FROM cf, v WHERE {condition} ORDER BY 1", p.values)] == ["A", "C"]


def _excluded_consequences(sql: str, values: dict) -> list[str]:
    match = re.search(r"cf\.consequence NOT IN \(((?:%\(p\d+\)s(?:, )?)+)\)", sql)
    assert match, "the gene join keeps upstream/downstream consequences"
    return [values[name] for name in re.findall(r"%\((p\d+)\)s", match.group(1))]


def test_a_variant_only_near_a_gene_is_not_a_hit_in_it():
    # VEP reports every gene within 5 kb: a pathogenic WRAP53 variant is "upstream"
    # of TP53 and must not become a TP53 first hit or SNV + CNV hit.
    queries = [
        hit_queries.snv_cnv_query("demo_tenant", SNV_KEY, CNV_KEY),
        hit_queries.germline_plp_query("demo_tenant", SNV_KEY),
        hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["TP53"]),
        carriers.totals_query("demo", build_criteria("germline_snv", "TP53", None, None, None, None, None)),
    ]
    for sql, params in queries:
        assert _excluded_consequences(sql, params.values) == list(rules.NEARBY_CONSEQUENCES)


def test_a_low_impact_first_hit_is_still_looked_up_in_the_tumor():
    # A ClinVar P splice_region (LOW) first hit: its tumor call is fetched whatever the impact.
    sql, params = hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["TP53"], ["3"])
    assert "OR o.locus_id IN (" in sql and 3 in params.values.values()


def test_second_hit_marks_germline_calls_outside_the_quality_rule(fake_api, fake_sql, run, monkeypatch):
    _case_api(fake_api, "germline", {"germline_snv": [{"id": 20}], "germline_cnv": [{"id": 21}]})
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5, (10, 21): 5}, None))
    fake_sql.on("germline__cnv__occurrence", [{"gene": "SCN1A", "locus_id": 1001, "cnv_id": 501, "snv_inside_cnv": 0,
                                               "low_quality": 1, "snv_filter": "LowQual", "snv_gq": 5}])
    result = run(second_hit(1, tenant="demo"))
    [hit] = result["data"]["sequencings"][0]["snv_cnv"]
    assert hit["low_quality"] is True and hit["snv_gq"] == 5
    assert "low_quality" in result["data"]["rules"]
    [(sql, values)] = [(q, v) for q, v in fake_sql.queries if "germline__cnv__occurrence" in q]
    assert bound_value(sql, values, "o.gq >= ") == 20
    # Kept and marked, not filtered: the quality rule is only in the selected low_quality flag.
    assert sql.count("o.gq >=") == 1 and re.search(r"NOT COALESCE\([^;]*?o\.gq >= [^;]*?, FALSE\) AS low_quality", sql)


def test_a_null_gq_or_alt_depth_is_low_quality():
    # The ETL stores GQ 0 and alt depth 0 as NULL: `NOT qualifies` must be true, not NULL.
    p = _sql.Params()
    condition = re.sub(r"%\((p\d+)\)s", r":\1", germline_qualifies(p))
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE o (filter, gq, ad_alt)")
    db.executemany("INSERT INTO o VALUES (?, ?, ?)",
                   [("PASS", 40, 10), ("PASS", None, 10), ("PASS", 40, None), ("LowQual", 40, 10), ("PASS", 5, 10)])
    low_quality = [r[0] for r in db.execute(f"SELECT NOT {condition} FROM o", p.values)]
    assert low_quality == [0, 1, 1, 1, 1]


def test_the_shown_impact_is_the_most_severe_on_the_reported_gene():
    # One row per variant and gene (the LIMIT counts variants), with the impact on that gene.
    for sql, _ in (hit_queries.snv_cnv_query("demo_tenant", SNV_KEY, CNV_KEY),
                   hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["TP53"])):
        assert "OVER (PARTITION BY o.locus_id, cf.symbol)" in sql and "AS vep_impact" in sql
        assert "v.vep_impact AS picked_vep_impact" in sql


def test_compound_het_impacts_are_those_on_the_pair_gene():
    # A pair in ATM whose picked transcript is on the overlapping NPAT: the rule says
    # vep_impact is the impact on the gene, so the pair reads it from the consequences.
    sql, params = hit_queries.comphet_query("demo_tenant", SNV_KEY)
    assert "gene_impact" in sql and "g1.impact_rank" in sql and "g2.impact_rank" in sql
    assert "v1.vep_impact AS picked_vep_impact" in sql and "v2.vep_impact AS partner_picked_vep_impact" in sql
    assert "LEFT JOIN gene_impact g1" in sql  # a pair is never lost for a missing impact row


def test_an_unknown_impact_stays_unknown():
    p = _sql.Params()
    expr = impact_label(p, f"MIN({impact_rank(p, 'vep_impact')})")
    expr = re.sub(r"%\((p\d+)\)s", r":\1", expr)
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE t (g, vep_impact)")
    db.executemany("INSERT INTO t VALUES (?, ?)", [(1, "LOW"), (1, "HIGH"), (2, None), (3, "MODIFIER")])
    got = dict(db.execute(f"SELECT g, {expr} FROM t GROUP BY g", p.values).fetchall())
    assert got == {1: "HIGH", 2: None, 3: "MODIFIER"}


def test_the_impact_order_is_the_stored_vep_impact_values():
    assert IMPACTS == tuple(ENUMS["vep_impact"]) == ("HIGH", "MODERATE", "LOW", "MODIFIER")


def test_consequence_rows_without_a_gene_never_take_the_row_budget():
    # A regulatory consequence has no symbol: sorted first, it would use up the 200 rows.
    key = {"seq_id": 1, "task_id": 2, "part": 3, "variant_part": 0}
    sql, _ = hit_queries.germline_plp_query("demo_tenant", key)
    assert "cf.symbol IS NOT NULL" in sql
