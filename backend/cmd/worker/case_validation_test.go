package main

import (
	"fmt"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// -----------------------------------------------------------------------------
// Section: Repository Mocking
// -----------------------------------------------------------------------------

type CaseValidationMockRepo struct{}

func (m *CaseValidationMockRepo) CreateCase(c *repository.Case) error {
	return nil
}

func (m *CaseValidationMockRepo) CreateCaseHasSequencingExperiment(caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return nil
}

func (m *CaseValidationMockRepo) CreateDocument(document *repository.Document) error {
	return nil
}

func (m *CaseValidationMockRepo) CreatePatient(newPatient *repository.Patient) error {
	return nil
}

func (m *CaseValidationMockRepo) CreateSequencingExperiment(experiment *repository.SequencingExperiment) error {
	return nil
}

func (m *CaseValidationMockRepo) GetById(id int) (*repository.Document, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetCaseAnalysisCatalogIdByCode(code string) (*repository.AnalysisCatalog, error) {
	if code == "WGA" {
		return &repository.AnalysisCatalog{ID: 1, Code: code, Name: "Whole Genome Analysis"}, nil
	} else if strings.Contains(code, "ERROR") {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetCaseEntity(caseId int) (*repository.CaseEntity, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetCasesFilters(userQuery types.AggQuery) (*repository.CaseFilters, error) {
	return nil, nil
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

func (m *CaseValidationMockRepo) GetDocumentsFilters(userQuery types.AggQuery, withProjectAndLab bool) (*repository.DocumentFilters, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetOrganizationByCode(organizationCode string) (*types.Organization, error) {
	if organizationCode == "LAB-1" {
		return &types.Organization{ID: 10, Code: organizationCode, Name: "Organization 1"}, nil
	} else if organizationCode == "LAB-2" {
		return &types.Organization{ID: 20, Code: organizationCode, Name: "Organization 2"}, nil
	} else if strings.Contains(organizationCode, "ERROR") {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetPatientByOrgCodeAndSubmitterPatientId(organizationCode string, submitterPatientId string) (*repository.Patient, error) {
	if organizationCode == "LAB-1" && submitterPatientId == "PAT-1" {
		return &repository.Patient{
			ID:                 100,
			SubmitterPatientId: submitterPatientId,
			OrganizationId:     10,
		}, nil
	} else if strings.Contains(organizationCode, "ERROR") || strings.Contains(submitterPatientId, "ERROR") {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetPatientBySubmitterPatientId(organizationId int, submitterPatientId string) (*repository.Patient, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetProjectByCode(code string) (*types.Project, error) {
	if code == "PROJ-1" {
		return &types.Project{ID: 42, Code: code, Name: "PROJ-1", Description: "Project #1"}, nil
	} else if strings.Contains(code, "ERROR") {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetSequencingExperimentByAliquot(aliquot string) ([]repository.SequencingExperiment, error) {
	if aliquot == "ALIQUOT-1" {
		return []repository.SequencingExperiment{
			{ID: 200, Aliquot: "ALIQUOT-1"},
		}, nil
	}
	if strings.Contains(aliquot, "ERROR") {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil // Not found
}

func (m *CaseValidationMockRepo) GetSequencingExperimentByAliquotAndSubmitterSample(aliquot string, submitterSampleId string, sampleOrganizationCode string) (*repository.SequencingExperiment, error) {
	if aliquot == "ALIQUOT-1" && submitterSampleId == "SAMPLE-1" && sampleOrganizationCode == "LAB-1" {
		return &repository.SequencingExperiment{
			ID:      200,
			Aliquot: aliquot,
		}, nil
	} else if strings.Contains(aliquot, "ERROR") || strings.Contains(submitterSampleId, "ERROR") {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetSequencingExperimentBySampleID(sampleID int) ([]repository.SequencingExperiment, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) SearchById(prefix string, limit int) (*[]repository.AutocompleteResult, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) SearchCases(userQuery types.ListQuery) (*[]repository.CaseResult, *int64, error) {
	return nil, nil, nil
}

func (m *CaseValidationMockRepo) SearchDocuments(userQuery types.ListQuery) (*[]repository.DocumentResult, *int64, error) {
	return nil, nil, nil
}

// -----------------------------------------------------------------------------
// Section: Helper Methods Tests
// -----------------------------------------------------------------------------

func Test_GetResourceType_OK(t *testing.T) {
	record := CaseValidationRecord{}
	assert.Equal(t, "case", record.GetResourceType())
}

func Test_getProbandFromPatients_OK(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			Patients: []*types.CasePatientBatch{
				{RelationToProbandCode: "mother", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"},
				{RelationToProbandCode: "father", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-2"},
				{RelationToProbandCode: "proband", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-3"},
			},
		},
		Patients: make(map[string]*types.Patient),
	}
	record.Patients["LAB-1/PAT-3"] = &types.Patient{ID: 1}
	proband, err := record.getProbandFromPatients()
	assert.NoError(t, err)
	assert.Equal(t, 1, proband.ID)
}

func Test_getProbandFromPatients_Empty(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			Patients: []*types.CasePatientBatch{},
		},
		Patients: make(map[string]*types.Patient),
	}
	proband, err := record.getProbandFromPatients()
	assert.NoError(t, err)
	assert.Nil(t, proband)
}

func Test_getProbandFromPatients_Error(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			Patients: []*types.CasePatientBatch{
				{RelationToProbandCode: "mother", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"},
				{RelationToProbandCode: "father", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-2"},
				{RelationToProbandCode: "proband", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-3"},
			},
		},
		Patients: make(map[string]*types.Patient),
	}
	proband, err := record.getProbandFromPatients()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to find proband patient for case")
	assert.Nil(t, proband)
}

// -----------------------------------------------------------------------------
// Section: Fetching Methods Tests
// -----------------------------------------------------------------------------

func Test_fetchProject_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			ProjectCode: "PROJ-1",
		},
	}

	err := record.fetchProject(&mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.ProjectID)
	assert.Equal(t, 42, *record.ProjectID)
}

func Test_fetchProject_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			ProjectCode: "PROJ-2",
		},
	}

	err := record.fetchProject(&mockContext)
	assert.NoError(t, err)
	assert.Nil(t, record.ProjectID)
}

func Test_fetchProject_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			ProjectCode: "PROJ-ERROR",
		},
	}

	err := record.fetchProject(&mockContext)
	assert.Error(t, err)
	assert.Nil(t, record.ProjectID)
}

func Test_fetchAnalysisCatalog_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			AnalysisCode: "WGA",
		},
	}

	err := record.fetchAnalysisCatalog(&mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.AnalysisCatalogID)
	assert.Equal(t, 1, *record.AnalysisCatalogID)
}

func Test_fetchAnalysisCatalog_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			AnalysisCode: "WPGA",
		},
	}

	err := record.fetchAnalysisCatalog(&mockContext)
	assert.NoError(t, err)
	assert.Nil(t, record.AnalysisCatalogID)
}

func Test_fetchAnalysisCatalog_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			AnalysisCode: "WGA-ERROR",
		},
	}

	err := record.fetchAnalysisCatalog(&mockContext)
	assert.Error(t, err)
	assert.Nil(t, record.AnalysisCatalogID)
}

