"""Occurrence tools: the SNV and CNV tables of a case, through the portal API.

They call the same list endpoints as the case variants tab, with the same
filter language (SQON) and the same field names, so a filter that works in
the portal works here and the backend keeps its own validation, partition
pruning and access control.
"""

from dataclasses import dataclass
from typing import Any

from fastmcp.tools import ToolResult

from .. import portal_api as _api
from ..api_fields import OCCURRENCE_SORT_FIELDS
from ..domain.data_types import CASE_CNV_DATA_TYPES, CASE_SNV_DATA_TYPES, CaseCnvDataType, CaseSnvDataType
from ..enums import canonical_values
from ..portal_api import RadiantApi, clamp, resolve_tenant
from ..portal_links import occurrence_url, variant_url, with_url
from ..results import ToolOutput, error, ok, respond

MAX_LIMIT = 100
# SQON leaf operators accepted by the backend (types/filter.go, sqonToFilter).
OPERATORS = ("in", "not-in", "<", ">", "<=", ">=", "between", "all")
_SINGLE_VALUE_OPERATORS = ("<", ">", "<=", ">=")
# Operators whose values are OR-ed: an ambiguous enum value may expand.
_SET_OPERATORS = ("in", "not-in")


@dataclass(frozen=True)
class _Kind:
    list_operation: str
    count_operation: str
    id_field: str
    is_snv: bool


_KINDS = {
    "germline_snv": _Kind("list_germline_snv_occurrences", "count_germline_snv_occurrences", "locus_id", True),
    "somatic_snv_tn": _Kind("list_somatic_snv_occurrences", "count_somatic_snv_occurrences", "locus_id", True),
    "somatic_snv_to": _Kind("list_somatic_snv_occurrences", "count_somatic_snv_occurrences", "locus_id", True),
    "germline_cnv": _Kind("list_germline_cnv_occurrences", "count_germline_cnv_occurrences", "cnv_id", False),
    "somatic_cnv": _Kind("list_somatic_cnv_occurrences", "count_somatic_cnv_occurrences", "cnv_id", False),
}
SNV_DATA_TYPES = CASE_SNV_DATA_TYPES
CNV_DATA_TYPES = CASE_CNV_DATA_TYPES

Filters = list[dict[str, Any]] | dict[str, Any] | None
Sort = list[dict[str, str]] | None


class FilterError(ValueError):
    pass


def normalize_filters(filters: Filters) -> list[dict]:
    """Validate the tool's filters and return ``[{field, op, value: [...]}, ...]``.

    Accepts ``[{"field", "op", "value"}, ...]`` (``op`` defaults to ``in``), one
    such object alone, or the shorthand ``{field: value | [values]}`` (all ``in``).
    Enum values are mapped onto their stored spelling (see ``enums``).
    """
    if not filters:
        return []
    # One filter object without its list: read as the shorthand, it would filter on
    # fields named `field` and `value`, which the portal rejects.
    if isinstance(filters, dict) and isinstance(filters.get("field"), str):
        filters = [filters]
    if isinstance(filters, dict):
        filters = [{"field": f, "op": "in", "value": v} for f, v in filters.items()]
    if not isinstance(filters, list):
        raise FilterError("`filters` must be a list of {field, op, value} objects.")
    out = []
    for item in filters:
        if not isinstance(item, dict):
            raise FilterError(f"Each filter must be an object, got {item!r}.")
        field, op, value = item.get("field"), item.get("op", "in"), item.get("value")
        if not isinstance(field, str) or not field:
            raise FilterError(f"Filter without a `field`: {item!r}.")
        if op not in OPERATORS:
            raise FilterError(f"Unknown operator {op!r} on {field}. Allowed: {', '.join(OPERATORS)}.")
        values = list(value) if isinstance(value, (list, tuple)) else [value]
        if not values or any(v is None for v in values):
            raise FilterError(f"Filter on {field} needs at least one non-null value.")
        if op in _SINGLE_VALUE_OPERATORS and len(values) != 1:
            raise FilterError(f"Operator {op} on {field} takes exactly one value.")
        if op == "between" and len(values) != 2:
            raise FilterError(f"Operator between on {field} takes exactly two values [min, max].")
        expand = op in _SET_OPERATORS
        out.append({"field": field, "op": op, "value": canonical_values(field, values, expand=expand)})
    return out


