package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type UserSetsRepository struct {
	db *gorm.DB
}

type UserSetsDAO interface {
	GetUserSet(userSetId string) (*types.UserSet, error)
}

func NewUserSetsRepository(db *gorm.DB) *UserSetsRepository {
	if db == nil {
		log.Fatal("UserSetsRepository: db is nil")
		return nil
	}
	return &UserSetsRepository{db: db}
}

func (r *UserSetsRepository) GetUserSet(userSetId string) (*types.UserSet, error) {
	var dao types.UserSetDAO
	if result := r.db.
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
