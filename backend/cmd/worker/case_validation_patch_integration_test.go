package main

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// patchCaseWithTask builds a PATCH /cases/batch payload that re-sends the base
// case's sequencing experiment (NA12891 / S13225 / CQGC, as seeded by the "base"
// scenario) and attaches one new output-only task on that aliquot.
//
// type_code is alignment_germline_variant_calling: single-aliquot, NOT case-related
// and does NOT require input documents — so a single output document is a complete,
// valid task with no extra fixtures.
func patchCaseWithTask(submitterCaseId, projectCode, outURL, outName string, outSize int64) []types.CaseBatchPatch {
	size := outSize
	return []types.CaseBatchPatch{
		{
			ProjectCode:     projectCode,
			SubmitterCaseId: submitterCaseId,
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{Aliquot: "NA12891", SampleOrganizationCode: "CQGC", SubmitterSampleId: "S13225"},
			},
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode:        "alignment_germline_variant_calling",
					Aliquots:        []string{"NA12891"},
					PipelineName:    "Dragen",
					PipelineVersion: "4.4.4",
					GenomeBuild:     "GRch38",
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							DataCategoryCode: "genomic",
							DataTypeCode:     "alignment",
							FormatCode:       "cram",
							Name:             outName,
							Size:             &size,
							Url:              outURL,
						},
					},
				},
			},
		},
	}
}

// uploadPatchTaskDocuments stages each task's output document in MinIO (with the
// declared size) and back-fills the hash the worker will compute on HeadObject —
// mirrors createDocumentsForBatch for the PATCH payload shape.
func uploadPatchTaskDocuments(ctx context.Context, client *minio.Client, patches []types.CaseBatchPatch) {
	store, _ := utils.NewS3Store()
	for _, p := range patches {
		for _, task := range p.Tasks {
			for _, out := range task.OutputDocuments {
				content := make([]byte, int(*out.Size))
				for i := range content {
					content[i] = 'a'
				}
				location, _ := utils.ExtractS3BucketAndKey(out.Url)
				_ = createDocument(ctx, client, location.Bucket, location.Key, content)
				metadata, _ := store.GetMetadata(out.Url)
				out.Hash = metadata.Hash
			}
		}
	}
}

// seedBaseCase creates a case (+ its sequencing experiment, attachment and initial
// task) via a POST /cases/batch so a subsequent PATCH has something to attach to.
func seedBaseCase(t *testing.T, ctx context.Context, client *minio.Client, db *gorm.DB, submitterCaseId string) {
	t.Helper()
	base := createBaseCasePayload(submitterCaseId)
	createDocumentsForBatch(ctx, client, base)
	baseBytes, _ := json.Marshal(base)
	id := insertPayloadAndProcessBatch(db, string(baseBytes), types.BatchStatusPending, types.CaseBatchType, false, "user123", "2025-12-04")
	assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)
}

// Happy path: a PATCH that carries a sequencing experiment + a new task persists
// the task, its output document and the task_has_document link.
func Test_ProcessBatch_PatchCase_AttachTask_Success(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		const submitterCaseId = "CASE-PATCH-A"
		const outURL = "s3://test-bucket/CASE-PATCH-A.patch.recal.cram"
		const outName = "CASE-PATCH-A.patch.recal.cram"

		seedBaseCase(t, ctx, client, db, submitterCaseId)

		patches := patchCaseWithTask(submitterCaseId, "N1", outURL, outName, 11)
		uploadPatchTaskDocuments(ctx, client, patches)
		patchBytes, _ := json.Marshal(patches)

		patchID := insertPayloadAndProcessBatch(db, string(patchBytes), types.BatchStatusPending, types.PatchCaseBatchType, false, "user123", "2025-12-05")
		assertBatchProcessing(t, db, patchID, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		// The patch's output document was persisted...
		var doc types.Document
		db.Table("document").Where("url = ?", outURL).First(&doc)
		assert.NotZero(t, doc.ID, "patch output document should be persisted")
		assert.Equal(t, outName, doc.Name)
		assert.Equal(t, "alignment", doc.DataTypeCode)
		assert.Equal(t, "cram", doc.FileFormatCode)

		// ...linked as an output of a freshly created task carrying the patch's pipeline metadata.
		var thd types.TaskHasDocument
		db.Table("task_has_document").Where("document_id = ? AND type = ?", doc.ID, "output").First(&thd)
		assert.NotZero(t, thd.TaskID, "patch document should be linked to a task")

		var task types.Task
		db.Table("task").Where("id = ?", thd.TaskID).First(&task)
		assert.Equal(t, "alignment_germline_variant_calling", task.TaskTypeCode)
		assert.Equal(t, "Dragen", task.PipelineName)
		assert.Equal(t, "4.4.4", task.PipelineVersion)
		assert.Equal(t, "GRch38", task.GenomeBuild)

		// The task is wired to the sequencing experiment via task_context.
		var tc types.TaskContext
		db.Table("task_context").Where("task_id = ?", task.ID).First(&tc)
		assert.NotZero(t, tc.SequencingExperimentID, "task_context should reference the sequencing experiment")
	})
}

