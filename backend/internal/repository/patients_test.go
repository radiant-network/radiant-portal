package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetPatientBySubmitterPatientId_Not_Null(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(db)
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId("CHUSJ", "MRN-283773")
		assert.NoError(t, err)
		assert.NotNil(t, patient)
		assert.Equal(t, 1, patient.ID)
		assert.Equal(t, "female", patient.SexCode)
	})
}

func Test_GetPatientBySubmitterPatientId_Null_Mrn(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(db)
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId("CHUSJ", "MRN-UNKNOWN")
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}

func Test_GetPatientBySubmitterPatientId_Null_OrgId(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewPatientsRepository(db)
		patient, err := repo.GetPatientByOrgCodeAndSubmitterPatientId("UNKNOWN-ORG", "MRN-283773")
		assert.NoError(t, err)
		assert.Nil(t, patient)
	})
}
