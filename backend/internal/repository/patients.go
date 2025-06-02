package repository

import (
	"errors"
	"fmt"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"gorm.io/gorm"
	"log"
)

type Patient = types.Patient

type PatientsRepository struct {
	db *gorm.DB
}

type PatientsDAO interface {
	GetPatients() (*[]Patient, error)
}

func NewPatientsRepository(db *gorm.DB) *PatientsRepository {
	if db == nil {
		log.Fatal("PatientsRepository: db is nil")
		return nil
	}
	return &PatientsRepository{db: db}
}

func (r *PatientsRepository) GetPatients() (*[]Patient, error) {
	tx := r.db.Table(types.PatientTable.Name).
		Preload("Organization").
		Preload("Sex")
	var patients []Patient
	if err := tx.Find(&patients).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("error while fetching patients: %w", err)
		} else {
			return nil, nil
		}
	}

	return &patients, nil
}
