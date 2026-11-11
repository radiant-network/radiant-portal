"""``describe_schema`` against the owners of the StarRocks schema: the ETL
for the tables, the portal for the clinical views (``schema_sources``).
"""

import asyncio
import re

import pytest
from conftest import envelope

from radiant_mcp.enums import ENUMS, FIELD_ENUMS
from radiant_mcp.schema_catalog import ARRAY_RULE, TOPICS, render
from radiant_mcp.tools.schema import describe_schema

_TABLE_REF = re.compile(r"(<tenant>_tenant|\bradiant)\.(\w+)")


def _catalog_tables():
    seen = set()
    for topic_name, topic in TOPICS.items():
        for table in topic.tables:
            if (table.qualified, tuple(table.columns)) not in seen:
                seen.add((table.qualified, tuple(table.columns)))
                yield topic_name, table


def _owned_by(owner: str):
    return [(name, table) for name, table in _catalog_tables() if table.owner == owner]


def test_every_table_has_a_known_owner():
    assert {table.owner for _, table in _catalog_tables()} == {"etl", "portal"}


@pytest.mark.parametrize("topic_name, table", _owned_by("portal"), ids=lambda v: getattr(v, "qualified", v))
def test_clinical_views_and_columns_exist_in_the_portal(portal_views, topic_name, table):
    assert table.qualified in portal_views, f"{topic_name}: {table.qualified} is not created by the portal"
    missing = sorted(set(table.columns) - portal_views[table.qualified])
    assert not missing, f"{table.qualified}: columns not in the portal view: {missing}"


@pytest.mark.parametrize("topic_name, table", _owned_by("etl"), ids=lambda v: getattr(v, "qualified", v))
def test_catalog_tables_and_columns_exist_in_the_etl(etl_tables, topic_name, table):
    assert table.qualified in etl_tables, f"{topic_name}: {table.qualified} is not created by the ETL"
    missing = sorted(set(table.columns) - etl_tables[table.qualified].keys())
    assert not missing, f"{table.qualified}: columns not in the ETL DDL: {missing}"
    assert set(table.enums) <= set(table.columns)


@pytest.mark.parametrize("name", sorted(ENUMS))
def test_enums_match_the_etl_dictionaries(etl_dictionaries, name):
    assert name in etl_dictionaries, f"no dict_{name} macro in the ETL data QA dictionaries"
    assert sorted(ENUMS[name]) == sorted(etl_dictionaries[name])


def test_enum_references_are_known():
    assert set(FIELD_ENUMS.values()) <= set(ENUMS)
    for _, table in _catalog_tables():
        assert set(table.enums.values()) <= set(ENUMS)


@pytest.mark.parametrize("topic_name", sorted(TOPICS))
def test_example_queries_only_use_tables_of_the_catalog(topic_name):
    known = {table.qualified for topic in TOPICS.values() for table in topic.tables}
    for title, sql in TOPICS[topic_name].queries:
        for db, name in _TABLE_REF.findall(sql):
            assert f"{db}.{name}" in known, f"{topic_name} / {title}: {db}.{name} is not in the catalog"


@pytest.mark.parametrize("topic_name", sorted(TOPICS))
def test_render(topic_name):
    text = render(topic_name)
    assert text.startswith(f"# {TOPICS[topic_name].title}\n")
    for table in TOPICS[topic_name].tables:
        assert f"### {table.qualified}" in text


@pytest.mark.parametrize("topic_name", sorted(TOPICS))
def test_topics_with_array_columns_explain_unnest(topic_name):
    topic = TOPICS[topic_name]
    if any("(array" in d for table in topic.tables for d in table.columns.values()):
        assert ARRAY_RULE in topic.rules
        assert "unnest(" in render(topic_name)


def test_render_prints_the_stored_enum_values():
    assert "'likely_pathogenic'" in render("germline_snv")


def test_describe_schema_tool():
    assert envelope(asyncio.run(describe_schema("cnv")))["data"]["documentation"] == render("cnv")
    nope = envelope(asyncio.run(describe_schema("nope")))
    assert nope["error"]["code"] == "invalid_input" and nope["error"]["details"]["allowed"] == list(TOPICS)
