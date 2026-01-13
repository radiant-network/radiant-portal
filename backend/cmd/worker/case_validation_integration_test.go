package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var emptyMsgs []types.BatchMessage

func createBaseCasePayload() []*types.CaseBatch {
	return []*types.CaseBatch{
		{
			SubmitterCaseId:            "CASE123",
			Type:                       "germline",
			StatusCode:                 "in_progress",
			ProjectCode:                "N1",
			DiagnosticLabCode:          "LDM-CHUSJ",
			PrimaryConditionCodeSystem: "MONDO",
			PrimaryConditionValue:      "MONDO:0700092",
			PriorityCode:               "routine",
			CategoryCode:               "postnatal",
			AnalysisCode:               "WGA",
			ResolutionStatusCode:       "unsolved",
			Note:                       "test case note",
			OrderingPhysician:          "Dr. Test",
			OrderingOrganizationCode:   "CHUSJ",
			Patients: []*types.CasePatientBatch{
				{
					SubmitterPatientId:      "MRN-283773",
					AffectedStatusCode:      "affected",
					PatientOrganizationCode: "CHUSJ",
					RelationToProbandCode:   "proband",
					FamilyHistory:           []*types.FamilyHistoryBatch{},
					ObservationsText:        []*types.ObservationTextBatch{},
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "TEST:12345",
							OnsetCode:          "infantile",
							InterpretationCode: "positive",
							Note:               "Test clinical note",
						},
					},
				},
			},
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "NA12891",
					SampleOrganizationCode: "CQGC",
					SubmitterSampleId:      "S13225",
				},
			},
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode:        "alignment_germline_variant_calling",
					Aliquot:         "NA12891",
					PipelineName:    "Dragen",
					PipelineVersion: "4.4.4",
					GenomeBuild:     "GRch38",
					InputDocuments:  []*types.InputDocumentBatch{},
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							DataCategoryCode: "genomic",
							DataTypeCode:     "alignment",
							FormatCode:       "cram",
							Hash:             "d57f21e6a273781dbf8b7657940f3b03",
							Name:             "NA12891.recal.cram",
							Size:             11,
							Url:              "s3://test-bucket/NA12891.recal.crai",
						},
					},
				},
			},
		},
	}
}

func createDocument(ctx context.Context, client *minio.Client, bucket string, key string, content []byte) error {
	_ = client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{})
	_, err := client.PutObject(ctx, bucket, key, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})
	return err
}

func createDocumentsForBatch(ctx context.Context, client *minio.Client, cases []*types.CaseBatch) {
	store, _ := utils.NewS3Store()
	for _, c := range cases {
		for _, task := range c.Tasks {
			for _, out := range task.OutputDocuments {
				content := bytes.Repeat([]byte("a"), int(out.Size))
				location, _ := utils.ExtractS3BucketAndKey(out.Url)
				_ = createDocument(ctx, client, location.Bucket, location.Key, content)
				metadata, _ := store.GetMetadata(out.Url)
				out.Hash = metadata.Hash
			}
		}
	}
}

func insertPayloadAndProcessBatch(db *gorm.DB, payload string, status types.BatchStatus, batchType string, dryRun bool, username string, createdOn string) string {
	var id string
	initErr := db.Raw(`
   		INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on)
   		VALUES (?, ?, ?, ?, ?, ?)
   		RETURNING id;
		`, payload, string(status), batchType, dryRun, username, createdOn).Scan(&id).Error
	if initErr != nil {
		panic(fmt.Sprintf("failed to insert payload into table %v", initErr))
	}
	ctx, _ := NewBatchValidationContext(db)
	processBatch(db, ctx)
	return id
}

func assertBatchProcessing(t *testing.T, db *gorm.DB, id string, expectedStatus types.BatchStatus, dryRun bool, username string, expectInfos []types.BatchMessage, expectWarnings []types.BatchMessage, expectErrors []types.BatchMessage) repository.Batch {
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
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, true, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, true, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var count int64
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE123").Count(&count)
		assert.Equal(t, int64(0), count)
	})
}

