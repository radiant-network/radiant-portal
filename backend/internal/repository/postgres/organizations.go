package repository

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

func (r *OrganizationRepository) GetOrganizationByCode(ctx context.Context, organizationCode string) (*types.Organization, error) {
	var organization types.Organization
	tx := r.db.WithContext(ctx).Table(types.OrganizationTable.Name).Where("code = ?", organizationCode)
	if err := tx.First(&organization).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieving organization by code: %w", err)
		}
		return nil, nil
	}
	return &organization, nil
}
