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

type CaseValidationMockRepo struct {
	GetCaseBySubmitterCaseIdAndProjectIdFunc func(submitterCaseId string, projectId int) (*repository.Case, error)
}

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

func (m *CaseValidationMockRepo) GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*repository.Case, error) {
	if m.GetCaseBySubmitterCaseIdAndProjectIdFunc != nil {
		return m.GetCaseBySubmitterCaseIdAndProjectIdFunc(submitterCaseId, projectId)
	}
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

func (m *CaseValidationMockRepo) GetDocumentsFilters(withProjectAndLab bool) (*types.DocumentFilters, error) {
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
	}
	if aliquot == "ALIQUOT-2" && submitterSampleId == "SAMPLE-2" && sampleOrganizationCode == "LAB-2" {
		return &repository.SequencingExperiment{
			ID:      201,
			Aliquot: aliquot,
		}, nil
	}
	if strings.Contains(aliquot, "ERROR") || strings.Contains(submitterSampleId, "ERROR") {
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

type ObservationsMockRepo struct {
	GetObservationCodesFunc func() ([]string, error)
}

func (m *ObservationsMockRepo) GetObservationCodes() ([]string, error) {
	if m.GetObservationCodesFunc != nil {
		return m.GetObservationCodesFunc()
	}
	return []string{"phenotype", "condition", "note", "ancestry", "consanguinity"}, nil
}

type OnsetsMockRepo struct {
	GetOnsetCodesFunc func() ([]string, error)
}

func (m *OnsetsMockRepo) GetOnsetCodes() ([]string, error) {
	if m.GetOnsetCodesFunc != nil {
		return m.GetOnsetCodesFunc()
	}
	return []string{"unknown", "antenatal", "congenital", "neonatal", "infantile", "childhood", "juvenile", "young_adult", "middle_age", "senior"}, nil
}

type StatusMockRepo struct {
	GetStatusCodesFunc func() ([]string, error)
}

func (m *StatusMockRepo) GetStatusCodes() ([]string, error) {
	if m.GetStatusCodesFunc != nil {
		return m.GetStatusCodesFunc()
	}
	return []string{"in_progress", "incomplete", "completed", "unknown"}, nil
}

type SamplesMockRepo struct {
	GetSampleByOrgCodeAndSubmitterSampleIdFunc func(organizationCode string, submitterSampleId string) (*types.Sample, error)
}

func (m *SamplesMockRepo) GetSampleByOrgCodeAndSubmitterSampleId(organizationCode string, submitterSampleId string) (*types.Sample, error) {
	if m.GetSampleByOrgCodeAndSubmitterSampleIdFunc != nil {
		return m.GetSampleByOrgCodeAndSubmitterSampleIdFunc(organizationCode, submitterSampleId)
	}
	return nil, nil
}

func (m *SamplesMockRepo) GetSampleBySubmitterSampleId(organizationId int, submitterSampleId string) (*types.Sample, error) {
	return nil, nil
}

func (m *SamplesMockRepo) CreateSample(newSample *types.Sample) (*types.Sample, error) {
	return nil, nil
}

func (m *SamplesMockRepo) GetTypeCodes() ([]string, error) {
	return nil, nil
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

func (m *CaseValidationMockRepo) GetSequencingExperimentDetailById(seqId int) (*types.SequencingExperimentDetail, error) {
	return nil, nil
}

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
		Patients: make(map[PatientKey]*types.Patient),
	}
	key := PatientKey{OrganizationCode: "LAB-1", SubmitterPatientId: "PAT-3"}
	record.Patients[key] = &types.Patient{ID: 1}
	proband, err := record.getProbandFromPatients()
	assert.NoError(t, err)
	assert.Equal(t, 1, proband.ID)
}

func Test_getProbandFromPatients_Empty(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			Patients: []*types.CasePatientBatch{},
		},
		Patients: make(map[PatientKey]*types.Patient),
	}
	proband, err := record.getProbandFromPatients()
	assert.NoError(t, err)
	assert.Nil(t, proband)
}

func Test_getProbandFromPatients_Error(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{RelationToProbandCode: "mother", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"},
				{RelationToProbandCode: "father", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-2"},
				{RelationToProbandCode: "proband", PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-3"},
			},
		},
		Patients: make(map[PatientKey]*types.Patient),
	}
	proband, err := record.getProbandFromPatients()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to find proband patient {\"LAB-1\" \"PAT-3\"} for case \"CASE-1\"")
	assert.Nil(t, proband)
}

