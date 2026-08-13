package types

// Service catalog entry types. Named after the entity the service is requested for,
// not after FHIR vocabulary: a case-level service is an analysis (RGDI, MMG), a
// sequencing-level service is an MSSS sequencing code (75020, 75022, …).
const (
	ServiceTypeCase       = "case"
	ServiceTypeSequencing = "sequencing"
)

type ServiceCatalog struct {
	ID      int
	Code    string
	Type    string
	NameEn  string
	NameFr  string
	PanelID int
	Panel   Panel `gorm:"foreignKey:ID;references:PanelID"`

	Description string
	TenantCode  string
}

var ServiceCatalogTable = Table{
	FederationName: "radiant_jdbc.public.service_catalog",
	Name:           "service_catalog",
	Alias:          "sc",
}

func (ServiceCatalog) TableName() string {
	return ServiceCatalogTable.Name
}

// The Alias values below are deliberately left at analysis_catalog_*: they are not
// just JSON keys, they are the filter/sort identifiers persisted inside
// saved_filter.queries (jsonb). Renaming one silently stops every saved filter that
// references it from matching.
var ServiceCatalogCodeField = Field{
	Name:            "code",
	Alias:           "analysis_catalog_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           ServiceCatalogTable,
}

var ServiceCatalogNameField = Field{
	Name:          "name_en",
	Alias:         "analysis_catalog_name",
	CanBeSelected: true,
	Table:         ServiceCatalogTable,
}
