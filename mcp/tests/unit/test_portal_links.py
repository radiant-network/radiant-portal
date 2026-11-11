import pytest

from radiant_mcp.portal_links import case_url, occurrence_url, patient_url, variant_url, with_url

BASE = "https://portal.example"


@pytest.fixture(autouse=True)
def portal(configure):
    configure(radiant_portal_url=BASE + "/")


def test_case_url():
    assert case_url("pragmatiq", 1131) == f"{BASE}/pragmatiq/case/entity/1131"
    assert case_url("pragmatiq", 1131, tab="variants") == f"{BASE}/pragmatiq/case/entity/1131?tab=variants"


def test_patient_url_uses_the_key():
    key = "0f8fad5b-d9cb-469f-a165-70867728950e"
    assert patient_url("radiant", key) == f"{BASE}/radiant/patient/entity/{key}"
    assert patient_url("radiant", key, tab="genomics") == f"{BASE}/radiant/patient/entity/{key}?tab=genomics"


def test_variant_url_quotes_the_locus():
    assert variant_url("radiant", "1-123-A/T") == f"{BASE}/radiant/variants/entity/1-123-A%2FT"


def test_snv_occurrence_opens_the_side_panel():
    url = occurrence_url("radiant", 8, 21, "germline_snv", task_id=3, variant_id="42")
    assert url == (
        f"{BASE}/radiant/case/entity/8?tab=variants&seq_id=21&task_id=3"
        "&variant_section=snv&selectedVariant=42"
    )


def test_cnv_occurrence_opens_the_table_only():
    url = occurrence_url("radiant", 8, 21, "somatic_cnv", task_id=3, variant_id="cnv-1")
    assert url == f"{BASE}/radiant/case/entity/8?tab=variants&seq_id=21&task_id=3&variant_section=cnv-to"


@pytest.mark.parametrize("data_type, section", [
    ("germline_snv", "snv"), ("germline_cnv", "cnv"), ("somatic_snv_tn", "snv-tn"),
    ("somatic_snv_to", "snv-to"), ("somatic_cnv", "cnv-to"),
])
def test_variant_sections(data_type, section):
    assert f"variant_section={section}" in occurrence_url("t", 1, 2, data_type)


def test_missing_ids_give_no_link():
    assert case_url("t", None) is None
    assert patient_url("t", None) is None
    assert variant_url("t", "") is None
    assert occurrence_url("t", 1, None, "germline_snv") is None
    assert occurrence_url("t", 1, 2, "unknown") is None
    assert case_url(None, 1) is None


def test_no_link_without_portal_url(configure):
    configure(radiant_portal_url="")
    assert case_url("t", 1) is None
    assert with_url({"a": 1}, case_url("t", 1)) == {"a": 1}


def test_unknown_tab_is_a_programming_error():
    with pytest.raises(ValueError):
        case_url("t", 1, tab="nope")
    with pytest.raises(ValueError):
        patient_url("t", "k", tab="nope")