// -----------------------------------------------------------------------------
// Section: Fetching Methods Tests
// -----------------------------------------------------------------------------

func Test_fetchStatusCodes_OK(t *testing.T) {
	mockRepo := &StatusMockRepo{}
	mockContext := &BatchValidationContext{
		StatusRepo: mockRepo,
	}

	record := CaseValidationRecord{}

	err := record.fetchStatusCodes(mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.StatusCodes)
	assert.GreaterOrEqual(t, len(record.StatusCodes), 1)
}

func Test_fetchStatusCodes_Error(t *testing.T) {
	mockRepo := &StatusMockRepo{
		GetStatusCodesFunc: func() ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}
	mockContext := &BatchValidationContext{
		StatusRepo: mockRepo,
	}

	record := CaseValidationRecord{}

	err := record.fetchStatusCodes(mockContext)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving status codes")
	assert.Contains(t, err.Error(), "database connection failed")
	assert.Nil(t, record.StatusCodes)
}

func Test_fetchObservationCodes_OK(t *testing.T) {
	mockRepo := &ObservationsMockRepo{}
	mockContext := &BatchValidationContext{
		ObservationRepo: mockRepo,
	}

	record := CaseValidationRecord{}

	err := record.fetchObservationCodes(mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.ObservationCodes)
	assert.GreaterOrEqual(t, len(record.ObservationCodes), 1)
}

func Test_fetchObservationCodes_Error(t *testing.T) {
	mockRepo := &ObservationsMockRepo{
		GetObservationCodesFunc: func() ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}
	mockContext := &BatchValidationContext{
		ObservationRepo: mockRepo,
	}

	record := CaseValidationRecord{}

	err := record.fetchObservationCodes(mockContext)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving observation codes")
	assert.Contains(t, err.Error(), "database connection failed")
	assert.Nil(t, record.ObservationCodes)
}

func Test_fetchOnsetCodes_OK(t *testing.T) {
	mockRepo := &OnsetsMockRepo{}
	mockContext := &BatchValidationContext{
		OnsetRepo: mockRepo,
	}

	record := CaseValidationRecord{}

	err := record.fetchOnsetCodes(mockContext)
	assert.NoError(t, err)
	assert.NotNil(t, record.OnsetCodes)
	assert.GreaterOrEqual(t, len(record.OnsetCodes), 1)
}

func Test_fetchOnsetCodes_Error(t *testing.T) {
	mockRepo := &OnsetsMockRepo{
		GetOnsetCodesFunc: func() ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}
	mockContext := &BatchValidationContext{
		OnsetRepo: mockRepo,
	}

	record := CaseValidationRecord{}

	err := record.fetchOnsetCodes(mockContext)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving onset codes")
	assert.Contains(t, err.Error(), "database connection failed")
	assert.Nil(t, record.OnsetCodes)
}

func Test_fetchCodeInfos_OK(t *testing.T) {
	mockStatusRepo := &StatusMockRepo{}
	mockObservationRepo := &ObservationsMockRepo{}
	mockOnsetRepo := &OnsetsMockRepo{}

	record := CaseValidationRecord{
		Context: &BatchValidationContext{
			StatusRepo:      mockStatusRepo,
			ObservationRepo: mockObservationRepo,
			OnsetRepo:       mockOnsetRepo,
		},
	}

	err := record.fetchCodeInfos()
	assert.NoError(t, err)
	assert.NotNil(t, record.StatusCodes)
	assert.NotNil(t, record.ObservationCodes)
	assert.NotNil(t, record.OnsetCodes)
	assert.GreaterOrEqual(t, len(record.StatusCodes), 1)
	assert.GreaterOrEqual(t, len(record.ObservationCodes), 1)
	assert.GreaterOrEqual(t, len(record.OnsetCodes), 1)
}

func Test_fetchCodeInfos_StatusCodesError(t *testing.T) {
	mockStatusRepo := &StatusMockRepo{
		GetStatusCodesFunc: func() ([]string, error) {
			return nil, fmt.Errorf("status database error")
		},
	}
	mockObservationRepo := &ObservationsMockRepo{}
	mockOnsetRepo := &OnsetsMockRepo{}

	record := CaseValidationRecord{
		Context: &BatchValidationContext{
			StatusRepo:      mockStatusRepo,
			ObservationRepo: mockObservationRepo,
			OnsetRepo:       mockOnsetRepo,
		},
	}

	err := record.fetchCodeInfos()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to retrieve status codes")
	assert.Contains(t, err.Error(), "status database error")
}

