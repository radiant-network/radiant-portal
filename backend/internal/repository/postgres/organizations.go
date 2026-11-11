package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type OrganizationRepository struct {
	db *gorm.DB
}

func NewOrganizationRepository(db database.PostgresDB) *OrganizationRepository {
	return &OrganizationRepository{db: db.DB}
}

// GetOrganizationByCode resolves an organization code within the tenant. organization is keyed by
// (code, tenant_code) — the target of the compound FKs added by migration 000009 — so an
// unscoped lookup would report an organization as existing that the subsequent INSERT then
// rejects on the FK, instead of the caller's own "unknown organization" error.
func (r *OrganizationRepository) GetOrganizationByCode(ctx context.Context, organizationCode string, tenantCode string) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.WithContext(ctx).Table(types.OrganizationTable.Name).Where("code = ? AND tenant_code = ?", organizationCode, tenantCode)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving organization by code: %w", err)
		}
		return nil, nil
	}
	return &organization, nil
}

// CreateOrganization inserts an organization in the tenant. A duplicate (code, tenant_code) maps
// to types.ErrOrganizationCodeExists and an unknown category_code (the organization_category FK)
// to types.ErrOrganizationUnknownCategory, so the handler can answer 409 / 400 without knowing
// the DB driver.
func (r *OrganizationRepository) CreateOrganization(ctx context.Context, org types.Organization) error {
	if err := r.db.WithContext(ctx).Omit("Category").Create(&org).Error; err != nil {
		switch {
		case isUniqueViolation(err):
			return types.ErrOrganizationCodeExists
		case isForeignKeyViolation(err):
			return types.ErrOrganizationUnknownCategory
		}
		return fmt.Errorf("error creating organization %q: %w", org.Code, err)
	}
	return nil
}

// ExistingOrgCodes returns the subset of codes that exist in the tenant, so a caller can name the
// ones that don't. user_role.org_code carries no FK (it also holds NULL and the '*' wildcard), so
// this is the only thing standing between a typo and a grant that silently matches nothing.
func (r *OrganizationRepository) ExistingOrgCodes(ctx context.Context, tenantCode string, codes []string) ([]string, error) {
	existing := []string{}
	if len(codes) == 0 {
		return existing, nil
	}
	err := r.db.WithContext(ctx).
		Table(types.OrganizationTable.Name).
		Where("tenant_code = ? AND code IN ?", tenantCode, codes).
		Pluck("code", &existing).Error
	if err != nil {
		return nil, fmt.Errorf("error checking organizations %v in tenant %q: %w", codes, tenantCode, err)
	}
	return existing, nil
}

// UpdateOrganization replaces the editable fields of an organization within the tenant (code and
// category are immutable). A code that does not exist in the tenant (or belongs to another tenant)
// affects no rows and maps to types.ErrOrganizationNotFound → 404.
func (r *OrganizationRepository) UpdateOrganization(ctx context.Context, tenantCode, code string, req types.UpdateOrganizationRequest) error {
	tx := r.db.WithContext(ctx).
		Table(types.OrganizationTable.Name).
		Where("code = ? AND tenant_code = ?", code, tenantCode).
		Updates(map[string]any{
			"name":                req.Name,
			"notification_emails": types.NotificationEmailsColumn(req.NotificationEmails),
		})
	if tx.Error != nil {
		return fmt.Errorf("error updating organization %q: %w", code, tx.Error)
	}
	if tx.RowsAffected == 0 {
		return types.ErrOrganizationNotFound
	}
	return nil
}

// NotificationEmailsByOrg returns the notification list of each requested organization, keyed by
// code. Organizations without a list (or unknown in the tenant) are absent from the map.
func (r *OrganizationRepository) NotificationEmailsByOrg(ctx context.Context, tenantCode string, codes []string) (map[string][]string, error) {
	byOrg := map[string][]string{}
	if len(codes) == 0 {
		return byOrg, nil
	}
	var rows []struct {
		Code               string
		NotificationEmails *string
	}
	err := r.db.WithContext(ctx).
		Table(types.OrganizationTable.Name).
		Select("code, notification_emails").
		Where("tenant_code = ? AND code IN ? AND notification_emails IS NOT NULL", tenantCode, codes).
		Scan(&rows).Error
	if err != nil {
		return nil, fmt.Errorf("error reading notification emails of organizations %v in tenant %q: %w", codes, tenantCode, err)
	}
	for _, row := range rows {
		if emails := types.SplitNotificationEmails(row.NotificationEmails); len(emails) > 0 {
			byOrg[row.Code] = emails
		}
	}
	return byOrg, nil
}
