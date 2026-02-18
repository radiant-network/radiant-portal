package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"slices"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

var emptyMsgs []types.BatchMessage

func createBaseCasePayload(submitterCaseId string) []*types.CaseBatch {
	scenario, err := testutils.LoadScenario("base")
	if err != nil {
		panic(fmt.Sprintf("failed to load test scenario %q: %v", "base", err))
	}
	cases := scenario.Cases
	cases[0].SubmitterCaseId = submitterCaseId
	cases[0].Tasks[0].OutputDocuments[0].Url = fmt.Sprintf("s3://test-bucket/%s.recal.crai", submitterCaseId)
	return cases
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
				content := bytes.Repeat([]byte("a"), int(*out.Size))
				location, _ := utils.ExtractS3BucketAndKey(out.Url)
				_ = createDocument(ctx, client, location.Bucket, location.Key, content)
				metadata, _ := store.GetMetadata(out.Url)
				out.Hash = metadata.Hash
			}
		}
	}
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
		payload := createBaseCasePayload("Dry_Run")
		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, true, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, true, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var count int64
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "Dry_Run").Count(&count)
		assert.Equal(t, int64(0), count)
	})
}

func Test_ProcessBatch_Case_Not_Dry_Run(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("Not_Dry_Run")
		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var ca *types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "Not_Dry_Run").First(&ca)

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

		var obscat []*types.ObsCategorical
		db.Table("obs_categorical").Where("case_id = ?", ca.ID).Find(&obscat)
		assert.Len(t, obscat, 1)
		assert.Equal(t, 1000, obscat[0].ID)
		assert.Equal(t, 1, obscat[0].PatientID)
		assert.Equal(t, "TEST:12345", obscat[0].CodeValue)

		var obsstr []*types.ObsString
		db.Table("obs_string").Where("case_id = ?", ca.ID).Find(&obsstr)
		assert.Len(t, obsstr, 1)
		assert.Equal(t, 1000, obsstr[0].ID)
		assert.Equal(t, 1, obsstr[0].PatientID)
		assert.Equal(t, "TEST:678901", obsstr[0].Value)

		var famhist []*types.FamilyHistory
		db.Table("family_history").Where("case_id = ?", ca.ID).Find(&famhist)
		assert.Len(t, famhist, 1)
		assert.Equal(t, 1000, famhist[0].ID)
		assert.Equal(t, 1, famhist[0].PatientID)
		assert.Equal(t, "Seizure", famhist[0].Condition)

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
		assert.Equal(t, "s3://test-bucket/Not_Dry_Run.recal.crai", doc.Url)
		assert.Equal(t, "genomic", doc.DataCategoryCode)
		assert.Equal(t, "alignment", doc.DataTypeCode)
		assert.Equal(t, "cram", doc.FileFormatCode)
	})
}

func Test_ProcessBatch_Case_Not_Dry_Run_No_SubmitterCaseId(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("")
		payload[0].SubmitterCaseId = ""
		payload[0].OrderingPhysician = "Not_Dry_Run_No_SubmitterCaseId"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/Not_Dry_Run_No_SubmitterCaseId_1.recal.crai"

		payload = append(payload, payload[0])

		payload[1].SubmitterCaseId = ""
		payload[1].OrderingPhysician = "Not Dry Run No SubmitterCaseId"
		payload[1].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/Not_Dry_Run_No_SubmitterCaseId_2.recal.crai"

		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var ca []*types.Case
		db.Table("cases").Where("project_id = ? AND ordering_physician = ?", 1, "Not Dry Run No SubmitterCaseId").Find(&ca)

		assert.NotNil(t, ca)
		assert.Len(t, ca, 2)
		assert.GreaterOrEqual(t, ca[0].ID, 1000)
		assert.Equal(t, "Not Dry Run No SubmitterCaseId", ca[0].OrderingPhysician)
		assert.Equal(t, "", ca[0].SubmitterCaseID)
	})
}

