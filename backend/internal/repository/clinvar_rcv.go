package repository

import (
	"errors"
	"fmt"
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
		log.Print("ClinvarRCVRepository: db is nil")
		return nil
	}
	return &ClinvarRCVRepository{db: db}
}

func (r *ClinvarRCVRepository) GetVariantClinvarConditions(locusId int) ([]ClinvarRCV, error) {
	var clinvarRCV []ClinvarRCV
	tx := r.db.Table(types.ClinvarRCVTable.Name)
	tx = tx.Select("locus_id, clinvar_id, accession, clinical_significance, date_last_evaluated, submission_count, review_status, review_status_stars, version, traits, origins")
	tx = tx.Where("locus_id = ?", locusId)

	if err := tx.Find(&clinvarRCV).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // No record found
		} else {
			return nil, fmt.Errorf("error while fetching clinvar RCV: %w", err)
		}
	}

	return clinvarRCV, nil // Return the found records
}