func Test_fetchCodeInfos_ObservationCodesError(t *testing.T) {
	mockStatusRepo := &StatusMockRepo{}
	mockObservationRepo := &ObservationsMockRepo{
		GetObservationCodesFunc: func() ([]string, error) {
			return nil, fmt.Errorf("observation database error")
		},
	}
	mockOnsetRepo := &OnsetsMockRepo{}

	record := CaseValidationRecord{
		Context: &BatchValidationContext{
			StatusRepo:      mockStatusRepo,
			ObservationRepo: mockObservationRepo,
			OnsetRepo:       mockOnsetRepo,
		},
	}

	err := record.fetchCodeInfos()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to retrieve observation codes")
	assert.Contains(t, err.Error(), "observation database error")
}

func Test_fetchCodeInfos_OnsetCodesError(t *testing.T) {
	mockStatusRepo := &StatusMockRepo{}
	mockObservationRepo := &ObservationsMockRepo{}
	mockOnsetRepo := &OnsetsMockRepo{
		GetOnsetCodesFunc: func() ([]string, error) {
			return nil, fmt.Errorf("onset database error")
		},
	}

	record := CaseValidationRecord{
		Context: &BatchValidationContext{
			StatusRepo:      mockStatusRepo,
			ObservationRepo: mockObservationRepo,
			OnsetRepo:       mockOnsetRepo,
		},
	}

	err := record.fetchCodeInfos()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to retrieve onset codes")
	assert.Contains(t, err.Error(), "onset database error")
}

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
		Patients: make(map[PatientKey]*types.Patient),
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

	validKey := PatientKey{"LAB-1", "PAT-1"}
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
		Documents:             make(map[string]*types.Document),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Patients:              make(map[PatientKey]*types.Patient),
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
	assert.Equal(t, "ALIQUOT-1", record.SequencingExperiments[200].Aliquot)
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
		Documents:             make(map[string]*types.Document),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Patients:              make(map[PatientKey]*types.Patient),
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
	assert.Equal(t, "ALIQUOT-1", record.SequencingExperiments[200].Aliquot)
	assert.Len(t, record.Patients, 1)
	validKey := PatientKey{"LAB-1", "PAT-1"}
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
	assert.Empty(t, record.SequencingExperiments)
	assert.Empty(t, record.Patients)
}

func Test_formatFieldPath_WithIndex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 2},
	}

	index := 1
	path := record.formatFieldPath("entity_type", &index, "", 0, "")
	assert.Equal(t, "case[2].entity_type[1]", path)
}

func Test_formatFieldPath_WithoutIndex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	path := record.formatFieldPath("entity_type", nil, "", 0, "")
	assert.Equal(t, "case[0].entity_type", path)
}

func Test_formatFieldPath_WithCollection(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	index := 3
	path := record.formatFieldPath("entity_type", &index, "sub_collection", 2, "")
	assert.Equal(t, "case[0].entity_type[3].sub_collection[2]", path)
}

func Test_formatFieldPath_WithCollectionAndField(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 5},
	}

	index := 0
	path := record.formatFieldPath("entity_type", &index, "sub_collection", 1, "field_name")
	assert.Equal(t, "case[5].entity_type[0].sub_collection[1].field_name", path)
}

func Test_formatCollectionPath(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 2},
	}

	path := record.formatCollectionPath("entity_type")
	assert.Equal(t, "case[2].entity_type", path)
}

// -----------------------------------------------------------------------------
// Section: Field Validation Tests
// -----------------------------------------------------------------------------

func Test_validateCaseField_Valid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("Valid-Value_123", "test_field", "case[0]", TextRegExpCompiled, TextRegExp, 100, true)

	assert.Empty(t, cr.Errors)
}

func Test_validateCaseField_EmptyOptional(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("", "test_field", "case[0]", TextRegExpCompiled, TextRegExp, 100, false)

	assert.Empty(t, cr.Errors)
}

