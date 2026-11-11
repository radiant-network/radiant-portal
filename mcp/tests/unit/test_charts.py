"""RAD-254 chart tools: rendering, data selection and tool contracts."""

import asyncio
import importlib
import re

import pytest
from conftest import api_exception, bound_value
from fastmcp import Client, FastMCP

from radiant_mcp import charts
from radiant_mcp import sql as _sql
from radiant_mcp.domain.consequences import consequence_class
from radiant_mcp.services import cases as case_service
from radiant_mcp.tools.charts import bar_chart, family_venn, lollipop, oncoprint, patient_timeline, survival_curve
from radiant_mcp.tools.charts.timeline import timeline_items

PNG = b"\x89PNG\r\n\x1a\n"
KEY = "0f8fad5b-d9cb-469f-a165-70867728950e"

# Freireich et al. 1963 remission data (weeks), the classic Kaplan-Meier / log-rank example.
DRUG_T = [6, 6, 6, 6, 7, 9, 10, 10, 11, 13, 16, 17, 19, 20, 22, 23, 25, 32, 32, 34, 35]
DRUG_E = [1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]
PLACEBO_T = [1, 1, 2, 2, 3, 4, 4, 5, 5, 8, 8, 8, 8, 11, 11, 12, 12, 15, 17, 22, 23]


def _parts(result) -> tuple[dict, bytes]:
    """The ``data`` of a chart result and its PNG."""
    assert result["ok"] and result.png is not None, result
    return result["data"], result.png


# -- rendering -----------------------------------------------------------------------

def test_kaplan_meier_and_logrank_match_the_published_example():
    png, stats = charts.survival([
        charts.SurvivalGroup("6-MP", DRUG_T, [bool(e) for e in DRUG_E]),
        charts.SurvivalGroup("Placebo", PLACEBO_T, [True] * 21),
    ], "Freireich")
    assert png.startswith(PNG) and len(png) < charts.MAX_PNG_BYTES
    medians = {g["group"]: g["median_survival_years"] for g in stats.groups}
    assert medians == {"6-MP": 23.0, "Placebo": 8.0}
    assert stats.logrank_p == pytest.approx(4.17e-5, rel=0.01)  # chi-square 16.79, 1 df
    assert [g["deaths"] for g in stats.groups] == [9, 21]


def test_logrank_matches_scipy_for_two_groups():
    from scipy.stats import CensoredData, logrank

    drug = charts.SurvivalGroup("6-MP", DRUG_T, [bool(e) for e in DRUG_E])
    placebo = charts.SurvivalGroup("Placebo", PLACEBO_T, [True] * 21)
    statistic, df, p = charts.logrank([drug, placebo])
    reference = logrank(
        x=CensoredData(
            uncensored=[t for t, e in zip(DRUG_T, DRUG_E, strict=True) if e],
            right=[t for t, e in zip(DRUG_T, DRUG_E, strict=True) if not e],
        ),
        y=CensoredData(uncensored=PLACEBO_T),
    )
    assert df == 1 and statistic == pytest.approx(16.79, abs=0.01)
    assert p == pytest.approx(reference.pvalue, rel=1e-6)


def test_logrank_matches_scipy_on_random_cohorts():
    # Day-level survival in years, as survival_curve passes it: numpy's default rank
    # tolerance used to count df = 2 for two groups in about one test in five.
    import numpy as np
    from scipy.stats import CensoredData, logrank

    rng = np.random.default_rng(20261108)
    for _ in range(300):
        sizes = rng.integers(5, 200, 2)
        times = [rng.integers(1, 3000, n) / 365.25 for n in sizes]
        events = [rng.random(n) < 0.6 for n in sizes]
        groups = [charts.SurvivalGroup(f"G{i}", list(t), list(e)) for i, (t, e) in enumerate(zip(times, events, strict=True))]
        result = charts.logrank(groups)
        reference = logrank(*(CensoredData(uncensored=t[e], right=t[~e]) for t, e in zip(times, events, strict=True)))
        assert result is not None and result[1] == 1
        assert result[2] == pytest.approx(reference.pvalue, rel=1e-6, abs=1e-12)


def test_logrank_with_three_groups_does_not_depend_on_the_group_order():
    groups = [
        charts.SurvivalGroup("A", DRUG_T[:11], [bool(e) for e in DRUG_E[:11]]),
        charts.SurvivalGroup("B", DRUG_T[11:], [bool(e) for e in DRUG_E[11:]]),
        charts.SurvivalGroup("C", PLACEBO_T, [True] * 21),
    ]
    statistic, df, p = charts.logrank(groups)
    assert df == 2 and 0 < p < 0.001
    for order in ([2, 0, 1], [1, 2, 0]):
        assert charts.logrank([groups[i] for i in order])[0] == pytest.approx(statistic)


def test_survival_draws_six_groups_and_tests_them():
    groups = [charts.SurvivalGroup(f"G{i}", [1.0 + i, 2.0 + i, 3.0], [True, False, True]) for i in range(6)]
    png, stats = charts.survival(groups, "t")
    assert png.startswith(PNG) and len(stats.groups) == 6 and stats.logrank_df == 5