func Test_ProcessBatch_Case_Not_Dry_Run_SubmitterCaseId_Collision(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("")
		payload[0].SubmitterCaseId = "SUBMITTER_CASE_ID_COLLISION"
		payload[0].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/Not_Dry_Run_SubmitterCaseId_Collision_1.recal.crai"

		payload = append(payload, payload[0])

		payload[1].SubmitterCaseId = "SUBMITTER_CASE_ID_COLLISION"
		payload[1].Tasks[0].OutputDocuments[0].Url = "s3://test-bucket/Not_Dry_Run_SubmitterCaseId_Collision_1.recal.crai"

		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "CASE-011",
				Message: "Case (N1 / SUBMITTER_CASE_ID_COLLISION) appears multiple times in the batch.",
				Path:    "case[1]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_Persist_Failure_ID_Collision(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		for _, tableName := range []string{"cases", "family", "obs_categorical", "obs_string", "family_history", "task", "document"} {
			var maxID int
			if err := db.Raw(fmt.Sprintf("SELECT COALESCE(MAX(id), 0) FROM %s;", tableName)).Scan(&maxID).Error; err != nil || maxID == 0 {
				t.Fatalf("failed to get max ID from table %s: %v", tableName, err)
			}

			db.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN id RESTART WITH 1;", tableName)) // Force ID collision

			before := getTableCounts(db, []string{"cases", "family", "obs_categorical", "obs_string", "family_history", "task", "document"})

			payload := createBaseCasePayload("Persist_Failure_ID_Collision_" + tableName)
			createDocumentsForBatch(context, client, payload)
			payloadBytes, _ := json.Marshal(payload)
			id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")

			var msg string
			switch tableName {
			case "cases":
				msg = "error processing case batch records: error during case insertion failed to persist case for case 0: failed to persist case ERROR: duplicate key value violates unique constraint \"case_pkey\" (SQLSTATE 23505)"
			case "family":
				msg = "error processing case batch records: error during case insertion failed to persist family for case 0: failed to persist family member \"MRN-283773\" for case 0: ERROR: duplicate key value violates unique constraint \"family_pkey\" (SQLSTATE 23505)"
			case "obs_categorical":
				msg = "error processing case batch records: error during case insertion failed to persist observations categorical for case 0: failed to persist observation categorical for patient \"MRN-283773\" in case 0: ERROR: duplicate key value violates unique constraint \"observation_coding_pkey\" (SQLSTATE 23505)"
			case "obs_string":
				msg = "error processing case batch records: error during case insertion failed to persist observations text for case 0: failed to persist observation text for patient \"MRN-283773\" in case 0: ERROR: duplicate key value violates unique constraint \"obs_string_pkey\" (SQLSTATE 23505)"
			case "family_history":
				msg = "error processing case batch records: error during case insertion failed to persist family history for case 0: failed to persist family history for patient \"MRN-283773\" in case 0: ERROR: duplicate key value violates unique constraint \"family_history_pkey\" (SQLSTATE 23505)"
			case "task":
				msg = "error processing case batch records: error during case insertion failed to persist tasks for case 0: failed to persist task for case 0: ERROR: duplicate key value violates unique constraint \"task_pkey\" (SQLSTATE 23505)"
			case "document":
				msg = "error processing case batch records: error during case insertion failed to persist tasks for case 0: failed to persist document \"NA12891.recal.cram\" for case 0: ERROR: duplicate key value violates unique constraint \"document_pkey\" (SQLSTATE 23505)"
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

			after := getTableCounts(db, []string{"cases", "family", "obs_categorical", "obs_string", "family_history", "task", "document"})
			assert.Equal(t, before, after)

			if err := db.Exec(fmt.Sprintf("ALTER TABLE %s ALTER COLUMN id RESTART WITH %d;", tableName, maxID+1)).Error; err != nil {
				t.Fatalf("failed to reset ID sequence on table %s: %v", tableName, err)
			}
		}
	})
}