func Test_validateCaseField_EmptyRequired(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("", "test_field", "case[0]", TextRegExpCompiled, TextRegExp, 100, true)

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field test_field for case 0")
	assert.Contains(t, cr.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
}

func Test_validateCaseField_InvalidRegex(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("Invalid@Value!", "test_field", "case[0]", TextRegExpCompiled, TextRegExp, 100, true)

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field test_field for case 0")
	assert.Contains(t, cr.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCaseField_TooLong(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	longValue := "A-very-long-value-that-exceeds-the-maximum-allowed-length-for-this-field-and-should-trigger-an-error"
	cr.validateCaseField(longValue, "test_field", "case[0]", TextRegExpCompiled, TextRegExp, 50, true)

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field test_field for case 0")
	assert.Contains(t, cr.Errors[0].Message, "field is too long, maximum length allowed is 50")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
}

func Test_validateCaseField_MultipleErrors(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
	}

	invalidValue := "Invalid@Value!-This-is-a-very-long-value-that-both-fails-regex-and-exceeds-maximum-length-constraints"
	cr.validateCaseField(invalidValue, "test_field", "case[0]", TextRegExpCompiled, TextRegExp, 50, true)

	assert.Len(t, cr.Errors, 2)
	assert.Contains(t, cr.Errors[0].Message, "does not match the regular expression")
	assert.Contains(t, cr.Errors[1].Message, "field is too long")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
	assert.Equal(t, InvalidFieldCase, cr.Errors[1].Code)
}

func Test_validateStatusCode_Valid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			StatusCode: "in_progress",
		},
		StatusCodes: []string{"in_progress", "incomplete", "completed"},
	}

	cr.validateStatusCode()

	assert.Empty(t, cr.Errors)
}

func Test_validateStatusCode_Invalid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			StatusCode: "unknown_status",
		},
		StatusCodes: []string{"in_progress", "revoke", "completed"},
	}

	cr.validateStatusCode()

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field status_code for case 0")
	assert.Contains(t, cr.Errors[0].Message, "status code \"unknown_status\" is not a valid status code")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

// -----------------------------------------------------------------------------
// Section: High-Level Validation Tests - validateCase
// -----------------------------------------------------------------------------

func Test_validateCase_Valid(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed", "unknown"},
		Case: types.CaseBatch{
			SubmitterCaseId:            "CASE-1",
			StatusCode:                 "completed",
			DiagnosticLabCode:          "LAB-1",
			AnalysisCode:               "WGA",
			OrderingOrganizationCode:   "LAB-2",
			PrimaryConditionCodeSystem: "HPO",
			PrimaryConditionValue:      "HP:0001234",
			ResolutionStatusCode:       "resolved",
			Note:                       "Test note",
			OrderingPhysician:          "Dr. Smith",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Empty(t, cr.Errors)
	assert.False(t, cr.Skipped)
}

func Test_validateCase_MissingProject(t *testing.T) {
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              nil,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-1",
			StatusCode:      "completed",
			ProjectCode:     "UNKNOWN-PROJ",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Project")
	assert.Contains(t, cr.Errors[0].Message, "UNKNOWN-PROJ")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, UnknownProjectCode, cr.Errors[0].Code)
}

func Test_validateCase_MissingDiagnosticLab(t *testing.T) {
	projectID := 42
	analysisID := 1
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         nil,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId:   "CASE-1",
			StatusCode:        "completed",
			DiagnosticLabCode: "UNKNOWN-LAB",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Diagnostic lab")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, UnknownDiagnosticLabCode, cr.Errors[0].Code)
}

func Test_validateCase_MissingAnalysisCatalog(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      nil,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-1",
			StatusCode:      "completed",
			AnalysisCode:    "UNKNOWN-ANALYSIS",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Analysis")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, UnknownAnalysisCode, cr.Errors[0].Code)
}

func Test_validateCase_MissingOrderingOrganization(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: nil,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId:          "CASE-1",
			StatusCode:               "completed",
			OrderingOrganizationCode: "UNKNOWN-ORG",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Ordering organization")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, UnknownOrderingOrganization, cr.Errors[0].Code)
}

func Test_validateCase_InvalidStatusCode(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed", "pending"},
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-1",
			StatusCode:      "invalid_status",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field status_code")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
}

func Test_validateCase_InvalidFieldFormat(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-1",
			StatusCode:      "completed",
			Note:            "Invalid@Characters!",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field note")
	assert.Contains(t, cr.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, InvalidFieldCase, cr.Errors[0].Code)
}

