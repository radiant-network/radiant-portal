"""The germline and somatic SNV call quality rules, the same as the ETL's carrier frequencies."""

from .. import sql as _sql
from ..domain import rules as _rules


def germline_qualifies(p: _sql.Params, alias: str = "o") -> str:
    """SQL condition: a germline SNV call the platform counts as a carrier.

    Same rule as ``qualifies`` in the ETL's germline_snv_staging_variant_freq_insert.sql
    (the ``germline_pc_*`` / ``germline_pf_*`` frequencies the portal shows): FILTER
    PASS, genotype quality and alternate depth at least the thresholds. ``filter`` is
    per site, ``gq`` per sample: a PASS site can still hold a poor call of one member.
    """
    # The ETL stores a GQ or alternate depth of 0 as NULL: a NULL fails the rule (it
    # does in the ETL's WHERE too), and COALESCE keeps `NOT germline_qualifies` true
    # for it instead of NULL.
    return (f"COALESCE({alias}.filter = {p(_rules.PASS)} AND {alias}.gq >= {p(_rules.GERMLINE_MIN_GQ)}"
            f" AND {alias}.ad_alt >= {p(_rules.GERMLINE_MIN_AD_ALT)}, FALSE)")


def somatic_qualifies(p: _sql.Params, alias: str = "o") -> str:
    """SQL condition: a somatic SNV call the platform counts as a carrier.

    Same rule as ``qualifies`` in the ETL's somatic_snv_staging_variant_freq_insert.sql
    (the ``somatic_pc_*`` frequencies the portal shows): FILTER PASS and tumor alternate
    depth at least the threshold. A NULL depth fails it, as in the ETL.
    """
    return (f"COALESCE({alias}.filter = {p(_rules.PASS)}"
            f" AND {alias}.tumor_ad_alt >= {p(_rules.SOMATIC_MIN_TUMOR_AD_ALT)}, FALSE)")
