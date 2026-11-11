"""Tools called through FastMCP, as clients call them: what reaches the agent
when FastMCP rejects the arguments before the tool function runs."""

import asyncio

import pytest
from fastmcp import Client, FastMCP

from radiant_mcp.tools import register_tools


@pytest.fixture
def call(configure):
    configure(radiant_api_url="http://api.example")
    mcp = FastMCP("test")
    register_tools(mcp)

    def _call(name: str, arguments: dict):
        async def go():
            async with Client(mcp) as client:
                return await client.call_tool(name, arguments, raise_on_error=False)

        result = asyncio.run(go())
        assert result.is_error
        return result.structured_content

    return _call


def test_a_value_outside_a_closed_list_is_invalid_input_with_the_allowed_values(call):
    out = call("cohort_carriers", {"gene": "TP53", "data_type": "somatic_snv"})
    assert out["ok"] is False and out["error"]["code"] == "invalid_input"
    assert out["error"]["details"]["allowed"] == ["germline_snv", "germline_cnv", "somatic_snv_tn", "somatic_cnv"]
    assert out["error"]["details"]["errors"][0]["argument"] == "data_type"


def test_survival_group_rules_reach_the_agent(call):
    out = call("survival_curve", {"groups": [
        {"label": "arm", "patient_keys": ["not-a-key"]},
        {"label": "carriers", "carriers": {"gene": "TP53", "data_type": "germline_cnv", "vep_impact": ["HIGH"]}},
    ]})
    errors = out["error"]["details"]["errors"]
    assert [e["argument"] for e in errors] == ["groups.0", "groups.1"]
    assert "not patient keys" in errors[0]["message"] and "vep_impact" in errors[1]["message"]
    # The input values the agent sent are not echoed in the details.
    assert "input" not in errors[0]


def test_a_wrong_type_is_invalid_input(call):
    out = call("bar_chart", {"title": "t", "categories": "a", "values": [1]})
    assert out["error"]["code"] == "invalid_input" and out["error"]["details"]["errors"][0]["argument"] == "categories"


def test_a_survival_curve_of_carriers_succeeds_through_fastmcp(configure, fake_api, fake_sql):
    # FastMCP passes validated GroupSpec objects, re-validated and copied with their private
    # criteria: only error paths went through a Client so far.
    configure(radiant_api_url="http://api.example")
    mcp = FastMCP("test")
    register_tools(mcp)
    fake_api.on("genes", "gene_search", [{"symbol": "TP53"}])
    fake_sql.on("v_pcx_30_patient_list", [
        {"patient_key": f"00000000-0000-4000-8000-{i:012d}", "radiant_patient_id": i, "case_count": 1,
         "survival_days": 100 * i, "vital_status": "deceased" if i % 2 else "alive"} for i in range(1, 7)])
    fake_sql.on("SELECT DISTINCT patient_id FROM car", [{"patient_id": "1"}, {"patient_id": "2"}])

    async def go():
        async with Client(mcp) as client:
            return await client.call_tool("survival_curve", {
                "groups": [{"label": "TP53 carriers", "carriers": {"gene": "TP53"}}], "others_label": "Others",
                "tenant": "demo"}, raise_on_error=False)

    result = asyncio.run(go())
    assert not result.is_error, result.structured_content
    groups = {g["group"]: g["patients"] for g in result.structured_content["data"]["groups"]}
    assert groups == {"TP53 carriers": 2, "Others": 4}
