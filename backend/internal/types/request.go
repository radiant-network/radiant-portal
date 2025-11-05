package types

type Request struct {
	ID                     int
	OrderingPhysician      string
	OrderingOrganizationID int
	Organization           Organization `gorm:"foreignKey:ID;references:OrderingOrganizationID"`
	OrderNumber            string
}

var RequestTable = Table{
	Name:  "radiant_jdbc.public.request",
	Alias: "r",
}

func (Request) TableName() string {
	return RequestTable.Name
}

var RequestOrderingOrganizationCodeField = Field{
	Name:            "code",
	Alias:           "ordering_organization_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           OrderingOrganizationTable,
}

var RequestOrderingOrganizationNameField = Field{
	Name:          "name",
	Alias:         "ordering_organization_name",
	CanBeSelected: true,
	Table:         OrderingOrganizationTable,
}
