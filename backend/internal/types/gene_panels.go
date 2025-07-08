package types

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

var DddGenePanelTable = Table{
	Name:  "ddd_gene_panel",
	Alias: "ddd",
}
var DddGenePanelField = Field{
	Name:            "panel",
	Alias:           "ddd_gene_panel",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           DddGenePanelTable,
}

var CosmicGenePanelTable = Table{
	Name:  "cosmic_gene_panel",
	Alias: "cosmic",
}
var CosmicGenePanelField = Field{
	Name:            "panel",
	Alias:           "cosmic_gene_panel",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           CosmicGenePanelTable,
}
var OrphanetGenePanelTable = Table{
	Name:  "orphanet_gene_panel",
	Alias: "orph",
}
var OrphanetGenePanelField = Field{
	Name:            "panel",
	Alias:           "orphanet_gene_panel",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OrphanetGenePanelTable,
}

var GenePanelsTables = []Table{HpoGenePanelTable, OmimGenePanelTable, DddGenePanelTable, CosmicGenePanelTable, OrphanetGenePanelTable}

type GenePanelCondition = struct {
	Symbol          string            `json:"-"`
	PanelName       string            `json:"panel_name" validate:"required"`
	InheritanceCode JsonArray[string] `gorm:"type:json" json:"inheritance_code" validate:"required"`
	PanelID         string            `json:"panel_id"`
}
