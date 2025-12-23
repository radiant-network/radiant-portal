package main

import (
	"fmt"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type CaseValidationMockRepo struct{}

func (m *CaseValidationMockRepo) SearchDocuments(userQuery types.ListQuery) (*[]repository.DocumentResult, *int64, error) {
	return nil, nil, nil
}

func (m *CaseValidationMockRepo) GetDocumentsFilters(userQuery types.AggQuery, withProjectAndLab bool) (*repository.DocumentFilters, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetById(id int) (*repository.Document, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) CreateDocument(document *repository.Document) error {
	return nil
}

func (m *CaseValidationMockRepo) GetOrganizationByCode(organizationCode string) (*types.Organization, error) {
	if organizationCode == "LAB-1" || organizationCode == "LAB-2" {
		return &types.Organization{ID: 10, Code: organizationCode, Name: "Diagnostic Lab"}, nil
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) CreateCaseHasSequencingExperiment(caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return nil
}

func (m *CaseValidationMockRepo) SearchCases(userQuery types.ListQuery) (*[]repository.CaseResult, *int64, error) {
	return nil, nil, nil
}

func (m *CaseValidationMockRepo) SearchById(prefix string, limit int) (*[]repository.AutocompleteResult, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetCasesFilters(userQuery types.AggQuery) (*repository.CaseFilters, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetCaseEntity(caseId int) (*repository.CaseEntity, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) CreateCase(c *repository.Case) error {
	return nil
}

func (m *CaseValidationMockRepo) GetCaseAnalysisCatalogIdByCode(code string) (*repository.AnalysisCatalog, error) {
	if code == "WGA" {
		return &repository.AnalysisCatalog{ID: 1, Code: code, Name: "Whole Genome Analysis"}, nil
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleId string, sampleOrganizationCode string) (*repository.SequencingExperiment, error) {
	if aliquot == "ALIQUOT-1" && submitterSampleId == "SAMPLE-1" && sampleOrganizationCode == "LAB-1" {
		return &repository.SequencingExperiment{
			ID:      200,
			Aliquot: aliquot,
		}, nil
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetPatientBySubmitterPatientId(organizationId int, submitterPatientId string) (*repository.Patient, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*repository.Patient, error) {
	if organizationCode == "LAB-1" && submitterPatientId == "PAT-1" {
		return &repository.Patient{
			ID:                 100,
			SubmitterPatientId: submitterPatientId,
			OrganizationId:     10,
		}, nil
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) CreatePatient(newPatient *repository.Patient) error {
	return nil
}

func (m *CaseValidationMockRepo) GetProjectByCode(code string) (*types.Project, error) {
	if code == "PROJ-1" {
		return &types.Project{ID: 42, Code: code, Name: "PROJ-1", Description: "Project #1"}, nil
	}
	return nil, fmt.Errorf("error fetching project by code")
}

func (m *CaseValidationMockRepo) CreateSequencingExperiment(experiment *repository.SequencingExperiment) error {
	return nil
}

func (m *CaseValidationMockRepo) GetSequencingExperimentBySampleID(sampleID int) ([]repository.SequencingExperiment, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetSequencingExperimentByAliquot(aliquot string) ([]repository.SequencingExperiment, error) {
	if aliquot == "ALIQUOT-1" {
		return []repository.SequencingExperiment{
			{ID: 200, Aliquot: "ALIQUOT-1"},
		}, nil
	}
	if aliquot == "ALIQUOT-ERROR" {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil // Not found
}

func (m *CaseValidationMockRepo) GetDocumentByUrl(url string) (*types.Document, error) {
	if url == "file://bucket/file.bam" {
		return &types.Document{ID: 500, Url: url, Name: "file.bam"}, nil
	}
	if url == "file://bucket/error.bam" {
		return nil, fmt.Errorf("document service unavailable")
	}
	return nil, nil // Not found
}

func Test_GetResourceType_OK(t *testing.T) {
	record := CaseValidationRecord{}
	assert.Equal(t, "case", record.GetResourceType())
}

func Test_fetchPatients_PartialSuccess(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		PatientRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Patients: make(map[string]*types.Patient),
		Case: types.CaseBatch{
			Patients: []*types.CasePatientBatch{
				{PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"},
				{PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-NOT-EXIST"},
			},
		},
	}

	err := record.fetchPatients(&mockContext)
	assert.NoError(t, err)

	assert.Len(t, record.Patients, 1)

	validKey := "LAB-1/PAT-1"
	assert.Contains(t, record.Patients, validKey)
	assert.Equal(t, 100, record.Patients[validKey].ID)
}

func Test_fetchFromTasks_Success(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		SeqExpRepo: &mockRepo,
		DocRepo:    &mockRepo,
	}

	record := CaseValidationRecord{
		Documents: make(map[string]*types.Document),
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-TASK-TEST",
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquot: "ALIQUOT-1",
					InputDocuments: []*types.InputDocumentBatch{
						{Url: "file://bucket/file.bam"},
					},
				},
			},
		},
	}

	err := record.fetchFromTasks(&mockContext)
	assert.NoError(t, err)
	assert.Len(t, record.SequencingExperiments, 1)
	assert.Equal(t, "ALIQUOT-1", record.SequencingExperiments[0].Aliquot)
	assert.Len(t, record.Documents, 1)
	assert.Contains(t, record.Documents, "file://bucket/file.bam")
	assert.Equal(t, 500, record.Documents["file://bucket/file.bam"].ID)
}

func Test_fetchFromTasks_DocumentError(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		SeqExpRepo: &mockRepo,
		DocRepo:    &mockRepo,
	}

	record := CaseValidationRecord{
		Documents: make(map[string]*types.Document),
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-FAIL",
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquot: "ALIQUOT-1",
					InputDocuments: []*types.InputDocumentBatch{
						{Url: "file://bucket/error.bam"},
					},
				},
			},
		},
	}

	err := record.fetchFromTasks(&mockContext)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to get document by url")
}

func Test_fetchFromTasks_SeqExpError(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		SeqExpRepo: &mockRepo,
		DocRepo:    &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-FAIL",
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquot: "ALIQUOT-ERROR",
				},
			},
		},
	}

	err := record.fetchFromTasks(&mockContext)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to get sequencing experiment by aliquot")
}

