import pytest
from conftest import PORTAL, api_exception, serialized

from radiant_mcp.tools.patients import get_patient_context, search_patients

KEY = "0f8fad5b-d9cb-469f-a165-70867728950e"
OTHER = "1f8fad5b-d9cb-469f-a165-70867728950e"


def _patient(key):
    return {"patient_key": key, "patient_id": "MRN1", "can_read_phi": True}


def test_search_by_identifier_merges_autocomplete_matches(fake_api, run):
    fake_api.on("patients", "autocomplete_patients", [
        {"type": "patient_id", "value": "MRN1"}, {"type": "patient_name", "value": "Doe"},
    ])
    # The same patient matches by identifier and by name: it is returned once.
    fake_api.on("patients", "search_patients", {"count": 1, "list": [_patient(KEY)]})
    result = run(search_patients(query="MRN", tenant="radiant"))
    assert result["data"]["count"] == 1 and result["data"]["returned"] == 1 and result.get("truncated") is None
    assert result["data"]["patients"][0]["portal_url"] == f"{PORTAL}/radiant/patient/entity/{KEY}"
    fields = sorted(kw["list_body_with_criteria"].search_criteria[0].var_field
                    for api, op, kw in fake_api.calls if op == "search_patients")
    assert fields == ["patient_id", "patient_name"]


def test_search_by_filters_with_filter_values(fake_api, run):
    fake_api.on("patients", "search_patients", {"count": 3, "list": [_patient(KEY)]})
    fake_api.on("patients", "patients_filters", {"vital_status": [{"key": "Deceased"}]})
    result = run(search_patients(
        filters={"vital_status": "Deceased"}, tenant="radiant", sort_by="survival_days", include_filter_values=True,
    ))
    body = serialized(fake_api.kwargs("search_patients")["list_body_with_criteria"])
    assert body["search_criteria"] == [{"field": "vital_status", "value": ["Deceased"]}]
    assert body["sort"] == [{"field": "survival_days", "order": "asc"}]
    assert result["data"]["count"] == 3 and result["data"]["filter_values"]["vital_status"][0]["key"] == "Deceased"


@pytest.mark.parametrize("kwargs, message", [
    ({"filters": {"mrn": "1"}}, "Unknown filter"),
    ({"sort_by": "name"}, "Unknown sort"),
    ({"sort_order": "up"}, "sort_order"),
])
def test_search_validates_inputs_before_calling(fake_api, run, kwargs, message):
    assert message in run(search_patients(tenant="radiant", **kwargs))["error"]["message"]
    assert fake_api.calls == []


def test_failing_filter_values_keep_the_search_results(fake_api, run):
    fake_api.on("patients", "search_patients", {"count": 1, "list": [_patient(KEY)]})
    fake_api.on("patients", "patients_filters", api_exception(500))
    result = run(search_patients(filters={"vital_status": "Alive"}, tenant="radiant", include_filter_values=True))
    assert result["data"]["returned"] == 1 and "filter_values" not in result["data"]
    assert result["warnings"] == ["filter_values: Radiant API error 500: error"]


def test_patient_view_disabled_means_no_clinical_data(fake_api, run):
    fake_api.on("patients", "search_patients", api_exception(404, "404 page not found"))
    result = run(search_patients(filters={"vital_status": "Alive"}, tenant="pragmatiq"))
    assert result["error"]["code"] == "unavailable"
    assert "pragmatiq" in result["error"]["message"] and "not enabled" in result["error"]["message"]


def test_context_rejects_an_identifier_that_is_not_a_key(fake_api, run):
    assert "search_patients" in run(get_patient_context("GM221891", tenant="radiant"))["error"]["message"]
    assert fake_api.calls == []


def test_context_rejects_unknown_sections(fake_api, run):
    assert "Unknown section" in run(get_patient_context(KEY, tenant="radiant", sections=["notes"]))["error"]["message"]


def test_context_loads_the_sections_and_links_them(fake_api, run):
    fake_api.on("patients", "patient_entity", _patient(KEY))
    fake_api.on("patients", "patient_treatments", {"surgeries": []})
    fake_api.on("patients", "patient_laboratory", api_exception(500, '{"message":"Internal Server Error"}'))
    fake_api.on("patients", "patient_genomics", {
        "cases": [{"case_id": 8}],
        "interpretations": [
            {"case_id": 8, "sequencing_id": 21, "locus_id": "42", "origin": "germline"},
            {"case_id": 9, "sequencing_id": 22, "locus_id": "43", "origin": "somatic"},
        ],
    })
    result = run(get_patient_context(KEY, tenant="radiant", sections=["treatments", "laboratory", "genomics"]))

    assert result["data"]["patient"]["portal_url"] == f"{PORTAL}/radiant/patient/entity/{KEY}"
    assert result["data"]["treatments"]["portal_url"].endswith("?tab=treatments")
    assert "laboratory" not in result["data"] and result["warnings"] == ["laboratory: Radiant API error 500: error"]
    genomics = result["data"]["genomics"]
    assert genomics["portal_url"].endswith("?tab=genomics")
    assert genomics["cases"][0]["portal_url"] == f"{PORTAL}/radiant/case/entity/8"
    germline, somatic = genomics["interpretations"]
    assert germline["portal_url"].endswith("seq_id=21&variant_section=snv&selectedVariant=42")
    assert somatic["portal_url"] == f"{PORTAL}/radiant/case/entity/9?tab=variants"
    assert somatic["variant_portal_url"] == f"{PORTAL}/radiant/variants/entity/43"
    assert result["data"]["case_ids"] == [8]