func Test_ProcessBatch_Case_validateTask_Error_TaskField(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateTask_Error_TaskField")
		payload[0].Tasks[0].PipelineVersion = "!@#$%^&*()_+"
		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-001",
				Message: "Invalid field pipeline_version for case 0 - task 0. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[0].tasks[0].pipeline_version",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateTask_Error_InvalidTaskTypeCode(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateTask_Error_InvalidTaskTypeCode")
		payload[0].Tasks[0].TypeCode = "invalid_task_type"
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-001",
				Message: "Invalid field type_code for case 0 - task 0. Reason: invalid task type code `invalid_task_type`. Valid codes are: [alignment, alignment_germline_variant_calling, alignment_somatic_variant_calling, family_variant_calling, somatic_variant_calling, tumor_only_variant_calling, radiant_germline_annotation, exomiser, rnaseq_analysis].",
				Path:    "case[0].tasks[0].type_code",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateTask_Error_InvalidTaskAliquot(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateTask_Error_InvalidTaskAliquot")
		payload[0].Tasks[0].Aliquots = []string{"UNKNOWN_ALIQUOT"}
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-002",
				Message: "Sequencing \"UNKNOWN_ALIQUOT\" is not defined for case 0 - task 0.",
				Path:    "case[0].tasks[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateTask_Error_MissingInputDocuments(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateTask_Error_MissingInputDocuments")
		payload[0].Tasks[0].TypeCode = "family_variant_calling"
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-003",
				Message: "Missing input documents for case 0 - task 0 of type family_variant_calling.",
				Path:    "case[0].tasks[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateTask_Error_MissingOutputDocuments(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateTask_Error_MissingOutputDocuments")
		payload[0].Tasks[0].OutputDocuments = []*types.OutputDocumentBatch{}
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-004",
				Message: "Missing output documents for case 0 - task 0 of type alignment_germline_variant_calling.",
				Path:    "case[0].tasks[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateTask_Error_ExternalSequencingExperiment(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateTask_Error_ExternalSequencingExperiment")
		payload[0].Tasks[0].TypeCode = "family_variant_calling"
		payload[0].Tasks[0].Aliquots = []string{"NA12891", "ABC123"} // One Aliquot not-matching
		payload[0].Tasks[0].InputDocuments = []*types.InputDocumentBatch{
			{
				Url: "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram",
			},
		}
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-002",
				Message: "Sequencing \"ABC123\" is not defined for case 0 - task 0.",
				Path:    "case[0].tasks[0]",
			},
			{
				Code:    "TASK-006",
				Message: "Input document with URL s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram for case 0 - task 0 was produced by a sequencing experiment not defined in this case.",
				Path:    "case[0].tasks[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_IdenticalDocumentAlreadyExists(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateDocument_IdenticalDocumentAlreadyExists_1")
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
		payload := createBaseCasePayload("validateDocument_Error_DocumentField")
		payload[0].Tasks[0].OutputDocuments[0].Name = "!@#$%^&*()_+"
		createDocumentsForBatch(context, client, payload)

		payloadBytes, _ := json.Marshal(payload)
		id := insertPayloadAndProcessBatch(db, string(payloadBytes), "PENDING", types.CaseBatchType, false, "user123", "2025-12-04")
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-001",
				Message: "Invalid field name for case 0 - task 0 - output document 0. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_validateDocument_Error_DocumentNotFoundAtUrl(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("validateDocument_Error_DocumentNotFoundAtUrl")
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
		payload := createBaseCasePayload("validateDocument_Warning_PartiallyDifferentDocumentExists")
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
		payload := createBaseCasePayload("validateDocument_Error_DuplicateDocumentInBatch")
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
		payload := createBaseCasePayload("validateDocument_Error_SizeNotMatch")
		createDocumentsForBatch(context, client, payload)

		size := int64(42)
		payload[0].Tasks[0].OutputDocuments[0].Size = &size

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
		payload := createBaseCasePayload("validateDocument_Error_HashNotMatch")
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