def test_survival_without_deaths_draws_a_flat_curve_and_no_test():
    _, stats = charts.survival([charts.SurvivalGroup("A", [1.0, 2.0], [False, False]),
                                charts.SurvivalGroup("B", [1.5], [False])], "t")
    assert stats.logrank_p is None and stats.groups[0]["median_survival_years"] is None


def test_survival_can_skip_the_test():
    _, stats = charts.survival([charts.SurvivalGroup("A", DRUG_T, [bool(e) for e in DRUG_E]),
                                charts.SurvivalGroup("B", PLACEBO_T, [True] * 21)], "t", test=False)
    assert stats.logrank_p is None


@pytest.mark.parametrize("draw", [
    lambda: charts.venn(["A", "B", "C"], {(1, 1, 1): 3}, "t"),
    lambda: charts.venn(["A", "B"], {(1, 0): 1}, "t"),
    lambda: charts.oncoprint(["G"], ["case 1"], {("G", "case 1"): "missense"}, "t"),
    lambda: charts.lollipop([charts.Lollipop(10, "p.A10V", 2, "missense")], "t", "s"),
    lambda: charts.timeline([charts.TimelineItem("Events", 1.0), charts.TimelineItem("Radiation", 1.0, 2.0)],
                            ["Events", "Radiation"], "t"),
    lambda: charts.bar_chart(["a", "b"], [1, 2], "t"),
])
def test_every_chart_is_a_png_under_the_limit(draw):
    png = draw()
    assert png.startswith(PNG) and len(png) < charts.MAX_PNG_BYTES


def test_venn_needs_two_or_three_sets():
    with pytest.raises(ValueError):
        charts.venn(["A"], {}, "t")


@pytest.mark.parametrize("consequences, expected", [
    (["missense_variant", "stop_gained"], "truncating"),
    (["splice_donor_variant", "intron_variant"], "splice"),
    # The LOW splice region terms are not "splice": a missense next to an exon edge stays a missense.
    (["missense_variant", "splice_region_variant"], "missense"),
    (["synonymous_variant", "splice_region_variant"], "other"),
    (["splice_donor_5th_base_variant", "intron_variant"], "other"),
    (["missense_variant"], "missense"),
    (["inframe_deletion"], "inframe"),
    (["synonymous_variant"], "other"),
    ('["frameshift_variant"]', "truncating"),
])
def test_consequence_classes(consequences, expected):
    assert consequence_class(consequences) == expected


# -- family_venn ---------------------------------------------------------------------

def _trio_api(fake_api, monkeypatch, roles=("proband", "father", "mother")):
    seqs = {"proband": 10, "father": 13, "mother": 14}
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(seqs[r], 20): 5 for r in roles}, None))
    fake_api.on("cases", "case_entity", {
        "case_id": 1, "case_type": "germline", "members": [],
        "sequencing_experiments": [{"seq_id": seqs[r], "has_variants": True, "relationship_to_proband": r} for r in roles],
    })
    fake_api.on("cases", "case_tasks_with_occurrences",
                lambda data_type, **_: [{"id": 20}] if data_type == "germline_snv" else [])


def test_family_venn_trio(fake_api, fake_sql, run, monkeypatch):
    _trio_api(fake_api, monkeypatch)
    fake_sql.on("germline__snv__occurrence", [
        {"m0": 1, "m1": 1, "m2": 1, "n": 40}, {"m0": 1, "m1": 0, "m2": 0, "n": 3}, {"m0": 0, "m1": 1, "m2": 0, "n": 5},
    ])
    data, png = _parts(run(family_venn(1, tenant="demo")))
    assert png.startswith(PNG)
    assert data["members"] == ["Proband", "Father", "Mother"]
    assert data["variants_per_region"] == {"Proband & Father & Mother": 40, "Proband": 3, "Father": 5}
    [(sql, values)] = fake_sql.queries
    assert "LEFT SEMI JOIN" not in sql
    assert sorted(v for k, v in values.items() if v == 5) == [5, 5, 5]  # each key's part
    assert re.search(r"o\.zygosity IN \(", sql) and {"HET", "HOM", "HEM"} <= set(values.values())


def test_family_venn_duo_with_filters(fake_api, fake_sql, run, monkeypatch):
    _trio_api(fake_api, monkeypatch, roles=("proband", "mother"))
    fake_sql.on("germline__snv__occurrence", [{"m0": 1, "m1": 1, "n": 7}])
    data, _ = _parts(run(family_venn(1, rare_only=True, vep_impact=["high"], tenant="demo")))
    assert data["members"] == ["Proband", "Mother"] and data["variants_per_region"] == {"Proband & Mother": 7}
    assert data["filters"][1] == "impact HIGH"
    [(sql, values)] = fake_sql.queries
    assert "LEFT SEMI JOIN" in sql and bound_value(sql, values, "v.vep_impact IN (") == "HIGH"


def test_family_venn_needs_a_parent(fake_api, fake_sql, run, monkeypatch):
    _trio_api(fake_api, monkeypatch, roles=("proband",))
    assert "no parent with a loaded germline SNV analysis" in run(family_venn(1, tenant="demo"))["error"]["message"]
    assert fake_sql.queries == []


