package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type ClinvarRCV = types.ClinvarRCV

type ClinvarRCVRepository struct {
	db *gorm.DB
}

type ClinvarRCVDAO interface {
	GetVariantClinvarConditions(locusId int) ([]ClinvarRCV, error)
}

func NewClinvarRCVRepository(db *gorm.DB) *ClinvarRCVRepository {
	if db == nil {
		log.Fatal("ClinvarRCVRepository: db is nil")
		return nil
	}
	return &ClinvarRCVRepository{db: db}
}

func (r *ClinvarRCVRepository) GetVariantClinvarConditions(locusId int) ([]ClinvarRCV, error) {
	var clinvarRCV []ClinvarRCV
	tx := r.db.Table(types.ClinvarRCVTable.Name).Where("locus_id = ?", locusId).Find(&clinvarRCV)

	if tx.Error != nil {
		if tx.Error == gorm.ErrRecordNotFound {
			return nil, nil // No record found
		}
		return nil, tx.Error // Return the error if something else went wrong
	}

	return clinvarRCV, nil // Return the found record
}
