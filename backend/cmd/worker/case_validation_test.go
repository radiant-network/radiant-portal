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

// -----------------------------------------------------------------------------
// Section: Validation Methods Tests
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
	mockContext := BatchValidationContext{
		CasesRepo:       &mockRepo,
		ProjectRepo:     &mockRepo,
		PatientRepo:     &mockPatients,
		SeqExpRepo:      &mockRepo,
		OrgRepo:         &mockRepo,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
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
	mockContext := BatchValidationContext{
		CasesRepo:       &mockRepo,
		ProjectRepo:     &mockRepo,
		PatientRepo:     &mockPatients,
		SeqExpRepo:      &mockRepo,
		OrgRepo:         &mockRepo,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
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
	assert.Equal(t, InvalidFieldObservationCode, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldObservationCode, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldObservationCode, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
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
	assert.Equal(t, InvalidFieldPatientsCode, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_text[0].value", record.Errors[0].Path)
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
							Code:  "invalid_code",
							Value: "invalid@note",
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

func Test_validateCasePatients_NoProband(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			return nil, nil
		},
	}
	mockContext := &BatchValidationContext{
		PatientRepo:     mockPatients,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	patients := []*types.CasePatientBatch{
		{
			PatientOrganizationCode: "CHUSJ",
			SubmitterPatientId:      "PAT-1",
			RelationToProbandCode:   "mother",
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

	err := record.validateCasePatients(mockContext, patients)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidNumberOfProbands, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "should have exactly 1 proband")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_MultipleProbands(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && (submitterPatientId == "PAT-1" || submitterPatientId == "PAT-2") {
				return &types.Patient{ID: 1, SubmitterPatientId: submitterPatientId}, nil
			}
			return nil, nil
		},
	}
	mockContext := &BatchValidationContext{
		PatientRepo:     mockPatients,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	patients := []*types.CasePatientBatch{
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
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patients,
		},
	}

	err := record.validateCasePatients(mockContext, patients)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, InvalidNumberOfProbands, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "should have exactly 1 proband")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_DuplicatePatient(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			if organizationCode == "CHUSJ" && submitterPatientId == "PAT-1" {
				return &types.Patient{ID: 1, SubmitterPatientId: "PAT-1"}, nil
			}
			return nil, nil
		},
	}
	mockContext := &BatchValidationContext{
		PatientRepo:     mockPatients,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	patients := []*types.CasePatientBatch{
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
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patients,
		},
	}

	err := record.validateCasePatients(mockContext, patients)
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1) // Only duplicate patient error (still has exactly 1 proband)

	assert.Equal(t, DuplicatePatientInCase, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Duplicate patient (CHUSJ / PAT-1)")
	assert.Contains(t, record.Errors[0].Message, "for case 0")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
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
	mockContext := &BatchValidationContext{
		PatientRepo:     mockPatients,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	patients := []*types.CasePatientBatch{
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
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patients,
		},
	}

	err := record.validateCasePatients(mockContext, patients)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCasePatients_Invalid(t *testing.T) {
	mockPatients := &PatientsMockRepo{
		GetPatientByOrgCodeAndSubmitterPatientIdFunc: func(organizationCode string, submitterPatientId string) (*types.Patient, error) {
			return nil, nil
		},
	}
	mockContext := &BatchValidationContext{
		PatientRepo:     mockPatients,
		ObservationRepo: &ObservationsMockRepo{},
		OnsetRepo:       &OnsetsMockRepo{},
	}

	patients := []*types.CasePatientBatch{
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
	}

	record := CaseValidationRecord{
		BaseValidationRecord: BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients:        patients,
		},
	}

	err := record.validateCasePatients(mockContext, patients)
	assert.NoError(t, err)
	assert.Equal(t, 10, len(record.Errors))
}
