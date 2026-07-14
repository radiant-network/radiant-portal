package main

import (
	"encoding/json"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// updateCaseForBase builds a PUT /cases/batch payload replacing the base case's scalar
// fields and clinical patient data. It keeps the proband (MRN-283773 / CHUSJ) so the
// existing family/obs_categorical/obs_string/family_history rows can be asserted replaced.
func updateCaseForBase(submitterCaseId string) []types.UpdateCaseBatch {
	return []types.UpdateCaseBatch{
		{
			ProjectCode:              "N1",
			SubmitterCaseId:          submitterCaseId,
			Type:                     "germline",
			StatusCode:               "completed",
			DiagnosticLabCode:        "LDM-CHUSJ",
			CategoryCode:             "postnatal",
			AnalysisCode:             "WGA",
			OrderingOrganizationCode: "CHUSJ",
			Note:                     "updated by PUT",
			Patients: []*types.CasePatientBatch{
				{
					SubmitterPatientId:      "MRN-283773",
					PatientOrganizationCode: "CHUSJ",
					RelationToProbandCode:   "proband",
					AffectedStatusCode:      "affected",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{Code: "phenotype", System: "HPO", Value: "TEST:99999", OnsetCode: "childhood", InterpretationCode: "positive"},
					},
					// observations_text and family_history are intentionally omitted —
					// the previously seeded rows must be gone after the update.
				},
			},
		},
	}
}

// Happy path: a PUT that replaces scalars and clinical data updates the case row and
// swaps out family/obs_categorical/obs_string/family_history, while leaving the
// sequencing experiment attachment and task untouched.
func Test_ProcessBatch_UpdateCase_ReplacesClinicalData_LeavesSeqExpAndTasks(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		ctx, client, db := env.Ctx, env.MinIO.Client, env.Postgres
		const submitterCaseId = "CASE-UPDATE-A"

		seedBaseCase(t, ctx, client, db, submitterCaseId)

		var before types.Case
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, submitterCaseId).First(&before)
		assert.NotZero(t, before.ID)

		var seqExpsBefore []types.CaseHasSequencingExperiment
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", before.ID).Find(&seqExpsBefore)
		assert.NotEmpty(t, seqExpsBefore)

		// The base scenario's task type (alignment_germline_variant_calling) is not
		// case-related, so task_context.case_id is NULL — count via the sequencing
		// experiment instead (mirrors case_validation_patch_integration_test.go).
		var tasksBefore int64
		db.Table("task_context").Where("sequencing_experiment_id = ?", seqExpsBefore[0].SequencingExperimentID).Count(&tasksBefore)
		assert.NotZero(t, tasksBefore)

		updates := updateCaseForBase(submitterCaseId)
		updateBytes, _ := json.Marshal(updates)

		id := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-06")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var after types.Case
		db.Table("cases").Where("id = ?", before.ID).First(&after)
		assert.Equal(t, "completed", after.StatusCode)
		assert.Equal(t, "updated by PUT", after.Note)

		var obsCat []*types.ObsCategorical
		db.Table("obs_categorical").Where("case_id = ?", before.ID).Find(&obsCat)
		assert.Len(t, obsCat, 1)
		assert.Equal(t, "TEST:99999", obsCat[0].CodeValue)

		var obsStr []*types.ObsString
		db.Table("obs_string").Where("case_id = ?", before.ID).Find(&obsStr)
		assert.Empty(t, obsStr, "observations_text omitted from the PUT body must be gone")

		var famHist []*types.FamilyHistory
		db.Table("family_history").Where("case_id = ?", before.ID).Find(&famHist)
		assert.Empty(t, famHist, "family_history omitted from the PUT body must be gone")

		var family []*types.Family
		db.Table("family").Where("case_id = ?", before.ID).Find(&family)
		assert.Len(t, family, 1)
		assert.Equal(t, "proband", family[0].RelationshipToProbandCode)

		// Sequencing experiment attachments and tasks are untouched by the PUT.
		var seqExpsAfter []types.CaseHasSequencingExperiment
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", before.ID).Find(&seqExpsAfter)
		assert.Equal(t, seqExpsBefore, seqExpsAfter)

		var tasksAfter int64
		db.Table("task_context").Where("sequencing_experiment_id = ?", seqExpsBefore[0].SequencingExperimentID).Count(&tasksAfter)
		assert.Equal(t, tasksBefore, tasksAfter)
	})
}

// A PUT against a case that does not exist fails the whole batch atomically with
// CASE-013 — no case scalar update, no clinical replace.
func Test_ProcessBatch_UpdateCase_MissingCase_NoPersistence(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		const submitterCaseId = "CASE-UPDATE-MISSING"

		// Nothing seeded — no case with this submitter_case_id exists.
		updates := updateCaseForBase(submitterCaseId)
		updateBytes, _ := json.Marshal(updates)

		errors := []types.BatchMessage{
			{
				Code:    CaseNotFoundForUpdate,
				Message: "Case (N1 / CASE-UPDATE-MISSING) does not exist, cannot update.",
				Path:    "update_case[0]",
			},
		}
		id := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-06")
		assertBatchProcessing(t, db, id, types.BatchStatusError, false, "user123", emptyMsgs, emptyMsgs, errors)

		var count int64
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, submitterCaseId).Count(&count)
		assert.Zero(t, count)
	})
}
