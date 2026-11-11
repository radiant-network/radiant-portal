"""VEP impacts in SQL: their severity order, and the most severe impact of a variant on a gene."""

from .. import sql as _sql
from ..enums import ENUMS

# Most severe first: the stored VEP impact values, in their order of severity.
IMPACTS: tuple[str, ...] = tuple(ENUMS["vep_impact"])


def impact_rank(p: _sql.Params, column: str = "cf.vep_impact") -> str:
    """0 for HIGH ... 3 for MODIFIER, NULL when unknown: MIN of it is the most severe impact
    (MIN skips NULLs, so an unknown impact stays NULL instead of reading as MODIFIER)."""
    rank = " ".join(f"WHEN {p(impact)} THEN {i}" for i, impact in enumerate(IMPACTS))
    return f"CASE {column} {rank} END"


def impact_label(p: _sql.Params, rank: str) -> str:
    """The impact name of an ``impact_rank`` value; NULL stays NULL."""
    label = " ".join(f"WHEN {i} THEN {p(impact)}" for i, impact in enumerate(IMPACTS))
    return f"CASE {rank} {label} END"


def most_severe_in(p: _sql.Params, impacts: tuple[str, ...] | list[str]) -> str:
    """HAVING condition, per (locus, gene) group of consequence rows: the variant's most
    severe impact on the gene is one of ``impacts`` (a MODERATE filter leaves out a
    variant that is HIGH on another transcript of the gene)."""
    ranks = [IMPACTS.index(impact) for impact in impacts]  # callers validated them against ENUMS
    return f"MIN({impact_rank(p)}) IN ({p.list(ranks)})"
