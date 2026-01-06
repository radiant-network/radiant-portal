package main

import (
	"encoding/json"
	"fmt"
	"slices"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var EMPTY_MSGS []types.BatchMessage

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

func insertPayloadAndProcessBatch(db *gorm.DB, payload string, status string, batchType string, dryRun bool, username string, createdOn string) string {
	var id string
	initErr := db.Raw(`
   		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
   		VALUES (?, ?, ?, ?, ?, ?)
   		RETURNING id;
		`, payload, status, batchType, dryRun, username, createdOn).Scan(&id).Error
	if initErr != nil {
		panic(fmt.Sprintf("failed to insert payload into table %v", initErr))
	}
	context := NewBatchValidationContext(db)
	processBatch(db, context)
	return id
}

func assertBatchProcessing(t *testing.T, db *gorm.DB, id string, expectedStatus types.BatchStatus, dryRun bool, username string, expectWarnings []types.BatchMessage, expectInfos []types.BatchMessage, expectErrors []types.BatchMessage) repository.Batch {
	resultBatch := repository.Batch{}
	db.Table("batch").Where("id = ?", id).Scan(&resultBatch)
	assert.Equal(t, expectedStatus, resultBatch.Status)
	assert.Equal(t, dryRun, resultBatch.DryRun)
	assert.Equal(t, username, resultBatch.Username)
	assert.NotNil(t, resultBatch.CreatedOn)
	assert.NotNil(t, resultBatch.StartedOn)
	assert.NotNil(t, resultBatch.FinishedOn)
	assert.Equal(t, expectWarnings, resultBatch.Report.Warnings)
	assert.Equal(t, expectInfos, resultBatch.Report.Infos)
	assert.Equal(t, expectErrors, resultBatch.Report.Errors)
	return resultBatch
}

func getTableCounts(db *gorm.DB, tableNames []string) map[string]int64 {
	counts := make(map[string]int64)
	for _, tableName := range tableNames {
		var count int64
		db.Table(tableName).Count(&count)
		counts[tableName] = count
	}
	return counts
}

func Test_ProcessBatch_Case_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload, _ := json.Marshal(createBaseCasePayload())
		id := insertPayloadAndProcessBatch(db, string(payload), "PENDING", types.CaseBatchType, true, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, "SUCCESS", true, "user123", EMPTY_MSGS, EMPTY_MSGS, EMPTY_MSGS)

		var count int64
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE123").Count(&count)
		assert.Equal(t, int64(0), count)
	})
}

func Test_ProcessBatch_Case_Not_Dry_Run(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0]["submitter_case_id"] = "SUCCESS_CASE_123"
		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, "SUCCESS", false, "user123", EMPTY_MSGS, EMPTY_MSGS, EMPTY_MSGS)

		var ca *types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "SUCCESS_CASE_123").First(&ca)

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
		db.Table("task_has_document").Where("task_id = 1000").Find(&thd)
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

func Test_ProcessBatch_Case_Persist_Failure_ID_Collision(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		for _, tableName := range []string{"cases", "family", "obs_categorical", "task", "document"} {
			var maxID int
			if err := db.Raw(fmt.Sprintf("SELECT COALESCE(MAX(id), 0) FROM %s;", tableName)).Scan(&maxID).Error; err != nil || maxID == 0 {
				t.Fatalf("failed to get max ID from table %s: %v", tableName, err)
			}

			db.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN id RESTART WITH 1;", tableName)) // Force ID collision

			before := getTableCounts(db, []string{"cases", "family", "obs_categorical", "task", "document"})

			payload, _ := json.Marshal(createBaseCasePayload())
			id := insertPayloadAndProcessBatch(db, string(payload), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

			var msg string
			switch tableName {
			case "cases":
				msg = "error processing case batch records: error during case insertion failed to persist case for case \"CASE123\": failed to persist case ERROR: duplicate key value violates unique constraint \"case_pkey\" (SQLSTATE 23505)"
			case "family":
				msg = "error processing case batch records: error during case insertion failed to persist family for case \"CASE123\": failed to persist family member \"MRN-283773\" for case \"CASE123\": ERROR: duplicate key value violates unique constraint \"family_pkey\" (SQLSTATE 23505)"
			case "obs_categorical":
				msg = "error processing case batch records: error during case insertion failed to persist observations for case \"CASE123\": failed to persist observation categorical for patient \"MRN-283773\" in case \"CASE123\": ERROR: duplicate key value violates unique constraint \"observation_coding_pkey\" (SQLSTATE 23505)"
			case "task":
				msg = "error processing case batch records: error during case insertion failed to persist tasks for case \"CASE123\": failed to persist task for case \"CASE123\": ERROR: duplicate key value violates unique constraint \"task_pkey\" (SQLSTATE 23505)"
			case "document":
				msg = "error processing case batch records: error during case insertion failed to persist tasks for case \"CASE123\": failed to persist document \"NA12892.recal.cram\" for case \"CASE123\": ERROR: duplicate key value violates unique constraint \"document_pkey\" (SQLSTATE 23505)"
			default:
				t.Fatalf("unexpected table name: %s", tableName)
			}

			expectedErrors := []types.BatchMessage{
				{
					Code:    "GLOBAL-000",
					Message: msg,
					Path:    "",
				},
			}
			assertBatchProcessing(t, db, id, "ERROR", false, "user123", EMPTY_MSGS, EMPTY_MSGS, expectedErrors)

			after := getTableCounts(db, []string{"cases", "family", "obs_categorical", "task", "document"})
			assert.Equal(t, before, after)

			if err := db.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN id RESTART WITH %d;", tableName, maxID+1)).Error; err != nil {
				t.Fatalf("failed to reset ID sequence on table %s: %v", tableName, err)
			}
		}
	})
}
