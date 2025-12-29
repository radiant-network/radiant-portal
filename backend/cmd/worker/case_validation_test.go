package main

import (
	"fmt"
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

type ObservationsMockRepo struct{}

func (m *ObservationsMockRepo) GetObservationCodes() ([]string, error) {
	return []string{"phenotype", "condition", "note", "ancestry", "consanguinity"}, nil
}

type OnsetsMockRepo struct{}

func (m *OnsetsMockRepo) GetOnsetCodes() ([]string, error) {
	return []string{"unknown", "antenatal", "congenital", "neonatal", "infantile", "childhood", "juvenile", "young_adult", "middle_age", "senior"}, nil
}

type PatientsMockRepo struct {
	GetPatientByOrgCodeAndSubmitterPatientIdFunc func(organizationCode string, submitterPatientId string) (*types.Patient, error)
}

func (m *PatientsMockRepo) GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*types.Patient, error) {
	if m.GetPatientByOrgCodeAndSubmitterPatientIdFunc != nil {
		return m.GetPatientByOrgCodeAndSubmitterPatientIdFunc(organizationCode, submitterPatientId)
	}
	return nil, nil
}

func (m *PatientsMockRepo) GetPatientBySubmitterPatientId(organizationId int, submitterPatientId string) (*types.Patient, error) {
	return nil, nil
}

func (m *PatientsMockRepo) CreatePatient(newPatient *types.Patient) error { return nil }

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
	mockPatients := PatientsMockRepo{}
	mockObservations := ObservationsMockRepo{}
	mockOnsets := OnsetsMockRepo{}
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
	}, &mockRepo, &mockPatients, &mockObservations, &mockOnsets)
	assert.NoError(t, err)
	assert.Empty(t, vr[0].Infos)
	assert.Empty(t, vr[0].Warnings)
	assert.Empty(t, vr[0].Errors)
}

func Test_validateCaseBatch_Duplicates(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockPatients := PatientsMockRepo{}
	mockObservations := ObservationsMockRepo{}
	mockOnsets := OnsetsMockRepo{}
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
	}, &mockRepo, &mockPatients, &mockObservations, &mockOnsets)
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

func Test_validateObsCategoricalCode_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	validCodes := []string{"phenotype", "condition", "note"}
	record.validateObsCategoricalCode(0, 0, validCodes)
	assert.Empty(t, record.Errors)
}

func Test_validateObsCategoricalCode_Invalid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "invalid_code",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	validCodes := []string{"phenotype", "condition", "note"}
	record.validateObsCategoricalCode(0, 0, validCodes)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid observation code")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].code", record.Errors[0].Path)
}

func Test_validateSystem_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	record.validateSystem(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateSystem_InvalidRegex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO@invalid",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	record.validateSystem(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].system", record.Errors[0].Path)
}

func Test_validateSystem_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             createString(101),
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	record.validateSystem(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].system", record.Errors[0].Path)
}

func Test_validateValue_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	record.validateValue(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateValue_InvalidRegex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263@invalid",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	record.validateValue(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].value", record.Errors[0].Path)
}

func Test_validateValue_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              createString(101),
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	record.validateValue(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].value", record.Errors[0].Path)
}

func Test_validateOnsetCode_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "childhood",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	validOnsetCodes := []string{"unknown", "childhood", "juvenile"}
	record.validateOnsetCode(0, 0, validOnsetCodes)
	assert.Empty(t, record.Errors)
}

func Test_validateOnsetCode_Invalid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "invalid_onset",
							InterpretationCode: "positive",
							Note:               "Test note",
						},
					},
				},
			},
		},
	}

	validOnsetCodes := []string{"unknown", "childhood", "juvenile"}
	record.validateOnsetCode(0, 0, validOnsetCodes)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid onset code")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].onset_code", record.Errors[0].Path)
}

