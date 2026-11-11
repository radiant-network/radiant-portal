"""Gene and ontology tools: ``gene_info`` and ``lookup_terms``."""

from concurrent.futures import ThreadPoolExecutor
from typing import Any

from fastmcp.tools import ToolResult

from .. import portal_api as _api
from .. import sql as _sql
from ..portal_api import RadiantApi, clamp, resolve_tenant
from ..queries.genes import LIST_LIMITS, gene_queries
from ..results import ToolOutput, Truncation, describe, error, failure, not_found, ok, respond
from ..services.genes import not_found_message, resolve_gene

ONTOLOGIES = {
    "hpo": ("hpo", "hpo_term_auto_complete"),
    "mondo": ("mondo", "mondo_term_auto_complete"),
}
TERMS_MAX_LIMIT = 50
_HPO_TERMS_SHOWN = 100
_WORKERS = 3


def _gene_info(api: RadiantApi, token: str, gene: str, tenant: str | None) -> ToolOutput:
    tenant_code = resolve_tenant(api, tenant)
    resolved = resolve_gene(api, tenant_code, gene)
    if resolved is None:
        raise not_found(not_found_message(gene))
    symbol = _sql.symbol(resolved["symbol"])
    queries = gene_queries(symbol, resolved.get("ensembl_gene_id"), tenant_code)

    def _fetch(item: tuple[str, tuple[str, _sql.Params]]) -> tuple[str, Any, str | None]:
        name, (sql, params) = item
        try:
            return name, _sql.run(token, sql, params), None
        except _sql.SqlError as exc:
            return name, None, f"{name}: {describe(exc)}"

    result: dict[str, Any] = {
        "tenant": tenant_code,
        "symbol": symbol,
        "ensembl_gene_id": resolved.get("ensembl_gene_id"),
    }
    warnings: list[str] = []
    cut_lists: dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=_WORKERS) as pool:
        rows = {}
        for name, data, warning in pool.map(_fetch, queries.items()):
            if warning:
                warnings.append(warning)
            else:
                rows[name] = data

    # OMIM, Orphanet and constraint are read one row past their limit to tell a cut.
    for name, field, what in (("omim", "omim_conditions", "conditions"), ("orphanet", "orphanet_disorders", "disorders"),
                              ("constraint", "gnomad_constraint", "transcripts, highest pLI first")):
        if name not in rows:
            continue
        rows[name], cut = _sql.cut(rows[name], LIST_LIMITS[name])
        if cut:
            cut_lists[field] = f"`{field}` lists the first {LIST_LIMITS[name]} {what}"
    if "omim" in rows:
        result["omim_conditions"] = [
            {**r, "inheritance_code": _sql.as_list(r.get("inheritance_code"))} for r in rows["omim"]
        ]
    if "hpo" in rows:
        result["hpo_terms_count"] = len(rows["hpo"])
        result["hpo_terms"], cut = _sql.cut(rows["hpo"], _HPO_TERMS_SHOWN)
        if cut:
            cut_lists["hpo_terms"] = (f"`hpo_terms` lists the first {_HPO_TERMS_SHOWN} of {len(rows['hpo'])} terms; "
                                      "`hpo_terms_count` counts them all")
    if "orphanet" in rows:
        result["orphanet_disorders"] = [
            {**r, "inheritance_code": _sql.as_list(r.get("inheritance_code"))} for r in rows["orphanet"]
        ]
    if "ddd" in rows:
        result["ddd_panels"] = [r["panel"] for r in rows["ddd"]]
    if "cosmic" in rows:
        result["cosmic_panels"] = [r["panel"] for r in rows["cosmic"]]
    if "tenant_panels" in rows:
        result["tenant_gene_panels"] = [r["panel"] for r in rows["tenant_panels"]]
    if "constraint" in rows:
        result["gnomad_constraint"] = rows["constraint"]
    cut = Truncation(reason="; ".join(cut_lists.values()) + ".", lists=list(cut_lists)) if cut_lists else None
    return ok(result, warnings=warnings, truncated=cut)


def _lookup_terms(
    api: RadiantApi, _token: str, ontology: str, query: str, tenant: str | None, limit: int,
) -> ToolOutput:
    tenant_code = resolve_tenant(api, tenant)
    api_name, operation = ONTOLOGIES[ontology]
    # One past the limit tells a cut list from a complete one of exactly `limit` terms.
    matches, cut = _sql.cut(api.call(api_name, operation, tenant=tenant_code, prefix=query,
                                     limit=str(limit + 1)) or [], limit)
    terms = []
    for match in matches:
        source = match.get("source") or {}
        if source.get("id"):
            terms.append({"id": source["id"], "name": source.get("name")})
    truncated = (f"`terms` lists the first {limit} matches: raise `limit` (up to {TERMS_MAX_LIMIT}) or use a "
                 "longer query." if cut else None)
    return ok({"tenant": tenant_code, "ontology": ontology, "query": query, "terms": terms}, truncated=truncated)


# -- tools -------------------------------------------------------------------

async def gene_info(symbol: str, tenant: str | None = None) -> ToolResult:
    """What is known about a gene, independently of any patient.

    Returns ``omim_conditions`` (condition, OMIM ids, inheritance),
    ``hpo_terms`` (the HPO phenotypes associated with the gene, with their
    count), ``orphanet_disorders``, ``ddd_panels``, ``cosmic_panels`` (cancer
    gene census membership), ``tenant_gene_panels`` (the tenant's own panels
    that contain the gene) and ``gnomad_constraint`` (pLI and LOEUF per
    transcript, highest pLI first). Sections that fail are listed in
    ``warnings``.

    Args:
        symbol: Official HGNC symbol (case-insensitive) or Ensembl gene id (e.g.
            SCN1A, ENSG00000144285); aliases (HER2, P53) are not resolved.
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    try:
        _sql.symbol(symbol)
    except _sql.InvalidInput as exc:
        return respond(failure(exc))
    return await _api.run(_gene_info, symbol, tenant)


async def lookup_terms(ontology: str, query: str, tenant: str | None = None, limit: int = 10) -> ToolResult:
    """Find HPO or MONDO terms by name or id, with their identifiers.

    Use it to name an HPO code, or to find the MONDO id of a condition (e.g.
    for the Condition field of an interpretation draft). Never invent an id:
    take it from this tool.

    Args:
        ontology: ``hpo`` or ``mondo``.
        query: Words of the term name, or the beginning of an id (e.g.
            "seizure", "HP:00012", "Dravet").
        tenant: Tenant code (auto-resolved when the user has only one).
        limit: Max terms returned (1–50, default 10).
    """
    if ontology not in ONTOLOGIES:
        return respond(error("invalid_input", f"Unknown ontology {ontology!r}.", allowed=list(ONTOLOGIES)))
    if not (query or "").strip():
        return respond(error("invalid_input", "Provide a non-empty `query`."))
    return await _api.run(_lookup_terms, ontology, query.strip(), tenant, clamp(limit, 1, TERMS_MAX_LIMIT))
