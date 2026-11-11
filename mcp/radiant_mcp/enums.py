"""Closed value sets of the Radiant data, as stored (case-sensitive).

StarRocks compares strings case-sensitively, so a filter on ``PATHOGENIC``
silently matches nothing when the data holds ``pathogenic``. The tools map
user values onto these stored spellings before sending a filter, and
``describe_schema`` prints them for SQL.

Each set mirrors a dictionary of the ETL data QA
(``radiant/data_qa/macros/dictionaries.sql`` in radiant-portal-pipeline,
macro ``dict_<name>``). The unit tests compare them with the ETL when a
checkout is available, so a value added on one side fails the build.
"""

from collections.abc import Iterable

ENUMS: dict[str, tuple[str, ...]] = {
    "exomiser_acmg_classification": (
        "pathogenic", "likely_pathogenic", "uncertain_significance", "likely_benign", "benign",
    ),
    "clinvar_interpretation": (
        "Affects", "association_not_found", "association", "Benign",
        "confers_sensitivity", "Conflicting_classifications_of_pathogenicity",
        "conflicting_data_from_submitters",
        "Conflicting_interpretations_of_pathogenicity", "drug_response",
        "Established_risk_allele", "Likely_benign",
        "likely_pathogenic_low_penetrance", "Likely_pathogenic",
        "Likely_risk_allele",
        "no_classification_for_the_single_variant", "no_classifications_from_unflagged_records",
        "not_provided", "other",
        "pathogenic_low_penetrance", "Pathogenic", "protective", "risk_factor",
        "Uncertain_risk_allele", "Uncertain_significance", "VUS-high", "VUS-low", "VUS-mid",
        "_low_penetrance", "low_penetrance", "Likely_pathogenic_low_penetrance",
        "Pathogenic_low_penetrance",
    ),
    "vep_impact": ("HIGH", "MODERATE", "LOW", "MODIFIER"),
    "zygosity": ("HET", "HOM", "HEM", "WT", "UNK"),
    "transmission_mode": (
        "autosomal_dominant_de_novo", "autosomal_dominant", "autosomal_recessive",
        "x_linked_dominant_de_novo", "x_linked_recessive_de_novo", "x_linked_dominant",
        "x_linked_recessive", "non_carrier_proband", "unknown_parents_genotype",
        "unknown_father_genotype", "unknown_mother_genotype", "unknown_proband_genotype",
        "uniparental_disomy",
    ),
    "variant_class": ("insertion", "deletion", "SNV", "indel", "substitution", "sequence_alteration"),
    "cnv_type": ("GAIN", "LOSS", "CNLOH", "GAINLOH"),
    "cosmic_tier": ("1", "2", "3", "Other"),
}

# Portal API filter field -> value set. Fields not listed are passed as given.
FIELD_ENUMS: dict[str, str] = {
    "exomiser_acmg_classification": "exomiser_acmg_classification",
    "clinvar": "clinvar_interpretation",
    "vep_impact": "vep_impact",
    "zygosity": "zygosity",
    "father_zygosity": "zygosity",
    "mother_zygosity": "zygosity",
    "transmission_mode": "transmission_mode",
    "variant_class": "variant_class",
    "type": "cnv_type",
    "cmc_tier": "cosmic_tier",
}


def canonical_values(field: str, values: Iterable, expand: bool = True) -> list:
    """Map each value onto its stored spelling for ``field``.

    Matching ignores case. A value that matches several stored spellings
    (``Pathogenic_low_penetrance`` and ``pathogenic_low_penetrance``) expands
    to all of them when ``expand`` is true — right for ``in`` / ``not-in``,
    where values are OR-ed. With ``expand`` false (``all``, comparisons) such a
    value is kept as given. A value that matches none is kept as given, so the
    API still reports it.
    """
    enum = FIELD_ENUMS.get(field)
    values = list(values)
    if enum is None:
        return values
    out: list = []
    for value in values:
        matches = [v for v in ENUMS[enum] if isinstance(value, str) and v.lower() == value.lower()]
        if len(matches) > 1 and not expand:
            matches = [value]
        for v in matches or [value]:
            if v not in out:
                out.append(v)
    return out