def test_family_venn_says_why_a_parent_was_left_out(fake_api, fake_sql, run, monkeypatch):
    # The father is sequenced but his analysis is not imported yet: say so, not just "no parent".
    _trio_api(fake_api, monkeypatch, roles=("proband", "father"))
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5, (13, 20): None}, None))
    result = run(family_venn(1, tenant="demo"))
    assert result["error"]["code"] == "invalid_input"
    assert any("father" in w and "not imported yet" in w for w in result["error"]["details"]["warnings"])


# -- survival_curve ------------------------------------------------------------------

def _key(i: int) -> str:
    return f"00000000-0000-4000-8000-{i:012d}"


def _patients(fake_sql, rows):
    """The clinical patient list read by survival_curve, one statement per list."""
    fake_sql.on("v_pcx_30_patient_list", rows)


def _searches(fake_sql) -> list:
    return fake_sql.matching("v_pcx_30_patient_list")


def test_survival_of_a_key_group_against_the_rest_of_a_cohort(fake_api, fake_sql, run):
    rows = [{"patient_key": _key(i), "survival_days": 365 * (i + 1), "vital_status": "deceased" if i % 2 else "alive"}
            for i in range(10)]
    _patients(fake_sql, rows)

    data, png = _parts(run(survival_curve(
        groups=[{"label": "ACNS0334 Regimen B", "patient_keys": [_key(i) for i in range(4)] + [_key(99)]}],
        cohort_filters={"cns_integrated_diagnosis": ["Medulloblastoma"]}, others_label="Other protocols",
        tenant="demo")))

    assert png.startswith(PNG)
    assert {g["group"]: g["patients"] for g in data["groups"]} == {"ACNS0334 Regimen B": 4, "Other protocols": 6}
    assert data["definition"]["ACNS0334 Regimen B"] == {"patient_keys": 5, "not_found_or_not_in_cohort": 1}
    assert data["cohort"]["patients"] == 10 and data["logrank_df"] == 1
    [(sql, values)] = _searches(fake_sql)
    assert bound_value(sql, values, "pl.cns_integrated_diagnosis IN (") == "Medulloblastoma"


def test_survival_of_carriers_against_the_other_sequenced_patients(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [{"symbol": "SCN1A"}])
    rows = [{"patient_key": _key(i), "radiant_patient_id": i, "case_count": 1, "survival_days": 365 * (i % 7 + 1),
             "vital_status": "deceased" if i % 2 else "alive"} for i in range(1, 151)]
    # A portal patient record without a case is not genotyped: left out by sequenced_only.
    rows += [{"patient_key": _key(500), "radiant_patient_id": 500, "case_count": 0, "survival_days": 100,
              "vital_status": "alive"},
             {"patient_key": _key(999), "radiant_patient_id": 999, "case_count": 1, "survival_days": None,
              "vital_status": "alive"}]
    _patients(fake_sql, rows)
    fake_sql.on("SELECT DISTINCT patient_id FROM car", [{"patient_id": str(i)} for i in range(1, 21)])
    # Genotyped = an imported germline SNV analysis: patient 500 has none.
    fake_sql.on("SELECT DISTINCT s.patient_id", [{"patient_id": i} for i in [*range(1, 151), 999]])

    data, _ = _parts(run(survival_curve(groups=[{"label": "SCN1A carriers", "carriers": {"gene": "scn1a"}}],
                                        sequenced_only=True, others_label="Other sequenced patients", tenant="demo")))

    assert {g["group"]: g["patients"] for g in data["groups"]} == {"SCN1A carriers": 20, "Other sequenced patients": 130}
    assert data["excluded_without_survival_data"] == {"SCN1A carriers": 0, "Other sequenced patients": 1}
    assert data["definition"]["SCN1A carriers"]["carrier_patients"] == 20
    assert data["cohort"] == {"filters": "all patients", "sequenced_only": True, "patients": 151,
                              "excluded_not_genotyped": 1,
                              "genotyped_means": "an imported analysis of every carrier group's data type (all of them): germline_snv"}
    assert len(_searches(fake_sql)) == 1  # the cohort, in one statement (it took 2 pages of 100)


def test_somatic_non_carriers_are_patients_with_a_tumor_analysis(fake_api, fake_sql, run):
    # A patient with only a germline case (or a case not analysed yet) has a Radiant
    # case but no known somatic genotype: not a "non-carrier".
    fake_api.on("genes", "gene_search", [{"symbol": "TP53"}])
    _patients(fake_sql, [{"patient_key": _key(i), "radiant_patient_id": i, "case_count": 1,
                          "survival_days": 300 * i, "vital_status": "deceased" if i % 2 else "alive"}
                         for i in range(1, 7)])
    fake_sql.on("SELECT DISTINCT patient_id FROM car", [{"patient_id": "1"}, {"patient_id": "2"}])
    fake_sql.on("SELECT DISTINCT s.patient_id", [{"patient_id": i} for i in (1, 2, 3, 4)])
    data, _ = _parts(run(survival_curve(groups=[{"label": "TP53", "carriers": {"gene": "TP53",
                                                                              "data_type": "somatic_snv_tn"}}],
                                        sequenced_only=True, others_label="Non-carriers", tenant="demo")))
    assert {g["group"]: g["patients"] for g in data["groups"]} == {"TP53": 2, "Non-carriers": 2}
    assert data["cohort"]["excluded_not_genotyped"] == 2
    values = next(v for q, v in fake_sql.queries if "SELECT DISTINCT s.patient_id" in q)
    assert "radiant_somatic_annotation" in values.values()


