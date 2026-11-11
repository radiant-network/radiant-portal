"""``lollipop``: the carriers' variants of a gene along its protein."""

import re
from dataclasses import replace

from fastmcp.tools import ToolResult

from ... import charts
from ... import portal_api as _api
from ... import sql as _sql
from ...domain.consequences import consequence_class
from ...domain.criteria import Criteria, build_criteria
from ...domain.data_types import COHORT_SNV_DATA_TYPES, CohortSnvDataType
from ...portal_api import RadiantApi, resolve_tenant
from ...queries.carriers import LOLLIPOP_ROW_LIMIT, lollipop_query
from ...results import ToolOutput, failure, not_found, ok, respond
from ...services.genes import not_found_message, resolve_gene

_AA_POSITION = re.compile(r"(\d+)")


def _lollipop(api: RadiantApi, token: str, criteria_: Criteria, tenant: str | None) -> ToolOutput:
    tenant_code = resolve_tenant(api, tenant)
    gene = resolve_gene(api, tenant_code, criteria_.gene)
    if gene is None:
        raise not_found(not_found_message(criteria_.gene))
    criteria_ = replace(criteria_, gene=_sql.symbol(gene["symbol"]))
    rows, cut_rows = _sql.cut(_sql.run(token, *lollipop_query(tenant_code, criteria_)), LOLLIPOP_ROW_LIMIT)
    cut = None
    if cut_rows:
        cut = (f"Only the {LOLLIPOP_ROW_LIMIT} variants with the most carriers are counted and drawn: "
               "add filters (impact, ClinVar, rarity) for a complete picture.")
    # A variant in the gene whose picked annotation is another (overlapping) gene has
    # no protein position on this gene's transcript: counted, not drawn.
    on_gene = [row for row in rows if (row.get("symbol") or "").upper() == criteria_.gene.upper()]
    other_gene = len(rows) - len(on_gene)
    positioned = []
    for row in on_gene:
        match = _AA_POSITION.search(row.get("aa_change") or "")
        if match:
            positioned.append((row, int(match.group(1))))
    if not positioned:
        return ok({"tenant": tenant_code, "gene": criteria_.gene, "criteria": criteria_.describe(), "variants_drawn": 0,
                   "variants_without_protein_change": len(on_gene), "variants_picked_on_another_gene": other_gene},
                  warnings=["No carrier variant with a protein change: no chart drawn."], truncated=cut)
    per_transcript: dict[str, int] = {}
    for row, _ in positioned:
        per_transcript[row["transcript_id"]] = per_transcript.get(row["transcript_id"], 0) + 1
    transcript = max(per_transcript, key=per_transcript.get)
    points = [charts.Lollipop(position, row["aa_change"], int(row["carriers"]), consequence_class((row["kind"] or "").split(",")))
              for row, position in positioned if row["transcript_id"] == transcript]
    left_out = len(positioned) - len(points)
    png = charts.lollipop(points, f"{criteria_.gene} — variants of the carriers",
                          f"transcript {transcript or 'not annotated'}; {criteria_.data_type}")
    return ok({
        "tenant": tenant_code, "gene": criteria_.gene, "transcript": transcript, "criteria": criteria_.describe(),
        "variants_drawn": len(points), "variants_on_other_transcripts": left_out,
        "variants_without_protein_change": len(on_gene) - len(positioned),
        "variants_picked_on_another_gene": other_gene,
        "top_variants": [{"aa_change": p.label, "carriers": p.carriers, "class": p.kind}
                         for p in sorted(points, key=lambda p: -p.carriers)[:15]],
    }, image=png, truncated=cut)


async def lollipop(
    gene: str,
    data_type: CohortSnvDataType = "germline_snv",
    vep_impact: list[str] | None = None,
    clinvar: list[str] | None = None,
    max_gnomad_af: float | None = None,
    zygosity: list[str] | None = None,
    tenant: str | None = None,
) -> ToolResult:
    """Lollipop plot of the carriers' variants along the protein of a gene.

    Each variant is placed at its protein position (from aa_change), its height
    is the number of carrier patients, its colour its consequence class. The
    variants are drawn on the transcript most of them are annotated on, which
    the result names; variants on other transcripts are counted, not drawn, and
    so are the variants without a protein change and those whose picked
    annotation is another, overlapping gene (``variants_picked_on_another_gene``).

    Args:
        gene: Official HGNC symbol (case-insensitive) or Ensembl gene id; aliases
            are not resolved.
        data_type: germline_snv (default) or somatic_snv_tn (tumor-normal analyses only: tumor-only
            calls are mostly germline variants).
        vep_impact: e.g. ["HIGH", "MODERATE"].
        clinvar: e.g. ["Pathogenic", "Likely_pathogenic"] (any of them).
        max_gnomad_af: Keeps variants with gnomAD v3 AF below it OR absent from
            gnomAD (e.g. 0.01).
        zygosity: e.g. ["HOM"] (tumor zygosity for somatic).
        tenant: Tenant code (auto-resolved when the user has only one).
    """
    try:
        _sql.one_of(data_type, COHORT_SNV_DATA_TYPES, "data_type")
        criteria_ = build_criteria(data_type, gene, vep_impact, clinvar, max_gnomad_af, zygosity, None)
    except _sql.InvalidInput as exc:
        return respond(failure(exc))
    return await _api.run(_lollipop, criteria_, tenant)
