"""Gene resolution through the portal gene search.

The search matches the current HGNC symbol and the Ensembl gene id, not the
aliases (``ensembl_gene.alias`` is not read): HER2 or P53 are not found.
"""


from .. import sql as _sql
from ..portal_api import RadiantApi


def resolve_gene(api: RadiantApi, tenant: str, symbol: str) -> dict | None:
    """``{symbol, ensembl_gene_id}`` of a gene name, through the portal gene
    search (it knows the current HGNC symbols); None when unknown."""
    return resolve_genes(api, tenant, [symbol])[symbol]


def resolve_genes(api: RadiantApi, tenant: str, names: list[str]) -> dict[str, dict | None]:
    """Each of ``names`` (a symbol or an Ensembl gene id) mapped to its gene, None when
    unknown, in one portal call: the search takes a list and matches each input exactly,
    case-insensitively, on the symbol or the gene id. A symbol match wins."""
    from radiant_python.models.gene_search_body import GeneSearchBody

    for name in names:
        _sql.symbol(name)
    if not names:
        return {}
    body = GeneSearchBody(inputs=list(dict.fromkeys(names)))
    results = [r for r in api.call("genes", "gene_search", tenant=tenant, gene_search_body=body) or []
               if r.get("symbol")]
    by_symbol: dict[str, dict] = {}
    by_id: dict[str, dict] = {}
    for r in results:  # the portal sorts by symbol: the first of a duplicated one is kept
        by_symbol.setdefault(r["symbol"].upper(), r)
        by_id.setdefault((r.get("ensembl_gene_id") or "").upper(), r)
    return {name: by_symbol.get(name.upper()) or by_id.get(name.upper()) for name in names}


def not_found_message(gene: str) -> str:
    """What the agent reads when ``resolve_gene`` finds nothing: how to retry."""
    return (f"Gene {gene!r} not found. Use the official HGNC symbol (e.g. ERBB2, not HER2) or the Ensembl "
            "gene id: aliases are not resolved.")