def test_survival_of_filter_groups_needs_no_cohort(fake_api, fake_sql, run):
    _patients(fake_sql, [{"patient_key": _key(1), "survival_days": 400, "vital_status": "deceased"},
                         {"patient_key": _key(2), "survival_days": 800, "vital_status": "alive"}])
    data, _ = _parts(run(survival_curve(groups=[{"label": "A", "filters": {"vital_status": "alive"}},
                                                {"label": "B", "filters": {"organization_code": "X"}}], tenant="demo")))
    assert [g["group"] for g in data["groups"]] == ["A", "B"] and data["cohort"] is None
    assert len(_searches(fake_sql)) == 2


def test_survival_skips_the_test_when_groups_overlap(fake_api, fake_sql, run):
    _patients(fake_sql, [{"patient_key": _key(i), "survival_days": 100 * i, "vital_status": "deceased"} for i in range(1, 7)])
    data, _ = _parts(run(survival_curve(groups=[
        {"label": "A", "patient_keys": [_key(1), _key(2), _key(3)]},
        {"label": "B", "patient_keys": [_key(3), _key(4)]},
        {"label": "C", "patient_keys": [_key(5), _key(6)]},
    ], tenant="demo")))
    assert data["overlapping_patients"] == 1
    assert data["logrank_p"] is None and data["logrank_skipped"] == "groups overlap"


def test_survival_of_three_groups(fake_api, fake_sql, run):
    _patients(fake_sql, [{"patient_key": _key(i), "survival_days": 100 * i, "vital_status": "deceased" if i % 3 else "alive"}
                         for i in range(1, 10)])
    data, _ = _parts(run(survival_curve(groups=[{"label": n, "patient_keys": [_key(i) for i in r]}
                                                for n, r in (("A", range(1, 4)), ("B", range(4, 7)), ("C", range(7, 10)))],
                                        tenant="demo")))
    assert data["logrank_df"] == 2 and data["overlapping_patients"] == 0


@pytest.mark.parametrize("kwargs, message", [
    ({"groups": []}, "give `groups`"),
    ({"groups": [{"label": "A", "filters": {"vital_status": "alive"}}]}, "at least two groups"),
    ({"groups": [{"label": "A", "patient_keys": [KEY], "filters": {"vital_status": "alive"}}],
      "others_label": "B"}, "exactly one of"),
    ({"groups": [{"label": "A", "patient_keys": ["123"]}], "others_label": "B"}, "not patient keys"),
    ({"groups": [{"label": "A", "filters": {"mrn": "1"}}], "others_label": "B"}, "unknown patient filter"),
    ({"groups": [{"label": "A", "filters": {"patient_key": KEY}}], "others_label": "B"}, "unknown patient filter"),
    ({"groups": [{"label": "A", "patient_keys": [KEY]}], "others_label": "A"}, "distinct"),
    ({"groups": [{"label": str(i), "patient_keys": [KEY]} for i in range(6)], "others_label": "rest"}, "at most 6"),
    ({"groups": [{"label": "A", "carriers": {"data_type": "germline_snv"}}], "others_label": "B"}, "at least a gene"),
    ({"groups": [{"label": "A", "carriers": {"gene": "TP53", "af": 1}}], "others_label": "B"}, "unknown carriers"),
    ({"groups": [{"label": "A", "carriers": {"gene": "TP53", "cnv_types": ["LOSS"]}}], "others_label": "B"},
     "cnv_types only applies"),
    ({"groups": [{"label": "A", "sex": "f"}], "others_label": "B"}, "unknown field"),
    ({"groups": [{"label": "A", "patient_keys": [KEY]}], "others_label": "B", "cohort_filters": {"mrn": "1"}},
     "cohort_filters"),
])
def test_survival_validates(fake_api, run, kwargs, message):
    assert message in run(survival_curve(tenant="demo", **kwargs))["error"]["message"]
    assert fake_api.calls == []


def test_survival_reports_an_unknown_gene(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [])
    _patients(fake_sql, [{"patient_key": _key(1), "radiant_patient_id": 1, "survival_days": 10, "vital_status": "alive"}])
    result = run(survival_curve(groups=[{"label": "A", "carriers": {"gene": "NOPE1"}}], others_label="B", tenant="demo"))
    assert "not found" in result["error"]["message"]


@pytest.mark.parametrize("error", [
    # What StarRocks really answers (test_starrocks): an unknown database, an unknown table.
    _sql.SqlError("5501 (3F000): Getting analyzing error. Detail message: Unknown database 'x_tenant'.",
                  "invalid", 5501),
    _sql.SqlError("5502 (42602): Getting analyzing error. Detail message: Unknown table "
                  "'x_tenant.v_pcx_30_patient_list'.", "invalid", 5502),
])
def test_survival_without_clinical_data(fake_api, fake_sql, run, error):
    fake_sql.on("v_pcx_30_patient_list", error)
    result = run(survival_curve(groups=[{"label": "A", "filters": {"vital_status": "alive"}},
                                        {"label": "B", "filters": {"vital_status": "deceased"}}], tenant="x"))
    assert result["error"]["code"] == "unavailable" and result.png is None


