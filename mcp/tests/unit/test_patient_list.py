"""``queries.patients``: the clinical patient list of survival_curve, against the portal's search."""

import re

import pytest
from conftest import bound_value

from radiant_mcp import sql as _sql
from radiant_mcp.queries import patients


def test_array_filter_fields_match_the_portal(portal):
    # An array field filters with arrays_overlap, a scalar one with IN, as the portal's filter.go.
    source = (portal / "backend/internal/types/pcx_patient_query.go").read_text()
    arrays = re.findall(r'Field\{Name: "(\w+)"[^}]*CanBeFiltered: true[^}]*IsArray: true', source)
    assert sorted(arrays) == sorted(patients.ARRAY_FILTER_FIELDS)


def test_filters_become_the_portal_conditions():
    sql, params = patients.patient_list_query("demo", {
        "cns_integrated_diagnosis": ["Medulloblastoma", "Ependymoma"], "vital_status": "deceased",
        "chemotherapy_agents": ["vincristine"], "age_at_initial_dx_group": "childhood"}, 11)
    assert "FROM demo_tenant.v_pcx_30_patient_list" in sql
    assert bound_value(sql, params.values, "pl.vital_status IN (") == "deceased"
    assert bound_value(sql, params.values, "arrays_overlap(pl.chemotherapy_agents, [") == "vincristine"
    assert bound_value(sql, params.values, "pl.age_at_initial_dx_group IN (") == "childhood"
    assert re.search(r"pl\.cns_integrated_diagnosis IN \(%\(p\d+\)s, %\(p\d+\)s\)", sql)
    assert bound_value(sql, params.values, "ORDER BY pl.patient_key LIMIT ") == 11
    no_filter, _ = patients.patient_list_query("demo", {}, 11)
    assert " WHERE " not in no_filter


@pytest.mark.parametrize("filters, message", [
    ({"patient_key": "x"}, "invalid patient filter field"),
    ({"vital_status; DROP": "x"}, "invalid patient filter field"),
    ({"vital_status": []}, "give a value or a list"),
    ({"vital_status": {"op": "in"}}, "give a value or a list"),
])
def test_only_filter_fields_and_plain_values_reach_the_sql(filters, message):
    with pytest.raises(_sql.InvalidInput, match=message):
        patients.patient_list_query("demo", filters, 11)


def test_filter_sets_are_anded_not_merged():
    # Cohort "vincristine or cisplatin" AND group "carboplatin": both conditions, not their
    # (empty) intersection, which would leave the group with nobody.
    sql, params = patients.patient_list_query("demo", [{"chemotherapy_agents": ["vincristine", "cisplatin"]},
                                                       {"chemotherapy_agents": ["carboplatin"]}], 11)
    assert sql.count("arrays_overlap(pl.chemotherapy_agents") == 2
    assert {"vincristine", "cisplatin", "carboplatin"} <= set(params.values.values())