// PATCH appends tasks; it does NOT dedup them. The base case already carries an
// alignment_germline_variant_calling task on NA12891 (from the POST seed); a PATCH that
// re-sends that experiment plus a same-type task on the same aliquot ends up with TWO such
// tasks (persistTask always CreateTask()s, there is no UNIQUE on document.url, and the
// task_context/task_has_document keys both include the fresh task_id). Two things are
// asserted here, and they pull in opposite directions on purpose:
//   - the experiment attachment IS idempotent (case_has_sequencing_experiment is ON CONFLICT
//     DO NOTHING), so re-sending the experiment adds no row;
//   - the task is NOT idempotent — it is appended, duplicating type_code + aliquot.
//
// This is Radiant's intended PATCH append semantics. The hybrid bridge must therefore avoid
// re-PATCHing the same tasks on a retry/re-import (Phase 2d idempotency) — Radiant will not
// dedup for it.
func Test_ProcessBatch_PatchCase_AppendsDuplicateTask_ExperimentAttachIdempotent(t *testing.T) {
	testutils.SequentialTestWithPostgresAndMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string, db *gorm.DB) {
		const submitterCaseId = "CASE-PATCH-B"
		const taskType = "alignment_germline_variant_calling" // same type the base scenario task uses
		const outURL = "s3://test-bucket/CASE-PATCH-B.patch.recal.cram"
		const outName = "CASE-PATCH-B.patch.recal.cram"

		seedBaseCase(t, ctx, client, db, submitterCaseId)

		var ca types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, submitterCaseId).First(&ca)
		assert.NotZero(t, ca.ID)

		// Resolve the experiment attached to this case, then count tasks wired to it via
		// task_context. We scope everything to THIS experiment and use relative deltas so the
		// test is immune to rows/ids other tests leave behind in the shared DB.
		var seqExpID int
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", ca.ID).Select("sequencing_experiment_id").Scan(&seqExpID)
		assert.NotZero(t, seqExpID, "base case should have its experiment attached")

		var attachedBefore, tasksBefore int64
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", ca.ID).Count(&attachedBefore)
		db.Table("task_context").Where("sequencing_experiment_id = ?", seqExpID).Count(&tasksBefore)

		patches := patchCaseWithTask(submitterCaseId, "N1", outURL, outName, 11)
		uploadPatchTaskDocuments(ctx, client, patches)
		patchBytes, _ := json.Marshal(patches)

		patchID := insertPayloadAndProcessBatch(db, string(patchBytes), types.BatchStatusPending, types.PatchCaseBatchType, false, "user123", "2025-12-05")
		assertBatchProcessing(t, db, patchID, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		// Experiment attach is idempotent: re-sending it adds no case_has_sequencing_experiment row.
		var attachedAfter int64
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", ca.ID).Count(&attachedAfter)
		assert.Equal(t, attachedBefore, attachedAfter, "re-attaching an existing experiment must not create a duplicate")

		// Task is NOT idempotent: a new task (hence a new task_context for the same experiment)
		// is appended even though an identical type_code + aliquot task already exists.
		var tasksAfter int64
		db.Table("task_context").Where("sequencing_experiment_id = ?", seqExpID).Count(&tasksAfter)
		assert.Equal(t, tasksBefore+1, tasksAfter, "PATCH appends the task (no dedup), so a duplicate type_code now exists for this experiment")

		// And the appended task's output document is its own row (no url dedup).
		var docs int64
		db.Table("document").Where("url = ?", outURL).Count(&docs)
		assert.Equal(t, int64(1), docs, "the appended task's output document is persisted")
	})
}
