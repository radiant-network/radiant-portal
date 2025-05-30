package types

type Organization struct {
	ID                   int
	Code                 string
	Name                 string
	Category             string
	OrganizationCategory OrganizationCategory `gorm:"foreignKey:Code;references:Category"`
}

var OrganizationTable = Table{
	Name: "radiant_jdbc.public.organization",
}

func (Organization) TableName() string {
	return OrganizationTable.Name
}
