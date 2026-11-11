import pytest
from conftest import PORTAL, serialized

from radiant_mcp.tools.occurrences import FilterError, case_cnv, normalize_filters, normalize_sort, prioritize_snv

KEY = {"case_id": 8, "seq_id": 21, "task_id": 3}


def test_shorthand_filters_become_in_leaves():
    assert normalize_filters({"symbol": "BRCA1", "zygosity": ["het", "Hom"]}) == [
        {"field": "symbol", "op": "in", "value": ["BRCA1"]},
        {"field": "zygosity", "op": "in", "value": ["HET", "HOM"]},
    ]


def test_one_filter_object_without_its_list_is_one_filter():
    # Seen in QA: read as the shorthand, it filtered on fields named `field` and `value`.
    assert normalize_filters({"field": "transmission_mode", "value": ["autosomal_dominant_de_novo"]}) == [
        {"field": "transmission_mode", "op": "in", "value": ["autosomal_dominant_de_novo"]},
    ]
    assert normalize_filters({"field": "clinvar", "op": "all", "value": ["pathogenic"]}) == [
        {"field": "clinvar", "op": "all", "value": ["Pathogenic"]},
    ]


def test_acmg_classification_is_matched_case_insensitively():
    leaves = normalize_filters([{"field": "exomiser_acmg_classification", "value": ["PATHOGENIC", "LIKELY_PATHOGENIC"]}])
    assert leaves[0]["value"] == ["pathogenic", "likely_pathogenic"]


@pytest.mark.parametrize("filters, message", [
    ([{"field": "x", "op": "~", "value": 1}], "Unknown operator"),
    ([{"field": "x", "op": "<", "value": [1, 2]}], "exactly one value"),
    ([{"field": "x", "op": "between", "value": [1]}], "exactly two values"),
    ([{"field": "x", "value": []}], "at least one"),
    ([{"field": "x", "value": None}], "at least one"),
    ([{"op": "in", "value": 1}], "without a `field`"),
    (["symbol"], "must be an object"),
    ("symbol", "must be a list"),
])
def test_invalid_filters(filters, message):
    with pytest.raises(FilterError, match=message):
        normalize_filters(filters)


def test_ambiguous_enum_value_expands_only_for_or_operators():
    value = ["PATHOGENIC_LOW_PENETRANCE"]
    assert normalize_filters([{"field": "clinvar", "op": "in", "value": value}])[0]["value"] == [
        "pathogenic_low_penetrance", "Pathogenic_low_penetrance",
    ]
    assert normalize_filters([{"field": "clinvar", "op": "all", "value": value}])[0]["value"] == value
    assert normalize_filters([{"field": "clinvar", "op": "all", "value": ["pathogenic"]}])[0]["value"] == ["Pathogenic"]


def test_sort_defaults_to_desc_and_rejects_unknown_orders():
    assert normalize_sort([{"field": "max_impact_score"}]) == [{"field": "max_impact_score", "order": "desc"}]
    with pytest.raises(FilterError):
        normalize_sort([{"field": "x", "order": "up"}])


def test_prioritize_snv_sends_the_portal_query_and_links_each_row(fake_api, run):
    fake_api.on("occurrences", "count_germline_snv_occurrences", {"count": 57})
    fake_api.on("occurrences", "list_germline_snv_occurrences", [{"locus_id": "42", "symbol": "SCN1A", "gnomad_v3_af": None}])

    result = run(prioritize_snv(
        **KEY, tenant="radiant",
        filters=[{"field": "vep_impact", "value": ["high"]}, {"field": "ad_ratio", "op": "between", "value": [0.2, 0.8]}],
        sort=[{"field": "max_impact_score"}], limit=500, additional_fields=["transmission_mode"],
    ))

    assert result["data"]["count"] == 57 and result["data"]["returned"] == 1
    body = serialized(fake_api.kwargs("list_germline_snv_occurrences")["list_body_with_sqon"])
    assert body == {
        "additional_fields": ["transmission_mode"],
        "limit": 100,
        "offset": 0,
        "sort": [{"field": "max_impact_score", "order": "desc"}],
        "sqon": {"op": "and", "content": [
            {"op": "in", "content": {"field": "vep_impact", "value": ["HIGH"]}},
            {"op": "between", "content": {"field": "ad_ratio", "value": [0.2, 0.8]}},
        ]},
    }
    assert fake_api.kwargs("list_germline_snv_occurrences")["case_id"] == 8
    row = result["data"]["occurrences"][0]
    assert row["portal_url"] == (
        f"{PORTAL}/radiant/case/entity/8?tab=variants&seq_id=21&task_id=3&variant_section=snv&selectedVariant=42"
    )
    assert row["variant_portal_url"] == f"{PORTAL}/radiant/variants/entity/42"
    assert result["portal_url"].endswith("variant_section=snv")


