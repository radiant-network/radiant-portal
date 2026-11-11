from conftest import PORTAL, api_exception

from radiant_mcp.tools.variants import variant_carriers, variant_details


def _variant_api(fake_api):
    fake_api.on("variants", "get_germline_variant_header", {"hgvsg": "chr1:g.1A>T"})
    fake_api.on("variants", "get_germline_variant_overview", {"symbol": "SCN1A"})
    fake_api.on("variants", "get_germline_variant_consequences", [{
        "symbol": "SCN1A",
        "transcripts": [{"transcript_id": f"T{i}", "is_mane_select": i == 2} for i in range(5)],
    }])
    fake_api.on("variants", "get_germline_variant_external_frequencies", {"external_frequencies": []})
    fake_api.on("variants", "get_germline_variant_global_internal_frequencies", {"pc_all": 3})
    fake_api.on("variants", "get_germline_variant_conditions_clinvar", api_exception(500))


def test_details_keep_key_transcripts_and_report_failed_sections(fake_api, run):
    _variant_api(fake_api)
    result = run(variant_details("42", tenant="radiant"))
    assert result["portal_url"] == f"{PORTAL}/radiant/variants/entity/42"
    [gene] = result["data"]["consequences"]
    assert [t["transcript_id"] for t in gene["transcripts"]] == ["T2"] and gene["other_transcripts"] == 4
    assert result["data"]["internal_frequencies"] == {"pc_all": 3}
    assert result["warnings"] == ["clinvar: Radiant API error 500: error"]
    assert "occurrence" not in result["data"]


def test_details_accept_a_numeric_locus_id(fake_api, run):
    # second_hit and the cohort tools return locus_id as a number.
    _variant_api(fake_api)
    result = run(variant_details(42, tenant="radiant"))
    assert result["ok"] and result["portal_url"] == f"{PORTAL}/radiant/variants/entity/42"
    assert fake_api.kwargs("get_germline_variant_header")["locus_id"] == "42"


def test_details_keep_the_picked_transcript(fake_api, run):
    _variant_api(fake_api)
    fake_api.on("variants", "get_germline_variant_overview", {"transcript_id": "T4"})
    result = run(variant_details("42", tenant="radiant"))
    assert [t["transcript_id"] for t in result["data"]["consequences"][0]["transcripts"]] == ["T2", "T4"]


def test_details_with_an_occurrence_key(fake_api, run):
    _variant_api(fake_api)
    fake_api.on("occurrences", "get_expanded_somatic_snv_occurrence", {"locus_id": "42"})
    result = run(variant_details("42", tenant="radiant", case_id=8, seq_id=21, task_id=3, data_type="somatic_snv_tn"))
    assert result["data"]["occurrence"]["portal_url"].endswith("variant_section=snv-tn&selectedVariant=42")


def test_details_need_the_whole_key(fake_api, run):
    assert "together" in run(variant_details("42", case_id=8))["error"]["message"]
    assert fake_api.calls == []


def test_unknown_variant(fake_api, run):
    fake_api.on("variants", "get_germline_variant_header", api_exception(404))
    assert run(variant_details("42", tenant="radiant"))["error"]["code"] == "not_found"


def test_carriers(fake_api, run):
    fake_api.on("variants", "get_germline_variant_cases_count", {"count_interpreted": 1, "count_uninterpreted": 1})
    fake_api.on("variants", "get_germline_variant_interpreted_cases", {"count": 1, "list": [{"case_id": 8, "seq_id": 21}]})
    fake_api.on("variants", "get_germline_variant_uninterpreted_cases", {"count": 1, "list": [{"case_id": 9}]})
    result = run(variant_carriers("42", tenant="radiant", limit=1000))
    assert result["data"]["interpreted_cases"][0]["portal_url"].endswith("seq_id=21&variant_section=snv&selectedVariant=42")
    assert result["data"]["uninterpreted_cases"][0]["portal_url"] == f"{PORTAL}/radiant/case/entity/9"
    assert fake_api.kwargs("get_germline_variant_interpreted_cases")["list_body_with_criteria"].limit == 100
