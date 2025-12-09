package types

type Panel struct {
	ID       int
	Code     string
	Name     string
	TypeCode string
	Type     PanelType `gorm:"foreignKey:Code;references:CaseTypeCode"`
}

var PanelTable = Table{
	Name:           "panel",
	FederationName: "radiant_jdbc.public.panel",
	Alias:          "panel",
}

func (Panel) TableName() string {
	return PanelTable.Name
}
