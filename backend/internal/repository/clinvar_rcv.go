package repository

import (
	"errors"
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
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
	tx := r.db.Table(fmt.Sprintf("%s r", types.ClinvarRCVTable.Name))
	tx = tx.Select("r.locus_id, r.clinvar_id, r.accession, r.clinical_significance, r.date_last_evaluated, r.submission_count, r.review_status, r.review_status_stars, r.version, r.traits, r.origins, c.name as clinvar_name")
	tx = tx.Joins("LEFT JOIN clinvar c ON c.locus_id=r.locus_id")
	tx = tx.Where("r.locus_id = ?", locusId)

	if err := tx.Find(&clinvarRCV).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // No record found
		} else {
			return nil, fmt.Errorf("error while fetching clinvar RCV: %w", err)
		}
	}

	return clinvarRCV, nil // Return the found records
}
