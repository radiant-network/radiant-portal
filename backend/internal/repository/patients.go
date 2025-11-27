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
	GetPatientBySubmitterPatientId(organizationId int, submitterPatientId string) (*Patient, error)
	GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*Patient, error)
	CreatePatient(newPatient *Patient) error
}

func NewPatientsRepository(db *gorm.DB) *PatientsRepository {
	return &PatientsRepository{db: db}
}

func (r *PatientsRepository) GetPatientBySubmitterPatientId(organizationId int, submitterPatientId string) (*Patient, error) {
	var patient Patient
	tx := r.db.
		Table("patient").
		Where("submitter_patient_id = ? and organization_id = ?", submitterPatientId, organizationId)
	if err := tx.First(&patient).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve patient its ID: %w", err)
		} else {
			return nil, nil
		}
	}
	return &patient, nil
}

func (r *PatientsRepository) GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*Patient, error) {
	var patient Patient
	tx := r.db.
		Table("patient").
		Joins("JOIN organization o ON o.id = patient.organization_id").
		Where("patient.submitter_patient_id = ? AND o.code = ?", submitterPatientId, organizationCode)
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
