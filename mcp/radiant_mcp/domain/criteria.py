"""Carrier criteria: the validated filters of a gene-level carrier query.

``cohort_carriers``, ``genotype_phenotype``, ``lollipop`` and the carrier
groups of ``survival_curve`` share them.
"""

from dataclasses import dataclass
from typing import Any

from .. import sql as _sql
from ..enums import ENUMS, canonical_values
from . import data_types
from . import rules as _rules


@dataclass(frozen=True)
class Criteria:
    """Validated filters of a carrier query."""

    data_type: str
    gene: str
    vep_impact: tuple[str, ...] = ()
    clinvar: tuple[str, ...] = ()
    max_gnomad_af: float | None = None
    zygosity: tuple[str, ...] = ()
    cnv_types: tuple[str, ...] = ()

    @property
    def is_snv(self) -> bool:
        return data_types.is_snv(self.data_type)

    @property
    def is_somatic(self) -> bool:
        return data_types.is_somatic(self.data_type)

    def describe(self) -> dict:
        out: dict[str, Any] = {"data_type": self.data_type, "gene": self.gene}
        for name in ("vep_impact", "clinvar", "zygosity", "cnv_types"):
            if getattr(self, name):
                out[name] = list(getattr(self, name))
        if self.max_gnomad_af is not None:
            out["max_gnomad_af"] = f"< {self.max_gnomad_af:g} or absent from gnomAD"
        if not self.is_snv:
            out["filter"] = _rules.PASS
        elif self.is_somatic:
            out["quality"] = _rules.SOMATIC_QUALITY_DEFINITION
        else:
            out["quality"] = _rules.GERMLINE_QUALITY_DEFINITION
        if self.is_snv:
            out["gene_match"] = ("a consequence on a transcript of the gene (not only the picked one), "
                                 "other than upstream, downstream or intergenic (a variant only near "
                                 "the gene does not count); a vep_impact filter keeps a variant by "
                                 "its most severe impact on that gene")
            if self.clinvar:
                out["gene_match"] += ("; a clinvar filter counts a variant for the gene only when the gene is its "
                                      "picked gene or its impact there is at least LOW (a classification "
                                      "belongs to the variant, not to an overlapping gene)")
        out["reruns"] = "the latest imported task of each sequencing in each case"
        if self.data_type == "somatic_snv_tn":
            out["analyses"] = ("tumor-normal only: tumor-only analyses keep the germline variants and are "
                               "left out")
        elif self.data_type == "somatic_cnv":
            out["analyses"] = "the tumor-only CNV calling (the only somatic CNV source)"
        return out


def build_criteria(
    data_type: str,
    gene: str,
    vep_impact: list[str] | None,
    clinvar: list[str] | None,
    max_gnomad_af: float | None,
    zygosity: list[str] | None,
    cnv_types: list[str] | None,
) -> Criteria:
    _sql.one_of(data_type, data_types.COHORT_DATA_TYPES, "data_type")
    _sql.symbol(gene)
    snv_only = {"vep_impact": vep_impact, "clinvar": clinvar, "max_gnomad_af": max_gnomad_af, "zygosity": zygosity}
    if not data_types.is_snv(data_type):
        used = [name for name, value in snv_only.items() if value not in (None, [], ())]
        if used:
            raise _sql.InvalidInput(f"{', '.join(used)} only apply to SNV data types")
    elif cnv_types:
        raise _sql.InvalidInput("cnv_types only applies to CNV data types")

    af = None
    if max_gnomad_af is not None:
        af = _sql.number(max_gnomad_af)
        if not 0 < af <= 1:
            raise _sql.InvalidInput("max_gnomad_af must be in (0, 1]")
    return Criteria(
        data_type=data_type,
        gene=gene,
        vep_impact=tuple(_sql.all_of(canonical_values("vep_impact", vep_impact or []), ENUMS["vep_impact"], "vep_impact")),
        clinvar=tuple(_sql.all_of(canonical_values("clinvar", clinvar or []), ENUMS["clinvar_interpretation"], "clinvar")),
        max_gnomad_af=af,
        zygosity=tuple(_sql.all_of(canonical_values("zygosity", zygosity or []), ENUMS["zygosity"], "zygosity")),
        cnv_types=tuple(_sql.all_of(canonical_values("type", cnv_types or []), ENUMS["cnv_type"], "cnv_types")),
    )