func Test_ProcessBatch_Case_TopLevelCase_Codes(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_case_codes")
		payload, _ := json.Marshal(scenario.Cases)
		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")

		infos := []types.BatchMessage{
			{
				Code:    "CASE-001",
				Message: "Case (1 / 1:1) already exists, skipped.",
				Path:    "case[0]",
			},
		}
		errors := []types.BatchMessage{
			{
				Code:    "CASE-003",
				Message: "Project non_existing_project for case 1 does not exist.",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-004",
				Message: "Diagnostic lab \"LDM-CHUSJJ\" for case 1 does not exist.",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-005",
				Message: "Analysis \"WGAA\" for case 1 does not exist.",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-006",
				Message: "Ordering organization \"CHUSJJ\" for case 1 does not exist.",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-002",
				Message: "Invalid field status_code for case 1. Reason: status code \"not_in_progress\" is not a valid status code. Valid values [completed, draft, incomplete, in_progress, revoke, submitted, unknown].",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-002",
				Message: "Invalid field resolution_status_code for case 1. Reason: resolution status code \"unresolved\" is not a valid resolution status code. Valid values [inconclusive, solved, unsolved].",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-002",
				Message: "Invalid field priority_code for case 1. Reason: priority code \"not-routine\" is not a valid priority code. Valid values [asap, routine, stat, urgent].",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-002",
				Message: "Invalid field category_code for case 1. Reason: category code \"not-postnatal\" is not a valid category code. Valid values [postnatal, prenatal].",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-002",
				Message: "Invalid field primary_condition_value for case 1. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-002",
				Message: "Invalid field ordering_physician for case 1. Reason: field is too long, maximum length allowed is 100.",
				Path:    "case[1]",
			},
			{
				Code:    "CASE-007",
				Message: "Case 1 must have exactly 1 proband.",
				Path:    "case[1].patients",
			},
			{
				Code:    "CASE-008",
				Message: "Duplicate patient (CHUSJ / MRN-283773) for case 2.",
				Path:    "case[2].patients",
			},
			{
				Code:    "CASE-007",
				Message: "Case 2 must have exactly 1 proband.",
				Path:    "case[2].patients",
			},
			{
				Code:    "CASE-005",
				Message: "Analysis \"\" for case 3 does not exist.",
				Path:    "case[3]",
			},
			{
				Code:    "CASE-007",
				Message: "Case 3 must have exactly 1 proband.",
				Path:    "case[3].patients",
			},
			{
				Code:    "CASE-011",
				Message: "Case (N1 / CASE-12345) appears multiple times in the batch.",
				Path:    "case[3]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", infos, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_Inner_Codes_PatientsAndObservations(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_inner_codes_patients_and_observations")
		payload, _ := json.Marshal(scenario.Cases)

		// Create document to validate size and hash checks
		_ = createDocument(context, client, "test-bucket", "existing_document.recal.crai", []byte("test content"))

		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")

		errors := []types.BatchMessage{
			{
				Code:    "PATIENT-004",
				Message: "Invalid field submitter_patient_id for case 0 - patient 1. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[0].patients[1]",
			},
			{
				Code:    "PATIENT-006",
				Message: "Patient (CHUSJ / MRN-283773!@#$%^) for case 0 - patient 1 does not exist.",
				Path:    "case[0].patients[1]",
			},
			{
				Code:    "PATIENT-004",
				Message: "Invalid field affected_status_code for case 0 - patient 1. Reason: affected status code \"super-affected\" must be in [affected, non_affected, unknown].",
				Path:    "case[0].patients[1]",
			},
			{
				Code:    "PATIENT-004",
				Message: "Invalid field relation_to_proband_code for case 0 - patient 1. Reason: relationship to proband code \"not-proband\" must be in [brother, father, mother, proband, sibling, sister].",
				Path:    "case[0].patients[1]",
			},
			{
				Code:    "OBS-001",
				Message: "Invalid field system for case 0 - patient 1 - observations_categorical 0. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[0].patients[1].observations_categorical[0]",
			},
			{
				Code:    "OBS-001",
				Message: "Invalid field onset_code for case 0 - patient 1 - observations_categorical 0. Reason: onset code \"infantilee\" is not a valid onset code.",
				Path:    "case[0].patients[1].observations_categorical[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_Inner_Codes_SequencingExperiments(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_inner_codes_sequencing_experiments")
		payload, _ := json.Marshal(scenario.Cases)

		// Create document to validate size and hash checks
		_ = createDocument(context, client, "test-bucket", "existing_document.recal.crai", []byte("test content"))

		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")

		errors := []types.BatchMessage{
			{
				Code:    "SEQ-007",
				Message: "Sequencing experiment (CQGC / S13225 / NA128911) does not exist.",
				Path:    "case[0].sequencing_experiments[0]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_Inner_Codes_Tasks(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_inner_codes_tasks")
		payload, _ := json.Marshal(scenario.Cases)

		// Create document to validate size and hash checks
		_ = createDocument(context, client, "test-bucket", "existing_document.recal.crai", []byte("test content"))

		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")

		errors := []types.BatchMessage{
			{
				Code:    "TASK-001",
				Message: "Invalid field aliquots for case 0 - task 0. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[0].tasks[0].aliquots",
			},
			{
				Code:    "TASK-001",
				Message: "Invalid field type_code for case 0 - task 0. Reason: invalid task type code `desalignment`. Valid codes are: [alignment, alignment_germline_variant_calling, alignment_somatic_variant_calling, family_variant_calling, somatic_variant_calling, tumor_only_variant_calling, radiant_germline_annotation, exomiser, rnaseq_analysis].",
				Path:    "case[0].tasks[0].type_code",
			},
			{
				Code:    "TASK-002",
				Message: "Sequencing \"\" is not defined for case 0 - task 0.",
				Path:    "case[0].tasks[0]",
			},
			{
				Code:    "TASK-004",
				Message: "Missing output documents for case 0 - task 0 of type desalignment.",
				Path:    "case[0].tasks[0]",
			},
			{
				Code:    "TASK-001",
				Message: "Invalid field pipeline_name for case 0 - task 0. Reason: field is too long, maximum length allowed is 100.",
				Path:    "case[0].tasks[0].pipeline_name",
			},
			{
				Code:    "TASK-001",
				Message: "Invalid field aliquots for case 0 - task 1. Reason: aliquots must contain at least one value.",
				Path:    "case[0].tasks[1].aliquots",
			},
			{
				Code:    "TASK-004",
				Message: "Missing output documents for case 0 - task 1 of type alignment.",
				Path:    "case[0].tasks[1]",
			},
			{
				Code:    "TASK-002",
				Message: "Sequencing \"NA12891111\" is not defined for case 0 - task 2.",
				Path:    "case[0].tasks[2]",
			},
			{
				Code:    "TASK-004",
				Message: "Missing output documents for case 0 - task 2 of type radiant_germline_annotation.",
				Path:    "case[0].tasks[2]",
			},
			{
				Code:    "TASK-006",
				Message: "Input document with URL s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz for case 0 - task 2 was produced by a sequencing experiment not defined in this case.",
				Path:    "case[0].tasks[2]",
			},
			{
				Code:    "TASK-001",
				Message: "Invalid field pipeline_name for case 0 - task 2. Reason: does not match the regular expression `^[A-Za-z0-9\\-\\_\\.\\,\\: ]+$`.",
				Path:    "case[0].tasks[2].pipeline_name",
			},
			{
				Code:    "TASK-003",
				Message: "Missing input documents for case 0 - task 3 of type family_variant_calling.",
				Path:    "case[0].tasks[3]",
			},
			{
				Code:    "TASK-004",
				Message: "Missing output documents for case 0 - task 3 of type family_variant_calling.",
				Path:    "case[0].tasks[3]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", emptyMsgs, emptyMsgs, errors)
	})
}

func Test_ProcessBatch_Case_Inner_Codes_Documents(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_inner_codes_documents")
		payload, _ := json.Marshal(scenario.Cases)

		// Create document to validate size and hash checks
		_ = createDocument(context, client, "test-bucket", "existing_document.recal.crai", []byte("test content"))

		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")

		infos := []types.BatchMessage{
			{
				Code:    "DOCUMENT-003",
				Message: "Document s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz already exists, skipped.",
				Path:    "case[0].tasks[0].output_documents[2]",
			},
		}
		warnings := []types.BatchMessage{
			{
				Code:    "DOCUMENT-004",
				Message: "A document with same url s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz has been found but with a different data_category_code (genomic <> genomicc).",
				Path:    "case[0].tasks[0].output_documents[3]",
			},
		}
		errors := []types.BatchMessage{
			{
				Code:    "DOCUMENT-001",
				Message: "Invalid field data_type_code for case 0. Reason: data type code \"not-alignment\" is not a valid data type code. Valid values [alignment, cnvvis, covgene, exomiser, exp, gcnv, gsv, igv, qcrun, scnv, snv, somfu, ssnv, ssup, ssv].",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
			{
				Code:    "DOCUMENT-001",
				Message: "Invalid field data_category_code for case 0. Reason: data category code \"not-genomic\" is not a valid data category code. Valid values [clinical, genomic].",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
			{
				Code:    "DOCUMENT-001",
				Message: "Invalid field format_code for case 0. Reason: format code \"not-cram\" is not a valid format code. Valid values [bed, bw, crai, cram, csv, gvcf, html, json, pdf, png, tbi, tgz, tsv, txt, vcf].",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
			{
				Code:    "DOCUMENT-002",
				Message: "No document can be found on the URL s3://test-bucket/CASE-12345.recal.crai for case 0 - task 0 - output document 0.",
				Path:    "case[0].tasks[0].output_documents[0]",
			},
			{
				Code:    "DOCUMENT-001",
				Message: "Invalid field data_category_code for case 0. Reason: data category code \"genomic!@#$%\" is not a valid data category code. Valid values [clinical, genomic].",
				Path:    "case[0].tasks[0].output_documents[1]",
			},
			{
				Code:    "DOCUMENT-006",
				Message: "Document size does not match the actual size of the document s3://test-bucket/existing_document.recal.crai for case 0 - task 0 - output document 1.",
				Path:    "case[0].tasks[0].output_documents[1]",
			},
			{
				Code:    "DOCUMENT-007",
				Message: "Document hash does not match the actual hash of the document s3://test-bucket/existing_document.recal.crai for case 0 - task 0 - output document 1.",
				Path:    "case[0].tasks[0].output_documents[1]",
			},
			{
				Code:    "DOCUMENT-005",
				Message: "A document with same url s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz has been found in the output of a different task.",
				Path:    "case[0].tasks[0].output_documents[2]",
			},
			{
				Code:    "DOCUMENT-005",
				Message: "A document with same url s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz has been found in the output of a different task.",
				Path:    "case[0].tasks[0].output_documents[3]",
			},
			{
				Code:    "DOCUMENT-002",
				Message: "No document can be found on the URL s3://test-bucket/CASE-12345.recal.crai for case 0 - task 0 - output document 4.",
				Path:    "case[0].tasks[0].output_documents[4]",
			},
			{
				Code:    "DOCUMENT-008",
				Message: "Duplicate output document with URL s3://test-bucket/CASE-12345.recal.crai found.",
				Path:    "case[0].tasks[0].output_documents[4]",
			},
		}
		assertBatchProcessing(t, db, id, "ERROR", false, "user123", infos, warnings, errors)
	})
}

func Test_ProcessBatch_Case_Optional_Values_NoError(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_optional_values")
		payload, _ := json.Marshal(scenario.Cases)

		// Create document to validate size and hash checks
		_ = createDocument(context, client, "test-bucket", "existing_document.recal.crai", []byte("test content"))

		// Get count of cases existing in DB
		var before int64
		db.Table("cases").Count(&before)

		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")
		assertBatchProcessing(t, db, id, "SUCCESS", false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var after int64
		db.Table("cases").Count(&after)
		assert.Equal(t, before+2, after)
	})
}

func Test_ProcessBatch_Case_Aliquots_Permutations(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("cases_aliquots_permutations")
		payload, _ := json.Marshal(scenario.Cases)

		// Create document to validate size and hash checks
		_ = createDocument(context, client, "test-bucket", "existing_document.recal.crai", []byte("test content"))

		id := insertPayloadAndProcessBatch(db, string(payload), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-10-10")
		assertBatchProcessing(t, db, id, "SUCCESS", false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)
	})
}

func Test_ProcessBatch_Case_Not_Dry_Run_Empty_Tasks(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		payload := createBaseCasePayload("Not_Dry_Run_No_Tasks")
		payload[0].Tasks = []*types.CaseTaskBatch{}

		case0 := *payload[0]

		payload = append(payload, &case0)

		payload[1].SubmitterCaseId = "Not_Dry_Run_No_Task_ReUse_SequencingExperiments_From_Existing_Case"
		payload[1].Tasks = []*types.CaseTaskBatch{}
		payload[1].SequencingExperiments = []*types.CaseSequencingExperimentBatch{
			{
				Aliquot:                "NA12892",
				SampleOrganizationCode: "CQGC",
				SubmitterSampleId:      "S13224",
			},
			{
				Aliquot:                "NA12891",
				SampleOrganizationCode: "CQGC",
				SubmitterSampleId:      "S13225",
			},
			{
				Aliquot:                "NA12878",
				SampleOrganizationCode: "CQGC",
				SubmitterSampleId:      "S13226",
			},
		}
		payload[1].Patients = []*types.CasePatientBatch{
			{
				AffectedStatusCode:      "affected",
				SubmitterPatientId:      "MRN-283775",
				PatientOrganizationCode: "CHUSJ",
				RelationToProbandCode:   "proband",
			},
			{
				AffectedStatusCode:      "affected",
				SubmitterPatientId:      "MRN-283774",
				PatientOrganizationCode: "CHUSJ",
				RelationToProbandCode:   "father",
			},
			{
				AffectedStatusCode:      "affected",
				SubmitterPatientId:      "MRN-283773",
				PatientOrganizationCode: "CHUSJ",
				RelationToProbandCode:   "mother",
			},
		}

		createDocumentsForBatch(context, client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var ca0 []*types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "Not_Dry_Run_No_Tasks").Find(&ca0)

		assert.NotNil(t, ca0)
		assert.Len(t, ca0, 1)
		assert.GreaterOrEqual(t, ca0[0].ID, 1000)

		var ca1 []*types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "Not_Dry_Run_No_Task_ReUse_SequencingExperiments_From_Existing_Case").Find(&ca1)

		assert.NotNil(t, ca1)
		assert.Len(t, ca1, 1)
		assert.GreaterOrEqual(t, ca1[0].ID, 1000)

		var chse []*types.CaseHasSequencingExperiment
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", ca1[0].ID).Find(&chse)
		assert.Len(t, chse, 3)

		var tc []*types.TaskContext
		db.Table("task_context").Where("case_id = ?", ca0[0].ID).Find(&tc)
		assert.Len(t, tc, 0)

		db.Table("task_context").Where("case_id = ?", ca1[0].ID).Find(&tc)
		assert.Len(t, tc, 0)
	})
}