def normalize_sort(sort: Sort, sortable: tuple[str, ...] | None = None) -> list[dict]:
    """``sort`` as ``[{field, order}]``. With ``sortable``, an unknown field is an error:
    the backend would drop it silently, and its default sort with it."""
    if not sort:
        return []
    if not isinstance(sort, list):
        raise FilterError("`sort` must be a list of {field, order} objects.")
    out = []
    for item in sort:
        if not isinstance(item, dict) or not isinstance(item.get("field"), str):
            raise FilterError(f"Each sort entry needs a `field`: {item!r}.")
        order = (item.get("order") or "desc").lower()
        if order not in ("asc", "desc"):
            raise FilterError(f"Sort order must be asc or desc, got {item.get('order')!r}.")
        if sortable is not None and item["field"] not in sortable:
            raise FilterError(f"Cannot sort on {item['field']!r}. Sortable fields: {', '.join(sortable)}.")
        out.append({"field": item["field"], "order": order})
    return out


def _sqon(filters: list[dict]):
    from radiant_python.models import LeafContent, Sqon, SqonContent

    leaves = [
        Sqon(op=f["op"], content=SqonContent(actual_instance=LeafContent(field=f["field"], value=f["value"])))
        for f in filters
    ]
    return Sqon(op="and", content=SqonContent(actual_instance=leaves))


def _list_occurrences(
    api: RadiantApi,
    _token: str,
    data_type: str,
    case_id: int,
    seq_id: int,
    task_id: int,
    tenant: str | None,
    filters: list[dict],
    sort: list[dict],
    limit: int,
    offset: int,
    additional_fields: list[str] | None,
) -> ToolOutput:
    from radiant_python.models import CountBodyWithSqon, ListBodyWithSqon, SortBody

    tenant_code = resolve_tenant(api, tenant)

    kind = _KINDS[data_type]
    keys = {"tenant": tenant_code, "case_id": case_id, "seq_id": seq_id, "task_id": task_id}
    sqon = _sqon(filters)
    count = api.call("occurrences", kind.count_operation, **keys, count_body_with_sqon=CountBodyWithSqon(sqon=sqon))
    body = ListBodyWithSqon(
        sqon=sqon,
        limit=limit,
        offset=offset,
        sort=[SortBody(field=s["field"], order=s["order"]) for s in sort] or None,
        additional_fields=list(additional_fields) if additional_fields else None,
    )
    rows = api.call("occurrences", kind.list_operation, **keys, list_body_with_sqon=body) or []

    for row in rows:
        variant_id = row.get(kind.id_field) if kind.is_snv else None
        with_url(row, occurrence_url(tenant_code, case_id, seq_id, data_type, task_id=task_id, variant_id=variant_id))
        if kind.is_snv:
            with_url(row, variant_url(tenant_code, variant_id), key="variant_portal_url")

    total = (count or {}).get("count")
    result = {
        "tenant": tenant_code,
        "case_id": case_id,
        "seq_id": seq_id,
        "task_id": task_id,
        "data_type": data_type,
        "count": total,
        "returned": len(rows),
        "offset": offset,
        "filters": filters,
        "occurrences": rows,
    }
    more = (total or 0) - offset - len(rows)
    return ok(
        result,
        truncated=f"{more} more occurrences: add filters, sort on what matters, or page with `offset`."
        if more > 0 else None,
        portal_url=occurrence_url(tenant_code, case_id, seq_id, data_type, task_id=task_id),
    )


async def _run_list(
    data_type: str,
    allowed: tuple[str, ...],
    case_id: int,
    seq_id: int,
    task_id: int,
    tenant: str | None,
    filters: Filters,
    sort: Sort,
    limit: int,
    offset: int,
    additional_fields: list[str] | None,
) -> ToolResult:
    if data_type not in allowed:
        return respond(error("invalid_input", f"Unknown data_type {data_type!r}.", allowed=list(allowed)))
    try:
        leaves = normalize_filters(filters)
        order = normalize_sort(sort, OCCURRENCE_SORT_FIELDS[data_type])
    except FilterError as exc:
        return respond(error("invalid_input", str(exc)))
    return await _api.run(
        _list_occurrences, data_type, case_id, seq_id, task_id, tenant, leaves, order,
        clamp(limit, 1, MAX_LIMIT), max(0, int(offset)), additional_fields,
    )


# -- tools -------------------------------------------------------------------

