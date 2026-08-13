package main

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func createSequencingRequestCasePayload(t *testing.T) []*types.CaseBatch {
	t.Helper()
	scenario, err := testutils.LoadScenario("cases_sequencing_requests")
	require.NoError(t, err)
	return scenario.Cases
}

func fetchSequencingRequests(t *testing.T, db *gorm.DB, caseID int) []types.SequencingRequest {
	t.Helper()
	var requests []types.SequencingRequest
	require.NoError(t, db.Table("sequencing_request").Where("case_id = ?", caseID).Order("id asc").Find(&requests).Error)
	return requests
}

// The order-time case: three requests, no sequencing experiment, no task. This is what QLIN posts
// the moment the clinician orders, and what had no representation before.
func Test_ProcessBatch_Case_SequencingRequests_AtOrderTime(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		payload := createSequencingRequestCasePayload(t)
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CreateCaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var c types.Case
		require.NoError(t, db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE-SEQREQ-TRIO").First(&c).Error)
		assert.Equal(t, "Dr. Supervisor", c.Supervisor)

		requests := fetchSequencingRequests(t, db, c.ID)
		require.Len(t, requests, 3)

		bySubmitterID := map[string]types.SequencingRequest{}
		for _, r := range requests {
			bySubmitterID[r.SubmitterSequencingRequestID] = r
			assert.Equal(t, types.DefaultTenantCode, r.TenantCode)
			assert.NotZero(t, r.PatientID)
		}
		assert.Equal(t, "submitted", bySubmitterID["SR-PROBAND"].StatusCode)
		assert.Equal(t, "draft", bySubmitterID["SR-MOTHER"].StatusCode)
		assert.NotEqual(t, bySubmitterID["SR-PROBAND"].ServiceID, bySubmitterID["SR-MOTHER"].ServiceID,
			"the mother was ordered an exome, the proband a genome")

		// Nothing has been sequenced yet.
		var links int64
		db.Table("case_has_sequencing_experiment").Where("case_id = ?", c.ID).Count(&links)
		assert.Zero(t, links)
	})
}

// Re-posting the same payload must update the requests, not duplicate them: update_case resends
// the whole body, so this is the normal case rather than an edge case.
func Test_ProcessBatch_Case_SequencingRequests_ResubmissionDoesNotDuplicate(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		payload := createSequencingRequestCasePayload(t)
		payload[0].SubmitterCaseId = "CASE-SEQREQ-RESUBMIT"
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CreateCaseBatchType, false, "user123", "2025-12-04")
		assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var c types.Case
		require.NoError(t, db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE-SEQREQ-RESUBMIT").First(&c).Error)
		before := fetchSequencingRequests(t, db, c.ID)
		require.Len(t, before, 3)

		// The second POST is skipped as a duplicate case (CASE-001), so drive the update path.
		update := []*types.UpdateCaseBatch{{
			ProjectCode:                payload[0].ProjectCode,
			SubmitterCaseId:            payload[0].SubmitterCaseId,
			Type:                       payload[0].Type,
			StatusCode:                 payload[0].StatusCode,
			DiagnosticLabCode:          payload[0].DiagnosticLabCode,
			PrimaryConditionCodeSystem: payload[0].PrimaryConditionCodeSystem,
			PrimaryConditionValue:      payload[0].PrimaryConditionValue,
			PriorityCode:               payload[0].PriorityCode,
			CategoryCode:               payload[0].CategoryCode,
			AnalysisCode:               payload[0].AnalysisCode,
			ResolutionStatusCode:       payload[0].ResolutionStatusCode,
			OrderingOrganizationCode:   payload[0].OrderingOrganizationCode,
			OrderingPhysician:          payload[0].OrderingPhysician,
			Patients:                   payload[0].Patients,
			SequencingRequests:         payload[0].SequencingRequests,
		}}
		update[0].SequencingRequests[0].StatusCode = "completed"
		updateBytes, _ := json.Marshal(update)

		updateID := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-05")
		assertBatchProcessing(t, db, updateID, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		after := fetchSequencingRequests(t, db, c.ID)
		require.Len(t, after, 3, "the natural key (case_id, submitter_sequencing_request_id) must upsert")
		assert.Equal(t, before[0].ID, after[0].ID)
		assert.Equal(t, "completed", after[0].StatusCode)
	})
}