func Test_ProcessBatch_Case_Not_Dry_Run(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "SUCCESS_CASE_123"

		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

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
		assert.Equal(t, 2, chse[0].SequencingExperimentID)
		assert.Equal(t, 71, chse[1].SequencingExperimentID)

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

		assert.Equal(t, 2, tc[0].SequencingExperimentID)
		assert.Equal(t, 71, tc[1].SequencingExperimentID)

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

		assert.Equal(t, "NA12891.recal.cram", doc.Name)
		assert.Equal(t, int64(11), doc.Size)
		assert.Equal(t, "d57f21e6a273781dbf8b7657940f3b03", doc.Hash)
		assert.Equal(t, "s3://test-bucket/NA12891.recal.crai", doc.Url)
		assert.Equal(t, "genomic", doc.DataCategoryCode)
		assert.Equal(t, "alignment", doc.DataTypeCode)
		assert.Equal(t, "cram", doc.FileFormatCode)
	})
}

func Test_ProcessBatch_Case_Persist_Failure_ID_Collision(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		for _, tableName := range []string{"cases", "family", "obs_categorical", "task", "document"} {
			var maxID int
			if err := db.Raw(fmt.Sprintf("SELECT COALESCE(MAX(id), 0) FROM %s;", tableName)).Scan(&maxID).Error; err != nil || maxID == 0 {
				t.Fatalf("failed to get max ID from table %s: %v", tableName, err)
			}

			db.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN id RESTART WITH 1;", tableName)) // Force ID collision

			before := getTableCounts(db, []string{"cases", "family", "obs_categorical", "task", "document"})

			payload := createBaseCasePayload()

			payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-another-bucket/NA12891.recal.crai"

			createDocumentsForBatch(context, client, payload)
			payloadBytes, _ := json.Marshal(payload)
			id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")

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
				msg = "error processing case batch records: error during case insertion failed to persist tasks for case \"CASE123\": failed to persist document \"NA12891.recal.cram\" for case \"CASE123\": ERROR: duplicate key value violates unique constraint \"document_pkey\" (SQLSTATE 23505)"
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
			assertBatchProcessing(t, db, id, types.BatchStatusError, false, "user123", emptyMsgs, emptyMsgs, expectedErrors)

			after := getTableCounts(db, []string{"cases", "family", "obs_categorical", "task", "document"})
			assert.Equal(t, before, after)

			if err := db.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN id RESTART WITH %d;", tableName, maxID+1)).Error; err != nil {
				t.Fatalf("failed to reset ID sequence on table %s: %v", tableName, err)
			}
		}
	})
}