func Test_validateCase_CaseAlreadyExists(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			if submitterCaseId == "CASE-1" && projectId == 42 {
				return &repository.Case{ID: 100, SubmitterCaseID: "CASE-1"}, nil
			}
			return nil, nil
		},
	}

	ctx := &BatchValidationContext{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-1",
			StatusCode:      "completed",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "already exists")
	assert.Equal(t, CaseAlreadyExists, cr.Errors[0].Code)
	assert.True(t, cr.Skipped)
}

func Test_validateCase_MultipleErrors(t *testing.T) {
	projectID := 42
	analysisID := 1
	orderingOrgID := 20

	ctx := &BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         nil,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		Case: types.CaseBatch{
			SubmitterCaseId:   "CASE-1",
			StatusCode:        "invalid_status",
			DiagnosticLabCode: "UNKNOWN-LAB",
			Note:              "Invalid@Note!",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(cr.Errors), 3)

	// Check for diagnostic lab error
	hasLabError := false
	hasStatusError := false
	hasNoteError := false
	for _, e := range cr.Errors {
		if e.Code == UnknownDiagnosticLabCode {
			hasLabError = true
		}
		if e.Code == InvalidFieldCase && strings.Contains(e.Message, "status_code") {
			hasStatusError = true
		}
		if e.Code == InvalidFieldCase && strings.Contains(e.Message, "note") {
			hasNoteError = true
		}
	}
	assert.True(t, hasLabError, "Should have diagnostic lab error")
	assert.True(t, hasStatusError, "Should have status code error")
	assert.True(t, hasNoteError, "Should have note field error")
}

// -----------------------------------------------------------------------------
// Section: Batch Validation Tests
// -----------------------------------------------------------------------------

func Test_validateCaseBatch_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockPatients := PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			return nil, nil
		},
	}
	mockSamples := SamplesMockRepo{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(organizationCode string, submitterSampleId string) (*types.Sample, error) {
			if organizationCode == "LAB-1" && submitterSampleId == "SAMPLE-1" {
				return &types.Sample{
					ID:        1,
					PatientID: 1,
				}, nil
			}
			return nil, nil
		},
	}
	mockContext := BatchValidationContext{
		CasesRepo:       &mockRepo,
		ProjectRepo:     &mockRepo,
		PatientRepo:     &mockPatients,
		SeqExpRepo:      &mockRepo,
		OrgRepo:         &mockRepo,
		StatusRepo:      &StatusMockRepo{},
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
		SampleRepo:      &mockSamples,
	}

	vr, err := validateCaseBatch(&mockContext, []types.CaseBatch{
		{
			ProjectCode:                "PROJ-1",
			AnalysisCode:               "WGA",
			SubmitterCaseId:            "CASE-1",
			Type:                       "germline",
			StatusCode:                 "completed",
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
					SubmitterPatientId:      "PAT-1",
					PatientOrganizationCode: "CHUSJ",
					RelationToProbandCode:   "proband",
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
	mockPatients := PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			return nil, nil
		},
	}
	mockSamples := SamplesMockRepo{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(organizationCode string, submitterSampleId string) (*types.Sample, error) {
			if organizationCode == "LAB-1" && submitterSampleId == "SAMPLE-1" {
				return &types.Sample{
					ID:        1,
					PatientID: 1,
				}, nil
			}
			return nil, nil
		},
	}
	mockContext := BatchValidationContext{
		CasesRepo:       &mockRepo,
		ProjectRepo:     &mockRepo,
		PatientRepo:     &mockPatients,
		SeqExpRepo:      &mockRepo,
		OrgRepo:         &mockRepo,
		StatusRepo:      &StatusMockRepo{},
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
		SampleRepo:      &mockSamples,
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
				SubmitterPatientId:      "PAT-1",
				PatientOrganizationCode: "CHUSJ",
				RelationToProbandCode:   "proband",
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
	assert.Equal(t, vr[1].Errors[0].Code, "CASE-011")
	assert.Equal(t, vr[1].Errors[0].Message, "Case (PROJ-1 / CASE-1) appears multiple times in the batch.")
	assert.Equal(t, vr[1].Errors[0].Path, "case[1]")
}

// -----------------------------------------------------------------------------
// Section: Patient Field Validation Tests
// -----------------------------------------------------------------------------

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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldObservation, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldObservation, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0].note", record.Errors[0].Path)
}

