"""Occurrence keys and their StarRocks partitions.

The occurrence tables (germline / somatic SNV and CNV, exomiser,
``snv__consequence_filter_partitioned``) are ``PARTITION BY (part)``, and
``snv__variant_partitioned`` by ``variant_part``, so every efficient occurrence
query needs both.
"""


# Mirrors `_magic` in radiant-portal-pipeline/radiant/dags/import_part.py
# (compute_part): variant_part = part // 10.
VARIANT_PART_DIVISOR = 10


def variant_part(part: int) -> int:
    return part // VARIANT_PART_DIVISOR


def with_parts(key: dict, part: int | None) -> dict:
    """``key`` with its ``part`` and ``variant_part`` when ``part`` is known."""
    if part is None:
        return key
    return {**key, "part": part, "variant_part": variant_part(part)}