func Test_ProcessBatch_Case_validateDocument_IdenticalDocumentAlreadyExists(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "validateDocument_IdenticalDocumentAlreadyExists_1"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/validateDocument_IdenticalDocumentAlreadyExists.recal.crai"
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, "SUCCESS", false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		payload[0].SubmitterCaseId = "validateDocument_IdenticalDocumentAlreadyExists_2"
		payloadBytes, _ = json.Marshal(payload)
		id = insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		infos := []types.BatchMessage{
			{
				Code:    "DOCUMENT-003",
				Message: "Document s3://test-bucket/validateDocument_IdenticalDocumentAlreadyExists.recal.crai already exists, skipped.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-005",
				Message: "A document with same url s3://test-bucket/validateDocument_IdenticalDocumentAlreadyExists.recal.crai has been found in the output of a different task.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", infos, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_Error_DocumentField(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "validateDocument_Error_DocumentField"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/validateDocument_Error_DocumentField.recal.crai"
		payload[0].Tasks[0].OutputDocuments[0].Name = "!@#$%^&*()_+"
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-001",
				Message: "Invalid Field name for case 0 - task 0 - output document 0. Reason: does not match the regular expression ^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_Error_DocumentNotFoundAtUrl(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "validateDocument_Error_DocumentNotFoundAtUrl"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/validateDocument_Error_DocumentNotFoundAtUrl.recal.crai"
		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-002",
				Message: "No document can be found on the URL s3://test-bucket/validateDocument_Error_DocumentNotFoundAtUrl.recal.crai for case 0 - task 0 - output document 0.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_Warning_PartiallyDifferentDocumentExists(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		url := "s3://test-bucket/validateDocument_Warning_PartiallyDifferentDocumentExists.recal.crai"
		doc := payload[0].Tasks[0].OutputDocuments[0]

		db.Exec(`
            INSERT INTO document (name, data_category_code, data_type_code, format_code, size, url, hash)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
			doc.Name,
			doc.DataCategoryCode,
			doc.DataTypeCode,
			doc.FormatCode,
			doc.Size,
			url,
			doc.Hash,
		)

		payload[0].SubmitterCaseId = "WARNING_CASE_123"
		payload[0].Tasks[0].OutputDocuments[0].Url = url
		payload[0].Tasks[0].OutputDocuments[0].Name = "Something Else"
		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		warnings := []types.BatchMessage{
			{
				Code:    "DOCUMENT-004",
				Message: "A document with same url s3://test-bucket/validateDocument_Warning_PartiallyDifferentDocumentExists.recal.crai has been found but with a different name (NA12891.recal.cram <> Something Else).",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "SUCCESS", false, "user123", emptyMsgs, warnings, emptyMsgs)
	})
}

func Test_ProcessBatch_Case_validateDocument_Error_DuplicateDocumentInBatch(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "validateDocument_Error_DuplicateDocumentInBatch"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/validateDocument_Error_DuplicateDocumentInBatch.recal.crai"
		payload[0].Tasks[0].OutputDocuments = append(payload[0].Tasks[0].OutputDocuments, payload[0].Tasks[0].OutputDocuments[0])
		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-008",
				Message: "Duplicate output document with URL s3://test-bucket/validateDocument_Error_DuplicateDocumentInBatch.recal.crai found.",
				Path:    "case[0].tasks[0].output_documents[1]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_Error_SizeNotMatch(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "validateDocument_Error_SizeNotMatch"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/validateDocument_Error_SizeNotMatch.recal.crai"
		createDocumentsForBatch(context, client, payload)

		payload[0].Tasks[0].OutputDocuments[0].Size = 42

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-006",
				Message: "Document size does not match the actual size of the document s3://test-bucket/validateDocument_Error_SizeNotMatch.recal.crai for case 0 - task 0 - output document 0.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_Error_HashNotMatch(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload()
		payload[0].SubmitterCaseId = "validateDocument_Error_HashNotMatch"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/validateDocument_Error_HashNotMatch.recal.crai"
		createDocumentsForBatch(context, client, payload)

		payload[0].Tasks[0].OutputDocuments[0].Hash = "not-the-right-hash"

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-007",
				Message: "Document hash does not match the actual hash of the document s3://test-bucket/validateDocument_Error_HashNotMatch.recal.crai for case 0 - task 0 - output document 0.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_Template(t *testing.T) {
	testutils.SequentialPostgresTestWithDb(t, func(t *testing.T, db *gorm.DB) {
		t.Skip("Template test - implement specific error case tests as needed")

		//// FIXME: The following test is for example purposes only.
		////        Use this template to create your own test cases for different error scenarios.
		////        Make sure to adjust the payload and expected error messages accordingly.
		//
		//payload := createBaseCasePayload()
		//
		//// TODO: Change values for your test case
		//payload[0]["project_code"] = "TEMPLATE_ERROR_PROJECT_123" // example of an error case
		//
		//// TODO: Load the payload into the batch and into the database
		//payloadBytes, _ := json.Marshal(payload)
		//id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		//
		//// TODO: Implement the specific message assertions for your test case
		//errors := []types.BatchMessage{
		//	{
		//		Code:    "CASE-001",
		//		Message: "project with code \"TEMPLATE_ERROR_PROJECT_123\" not found",
		//		Path:    "/0/project_code",
		//	},
		//}
		//
		//// TODO: Call the assertion function with expected messages
		//assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}
