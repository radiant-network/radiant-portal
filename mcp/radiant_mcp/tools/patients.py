"""Patient tools: the clinical data of the portal's patient page.

They read the portal's patient endpoints (``/{tenant}/patients/...``), which
the portal serves only when its patient view is enabled and which read the
secured ``v_pcx_30_*`` views of the tenant in StarRocks. Those views apply
the PHI rule per user, so a tool never sees more than the portal page would
show the same user.
"""

from typing import Any

from fastmcp.tools import ToolResult

from .. import portal_api as _api
from .. import sql as _sql
from ..api_fields import PATIENT_SORT_FIELDS
from ..portal_api import SEARCH_MAX_LIMIT, RadiantApi, clamp, resolve_tenant
from ..portal_links import patient_url, with_url
from ..results import ToolOutput, describe, error, invalid, ok, respond
from ..services.cases import empty_filter_fields, merge_criteria, merge_searches, search_criteria
from ..services.patients import (
    PATIENT_KEY,
    PATIENT_SEARCH_FILTER_FIELDS,
    PATIENT_SECTIONS,
    no_clinical_data,
    patient_context,
    unknown_filter_fields,
)

PATIENT_SEARCH_SORT_FIELDS = PATIENT_SORT_FIELDS
# Autocomplete match types of GET /{tenant}/patients/autocomplete, which are
# also filter fields.
_AUTOCOMPLETE_FIELDS = ("patient_id", "patient_name")

DEFAULT_SECTIONS = ("treatments", "laboratory", "imaging", "genomics", "trial_eligibilities")


def _search_patients(
    api: RadiantApi,
    _token: str,
    tenant: str | None,
    filters: dict | None,
    query: str | None,
    limit: int,
    offset: int,
    sort_by: str | None,
    sort_order: str,
    include_filter_values: bool,
) -> ToolOutput:
    from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria
    from radiant_python.models.sort_body import SortBody

    filters = dict(filters or {})
    bad = unknown_filter_fields(filters)
    if bad:
        raise invalid(f"Unknown filter field(s): {', '.join(bad)}", allowed=list(PATIENT_SEARCH_FILTER_FIELDS))
    empty = empty_filter_fields(filters)
    if empty:
        raise invalid(f"Filter field(s) without a value: {', '.join(empty)}; give a value or a non-empty list")
    if sort_by is not None and sort_by not in PATIENT_SEARCH_SORT_FIELDS:
        raise invalid(f"Unknown sort field: {sort_by}", allowed=list(PATIENT_SEARCH_SORT_FIELDS))
    sort_order = (sort_order or "asc").lower()
    if sort_order not in ("asc", "desc"):
        raise invalid("sort_order must be 'asc' or 'desc'")
    limit = clamp(limit, 1, SEARCH_MAX_LIMIT)
    offset = max(0, int(offset))

    tenant_code = resolve_tenant(api, tenant)

    def _search(extra: dict, page_offset: int) -> dict:
        merged_filters = merge_criteria(filters, extra)
        if merged_filters is None:
            return {"count": 0, "list": []}
        body = ListBodyWithCriteria(
            search_criteria=search_criteria(merged_filters),
            limit=limit,
            offset=page_offset,
            sort=[SortBody(field=sort_by, order=sort_order)] if sort_by else None,
        )
        return api.call("patients", "search_patients", tenant=tenant_code, list_body_with_criteria=body) or {}

    cut = None
    keyless = 0
    try:
        if query:
            # One search per matched identifier type (criteria are AND-ed by
            # the API), merged on patient_key. `offset` does not apply.
            # One match past the cap tells a cut autocomplete from a complete one of exactly the cap.
            matches, more_matches = _sql.cut(api.call(
                "patients", "autocomplete_patients",
                tenant=tenant_code, prefix=query, limit=str(SEARCH_MAX_LIMIT + 1),
            ) or [], SEARCH_MAX_LIMIT)
            by_field: dict[str, list] = {}
            for m in matches:
                if m.get("type") in _AUTOCOMPLETE_FIELDS:
                    by_field.setdefault(m["type"], []).append(m.get("value"))
            patients, counts, more, keyless = merge_searches(by_field, lambda extra: _search(extra, 0), "patient_key",
                                                             limit, more_matches)
            result: dict[str, Any] = {"tenant": tenant_code, "query": query, **counts}
            if more:
                cut = "More patients match than were returned: use a longer identifier prefix or add filters."
        else:
            resp = _search({}, offset)
            # Patients not in the portal's key table yet have no patient_key: no link, no context.
            listed = resp.get("list", [])
            patients = [p for p in listed if p.get("patient_key")]
            keyless = len(listed) - len(patients)
            count = resp.get("count", 0)
            result = {"tenant": tenant_code, "count": count, "offset": offset}
            more = count - offset - len(listed)
            if more > 0:
                # The page read had len(listed) rows, keyless ones included: page from there,
                # not from offset + returned, or the next page repeats patients.
                result["next_offset"] = offset + len(listed)
                cut = f"{more} more patients: page with `offset` = `next_offset`, or narrow the filters."
    except Exception as exc:  # noqa: BLE001
        no_data = no_clinical_data(tenant_code, exc)
        if no_data is None:
            raise
        raise no_data from exc

    result["returned"] = len(patients)
    result["patients"] = [with_url(p, patient_url(tenant_code, p.get("patient_key"))) for p in patients]
    warnings = []
    if keyless:
        warnings.append(f"{keyless} matching patient record(s) have no patient key yet (not in the portal's key "
                        "table): not listed")
    if include_filter_values:
        try:
            result["filter_values"] = api.call("patients", "patients_filters", tenant=tenant_code)
        except Exception as exc:  # noqa: BLE001 — the search itself succeeded
            warnings.append(f"filter_values: {describe(exc)}")
    return ok(result, warnings=warnings, truncated=cut)