func Test_validateObservationsCategorical_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		ObservationCodes:     []string{"phenotype", "condition"},
		OnsetCodes:           []string{"childhood", "juvenile"},
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

	err := record.validateObservationsCategorical(0)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateObservationsCategorical_MultipleErrors(t *testing.T) {
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

	err := record.validateObservationsCategorical(0)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 5) // code, system, value, onset_code, note
}

func Test_validateObservationsCategorical_NoObservations(t *testing.T) {
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

	err := record.validateObservationsCategorical(0)
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
							Code:  "note",
							Value: "Free text clinical note",
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
							Code:  "invalid_code",
							Value: "Free text clinical note",
						},
					},
				},
			},
		},
	}

	validCodes := []string{"note", "phenotype", "condition"}
	record.validateObsTextCode(0, 0, validCodes)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldObservation, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid observation code")
	assert.Equal(t, "case[0].patients[0].observations_text[0].code", record.Errors[0].Path)
}

func Test_validateObsTextValue_Valid(t *testing.T) {
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
							Code:  "note",
							Value: "Free text clinical note with details.",
						},
					},
				},
			},
		},
	}

	record.validateObsTextValue(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateObsTextValue_InvalidRegex(t *testing.T) {
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
							Code:  "note",
							Value: "Invalid@value",
						},
					},
				},
			},
		},
	}

	record.validateObsTextValue(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].observations_text[0].value", record.Errors[0].Path)
}

func Test_validateObsTextValue_TooLong(t *testing.T) {
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
							Code:  "note",
							Value: createString(101),
						},
					},
				},
			},
		},
	}

	record.validateObsTextValue(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidFieldPatients, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_text[0].value", record.Errors[0].Path)
}

func Test_validateObservationsText_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		ObservationCodes:     []string{"phenotype", "note"},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code:  "note",
							Value: "First clinical note",
						},
						{
							Code:  "phenotype",
							Value: "Phenotype description",
						},
					},
				},
			},
		},
	}

	err := record.validateObservationsText(0)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateObservationsText_MultipleErrors(t *testing.T) {
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
							Code:  "invalid_code",
							Value: "invalid@note",
						},
					},
				},
			},
		},
	}

	err := record.validateObservationsText(0)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 2) // code and note
}

func Test_validateObservationsText_NoObservations(t *testing.T) {
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

	err := record.validateObservationsText(0)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

// -----------------------------------------------------------------------------
// Section: Patient Entity Validation Tests
// -----------------------------------------------------------------------------

func Test_validatePatient_PatientExists(t *testing.T) {
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
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	record.validatePatient(0)
	assert.Empty(t, record.Errors)
}

func Test_validatePatient_PatientNotFound(t *testing.T) {
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

	record.validatePatient(0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, PatientNotFound, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Patient (CHUSJ / PAT-999)")
	assert.Contains(t, record.Errors[0].Message, "does not exist")
	assert.Equal(t, "case[0].patients[0]", record.Errors[0].Path)
}

func Test_validatePatient_MultiplePatients(t *testing.T) {
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
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	// Validate first patient - should pass
	record.validatePatient(0)
	assert.Empty(t, record.Errors)

	// Validate second patient - should fail
	record.validatePatient(1)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, PatientNotFound, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "PAT-999")
	assert.Equal(t, "case[0].patients[1]", record.Errors[0].Path)
}

// -----------------------------------------------------------------------------
// Section: Collection Validation Tests - validateCasePatients
// -----------------------------------------------------------------------------

func Test_validateCasePatients_NoProband(t *testing.T) {
	mockContext := &BatchValidationContext{
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "mother",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidNumberOfProbands, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "should have exactly 1 proband")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_MultipleProbands(t *testing.T) {
	mockContext := &BatchValidationContext{
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "proband",
				},
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-2",
					RelationToProbandCode:   "proband",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-2"}: {
				ID:                 2,
				SubmitterPatientId: "PAT-2",
			},
		},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidNumberOfProbands, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "should have exactly 1 proband")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_DuplicatePatient(t *testing.T) {
	mockContext := &BatchValidationContext{
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "proband",
				},
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "mother",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, DuplicatePatientInCase, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Duplicate patient (CHUSJ / PAT-1)")
	assert.Contains(t, record.Errors[0].Message, "for case 0")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_Valid(t *testing.T) {
	patientsBatch := []*types.CasePatientBatch{
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "PAT-1",
			RelationToProbandCode:   "proband",
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
			RelationToProbandCode:   "mother",
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
		OnsetCodes:           []string{"unknown"},
		ObservationCodes:     []string{"phenotype", "condition"},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patientsBatch,
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-2"}: {
				ID:                 2,
				SubmitterPatientId: "PAT-2",
			},
		},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCasePatients_WithErrors(t *testing.T) {
	mockContext := &BatchValidationContext{
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "INVALID-PAT-1",
					RelationToProbandCode:   "proband",
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
					RelationToProbandCode:   "proband",
					FamilyHistory: []*types.FamilyHistoryBatch{
						{
							FamilyMemberCode: "father",
							Condition:        "invalid@condition",
						},
					},
					ObservationsText: []*types.ObservationTextBatch{
						{
							Code:  "invalid_text_code",
							Value: "invalid@value",
						},
					},
				},
			},
		},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Equal(t, 10, len(record.Errors))
}