def test_survival_reports_another_starrocks_error_as_an_error(fake_api, fake_sql, run):
    # A column the view lost is a bug to see, not "no clinical data".
    # StarRocks sends 5502 (42602) for any analysis error, not only an unknown table.
    fake_sql.on("v_pcx_30_patient_list", _sql.SqlError("5502 (42602): Getting analyzing error. Detail message: "
                                                       "Column 'vital_status' cannot be resolved.", "invalid", 5502))
    result = run(survival_curve(groups=[{"label": "A", "filters": {"vital_status": "alive"}},
                                        {"label": "B", "filters": {"vital_status": "deceased"}}], tenant="x"))
    assert result["error"]["code"] != "unavailable"


# -- oncoprint / lollipop ------------------------------------------------------------

def test_oncoprint(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", lambda gene_search_body, **_: [{"symbol": i.upper()} for i in gene_search_body.inputs])
    fake_sql.on("germline__snv__occurrence", [
        {"case_id": 1, "gene": "SCN1A", "kind": "missense_variant"},
        {"case_id": 1, "gene": "SCN1A", "kind": "stop_gained"},
        {"case_id": 2, "gene": "BRCA1", "kind": "missense_variant"},
    ])
    fake_sql.on("germline__cnv__occurrence", [{"case_id": 2, "gene": "SCN1A", "kind": "LOSS"}])
    result = run(oncoprint(["scn1a", "brca1"], data_types=["germline_snv", "germline_cnv"], tenant="demo"))
    data, png = _parts(result)
    assert png.startswith(PNG)
    assert data["altered_cases"] == 2 and data["altered_cases_per_gene"] == {"SCN1A": 2, "BRCA1": 1}
    for sql, values in fake_sql.queries:
        assert bound_value(sql, values, "s.tenant_code = ") == "demo"
        assert bound_value(sql, values, "s.family_role = ") == "proband"
    assert any("polymorphisms" in w for w in result["warnings"]) and "proband" in data["germline"]
    # Every gene in one portal search, not one call per gene.
    [(_, _, kwargs)] = [c for c in fake_api.calls if c[1] == "gene_search"]
    assert kwargs["gene_search_body"].inputs == ["scn1a", "brca1"]


def test_oncoprint_keeps_parents_out_of_germline_cases_only(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [{"symbol": "TP53"}])
    run(oncoprint(["TP53"], data_types=["somatic_snv_tn", "somatic_cnv", "germline_cnv"], tenant="demo"))
    by_table = {re.search(r"(\w+__\w+__occurrence)", sql).group(1): sql for sql, _ in fake_sql.queries}
    assert "s.family_role = " not in by_table["somatic__snv__occurrence"]
    assert "s.family_role = " not in by_table["somatic__cnv__occurrence"]
    assert "s.family_role = " in by_table["germline__cnv__occurrence"]
    # Every data type reads the latest task of each sequencing only.
    assert all("AS rerun" in sql for sql in by_table.values())


def test_oncoprint_counts_every_altered_case_and_flags_a_cut(fake_api, fake_sql, run, monkeypatch):
    # The package re-exports the oncoprint tool under the module's name.
    oncoprint_module = importlib.import_module("radiant_mcp.tools.charts.oncoprint")
    monkeypatch.setattr(oncoprint_module, "ONCOPRINT_ROW_LIMIT", 150)
    # The symbol and its Ensembl id resolve to one gene: one row.
    fake_api.on("genes", "gene_search", [{"symbol": "TP53", "ensembl_gene_id": "ENSG00000141510"}])
    fake_sql.on("germline__snv__occurrence", [
        {"case_id": i, "gene": "TP53", "kind": "missense_variant"} for i in range(1, 152)
    ])
    result = run(oncoprint(["TP53", "ENSG00000141510"], max_gnomad_af=0.01, tenant="demo"))
    data, _ = _parts(result)
    assert data["genes"] == ["TP53"]
    # Case 150, the last one read before the cut, may be partial: it is dropped too.
    assert data["altered_cases"] == 149 and data["cases_shown"] == 100
    assert data["altered_cases_per_gene"] == {"TP53": 149}
    assert result["truncated"]["lists"] == ["germline_snv"] and result["warnings"] == []


def test_a_cut_oncoprint_shows_no_case_with_only_some_of_its_genes(fake_api, fake_sql, run, monkeypatch):
    oncoprint_module = importlib.import_module("radiant_mcp.tools.charts.oncoprint")
    monkeypatch.setattr(oncoprint_module, "ONCOPRINT_ROW_LIMIT", 3)
    fake_api.on("genes", "gene_search", lambda gene_search_body, **_: [
        {"symbol": i.upper()} for i in gene_search_body.inputs])
    # The cut falls after case 2's TP53 row: its ZEB2 row is not read.
    fake_sql.on("germline__snv__occurrence", [
        {"case_id": c, "gene": g, "kind": "missense_variant"} for c in (1, 2) for g in ("TP53", "ZEB2")
    ])
    data, _ = _parts(run(oncoprint(["TP53", "ZEB2"], max_gnomad_af=0.01, tenant="demo")))
    assert data["altered_cases"] == 1 and data["altered_cases_per_gene"] == {"TP53": 1, "ZEB2": 1}


@pytest.mark.parametrize("kwargs, message", [
    ({"genes": []}, "1 to 20 genes"),
    ({"genes": ["A'--"]}, "invalid gene symbol"),
    ({"genes": ["TP53"], "data_types": ["rna"]}, "invalid data_type"),
    # The SNV filters would be dropped silently on CNVs only.
    ({"genes": ["TP53"], "data_types": ["somatic_cnv"], "vep_impact": ["HIGH"]}, "only apply to SNV"),
    ({"genes": ["TP53"], "data_types": ["germline_cnv"], "max_gnomad_af": 0.01}, "only apply to SNV"),
])
def test_oncoprint_validates(fake_api, run, kwargs, message):
    assert message in run(oncoprint(**kwargs))["error"]["message"]


def test_lollipop_draws_the_main_transcript(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [{"symbol": "SMARCB1"}])
    fake_sql.on("COUNT(DISTINCT car.patient_id)", [
        {"locus_id": 1, "symbol": "SMARCB1", "transcript_id": "T1", "aa_change": "p.Arg201Ter", "kind": "stop_gained",
         "carriers": 4},
        {"locus_id": 2, "symbol": "SMARCB1", "transcript_id": "T1", "aa_change": "p.Ala150Val",
         "kind": "missense_variant", "carriers": 1},
        {"locus_id": 3, "symbol": "SMARCB1", "transcript_id": "T2", "aa_change": "p.Gly12Asp",
         "kind": "missense_variant", "carriers": 1},
        {"locus_id": 4, "symbol": "SMARCB1", "transcript_id": "T1", "aa_change": None, "kind": "intron_variant",
         "carriers": 1},
        # In SMARCB1, but its picked annotation is the overlapping gene: counted, not drawn.
        {"locus_id": 5, "symbol": "DERL3", "transcript_id": "T9", "aa_change": "p.Leu5Pro",
         "kind": "missense_variant", "carriers": 2},
    ])
    data, _ = _parts(run(lollipop("smarcb1", tenant="demo")))
    assert data["transcript"] == "T1" and data["variants_drawn"] == 2
    assert data["variants_on_other_transcripts"] == 1 and data["variants_without_protein_change"] == 1
    assert data["variants_picked_on_another_gene"] == 1
    assert data["top_variants"][0] == {"aa_change": "p.Arg201Ter", "carriers": 4, "class": "truncating"}


def test_lollipop_draws_a_variant_without_consequences(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [{"symbol": "SMARCB1"}])
    fake_sql.on("COUNT(DISTINCT car.patient_id)", [
        {"locus_id": 1, "symbol": "SMARCB1", "transcript_id": "T1", "aa_change": "p.Arg201Ter", "kind": None,
         "carriers": 2},
    ])
    data, _ = _parts(run(lollipop("smarcb1", tenant="demo")))
    assert data["variants_drawn"] == 1 and data["top_variants"][0]["class"] == "other"


def test_a_failed_render_leaves_no_figure_open():
    import matplotlib.pyplot as plt

    @charts._serialized
    def broken():
        plt.subplots()
        raise ValueError("bad data")

    with pytest.raises(ValueError):
        broken()
    assert plt.get_fignums() == []


# -- patient_timeline / bar_chart ----------------------------------------------------

def test_timeline_items_from_the_patient_page():
    context = {
        "patient": {"events": [{"day": 1000, "event_type": "initial_cns_tumor"}, {"day": None, "event_type": "x"}],
                    "vital_status": "alive", "vital_status_at": {"day": 2000}},
        "treatments": {
            "surgeries": [{"day": 1010, "extent_of_tumor_resection": "Gross/Near total"}],
            "radiations": [{"start": {"day": 1100}, "stop": {"day": 1150}, "site": "Focal"}],
            "therapies": [{"start": {"day": 1060}, "stop": {"day": 1300}, "chemotherapy_agents": ["vincristine"]}],
        },
        "imaging": {"sessions": [{"day": 990}, {"day": 1500}]},
    }
    items = timeline_items(context)
    tracks = [i.track for i in items]
    assert tracks.count("Events") == 2 and tracks.count("Imaging") == 2
    chemo = next(i for i in items if i.track == "Chemotherapy")
    assert chemo.label == "vincristine" and chemo.end > chemo.start


def test_patient_timeline(fake_api, run):
    fake_api.on("patients", "patient_entity", {"patient_key": KEY, "events": [{"day": 1000, "event_type": "progressive"}]})
    fake_api.on("patients", "patient_treatments", {"surgeries": [], "radiations": [], "therapies": []})
    fake_api.on("patients", "patient_imaging", {"sessions": [{"day": 1200}]})
    data, png = _parts(run(patient_timeline(KEY, tenant="demo")))
    assert png.startswith(PNG) and data["items_per_track"] == {"Events": 1, "Imaging": 1}


def test_patient_timeline_rejects_an_mrn(fake_api, run):
    assert "not a patient key" in run(patient_timeline("MRN-1"))["error"]["message"]


def test_bar_chart(run):
    data, png = _parts(run(bar_chart("Carriers", ["missense", "stop_gained"], [3, 1])))
    assert png.startswith(PNG) and data["values"] == {"missense": 3.0, "stop_gained": 1.0}
    assert "one number per category" in run(bar_chart("t", ["a"], [1, 2]))["error"]["message"]
    assert "1 to 50" in run(bar_chart("t", [], []))["error"]["message"]


# -- MCP contract ----------------------------------------------------------------------

def test_a_chart_tool_answers_with_text_and_png_content():
    mcp = FastMCP("t")
    mcp.tool(bar_chart)

    async def call():
        async with Client(mcp) as client:
            return await client.call_tool("bar_chart", {"title": "t", "categories": ["a"], "values": [1]})

    result = asyncio.run(call())
    assert [part.type for part in result.content] == ["text", "image"]
    assert result.content[1].mime_type == "image/png"


def test_family_venn_says_what_the_proband_only_region_holds(fake_api, fake_sql, run, monkeypatch):
    _trio_api(fake_api, monkeypatch)
    fake_sql.on("germline__snv__occurrence", [{"m0": 1, "m1": 0, "m2": 0, "n": 3}])
    data, _ = _parts(run(family_venn(1, tenant="demo")))
    assert data["proband_only"].startswith("de novo candidates (")
    # The father's task has no part: the duo says so instead of silently dropping him.
    _trio_api(fake_api, monkeypatch)
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(10, 20): 5, (14, 20): 5}, None))
    result = run(family_venn(1, tenant="demo"))
    data, _ = _parts(result)
    assert data["members"] == ["Proband", "Mother"] and "not sequenced" in data["proband_only"]
    assert any(w.startswith("father (seq_id=13 ") for w in result["warnings"])


