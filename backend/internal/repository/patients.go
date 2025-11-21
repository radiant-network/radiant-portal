package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Patient = types.Patient

type PatientsRepository struct {
	db *gorm.DB
}

type PatientsDAO interface {
	GetPatientByOrganizationId(organizationCode string, organizationPatientId string) (*Patient, error)
	CreatePatient(newPatient *Patient) error
}

func NewPatientsRepository(db *gorm.DB) *PatientsRepository {
	return &PatientsRepository{db: db}
}

func (r *PatientsRepository) GetPatientByOrganizationPatientId(organizationId int, organizationPatientId string) (*Patient, error) {
	var patient Patient
	tx := r.db.
		Table(patient.TableName()).
		Where("organization_patient_id = ? and organization_id = ?", organizationPatientId, organizationId)
	if err := tx.Scan(&patient).Error; err != nil {
		return nil, err
	}
	if patient.ID == 0 {
		return nil, nil
	}
	return &patient, nil
}

func (r *PatientsRepository) CreatePatient(newPatient *Patient) error {
	tx := r.db.Create(newPatient)
	return tx.Error
}