func Test_ProcessBatch_Case_Exomiser_TaskContext(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		scenario, _ := testutils.LoadScenario("fix_sjra_1218")
		createDocumentsForBatch(context, client, scenario.Cases)
		payloadBytes, _ := json.Marshal(scenario.Cases)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var ca *types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "FIX-SJRA-1218").First(&ca)

		var tc []*types.TaskContext
		db.Table("task_context").Where("case_id = ?", ca.ID).Find(&tc)
		assert.Len(t, tc, 4)

		// Retrieve the exomiser task from the linked case_id in task_context
		var exo *types.Task
		db.Table("task").Where("id = ?", tc[0].TaskID).First(&exo)
		assert.Equal(t, "exomiser", exo.TaskTypeCode)
		assert.Equal(t, "Dragen", exo.PipelineName)
		assert.Equal(t, "4.4.4", exo.PipelineVersion)
		assert.Equal(t, "GRch38", exo.GenomeBuild)

		// Retrieve the radiant_germline_annotation task from the linked case_id in task_context
		var rGA *types.Task
		db.Table("task").Where("id = ?", tc[2].TaskID).First(&rGA)
		assert.Equal(t, "radiant_germline_annotation", rGA.TaskTypeCode)
		assert.Equal(t, "Dragen", rGA.PipelineName)
		assert.Equal(t, "4.4.4", rGA.PipelineVersion)
		assert.Equal(t, "GRch38", rGA.GenomeBuild)
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