def test_bar_chart_rejects_duplicate_categories(run):
    assert "distinct" in run(bar_chart("t", ["a", "a"], [1, 2]))["error"]["message"]
    assert "distinct" in run(bar_chart("t", ["x" * 60 + "1", "x" * 60 + "2"], [1, 2]))["error"]["message"]


def test_lollipop_stacks_variants_of_one_residue():
    points = [charts.Lollipop(175, "p.Arg175His", 3, "missense"), charts.Lollipop(175, "p.Arg175Cys", 1, "missense"),
              charts.Lollipop(248, "p.Arg248Ter", 2, "truncating")]
    assert charts.lollipop(points, "TP53", "T1").startswith(PNG)


def test_clinical_topic_does_not_point_to_the_case_context():
    from radiant_mcp.schema_catalog import TOPICS

    rules = " ".join(TOPICS["clinical"].rules)
    assert "search_patients" in rules and "get_case_context" not in rules


def test_logrank_ignores_a_group_with_nobody_at_risk_at_the_death_times():
    groups = [
        charts.SurvivalGroup("A", [2, 4, 6, 8, 9, 10], [True] * 6),
        charts.SurvivalGroup("C", [3, 5, 7, 9.5, 11], [True] * 5),
        charts.SurvivalGroup("D", [1.5, 2.5, 12, 13], [True] * 4),
    ]
    early = charts.SurvivalGroup("B", [0.5, 1], [False, False])  # all censored before the first death
    expected = charts.logrank(groups)
    for position in range(4):
        result = charts.logrank(groups[:position] + [early] + groups[position:])
        assert result[1] == 2 and result[2] == pytest.approx(expected[2])
    assert charts.logrank([early, charts.SurvivalGroup("x", [3], [False])]) is None


