package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type CaseValidationMockRepo struct{}

func (m *CaseValidationMockRepo) GetProjectByCode(code string) (*types.Project, error) {
	if code == "PROJ-1" {
		return &types.Project{ID: 42, Code: code, Name: "PROJ-1", Description: "Project #1"}, nil
	}
	return nil, nil
}

func Test_GetResourceType_OK(t *testing.T) {
	record := CaseValidationRecord{}
	assert.Equal(t, "case", record.GetResourceType())
}

func Test_preFetchValidationInfo_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	record := CaseValidationRecord{}
	record.Case.ProjectCode = "PROJ-1"
	err := record.preFetchValidationInfo(&mockRepo)
	assert.NoError(t, err)
	assert.Equal(t, 42, *record.ProjectID)
}

func Test_preFetchValidationInfo_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	record := CaseValidationRecord{}
	err := record.preFetchValidationInfo(&mockRepo)
	assert.NoError(t, err)
	assert.Nil(t, record.ProjectID)
}

func Test_validateCaseBatch_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	vr, err := validateCaseBatch([]types.CaseBatch{
		{
			ProjectCode:                "PROJ-1",
			SubmitterCaseId:            "CASE-1",
			Type:                       "germline",
			StatusCode:                 "in_progress",
			DiagnosticLabCode:          "LAB-1",
			PrimaryConditionCodeSystem: "MONDO",
			PrimaryConditionValue:      "0001234",
			PriorityCode:               "routine",
			CategoryCode:               "postnatal",
			Patients:                   []*types.CasePatientBatch{},
			SequencingExperiments:      []*types.CaseSequencingExperimentBatch{},
		},
	}, &mockRepo)
	assert.NoError(t, err)
	assert.Empty(t, vr[0].Infos)
	assert.Empty(t, vr[0].Warnings)
	assert.Empty(t, vr[0].Errors)
}

func Test_validateCaseBatch_Duplicates(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	vr, err := validateCaseBatch([]types.CaseBatch{
		{
			ProjectCode:                "PROJ-1",
			SubmitterCaseId:            "CASE-1",
			Type:                       "germline",
			StatusCode:                 "in_progress",
			DiagnosticLabCode:          "LAB-1",
			PrimaryConditionCodeSystem: "MONDO",
			PrimaryConditionValue:      "0001234",
			PriorityCode:               "routine",
			CategoryCode:               "postnatal",
			Patients:                   []*types.CasePatientBatch{},
			SequencingExperiments:      []*types.CaseSequencingExperimentBatch{},
		},
		{
			ProjectCode:                "PROJ-1",
			SubmitterCaseId:            "CASE-1",
			Type:                       "somatic",
			StatusCode:                 "completed",
			DiagnosticLabCode:          "LAB-2",
			PrimaryConditionCodeSystem: "MONDO",
			PrimaryConditionValue:      "0001235",
			PriorityCode:               "routine",
			CategoryCode:               "postnatal",
			Patients:                   []*types.CasePatientBatch{},
			SequencingExperiments:      []*types.CaseSequencingExperimentBatch{},
		},
	}, &mockRepo)
	assert.NoError(t, err)
	assert.Empty(t, vr[0].Infos)
	assert.Empty(t, vr[0].Warnings)
	assert.Empty(t, vr[0].Errors)
	assert.Empty(t, vr[1].Infos)
	assert.Empty(t, vr[1].Warnings)
	assert.Equal(t, vr[1].Errors[0].Code, "CASE-001")
	assert.Equal(t, vr[1].Errors[0].Message, "Case (PROJ-1 / CASE-1) appears multiple times in the batch.")
	assert.Equal(t, vr[1].Errors[0].Path, "case[1]")
}