def _get_patient_context(api: RadiantApi, token: str, patient_key: str, tenant: str | None,
                         sections: list[str]) -> ToolOutput:
    context = patient_context(api, token, patient_key, tenant, sections)
    warnings = context.pop("warnings")
    return ok(context, warnings=warnings, portal_url=context["patient"].get("portal_url"))


# -- tools -------------------------------------------------------------------

async def search_patients(
    query: str | None = None,
    filters: dict[str, Any] | None = None,
    tenant: str | None = None,
    limit: int = 20,
    offset: int = 0,
    sort_by: str | None = None,
    sort_order: str = "asc",
    include_filter_values: bool = False,
) -> ToolResult:
    """Search the patients of the portal's patient list (clinical data).

    Use this to find a patient's ``patient_key`` before calling
    ``get_patient_context``, or to list the patients of a clinical cohort
    ("deceased patients with a medulloblastoma", "patients who received
    radiation").

    Returns ``count`` and ``patients`` (identifiers, demographics, vital
    status, initial diagnosis, survival, ``case_count``, ``patient_key`` and
    ``portal_url``). Names are placeholders when the user may not read PHI
    (``can_read_phi``). A tenant without clinical data fails with the
    ``unavailable`` error code.

    Args:
        query: Free-text prefix matched against the patient identifier (MRN or
            research id) and the patient name, through the portal's
            autocomplete. Combine with ``filters`` to narrow.
        filters: Mapping of field → value or list of values. Several fields are
            AND-ed; several values for one field are OR-ed. Allowed fields:
            age_at_initial_dx_group, chemotherapy_agents,
            cns_integrated_diagnosis, diagnosis_type_cohort,
            got_radiation_ever, organization_code, patient_id,
            patient_name, vital_status. Values are matched exactly: call once
            with ``include_filter_values=True`` to get the accepted values.
        tenant: Tenant code. Optional — auto-resolved when the user belongs to
            a single tenant; otherwise the response lists the choices.
        limit: Max patients to return (1–100, default 20).
        offset: Pagination offset (default 0, ignored with ``query``). When more
            patients exist, use the returned ``next_offset``: ``count`` and the
            pages include patients without a patient key yet, which are not listed.
            With ``query``, ``count`` is the number of distinct patients found;
            when some were not returned, ``truncated`` is set and
            ``count_at_least`` (a lower bound) replaces ``count``.
        sort_by: Optional sort field: birth_year, can_read_phi,
            cns_integrated_diagnosis, diagnosis_type_cohort, gender,
            organization_code, patient_id, survival_days, vital_status.
            Default: the portal's list order. With ``query``, each identifier
            type is searched and sorted on its own and the lists are joined, so
            the order holds within each type only.
        sort_order: ``asc`` (default) or ``desc``.
        include_filter_values: Also return ``filter_values``, the values each
            filter accepts.
    """
    return await _api.run(
        _search_patients, tenant, filters, query, limit, offset, sort_by, sort_order, include_filter_values,
    )


async def get_patient_context(
    patient_key: str,
    tenant: str | None = None,
    sections: list[str] | None = None,
) -> ToolResult:
    """Retrieve the clinical context of a patient, as on the portal's patient page.

    Use this first for any question about one patient's clinical history. The
    key comes from ``search_patients`` or from a case member's ``patient_key``
    (``get_case_context``); an MRN is not a key — search it first.

    Returns ``patient`` (identifiers, demographics, vital status, events with
    the diagnoses, initial diagnosis, tumor and metastasis, treatment summary,
    key dates, ``portal_url``) and one entry per requested section:
    ``treatments`` (surgeries, radiation, medical therapies), ``laboratory``
    (latest blood count, CSF results, Lansky/Karnofsky performance status),
    ``imaging`` (MRI sessions), ``genomics`` (the patient's cases and their
    variant interpretations, each with a ``portal_url``),
    ``trial_eligibilities`` and, on request, ``external_records``. Each
    section carries the ``portal_url`` of its tab. ``case_ids`` lists the
    patient's cases for ``get_case_context``. A section that fails is listed
    in ``warnings``; the rest is still returned. A tenant without clinical
    data fails with the ``unavailable`` error code.

    Args:
        patient_key: The patient page key (a UUID).
        tenant: Tenant code. Optional — auto-resolved when the user belongs to
            a single tenant; otherwise the response lists the choices.
        sections: Sections to load among treatments, laboratory, imaging,
            genomics, trial_eligibilities, external_records. Default: all but
            external_records.
    """
    patient_key = (patient_key or "").strip()
    if not PATIENT_KEY.fullmatch(patient_key):
        return respond(error("invalid_input", f"`{patient_key}` is not a patient key (a UUID). "
                                              "Find the key with search_patients(query=<identifier>) first."))
    chosen = list(dict.fromkeys(sections)) if sections else list(DEFAULT_SECTIONS)
    unknown = sorted(set(chosen) - set(PATIENT_SECTIONS))
    if unknown:
        return respond(error("invalid_input", f"Unknown section(s): {', '.join(unknown)}",
                             allowed=list(PATIENT_SECTIONS)))
    # Keys are stored lower-case: a key copied upper-case would not be found.
    return await _api.run(_get_patient_context, patient_key.lower(), tenant, chosen)
