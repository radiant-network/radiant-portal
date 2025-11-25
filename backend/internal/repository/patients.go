package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type PatientsRepository struct {
	db *gorm.DB
}

type PatientsDAO interface {
	GetPatientByOrganizationId(organizationCode string, organizationPatientId string) (*types.Patient, error)
}

func NewPatientsRepository(db *gorm.DB) *PatientsRepository {
	return &PatientsRepository{db: db}
}

func (r *PatientsRepository) GetPatientByOrganizationPatientId(organizationId int, submitterPatientId string) (*types.Patient, error) {
	var patient types.Patient
	tx := r.db.
		Table("patient").
		Where("submitter_patient_id = ? and organization_id = ?", submitterPatientId, organizationId)
	if err := tx.Scan(&patient).Error; err != nil {
		return nil, err
	}
	if patient.ID == 0 {
		return nil, nil
	}
	return &patient, nil
}

func (r *PatientsRepository) CreatePatient(newPatient *types.Patient) error {
	tx := r.db.Create(newPatient)
	return tx.Error
}
