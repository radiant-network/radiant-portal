package types

type Organization struct {
	Code         string `gorm:"primaryKey"`
	TenantCode   string `gorm:"primaryKey"`
	Name         string
	CategoryCode string
	Category     OrganizationCategory `gorm:"foreignKey:code;references:CategoryCode"`
}

var OrganizationTable = Table{
	Name:           "organization",
	FederationName: "radiant_jdbc.public.organization",
	Alias:          "org",
}

var SequencingLabTable = Table{
	Name:           OrganizationTable.Name,
	FederationName: OrganizationTable.FederationName,
	Alias:          "lab",
}

var ManagingOrganizationTable = Table{
	Name:           OrganizationTable.Name,
	FederationName: OrganizationTable.FederationName,
	Alias:          "mgmt_org",
}

var OrderingOrganizationTable = Table{
	Name:           OrganizationTable.Name,
	FederationName: OrganizationTable.FederationName,
	Alias:          "order_org",
}

func (Organization) TableName() string {
	return OrganizationTable.Name
}

// @Description Organization within a tenant, with its category label.
type OrganizationResponse struct {
	Code         string `json:"code"`
	Name         string `json:"name"`
	CategoryCode string `json:"category_code"`
	CategoryName string `json:"category_name"`
} // @name OrganizationResponse