func Test_fetchOrganizations_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		OrgRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-1",
			DiagnosticLabCode:        "LAB-2",
		},
	}

	err := record.fetchOrganizations(&mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.OrderingOrganizationID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.NotNil(t, record.DiagnosisLabID)
	assert.Equal(t, 20, *record.DiagnosisLabID)
}

func Test_fetchOrganizations_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		OrgRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-1",
			DiagnosticLabCode:        "LAB-3",
		},
	}

	err := record.fetchOrganizations(&mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.OrderingOrganizationID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)
}

func Test_fetchOrganizations_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		OrgRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-ERROR",
			DiagnosticLabCode:        "LAB-2",
		},
	}

	err := record.fetchOrganizations(&mockContext)
	assert.Error(t, err)
	assert.Nil(t, record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)

	record = CaseValidationRecord{
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-1",
			DiagnosticLabCode:        "LAB-ERROR",
		},
	}

	err = record.fetchOrganizations(&mockContext)
	assert.Error(t, err)
	assert.NotNil(t, record.OrderingOrganizationID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)
}

func Test_fetchPatients_PartialOK(t *testing.T) {
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

func Test_fetchFromTasks_OK(t *testing.T) {
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

func Test_fetchValidationInfos_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		CasesRepo:   &mockRepo,
		ProjectRepo: &mockRepo,
		PatientRepo: &mockRepo,
		SeqExpRepo:  &mockRepo,
		OrgRepo:     &mockRepo,
	}
	caseBatch := types.CaseBatch{}
	caseBatch.ProjectCode = "PROJ-1"
	caseBatch.AnalysisCode = "WGA"
	caseBatch.DiagnosticLabCode = "LAB-2"
	caseBatch.OrderingOrganizationCode = "LAB-1"
	caseBatch.SequencingExperiments = []*types.CaseSequencingExperimentBatch{
		{
			Aliquot:                "ALIQUOT-1",
			SubmitterSampleId:      "SAMPLE-1",
			SampleOrganizationCode: "LAB-1",
		},
	}
	caseBatch.Patients = []*types.CasePatientBatch{
		{
			PatientOrganizationCode: "LAB-1",
			SubmitterPatientId:      "PAT-1",
		},
	}
	record := NewCaseValidationRecord(&mockContext, caseBatch, 0)
	err := record.fetchValidationInfos()
	assert.NoError(t, err)
	assert.Equal(t, 42, *record.ProjectID)
	assert.Equal(t, 1, *record.AnalysisCatalogID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.Equal(t, 20, *record.DiagnosisLabID)
	assert.Len(t, record.Documents, 0)
	assert.Len(t, record.SequencingExperiments, 1)
	assert.Equal(t, "ALIQUOT-1", record.SequencingExperiments[0].Aliquot)
	assert.Len(t, record.Patients, 1)
	validKey := "LAB-1/PAT-1"
	assert.Contains(t, record.Patients, validKey)
	assert.Equal(t, 100, record.Patients[validKey].ID)
}

func Test_fetchValidationInfos_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := BatchValidationContext{
		ProjectRepo: &mockRepo,
	}
	caseBatch := types.CaseBatch{}
	caseBatch.ProjectCode = "PROJ-ERROR"
	record := NewCaseValidationRecord(&mockContext, caseBatch, 0)
	err := record.fetchValidationInfos()
	assert.Error(t, err)
	assert.Nil(t, record.ProjectID)
	assert.Nil(t, record.AnalysisCatalogID)
	assert.Nil(t, record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)
	assert.Empty(t, record.Documents)
	assert.Nil(t, record.SequencingExperiments)
	assert.Empty(t, record.Patients)
}

// -----------------------------------------------------------------------------
// Section: Persistence Methods Tests
// -----------------------------------------------------------------------------

// TODO Implement persistence method tests

// -----------------------------------------------------------------------------
// Section: Validation Methods Tests
// -----------------------------------------------------------------------------

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
