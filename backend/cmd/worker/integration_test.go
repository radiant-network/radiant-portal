package main

import (
	"fmt"
	"os"
	"strings"
	"testing"
	"time"

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

		context := NewBatchValidationContext(db)
		processBatch(db, context)

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
		countPatientErr := db.Table("patient").Where("submitter_patient_id = ? AND organization_id = ?", "MRN-TEST-123", 1).Count(&countPatient).Error
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

		context := NewBatchValidationContext(db)
		processBatch(db, context)

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

		context := NewBatchValidationContext(db)
		processBatch(db, context)

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
		countPatientErr := db.Table("patient").Where("submitter_patient_id = ? AND organization_id = ?", "MRN-TEST-123", 1).Count(&countPatient).Error
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

		context := NewBatchValidationContext(db)
		processBatch(db, context)

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
		countPatientErr := db.Table("patient").Where("submitter_patient_id = ? AND organization_id = ?", "MRN-TEST-123", 1).Count(&countPatient).Error
		if countPatientErr != nil {
			t.Fatal("failed to count patient :", countPatientErr)
		}
		assert.Equal(t, int64(1), countPatient)

	})

}

func Test_ProcessBatch_Sample_Success_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-001",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, true, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, types.SampleBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var countSample int64
		countSampleErr := db.Table("sample").Where("submitter_sample_id = ? AND organization_id = ?", "SAMPLE-001", 2).Count(&countSample).Error
		if countSampleErr != nil {
			t.Fatal("failed to count sample:", countSampleErr)
		}
		assert.Equal(t, int64(0), countSample)
	})
}

func Test_ProcessBatch_Sample_Success_Not_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-NEW-001",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, types.SampleBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var countSample int64
		countSampleErr := db.Table("sample").Where("submitter_sample_id = ? AND organization_id = 3", "SAMPLE-NEW-001").Count(&countSample).Error
		if countSampleErr != nil {
			t.Fatal("failed to count sample:", countSampleErr)
		}
		assert.Equal(t, int64(1), countSample)
	})
}

func Test_ProcessBatch_Sample_Already_Exists_Skipped(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		db.Exec(`
            INSERT INTO sample (submitter_sample_id, type_code, tissue_site, histology_code, organization_id, patient_id)
            VALUES ('SAMPLE-EXISTS', 'dna', 'blood', 'normal', 3, 1)
        `)

		payload := `[
            {
                "submitter_sample_id": "SAMPLE-EXISTS",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Skipped)
		assert.Len(t, resultBatch.Report.Infos, 1)
		assert.Equal(t, SampleAlreadyExistCode, resultBatch.Report.Infos[0].Code)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)
	})
}

func Test_ProcessBatch_Sample_Existing_Different_Field_Warning(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		db.Exec(`
            INSERT INTO sample (submitter_sample_id, type_code, tissue_site, histology_code, organization_id, patient_id)
            VALUES ('SAMPLE-DIFF', 'dna', 'liver', 'normal', 3, 1)
        `)

		payload := `[
            {
                "submitter_sample_id": "SAMPLE-DIFF",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Skipped)
		assert.Len(t, resultBatch.Report.Infos, 1)
		assert.Len(t, resultBatch.Report.Warnings, 1)
		assert.Equal(t, SampleExistingSampleDifferentFieldCode, resultBatch.Report.Warnings[0].Code)
		assert.Contains(t, resultBatch.Report.Warnings[0].Message, "tissue_site")
	})
}

func Test_ProcessBatch_Sample_Patient_Not_Exist(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-003",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "UNKNOWN-PATIENT",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Errors, 1)
		assert.Equal(t, SamplePatientNotExistCode, resultBatch.Report.Errors[0].Code)
	})
}

func Test_ProcessBatch_Sample_Organization_Not_Exist(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-004",
                "sample_organization_code": "UNKNOWN-ORG",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Errors, 1)
		assert.Equal(t, SampleOrgNotExistCode, resultBatch.Report.Errors[0].Code)
	})
}

