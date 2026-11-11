"""Variant tools: one variant's annotations and the cases that carry it.

They read the endpoints of the portal's variant page, so the annotations are
the ones a geneticist sees there.
"""

from concurrent.futures import ThreadPoolExecutor
from typing import Any

from fastmcp.tools import ToolResult

from .. import portal_api as _api
from ..domain.data_types import CaseSnvDataType
from ..portal_api import RadiantApi, clamp, is_status, resolve_tenant
from ..portal_links import case_url, occurrence_url, variant_url, with_url
from ..results import ToolOutput, Truncation, describe, error, not_found, ok, respond

# Section -> (variants API operation, extra arguments).
_VARIANT_SECTIONS = {
    "overview": ("get_germline_variant_overview", {}),
    "consequences": ("get_germline_variant_consequences", {}),
    "external_frequencies": ("get_germline_variant_external_frequencies", {}),
    "internal_frequencies": ("get_germline_variant_global_internal_frequencies", {}),
    "clinvar": ("get_germline_variant_conditions_clinvar", {}),
}
_EXPANDED_OCCURRENCE = {
    "germline_snv": "get_expanded_germline_snv_occurrence",
    "somatic_snv_tn": "get_expanded_somatic_snv_occurrence",
    "somatic_snv_to": "get_expanded_somatic_snv_occurrence",
}
_WORKERS = 3
CARRIERS_MAX_LIMIT = 100


def _key_transcripts(consequences: list[dict], picked_transcript_id: str | None) -> list[dict]:
    """Keep the picked, MANE and canonical transcripts of each gene.

    ``is_picked`` is set on the gene, not on its transcripts: the picked
    transcript is the overview's ``transcript_id``. A gene can have dozens of
    transcripts; the others are counted in ``other_transcripts`` so the model
    knows they exist.
    """
    out = []
    for gene in consequences:
        transcripts = gene.get("transcripts") or []
        key = [
            t for t in transcripts
            if t.get("is_mane_select") or t.get("is_mane_plus") or t.get("is_canonical")
            or (picked_transcript_id and t.get("transcript_id") == picked_transcript_id)
        ] or transcripts[:1]
        trimmed = {**gene, "transcripts": key}
        if len(transcripts) > len(key):
            trimmed["other_transcripts"] = len(transcripts) - len(key)
        out.append(trimmed)
    return out


def _variant_details(
    api: RadiantApi,
    _token: str,
    locus_id: str,
    tenant: str | None,
    case_id: int | None,
    seq_id: int | None,
    task_id: int | None,
    data_type: str,
) -> ToolOutput:
    tenant_code = resolve_tenant(api, tenant)

    try:
        header = api.call("variants", "get_germline_variant_header", tenant=tenant_code, locus_id=locus_id)
    except Exception as exc:  # noqa: BLE001
        if is_status(exc, 404):
            raise not_found(f"Variant {locus_id} not found in tenant {tenant_code}.") from exc
        raise

    calls: list[tuple[str, str, str, dict]] = [
        (name, "variants", operation, {"tenant": tenant_code, "locus_id": locus_id, **extra})
        for name, (operation, extra) in _VARIANT_SECTIONS.items()
    ]
    with_occurrence = case_id is not None and seq_id is not None and task_id is not None
    if with_occurrence:
        calls.append((
            "occurrence", "occurrences", _EXPANDED_OCCURRENCE[data_type],
            {"tenant": tenant_code, "case_id": case_id, "seq_id": seq_id, "task_id": task_id, "locus_id": locus_id},
        ))

    def _fetch(call: tuple[str, str, str, dict]) -> tuple[str, Any, str | None]:
        name, api_name, operation, kwargs = call
        try:
            return name, api.call(api_name, operation, **kwargs), None
        except Exception as exc:  # noqa: BLE001 — one section never fails the whole result
            return name, None, f"{name}: {describe(exc)}"

    result: dict[str, Any] = {"tenant": tenant_code, "locus_id": locus_id, "header": header}
    warnings: list[str] = []
    with ThreadPoolExecutor(max_workers=_WORKERS) as pool:
        for name, data, warning in pool.map(_fetch, calls):
            if warning:
                warnings.append(warning)
            else:
                result[name] = data

    if "consequences" in result:
        picked = (result.get("overview") or {}).get("transcript_id")
        result["consequences"] = _key_transcripts(result["consequences"] or [], picked)

    if with_occurrence and isinstance(result.get("occurrence"), dict):
        with_url(result["occurrence"], occurrence_url(
            tenant_code, case_id, seq_id, data_type, task_id=task_id, variant_id=locus_id,
        ))
    return ok(result, warnings=warnings, portal_url=variant_url(tenant_code, locus_id))


