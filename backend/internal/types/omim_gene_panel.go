package types

/*
+-----------------+------------------+----+-----+-------+-----+
|Field            |CaseCategoryCode              |Null|Key  |Default|Extra|
+-----------------+------------------+----+-----+-------+-----+
|symbol           |varchar(30)       |NO  |true |null   |     |
|panel            |varchar(200)      |NO  |true |null   |     |
|inheritance_code |array<varchar(5)> |YES |false|null   |     |
|inheritance      |array<varchar(50)>|YES |false|null   |     |
|omim_gene_id     |int               |YES |false|null   |     |
|omim_phenotype_id|int               |YES |false|null   |     |
+-----------------+------------------+----+-----+-------+-----+
*/

var OmimGenePanelTable = Table{
	Name:  "omim_gene_panel",
	Alias: "om",
}

var OmimGenePanelField = Field{
	Name:            "panel",
	Alias:           "omim_gene_panel",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OmimGenePanelTable,
}

var OmimInheritanceField = Field{
	Name:            "inheritance",
	Alias:           "omim_inheritance",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	IsArray:         true,
	Table:           OmimGenePanelTable,
}

type OmimGenePanel = struct {
	OmimPhenotypeId string            `json:"omim_phenotype_id,omitempty"`
	Panel           string            `json:"panel,omitempty"`
	InheritanceCode JsonArray[string] `gorm:"type:json" json:"inheritance_code,omitempty"`
} // @name OmimGenePanel
