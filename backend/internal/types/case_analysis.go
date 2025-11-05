package types

type AnalysisCatalog struct {
	ID      int
	Code    string
	Name    string
	PanelID int
	Panel   Panel `gorm:"foreignKey:ID;references:PanelID"`

	Description string
}

var AnalysisCatalogTable = Table{
	Name:  "radiant_jdbc.public.analysis_catalog",
	Alias: "ca",
}

func (AnalysisCatalog) TableName() string {
	return AnalysisCatalogTable.Name
}

var AnalysisCatalogCodeField = Field{
	Name:            "code",
	Alias:           "analysis_catalog_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           AnalysisCatalogTable,
}

var AnalysisCatalogNameField = Field{
	Name:          "name",
	Alias:         "analysis_catalog_name",
	CanBeSelected: true,
	Table:         AnalysisCatalogTable,
}