func Test_validateObsCategoricalNote_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Clinical note with details.",
						},
					},
				},
			},
		},
	}

	record.validateObsCategoricalNote(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateObsCategoricalNote_InvalidRegex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               "Invalid@note",
						},
					},
				},
			},
		},
	}

	record.validateObsCategoricalNote(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].note", record.Errors[0].Path)
}

func Test_validateObsCategoricalNote_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "unknown",
							InterpretationCode: "positive",
							Note:               createString(101),
						},
					},
				},
			},
		},
	}

	record.validateObsCategoricalNote(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].note", record.Errors[0].Path)
}

func Test_validateObservationsCategorical_Valid(t *testing.T) {
	mockObservations := &ObservationsMockRepo{}
	mockOnsets := &OnsetsMockRepo{}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "phenotype",
							System:             "HPO",
							Value:              "HP:0001263",
							OnsetCode:          "childhood",
							InterpretationCode: "positive",
							Note:               "Clinical note",
						},
						{
							Code:               "condition",
							System:             "MONDO",
							Value:              "MONDO:0001234",
							OnsetCode:          "juvenile",
							InterpretationCode: "negative",
							Note:               "Another note",
						},
					},
				},
			},
		},
	}

	err := record.validateObservationsCategorical(0, mockObservations, mockOnsets)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateObservationsCategorical_MultipleErrors(t *testing.T) {
	mockObservations := &ObservationsMockRepo{}
	mockOnsets := &OnsetsMockRepo{}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{
						{
							Code:               "invalid_code",
							System:             "HPO@invalid",
							Value:              "HP:0001263@invalid",
							OnsetCode:          "invalid_onset",
							InterpretationCode: "positive",
							Note:               "invalid@note",
						},
					},
				},
			},
		},
	}

	err := record.validateObservationsCategorical(0, mockObservations, mockOnsets)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 5) // code, system, value, onset_code, note
}

func Test_validateObservationsCategorical_NoObservations(t *testing.T) {
	mockObservations := &ObservationsMockRepo{}
	mockOnsets := &OnsetsMockRepo{}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsCategorical: []*types.ObservationCategoricalBatch{},
				},
			},
		},
	}

	err := record.validateObservationsCategorical(0, mockObservations, mockOnsets)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateObsTextCode_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "note",
							Note: "Free text clinical note",
						},
					},
				},
			},
		},
	}

	validCodes := []string{"note", "phenotype", "condition"}
	record.validateObsTextCode(0, 0, validCodes)
	assert.Empty(t, record.Errors)
}

func Test_validateObsTextCode_Invalid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "invalid_code",
							Note: "Free text clinical note",
						},
					},
				},
			},
		},
	}

	validCodes := []string{"note", "phenotype", "condition"}
	record.validateObsTextCode(0, 0, validCodes)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid observation code")
	assert.Equal(t, "case[0].patients[0].observations_text[0].code", record.Errors[0].Path)
}

func Test_validateObsTextNote_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "note",
							Note: "Free text clinical note with details.",
						},
					},
				},
			},
		},
	}

	record.validateObsTextNote(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateObsTextNote_InvalidRegex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "note",
							Note: "Invalid@note",
						},
					},
				},
			},
		},
	}

	record.validateObsTextNote(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].observations_text[0].note", record.Errors[0].Path)
}

func Test_validateObsTextNote_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "note",
							Note: createString(101),
						},
					},
				},
			},
		},
	}

	record.validateObsTextNote(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_text[0].note", record.Errors[0].Path)
}

func Test_validateObservationsText_Valid(t *testing.T) {
	mockObservations := &ObservationsMockRepo{}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "note",
							Note: "First clinical note",
						},
						{
							Code: "phenotype",
							Note: "Phenotype description",
						},
					},
				},
			},
		},
	}

	err := record.validateObservationsText(0, mockObservations)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateObservationsText_MultipleErrors(t *testing.T) {
	mockObservations := &ObservationsMockRepo{}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code: "invalid_code",
							Note: "invalid@note",
						},
					},
				},
			},
		},
	}

	err := record.validateObservationsText(0, mockObservations)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 2) // code and note
}