func Test_ProcessBatch_Sample_Parent_Sample_In_Batch(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-PARENT",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            },
            {
                "submitter_sample_id": "SAMPLE-CHILD",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "submitter_parent_sample_id": "SAMPLE-PARENT",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Len(t, resultBatch.Report.Errors, 0)
		assert.Len(t, resultBatch.Report.Warnings, 0)

		var childSample repository.Sample
		childSampleErr := db.Table("sample").Where("submitter_sample_id = ? AND organization_id = ?", "SAMPLE-CHILD", 3).First(&childSample).Error
		if childSampleErr != nil {
			t.Fatal("failed to retrieve child sample:", childSampleErr)
		}
		assert.Equal(t, "SAMPLE-CHILD", childSample.SubmitterSampleId)
		assert.Equal(t, 1, childSample.PatientID)
		assert.Equal(t, 3, childSample.OrganizationId)
		assert.NotNil(t, childSample.ParentSampleID)

		var parentSample repository.Sample
		parentSampleErr := db.Table("sample").Where("submitter_sample_id = ? AND organization_id = ?", "SAMPLE-PARENT", 3).First(&parentSample).Error
		if parentSampleErr != nil {
			t.Fatal("failed to retrieve parent sample:", parentSampleErr)
		}
		assert.Equal(t, *childSample.ParentSampleID, parentSample.ID)
	})
}

func Test_ProcessBatch_Sample_Parent_Sample_In_Db(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-CHILD-DB-PARENT",
                "sample_organization_code": "CQGC",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "submitter_parent_sample_id": "B-803.2",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusSuccess, resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, types.SampleBatchType, resultBatch.BatchType)
		assert.Equal(t, "user999", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var childSample repository.Sample
		childSampleErr := db.Table("sample").Where("submitter_sample_id = ? AND organization_id = ?", "SAMPLE-CHILD-DB-PARENT", 6).First(&childSample).Error
		if childSampleErr != nil {
			t.Fatal("failed to retrieve child sample:", childSampleErr)
		}
		assert.Equal(t, "SAMPLE-CHILD-DB-PARENT", childSample.SubmitterSampleId)
		assert.Equal(t, 1, childSample.PatientID)
		assert.Equal(t, 6, childSample.OrganizationId)
		assert.NotNil(t, childSample.ParentSampleID)
		assert.Equal(t, 63, *childSample.ParentSampleID)
	})
}

func Test_ProcessBatch_Sample_Unknown_Parent_Sample(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-CHILD-ORPHAN",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "submitter_parent_sample_id": "UNKNOWN-PARENT",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Errors, 1)
		assert.Equal(t, SampleUnknownParentSubmitterSampleIdCode, resultBatch.Report.Errors[0].Code)
		assert.Contains(t, resultBatch.Report.Errors[0].Message, "UNKNOWN-PARENT")
	})
}