// -----------------------------------------------------------------------------
// Section: Sequencing Experiment Validation Tests
// -----------------------------------------------------------------------------

func Test_validateSeqExp_SeqExpExists(t *testing.T) {
	mockContext := &BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	err := record.validateSeqExp(0)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateSeqExp_SeqExpNotFound(t *testing.T) {
	mockContext := &BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "UNKNOWN-ALIQUOT",
					SubmitterSampleId:      "UNKNOWN-SAMPLE",
					SampleOrganizationCode: "UNKNOWN-ORG",
				},
			},
		},
	}

	err := record.validateSeqExp(0)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, SeqExpNotFound, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not exist")
	assert.Equal(t, "case[0].sequencing_experiments[0]", record.Errors[0].Path)
}

func Test_validateSeqExpSample_Valid(t *testing.T) {
	samplesMockRepo := &SamplesMockRepo{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(organizationCode string, submitterSampleId string) (*types.Sample, error) {
			if organizationCode == "LAB-1" && submitterSampleId == "SAMPLE-1" {
				return &types.Sample{
					ID:                1,
					PatientID:         100,
					SubmitterSampleId: "SAMPLE-1",
					OrganizationId:    10,
					HistologyCode:     "germline",
				}, nil
			}
			return nil, nil
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context: &BatchValidationContext{
			SampleRepo: samplesMockRepo,
		},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	sample, err := record.validateSeqExpSample(0)
	assert.NoError(t, err)
	assert.NotNil(t, sample)
	assert.Equal(t, 1, sample.ID)
	assert.Equal(t, 100, sample.PatientID)
	assert.Equal(t, "SAMPLE-1", sample.SubmitterSampleId)
	assert.Equal(t, "germline", sample.HistologyCode)
}

func Test_validateSeqExpSample_SampleNotFound(t *testing.T) {
	samplesMockRepo := &SamplesMockRepo{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(organizationCode string, submitterSampleId string) (*types.Sample, error) {
			return nil, nil
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context: &BatchValidationContext{
			SampleRepo: samplesMockRepo,
		},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "UNKNOWN-SAMPLE",
					SampleOrganizationCode: "UNKNOWN-ORG",
				},
			},
		},
	}

	sample, err := record.validateSeqExpSample(0)
	assert.NoError(t, err)
	assert.Nil(t, sample)
}