async def prioritize_snv(
    case_id: int,
    seq_id: int,
    task_id: int,
    data_type: CaseSnvDataType = "germline_snv",
    filters: Filters = None,
    sort: Sort = None,
    limit: int = 20,
    offset: int = 0,
    additional_fields: list[str] | None = None,
    tenant: str | None = None,
) -> ToolResult:
    """Rank and filter the SNV occurrences of one sequencing of a case.

    Same data, filters and order as the SNV table of the case variants tab.
    Take ``case_id``, ``seq_id``, ``task_id`` and ``data_type`` from one entry
    of ``get_case_context``'s ``occurrence_keys`` (data_type germline_snv,
    somatic_snv_tn or somatic_snv_to). For somatic data, ``seq_id`` is the
    tumor sequencing.

    Default order: germline by Exomiser gene combined score then impact score
    (desc); somatic by impact score (desc).

    Returns ``count`` (all matches), ``occurrences`` (each with
    ``portal_url``, the occurrence side panel in the case, and
    ``variant_portal_url``, the variant page) and the table's ``portal_url``.

    Args:
        case_id: Case of the occurrence key (from ``get_case_context``'s ``occurrence_keys``).
        seq_id: Sequencing of the occurrence key.
        task_id: Task of the occurrence key.
        data_type: germline_snv (default), somatic_snv_tn or somatic_snv_to.
        filters: AND-ed list of ``{"field", "op", "value"}``. ``op`` is one of
            in (default), not-in, <, >, <=, >=, between ([min, max]), all
            (array contains all). One such object alone is accepted too.
            Shorthand: ``{"field": value_or_list}``.
            Useful fields, any data type: symbol, vep_impact
            (HIGH/MODERATE/LOW/MODIFIER), consequence, clinvar (Pathogenic,
            Likely_pathogenic, ...), gnomad_v3_af, germline_pf_wgs, filter,
            hpo_gene_panel, omim_gene_panel, tenant_gene_panel, cadd_phred,
            revel_score, spliceai_ds, cmc_tier, ad_ratio. Germline only (a somatic call
            rejects them): zygosity (HET/HOM/HEM), transmission_mode,
            parental_origin, exomiser_acmg_classification (pathogenic,
            likely_pathogenic, uncertain_significance, ...),
            exomiser_gene_combined_score, genotype_quality, has_comphet.
            Somatic only: hotspot. Values of enum fields are matched case-insensitively.
            Numeric comparisons drop NULLs: ``gnomad_v3_af < 0.01`` excludes
            variants absent from gnomAD (their AF is NULL); filter on the
            internal frequency or sort instead when they matter.
        sort: List of ``{"field", "order"}`` (``desc`` by default), e.g.
            ``[{"field": "exomiser_gene_combined_score"}]``. Only sortable
            fields: some filter fields (cadd_phred, revel_score) cannot sort,
            and the error lists the ones that can. Without ``sort``, the
            portal's default order (Exomiser gene score, then impact).
        limit: Max occurrences returned (1–100, default 20).
        offset: Pagination offset.
        additional_fields: Extra fields to return beyond the defaults, e.g.
            ["transmission_mode", "parental_origin", "father_zygosity",
            "mother_zygosity", "omim_inheritance_code", "cmc_tier"].
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    return await _run_list(
        data_type, SNV_DATA_TYPES, case_id, seq_id, task_id, tenant, filters, sort, limit, offset,
        additional_fields,
    )


async def case_cnv(
    case_id: int,
    seq_id: int,
    task_id: int,
    data_type: CaseCnvDataType = "germline_cnv",
    filters: Filters = None,
    sort: Sort = None,
    limit: int = 20,
    offset: int = 0,
    additional_fields: list[str] | None = None,
    tenant: str | None = None,
) -> ToolResult:
    """List and filter the CNV occurrences of one sequencing of a case.

    Same data, filters and order as the CNV table of the case variants tab.
    Take the key from the germline_cnv or somatic_cnv entry of
    ``get_case_context``'s ``occurrence_keys``: the CNV task of a sequencing
    is usually not its SNV task.

    Returns ``count``, ``occurrences`` (each with ``portal_url``, the CNV
    table of the case) and the table's ``portal_url``. No CNV key in
    ``occurrence_keys`` means no CNV analysis exists for that sequencing.

    Args:
        case_id: Case of the occurrence key (from ``get_case_context``'s ``occurrence_keys``).
        seq_id: Sequencing of the occurrence key.
        task_id: Task of the occurrence key.
        data_type: germline_cnv (default) or somatic_cnv.
        filters: Same syntax as ``prioritize_snv``. Useful fields: type
            (GAIN, LOSS, CNLOH, GAINLOH), symbol (genes overlapped; ``in``
            matches any), chromosome, start, end, length, cn, filter (PASS),
            quality, nb_genes, cytoband, hpo_gene_panel, omim_gene_panel,
            tenant_gene_panel.
        sort: List of ``{"field", "order"}``, e.g. ``[{"field": "length"}]``;
            an unsortable field is rejected with the list of sortable ones.
        limit: Max occurrences returned (1–100, default 20).
        offset: Pagination offset.
        additional_fields: Extra fields to return beyond the defaults.
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    return await _run_list(
        data_type, CNV_DATA_TYPES, case_id, seq_id, task_id, tenant, filters, sort, limit, offset,
        additional_fields,
    )