@pytest.fixture
def no_default_sections(monkeypatch):
    # An empty `sections` loads the default ones: without them the patient entity is the only call.
    from radiant_mcp.tools import patients
    monkeypatch.setattr(patients, "DEFAULT_SECTIONS", ())


def test_context_accepts_an_upper_case_key(fake_api, run, no_default_sections):
    fake_api.on("patients", "patient_entity", _patient(KEY))
    result = run(get_patient_context(KEY.upper(), tenant="radiant", sections=[]))
    assert fake_api.kwargs("patient_entity")["patient_key"] == KEY and result["warnings"] == []


def test_context_strips_a_pasted_key(fake_api, run, no_default_sections):
    fake_api.on("patients", "patient_entity", _patient(KEY))
    result = run(get_patient_context(KEY + "\n", tenant="radiant", sections=[]))
    assert fake_api.kwargs("patient_entity")["patient_key"] == KEY and result["warnings"] == []


def test_context_for_an_unknown_patient(fake_api, run):
    fake_api.on("patients", "patient_entity", api_exception(404, '{"status":404,"message":"patient not found"}'))
    result = run(get_patient_context(OTHER, tenant="radiant"))
    assert result["error"]["code"] == "not_found" and "not found" in result["error"]["message"]


def test_context_for_a_tenant_without_patient_views(fake_api, run):
    fake_api.on("patients", "patient_entity", api_exception(
        500, '{"status":500,"message":"Internal Server Error"}', {"X-Correlation-ID": "abc"},
    ))
    result = run(get_patient_context(KEY, tenant="pragmatiq"))
    assert result["error"] == {
        "code": "unavailable",
        "message": "No clinical data for tenant pragmatiq: the tenant's patient views could not be read "
                   "(they may not exist for this tenant, or the portal had a transient error: "
                   "retry once before concluding).",
        "details": {"tenant": "pragmatiq", "correlation_id": "abc"},
    }


def test_tenant_is_resolved_from_memberships(fake_api, run):
    fake_api.on("auth", "get_me", [{"code": "a", "name": "A"}, {"code": "b", "name": "B"}])
    result = run(get_patient_context(KEY))
    assert result["error"]["code"] == "ambiguous_tenant" and "several tenants" in result["error"]["message"]
    assert [t["code"] for t in result["error"]["details"]["tenants"]] == ["a", "b"]


def test_a_refused_token_fails_the_patient_context_instead_of_one_section(fake_api, run):
    # A 401 on a section is not a partial failure: every section would fail the same way.
    fake_api.on("patients", "patient_entity", _patient(KEY))
    fake_api.on("patients", "patient_treatments", api_exception(401))
    result = run(get_patient_context(KEY, tenant="radiant", sections=["treatments"]))
    assert result["ok"] is False and result["error"]["code"] == "auth_required"


def test_a_matching_patient_without_a_key_is_left_out_with_a_warning(fake_api, run):
    # A patient not in the portal's key table yet has a NULL patient_key (dropped by compact).
    fake_api.on("patients", "autocomplete_patients", [{"type": "patient_id", "value": "MRN1"}])
    fake_api.on("patients", "search_patients", {"count": 2, "list": [_patient(KEY), {"patient_id": "MRN1"}]})
    result = run(search_patients(query="MRN", tenant="radiant"))
    assert result["ok"] is True and [p["patient_key"] for p in result["data"]["patients"]] == [KEY]
    assert any("no patient key yet" in w for w in result["warnings"])


def test_a_patient_without_a_key_is_left_out_of_a_filter_search_too(fake_api, run):
    fake_api.on("patients", "search_patients", {"count": 2, "list": [_patient(KEY), {"patient_id": "MRN2"}]})
    result = run(search_patients(filters={"vital_status": "alive"}, tenant="radiant"))
    assert [p["patient_key"] for p in result["data"]["patients"]] == [KEY] and result["data"]["returned"] == 1
    assert any("no patient key yet" in w for w in result["warnings"])


@pytest.mark.parametrize("status, code", [(500, "unavailable"), (502, "upstream"), (503, "upstream"),
                                          (504, "upstream")])
def test_only_a_500_means_no_clinical_data(fake_api, run, status, code):
    # The portal answers 500 when the tenant's patient views do not exist; a gateway error or
    # an outage is not the tenant's data.
    fake_api.on("patients", "search_patients", api_exception(status))
    assert run(search_patients(filters={"vital_status": "alive"}, tenant="radiant"))["error"]["code"] == code


@pytest.mark.parametrize("filters", [{"vital_status": []}, {"vital_status": None}, {"vital_status": ["alive", None]}])
def test_a_filter_without_a_value_is_rejected_before_any_call(fake_api, run, filters):
    # The portal would build `vital_status IN ()`, a StarRocks 500.
    result = run(search_patients(filters=filters, tenant="radiant"))
    assert result["error"]["code"] == "invalid_input" and "without a value" in result["error"]["message"]
    assert fake_api.calls == []


def test_a_filter_page_gives_the_next_offset_past_keyless_patients(fake_api, run):
    fake_api.on("patients", "search_patients", {"count": 10, "list": [_patient(KEY), {"patient_id": "MRN2"}]})
    data = run(search_patients(filters={"vital_status": "alive"}, tenant="radiant", limit=2))["data"]
    # Two rows read, one listed: the next page starts after both.
    assert data["returned"] == 1 and data["next_offset"] == 2
