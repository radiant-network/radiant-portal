"""``oncoprint``: which cases carry alterations in a gene list."""

from typing import Any

from fastmcp.tools import ToolResult

from ... import charts
from ... import portal_api as _api
from ... import sql as _sql
from ...domain import data_types as _data_types
from ...domain import rules as _rules
from ...domain.consequences import consequence_class
from ...domain.data_types import COHORT_DATA_TYPES, CohortDataType
from ...enums import ENUMS, canonical_values
from ...portal_api import RadiantApi, resolve_tenant
from ...queries.charts import ONCOPRINT_ROW_LIMIT, oncoprint_query
from ...results import ToolOutput, Truncation, failure, not_found, ok, respond
from ...services.genes import resolve_genes

MAX_ONCOPRINT_GENES = 20
MAX_ONCOPRINT_CASES = 100


def _oncoprint(api: RadiantApi, token: str, genes: list[str], data_types: list[str], tenant: str | None,
               max_gnomad_af: float | None, vep_impact: list[str]) -> ToolOutput:
    tenant_code = resolve_tenant(api, tenant)
    resolved, unknown = [], []
    genes_found = resolve_genes(api, tenant_code, genes)
    for gene in genes:
        found = genes_found[gene]
        if found:
            resolved.append(_sql.symbol(found["symbol"]))
        else:
            unknown.append(gene)
    # A symbol and its Ensembl id resolve to the same symbol: one row.
    resolved = list(dict.fromkeys(resolved))
    if not resolved:
        raise not_found(f"No known gene among {genes}. Use official HGNC symbols (e.g. ERBB2, not HER2): "
                        "aliases are not resolved.")
    warnings = ([f"unknown gene(s), left out: {', '.join(unknown)} (use official HGNC symbols: aliases "
                 "are not resolved)"] if unknown else [])
    cells: dict[tuple[str, str], set[str]] = {}
    truncated = []
    for data_type in data_types:
        rows, cut = _sql.cut(
            _sql.run(token, *oncoprint_query(tenant_code, data_type, resolved, max_gnomad_af, vep_impact)),
            ONCOPRINT_ROW_LIMIT)
        if cut:
            truncated.append(data_type)
            # Rows come by case: the cut can fall inside the last case read, which would show
            # with only some of its genes. Drop it, so every case shown is complete.
            last = rows[-1]["case_id"] if rows else None
            rows = [row for row in rows if row["case_id"] != last]
        for row in rows:
            kind = consequence_class(row["kind"].split(",")) if _data_types.is_snv(data_type) else row["kind"]
            cells.setdefault((row["gene"], f"case {row['case_id']}"), set()).add(kind)
    altered: dict[str, int] = {}
    for (_, case) in cells:
        altered[case] = altered.get(case, 0) + 1
    cases = sorted(altered, key=lambda c: (-altered[c], int(c.split()[1])))
    shown = cases[:MAX_ONCOPRINT_CASES]
    flat = {key: (next(iter(kinds)) if len(kinds) == 1 else "multiple") for key, kinds in cells.items() if key[1] in shown}
    if not flat:
        return ok({"tenant": tenant_code, "genes": resolved, "data_types": data_types, "altered_cases": 0},
                  warnings=[*warnings, "No carrier of these genes with these filters: no chart drawn."])
    title = f"Alterations in {', '.join(resolved)} ({', '.join(data_types)})"
    png = charts.oncoprint(resolved, shown, flat, title)
    per_gene = {g: sum(1 for (gene, _) in cells if gene == g) for g in resolved}
    result: dict[str, Any] = {
        "tenant": tenant_code, "genes": resolved, "unknown_genes": unknown, "data_types": data_types,
        "altered_cases": len(cases), "cases_shown": len(shown), "altered_cases_per_gene": per_gene,
        "filters": {"max_gnomad_af": max_gnomad_af, "vep_impact": vep_impact or None,
                    "applied_to": "SNV data types only"},
        "classes": "truncating > splice (acceptor / donor) > missense > inframe > other for SNVs; CNV type "
                   "for CNVs; 'multiple' when a case has several classes in a gene",
    }
    if any(not _data_types.is_somatic(t) for t in data_types):
        result["germline"] = "a germline case counts the proband's variants only, not the parents'"
        if "germline_snv" in data_types:
            result["germline_snv_quality"] = _rules.GERMLINE_QUALITY_DEFINITION
        if "germline_snv" in data_types and max_gnomad_af is None and not vep_impact:
            warnings.append("no frequency or impact filter: common germline polymorphisms are counted; "
                            "pass max_gnomad_af (e.g. 0.01) or vep_impact for rare or damaging variants")
    if "somatic_snv_tn" in data_types:
        result["somatic_snv_quality"] = _rules.SOMATIC_QUALITY_DEFINITION
    cut = None
    if truncated:
        cut = Truncation(reason=f"More than {ONCOPRINT_ROW_LIMIT} rows: the cases with the highest case ids are "
                                "missing; narrow the genes or add filters.", lists=truncated)
    elif len(shown) < len(cases):
        cut = Truncation(reason=f"The chart shows the {len(shown)} most altered of {len(cases)} cases; "
                                "`altered_cases_per_gene` counts them all.")
    return ok(result, warnings=warnings, truncated=cut, image=png)