func Test_ProcessBatch_Sample_Invalid_Patient_For_Parent_Sample(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		// Insert parent sample for a different patient
		db.Exec(`
            INSERT INTO sample (submitter_sample_id, type_code, tissue_site, histology_code, organization_id, patient_id)
            VALUES ('SAMPLE-PARENT-OTHER', 'dna', 'blood', 'normal', 3, 2)
        `)

		payload := `[
            {
                "submitter_sample_id": "SAMPLE-INVALID-PARENT",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "submitter_parent_sample_id": "SAMPLE-PARENT-OTHER",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Errors, 1)
		assert.Equal(t, SampleInvalidPatientForParentSampleCode, resultBatch.Report.Errors[0].Code)
	})
}

func Test_ProcessBatch_Sample_Duplicate_In_Batch(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
            {
                "submitter_sample_id": "SAMPLE-DUP",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            },
            {
                "submitter_sample_id": "SAMPLE-DUP",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Errors, 1)
		assert.Equal(t, SampleDuplicateInBatchCode, resultBatch.Report.Errors[0].Code)
	})
}

func Test_ProcessBatch_Sample_Field_Too_Long(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		longString := strings.Repeat("a", TextMaxLength+1)
		payload := fmt.Sprintf(`[
            {
                "submitter_sample_id": "%s",
                "sample_organization_code": "CHUSJ",
                "patient_organization_code": "CHUSJ",
                "submitter_patient_id": "MRN-283773",
                "type_code": "dna",
                "tissue_site": "blood",
                "histology_code": "normal"
            }	
        ]
        `, longString)
		var id string
		initErr := db.Raw(`
            INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
            VALUES (?, 'PENDING', ?, false, 'user999', '2025-10-09')
            RETURNING id;
        `, payload, types.SampleBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatusError, resultBatch.Status)
		assert.Equal(t, 1, resultBatch.Summary.Errors)
		assert.Len(t, resultBatch.Report.Errors, 1)
		assert.Equal(t, SampleInvalidValueCode, resultBatch.Report.Errors[0].Code)
		assert.Contains(t, resultBatch.Report.Errors[0].Message, "submitter_sample_id")
	})
}

func Test_ProcessBatch_SequencingExperiment_Success_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "short_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, true, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("SUCCESS"), resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, "sequencing_experiment", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var count int64
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)
	})
}

func Test_ProcessBatch_SequencingExperiment_Success_Not_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "short_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)

		// Make sure DB is clean before running the import
		var count int64
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(1), count)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("SUCCESS"), resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, "sequencing_experiment", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var seqExp types.SequencingExperiment
		assert.Nil(t, db.Table("sequencing_experiment").Where("aliquot = 'ALIQUOT-12345'").First(&seqExp).Error)

		assert.Equal(t, "ALIQUOT-12345", seqExp.Aliquot)
		assert.Equal(t, 1, seqExp.SampleID)
		assert.Equal(t, "wgs", seqExp.ExperimentalStrategyCode)
		assert.Equal(t, "short_read", seqExp.SequencingReadTechnologyCode)
		assert.Equal(t, "illumina", seqExp.PlatformCode)
		assert.Equal(t, 3, seqExp.SequencingLabID)
		assert.Equal(t, "Agilent V6", seqExp.CaptureKit)
		assert.Equal(t, "RUN-001", seqExp.RunAlias)
		expectedRunDate, _ := time.Parse(time.RFC3339, "2020-01-01T00:00:00Z")
		assert.True(t, seqExp.RunDate.Equal(expectedRunDate))
		assert.Equal(t, "Run Name 1", seqExp.RunName)
		assert.Equal(t, "in_progress", seqExp.StatusCode)
	})
}

func Test_ProcessBatch_SequencingExperiment_Info_Skipped(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {

		payload := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "short_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		// Make sure DB is clean before running the import
		var count int64
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		context := NewBatchValidationContext(db)
		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(1), count)

		if err := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error; err != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(1), count)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("SUCCESS"), resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, "sequencing_experiment", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 1)
		assert.Len(t, resultBatch.Report.Errors, 0)
	})
}

func Test_ProcessBatch_SequencingExperiment_Warning_Skipped(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {

		payload := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "short_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		// Make sure DB is clean before running the import
		var count int64
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		context := NewBatchValidationContext(db)
		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(1), count)

		// // Changed sequencing_read_technology_code to `long_read` to trigger warning
		diff := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "long_read", 
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			}	
		]
		`
		if err := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, diff, types.SequencingExperimentBatchType).Scan(&id).Error; err != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(1), count)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("SUCCESS"), resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, "sequencing_experiment", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 1)
		assert.Len(t, resultBatch.Report.Infos, 1)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var seqExp types.SequencingExperiment
		assert.Nil(t, db.Table("sequencing_experiment").Where("aliquot = 'ALIQUOT-12345'").First(&seqExp).Error)
		assert.Equal(t, "short_read", seqExp.SequencingReadTechnologyCode)
	})
}

func Test_ProcessBatch_SequencingExperiment_Errors(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {

		payload := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "WGS_INVALID",
				"sequencing_read_technology_code": "mini_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_slow_progress"
			}	
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		// Make sure DB is clean before running the import
		var count int64
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		context := NewBatchValidationContext(db)
		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("ERROR"), resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, "sequencing_experiment", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 3)
	})
}

func Test_ProcessBatch_SequencingExperiment_DuplicateInBatch(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {

		payload := `[
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "short_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			},
			{
				"aliquot": "ALIQUOT-12345",
				"sample_organization_code": "CQGC",
				"submitter_sample_id": "S13224",
				"experimental_strategy_code": "wgs",
				"sequencing_read_technology_code": "short_read",
				"platform_code": "illumina",
				"sequencing_lab_code": "CHUSJ",
				"capture_kit": "Agilent V6",
				"run_alias": "RUN-001",
				"run_date": "2020-01-01T00:00:00Z",
				"run_name": "Run Name 1",
				"status_code": "in_progress"
			}		
		]
		`
		var id string
		initErr := db.Raw(`
    		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
    		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
    		RETURNING id;
		`, payload, types.SequencingExperimentBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		// Make sure DB is clean before running the import
		var count int64
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		context := NewBatchValidationContext(db)
		processBatch(db, context)
		if err := db.Table("sequencing_experiment").Where("aliquot = ?", "ALIQUOT-12345").Count(&count).Error; err != nil {
			t.Fatal("failed to count sequencing_experiment:", err)
		}
		assert.Equal(t, int64(0), count)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("ERROR"), resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, "sequencing_experiment", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 1)
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

		context := NewBatchValidationContext(db)
		processBatch(db, context)

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
