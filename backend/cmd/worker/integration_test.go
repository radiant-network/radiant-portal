package main

import (
	"os"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_ProcessBatch_Patient_Success_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"submitter_patient_id": "MRN-TEST-123",
				"submitter_patient_id_type" : "mrn",
				"patient_organization_code": "CHOP",
				"sex_code": "female",
				"life_status_code": "alive",
				"date_of_birth": "2010-05-15"	
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, true, 'user999', '2025-10-09')
    		RETURNING id;
		`, payload, types.PatientBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		repoBatch := repository.NewBatchRepository(db)
		repoOrganization := repository.NewOrganizationRepository(db)
		repoPatient := repository.NewPatientsRepository(db)
		repoSample := repository.NewSamplesRepository(db)
		processBatch(db, repoBatch, repoOrganization, repoPatient, repoSample)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, types.PatientBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var countPatient int64
		countPatientErr := db.Table("patient").Where("organization_patient_id = ? AND organization_id = ?", "MRN-TEST-123", 1).Count(&countPatient).Error
		if countPatientErr != nil {
			t.Fatal("failed to count patient :", countPatientErr)
		}
		assert.Equal(t, int64(0), countPatient)

	})

}

func Test_ProcessBatch_Patient_Skipped(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"submitter_patient_id": "MRN-283773",
				"submitter_patient_id_type" : "mrn",
				"patient_organization_code": "CHUSJ",
				"sex_code": "male",
				"life_status_code": "alive",
				"last_name": "Gagnon",
				"first_name": "Juliette",
				"jhn": "GAG1202030277",
				"date_of_birth": "2012-02-03"	
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, true, 'user999', '2025-10-09')
    		RETURNING id;
		`, payload, types.PatientBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		repoBatch := repository.NewBatchRepository(db)
		repoOrganization := repository.NewOrganizationRepository(db)
		repoPatient := repository.NewPatientsRepository(db)
		repoSample := repository.NewSamplesRepository(db)
		processBatch(db, repoBatch, repoOrganization, repoPatient, repoSample)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, types.PatientBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Equal(t, resultBatch.Summary.Skipped, 1)
		assert.Len(t, resultBatch.Report.Infos, 1)
		assert.Len(t, resultBatch.Report.Warnings, 1)
		assert.Len(t, resultBatch.Report.Errors, 0)

	})

}

func Test_ProcessBatch_Patient_Errors(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"submitter_patient_id": "MRN-283773",
				"submitter_patient_id_type" : "mrn",
				"patient_organization_code": "UNKNOWN_ORG",
				"sex_code": "male",
				"life_status_code": "alive",
				"last_name": "Gagnon",
				"first_name": "Juliette",
				"jhn": "GAG1202030277",
				"date_of_birth": "2012-02-03"	
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, true, 'user999', '2025-10-09')
    		RETURNING id;
		`, payload, types.PatientBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		repoBatch := repository.NewBatchRepository(db)
		repoOrganization := repository.NewOrganizationRepository(db)
		repoPatient := repository.NewPatientsRepository(db)
		repoSample := repository.NewSamplesRepository(db)
		processBatch(db, repoBatch, repoOrganization, repoPatient, repoSample)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, types.PatientBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Equal(t, 0, resultBatch.Summary.Skipped)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Errors, 1)

		var countPatient int64
		countPatientErr := db.Table("patient").Where("organization_patient_id = ? AND organization_id = ?", "MRN-TEST-123", 1).Count(&countPatient).Error
		if countPatientErr != nil {
			t.Fatal("failed to count patient :", countPatientErr)
		}
		assert.Equal(t, int64(0), countPatient)

	})

}

func Test_ProcessBatch_Patient_Success_Not_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"submitter_patient_id": "MRN-TEST-123",
				"submitter_patient_id_type" : "mrn",
				"patient_organization_code": "CHOP",
				"sex_code": "female",
				"life_status_code": "alive",
				"date_of_birth": "2010-05-15"	
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
    		RETURNING id;
		`, payload, types.PatientBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		repoBatch := repository.NewBatchRepository(db)
		repoOrganization := repository.NewOrganizationRepository(db)
		repoPatient := repository.NewPatientsRepository(db)
		repoSample := repository.NewSamplesRepository(db)
		processBatch(db, repoBatch, repoOrganization, repoPatient, repoSample)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, types.PatientBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var countPatient int64
		countPatientErr := db.Table("patient").Where("organization_patient_id = ? AND organization_id = ?", "MRN-TEST-123", 1).Count(&countPatient).Error
		if countPatientErr != nil {
			t.Fatal("failed to count patient :", countPatientErr)
		}
		assert.Equal(t, int64(1), countPatient)

	})

}

func Test_ProcessBatch_Unsupported_Type(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"batch": "fake"	
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', 'unsupported_type', true, 'user999', '2025-10-09')
    		RETURNING id;
		`, payload).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		repoBatch := repository.NewBatchRepository(db)
		repoOrganization := repository.NewOrganizationRepository(db)
		repoPatient := repository.NewPatientsRepository(db)
		repoSample := repository.NewSamplesRepository(db)
		processBatch(db, repoBatch, repoOrganization, repoPatient, repoSample)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, "unsupported_type", resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Errors, 1)

	})

}

func TestMain(m *testing.M) {
	testutils.StartPostgresContainer()
	code := m.Run()
	testutils.StopAllContainers()
	os.Exit(code)
}
