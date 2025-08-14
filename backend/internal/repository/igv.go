package repository

import (
	"fmt"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type IGVTrack = types.IGVTrack

type IGVRepository struct {
	db *gorm.DB
}

type IGVRepositoryDAO interface {
	GetIGV(seqId int) ([]IGVTrack, error)
}

func NewIGVRepository(db *gorm.DB) *IGVRepository {
	if db == nil {
		log.Print("GermlineCNVOccurrencesRepository: db is nil")
		return nil
	}
	return &IGVRepository{db: db}
}

func (r *IGVRepository) GetIGV(seqId int) ([]IGVTrack, error) {
	var igvInternal []IGVTrack

	txInternal := r.db.Table(types.SequencingExperimentTable.Name).Where("id = ?", seqId).Select("case_id")

	alignmentFilter := "(d.data_type_code='alignment' AND d.format_code in ('cram', 'crai'))"

	tx := r.db.Table(fmt.Sprintf("%s se", types.SequencingExperimentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s dhp ON dhp.patient_id=se.patient_id", types.DocumentHasPatientTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s d ON dhp.document_id=d.id", types.DocumentTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s f ON dhp.patient_id=f.family_member_id", types.FamilyTable.Name))
	tx.Joins(fmt.Sprintf("LEFT JOIN %s p ON dhp.patient_id=p.id", types.PatientTable.Name))
	tx.Where(fmt.Sprintf("se.case_id = (?) AND %s", alignmentFilter), txInternal)

	columns := []string{
		"se.id AS sequencing_experiment_id",
		"se.patient_id",
		"COALESCE(f.relationship_to_proband_code, 'proband') AS family_role",
		"p.sex_code",
		"d.data_type_code",
		"d.format_code",
		"d.url",
	}

	tx.Select(columns)
	tx.Order("se.id, d.data_type_code, d.format_code")
	if err := tx.Find(&igvInternal).Error; err != nil {
		return []IGVTrack{}, err
	}

	return igvInternal, nil
}
