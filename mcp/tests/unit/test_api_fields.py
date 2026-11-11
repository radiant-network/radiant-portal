"""``api_fields`` against the backend field lists of the portal checkout."""

import pytest

from radiant_mcp import api_fields

LISTS = [
    ("CasesFields", "filter", api_fields.CASE_FILTER_FIELDS),
    ("CasesFields", "sort", api_fields.CASE_SORT_FIELDS),
    ("PcxPatientListFields", "filter", api_fields.PATIENT_FILTER_FIELDS),
    ("PcxPatientListFields", "sort", api_fields.PATIENT_SORT_FIELDS),
    ("GermlineSNVOccurrencesFields", "sort", api_fields.GERMLINE_SNV_SORT_FIELDS),
    ("SomaticSNVOccurrencesFields", "sort", api_fields.SOMATIC_SNV_SORT_FIELDS),
    ("GermlineCNVOccurrencesFields", "sort", api_fields.GERMLINE_CNV_SORT_FIELDS),
    ("SomaticCNVOccurrencesFields", "sort", api_fields.SOMATIC_CNV_SORT_FIELDS),
]


@pytest.mark.parametrize("backend_list, capability, ours", LISTS, ids=lambda v: v if isinstance(v, str) else "")
def test_fields_match_the_backend(portal_fields, backend_list, capability, ours):
    assert backend_list in portal_fields, f"{backend_list} not found in the portal"
    expected = sorted(a for a, v in portal_fields[backend_list].items() if v[capability])
    assert sorted(ours) == expected, f"regenerate api_fields from {backend_list} (CanBe{capability.title()}...)"
