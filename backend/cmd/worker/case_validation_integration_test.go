package main

import (
	"encoding/json"
	"slices"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func createBaseCasePayload() []map[string]interface{} {
	return []map[string]interface{}{
		{
			"submitter_case_id":             "CASE123",
			"type":                          "germline",
			"status_code":                   "in_progress",
			"project_code":                  "N1",
			"diagnostic_lab_code":           "LDM-CHUSJ",
			"primary_condition_code_system": "MONDO",
			"primary_condition_value":       "MONDO:0700092",
			"priority_code":                 "routine",
			"category_code":                 "postnatal",
			"analysis_code":                 "WGA",
			"resolution_status_code":        "unsolved",
			"note":                          "test case note",
			"ordering_physician":            "Dr. Test",
			"ordering_organization_code":    "CHUSJ",
			"patients": []map[string]interface{}{
				{
					"submitter_patient_id":      "MRN-283773",
					"affected_status_code":      "affected",
					"patient_organization_code": "CHUSJ",
					"relation_to_proband_code":  "proband",
					"family_history":            []interface{}{},
					"observations_text":         []interface{}{},
					"observations_categorical": []map[string]interface{}{
						{
							"code":                "phenotype",
							"system":              "HPO",
							"value":               "TEST:12345",
							"onset_code":          "infantile",
							"interpretation_code": "positive",
							"note":                "Test clinical note",
						},
					},
				},
			},
			"sequencing_experiments": []map[string]interface{}{
				{
					"aliquot":                  "NA12892",
					"sample_organization_code": "CQGC",
					"submitter_sample_id":      "S13224",
				},
			},
			"tasks": []map[string]interface{}{
				{
					"type_code":        "alignment_germline_variant_calling",
					"aliquot":          "NA12892",
					"pipeline_name":    "Dragen",
					"pipeline_version": "4.4.4",
					"genome_build":     "GRch38",
					"input_documents":  []interface{}{},
					"output_documents": []map[string]interface{}{
						{
							"data_category_code": "genomic",
							"data_type_code":     "alignment",
							"format_code":        "cram",
							"hash":               "5d41402abc4b2a76b9719d911017c652",
							"name":               "NA12892.recal.cram",
							"size":               105087112314,
							"url":                "file://test-bucket/NA12892.recal.crai",
						},
					},
				},
			},
		},
	}
}

func insertPayloadIntoDB(db *gorm.DB, payload []byte, status string, batchType string, dryRun bool, username string, createdOn string) (string, error) {
	var id string
	initErr := db.Raw(`
   		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
   		VALUES (?, ?, ?, ?, ?, ?)
   		RETURNING id;
		`, payload, status, batchType, dryRun, username, createdOn).Scan(&id).Error
	if initErr != nil {
		return "", initErr
	}
	return id, nil
}

func assertBatchProcessing(t *testing.T, db *gorm.DB, id string, expectedStatus types.BatchStatus, dryRun bool, username string, createdOn string, expectWarnings int, expectInfos int, expectErrors int) {
	resultBatch := repository.Batch{}
	db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
	assert.Equal(t, expectedStatus, resultBatch.Status)
	assert.Equal(t, dryRun, resultBatch.DryRun)
	assert.Equal(t, username, resultBatch.Username)
	assert.Equal(t, createdOn, resultBatch.CreatedOn)
	assert.NotNil(t, resultBatch.StartedOn)
	assert.NotNil(t, resultBatch.FinishedOn)
	assert.Len(t, resultBatch.Report.Warnings, expectWarnings)
	assert.Len(t, resultBatch.Report.Infos, expectInfos)
	assert.Len(t, resultBatch.Report.Errors, expectErrors)
}

func Test_ProcessBatch_Case_Success_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload, _ := json.Marshal(createBaseCasePayload())
		id, err := insertPayloadIntoDB(db, payload, "PENDING", types.CaseBatchType, true, "user123", "2025-12-04")
		if err != nil {
			return
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)
		assertBatchProcessing(t, db, id, "SUCCESS", true, "user123", "2025-12-04", 0, 0, 0)

		var count int64
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE123").Count(&count)
		assert.Equal(t, int64(0), count)
	})
}

func Test_ProcessBatch_Case_Success_Not_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload, _ := json.Marshal(createBaseCasePayload())
		id, err := insertPayloadIntoDB(db, payload, "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		if err != nil {
			return
		}

		context := NewBatchValidationContext(db)
		processBatch(db, context)
		assertBatchProcessing(t, db, id, "SUCCESS", true, "user123", "2025-12-04", 0, 0, 0)

		var ca *types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE123").First(&ca)

		assert.NotNil(t, ca)
		assert.Equal(t, 1000, ca.ID)
		assert.Equal(t, 1, ca.ProbandID)
		assert.Equal(t, 1, ca.ProjectID)
		assert.Equal(t, "Dr. Test", ca.OrderingPhysician)

		var chse []*types.CaseHasSequencingExperiment
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", ca.ID).Find(&chse)
		assert.Len(t, chse, 2)

		// Sort to have a predictable order for assertions
		slices.SortFunc(chse, func(a, b *types.CaseHasSequencingExperiment) int {
			return a.SequencingExperimentID - b.SequencingExperimentID
		})

		assert.Equal(t, 1000, chse[0].CaseID)
		assert.Equal(t, 1, chse[0].SequencingExperimentID)
		assert.Equal(t, 70, chse[1].SequencingExperimentID)

		var fa []*types.Family
		db.Table("family").Where("case_id = ?", ca.ID).Find(&fa)
		assert.Len(t, fa, 1)
		assert.Equal(t, 1000, fa[0].ID)
		assert.Equal(t, 1, fa[0].FamilyMemberID)
		assert.Equal(t, "proband", fa[0].RelationshipToProbandCode)

		var tc []*types.TaskContext
		db.Table("task_context").Where("task_id = 1000").Find(&tc)
		assert.Len(t, tc, 2)

		slices.SortFunc(tc, func(a, b *types.TaskContext) int {
			return a.SequencingExperimentID - b.SequencingExperimentID
		})

		assert.Equal(t, 1, tc[0].SequencingExperimentID)
		assert.Equal(t, 70, tc[1].SequencingExperimentID)

		var ta *types.Task
		db.Table("task").Where("id = 1000").First(&ta)
		assert.Equal(t, "alignment_germline_variant_calling", ta.TaskTypeCode)
		assert.Equal(t, "Dragen", ta.PipelineName)
		assert.Equal(t, "4.4.4", ta.PipelineVersion)
		assert.Equal(t, "GRch38", ta.GenomeBuild)

		var thd []*types.TaskHasDocument
		db.Table("task_has_document").Where("task_id = 1000")
		assert.Len(t, thd, 1)
		assert.Equal(t, 1000, thd[0].DocumentID)

		var doc *types.Document
		db.Table("document").Where("id = ?", thd[0].DocumentID).First(&doc)
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
