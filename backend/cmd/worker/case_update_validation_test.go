package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// Unit tests for validateUpdateCaseRecord — the per-record validator the worker runs
// when processing a PUT /cases/batch (update_case batch type). Mocks reuse
// CaseValidationMockRepo and CodesMockRepo defined in case_validation_test.go.

func newCacheUpdate(repo *CaseValidationMockRepo) (*batchval.BatchValidationCache, *batchval.BatchValidationContext) {
	ctx := &batchval.BatchValidationContext{
		ProjectRepo:   repo,
		CasesRepo:     repo,
		OrgRepo:       repo,
		PatientRepo:   repo,
		ValueSetsRepo: &CodesMockRepo{},
	}
	return batchval.NewBatchValidationCache(ctx), ctx
}

func validCaseUpdate() types.UpdateCaseBatch {
	return types.UpdateCaseBatch{
		ProjectCode:              "PROJ-1",
		SubmitterCaseId:          "CASE-1",
		Type:                     "germline",
		StatusCode:               "in_progress",
		DiagnosticLabCode:        "LAB-2",
		CategoryCode:             "postnatal",
		AnalysisCode:             "WGA",
		OrderingOrganizationCode: "LAB-1",
		Patients: []*types.CasePatientBatch{{
			AffectedStatusCode:      "affected",
			SubmitterPatientId:      "PAT-1",
			PatientOrganizationCode: "LAB-1",
			RelationToProbandCode:   "proband",
		}},
	}
}

func Test_validateUpdateCaseRecord_Success(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*types.Case, error) {
			if submitterCaseId == "CASE-1" && projectId == 42 {
				return &types.Case{ID: 100, SubmitterCaseID: "CASE-1", ProjectID: projectId}, nil
			}
			return nil, nil
		},
	}
	cache, ctx := newCacheUpdate(mockRepo)

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, validCaseUpdate(), 0)
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
	assert.False(t, rec.Skipped)
	assert.NotNil(t, rec.CaseID)
	assert.Equal(t, 100, *rec.CaseID)
	assert.NotNil(t, rec.Record)
	assert.Equal(t, rec.CaseID, rec.Record.CaseID)
}

func Test_validateUpdateCaseRecord_UnknownProject(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{}
	cache, ctx := newCacheUpdate(mockRepo)

	update := validCaseUpdate()
	update.ProjectCode = "PROJ-UNKNOWN"

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, update, 0)
	assert.NoError(t, err)
	assert.True(t, hasErrorCode(rec.Errors, CaseUnknownProject))
	assert.Nil(t, rec.CaseID)
}

func Test_validateUpdateCaseRecord_CaseNotFound(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*types.Case, error) {
			return nil, nil // case missing
		},
	}
	cache, ctx := newCacheUpdate(mockRepo)

	update := validCaseUpdate()
	update.SubmitterCaseId = "CASE-MISSING"

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, update, 0)
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, CaseNotFoundForUpdate, rec.Errors[0].Code)
	assert.Equal(t, "update_case[0]", rec.Errors[0].Path)
	assert.True(t, rec.Skipped)
	assert.Nil(t, rec.CaseID)
}

func Test_validateUpdateCaseRecord_PatientNotFound(t *testing.T) {
	mockRepo := caseExistsMock()
	cache, ctx := newCacheUpdate(mockRepo)

	update := validCaseUpdate()
	update.Patients = []*types.CasePatientBatch{{
		AffectedStatusCode:      "affected",
		SubmitterPatientId:      "PAT-NOT-EXIST",
		PatientOrganizationCode: "LAB-1",
		RelationToProbandCode:   "proband",
	}}

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, update, 0)
	assert.NoError(t, err)
	assert.True(t, hasErrorCode(rec.Errors, PatientNotFound), "expected %s, got %+v", PatientNotFound, rec.Errors)
}

func Test_validateUpdateCaseRecord_UnknownDiagnosticLab(t *testing.T) {
	mockRepo := caseExistsMock()
	cache, ctx := newCacheUpdate(mockRepo)

	update := validCaseUpdate()
	update.DiagnosticLabCode = "LAB-UNKNOWN"

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, update, 0)
	assert.NoError(t, err)
	assert.True(t, hasErrorCode(rec.Errors, CaseUnknownDiagnosticLab), "expected %s, got %+v", CaseUnknownDiagnosticLab, rec.Errors)
}

func Test_validateUpdateCaseRecord_UnknownAnalysisCode(t *testing.T) {
	mockRepo := caseExistsMock()
	cache, ctx := newCacheUpdate(mockRepo)

	update := validCaseUpdate()
	update.AnalysisCode = "UNKNOWN-CODE"

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, update, 0)
	assert.NoError(t, err)
	assert.True(t, hasErrorCode(rec.Errors, CaseUnknownAnalysisCode), "expected %s, got %+v", CaseUnknownAnalysisCode, rec.Errors)
}

func Test_validateUpdateCaseRecord_UnknownOrderingOrganization(t *testing.T) {
	mockRepo := caseExistsMock()
	cache, ctx := newCacheUpdate(mockRepo)

	update := validCaseUpdate()
	update.OrderingOrganizationCode = "ORG-UNKNOWN"

	rec, err := validateUpdateCaseRecord(t.Context(), ctx, cache, update, 0)
	assert.NoError(t, err)
	assert.True(t, hasErrorCode(rec.Errors, CaseUnknownOrderingOrganization), "expected %s, got %+v", CaseUnknownOrderingOrganization, rec.Errors)
}
