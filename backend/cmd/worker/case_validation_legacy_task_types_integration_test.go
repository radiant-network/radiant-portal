package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// RAD-116 removed the exomiser and exomiser_cnv task types: the Exomiser files are outputs of the
// annotation tasks. Their task_type rows are gone, so every case batch rejects them with TASK-001.

func legacyExomiserTask(typeCode, outURL string) *types.CaseTaskBatch {
	size := int64(11)
	return &types.CaseTaskBatch{
		TypeCode:        typeCode,
		Aliquots:        []string{"NA12891"},
		PipelineName:    "exomiser",
		PipelineVersion: "14.0.0",
		GenomeBuild:     "GRch38",
		OutputDocuments: []*types.OutputDocumentBatch{
			{
				DataCategoryCode: "genomic",
				DataTypeCode:     "exomiser",
				FormatCode:       "tsv",
				Name:             "variants.tsv",
				Size:             &size,
				Url:              outURL,
			},
		},
	}
}

func assertTaskTypeRejected(t *testing.T, db *gorm.DB, id string, typeCode string) {
	t.Helper()
	batch := postgres.Batch{}
	db.Table("batch").Where("id = ?", id).Scan(&batch)
	assert.Equal(t, types.BatchStatusError, batch.Status)

	reason := fmt.Sprintf("invalid task type code `%s`", typeCode)
	assert.Condition(t, func() bool {
		for _, e := range batch.Report.Errors {
			if e.Code == "TASK-001" && strings.HasSuffix(e.Path, ".type_code") && strings.Contains(e.Message, reason) {
				return true
			}
		}
		return false
	}, "expected a TASK-001 error with %q, got %v", reason, batch.Report.Errors)
}

func assertCreateCaseRejectsTaskType(t *testing.T, typeCode string) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		submitterCaseId := "CASE-POST-" + typeCode
		payload := createBaseCasePayload(submitterCaseId)
		payload[0].Tasks = append(payload[0].Tasks, legacyExomiserTask(typeCode, "s3://test-bucket/"+submitterCaseId+".variants.tsv"))
		createDocumentsForBatch(env.Ctx, env.ObjectStore.Client, payload)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(env.Postgres, string(payloadBytes), types.BatchStatusPending, types.CreateCaseBatchType, false, "user123", "2025-12-04")
		assertTaskTypeRejected(t, env.Postgres, id, typeCode)
	})
}

func assertPatchCaseRejectsTaskType(t *testing.T, typeCode string) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		ctx, client, db := env.Ctx, env.ObjectStore.Client, env.Postgres
		submitterCaseId := "CASE-PATCH-" + typeCode
		seedBaseCase(t, ctx, client, db, submitterCaseId)

		patches := patchCaseWithTask(submitterCaseId, "N1", "s3://test-bucket/unused.cram", "unused.cram", 11)
		patches[0].Tasks = []*types.CaseTaskBatch{legacyExomiserTask(typeCode, "s3://test-bucket/"+submitterCaseId+".variants.tsv")}
		uploadPatchTaskDocuments(ctx, client, patches)
		patchBytes, _ := json.Marshal(patches)

		id := insertPayloadAndProcessBatch(db, string(patchBytes), types.BatchStatusPending, types.PatchCaseBatchType, false, "user123", "2025-12-05")
		assertTaskTypeRejected(t, db, id, typeCode)
	})
}

func assertUpdateCaseRejectsTaskType(t *testing.T, typeCode string) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, ObjectStore: true}, func(t *testing.T, env *testutils.Env) {
		ctx, client, db := env.Ctx, env.ObjectStore.Client, env.Postgres
		submitterCaseId := "CASE-PUT-" + typeCode
		seedBaseCase(t, ctx, client, db, submitterCaseId)

		updates := updateCaseForBase(submitterCaseId)
		updates[0].Tasks = []*types.CaseTaskBatch{legacyExomiserTask(typeCode, "s3://test-bucket/"+submitterCaseId+".variants.tsv")}
		uploadPatchTaskDocuments(ctx, client, []types.CaseBatchPatch{{Tasks: updates[0].Tasks}})
		updateBytes, _ := json.Marshal(updates)

		id := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-06")
		assertTaskTypeRejected(t, db, id, typeCode)
	})
}

func Test_ProcessBatch_CreateCase_ExomiserTaskType_Rejected(t *testing.T) {
	assertCreateCaseRejectsTaskType(t, "exomiser")
}

func Test_ProcessBatch_CreateCase_ExomiserCNVTaskType_Rejected(t *testing.T) {
	assertCreateCaseRejectsTaskType(t, "exomiser_cnv")
}

func Test_ProcessBatch_PatchCase_ExomiserTaskType_Rejected(t *testing.T) {
	assertPatchCaseRejectsTaskType(t, "exomiser")
}

func Test_ProcessBatch_PatchCase_ExomiserCNVTaskType_Rejected(t *testing.T) {
	assertPatchCaseRejectsTaskType(t, "exomiser_cnv")
}

func Test_ProcessBatch_UpdateCase_ExomiserTaskType_Rejected(t *testing.T) {
	assertUpdateCaseRejectsTaskType(t, "exomiser")
}

func Test_ProcessBatch_UpdateCase_ExomiserCNVTaskType_Rejected(t *testing.T) {
	assertUpdateCaseRejectsTaskType(t, "exomiser_cnv")
}
