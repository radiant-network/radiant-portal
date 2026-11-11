from conftest import PORTAL, api_exception, bound_value

from radiant_mcp.services import cases as case_service
from radiant_mcp.tools.cases import get_case_context, search_cases


def test_search_cases_links_each_case(fake_api, run):
    fake_api.on("cases", "search_cases", {"count": 1, "list": [{"case_id": 1131}]})
    result = run(search_cases(filters={"status_code": "active"}, tenant="pragmatiq"))
    assert result["data"]["cases"][0]["portal_url"] == f"{PORTAL}/pragmatiq/case/entity/1131"


def test_search_cases_by_identifier_caps_the_merged_list(fake_api, run):
    fake_api.on("cases", "autocomplete_cases", [{"type": "mrn", "value": "GM1"}, {"type": "case_id", "value": "7"}])
    offsets = []

    def search(list_body_with_criteria, **_):
        offsets.append(list_body_with_criteria.offset)
        return {"count": 150, "list": [{"case_id": 7}, {"case_id": 8}]}

    fake_api.on("cases", "search_cases", search)
    result = run(search_cases(query="GM1", tenant="t", limit=1, offset=40))
    data = result["data"]
    assert data["returned"] == 1 and [c["case_id"] for c in data["cases"]] == [7]
    # Past one page the exact total of several merged searches is unknown: a lower bound.
    assert "count" not in data and data["count_at_least"] == 150
    assert "longer identifier" in result["truncated"]["reason"]
    # Pages of several searches cannot be merged: offset does not apply to a query.
    assert offsets == [0, 0]


def test_search_cases_by_identifier_counts_a_complete_merge(fake_api, run):
    fake_api.on("cases", "autocomplete_cases", [{"type": "mrn", "value": "GM1"}, {"type": "case_id", "value": "7"}])
    fake_api.on("cases", "search_cases", {"count": 1, "list": [{"case_id": 7}]})
    result = run(search_cases(query="GM1", tenant="t"))
    assert result["data"]["count"] == 1 and "count_at_least" not in result["data"] and result.get("truncated") is None


def test_search_cases_validates_before_calling(fake_api, run):
    assert "Unknown filter" in run(search_cases(filters={"foo": 1}, tenant="t"))["error"]["message"]
    assert fake_api.calls == []


def test_case_context_links_the_case_members_and_keys(fake_api, run, monkeypatch):
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(21, 3): 154}, None))
    fake_api.on("cases", "case_entity", {
        "case_id": 8,
        "case_type": "germline",
        "members": [{"patient_id": 1, "patient_key": "k-1"}, {"patient_id": 2}],
        "sequencing_experiments": [{"seq_id": 21, "has_variants": True}],
    })
    fake_api.on("cases", "case_tasks_with_occurrences",
                lambda data_type, **_: [{"id": 3}] if data_type == "germline_snv" else [])

    result = run(get_case_context(8, tenant="radiant"))

    case = result["data"]["case"]
    assert case["portal_url"] == f"{PORTAL}/radiant/case/entity/8"
    assert case["members"][0]["portal_url"] == f"{PORTAL}/radiant/patient/entity/k-1"
    assert "portal_url" not in case["members"][1]
    [key] = result["data"]["occurrence_keys"]
    assert key["part"] == 154 and key["variant_part"] == 15
    assert key["portal_url"] == f"{PORTAL}/radiant/case/entity/8?tab=variants&seq_id=21&task_id=3&variant_section=snv"
    assert result["warnings"] == [] and result["portal_url"] == f"{PORTAL}/radiant/case/entity/8"


def test_a_task_not_imported_yet_has_no_part(fake_sql):
    # The ETL stages a re-analysis at the epoch and loads its occurrences later.
    fake_sql.on("staging_sequencing_experiment", [
        {"seq_id": 21, "task_id": 3, "part": 154, "imported": 1},
        {"seq_id": 21, "task_id": 5, "part": 154, "imported": 0},
        {"seq_id": 22, "task_id": 6, "part": 154, "imported": None},
    ])
    assert case_service.lookup_parts("jwt", 1131) == ({(21, 3): 154, (21, 5): None, (22, 6): None}, None)
    ((sql, values),) = fake_sql.queries
    assert bound_value(sql, values, "ingested_at > ") == "1970-01-01 00:00:00"


def test_case_context_lists_a_task_not_imported_yet_last(fake_api, run, monkeypatch):
    # The portal lists tasks newest first; the re-analysis 4 is not loaded yet.
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({(21, 4): None, (21, 3): 154}, None))
    fake_api.on("cases", "case_entity", {"case_id": 8, "case_type": "germline", "members": [],
                                          "sequencing_experiments": [{"seq_id": 21, "has_variants": True}]})
    fake_api.on("cases", "case_tasks_with_occurrences",
                lambda data_type, **_: [{"id": 4}, {"id": 3}] if data_type == "germline_snv" else [])
    result = run(get_case_context(8, tenant="radiant"))
    keys = result["data"]["occurrence_keys"]
    assert [(k["task_id"], k.get("imported"), k.get("part")) for k in keys] == [(3, None, 154), (4, False, None)]
    assert any("task_id=4: not imported yet" in w for w in result["warnings"])


