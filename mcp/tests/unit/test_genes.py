"""``gene_info`` and ``lookup_terms``."""

from conftest import bound_value, echo_gene_search

from radiant_mcp import sql as _sql
from radiant_mcp.tools.genes import gene_info, lookup_terms


def test_gene_info(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("omim_gene_panel", [{"condition_name": "Dravet", "inheritance_code": '["AD"]'}])
    fake_sql.on("hpo_gene_panel", [{"hpo_term_id": f"HP:{i:07d}"} for i in range(150)])
    fake_sql.on("gene_panel_mv", _sql.SqlError("Unknown table gene_panel_mv"))
    fake_sql.on("gnomad_constraint", [{"transcript_id": "ENST1", "pli": 1.0, "loeuf": 0.1}])

    result = run(gene_info("scn1a", tenant="demo"))

    assert result["data"]["symbol"] == "SCN1A" and result["data"]["ensembl_gene_id"] == "ENSG1"
    assert result["data"]["omim_conditions"] == [{"condition_name": "Dravet", "inheritance_code": ["AD"]}]
    assert result["data"]["hpo_terms_count"] == 150 and len(result["data"]["hpo_terms"]) == 100
    assert result["data"]["gnomad_constraint"][0]["pli"] == 1.0
    assert "tenant_gene_panels" not in result["data"]
    assert result["warnings"] == ["tenant_panels: StarRocks error: Unknown table gene_panel_mv"]
    [(sql, values)] = fake_sql.matching("ensembl_exon_by_gene")
    assert bound_value(sql, values, "e.gene_id = ") == "ENSG1"


def test_gene_info_unknown_gene(fake_api, fake_sql, run):
    fake_api.on("genes", "gene_search", [])
    error = run(gene_info("NOPE1", tenant="demo"))["error"]
    # The portal search does not read aliases: the agent is told to retry with the HGNC symbol.
    assert error["code"] == "not_found" and "official HGNC symbol" in error["message"]
    assert "aliases are not resolved" in error["message"]


def test_lookup_terms(fake_api, run):
    fake_api.on("mondo", "mondo_term_auto_complete", [
        {"highlight": {"id": "x"}, "source": {"id": "MONDO:0100135", "name": "Dravet syndrome"}},
        {"source": {}},
    ])
    result = run(lookup_terms("mondo", " dravet ", tenant="demo", limit=500))
    assert result["data"]["terms"] == [{"id": "MONDO:0100135", "name": "Dravet syndrome"}]
    # One past the cap of 50, to tell a cut list.
    assert fake_api.kwargs("mondo_term_auto_complete") == {"tenant": "demo", "prefix": "dravet", "limit": "51"}
    assert result.get("truncated") is None


def test_lookup_terms_says_when_it_cut_the_list(fake_api, run):
    fake_api.on("hpo", "hpo_term_auto_complete", [{"source": {"id": f"HP:{i:07d}", "name": "x"}} for i in range(3)])
    result = run(lookup_terms("hpo", "seiz", tenant="demo", limit=2))
    assert len(result["data"]["terms"]) == 2 and "raise `limit`" in result["truncated"]["reason"]


def test_lookup_terms_validates(fake_api, run):
    assert "Unknown ontology" in run(lookup_terms("go", "x"))["error"]["message"]
    assert "non-empty" in run(lookup_terms("hpo", "  "))["error"]["message"]


def test_gene_info_says_which_lists_it_cut(fake_api, fake_sql, run):
    # OMIM, Orphanet and constraint are read one row past their limit: a cut list says so.
    echo_gene_search(fake_api)
    fake_sql.on("omim_gene_panel", [{"condition_name": f"c{i}", "inheritance_code": "[]"} for i in range(51)])
    fake_sql.on("orphanet_gene_panel", [{"disorder": "d", "inheritance_code": "[]"}])
    fake_sql.on("gnomad_constraint", [{"transcript_id": f"ENST{i}", "pli": 1.0} for i in range(11)])
    result = run(gene_info("SCN1A", tenant="demo"))
    assert len(result["data"]["omim_conditions"]) == 50 and len(result["data"]["gnomad_constraint"]) == 10
    assert sorted(result["truncated"]["lists"]) == ["gnomad_constraint", "omim_conditions"]


def test_an_expired_token_fails_gene_info_instead_of_warning_on_every_section(fake_api, fake_sql, run):
    echo_gene_search(fake_api)
    fake_sql.on("omim_gene_panel", _sql.SqlError("Authentication expired", "expired"))
    result = run(gene_info("SCN1A", tenant="demo"))
    assert result["ok"] is False and result["error"]["code"] == "auth_required"


def test_genes_resolve_in_one_search_by_symbol_or_ensembl_id(fake_api):
    from radiant_mcp.services.genes import resolve_genes

    fake_api.on("genes", "gene_search", [{"symbol": "BRCA1", "ensembl_gene_id": "ENSG00000012048"},
                                        {"symbol": "TP53", "ensembl_gene_id": "ENSG00000141510"}])
    found = resolve_genes(fake_api, "demo", ["tp53", "ENSG00000012048", "P53"])
    assert {name: g and g["symbol"] for name, g in found.items()} == {
        "tp53": "TP53", "ENSG00000012048": "BRCA1", "P53": None}  # no alias: P53 is unknown
    assert len([c for c in fake_api.calls if c[1] == "gene_search"]) == 1
