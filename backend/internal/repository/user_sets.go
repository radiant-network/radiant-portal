package repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type UserSetsRepository struct {
	db *gorm.DB
}

func NewUserSetsRepository(db database.PostgresDB) *UserSetsRepository {
	return &UserSetsRepository{db: db.DB}
}

func (r *UserSetsRepository) GetUserSet(ctx context.Context, userSetId string) (*types.UserSet, error) {
	var dao types.UserSetDAO
	if result := r.db.WithContext(ctx).
		Table(types.UserSetTable.Name).
		Preload("ParticipantIds").
		Preload("FileIds").
		Preload("BiospecimenIds").
		Preload("VariantIds").
		Where("id = ?", userSetId).
		First(&dao); result.Error != nil {
		err := result.Error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching user set: %w", err)
		} else {
			return nil, nil
		}
	}
	mapped, err := r.mapToUserSet(&dao)
	if err != nil {
		return nil, err
	}
	return mapped, nil
}

func (r *UserSetsRepository) mapToUserSet(dao *types.UserSetDAO) (*types.UserSet, error) {
	ids := make([]string, 0)
	if len(dao.ParticipantIds) > 0 {
		ids = r.ParticipantIds(dao.ParticipantIds)
	} else if len(dao.FileIds) > 0 {
		ids = r.FileIds(dao.FileIds)
	} else if len(dao.BiospecimenIds) > 0 {
		ids = r.BiospecimenIds(dao.BiospecimenIds)
	} else if len(dao.VariantIds) > 0 {
		ids = r.VariantIds(dao.VariantIds)
	}

	userSet := &types.UserSet{
		ID:        dao.ID,
		UserId:    dao.UserId,
		Name:      dao.Name,
		Type:      dao.Type,
		Active:    dao.Active,
		CreatedAt: dao.CreatedAt,
		UpdatedAt: dao.UpdatedAt,
		Ids:       ids,
	}
	return userSet, nil
}

func (r *UserSetsRepository) ParticipantIds(dao []types.UserSetParticipantDAO) []string {
	var list []string
	for _, elem := range dao {
		list = append(list, elem.ParticipantId)
	}
	return list
}

func (r *UserSetsRepository) FileIds(dao []types.UserSetFileDAO) []string {
	var list []string
	for _, elem := range dao {
		list = append(list, elem.FileId)
	}
	return list
}

func (r *UserSetsRepository) BiospecimenIds(dao []types.UserSetBiospecimenDAO) []string {
	var list []string
	for _, elem := range dao {
		list = append(list, elem.BiospecimenId)
	}
	return list
}

func (r *UserSetsRepository) VariantIds(dao []types.UserSetVariantDAO) []string {
	var list []string
	for _, elem := range dao {
		list = append(list, elem.VariantId)
	}
	return list
}
