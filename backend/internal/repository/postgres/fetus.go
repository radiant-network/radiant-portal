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

// GetFetusByMotherAndSubmitterId resolves the submitter's key against the mother, hitting the
// UNIQUE (mother_id, submitter_fetus_id) constraint. Scoping to the mother is also what keeps a
// batch from reaching another patient's fetus: an unrelated key simply isn't found.
func (r *FetusRepository) GetFetusByMotherAndSubmitterId(ctx context.Context, motherID int, submitterFetusId string) (*Fetus, error) {
	var fetus Fetus
	err := r.db.WithContext(ctx).
		Table(types.FetusTable.Name).
		Scopes(WithTenant(ctx)).
		Where("mother_id = ? AND submitter_fetus_id = ?", motherID, submitterFetusId).
		First(&fetus).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching fetus %q for mother %d: %w", submitterFetusId, motherID, err)
		}
		return nil, nil
	}
	return &fetus, nil
}

// GetFetusByOrganizationAndSubmitterId resolves the submitter's key against the organization,
// hitting the UNIQUE (organization_code, submitter_fetus_id) constraint. Used to catch a collision
// with another mother's fetus before insert, rather than letting the worker die on a raw
// duplicate-key error.
func (r *FetusRepository) GetFetusByOrganizationAndSubmitterId(ctx context.Context, organizationCode, submitterFetusId string) (*Fetus, error) {
	var fetus Fetus
	err := r.db.WithContext(ctx).
		Table(types.FetusTable.Name).
		Scopes(WithTenant(ctx)).
		Where("organization_code = ? AND submitter_fetus_id = ?", organizationCode, submitterFetusId).
		First(&fetus).Error
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching fetus %q for organization %q: %w", submitterFetusId, organizationCode, err)
		}
		return nil, nil
	}
	return &fetus, nil
}

// GetFetusesByCaseID returns the case's fetuses. fetus carries no case reference of its own, so
// they are resolved through the family rows that attach them to the case.
func (r *FetusRepository) GetFetusesByCaseID(ctx context.Context, caseID int) ([]*Fetus, error) {
	var fetuses []*Fetus
	if err := r.db.WithContext(ctx).
		Table(types.FetusTable.Name).
		Select("fetus.*").
		Joins("JOIN family ON family.fetus_id = fetus.id").
		Where("family.case_id = ?", caseID).
		Scopes(WithTenantOn(ctx, "fetus")).
		Find(&fetuses).Error; err != nil {
		return nil, fmt.Errorf("error while fetching fetuses for case %d: %w", caseID, err)
	}
	return fetuses, nil
}

func (r *FetusRepository) CreateFetus(ctx context.Context, fetus *Fetus) error {
	return r.db.WithContext(ctx).Create(fetus).Error
}

// UpdateFetus rewrites a fetus's mutable fields in place, keeping its id — so sample.fetus_id and
// the observation rows pointing at it stay valid. This is what makes a fetus correctable after its
// sample has been sequenced, where a delete-and-recreate would hit the FK.
func (r *FetusRepository) UpdateFetus(ctx context.Context, fetus *Fetus) error {
	if fetus == nil {
		return fmt.Errorf("update fetus: %w", ErrNilRecord)
	}
	return r.db.WithContext(ctx).
		Table(types.FetusTable.Name).
		Where("id = ?", fetus.ID).
		Updates(map[string]any{
			"life_status_code":      fetus.LifeStatusCode,
			"sex_code":              fetus.SexCode,
			"last_menstrual_period": fetus.LastMenstrualPeriod,
			"estimated_due_date":    fetus.EstimatedDueDate,
		}).Error
}

// DeleteFetusesByIDs removes the fetus rows themselves. Callers must have cleared the family and
// observation rows pointing at them first: the FKs on fetus(id) carry no ON DELETE CASCADE.
func (r *FetusRepository) DeleteFetusesByIDs(ctx context.Context, ids []int) error {
	if len(ids) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Where("id IN ?", ids).Delete(&Fetus{}).Error
}
