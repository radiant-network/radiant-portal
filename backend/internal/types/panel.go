package types

type Panel struct {
	ID       int
	Code     string
	Name     string
	TypeCode string
	Type     PanelType `gorm:"foreignKey:Code;references:TypeCode"`
}

var PanelTable = Table{
	Name:           "panel",
	FederationName: "radiant_jdbc.public.panel",
	Alias:          "panel",
}

func (Panel) TableName() string {
	return PanelTable.Name
}

var PanelCodeField = Field{
	Name:          "code",
	Alias:         "panel_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         PanelTable,
}

var PanelNameField = Field{
	Name:          "name",
	Alias:         "panel_name",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         PanelTable,
}
