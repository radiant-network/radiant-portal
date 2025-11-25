package repository

import (
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Patient = types.Patient

type PatientsRepository struct {
	db *gorm.DB
}

type PatientsDAO interface {
	GetPatientByOrganizationPatientId(organizationId int, organizationPatientId string) (*Patient, error)
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
	if err := tx.First(&patient).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve patient its ID: %w", err)
		} else {
			return nil, nil
		}
	}
	return &patient, nil
}

func (r *PatientsRepository) CreatePatient(newPatient *Patient) error {
	tx := r.db.Create(newPatient)
	return tx.Error
}