func Test_fetchValidationInfos_FailFast(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			ProjectCode: "ERROR-PROJ",
		},
	}

	record.Case.ProjectCode = "INVALID-CODE"
	err := record.fetchValidationInfos(&mockContext)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to resolve project")
}

func Test_fetchValidationInfos_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo:   &mockRepo,
		ProjectRepo: &mockRepo,
		PatientRepo: &mockRepo,
		SeqExpRepo:  &mockRepo,
		OrgRepo:     &mockRepo,
	}
	record := CaseValidationRecord{}
	record.Case.ProjectCode = "PROJ-1"
	record.Case.AnalysisCode = "WGA"
	record.Case.DiagnosticLabCode = "LAB-2"
	record.Case.OrderingOrganizationCode = "LAB-1"
	record.Case.SequencingExperiments = []*types.CaseSequencingExperimentBatch{
		{
			Aliquot:                "ALIQUOT-1",
			SubmitterSampleId:      "SAMPLE-1",
			SampleOrganizationCode: "LAB-1",
		},
	}
	record.Case.Patients = []*types.CasePatientBatch{
		{
			SubmitterPatientId: "PAT-1",
		},
	}
	err := record.fetchValidationInfos(&mockContext)
	assert.NoError(t, err)
	assert.Equal(t, 42, *record.ProjectID)
}

func Test_fetchValidationInfos_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		ProjectRepo: &mockRepo,
	}
	record := CaseValidationRecord{}
	record.Case.ProjectCode = "UNKNOWN-PROJ"
	err := record.fetchValidationInfos(&mockContext)
	assert.Error(t, err)
	assert.Nil(t, record.ProjectID)
}

func Test_validateCaseBatch_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo:   &mockRepo,
		ProjectRepo: &mockRepo,
		PatientRepo: &mockRepo,
		SeqExpRepo:  &mockRepo,
		OrgRepo:     &mockRepo,
	}

	vr, err := validateCaseBatch(&mockContext, []types.CaseBatch{
		{
			ProjectCode:                "PROJ-1",
			AnalysisCode:               "WGA",
			SubmitterCaseId:            "CASE-1",
			Type:                       "germline",
			StatusCode:                 "in_progress",
			OrderingOrganizationCode:   "LAB-1",
			DiagnosticLabCode:          "LAB-2",
			PrimaryConditionCodeSystem: "MONDO",
			PrimaryConditionValue:      "0001234",
			PriorityCode:               "routine",
			CategoryCode:               "postnatal",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
			Patients: []*types.CasePatientBatch{
				{
					SubmitterPatientId: "PAT-1",
				},
			},
		},
	})
	assert.NoError(t, err)
	assert.Empty(t, vr[0].Infos)
	assert.Empty(t, vr[0].Warnings)
	assert.Empty(t, vr[0].Errors)
}

func Test_validateCaseBatch_Duplicates(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo:   &mockRepo,
		ProjectRepo: &mockRepo,
		PatientRepo: &mockRepo,
		SeqExpRepo:  &mockRepo,
		OrgRepo:     &mockRepo,
	}
	batch := types.CaseBatch{
		ProjectCode:                "PROJ-1",
		AnalysisCode:               "WGA",
		SubmitterCaseId:            "CASE-1",
		Type:                       "germline",
		StatusCode:                 "in_progress",
		OrderingOrganizationCode:   "LAB-1",
		DiagnosticLabCode:          "LAB-2",
		PrimaryConditionCodeSystem: "MONDO",
		PrimaryConditionValue:      "0001234",
		PriorityCode:               "routine",
		CategoryCode:               "postnatal",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{
				Aliquot:                "ALIQUOT-1",
				SubmitterSampleId:      "SAMPLE-1",
				SampleOrganizationCode: "LAB-1",
			},
		},
		Patients: []*types.CasePatientBatch{
			{
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	vr, err := validateCaseBatch(&mockContext, []types.CaseBatch{batch, batch})
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
