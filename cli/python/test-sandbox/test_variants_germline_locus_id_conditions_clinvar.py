import os

import pytest

from radiant_python.api.variant_api import VariantApi


@pytest.fixture(scope="session")
def locus_id() -> str:
    value = os.environ.get("RADIANT_LOCUS_ID")
    if not value:
        pytest.fail(
            "missing required env var: RADIANT_LOCUS_ID. "
            "Set it to a locus_id present in your sandbox before running."
        )
    return value


@pytest.fixture(scope="session")
def expected_clinvar_name() -> str:
    value = os.environ.get("RADIANT_EXPECTED_CLINVAR_NAME")
    if not value:
        pytest.fail(
            "missing required env var: RADIANT_EXPECTED_CLINVAR_NAME. "
            "Set it to the clinvar_name expected for RADIANT_LOCUS_ID."
        )
    return value


def test_returns_records(
    variant_api: VariantApi, locus_id: str, expected_clinvar_name: str
) -> None:
    response = variant_api.get_germline_variant_conditions_clinvar(locus_id=locus_id)
    assert response, f"no clinvar conditions for locus_id={locus_id}"
    assert response[0].clinvar_name == expected_clinvar_name


def test_locus_id_matches(variant_api: VariantApi, locus_id: str) -> None:
    response = variant_api.get_germline_variant_conditions_clinvar(locus_id=locus_id)
    for r in response:
        assert r.locus_id == locus_id, (
            f"locus_id mismatch: expected={locus_id} got={r.locus_id}"
        )


def test_clinvar_name_present(variant_api: VariantApi, locus_id: str) -> None:
    response = variant_api.get_germline_variant_conditions_clinvar(locus_id=locus_id)
    missing = [r.clinvar_id for r in response if not r.clinvar_name]
    assert not missing, f"clinvar_name missing for clinvar_id(s)={missing}"