func Test_validateObservationsText_NoObservations(t *testing.T) {
	mockObservations := &ObservationsMockRepo{}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText:        []*types.ObservationTextBatch{},
				},
			},
		},
	}

	err := record.validateObservationsText(0, mockObservations)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validatePatientInOrg_PatientExists(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			return nil, nil
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
				},
			},
		},
	}

	err := record.validatePatientInOrg(0, mockPatients)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validatePatientInOrg_PatientNotFound(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			return nil, nil
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-999",
				},
			},
		},
	}

	err := record.validatePatientInOrg(0, mockPatients)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, PatientNotFoundCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Patient (CHUSJ / PAT-999)")
	assert.Contains(t, record.Errors[0].Message, "does not exist")
	assert.Equal(t, "case[0].patients[0]", record.Errors[0].Path)
}

func Test_validatePatientInOrg_RepositoryError(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			return nil, fmt.Errorf("database connection error")
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
				},
			},
		},
	}

	err := record.validatePatientInOrg(0, mockPatients)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error getting existing patient")
	assert.Contains(t, err.Error(), "database connection error")
}

func Test_validatePatientInOrg_MultiplePatients(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			return nil, nil
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
				},
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-999",
				},
			},
		},
	}

	// Validate first patient - should pass
	err := record.validatePatientInOrg(0, mockPatients)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)

	// Validate second patient - should fail
	err = record.validatePatientInOrg(1, mockPatients)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, PatientNotFoundCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "PAT-999")
	assert.Equal(t, "case[0].patients[1]", record.Errors[0].Path)
}

func Test_validateCasePatients_Valid(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-2" {
				return &types.Patient{ID: 2, SubmitterPatientId: "PAT-2"}, nil
			}
			return nil, nil
		},
	}
	mockObservations := &ObservationsMockRepo{}
	mockOnsets := &OnsetsMockRepo{}

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
			ObservationsCategorical: []*types.ObservationCategoricalBatch{
				{
					Code:               "phenotype",
					System:             "heart disease",
					Value:              "this is a value",
					OnsetCode:          "unknown",
					InterpretationCode: "positive",
					Note:               "Test note",
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
			ObservationsCategorical: []*types.ObservationCategoricalBatch{
				{
					Code:               "condition",
					System:             "SNOMED",
					OnsetCode:          "unknown",
					Value:              "some condition",
					InterpretationCode: "negative",
					Note:               "Another test note",
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

	err := record.validateCasePatients(patients, mockPatients, mockObservations, mockOnsets)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCasePatients_Invalid(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			return nil, nil
		},
	}
	mockObservations := &ObservationsMockRepo{}
	mockOnsets := &OnsetsMockRepo{}

	patients := []*types.CasePatientBatch{
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "INVALID-PAT-1",
			FamilyHistory: []*types.FamilyHistoryBatch{
				{
					FamilyMemberCode: "invalid123",
					Condition:        "diabetes",
				},
			},
			ObservationsCategorical: []*types.ObservationCategoricalBatch{
				{
					Code:               "invalid_code",
					System:             "HPO@invalid",
					Value:              "HP:0001263",
					OnsetCode:          "invalid_onset",
					InterpretationCode: "positive",
					Note:               "Clinical note",
				},
			},
		},
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "INVALID-PAT-2",
			FamilyHistory: []*types.FamilyHistoryBatch{
				{
					FamilyMemberCode: "father",
					Condition:        "invalid@condition",
				},
			},
			ObservationsText: []*types.ObservationTextBatch{
				{
					Code: "invalid_text_code",
					Note: "invalid@note",
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

	err := record.validateCasePatients(patients, mockPatients, mockObservations, mockOnsets)
	assert.NoError(t, err)
	assert.Equal(t, 9, len(record.Errors))
}
