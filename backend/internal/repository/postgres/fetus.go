package postgres

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Fetus = types.Fetus

type FetusRepository struct {
	db *gorm.DB
}

func NewFetusRepository(db database.PostgresDB) *FetusRepository {
	return &FetusRepository{db: db.DB}
}

// GetFetusById carries the tenant scope for a future API read path. It is inert in the worker —
// the only caller today — which binds no tenant to the context. Rejecting a batch that references
// another tenant's fetus is therefore NOT covered here: the worker would have to filter on the
// batch's own tenant (StorageContext.TenantCode), which is a separate follow-up.
func (r *FetusRepository) GetFetusById(ctx context.Context, fetusId int) (*Fetus, error) {
	var fetus Fetus
	if err := r.db.WithContext(ctx).Table(types.FetusTable.Name).Scopes(WithTenant(ctx)).First(&fetus, fetusId).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching fetus: %w", err)
		}
		return nil, nil
	}
	return &fetus, nil
}

func (r *FetusRepository) CreateFetus(ctx context.Context, fetus *Fetus) error {
	return r.db.WithContext(ctx).Create(fetus).Error
}
