"""``cohort_carriers`` and ``genotype_phenotype``."""

import re
import sqlite3

import pytest
from conftest import PORTAL, bound_value, echo_gene_search

from radiant_mcp import sql as _sql
from radiant_mcp.domain import rules
from radiant_mcp.domain.criteria import build_criteria
from radiant_mcp.queries import carriers as carrier_queries
from radiant_mcp.queries.charts import oncoprint_query
from radiant_mcp.queries.impact import impact_rank, most_severe_in
from radiant_mcp.tools.cohort import cohort_carriers, genotype_phenotype


@pytest.mark.parametrize("kwargs, message", [
    ({"gene": "SCN1A'; --"}, "invalid gene symbol"),
    ({"gene": "SCN1A", "data_type": "germline_cnv", "vep_impact": ["HIGH"]}, "only apply to SNV"),
    ({"gene": "SCN1A", "cnv_types": ["LOSS"]}, "only applies to CNV"),
    ({"gene": "SCN1A", "max_gnomad_af": 2}, "max_gnomad_af"),
    ({"gene": "SCN1A", "vep_impact": ["HUGE"]}, "invalid vep_impact"),
    ({"gene": "SCN1A", "data_type": "rna"}, "invalid data_type"),
])
def test_carriers_validate_before_any_call(fake_api, fake_sql, run, kwargs, message):
    assert message in run(cohort_carriers(**kwargs))["error"]["message"]
    assert fake_api.calls == [] and fake_sql.queries == []