def test_survival_explains_a_missing_logrank_and_a_cut_cohort(fake_api, fake_sql, run, monkeypatch):
    survival_module = importlib.import_module("radiant_mcp.tools.charts.survival")
    monkeypatch.setattr(survival_module, "PATIENT_LIST_ROW_LIMIT", 3)
    rows = [{"patient_key": _key(i), "survival_days": 100 * i, "vital_status": "alive"} for i in range(1, 5)]
    rows.append({"patient_key": None, "survival_days": 50, "vital_status": "alive"})
    _patients(fake_sql, rows)
    result = run(survival_curve(groups=[{"label": "A", "patient_keys": [_key(1).upper() + "\n"]}],
                                others_label="B", tenant="demo"))
    data, _ = _parts(result)
    assert data["logrank_p"] is None and data["logrank_skipped"] == "no death in any group"
    assert data["definition"]["A"]["not_found_or_not_in_cohort"] == 0  # upper case and newline normalized
    assert "stopped at 3 patients" in result["truncated"]["reason"]
    assert "not representative" in result["truncated"]["reason"]


def test_survival_overlap_counts_only_drawn_patients(fake_api, fake_sql, run):
    rows = [{"patient_key": _key(i), "survival_days": 100 * i, "vital_status": "deceased"} for i in range(1, 7)]
    rows.append({"patient_key": _key(9), "survival_days": None, "vital_status": "alive"})
    _patients(fake_sql, rows)
    data, _ = _parts(run(survival_curve(groups=[
        {"label": "A", "patient_keys": [_key(1), _key(2), _key(3), _key(9)]},
        {"label": "B", "patient_keys": [_key(4), _key(5), _key(6), _key(9)]},
    ], tenant="demo")))
    assert data["overlapping_patients"] == 0 and data["logrank_p"] is not None


