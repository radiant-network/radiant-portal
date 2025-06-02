package types

type Organization struct {
	ID           int
	Code         string
	Name         string
	CategoryCode string
	Category     OrganizationCategory `gorm:"foreignKey:code;references:CategoryCode"`
}

var OrganizationTable = Table{
	Name: "radiant_jdbc.public.organization",
}

func (Organization) TableName() string {
	return OrganizationTable.Name
}
