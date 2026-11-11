"""Every query the curated tools build, checked against the StarRocks schema.

Each builder is called with sample arguments covering its branches. sqlglot
parses the SQL and resolves every column against the tables the ETL and the
portal publish (``contracts``): an unknown table, an unknown column, or a
column no table of the FROM clause holds fails here, not at runtime in
production.
"""

import re

import pytest
import sqlglot
from sqlglot import exp
from sqlglot.optimizer.qualify import qualify

from radiant_mcp.api_fields import PATIENT_FILTER_FIELDS
from radiant_mcp.domain.criteria import Criteria
from radiant_mcp.domain.data_types import COHORT_DATA_TYPES
from radiant_mcp.queries import carriers, charts, genes, hits, patients, sequencing
from radiant_mcp.schema_catalog import SHARED_DB, TENANT_DB

TENANT = "t1"
TENANT_SQL_DB = f"{TENANT}_tenant"
SNV_KEY = {"seq_id": 10, "task_id": 20, "part": 5, "variant_part": 0, "data_type": "germline_snv"}
CNV_KEY = {"seq_id": 10, "task_id": 21, "part": 5, "variant_part": 0, "data_type": "germline_cnv"}
GENES = ["TP53", "BRCA1"]


def _criteria() -> list[Criteria]:
    out = []
    for data_type in COHORT_DATA_TYPES:
        out.append(Criteria(data_type=data_type, gene="TP53"))
        if "_snv" in data_type:
            out.append(Criteria(data_type=data_type, gene="TP53", vep_impact=("HIGH",),
                                clinvar=("Pathogenic",), max_gnomad_af=0.01, zygosity=("HET",)))
        else:
            out.append(Criteria(data_type=data_type, gene="TP53", cnv_types=("LOSS",)))
    return out


def _queries():
    yield "sequencing.parts", sequencing.parts_query(1131)
    for data_type in ("germline_snv", "somatic_snv_tn"):
        yield f"sequencing.genotyped_patients[{data_type}]", sequencing.genotyped_patients_query(TENANT, data_type)
    yield "hits.snv_cnv", hits.snv_cnv_query(TENANT_SQL_DB, SNV_KEY, CNV_KEY)
    yield "hits.family_deletions", hits.family_deletions_query(TENANT_SQL_DB, CNV_KEY, GENES)
    yield "hits.comphet", hits.comphet_query(TENANT_SQL_DB, SNV_KEY)
    yield "hits.germline_keys", hits.germline_keys_query(SHARED_DB, TENANT, 42)
    yield "hits.germline_plp", hits.germline_plp_query(TENANT_SQL_DB, SNV_KEY)
    yield "hits.somatic_snv", hits.somatic_snv_query(TENANT_SQL_DB, SNV_KEY, GENES)
    # The branch that also keeps the germline first-hit loci, whatever their impact.
    yield "hits.somatic_snv[first hits]", hits.somatic_snv_query(TENANT_SQL_DB, SNV_KEY, GENES, ["3", "7"])
    yield "hits.somatic_cnv", hits.somatic_cnv_query(TENANT_SQL_DB, CNV_KEY, GENES)
    for name, query in genes.gene_queries("TP53", "ENSG00000141510", TENANT).items():
        yield f"genes.{name}", query
    for c in _criteria():
        label = f"{c.data_type}{'+filters' if c.vep_impact or c.cnv_types else ''}"
        yield f"carriers.totals[{label}]", carriers.totals_query(TENANT, c)
        yield f"carriers.carriers[{label}]", carriers.carriers_query(TENANT, c, 50)
        for name, query in carriers.summary_queries(TENANT, c).items():
            yield f"carriers.{name}[{label}]", query
        yield f"carriers.phenotypes[{label}]", carriers.phenotypes_query(TENANT, c, 50)
        yield f"carriers.phenotyped_patients[{label}]", carriers.phenotyped_patients_query(TENANT, c)
        yield f"carriers.carriers_with_term[{label}]", carriers.carriers_with_term_query(TENANT, c, "HP:0001250", 50)
        yield f"carriers.carrier_patients[{label}]", carriers.carrier_patients_query(TENANT, c)
        if c.is_snv:
            yield f"carriers.lollipop[{label}]", carriers.lollipop_query(TENANT, c)
    members = [("proband", SNV_KEY), ("father", {**SNV_KEY, "seq_id": 11}), ("mother", {**SNV_KEY, "seq_id": 12})]
    yield "charts.venn", charts.venn_query(TENANT_SQL_DB, members, False, [])
    yield "charts.venn[rare+impact]", charts.venn_query(TENANT_SQL_DB, members, True, ["HIGH"])
    for data_type in COHORT_DATA_TYPES:
        yield f"charts.oncoprint[{data_type}]", charts.oncoprint_query(TENANT, data_type, GENES, 0.01, ["HIGH"])
    yield "charts.oncoprint[no filter]", charts.oncoprint_query(TENANT, "germline_snv", GENES, None, [])
    yield "patients.patient_list", patients.patient_list_query(TENANT, {}, 50001)
    # Every filter field the portal accepts must resolve in the subquery, or survival_curve
    # fails at run time on a field api_fields allows.
    yield "patients.patient_list[every filter]", patients.patient_list_query(
        TENANT, {field: ["x"] for field in PATIENT_FILTER_FIELDS}, 50001)


