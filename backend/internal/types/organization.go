package types

type Organization struct {
	ID           int
	Code         string
	Name         string
	CategoryCode string
	Category     OrganizationCategory `gorm:"foreignKey:code;references:CategoryCode"`
}

var OrganizationTable = Table{
	Name:  "radiant_jdbc.public.organization",
	Alias: "org",
}

var DiagnosisLabTable = Table{
	Name:  OrganizationTable.Name,
	Alias: "lab",
}

var ManagingOrganizationTable = Table{
	Name:  OrganizationTable.Name,
	Alias: "mgmt_org",
}

var OrderingOrganizationTable = Table{
	Name:  OrganizationTable.Name,
	Alias: "order_org",
}

func (Organization) TableName() string {
	return OrganizationTable.Name
}
