from radiant_mcp.enums import canonical_values


def test_maps_values_to_their_stored_spelling():
    assert canonical_values("exomiser_acmg_classification", ["PATHOGENIC", "Likely_Pathogenic"]) == [
        "pathogenic", "likely_pathogenic",
    ]
    assert canonical_values("vep_impact", ["high"]) == ["HIGH"]
    assert canonical_values("clinvar", ["pathogenic"]) == ["Pathogenic"]


def test_ambiguous_value_expands_to_every_spelling():
    assert canonical_values("clinvar", ["PATHOGENIC_LOW_PENETRANCE"]) == [
        "pathogenic_low_penetrance", "Pathogenic_low_penetrance",
    ]


def test_unknown_values_and_fields_pass_through():
    assert canonical_values("vep_impact", ["HUGE"]) == ["HUGE"]
    assert canonical_values("symbol", ["brca1"]) == ["brca1"]
    assert canonical_values("cmc_tier", [1]) == [1]