// Delivery: the lab produced the proband's run, and the PATCH names the request it fulfills. The
// other two requests stay pending.
func Test_ProcessBatch_PatchCase_LinksSequencingExperimentToRequest(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		ctx, client, db := env.Ctx, env.MinIO.Client, env.Postgres
		const submitterCaseId = "CASE-SEQREQ-DELIVERY"

		// The base case carries the sequencing experiment (aliquot NA12891) the PATCH attaches.
		seedBaseCase(t, ctx, client, db, submitterCaseId)

		var c types.Case
		require.NoError(t, db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, submitterCaseId).First(&c).Error)

		// The request itself is posted through the update path, since the case already exists.
		update := []*types.UpdateCaseBatch{{
			ProjectCode:              "N1",
			SubmitterCaseId:          submitterCaseId,
			Type:                     "germline",
			StatusCode:               "in_progress",
			DiagnosticLabCode:        "LDM-CHUSJ",
			CategoryCode:             "postnatal",
			AnalysisCode:             "WGA",
			OrderingOrganizationCode: "CHUSJ",
			Patients: []*types.CasePatientBatch{
				{SubmitterPatientId: "MRN-283773", PatientOrganizationCode: "CHUSJ", AffectedStatusCode: "affected", RelationToProbandCode: "proband"},
			},
			SequencingRequests: []*types.CaseSequencingRequestBatch{
				{SubmitterSequencingRequestId: "SR-DELIVERY", ServiceCode: "75022", SubmitterPatientId: "MRN-283773", PatientOrganizationCode: "CHUSJ", StatusCode: "submitted"},
			},
		}}
		updateBytes, _ := json.Marshal(update)
		updateID := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-05")
		assertBatchProcessing(t, db, updateID, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		requests := fetchSequencingRequests(t, db, c.ID)
		require.Len(t, requests, 1)

		patches := []*types.CaseBatchPatch{{
			ProjectCode:     "N1",
			SubmitterCaseId: submitterCaseId,
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{Aliquot: "NA12891", SampleOrganizationCode: "CQGC", SubmitterSampleId: "S13225", SubmitterSequencingRequestId: "SR-DELIVERY"},
			},
		}}
		patchBytes, _ := json.Marshal(patches)
		patchID := insertPayloadAndProcessBatch(db, string(patchBytes), types.BatchStatusPending, types.PatchCaseBatchType, false, "user123", "2025-12-06")
		assertBatchProcessing(t, db, patchID, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

		var seqExp types.SequencingExperiment
		require.NoError(t, db.Table("sequencing_experiment").Where("aliquot = ?", "NA12891").First(&seqExp).Error)
		require.NotNil(t, seqExp.SequencingRequestID, "the delivered experiment must claim the request it fulfills")
		assert.Equal(t, requests[0].ID, *seqExp.SequencingRequestID)
	})
}

// An experiment naming a request that does not exist on the case is SEQREQ-006.
func Test_ProcessBatch_PatchCase_UnknownSequencingRequest(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		ctx, client, db := env.Ctx, env.MinIO.Client, env.Postgres
		const submitterCaseId = "CASE-SEQREQ-UNKNOWN"

		seedBaseCase(t, ctx, client, db, submitterCaseId)

		patches := []*types.CaseBatchPatch{{
			ProjectCode:     "N1",
			SubmitterCaseId: submitterCaseId,
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{Aliquot: "NA12891", SampleOrganizationCode: "CQGC", SubmitterSampleId: "S13225", SubmitterSequencingRequestId: "SR-DOES-NOT-EXIST"},
			},
		}}
		patchBytes, _ := json.Marshal(patches)
		patchID := insertPayloadAndProcessBatch(db, string(patchBytes), types.BatchStatusPending, types.PatchCaseBatchType, false, "user123", "2025-12-06")

		expectedErrors := []types.BatchMessage{{
			Code:    SequencingRequestNotFoundInCase,
			Message: `Sequencing request "SR-DOES-NOT-EXIST" named by sequencing experiment (CQGC / S13225 / NA12891) does not exist on this case.`,
			Path:    fmt.Sprintf("%s[0].sequencing_experiments[0]", types.PatchCaseBatchType),
		}}
		assertBatchProcessing(t, db, patchID, types.BatchStatusError, false, "user123", emptyMsgs, emptyMsgs, expectedErrors)
	})
}

// An unknown service code fails validation, which is the failure mode a missing seed produces.
func Test_ProcessBatch_Case_SequencingRequests_UnknownServiceCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		payload := createSequencingRequestCasePayload(t)
		payload[0].SubmitterCaseId = "CASE-SEQREQ-BADSERVICE"
		payload[0].SequencingRequests[0].ServiceCode = "WGA" // a case-level analysis code
		payloadBytes, _ := json.Marshal(payload)

		id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CreateCaseBatchType, false, "user123", "2025-12-04")

		expectedErrors := []types.BatchMessage{{
			Code:    SequencingRequestUnknownService,
			Message: `Sequencing service "WGA" for create_case 0 - sequencing request 0 does not exist.`,
			Path:    "create_case[0].sequencing_requests[0]",
		}}
		assertBatchProcessing(t, db, id, types.BatchStatusError, false, "user123", emptyMsgs, emptyMsgs, expectedErrors)

		var count int64
		db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, "CASE-SEQREQ-BADSERVICE").Count(&count)
		assert.Zero(t, count, "a failed batch persists nothing")
	})
}
