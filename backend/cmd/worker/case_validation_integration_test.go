package main

import (
	"slices"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_ProcessBatch_Case_Success_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		projectId := 1
		submitterCaseId := "CASE123"
		// Test payload crafted with test clinical data
		payload := `[
			{
			  "submitter_case_id": "CASE123",
			  "type": "germline",
			  "status_code": "in_progress",
			  "project_code": "N1",
			  "diagnostic_lab_code": "LDM-CHUSJ",
			  "primary_condition_code_system": "MONDO",
			  "primary_condition_value": "MONDO:0700092",
			  "priority_code": "routine",
			  "category_code": "postnatal",
			  "analysis_code": "WGA",
			  "resolution_status_code": "unsolved",
			  "note": "test case note",
			  "ordering_physician": "Dr. Test",
			  "ordering_organization_code": "CHUSJ", 
			  "patients": [
				{
				  "affected_status_code": "affected",
				  "family_history": [],
				  "observations_categorical": [
					  {
						  "code": "phenotype",
						  "system": "HPO",
						  "value": "TEST:12345",
						  "onset_code": "infantile",
						  "interpretation_code": "positive",
						  "note": "Test clinical note"
					  }
				  ],
				  "observations_text": [],
				  "submitter_patient_id": "MRN-283773",
				  "patient_organization_code": "CHUSJ",
				  "relation_to_proband_code": "proband"
				}
			  ],
			  "sequencing_experiments": [
				{
				  "aliquot": "NA12892",
				  "sample_organization_code": "CQGC",
				  "submitter_sample_id": "S13224"
				}
			  ],
			  "tasks": [
				{
				  "type_code": "alignment_germline_variant_calling",
				  "aliquot": "NA12892",
				  "input_documents": [], 
				  "output_documents": [
					{
					  "data_category_code": "genomic",
					  "data_type_code": "alignment",
					  "format_code": "cram",
					  "hash": "5d41402abc4b2a76b9719d911017c652",
					  "name": "NA12892.recal.cram",
					  "size": 105087112314,
					  "url": "file://test-bucket/NA12892.recal.crai"
					}
				  ],
				  "pipeline_name": "Dragen",
				  "pipeline_version": "4.4.4",
				  "genome_build": "GRch38"
				}
			  ]
			}]
		`
		var id string
		initErr := db.Raw(`
   		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
   		VALUES (?, 'PENDING', ?, true, 'user123', '2025-12-04')
   		RETURNING id;
		`, payload, types.CaseBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("SUCCESS"), resultBatch.Status)
		assert.Equal(t, true, resultBatch.DryRun)
		assert.Equal(t, "case", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		var count int64
		if err := db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", projectId, submitterCaseId).Count(&count).Error; err != nil {
			t.Fatal("failed to count cases:", err)
		}
		assert.Equal(t, int64(0), count)
	})
}