async def oncoprint(
    genes: list[str],
    data_types: list[CohortDataType] | None = None,
    max_gnomad_af: float | None = None,
    vep_impact: list[str] | None = None,
    tenant: str | None = None,
) -> ToolResult:
    """Oncoprint: which cases of the tenant carry an alteration in each gene, by type.

    Rows are genes, columns are cases (most altered first, at most 100);
    cells are coloured by alteration class: truncating, splice (acceptor /
    donor), missense, inframe, other for SNVs; LOSS, GAIN, CNLOH, GAINLOH for
    CNVs; 'multiple' when a case has several classes in a gene. A germline
    case counts the proband's variants only. Returns the image plus the
    altered cases per gene, over every altered case, not only those shown.
    SNV calls follow the platform's carrier quality rule (germline: FILTER
    PASS, GQ >= 20, alternate depth >= 3; somatic: FILTER PASS, tumor
    alternate depth >= 2). Germline SNVs have no rarity or impact filter by
    default: pass max_gnomad_af or vep_impact to leave out common
    polymorphisms. Both filters apply to the SNV data types only.

    Args:
        genes: 1 to 20 official HGNC symbols (or Ensembl gene ids); aliases are
            not resolved.
        data_types: Among germline_snv (default), germline_cnv, somatic_snv_tn (tumor-normal
            analyses only), somatic_cnv.
        max_gnomad_af: SNV only; keeps variants below this gnomAD AF or absent (e.g. 0.01).
        vep_impact: SNV only, e.g. ["HIGH", "MODERATE"].
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    try:
        if not genes or len(genes) > MAX_ONCOPRINT_GENES:
            raise _sql.InvalidInput(f"give 1 to {MAX_ONCOPRINT_GENES} genes")
        genes = [_sql.symbol(g) for g in dict.fromkeys(genes)]
        types = _sql.all_of(data_types or ["germline_snv"], COHORT_DATA_TYPES, "data_type")
        af = None
        if max_gnomad_af is not None:
            af = _sql.number(max_gnomad_af)
            if not 0 < af <= 1:
                raise _sql.InvalidInput("max_gnomad_af must be in (0, 1]")
        impacts = _sql.all_of(canonical_values("vep_impact", vep_impact or []), ENUMS["vep_impact"], "vep_impact")
        used = [name for name, value in (("max_gnomad_af", af), ("vep_impact", impacts)) if value]
        if used and not any(_data_types.is_snv(t) for t in types):
            raise _sql.InvalidInput(f"{', '.join(used)} only apply to SNV data types")
    except _sql.InvalidInput as exc:
        return respond(failure(exc))
    return await _api.run(_oncoprint, genes, types, tenant, af, impacts)
