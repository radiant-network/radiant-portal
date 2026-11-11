package types

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

// organizationCodePattern is permissive on purpose: existing org codes are uppercase and some
// contain dashes (e.g. CHOP, LDM-CHUSJ), and unlike a tenant code an org code is never used as a
// DB identifier — only as an FK data value. So it allows either case, digits, underscore, and
// dash, must start with a letter, and is stored as entered.
var organizationCodePattern = regexp.MustCompile(`^[A-Za-z][A-Za-z0-9_-]{0,49}$`)

type Organization struct {
	Code               string `gorm:"primaryKey"`
	TenantCode         string `gorm:"primaryKey"`
	Name               string
	CategoryCode       string
	NotificationEmails *string
	Category           OrganizationCategory `gorm:"foreignKey:code;references:CategoryCode"`
}

// SplitNotificationEmails reads the comma-separated notification_emails column; NULL and "" both
// read as no address. Never returns nil so JSON shows [].
func SplitNotificationEmails(column *string) []string {
	emails := []string{}
	if column == nil {
		return emails
	}
	for _, email := range strings.Split(*column, ",") {
		if trimmed := strings.TrimSpace(email); trimmed != "" {
			emails = append(emails, trimmed)
		}
	}
	return emails
}

// NotificationEmailsColumn stores the list as entered; a blank value is NULL, not "".
func NotificationEmailsColumn(emails string) *string {
	if strings.TrimSpace(emails) == "" {
		return nil
	}
	return &emails
}

func validateNotificationEmails(emails string) error {
	for _, email := range SplitNotificationEmails(&emails) {
		if err := ValidateEmail(email); err != nil {
			return fmt.Errorf("notification %w", err)
		}
	}
	return nil
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
	Code               string `json:"code"`
	Name               string `json:"name"`
	CategoryCode       string `json:"category_code"`
	CategoryName       string `json:"category_name"`
	NotificationEmails string `json:"notification_emails"`
} // @name OrganizationResponse

// ErrOrganizationCodeExists and ErrOrganizationUnknownCategory are returned by the organization
// write repository so a handler can map them to 409 / 400 without depending on the DB driver.
var (
	ErrOrganizationCodeExists      = errors.New("organization code already exists in this tenant")
	ErrOrganizationUnknownCategory = errors.New("unknown organization category")
	ErrOrganizationNotFound        = errors.New("organization not found in this tenant")
)

// @Description Payload to create an organization in a tenant.
type CreateOrganizationRequest struct {
	Code               string `json:"code" binding:"required"`
	Name               string `json:"name" binding:"required"`
	CategoryCode       string `json:"category_code" binding:"required"`
	NotificationEmails string `json:"notification_emails"`
} // @name CreateOrganizationRequest

func (r CreateOrganizationRequest) Validate() error {
	if !organizationCodePattern.MatchString(r.Code) {
		return fmt.Errorf("code %q is invalid: must start with a letter and contain only letters, digits, underscores, or dashes (max 50)", r.Code)
	}
	return validateNotificationEmails(r.NotificationEmails)
}

// @Description Payload to update an organization. Code and category are immutable after creation.
// @Description notification_emails is comma-separated and replaced as a whole; blank clears it.
type UpdateOrganizationRequest struct {
	Name               string `json:"name" binding:"required"`
	NotificationEmails string `json:"notification_emails"`
} // @name UpdateOrganizationRequest

func (r UpdateOrganizationRequest) Validate() error {
	return validateNotificationEmails(r.NotificationEmails)
}
