package types

import (
	"errors"
	"fmt"
)

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

// ErrOrganizationCodeExists and ErrOrganizationUnknownCategory are returned by the organization
// write repository so a handler can map them to 409 / 400 without depending on the DB driver.
var (
	ErrOrganizationCodeExists      = errors.New("organization code already exists in this tenant")
	ErrOrganizationUnknownCategory = errors.New("unknown organization category")
)

// @Description Payload to create an organization in a tenant.
type CreateOrganizationRequest struct {
	Code         string `json:"code" binding:"required"`
	Name         string `json:"name" binding:"required"`
	CategoryCode string `json:"category_code" binding:"required"`
} // @name CreateOrganizationRequest

func (r CreateOrganizationRequest) Validate() error {
	if !IsValidCode(r.Code) {
		return fmt.Errorf("code %q is invalid: must be lowercase, start with a letter, and contain only letters, digits, or underscores (max 50)", r.Code)
	}
	return nil
}
