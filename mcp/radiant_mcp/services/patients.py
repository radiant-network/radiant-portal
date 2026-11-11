"""The patient context: the patient page data, read through the portal API.

The portal's patient endpoints read the secured ``v_pcx_30_*`` views of the
tenant, which apply the PHI rule per user. ``get_patient_context`` and
``patient_timeline`` build on it; ``search_patients`` and the patient groups
of ``survival_curve`` share the filter fields.
"""

import json
import re
from concurrent.futures import ThreadPoolExecutor
from typing import Any

from ..api_fields import PATIENT_FILTER_FIELDS
from ..portal_api import RadiantApi, is_status, resolve_tenant
from ..portal_links import case_url, occurrence_url, patient_url, variant_url, with_url
from ..results import ToolFailure, describe, not_found

# Field aliases accepted by POST /{tenant}/patients/search
# (backend/internal/types/pcx_patient_query.go: PcxPatientListFields).
PATIENT_SEARCH_FILTER_FIELDS = PATIENT_FILTER_FIELDS


# Section name -> (patients API operation, patient page tab).
PATIENT_SECTIONS = {
    "treatments": ("patient_treatments", "treatments"),
    "laboratory": ("patient_laboratory", "laboratory"),
    "imaging": ("patient_imaging", "imaging"),
    "genomics": ("patient_genomics", "genomics"),
    "trial_eligibilities": ("patient_trial_eligibilities", "clinical-trials"),
    "external_records": ("patient_external_records", None),
}


# The backend gives each user a small StarRocks pool; stay under it.
_SECTION_WORKERS = 3


PATIENT_KEY = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")


def _route_missing(exc: Exception) -> bool:
    """A 404 without the API's JSON error body: the patient routes are not
    registered, i.e. the portal runs with its patient view disabled."""
    if not is_status(exc, 404):
        return False
    try:
        body = json.loads(exc.body or "")
    except (TypeError, ValueError):
        return True
    return not (isinstance(body, dict) and "message" in body)


def no_clinical_data(tenant: str, exc: Exception) -> ToolFailure | None:
    """The ``unavailable`` failure of a tenant whose clinical data cannot be
    read, or None when ``exc`` is an ordinary error."""
    if _route_missing(exc):
        reason = "the portal's patient view is not enabled"
    elif is_status(exc, 500):
        # The portal answers 500 when the tenant's patient views do not exist. A 502, 503 or
        # 504 is a gateway or an outage, not the tenant's data: upstream, retried once.
        reason = ("the tenant's patient views could not be read (they may not exist for this tenant, "
                  "or the portal had a transient error: retry once before concluding)")
    else:
        return None
    details = {"tenant": tenant}
    correlation_id = (getattr(exc, "headers", None) or {}).get("X-Correlation-ID")
    if correlation_id:
        details["correlation_id"] = correlation_id
    return ToolFailure("unavailable", f"No clinical data for tenant {tenant}: {reason}.", **details)


def _link_genomics(tenant: str, genomics: dict) -> None:
    for case in genomics.get("cases", []):
        with_url(case, case_url(tenant, case.get("case_id")))
    for interpretation in genomics.get("interpretations", []):
        locus_id = interpretation.get("locus_id")
        if interpretation.get("origin") == "germline":
            url = occurrence_url(
                tenant, interpretation.get("case_id"), interpretation.get("sequencing_id"),
                "germline_snv", variant_id=locus_id,
            )
        else:
            # The somatic interpretation does not say whether it came from the
            # tumor-normal or the tumor-only table: open the case variants tab.
            url = case_url(tenant, interpretation.get("case_id"), tab="variants")
        with_url(interpretation, url)
        with_url(interpretation, variant_url(tenant, locus_id), key="variant_portal_url")


def patient_context(
    api: RadiantApi, _token: str, patient_key: str, tenant: str | None, sections: list[str],
) -> dict:
    """``tenant``, ``patient``, the ``sections``, ``case_ids`` and ``warnings`` (a list).

    Raises ``ToolFailure``: ``unavailable`` when the tenant has no clinical
    data, ``not_found`` for an unknown patient.
    """
    tenant_code = resolve_tenant(api, tenant)

    try:
        patient = api.call("patients", "patient_entity", tenant=tenant_code, patient_key=patient_key) or {}
    except Exception as exc:  # noqa: BLE001
        no_data = no_clinical_data(tenant_code, exc)
        if no_data is not None:
            raise no_data from exc
        if is_status(exc, 404):
            raise not_found(f"Patient {patient_key} not found in tenant {tenant_code}, "
                            "or not visible to the current user.") from exc
        raise
    with_url(patient, patient_url(tenant_code, patient_key))

    def _fetch(section: str) -> tuple[str, Any, str | None]:
        operation, _tab = PATIENT_SECTIONS[section]
        try:
            return section, api.call("patients", operation, tenant=tenant_code, patient_key=patient_key), None
        except Exception as exc:  # noqa: BLE001 — one section never fails the whole context
            return section, None, f"{section}: {describe(exc)}"

    result: dict[str, Any] = {"tenant": tenant_code, "patient": patient}
    warnings: list[str] = []
    with ThreadPoolExecutor(max_workers=_SECTION_WORKERS) as pool:
        for section, data, warning in pool.map(_fetch, sections):
            if warning:
                warnings.append(warning)
                continue
            data = data if data is not None else {}
            if section == "genomics" and isinstance(data, dict):
                _link_genomics(tenant_code, data)
            tab = PATIENT_SECTIONS[section][1]
            if tab and isinstance(data, dict):
                with_url(data, patient_url(tenant_code, patient_key, tab=tab))
            result[section] = data

    case_ids = [c.get("case_id") for c in (result.get("genomics") or {}).get("cases", [])]
    result["case_ids"] = [c for c in case_ids if c is not None]
    result["warnings"] = warnings
    return result


def unknown_filter_fields(filters: dict) -> list[str]:
    """The keys of ``filters`` that ``POST /patients/search`` cannot filter on."""
    return sorted(set(filters) - set(PATIENT_SEARCH_FILTER_FIELDS))
