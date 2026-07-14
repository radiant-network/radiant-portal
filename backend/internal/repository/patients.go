package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type Patient = types.Patient

type PatientsRepository struct {
	db *gorm.DB
}

func NewPatientsRepository(db *gorm.DB) *PatientsRepository {
	return &PatientsRepository{db: db}
}

func (r *PatientsRepository) GetPatientByOrgCodeAndSubmitterPatientId(ctx context.Context, organizationCode string, submitterPatientId string) (*Patient, error) {
	var patient Patient
	tx := r.db.WithContext(ctx).
		Table("patient").
		Where("submitter_patient_id = ? AND organization_code = ?", submitterPatientId, organizationCode)
	if err := tx.First(&patient).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error retrieve patient its ID: %w", err)
		} else {
			return nil, nil
		}
	}
	return &patient, nil
}

func (r *PatientsRepository) CreatePatient(ctx context.Context, newPatient *Patient) error {
	tx := r.db.WithContext(ctx).Create(newPatient)
	return tx.Error
}

func (r *PatientsRepository) UpdatePatient(ctx context.Context, patient *Patient) error {
	tx := r.db.WithContext(ctx).
		Table("patient").
		Where("organization_code = ? AND submitter_patient_id = ?", patient.OrganizationCode, patient.SubmitterPatientId).
		Updates(map[string]any{
			"submitter_patient_id_type": patient.SubmitterPatientIdType,
			"sex_code":                  patient.SexCode,
			"life_status_code":          patient.LifeStatusCode,
			"first_name":                patient.FirstName,
			"last_name":                 patient.LastName,
			"jhn":                       patient.Jhn,
			"date_of_birth":             patient.DateOfBirth,
		})
	if tx.Error != nil {
		return fmt.Errorf("error updating patient: %w", tx.Error)
	}
	return nil
}
