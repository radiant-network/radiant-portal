"""The tool list the assistant sees (RAD-251, acceptance criterion 4)."""

import asyncio
import inspect
import re
from pathlib import Path

from fastmcp import FastMCP

from radiant_mcp.tools import register_tools

API_TOOLS = {
    "list_tenants", "search_cases", "get_case_context", "search_patients", "get_patient_context",
    "prioritize_snv", "case_cnv", "variant_details", "variant_carriers",
    "second_hit", "gene_info", "lookup_terms", "cohort_carriers", "genotype_phenotype",
    "family_venn", "survival_curve", "oncoprint", "lollipop", "patient_timeline",
}
ALWAYS = {"describe_schema", "bar_chart", "read_query", "table_overview"}


def _names(mcp) -> set[str]:
    return {tool.name for tool in asyncio.run(mcp.list_tools())}


def test_the_assistant_sees_the_radiant_tools_and_the_read_only_sql(configure):
    configure(radiant_api_url="http://api.example")
    mcp = FastMCP("test")
    register_tools(mcp)
    assert _names(mcp) == API_TOOLS | ALWAYS
    assert asyncio.run(mcp.list_resources()) == []
    assert asyncio.run(mcp.list_resource_templates()) == []


def test_without_the_api_only_the_schema_chart_and_sql_tools_are_added():
    mcp = FastMCP("test")
    assert set(register_tools(mcp)) == ALWAYS


def test_unexpected_errors_do_not_leak_their_message():
    from radiant_mcp.results import failure

    error = failure(ConnectionError("HTTPConnectionPool(host='radiant-api.internal', port=8090): refused")).error
    assert error.code == "internal"
    assert error.message == "Unexpected ConnectionError in the tool; the details are in the server logs."


def test_the_assistant_sees_every_line_of_each_tool_docstring(configure):
    # FastMCP publishes only the text before ``Args:`` and one description per
    # documented name: text after the block, or ``a, b: ...``, never reaches the model.
    configure(radiant_api_url="http://api.example")
    mcp = FastMCP("test")
    register_tools(mcp)
    for tool in asyncio.run(mcp.list_tools()):
        doc = inspect.getdoc(tool.fn)
        summary, _, args = doc.partition("\nArgs:\n")
        assert tool.description == summary.strip(), tool.name
        assert all(not line or line.startswith(" ") for line in args.splitlines()), (
            f"{tool.name}: text after Args is not published")
        undocumented = [name for name, schema in tool.parameters["properties"].items()
                        if not schema.get("description")]
        assert not undocumented, f"{tool.name}: no description for {undocumented}"


def test_every_tool_has_its_entry_in_the_tools_page(configure):
    # docs/tools.md explains each tool in plain words: a new or renamed tool needs its entry.
    configure(radiant_api_url="http://api.example")
    mcp = FastMCP("test")
    register_tools(mcp)
    page = (Path(__file__).parents[2] / "docs" / "tools.md").read_text()
    documented = set(re.findall(r"^### (\w+)$", page, re.MULTILINE))
    assert documented == _names(mcp)