QUERIES = list(_queries())


@pytest.fixture(scope="module")
def schema(etl_tables, portal_tenant_objects) -> dict[str, dict[str, dict[str, str]]]:
    """``{db: {table: {column: type}}}`` with the tenant placeholder made concrete."""
    out: dict[str, dict[str, dict[str, str]]] = {}
    for qualified, columns in {**etl_tables, **portal_tenant_objects}.items():
        db, table = qualified.split(".", 1)
        out.setdefault(TENANT_SQL_DB if db == TENANT_DB else db, {})[table] = columns
    return out


def _parse(sql: str) -> exp.Expression:
    # Bound values become literals: the checks are about tables and columns.
    return sqlglot.parse_one(re.sub(r"%\(p\d+\)s", "1", sql).replace("%%", "%"), dialect="starrocks")


@pytest.mark.parametrize("name, query", QUERIES, ids=[name for name, _ in QUERIES])
def test_query_uses_only_existing_tables_and_columns(schema, name, query):
    sql, _params = query
    tree = _parse(sql)
    ctes = {cte.alias for cte in tree.find_all(exp.CTE)}
    for table in tree.find_all(exp.Table):
        if not table.db and table.name in ctes:
            continue
        assert table.name in schema.get(table.db, {}), f"{name}: {table.db}.{table.name} is created by neither the ETL nor the portal"
    try:
        qualify(tree, schema=schema, dialect="starrocks", validate_qualify_columns=True)
    except sqlglot.errors.OptimizeError as exc:
        pytest.fail(f"{name}: {exc}\n{sql}")


def test_every_builder_is_covered():
    """A new ``*_query`` builder in ``radiant_mcp.queries`` must be added to ``_queries``."""
    import importlib
    import inspect
    import pkgutil

    import radiant_mcp.queries

    covered = {name.split("[")[0] for name, _ in QUERIES}
    # Every module of the package, so a new one cannot be forgotten.
    for info in pkgutil.iter_modules(radiant_mcp.queries.__path__):
        module = importlib.import_module(f"radiant_mcp.queries.{info.name}")
        for fn_name, fn in inspect.getmembers(module, inspect.isfunction):
            if fn.__module__ == module.__name__ and fn_name.endswith("_query") and not fn_name.startswith("_"):
                short = f"{module.__name__.rsplit('.', 1)[1]}.{fn_name.removesuffix('_query')}"
                assert short in covered, f"{short} is not checked against the schema"