def test_prioritize_snv_without_filters_sends_an_empty_and(fake_api, run):
    fake_api.on("occurrences", "count_somatic_snv_occurrences", {"count": 0})
    fake_api.on("occurrences", "list_somatic_snv_occurrences", [])
    result = run(prioritize_snv(**KEY, data_type="somatic_snv_to", tenant="radiant"))
    body = serialized(fake_api.kwargs("list_somatic_snv_occurrences")["list_body_with_sqon"])
    assert body["sqon"] == {"op": "and", "content": []}
    assert "sort" not in body
    assert result["data"]["occurrences"] == []


def test_prioritize_snv_rejects_cnv_data_types(fake_api, run):
    assert "Unknown data_type" in run(prioritize_snv(**KEY, data_type="germline_cnv"))["error"]["message"]
    assert fake_api.calls == []


def test_invalid_filter_is_reported_without_calling_the_api(fake_api, run):
    assert "Unknown operator" in run(prioritize_snv(**KEY, filters=[{"field": "x", "op": "like", "value": 1}]))["error"]["message"]
    assert fake_api.calls == []


def test_case_cnv_links_to_the_cnv_table(fake_api, run):
    fake_api.on("occurrences", "count_germline_cnv_occurrences", {"count": 1})
    fake_api.on("occurrences", "list_germline_cnv_occurrences", [{"cnv_id": "c1", "type": "LOSS"}])
    result = run(case_cnv(**KEY, tenant="radiant", filters={"type": "loss"}))
    body = serialized(fake_api.kwargs("list_germline_cnv_occurrences")["list_body_with_sqon"])
    assert body["sqon"]["content"] == [{"op": "in", "content": {"field": "type", "value": ["LOSS"]}}]
    row = result["data"]["occurrences"][0]
    assert row["portal_url"].endswith("variant_section=cnv")
    assert "selectedVariant" not in row["portal_url"]
    assert "variant_portal_url" not in row


def test_api_errors_become_tool_errors(fake_api, run):
    from conftest import api_exception

    fake_api.on("occurrences", "count_germline_snv_occurrences", api_exception(400, '{"message":"unknown field: foo"}'))
    result = run(prioritize_snv(**KEY, tenant="radiant", filters={"foo": 1}))
    assert result["error"]["code"] == "invalid_input"
    assert result["error"]["details"]["status"] == 400 and "unknown field" in result["error"]["details"]["body"]


def test_no_token_no_call(fake_api, run, monkeypatch):
    from radiant_mcp import portal_api as _api

    monkeypatch.setattr(_api, "get_jwt_token", lambda: None)
    assert run(prioritize_snv(**KEY))["error"]["code"] == "auth_required"
    assert fake_api.calls == []


def test_an_unsortable_field_is_rejected_before_any_call(fake_api, run):
    result = run(prioritize_snv(case_id=1, seq_id=2, task_id=3, sort=[{"field": "cadd_phred"}], tenant="demo"))
    assert "Cannot sort on 'cadd_phred'" in result["error"]["message"] and "exomiser_gene_combined_score" in result["error"]["message"]
    result = run(prioritize_snv(case_id=1, seq_id=2, task_id=3, data_type="somatic_snv_tn",
                                sort=[{"field": "max_impact_score"}], tenant="demo"))
    assert "Cannot sort on 'max_impact_score'" in result["error"]["message"]
    assert fake_api.calls == []
