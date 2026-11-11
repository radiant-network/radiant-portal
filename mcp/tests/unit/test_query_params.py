"""Every curated query binds exactly its placeholders, and the rules use stored values."""

import re

import pytest
from conftest import CNV_KEY, SNV_KEY, bound_value
from test_curated_sql_schema import QUERIES

from radiant_mcp.domain import rules as _rules
from radiant_mcp.domain.criteria import build_criteria
from radiant_mcp.enums import ENUMS
from radiant_mcp.queries import carriers as carrier_queries
from radiant_mcp.queries import hits as hit_queries


def _placeholders(sql: str) -> set[str]:
    return set(re.findall(r"%\((p\d+)\)s", sql))


# -- rules ---------------------------------------------------------------------

def test_rules_use_stored_values():
    assert set(_rules.QUALIFYING_IMPACTS) <= set(ENUMS["vep_impact"])
    assert set(_rules.CLINVAR_PLP) <= set(ENUMS["clinvar_interpretation"])
    assert set(_rules.EXOMISER_PLP) <= set(ENUMS["exomiser_acmg_classification"])
    assert set(_rules.GERMLINE_SECOND_HIT_CNV_TYPES) <= set(ENUMS["cnv_type"])
    assert set(_rules.SOMATIC_SECOND_HIT_CNV_TYPES) <= set(ENUMS["cnv_type"])
    assert _rules.HET in ENUMS["zygosity"]


# -- every query binds exactly its placeholders ----------------------------------

def _all_queries():
    criteria = [
        build_criteria("germline_snv", "SCN1A", ["HIGH"], ["Pathogenic"], 0.01, ["HET"], None),
        build_criteria("somatic_snv_tn", "TP53", None, None, None, None, None),
        build_criteria("germline_cnv", "DMD", None, None, None, None, ["LOSS"]),
        build_criteria("somatic_cnv", "CDKN2A", None, None, None, None, None),
    ]
    yield "snv_cnv", hit_queries.snv_cnv_query("demo_tenant", SNV_KEY, CNV_KEY)
    yield "comphet", hit_queries.comphet_query("demo_tenant", SNV_KEY)
    yield "germline_keys", hit_queries.germline_keys_query("radiant", "demo", 100)
    yield "germline_plp", hit_queries.germline_plp_query("demo_tenant", SNV_KEY)
    yield "somatic_snv", hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["BRCA1", "TP53"])
    yield "somatic_snv first hits", hit_queries.somatic_snv_query("demo_tenant", SNV_KEY, ["BRCA1", "TP53"], ["3"])
    yield "somatic_cnv", hit_queries.somatic_cnv_query("demo_tenant", CNV_KEY, ["BRCA1"])
    for c in criteria:
        yield f"totals {c.data_type}", carrier_queries.totals_query("demo", c)
        yield f"carriers {c.data_type}", carrier_queries.carriers_query("demo", c, 10)
        for name, query in carrier_queries.summary_queries("demo", c).items():
            yield f"{name} {c.data_type}", query
        yield f"phenotypes {c.data_type}", carrier_queries.phenotypes_query("demo", c, 10)
        yield f"phenotyped {c.data_type}", carrier_queries.phenotyped_patients_query("demo", c)
        yield f"with_term {c.data_type}", carrier_queries.carriers_with_term_query("demo", c, "HP:0001250", 10)


# Constants of the SQL itself, not values: split_part(transcript_id, '.', 1) drops the version,
# array_join(..., ',') joins the consequences.
_SQL_CONSTANTS = ("'.'", "','")


# The hit and cohort queries with every filter, plus every builder of the schema check
# (test_curated_sql_schema: test_every_builder_is_covered keeps that list complete).
@pytest.mark.parametrize("name, query", list(_all_queries()) + QUERIES, ids=lambda v: v if isinstance(v, str) else "")
def test_each_query_binds_exactly_its_placeholders(name, query):
    sql, params = query
    assert _placeholders(sql) == set(params.values), name
    for constant in _SQL_CONSTANTS:
        sql = sql.replace(constant, "")
    assert "'" not in sql, f"{name}: a literal value is written into the SQL"


def test_carrier_query_binds_the_gene_and_the_tenant_to_their_own_slots():
    criteria = build_criteria("germline_snv", "SCN1A", None, None, None, None, None)
    sql, params = carrier_queries.totals_query("demo", criteria)
    assert bound_value(sql, params.values, "WHERE cf.symbol = ") == "SCN1A"
    assert bound_value(sql, params.values, "s.tenant_code = ") == "demo"
