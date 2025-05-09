package types

var OmimGenePanelField = Field{
	Name:            "panel",
	Alias:           "omim_gene_panel",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OmimGenePanelTable,
}

var HpoGenePanelTable = Table{
	Name:  "hpo_gene_panel",
	Alias: "hpo",
}
var HpoGenePanelField = Field{
	Name:            "panel",
	Alias:           "hpo_gene_panel",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           HpoGenePanelTable,
}

var GenePanelsTables = []Table{HpoGenePanelTable, OmimGenePanelTable}