func Test_ProcessBatch_Case_Success_Not_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {

		projectId := 1
		submitterCaseId := "CASE123"
		// Test payload crafted with test clinical data
		payload := `[
			{
			  "submitter_case_id": "CASE123",
			  "type": "germline",
			  "status_code": "in_progress",
			  "project_code": "N1",
			  "diagnostic_lab_code": "LDM-CHUSJ",
			  "primary_condition_code_system": "MONDO",
			  "primary_condition_value": "MONDO:0700092",
			  "priority_code": "routine",
			  "category_code": "postnatal",
			  "analysis_code": "WGA",
			  "resolution_status_code": "unsolved",
			  "note": "test case note",
			  "ordering_physician": "Dr. Test",
			  "ordering_organization_code": "CHUSJ", 
			  "patients": [
				{
				  "affected_status_code": "affected",
				  "family_history": [],
				  "observations_categorical": [
					  {
						  "code": "phenotype",
						  "system": "HPO",
						  "value": "TEST:12345",
						  "onset_code": "infantile",
						  "interpretation_code": "positive",
						  "note": "Test clinical note"
					  }
				  ],
				  "observations_text": [],
				  "submitter_patient_id": "MRN-283773",
				  "patient_organization_code": "CHUSJ",
				  "relation_to_proband_code": "proband"
				}
			  ],
			  "sequencing_experiments": [
				{
				  "aliquot": "NA12892",
				  "sample_organization_code": "CQGC",
				  "submitter_sample_id": "S13224"
				}
			  ],
			  "tasks": [
				{
				  "type_code": "alignment_germline_variant_calling",
				  "aliquot": "NA12892",
				  "input_documents": [], 
				  "output_documents": [
					{
					  "data_category_code": "genomic",
					  "data_type_code": "alignment",
					  "format_code": "cram",
					  "hash": "5d41402abc4b2a76b9719d911017c652",
					  "name": "NA12892.recal.cram",
					  "size": 105087112314,
					  "url": "file://test-bucket/NA12892.recal.crai"
					}
				  ],
				  "pipeline_name": "Dragen",
				  "pipeline_version": "4.4.4",
				  "genome_build": "GRch38"
				}
			  ]
			}]
		`
		var id string
		initErr := db.Raw(`
   		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
   		VALUES (?, 'PENDING', ?, false, 'user123', '2025-12-04')
   		RETURNING id;
		`, payload, types.CaseBatchType).Scan(&id).Error
		if initErr != nil {
			t.Fatal("failed to insert data:", initErr)
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)

		resultBatch := repository.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
		assert.Equal(t, types.BatchStatus("SUCCESS"), resultBatch.Status)
		assert.Equal(t, false, resultBatch.DryRun)
		assert.Equal(t, "case", resultBatch.BatchType)
		assert.Equal(t, "user123", resultBatch.Username)
		assert.NotNil(t, resultBatch.StartedOn)
		assert.NotNil(t, resultBatch.FinishedOn)
		assert.Len(t, resultBatch.Report.Warnings, 0)
		assert.Len(t, resultBatch.Report.Infos, 0)
		assert.Len(t, resultBatch.Report.Errors, 0)

		// Validate case was created
		var ca *types.Case
		if err := db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", projectId, submitterCaseId).First(&ca).Error; err != nil {
			t.Fatal("failed to fetch cases:", err)
		}
		assert.NotNil(t, ca)
		assert.Equal(t, 1000, ca.ID)
		assert.Equal(t, 1, ca.ProbandID)
		assert.Equal(t, 1, ca.ProjectID)
		assert.Equal(t, "Dr. Test", ca.OrderingPhysician)

		// Validate case_has_sequencing_experiment
		var chse []*types.CaseHasSequencingExperiment
		if err := db.Table("case_has_sequencing_experiment").Where("case_id = ?", ca.ID).Find(&chse).Error; err != nil {
			t.Fatal("failed to fetch case_has_sequencing_experiment:", err)
		}
		assert.Len(t, chse, 2)

		// Sort to have a predictable order for assertions
		slices.SortFunc(chse, func(a, b *types.CaseHasSequencingExperiment) int {
			return a.SequencingExperimentID - b.SequencingExperimentID
		})

		assert.Equal(t, 1000, chse[0].CaseID)
		assert.Equal(t, 1, chse[0].SequencingExperimentID)
		assert.Equal(t, 70, chse[1].SequencingExperimentID)

		// Validate family was created
		var fa []*types.Family
		if err := db.Table("family").Where("case_id = ?", ca.ID).Find(&fa).Error; err != nil {
			t.Fatal("failed to fetch task_context:", err)
		}
		assert.Len(t, fa, 1)
		assert.Equal(t, 1000, fa[0].ID)
		assert.Equal(t, 1, fa[0].FamilyMemberID)
		assert.Equal(t, "proband", fa[0].RelationshipToProbandCode)

		// Validate task context was created
		var tc []*types.TaskContext
		if err := db.Table("task_context").Where("task_id = 1000").Find(&tc).Error; err != nil {
			t.Fatal("failed to fetch task_context:", err)
		}
		assert.Len(t, tc, 2)

		// Sort to have a predictable order for assertions
		slices.SortFunc(tc, func(a, b *types.TaskContext) int {
			return a.SequencingExperimentID - b.SequencingExperimentID
		})

		assert.Equal(t, 1, tc[0].SequencingExperimentID)
		assert.Equal(t, 70, tc[1].SequencingExperimentID)

		var ta *types.Task
		if err := db.Table("task").Where("id = 1000").First(&ta).Error; err != nil {
			t.Fatal("failed to fetch task:", err)
		}
		assert.Equal(t, "alignment_germline_variant_calling", ta.TaskTypeCode)
		assert.Equal(t, "Dragen", ta.PipelineName)
		assert.Equal(t, "4.4.4", ta.PipelineVersion)
		assert.Equal(t, "GRch38", ta.GenomeBuild)

		var thd []*types.TaskHasDocument
		if err := db.Table("task_has_document").Where("task_id = 1000").Find(&thd).Error; err != nil {
			t.Fatal("failed to fetch task_has_document:", err)
		}
		assert.Len(t, thd, 1)
		assert.Equal(t, 1000, thd[0].DocumentID)

		// Validate document fields
		var doc *types.Document
		if err := db.Table("document").Where("id = ?", thd[0].DocumentID).First(&doc).Error; err != nil {
			t.Fatal("failed to fetch document:", err)
		}
		assert.NotNil(t, doc)

		assert.Equal(t, "NA12892.recal.cram", doc.Name)
		assert.Equal(t, int64(105087112314), doc.Size)
		assert.Equal(t, "5d41402abc4b2a76b9719d911017c652", doc.Hash)
		assert.Equal(t, "file://test-bucket/NA12892.recal.crai", doc.Url)
		assert.Equal(t, "genomic", doc.DataCategoryCode)
		assert.Equal(t, "alignment", doc.DataTypeCode)
		assert.Equal(t, "cram", doc.FileFormatCode)
	})
}
