package main

import (
	"strings"
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

func createString(length int) string {
	var result strings.Builder
	for range length {
		result.WriteString("a")
	}
	return result.String()
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

func Test_validateFamilyMemberCode_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother",
							Condition:        "diabetes",
						},
					},
				},
			},
		},
	}

	record.validateFamilyMemberCode(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateFamilyMemberCode_InvalidRegex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother123",
							Condition:        "diabetes",
						},
					},
				},
			},
		},
	}

	record.validateFamilyMemberCode(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].family_history[0].family_member_code", record.Errors[0].Path)
}

func Test_validateFamilyMemberCode_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: createString(101),
							Condition:        "diabetes",
						},
					},
				},
			},
		},
	}

	record.validateFamilyMemberCode(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Contains(t, record.Errors[0].Message, "maximum length allowed is 100")
	assert.Equal(t, "case[0].patients[0].family_history[0].family_member_code", record.Errors[0].Path)
}

func Test_validateFamilyMemberCode_MultipleErrors(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: createString(101) + "123",
							Condition:        "diabetes",
						},
					},
				},
			},
		},
	}

	record.validateFamilyMemberCode(0, 0)
	assert.Len(t, record.Errors, 2)
}

func Test_validateCondition_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother",
							Condition:        "Type-2 diabetes, high blood pressure.",
						},
					},
				},
			},
		},
	}

	record.validateCondition(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateCondition_InvalidRegex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother",
							Condition:        "diabetes@invalid",
						},
					},
				},
			},
		},
	}

	record.validateCondition(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].family_history[0].condition", record.Errors[0].Path)
}

func Test_validateCondition_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother",
							Condition:        createString(101),
						},
					},
				},
			},
		},
	}

	record.validateCondition(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].family_history[0].condition", record.Errors[0].Path)
}

func Test_validateFamilyHistory_NoHistory(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory:           []*types.FamilyHistoryBatch{},
				},
			},
		},
	}

	record.validateFamilyHistory(0)
	assert.Empty(t, record.Errors)
}

func Test_validateFamilyHistory_MultipleEntries(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother",
							Condition:        "diabetes",
						},
						{
							FamilyMemberCode: "father",
							Condition:        "heart disease",
						},
					},
				},
			},
		},
	}

	record.validateFamilyHistory(0)
	assert.Empty(t, record.Errors)
}

func Test_validateFamilyHistory_WithErrors(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "mother123",
							Condition:        "diabetes@invalid",
						},
						{
							FamilyMemberCode: createString(101),
							Condition:        createString(101),
						},
					},
				},
			},
		},
	}

	record.validateFamilyHistory(0)
	assert.Len(t, record.Errors, 4)
}

func Test_validateCasePatients_MultiplePatients(t *testing.T) {
	patients := []*types.CasePatientBatch{
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "PAT-1",
			FamilyHistory: []*types.FamilyHistoryBatch{
				{
					FamilyMemberCode: "mother",
					Condition:        "diabetes",
				},
			},
		},
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "PAT-2",
			FamilyHistory: []*types.FamilyHistoryBatch{
				{
					FamilyMemberCode: "father",
					Condition:        "heart disease",
				},
			},
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patients,
		},
	}

	err := record.validateCasePatients(patients)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCasePatients_WithValidationErrors(t *testing.T) {
	patients := []*types.CasePatientBatch{
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "PAT-1",
			FamilyHistory: []*types.FamilyHistoryBatch{
				{
					FamilyMemberCode: "invalid123",
					Condition:        "diabetes",
				},
			},
		},
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "PAT-2",
			FamilyHistory: []*types.FamilyHistoryBatch{
				{
					FamilyMemberCode: "father",
					Condition:        "invalid@condition",
				},
			},
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patients,
		},
	}

	err := record.validateCasePatients(patients)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 2)
}