def test_survival_warns_when_non_carriers_include_patients_not_genotyped(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [{"symbol": "TP53"}])
    rows = [{"patient_key": _key(i), "radiant_patient_id": i, "case_count": 1 if i < 5 else 0,
             "survival_days": 100 * i, "vital_status": "deceased"} for i in range(1, 9)]
    _patients(fake_sql, rows)
    fake_sql.on("SELECT DISTINCT patient_id FROM car", [{"patient_id": "1"}, {"patient_id": "2"}])
    # Patients 1-3 have an imported germline SNV analysis; 4 has a case but no analysis yet.
    fake_sql.on("SELECT DISTINCT s.patient_id", [{"patient_id": i} for i in (1, 2, 3)])
    result = run(survival_curve(groups=[{"label": "TP53", "carriers": {"gene": "TP53"}}],
                                others_label="Others", tenant="demo"))
    data, _ = _parts(result)
    assert data["definition"]["Others"]["patients_not_genotyped"] == 5
    assert any("sequenced_only=True" in w for w in result["warnings"])


def test_survival_resolves_genes_before_reading_patients(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [])
    result = run(survival_curve(groups=[{"label": "X", "carriers": {"gene": "NOPE1"}}], others_label="Rest",
                                tenant="demo"))
    # not_found, like cohort_carriers, lollipop and gene_info.
    assert result["error"]["code"] == "not_found" and "not found" in result["error"]["message"]
    assert _searches(fake_sql) == []


def test_survival_reports_gene_search_errors_as_errors(fake_api, run):
    fake_api.on("genes", "gene_search", api_exception(503))
    result = run(survival_curve(groups=[{"label": "X", "carriers": {"gene": "TP53"}}], others_label="Rest",
                                tenant="demo"))
    assert result["ok"] is False and "503" in result["error"]["message"]


def test_survival_combines_cohort_and_group_filters_in_one_search(fake_api, fake_sql, run):
    rows = [{"patient_key": _key(i), "survival_days": 100 * i, "vital_status": "deceased"} for i in range(1, 5)]
    _patients(fake_sql, rows)
    run(survival_curve(groups=[{"label": "A", "filters": {"vital_status": "deceased"}},
                               {"label": "B", "filters": {"organization_code": "X"}}],
                       cohort_filters={"diagnosis_type_cohort": "MB"}, tenant="demo"))
    fields = [set(re.findall(r"pl\.(\w+) IN \(", sql)) for sql, _ in _searches(fake_sql)]
    assert {"diagnosis_type_cohort", "vital_status"} in fields
    assert {"diagnosis_type_cohort", "organization_code"} in fields


def test_survival_keeps_both_conditions_on_an_array_field(fake_api, fake_sql, run):
    # Cohort and group on chemotherapy_agents: both overlaps, never an empty intersection.
    _patients(fake_sql, [{"patient_key": _key(1), "survival_days": 100, "vital_status": "deceased"}])
    data, _ = _parts(run(survival_curve(groups=[{"label": "Carboplatin", "filters": {"chemotherapy_agents": ["carboplatin"]}}],
                                        cohort_filters={"chemotherapy_agents": ["vincristine", "cisplatin"]},
                                        others_label="Others", tenant="demo")))
    group_sql = [sql for sql, _ in _searches(fake_sql) if sql.count("arrays_overlap") == 2]
    assert group_sql and data["groups"][0]["patients"] == 1


def test_survival_names_an_empty_group(fake_api, run):
    result = run(survival_curve(groups=[{"label": "Arm B", "patient_keys": []}], others_label="Rest", tenant="demo"))
    assert "the group is empty" in result["error"]["message"] and fake_api.calls == []


def test_dollar_signs_in_titles_and_labels_are_plain_text(run):
    png, _ = charts.survival([charts.SurvivalGroup("_rest $x_$", [1, 2], [True, False])], "Cost $x_$ per $5")
    assert png.startswith(PNG)
    _, png = _parts(run(bar_chart("a $x_$ b", ["$a", "b$"], [1, 2])))
    assert png.startswith(PNG)


def test_lollipop_says_when_it_capped_the_variants(fake_api, fake_sql, run, monkeypatch):
    lollipop_module = importlib.import_module("radiant_mcp.tools.charts.lollipop")
    monkeypatch.setattr(lollipop_module, "LOLLIPOP_ROW_LIMIT", 2)
    fake_api.on("genes", "gene_search", [{"symbol": "SMARCB1"}])
    fake_sql.on("COUNT(DISTINCT car.patient_id)", [
        {"locus_id": i, "symbol": "SMARCB1", "transcript_id": "T1", "aa_change": f"p.Arg{i}Ter",
         "kind": "stop_gained", "carriers": 5 - i} for i in range(1, 4)])
    result = run(lollipop("smarcb1", tenant="demo"))
    assert result["data"]["variants_drawn"] == 2 and "most carriers" in result["truncated"]["reason"]
