"""Radiant tools registered on the server's FastMCP instance.

``describe_schema``, ``bar_chart`` and the raw SQL tools (``read_query``,
``table_overview``) are always registered. The tools backed by the Radiant
portal API are registered only when ``RADIANT_API_URL`` is set, so the server
still boots as a StarRocks SQL server without it.
"""

from ..portal_api import api_enabled
from ..results import OUTPUT_SCHEMA, ArgumentErrors
from .cases import get_case_context, list_tenants, search_cases
from .charts import bar_chart, family_venn, lollipop, oncoprint, patient_timeline, survival_curve
from .cohort import cohort_carriers, genotype_phenotype
from .genes import gene_info, lookup_terms
from .hits import second_hit
from .occurrences import case_cnv, prioritize_snv
from .patients import get_patient_context, search_patients
from .query import read_query, table_overview
from .schema import describe_schema
from .variants import variant_carriers, variant_details

API_TOOLS = (
    list_tenants,
    search_cases,
    get_case_context,
    search_patients,
    get_patient_context,
    prioritize_snv,
    case_cnv,
    variant_details,
    variant_carriers,
    second_hit,
    gene_info,
    lookup_terms,
    cohort_carriers,
    genotype_phenotype,
    family_venn,
    survival_curve,
    oncoprint,
    lollipop,
    patient_timeline,
)


def register_tools(mcp) -> list[str]:
    """Register the Radiant tools on ``mcp`` and return their names."""
    # bar_chart draws numbers the agent passes, and the SQL tools only need
    # StarRocks: no API needed.
    tools = [describe_schema, bar_chart, read_query, table_overview]
    if api_enabled():
        # Fail fast at boot if the client isn't installed rather than on first call.
        import radiant_python  # noqa: F401

        tools += API_TOOLS
    for tool in tools:
        # One result shape for every tool (results.ToolOutput), published as its output schema.
        mcp.tool(tool, output_schema=OUTPUT_SCHEMA)
    # Arguments FastMCP rejects before a tool runs come back in the same envelope.
    mcp.add_middleware(ArgumentErrors())
    return [tool.__name__ for tool in tools]