func Test_validateCaseSequencingExperiments_NoSeqExps(t *testing.T) {
	mockContext := BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              &mockContext,
		Case: types.CaseBatch{
			ProjectCode:           "PROJ-1",
			SubmitterCaseId:       "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{},
		},
	}

	err := record.validateCaseSequencingExperiments()
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCaseSequencingExperiments_MultipleSeqExps(t *testing.T) {
	mockContext := BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
		SampleRepo: &SamplesMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              &mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	err := record.validateCaseSequencingExperiments()
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCaseSequencingExperiments_WithErrors(t *testing.T) {
	mockSamples := SamplesMockRepo{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(organizationCode string, submitterSampleId string) (*types.Sample, error) {
			if organizationCode == "LAB-1" && submitterSampleId == "SAMPLE-1" {
				return &types.Sample{
					ID:        1,
					PatientID: 100,
				}, nil
			}
			return nil, nil
		},
	}
	mockContext := BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
		SampleRepo: &mockSamples,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              &mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
				{
					Aliquot:                "UNKNOWN-ALIQUOT",
					SubmitterSampleId:      "UNKNOWN-SAMPLE",
					SampleOrganizationCode: "UNKNOWN-ORG",
				},
				{
					Aliquot:                "ANOTHER-UNKNOWN",
					SubmitterSampleId:      "ANOTHER-SAMPLE",
					SampleOrganizationCode: "ANOTHER-ORG",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"}: {
				ID:                 100,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	err := record.validateCaseSequencingExperiments()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 2)
	assert.Equal(t, SeqExpNotFound, record.Errors[0].Code)
	assert.Equal(t, "case[0].sequencing_experiments[1]", record.Errors[0].Path)
	assert.Equal(t, SeqExpNotFound, record.Errors[1].Code)
	assert.Equal(t, "case[0].sequencing_experiments[2]", record.Errors[1].Path)
}

func Test_validateSeqExpPatientInCase_Valid(t *testing.T) {
	sample := &types.Sample{
		ID:        1,
		PatientID: 100,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"}: {
				ID:                 100,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	err := record.validateSeqExpPatientInCase(0, sample)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateSeqExpPatientInCase_PatientNotFound(t *testing.T) {
	sample := &types.Sample{
		ID:        1,
		PatientID: 999,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	err := record.validateSeqExpPatientInCase(0, sample)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, SeqExpNotFoundForCasePatient, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not belong to any patient from case 0")
	assert.Equal(t, "case[0].sequencing_experiments[0]", record.Errors[0].Path)
}

func Test_validateSeqExpPatientInCase_EmptyPatientsList(t *testing.T) {
	sample := &types.Sample{
		ID:        1,
		PatientID: 100,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	err := record.validateSeqExpPatientInCase(0, sample)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, SeqExpNotFoundForCasePatient, record.Errors[0].Code)
}

func Test_validateSeqExpCaseType_GermlineWithGermlineSample(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			Type:            "germline",
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	sample := &types.Sample{
		ID:            1,
		PatientID:     100,
		HistologyCode: "germline",
	}

	err := record.validateSeqExpCaseType(0, sample)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateSeqExpCaseType_GermlineWithTumoralSample(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			Type:            "germline",
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	sample := &types.Sample{
		ID:            1,
		PatientID:     100,
		HistologyCode: "tumoral",
	}

	err := record.validateSeqExpCaseType(0, sample)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidSeqExpForCaseType, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Tumor sequencing experiment")
	assert.Contains(t, record.Errors[0].Message, "should not be sequenced in a germline case")
	assert.Equal(t, "case[0].sequencing_experiments[0]", record.Errors[0].Path)
}

func Test_validateSeqExpCaseType_SomaticWithTumoralSample(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			Type:            "somatic",
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
			},
		},
	}

	sample := &types.Sample{
		ID:            1,
		PatientID:     100,
		HistologyCode: "tumoral",
	}

	err := record.validateSeqExpCaseType(0, sample)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCaseSequencingExperiments_WithCaseTypeValidation(t *testing.T) {
	mockSamples := SamplesMockRepo{
		GetSampleByOrgCodeAndSubmitterSampleIdFunc: func(organizationCode string, submitterSampleId string) (*types.Sample, error) {
			if organizationCode == "LAB-1" && submitterSampleId == "SAMPLE-1" {
				return &types.Sample{
					ID:            1,
					PatientID:     100,
					HistologyCode: "germline",
				}, nil
			}
			if organizationCode == "LAB-2" && submitterSampleId == "SAMPLE-2" {
				return &types.Sample{
					ID:            2,
					PatientID:     100,
					HistologyCode: "tumoral",
				}, nil
			}
			return nil, nil
		},
	}
	mockContext := BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
		SampleRepo: &mockSamples,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Context:              &mockContext,
		Case: types.CaseBatch{
			Type:            "germline",
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot:                "ALIQUOT-1",
					SubmitterSampleId:      "SAMPLE-1",
					SampleOrganizationCode: "LAB-1",
				},
				{
					Aliquot:                "ALIQUOT-2",
					SubmitterSampleId:      "SAMPLE-2",
					SampleOrganizationCode: "LAB-2",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"}: {
				ID:                 100,
				SubmitterPatientId: "PAT-1",
			},
		},
	}

	err := record.validateCaseSequencingExperiments()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidSeqExpForCaseType, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Tumor sequencing experiment")
	assert.Contains(t, record.Errors[0].Message, "LAB-2 / SAMPLE-2 / ALIQUOT-2")
	assert.Equal(t, "case[0].sequencing_experiments[1]", record.Errors[0].Path)
}