def _variant_carriers(api: RadiantApi, _token: str, locus_id: str, tenant: str | None, limit: int) -> ToolOutput:
    from radiant_python.models.list_body_with_criteria import ListBodyWithCriteria

    tenant_code = resolve_tenant(api, tenant)

    counts = api.call("variants", "get_germline_variant_cases_count", tenant=tenant_code, locus_id=locus_id) or {}
    result: dict[str, Any] = {
        "tenant": tenant_code,
        "locus_id": locus_id,
        "count_interpreted": counts.get("count_interpreted", 0),
        "count_uninterpreted": counts.get("count_uninterpreted", 0),
    }
    cut = []

    for key, operation in (
        ("interpreted_cases", "get_germline_variant_interpreted_cases"),
        ("uninterpreted_cases", "get_germline_variant_uninterpreted_cases"),
    ):
        body = ListBodyWithCriteria(search_criteria=[], limit=limit, offset=0)
        resp = api.call("variants", operation, tenant=tenant_code, locus_id=locus_id, list_body_with_criteria=body) or {}
        cases = resp.get("list", [])
        for case in cases:
            with_url(case, occurrence_url(
                tenant_code, case.get("case_id"), case.get("seq_id"), "germline_snv",
                task_id=case.get("task_id"), variant_id=locus_id,
            ) or case_url(tenant_code, case.get("case_id")))
        result[key] = cases
        if resp.get("count", len(cases)) > len(cases):
            cut.append(key)
    truncated = None
    if cut:
        truncated = Truncation(reason=f"Each list stops at {limit} cases: raise `limit` (up to {CARRIERS_MAX_LIMIT}) "
                                      "or use the counts.", lists=cut)
    return ok(result, truncated=truncated, portal_url=variant_url(tenant_code, locus_id))


# -- tools -------------------------------------------------------------------

async def variant_details(
    locus_id: str | int,
    tenant: str | None = None,
    case_id: int | None = None,
    seq_id: int | None = None,
    task_id: int | None = None,
    data_type: CaseSnvDataType = "germline_snv",
) -> ToolResult:
    """Everything the portal knows about one SNV, optionally in one case.

    Returns ``header`` (HGVSg, assembly), ``overview`` (gene, consequence,
    impact, in-silico predictions — CADD, REVEL, SIFT, PolyPhen-2, FATHMM, LRT,
    DANN, SpliceAI —, pLI/LOEUF, OMIM conditions, ClinVar, internal frequency,
    counts of classifications across cases), ``consequences`` (per gene, the
    MANE / canonical / picked transcripts), ``external_frequencies`` (gnomAD,
    TOPMed, 1000 Genomes, ...), ``internal_frequencies`` (the whole Radiant
    cohort: carriers, homozygotes, affected / not affected) and ``clinvar``
    (submissions and conditions). With ``case_id``, ``seq_id`` and
    ``task_id`` (from ``get_case_context``'s ``occurrence_keys``) it also
    returns ``occurrence``: genotype, depths, quality, transmission and
    parental origin, Exomiser, in that case. ``portal_url`` opens the variant
    page; ``occurrence.portal_url`` opens the occurrence in the case. A
    section that fails is listed in ``warnings``.

    Args:
        locus_id: The variant's locus_id, a string or a number (from ``prioritize_snv``,
            ``second_hit``, ``cohort_carriers``...).
        tenant: Tenant code (auto-resolved when the user has only one).
        case_id: Case of the optional occurrence key: pass case_id, seq_id and
            task_id together, or none of them.
        seq_id: Sequencing of the optional occurrence key (with case_id and task_id).
        task_id: Task of the optional occurrence key (with case_id and seq_id).
        data_type: germline_snv (default), somatic_snv_tn or somatic_snv_to;
            only used with the occurrence key.
    """
    keys = (case_id, seq_id, task_id)
    if any(k is not None for k in keys) and not all(k is not None for k in keys):
        return respond(error("invalid_input", "Pass case_id, seq_id and task_id together, or none of them."))
    if data_type not in _EXPANDED_OCCURRENCE:
        return respond(error("invalid_input", f"Unknown data_type {data_type!r}.", allowed=list(_EXPANDED_OCCURRENCE)))
    return await _api.run(_variant_details, str(locus_id), tenant, case_id, seq_id, task_id, data_type)


async def variant_carriers(locus_id: str | int, tenant: str | None = None, limit: int = 20) -> ToolResult:
    """List the cases of the tenant that carry a germline SNV.

    Same lists as the "Cases" section of the portal's variant page:
    ``interpreted_cases`` (a geneticist saved an interpretation:
    classification, condition, zygosity, the patient's phenotypes) and
    ``uninterpreted_cases`` (the variant is in the case but not interpreted:
    zygosity, transmission, depth, quality, phenotypes, primary condition).
    ``count_interpreted`` and ``count_uninterpreted`` give the totals. Each
    case carries a ``portal_url`` to the occurrence in that case.

    Args:
        locus_id: The variant's locus_id, a string or a number.
        tenant: Tenant code (auto-resolved when the user has only one).
        limit: Max cases returned per list (1–100, default 20).
    """
    return await _api.run(_variant_carriers, str(locus_id), tenant, clamp(limit, 1, CARRIERS_MAX_LIMIT))