def test_part_lookup_binds_the_case_and_skips_tasks_without_part(fake_sql):
    from radiant_mcp import sql as _sql

    fake_sql.on("staging_sequencing_experiment", [
        {"seq_id": 21, "task_id": 3, "part": 154}, {"seq_id": 22, "task_id": 4, "part": None},
    ])
    assert case_service.lookup_parts("jwt", 1131) == ({(21, 3): 154}, None)
    ((sql, values),) = fake_sql.queries
    assert "radiant.staging_sequencing_experiment" in sql and 1131 in values.values()
    fake_sql.on("staging_sequencing_experiment", _sql.SqlError("Access denied"))
    fake_sql.rules.reverse()
    assert case_service.lookup_parts("jwt", 1131) == ({}, "part lookup failed: StarRocks error: Access denied")


def _criteria_of(body) -> dict:
    return {d["field"]: d["value"] for d in (c.to_dict() for c in body.search_criteria)}


def test_search_cases_finds_a_case_by_sample_id(fake_api, run):
    searched = []
    fake_api.on("cases", "autocomplete_cases", [{"type": "proband_submitter_sample_ids", "value": "S12345"}])
    fake_api.on("cases", "search_cases", lambda list_body_with_criteria, **_: (
        searched.append(_criteria_of(list_body_with_criteria)) or {"count": 1, "list": [{"case_id": 7}]}))
    result = run(search_cases(query="S12345", tenant="t"))
    assert searched == [{"proband_submitter_sample_ids": ["S12345"]}]
    assert [c["case_id"] for c in result["data"]["cases"]] == [7]


def test_search_cases_intersects_a_filter_with_a_match_on_the_same_field(fake_api, run):
    searched = []
    fake_api.on("cases", "autocomplete_cases", [{"type": "patient_id", "value": "12"}, {"type": "case_id", "value": "12"}])
    fake_api.on("cases", "search_cases", lambda list_body_with_criteria, **_: (
        searched.append(_criteria_of(list_body_with_criteria)) or {"count": 0, "list": []}))
    run(search_cases(query="12", filters={"patient_id": [5]}, tenant="t"))
    # patient_id 12 and the filter patient_id 5 have nothing in common: no search for that match.
    assert searched == [{"patient_id": [5], "case_id": [12]}]


def test_search_cases_rejects_a_retired_field(fake_api, run):
    result = run(search_cases(filters={"resolution_status_code": "solved"}, tenant="t"))
    assert "Unknown filter field" in result["error"]["message"] and "project_name" in result["error"]["details"]["allowed"]
    assert "Unknown sort field" in run(search_cases(query="1", sort_by="resolution_status_code", tenant="t"))["error"]["message"]
    assert fake_api.calls == []


def test_a_family_case_asks_for_the_germline_data_types_only(fake_api, run, monkeypatch):
    # The portal returns `germline_family` for a germline case with several members.
    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({}, None))
    fake_api.on("cases", "case_entity", {"case_id": 8, "case_type": "germline_family", "members": [],
                                          "sequencing_experiments": [{"seq_id": 21, "has_variants": True}]})
    fake_api.on("cases", "case_tasks_with_occurrences", [])
    run(get_case_context(8, tenant="radiant"))
    asked = sorted(kw["data_type"] for _, op, kw in fake_api.calls if op == "case_tasks_with_occurrences")
    assert asked == ["germline_cnv", "germline_snv"]


def test_the_task_lookups_run_side_by_side_and_keep_their_order(fake_api, run, monkeypatch):
    import threading
    import time

    monkeypatch.setattr(case_service, "lookup_parts", lambda token, case_id: ({}, None))
    fake_api.on("cases", "case_entity", {"case_id": 8, "case_type": "germline", "members": [],
                                         "sequencing_experiments": [{"seq_id": s, "has_variants": True}
                                                                    for s in (21, 22, 23)]})
    threads = set()

    def tasks(seq_id, data_type, **_):
        threads.add(threading.get_ident())
        time.sleep(0.05)
        if (seq_id, data_type) == (22, "germline_cnv"):
            raise api_exception(500)
        return [{"id": seq_id * 10 + (data_type == "germline_cnv")}]

    fake_api.on("cases", "case_tasks_with_occurrences", tasks)
    result = run(get_case_context(8, tenant="radiant"))
    keys = [(k["seq_id"], k["data_type"], k["task_id"]) for k in result["data"]["occurrence_keys"]]
    # Sequencing order, then data type order, whatever order the lookups finished in.
    assert keys == [(21, "germline_snv", 210), (21, "germline_cnv", 211), (22, "germline_snv", 220),
                    (23, "germline_snv", 230), (23, "germline_cnv", 231)]
    assert [w for w in result["warnings"] if "data_type=" in w] == [
        "seq_id=22 data_type=germline_cnv: Radiant API error 500: error"]
    assert len(threads) > 1


def test_an_autocomplete_at_its_cap_makes_the_count_a_lower_bound(fake_api, run):
    # 101 matches asked: past the cap of 100, some identifiers were never searched.
    fake_api.on("cases", "autocomplete_cases", [{"type": "case_id", "value": str(i)} for i in range(101)])
    fake_api.on("cases", "search_cases", {"count": 100, "list": [{"case_id": i} for i in range(100)]})
    result = run(search_cases(query="1", tenant="t", limit=100))
    assert fake_api.kwargs("autocomplete_cases")["limit"] == "101"
    assert "count" not in result["data"] and result["data"]["count_at_least"] == 100
    assert result["truncated"] is not None
    search = fake_api.kwargs("search_cases")["list_body_with_criteria"]
    assert len(search.search_criteria[0].value) == 100


def test_a_case_filter_without_a_value_is_rejected_before_any_call(fake_api, run):
    result = run(search_cases(filters={"status_code": []}, tenant="t"))
    assert result["error"]["code"] == "invalid_input" and fake_api.calls == []