def test_carriers(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("cases_any_member", [{"cases": 2, "cases_any_member": 3, "patients": 4, "variants": 3}])
    fake_sql.on("GROUP BY family_role", [{"family_role": "proband", "cases": 2, "patients": 2},
                                         {"family_role": "mother", "cases": 2, "patients": 2}])
    fake_sql.on("variant_count", [{
        "case_id": 1, "patient_id": 100, "seq_id": 10, "task_id": 20, "variant_count": 2, "first_variant_id": 1001,
    }])
    fake_sql.on("SELECT cf.consequence", [{"consequence": "stop_gained", "variants": 1, "patients": 1}])

    result = run(cohort_carriers("scn1a", vep_impact=["high"], max_gnomad_af=0.01, tenant="demo"))

    data = result["data"]
    # A case where only the mother carries counts in cases_any_member, not in cases.
    assert (data["cases"], data["cases_any_member"], data["patients"], data["variants"]) == (2, 3, 4, 3)
    assert [r["family_role"] for r in data["summary"]["by_family_role"]] == ["proband", "mother"]
    totals_sql, totals_values = next(q for q in fake_sql.queries if "cases_any_member" in q[0])
    assert bound_value(totals_sql, totals_values, "WHEN family_role = ") == "proband"
    [carrier] = result["data"]["carriers"]
    assert carrier["variant_count"] == 2 and "variants" not in carrier and "first_variant_id" not in carrier
    assert carrier["portal_url"].endswith("seq_id=10&task_id=20&variant_section=snv&selectedVariant=1001")
    assert result["data"]["summary"]["by_consequence"][0]["consequence"] == "stop_gained"
    assert result["data"]["criteria"] == {
        "data_type": "germline_snv", "gene": "SCN1A", "vep_impact": ["HIGH"],
        "max_gnomad_af": "< 0.01 or absent from gnomAD",
        "gene_match": "a consequence on a transcript of the gene (not only the picked one), "
                      "other than upstream, downstream or intergenic (a variant only near "
                      "the gene does not count); a vep_impact filter keeps a variant by its most severe impact on "
                      "that gene",
        "reruns": "the latest imported task of each sequencing in each case",
        "quality": "germline SNV calls with FILTER PASS, GQ >= 20 and alternate depth >= 3 "
                   "(the platform's carrier rule, as in the variant frequencies)",
    }
    for sql, values in fake_sql.queries:
        assert bound_value(sql, values, "WHERE cf.symbol = ") == "SCN1A"
        assert "sv.gnomad_v3_af IS NULL OR sv.gnomad_v3_af < " in sql


def test_carriers_unknown_gene(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [])
    assert run(cohort_carriers("NOPE1", tenant="demo"))["error"]["code"] == "not_found"
    assert fake_sql.queries == []


def test_carriers_report_starrocks_errors(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("COUNT(DISTINCT case_id)", _sql.SqlError("Access denied", "denied", 1227))
    assert run(cohort_carriers("SCN1A", tenant="demo"))["error"] == {
        "code": "forbidden", "message": "StarRocks denied access: Access denied"}
    fake_sql.on("COUNT(DISTINCT case_id)", _sql.SqlError("Query exceeded time limit"))
    fake_sql.rules.reverse()
    assert run(cohort_carriers("SCN1A", tenant="demo"))["error"] == {
        "code": "upstream", "message": "StarRocks error: Query exceeded time limit"}


def test_genotype_phenotype(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("COUNT(DISTINCT case_id)", [{"cases": 2, "patients": 2, "variants": 2}])
    fake_sql.on("hpo_term_name", [{"hpo_term_id": "HP:0001250", "hpo_term_name": "Seizure", "patients": 2}])
    fake_sql.on("COUNT(DISTINCT obs.patient_id) AS patients FROM", [{"patients": 2}])
    fake_sql.on("obs.code_value = ", [{"case_id": 3, "patient_id": 200}])

    result = run(genotype_phenotype("SCN1A", hpo_term="HP:0001263", tenant="demo"))

    assert result["data"]["carrier_patients"] == 2 and result["data"]["carrier_patients_with_phenotypes"] == 2
    assert result["data"]["phenotypes"][0]["hpo_term_id"] == "HP:0001250"
    assert result["data"]["carriers_with_term"] == [{"case_id": 3, "patient_id": 200, "portal_url": f"{PORTAL}/demo/case/entity/3"}]
    for sql, values in fake_sql.matching("obs_categorical"):
        assert bound_value(sql, values, "obs.observation_code = ") == "phenotype"
        assert bound_value(sql, values, "obs.interpretation_code = ") == "positive"


def test_genotype_phenotype_rejects_a_bad_hpo_id(fake_api, run):
    assert "invalid HPO id" in run(genotype_phenotype("SCN1A", hpo_term="seizure"))["error"]["message"]


def test_somatic_carriers_have_no_family_role_summary():
    criteria = build_criteria("somatic_snv_tn", "TP53", None, None, None, None, None)
    assert set(carrier_queries.summary_queries("demo", criteria)) == {"by_consequence", "by_variant_class"}
    cnv = build_criteria("germline_cnv", "SCN1A", None, None, None, None, None)
    assert set(carrier_queries.summary_queries("demo", cnv)) == {"by_family_role", "by_cnv_type"}


def test_carriers_match_any_transcript_of_the_gene_and_the_latest_task():
    criteria = build_criteria("germline_snv", "SCN1A", ["HIGH"], None, None, None, None)
    sql, params = carrier_queries.totals_query("demo", criteria)
    # The gene and the impact come from the consequences on the gene's transcripts.
    assert "radiant.snv__consequence_filter cf" in sql
    # The impact filter is on the most severe impact per variant and gene: HIGH is rank 0.
    assert "HAVING MIN(CASE cf.vep_impact" in sql and bound_value(sql, params.values, "END) IN (") == 0
    assert "demo_tenant.snv__variant sv" in sql and "snv__variant_partitioned" not in sql
    assert bound_value(sql, params.values, "s.task_type = ") == "radiant_germline_annotation"
    cnv_sql, cnv_params = carrier_queries.totals_query(
        "demo", build_criteria("germline_cnv", "SCN1A", None, None, None, None, None))
    assert bound_value(cnv_sql, cnv_params.values, "s.task_type = ") == "alignment_germline_variant_calling"


def test_phenotypes_leave_fetal_observations_out():
    criteria = build_criteria("germline_snv", "SCN1A", None, None, None, None, None)
    for sql, _ in (carrier_queries.phenotypes_query("demo", criteria, 10),
                   carrier_queries.phenotyped_patients_query("demo", criteria),
                   carrier_queries.carriers_with_term_query("demo", criteria, "HP:0001250", 10)):
        assert "obs.fetus_id IS NULL" in sql


def test_germline_carriers_pass_the_platform_quality_rule():
    # Same rule as the ETL's carrier frequencies: a LowQual or GQ 5 call is not a carrier.
    for sql, params in [
        carrier_queries.totals_query("demo", build_criteria("germline_snv", "TP53", None, None, None, None, None)),
        oncoprint_query("demo", "germline_snv", ["TP53"], None, []),
    ]:
        assert bound_value(sql, params.values, "o.filter = ") == "PASS"
        assert bound_value(sql, params.values, "o.gq >= ") == 20
        assert bound_value(sql, params.values, "o.ad_alt >= ") == 3
    somatic_sql, _ = carrier_queries.totals_query(
        "demo", build_criteria("somatic_snv_tn", "TP53", None, None, None, None, None))
    assert "o.gq >=" not in somatic_sql


def test_oncoprint_uses_the_same_gene_membership_as_the_carriers():
    # Upstream / downstream / intergenic consequences do not put a variant in a gene, and
    # the impact filter is on the most severe impact on that gene, as in cohort_carriers.
    sql, params = oncoprint_query("demo", "germline_snv", ["TP53"], 0.01, ["HIGH"])
    assert "snv__consequence_filter cf" in sql and "snv__variant_partitioned" not in sql
    # The impact filter is on the most severe impact per variant and gene: HIGH is rank 0.
    assert "HAVING MIN(CASE cf.vep_impact" in sql and bound_value(sql, params.values, "END) IN (") == 0

    match = re.search(r"cf\.consequence NOT IN \(((?:%\(p\d+\)s(?:, )?)+)\)", sql)
    assert match and [params.values[n] for n in re.findall(r"%\((p\d+)\)s", match.group(1))] == list(
        rules.NEARBY_CONSEQUENCES)


def test_a_complete_list_of_exactly_limit_rows_is_not_cut(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("cases_any_member", [{"cases": 2, "cases_any_member": 2, "patients": 2, "variants": 2}])
    fake_sql.on("variant_count", [{"case_id": i, "patient_id": i, "seq_id": i, "task_id": 1,
                               "first_variant_id": 1} for i in range(2)])
    assert run(cohort_carriers("SCN1A", limit=2, tenant="demo")).get("truncated") is None
    fake_sql.on("variant_count", [{"case_id": i, "patient_id": i, "seq_id": i, "task_id": 1,
                               "first_variant_id": 1} for i in range(3)])
    fake_sql.rules.reverse()
    result = run(cohort_carriers("SCN1A", limit=2, tenant="demo"))
    assert result["data"]["returned"] == 2 and result["truncated"]["lists"] == ["carriers"]


def test_an_impact_filter_keeps_a_variant_by_its_most_severe_impact_on_the_gene():
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE cf (locus_id, vep_impact)")
    # 1: missense + intronic on the gene; 2: stop + missense; 3: synonymous only.
    db.executemany("INSERT INTO cf VALUES (?, ?)", [(1, "MODERATE"), (1, "MODIFIER"), (2, "HIGH"), (2, "MODERATE"),
                                                    (3, "LOW")])

    def kept(impacts):
        p = _sql.Params()
        having = re.sub(r"%\((p\d+)\)s", r":\1", most_severe_in(p, impacts))
        return [r[0] for r in db.execute(f"SELECT locus_id FROM cf GROUP BY locus_id HAVING {having} "
                                         "ORDER BY locus_id", p.values)]

    assert kept(["MODIFIER"]) == []      # 1 is MODERATE on the gene, not MODIFIER
    assert kept(["MODERATE"]) == [1]     # 2 is HIGH on the gene
    assert kept(["HIGH", "MODERATE"]) == [1, 2]


def test_genotype_phenotype_names_only_the_lists_it_cut(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("cases_any_member", [{"patients": 3}])
    fake_sql.on("obs.code_value", [{"hpo_term_id": f"HP:000000{i}", "patients": 1} for i in range(3)])
    result = run(genotype_phenotype("SCN1A", limit=2, tenant="demo"))
    assert result["truncated"]["lists"] == ["phenotypes"]
    assert "carriers_with_term" not in result["truncated"]["reason"]


def test_the_consequence_summary_counts_the_consequences_of_the_most_severe_impact():
    criteria = build_criteria("germline_snv", "SCN1A", ["HIGH", "MODERATE"], None, None, None, None)
    sql, _ = carrier_queries.summary_queries("demo", criteria)["by_consequence"]
    assert "JOIN g ON g.locus_id = car.variant_id" in sql and "END <=> g.impact_rank" in sql

    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE cf (locus_id, consequence, vep_impact)")
    # 1: stop on one transcript, intronic on another; 2: missense + NMD; 3: impact unknown.
    db.executemany("INSERT INTO cf VALUES (?, ?, ?)", [
        (1, "stop_gained", "HIGH"), (1, "intron_variant", "MODIFIER"),
        (2, "missense_variant", "MODERATE"), (2, "NMD_transcript_variant", "MODIFIER"),
        (3, "coding_sequence_variant", None), (3, "intron_variant", None)])
    p = _sql.Params()
    rank = re.sub(r"%\((p\d+)\)s", r":\1", impact_rank(p))
    # sqlite's null-safe equality is IS, StarRocks' is <=>.
    rows = db.execute(f"WITH g AS (SELECT locus_id, MIN({rank}) AS impact_rank FROM cf GROUP BY locus_id)"
                      f" SELECT cf.locus_id, cf.consequence FROM cf JOIN g ON g.locus_id = cf.locus_id"
                      f" AND {rank} IS g.impact_rank ORDER BY 1, 2", p.values).fetchall()
    assert rows == [(1, "stop_gained"), (2, "missense_variant"), (3, "coding_sequence_variant"),
                    (3, "intron_variant")]


def test_somatic_carriers_follow_the_platform_somatic_rule():
    # The ETL's somatic `qualifies`: FILTER PASS and tumor alternate depth >= 2.
    criteria = build_criteria("somatic_snv_tn", "TP53", None, None, None, None, None)
    for sql, params in (carrier_queries.totals_query("demo", criteria),
                        oncoprint_query("demo", "somatic_snv_tn", ["TP53"], None, [])):
        assert bound_value(sql, params.values, "o.filter = ") == "PASS"
        assert bound_value(sql, params.values, "o.tumor_ad_alt >= ") == rules.SOMATIC_MIN_TUMOR_AD_ALT == 2
    assert criteria.describe()["quality"] == rules.SOMATIC_QUALITY_DEFINITION
    germline_sql, _ = carrier_queries.totals_query(
        "demo", build_criteria("germline_snv", "TP53", None, None, None, None, None))
    assert "tumor_ad_alt" not in germline_sql


def test_the_oncoprint_counts_the_same_cnv_types_as_the_carriers():
    # The ETL can write UNKNOWN for a germline CNV: neither tool counts it.
    sql, params = oncoprint_query("demo", "germline_cnv", ["TP53"], None, [])
    match = re.search(r"c\.type IN \(((?:%\(p\d+\)s(?:, )?)+)\)", sql)
    assert match and [params.values[n] for n in re.findall(r"%\((p\d+)\)s", match.group(1))] == ["GAIN", "LOSS",
                                                                                                 "CNLOH", "GAINLOH"]


def test_a_clinvar_filter_counts_for_the_picked_gene_or_where_the_variant_has_an_effect():
    # A variant pathogenic for gene A and only intronic in B is not a pathogenic carrier of B.
    criteria = build_criteria("germline_snv", "B", None, ["Pathogenic"], None, None, None)
    sql, params = carrier_queries.totals_query("demo", criteria)
    assert bound_value(sql, params.values, "sv.symbol = ") == "B"
    match = re.search(r"g\.impact_rank IN \(((?:%\(p\d+\)s(?:, )?)+)\)", sql)
    assert match and [params.values[n] for n in re.findall(r"%\((p\d+)\)s", match.group(1))] == [0, 1, 2]
    assert "picked gene or its impact there is at least LOW" in criteria.describe()["gene_match"]
    no_clinvar, _ = carrier_queries.totals_query(
        "demo", build_criteria("germline_snv", "B", None, None, None, None, None))
    assert "sv.symbol" not in no_clinvar


def test_a_carrier_row_lists_cnv_types_but_not_snvs():
    # Without filters a WGS genome has thousands of calls in a large gene: never listed per carrier.
    snv_sql, _ = carrier_queries.carriers_query(
        "demo", build_criteria("germline_snv", "DMD", None, None, None, None, None), 51)
    assert "array_agg" not in snv_sql and "hgvsg" not in snv_sql and "variant_count" in snv_sql
    cnv_sql, _ = carrier_queries.carriers_query(
        "demo", build_criteria("germline_cnv", "DMD", None, None, None, None, None), 51)
    assert "array_agg(DISTINCT car.type) AS cnv_types" in cnv_sql


def test_somatic_cnv_carriers_link_to_the_cnv_sub_tab_like_every_tool(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("cases_any_member", [{"cases": 1, "cases_any_member": 1, "patients": 1, "variants": 1}])
    fake_sql.on("variant_count", [{"case_id": 7, "patient_id": 70, "seq_id": 71, "task_id": 72, "variant_count": 1,
                                   "cnv_types": '["LOSS"]', "first_variant_id": 9}])
    [carrier] = run(cohort_carriers("CDKN2A", data_type="somatic_cnv", tenant="demo"))["data"]["carriers"]
    assert carrier["portal_url"].endswith("seq_id=71&task_id=72&variant_section=cnv-to")


def test_a_summary_cut_at_its_cap_is_flagged(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("cases_any_member", [{"cases": 1, "cases_any_member": 1, "patients": 1, "variants": 40}])
    fake_sql.on("SELECT cf.consequence", [{"consequence": f"c{i}", "variants": 1, "patients": 1} for i in range(31)])
    result = run(cohort_carriers("SCN1A", tenant="demo"))
    assert len(result["data"]["summary"]["by_consequence"]) == 30
    assert result["truncated"]["lists"] == ["summary.by_consequence"]
