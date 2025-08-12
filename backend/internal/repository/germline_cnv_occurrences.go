package repository

import (
	"fmt"
	"github.com/radiant-network/radiant-api/internal/utils"
	"log"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type GermlineCNVOccurrence = types.GermlineCNVOccurrence

type GermlineCNVOccurrencesRepository struct {
	db *gorm.DB
}

type GermlineCNVOccurrencesDAO interface {
	GetOccurrences(seqId int, userFilter types.ListQuery) ([]GermlineCNVOccurrence, error)
	CountOccurrences(seqId int, userFilter types.CountQuery) (int64, error)
}

func NewGermlineCNVOccurrencesRepository(db *gorm.DB) *GermlineCNVOccurrencesRepository {
	if db == nil {
		log.Print("GermlineCNVOccurrencesRepository: db is nil")
		return nil
	}
	return &GermlineCNVOccurrencesRepository{db: db}
}

func (r *GermlineCNVOccurrencesRepository) GetOccurrences(seqId int, userQuery types.ListQuery) ([]GermlineCNVOccurrence, error) {
	var occurrences []GermlineCNVOccurrence
	tx, err := r.prepareListOrCountQuery(seqId)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}

	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	utils.AddLimit(tx, userQuery)
	utils.AddSort(tx, userQuery)
	utils.AddWhere(userQuery, tx)

	tx = tx.Select(columns)
	if err = tx.Find(&occurrences).Error; err != nil {
		return nil, fmt.Errorf("error fetching CNV occurrences: %w", err)
	}

	return occurrences, nil
}

func (r *GermlineCNVOccurrencesRepository) CountOccurrences(seqId int, userQuery types.CountQuery) (int64, error) {
	tx, err := r.prepareListOrCountQuery(seqId)
	if err != nil {
		return 0, fmt.Errorf("error during query preparation %w", err)
	}

	utils.AddWhere(userQuery, tx)

	var count int64
	if err = tx.Count(&count).Error; err != nil {
		return 0, fmt.Errorf("error fetching occurrences: %w", err)
	}
	return count, nil
}

func (r *GermlineCNVOccurrencesRepository) prepareListOrCountQuery(seqId int) (*gorm.DB, error) {
	part, err := utils.GetSequencingPart(seqId, r.db)
	if err != nil {
		return nil, fmt.Errorf("error during partition fetch %w", err)
	}

	tx := r.db.Table(
		fmt.Sprintf("%s %s", types.GermlineCNVOccurrenceTable.Name, types.GermlineCNVOccurrenceTable.Alias),
	).Where("seq_id = ? and part=?", seqId, part)

	return tx, nil
}
