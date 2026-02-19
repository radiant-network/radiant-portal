package main

import (
	"bytes"
	"context"
	"fmt"
	"regexp"
	"strings"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// -----------------------------------------------------------------------------
// Section: Repository Mocking
// -----------------------------------------------------------------------------

type CaseValidationMockRepo struct {
	GetCaseBySubmitterCaseIdAndProjectIdFunc func(submitterCaseId string, projectId int) (*repository.Case, error)
}

func (m *CaseValidationMockRepo) GetTaskTypeCodes() ([]types.TaskType, error) {
	return []types.TaskType{
		{types.ValueSet{Code: "alignment", NameEn: "Genome Alignment"}},
		{types.ValueSet{Code: "alignment_germline_variant_calling", NameEn: "Genome Alignment and Germline Variant calling"}},
		{types.ValueSet{Code: "family_variant_calling", NameEn: "Family Joint Genotyping"}},
		{types.ValueSet{Code: "somatic_variant_calling", NameEn: "Somatic Variant Calling by Tumor-Normal Paired Samples"}},
		{types.ValueSet{Code: "tumor_only_variant_calling", NameEn: "Somatic Variant Calling by Tumor-Only Sample"}},
		{types.ValueSet{Code: "radiant_germline_annotation", NameEn: "RADIANT Germline Annotation"}},
		{types.ValueSet{Code: "exomiser", NameEn: "Exomiser"}},
		{types.ValueSet{Code: "rnaseq_analysis", NameEn: "RNAseq Analysis of Transcriptome Profiling and Gene Fusion Calling"}},
	}, nil
}

func (m *CaseValidationMockRepo) GetTaskContextBySequencingExperimentId(seqExpId int) ([]*repository.TaskContext, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) CreateTask(task *repository.Task) error {
	return nil
}

func (m *CaseValidationMockRepo) CreateTaskContext(tc *repository.TaskContext) error {
	return nil
}

func (m *CaseValidationMockRepo) CreateTaskHasDocument(thd *repository.TaskHasDocument) error {
	return nil
}

func (m *CaseValidationMockRepo) GetTaskById(taskId int) (*repository.Task, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetTaskContextByTaskId(taskId int) ([]*repository.TaskContext, error) {
	return nil, nil
}

func (m *CaseValidationMockRepo) GetTaskHasDocumentByTaskId(taskId int) ([]*repository.TaskHasDocument, error) {
	return nil, nil
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
	} else if url == "file://bucket/error.bam" {
		return nil, fmt.Errorf("document service unavailable")
	} else if url == "file://bucket/task-error.bam" {
		return &types.Document{ID: 999, Url: url, Name: "task-error.bam"}, nil
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

func (m *CaseValidationMockRepo) GetTaskHasDocumentByDocumentId(docId int) ([]*types.TaskHasDocument, error) {
	if docId == 500 {
		return []*types.TaskHasDocument{
			{TaskID: 300, DocumentID: docId, Type: "output"},
		}, nil
	} else if docId == 999 {
		return nil, fmt.Errorf("database connection failed")
	}
	return nil, nil
}

func (m *CaseValidationMockRepo) GetOrganizationById(id int) (*types.Organization, error) {
	return nil, nil
}

// -----------------------------------------------------------------------------
// Section: Helper Methods Tests
// -----------------------------------------------------------------------------

type CodesMockRepo struct {
	GetCodesFunc func(setType repository.ValueSetType) ([]string, error)
}

func (m *CodesMockRepo) GetCodes(setType repository.ValueSetType) ([]string, error) {
	if m.GetCodesFunc != nil {
		return m.GetCodesFunc(setType)
	}

	switch setType {
	case repository.ValueSetStatus:
		return []string{"in_progress", "incomplete", "completed", "unknown"}, nil

	case repository.ValueSetOnset:
		return []string{"unknown", "antenatal", "congenital", "neonatal", "infantile", "childhood", "juvenile", "young_adult", "middle_age", "senior"}, nil

	case repository.ValueSetResolutionStatus:
		return []string{"solved", "unsolved", "inconclusive"}, nil

	case repository.ValueSetObservation:
		return []string{"phenotype", "condition", "note", "ancestry", "consanguinity"}, nil

	case repository.ValueSetPriority:
		return []string{"routine", "asap", "urgent", "stat"}, nil

	case repository.ValueSetCaseCategory:
		return []string{"prenatal", "postnatal"}, nil

	case repository.ValueSetAnalysisCatalog:
		return []string{"WGA", "WES", "Panel"}, nil

	case repository.ValueSetAffectedStatus:
		return []string{"affected", "unaffected", "unknown"}, nil

	case repository.ValueSetFamilyRelationship:
		return []string{"proband", "mother", "father", "sibling"}, nil

	case repository.ValueSetDataCategory:
		return []string{"clinical", "genomic"}, nil

	case repository.ValueSetDataType:
		return []string{"alignment", "snv", "ssnv", "gcnv", "igv"}, nil

	case repository.ValueSetFileFormat:
		return []string{"cram", "crai", "vcf", "tbi", "csv", "tsv", "gvcf"}, nil
	default:
		return nil, nil
	}
}

type ResolutionStatusMockRepo struct{}

func (m *ResolutionStatusMockRepo) GetResolutionStatusCodes() ([]string, error) {
	return []string{"solved", "unsolved", "inconclusive"}, nil
}

type SamplesMockRepo struct {
	GetSampleByOrgCodeAndSubmitterSampleIdFunc func(organizationCode string, submitterSampleId string) (*types.Sample, error)
}

func (m *SamplesMockRepo) GetSampleById(id int) (*repository.Sample, error) {
	return nil, nil
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
	assert.Contains(t, err.Error(), "failed to find proband patient {\"LAB-1\" \"PAT-3\"} for case 0")
	assert.Nil(t, proband)
}

func Test_validateRegexPattern_ValidPattern(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	record.ValidateRegexPattern(
		"case[0].field",
		"Valid-Value123",
		"testField",
		"TEST-001",
		"Test field",
		TextRegExpCompiled,
		[]string{},
	)

	assert.Empty(t, record.Errors)
}

func Test_validateRegexPattern_InvalidPattern(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	record.ValidateRegexPattern(
		"case",
		"case[0].field",
		"testField",
		"Invalid@Value",
		"TEST-001",
		TextRegExpCompiled,
		[]string{},
	)

	assert.Len(t, record.Errors, 1)
	assert.Equal(t, "TEST-001", record.Errors[0].Code)
	assert.Equal(t, "case[0].field", record.Errors[0].Path)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
}

func Test_validateRegexPattern_EmptyValue(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	record.ValidateRegexPattern(
		"case",
		"case[0].field",
		"fieldName",
		"",
		"TEST-001",
		TextRegExpCompiled,
		[]string{},
	)

	assert.Len(t, record.Errors, 1)
	assert.Equal(t, "TEST-001", record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
}

func Test_validateRegexPattern_FamilyMemberCode(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	// Valid family member code
	record.ValidateRegexPattern(
		"case",
		"case[0].patients[0].family_history[0]",
		"familyMemberCode",
		"Mother-Paternal",
		"PATIENT-004",
		FamilyMemberCodeRegExpCompiled,
		[]string{},
	)

	assert.Empty(t, record.Errors)

	// Invalid family member code (contains numbers)
	record.ValidateRegexPattern(
		"case",
		"case[0].patients[0].family_history[1]",
		"familyMemberCode",
		"Mother123",
		"PATIENT-004",
		FamilyMemberCodeRegExpCompiled,
		[]string{},
	)

	assert.Len(t, record.Errors, 1)
	assert.Equal(t, "PATIENT-004", record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
}

func Test_validateTextLength_ValidLength(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	record.ValidateTextLength(
		"case[0].field",
		"Short text",
		"testField",
		"TEST-002",
		"Test field",
		100,
		[]string{},
	)

	assert.Empty(t, record.Errors)
}

func Test_validateTextLength_ExceedsMaxLength(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	longText := strings.Repeat("a", 101)
	record.ValidateTextLength(
		"case",
		"case[0].field",
		"testField",
		longText,
		"TEST-002",
		100,
		[]string{},
	)

	assert.Len(t, record.Errors, 1)
	assert.Equal(t, "TEST-002", record.Errors[0].Code)
	assert.Equal(t, "case[0].field", record.Errors[0].Path)
	assert.Contains(t, record.Errors[0].Message, "field is too long, maximum length allowed is 100.")
}

func Test_validateTextLength_EmptyString(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	record.ValidateTextLength(
		"case[0].field",
		"",
		"testField",
		"TEST-002",
		"Test field",
		100,
		[]string{},
	)

	assert.Empty(t, record.Errors)
}

func Test_validateTextLength_ExactlyMaxLength(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	exactText := strings.Repeat("a", 100)
	record.ValidateTextLength(
		"case[0].field",
		exactText,
		"testField",
		"TEST-002",
		"Test field",
		100,
		[]string{},
	)

	assert.Empty(t, record.Errors)
}

func Test_validateTextLength_NoteMaxLength(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	// Test with NoteMaxLength constant
	longText := strings.Repeat("a", NoteMaxLength+1)
	record.ValidateTextLength(
		"case",
		"case[0].note",
		"note",
		longText,
		CaseInvalidField,
		NoteMaxLength,
		[]string{},
	)

	assert.Len(t, record.Errors, 1)
	assert.Equal(t, CaseInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, fmt.Sprintf("maximum length allowed is %d", NoteMaxLength))
}

// -----------------------------------------------------------------------------
// Section: Fetching Methods Tests
// -----------------------------------------------------------------------------

func Test_fetchStatusCodes_OK(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: &CodesMockRepo{},
	}

	record := CaseValidationRecord{Context: mockContext}

	err := record.fetchStatusCodes()
	assert.NoError(t, err)
	assert.NotNil(t, record.StatusCodes)
	assert.Equal(t, record.StatusCodes, []string{"in_progress", "incomplete", "completed", "unknown"})
}

func Test_fetchStatusCodes_Error(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: mockRepo,
	}

	record := CaseValidationRecord{Context: mockContext}

	err := record.fetchStatusCodes()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving status codes")
	assert.Contains(t, err.Error(), "database connection failed")
	assert.Nil(t, record.StatusCodes)
}

func Test_fetchObservationCodes_OK(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: &CodesMockRepo{},
	}

	record := CaseValidationRecord{Context: mockContext}

	err := record.fetchObservationCodes()
	assert.NoError(t, err)
	assert.NotNil(t, record.ObservationCodes)
	assert.Equal(t, record.ObservationCodes, []string{"phenotype", "condition", "note", "ancestry", "consanguinity"})
}

func Test_fetchObservationCodes_Error(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: mockRepo,
	}

	record := CaseValidationRecord{Context: mockContext}

	err := record.fetchObservationCodes()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving observation codes")
	assert.Contains(t, err.Error(), "database connection failed")
	assert.Nil(t, record.ObservationCodes)
}

func Test_fetchOnsetCodes_OK(t *testing.T) {
	mockRepo := &CodesMockRepo{}
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: mockRepo,
	}

	record := CaseValidationRecord{Context: mockContext}

	err := record.fetchOnsetCodes()
	assert.NoError(t, err)
	assert.NotNil(t, record.OnsetCodes)
	assert.Equal(t, record.OnsetCodes, []string{"unknown", "antenatal", "congenital", "neonatal", "infantile", "childhood", "juvenile", "young_adult", "middle_age", "senior"})
}

func Test_fetchOnsetCodes_Error(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: mockRepo,
	}

	record := CaseValidationRecord{Context: mockContext}

	err := record.fetchOnsetCodes()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving onset codes")
	assert.Contains(t, err.Error(), "database connection failed")
	assert.Nil(t, record.OnsetCodes)
}

func Test_fetchCodeInfos_OK(t *testing.T) {
	record := CaseValidationRecord{
		Context: &batchval.BatchValidationContext{
			ValueSetsRepo: &CodesMockRepo{},
			TaskRepo:      &CaseValidationMockRepo{},
		},
	}

	err := record.fetchCodeInfos()
	assert.NoError(t, err)
	assert.NotNil(t, record.StatusCodes)
	assert.NotNil(t, record.ObservationCodes)
	assert.NotNil(t, record.OnsetCodes)
	assert.Equal(t, record.StatusCodes, []string{"in_progress", "incomplete", "completed", "unknown"})
	assert.Equal(t, record.ObservationCodes, []string{"phenotype", "condition", "note", "ancestry", "consanguinity"})
	assert.Equal(t, record.OnsetCodes, []string{"unknown", "antenatal", "congenital", "neonatal", "infantile", "childhood", "juvenile", "young_adult", "middle_age", "senior"})
}

func Test_fetchCodeInfos_StatusCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}

	record := CaseValidationRecord{
		Context: &batchval.BatchValidationContext{
			ValueSetsRepo: mockRepo,
		},
	}

	err := record.fetchCodeInfos()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to retrieve status codes")
	assert.Contains(t, err.Error(), "database connection failed")
}

func Test_fetchCodeInfos_ObservationCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}

	record := CaseValidationRecord{
		Context: &batchval.BatchValidationContext{
			ValueSetsRepo: mockRepo,
		},
	}

	err := record.fetchObservationCodes()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving observation codes")
	assert.Contains(t, err.Error(), "database connection failed")
}

func Test_fetchCodeInfos_OnsetCodesError(t *testing.T) {
	mockRepo := &CodesMockRepo{
		GetCodesFunc: func(setType repository.ValueSetType) ([]string, error) {
			return nil, fmt.Errorf("database connection failed")
		},
	}

	record := CaseValidationRecord{
		Context: &batchval.BatchValidationContext{
			ValueSetsRepo: mockRepo,
		},
	}

	err := record.fetchOnsetCodes()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error retrieving onset codes")
	assert.Contains(t, err.Error(), "database connection failed")
}

func Test_fetchTaskTypeCodes_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		TaskRepo: &mockRepo,
	}
	mockRecord := CaseValidationRecord{
		Context: &mockContext,
	}

	err := mockRecord.fetchTaskTypeCodes()
	assert.NoError(t, err)
	assert.Equal(t, []string{
		"alignment",
		"alignment_germline_variant_calling",
		"family_variant_calling",
		"somatic_variant_calling",
		"tumor_only_variant_calling",
		"radiant_germline_annotation",
		"exomiser",
		"rnaseq_analysis",
	}, mockRecord.TaskTypeCodes)
}

func Test_fetchProject_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			ProjectCode: "PROJ-1",
		},
	}

	err := record.fetchProject()
	assert.NoError(t, err)
	assert.NotNil(t, record.ProjectID)
	assert.Equal(t, 42, *record.ProjectID)
}

func Test_fetchProject_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			ProjectCode: "PROJ-2",
		},
	}

	err := record.fetchProject()
	assert.NoError(t, err)
	assert.Nil(t, record.ProjectID)
}

func Test_fetchProject_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		ProjectRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			ProjectCode: "PROJ-ERROR",
		},
	}

	err := record.fetchProject()
	assert.Error(t, err)
	assert.Nil(t, record.ProjectID)
}

func Test_fetchAnalysisCatalog_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		CasesRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			AnalysisCode: "WGA",
		},
	}

	err := record.fetchAnalysisCatalog()
	assert.NoError(t, err)
	assert.NotNil(t, record.AnalysisCatalogID)
	assert.Equal(t, 1, *record.AnalysisCatalogID)
}

func Test_fetchAnalysisCatalog_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		CasesRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			AnalysisCode: "WPGA",
		},
	}

	err := record.fetchAnalysisCatalog()
	assert.NoError(t, err)
	assert.Nil(t, record.AnalysisCatalogID)
}

func Test_fetchAnalysisCatalog_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		CasesRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			AnalysisCode: "WGA-ERROR",
		},
	}

	err := record.fetchAnalysisCatalog()
	assert.Error(t, err)
	assert.Nil(t, record.AnalysisCatalogID)
}

func Test_fetchOrganizations_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		OrgRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-1",
			DiagnosticLabCode:        "LAB-2",
		},
	}

	err := record.fetchOrganizations()
	assert.NoError(t, err)
	assert.NotNil(t, record.OrderingOrganizationID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.NotNil(t, record.DiagnosisLabID)
	assert.Equal(t, 20, *record.DiagnosisLabID)
}

func Test_fetchOrganizations_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		OrgRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-1",
			DiagnosticLabCode:        "LAB-3",
		},
	}

	err := record.fetchOrganizations()
	assert.NoError(t, err)
	assert.NotNil(t, record.OrderingOrganizationID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)
}

func Test_fetchOrganizations_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		OrgRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-ERROR",
			DiagnosticLabCode:        "LAB-2",
		},
	}

	err := record.fetchOrganizations()
	assert.Error(t, err)
	assert.Nil(t, record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)

	record = CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			OrderingOrganizationCode: "LAB-1",
			DiagnosticLabCode:        "LAB-ERROR",
		},
	}

	err = record.fetchOrganizations()
	assert.Error(t, err)
	assert.NotNil(t, record.OrderingOrganizationID)
	assert.Equal(t, 10, *record.OrderingOrganizationID)
	assert.Nil(t, record.DiagnosisLabID)
}

func Test_fetchPatients_PartialOK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		PatientRepo: &mockRepo,
	}

	record := CaseValidationRecord{
		Context:  &mockContext,
		Patients: make(map[PatientKey]*types.Patient),
		Case: types.CaseBatch{
			Patients: []*types.CasePatientBatch{
				{PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-1"},
				{PatientOrganizationCode: "LAB-1", SubmitterPatientId: "PAT-NOT-EXIST"},
			},
		},
	}

	err := record.fetchPatients()
	assert.NoError(t, err)

	assert.Len(t, record.Patients, 1)

	validKey := PatientKey{"LAB-1", "PAT-1"}
	assert.Contains(t, record.Patients, validKey)
	assert.Equal(t, 100, record.Patients[validKey].ID)
}

func Test_fetchFromTasks_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &mockRepo,
		DocRepo:    &mockRepo,
		TaskRepo:   &mockRepo,
	}

	record := CaseValidationRecord{
		Context:               &mockContext,
		Documents:             make(map[string]*types.Document),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Patients:              make(map[PatientKey]*types.Patient),
		DocumentsInTasks:      make(map[string][]*DocumentRelation),
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-TASK-TEST",
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquots: []string{"ALIQUOT-1"},
					InputDocuments: []*types.InputDocumentBatch{
						{Url: "file://bucket/file.bam"},
					},
				},
			},
		},
	}

	err := record.fetchFromTasks()
	assert.NoError(t, err)
	assert.Len(t, record.SequencingExperiments, 1)
	assert.Equal(t, "ALIQUOT-1", record.SequencingExperiments[200].Aliquot)
	assert.Len(t, record.Documents, 1)
	assert.Contains(t, record.Documents, "file://bucket/file.bam")
	assert.Equal(t, 500, record.Documents["file://bucket/file.bam"].ID)
}

func Test_fetchFromTasks_DocumentError(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &mockRepo,
		DocRepo:    &mockRepo,
		TaskRepo:   &mockRepo,
	}

	record := CaseValidationRecord{
		Context:               &mockContext,
		Documents:             make(map[string]*types.Document),
		SequencingExperiments: make(map[int]*types.SequencingExperiment),
		Patients:              make(map[PatientKey]*types.Patient),
		DocumentsInTasks:      make(map[string][]*DocumentRelation),
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-FAIL",
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquots: []string{"ALIQUOT-1"},
					InputDocuments: []*types.InputDocumentBatch{
						{Url: "file://bucket/error.bam"},
					},
				},
			},
		},
	}

	err := record.fetchFromTasks()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to get document by url")
}

func Test_fetchFromTasks_SeqExpError(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &mockRepo,
		DocRepo:    &mockRepo,
		TaskRepo:   &mockRepo,
	}

	record := CaseValidationRecord{
		Context: &mockContext,
		Case: types.CaseBatch{
			SubmitterCaseId: "CASE-FAIL",
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquots: []string{"ALIQUOT-ERROR"},
				},
			},
		},
	}

	err := record.fetchFromTasks()
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "failed to get sequencing experiment by aliquot")
}

func Test_fetchValidationInfos_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		CasesRepo:   &mockRepo,
		ProjectRepo: &mockRepo,
		PatientRepo: &mockRepo,
		SeqExpRepo:  &mockRepo,
		OrgRepo:     &mockRepo,
		TaskRepo:    &mockRepo,
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
	mockContext := batchval.BatchValidationContext{
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

func Test_formatFieldPath_WithEntityAndIndex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 2},
	}

	index := 1
	path := record.formatFieldPath("entity_type", &index, "", nil)
	assert.Equal(t, "case[2].entity_type[1]", path)
}

func Test_formatFieldPath_WithoutEntity(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	path := record.formatFieldPath("", nil, "", nil)
	assert.Equal(t, "case[0]", path)
}

func Test_formatFieldPath_WithoutIndex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	path := record.formatFieldPath("entity_type", nil, "", nil)
	assert.Equal(t, "case[0].entity_type", path)
}

func Test_formatFieldPath_WithCollection(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	index := 3
	path := record.formatFieldPath("entity_type", &index, "sub_collection", nil)
	assert.Equal(t, "case[0].entity_type[3].sub_collection", path)
}

func Test_formatFieldPath_WithCollectionAndIndex(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 5},
	}

	index := 0
	collectionIndex := 1
	path := record.formatFieldPath("entity_type", &index, "sub_collection", &collectionIndex)
	assert.Equal(t, "case[5].entity_type[0].sub_collection[1]", path)
}

func Test_fetchSequencingExperimentsInTask_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		Aliquots: []string{"ALIQUOT-1"},
	}
	err := record.fetchSequencingExperimentsInTask(&task)
	assert.NoError(t, err)
	assert.Len(t, record.SequencingExperiments, 1)
	assert.Equal(t, 200, record.SequencingExperiments[200].ID)
	assert.Equal(t, "ALIQUOT-1", record.SequencingExperiments[200].Aliquot)
}

func Test_fetchSequencingExperimentsInTask_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		Aliquots: []string{"ALIQUOT-999"},
	}
	err := record.fetchSequencingExperimentsInTask(&task)
	assert.NoError(t, err)
	assert.Len(t, record.SequencingExperiments, 0)
}

func Test_fetchSequencingExperimentsInTask_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		Aliquots: []string{"ALIQUOT-ERROR"},
	}
	err := record.fetchSequencingExperimentsInTask(&task)
	assert.Error(t, err)
	assert.Len(t, record.SequencingExperiments, 0)
}

func Test_fetchInputDocumentsFromTask_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		DocRepo:  &mockRepo,
		TaskRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		InputDocuments: []*types.InputDocumentBatch{{
			Url: "file://bucket/file.bam",
		}},
	}
	err := record.fetchInputDocumentsFromTask(&task)
	assert.NoError(t, err)
	assert.Len(t, record.Documents, 1)
	assert.Equal(t, 500, record.Documents["file://bucket/file.bam"].ID)
}

func Test_fetchInputDocumentsFromTask_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		DocRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		InputDocuments: []*types.InputDocumentBatch{{
			Url: "file://bucket/unknown.bam",
		}},
	}
	err := record.fetchInputDocumentsFromTask(&task)
	assert.NoError(t, err)
	assert.Len(t, record.Documents, 0)
}

func Test_fetchInputDocumentsFromTask_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		DocRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		InputDocuments: []*types.InputDocumentBatch{{
			Url: "file://bucket/error.bam",
		}},
	}
	err := record.fetchInputDocumentsFromTask(&task)
	assert.Error(t, err)
	assert.Len(t, record.Documents, 0)
}

func Test_fetchOutputDocumentsFromTask_OK(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		DocRepo:  &mockRepo,
		TaskRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		OutputDocuments: []*types.OutputDocumentBatch{{
			Url: "file://bucket/file.bam",
		}},
	}
	err := record.fetchOutputDocumentsFromTask(&task)
	assert.NoError(t, err)
	assert.Len(t, record.Documents, 1)
	assert.Equal(t, 500, record.Documents["file://bucket/file.bam"].ID)
	assert.Len(t, record.DocumentsInTasks, 1)
	assert.Len(t, record.DocumentsInTasks["file://bucket/file.bam"], 1)
	assert.Equal(t, 300, record.DocumentsInTasks["file://bucket/file.bam"][0].TaskID)
	assert.Equal(t, "output", record.DocumentsInTasks["file://bucket/file.bam"][0].Type)
}

func Test_fetchOutputDocumentsFromTask_NotFound(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		DocRepo:  &mockRepo,
		TaskRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		OutputDocuments: []*types.OutputDocumentBatch{{
			Url: "file://bucket/unknown.bam",
		}},
	}
	err := record.fetchOutputDocumentsFromTask(&task)
	assert.NoError(t, err)
	assert.Len(t, record.Documents, 0)
	assert.Len(t, record.DocumentsInTasks, 0)
}

func Test_fetchOutputDocumentsFromTask_Error(t *testing.T) {
	mockRepo := CaseValidationMockRepo{}
	mockContext := batchval.BatchValidationContext{
		DocRepo:  &mockRepo,
		TaskRepo: &mockRepo,
	}
	record := NewCaseValidationRecord(&mockContext, types.CaseBatch{}, 0)

	task := types.CaseTaskBatch{
		OutputDocuments: []*types.OutputDocumentBatch{{
			Url: "file://bucket/task-error.bam",
		}},
	}
	err := record.fetchOutputDocumentsFromTask(&task)
	assert.Error(t, err)
	assert.Len(t, record.Documents, 1)
	assert.Equal(t, 999, record.Documents["file://bucket/task-error.bam"].ID)
	assert.Len(t, record.DocumentsInTasks, 0)
}

// -----------------------------------------------------------------------------
// Section: Field Validation Tests
// -----------------------------------------------------------------------------

func Test_validateCaseField_Valid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("Valid-Value_123", "test_field", "case[0]", TextRegExpCompiled, 100, true)

	assert.Empty(t, cr.Errors)
}

func Test_validateCaseField_EmptyOptional(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("", "test_field", "case[0]", TextRegExpCompiled, 100, false)

	assert.Empty(t, cr.Errors)
}

func Test_validateCaseField_EmptyRequired(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("", "test_field", "case[0]", TextRegExpCompiled, 100, true)

	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, cr.Errors[0].Message, "Invalid field test_field for case 0. Reason: field is empty.")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCaseField_InvalidRegex(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	cr.validateCaseField("Invalid@Value!", "test_field", "case[0]", TextRegExpCompiled, 100, true)

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field test_field for case 0")
	assert.Contains(t, cr.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCaseField_TooLong(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	longValue := "A-very-long-value-that-exceeds-the-maximum-allowed-length-for-this-field-and-should-trigger-an-error"
	cr.validateCaseField(longValue, "test_field", "case[0]", TextRegExpCompiled, 50, true)

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field test_field for case 0")
	assert.Contains(t, cr.Errors[0].Message, "field is too long, maximum length allowed is 50")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCaseField_MultipleErrors(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
	}

	invalidValue := "Invalid@Value!-This-is-a-very-long-value-that-both-fails-regex-and-exceeds-maximum-length-constraints"
	cr.validateCaseField(invalidValue, "test_field", "case[0]", TextRegExpCompiled, 50, true)

	assert.Len(t, cr.Errors, 2)
	assert.Contains(t, cr.Errors[0].Message, "field is too long")
	assert.Contains(t, cr.Errors[1].Message, "does not match the regular expression")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
	assert.Equal(t, CaseInvalidField, cr.Errors[1].Code)
	assert.Equal(t, "case[0]", cr.Errors[1].Path)
}

func Test_validateStatusCode_Valid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			StatusCode:           "in_progress",
			ResolutionStatusCode: "unsolved",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "wgs",
		},
		StatusCodes:           []string{"in_progress", "revoke", "completed"},
		ResolutionStatusCodes: []string{"solved", "unsolved", "unknown"},
		PriorityCodes:         []string{"routine"},
		CategoryCodes:         []string{"clinical"},
	}

	cr.validateCodes()

	assert.Empty(t, cr.Errors)
}

func Test_validateResolutionStatusCode_Valid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			StatusCode:           "in_progress",
			ResolutionStatusCode: "unsolved",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "wgs",
		},
		StatusCodes:           []string{"in_progress", "revoke", "completed"},
		ResolutionStatusCodes: []string{"solved", "unsolved", "unknown"},
		PriorityCodes:         []string{"routine"},
		CategoryCodes:         []string{"clinical"},
	}

	cr.validateCodes()

	assert.Empty(t, cr.Errors)
}

func Test_validateStatusCode_Invalid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			StatusCode:           "unknown_status",
			ResolutionStatusCode: "unsolved",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "wgs",
		},
		StatusCodes:           []string{"in_progress", "revoke", "completed"},
		ResolutionStatusCodes: []string{"solved", "unsolved", "unknown"},
		PriorityCodes:         []string{"routine"},
		CategoryCodes:         []string{"clinical"},
	}

	cr.validateCodes()

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field status_code for case 0")
	assert.Contains(t, cr.Errors[0].Message, "status code \"unknown_status\" is not a valid status code")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateResolutionStatusCode_Invalid(t *testing.T) {
	cr := &CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Case: types.CaseBatch{
			StatusCode:           "in_progress",
			ResolutionStatusCode: "nan",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "wgs",
		},
		StatusCodes:           []string{"in_progress", "revoke", "completed"},
		ResolutionStatusCodes: []string{"solved", "unsolved", "unknown"},
		PriorityCodes:         []string{"routine"},
		CategoryCodes:         []string{"clinical"},
	}

	cr.validateCodes()

	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field resolution_status_code for case 0")
	assert.Contains(t, cr.Errors[0].Message, "resolution status code \"nan\" is not a valid resolution status code")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
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

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed", "unknown"},
		ResolutionStatusCodes:  []string{"solved", "unsolved", "unknown"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:            "CASE-1",
			StatusCode:                 "completed",
			DiagnosticLabCode:          "LAB-1",
			AnalysisCode:               "WGA",
			OrderingOrganizationCode:   "LAB-2",
			PrimaryConditionCodeSystem: "HPO",
			PrimaryConditionValue:      "HP:0001234",
			ResolutionStatusCode:       "solved",
			Note:                       "Test note",
			OrderingPhysician:          "Dr. Smîth",
			PriorityCode:               "routine",
			CategoryCode:               "clinical",
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

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              nil,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:      "CASE-1",
			StatusCode:           "completed",
			ResolutionStatusCode: "solved",
			ProjectCode:          "UNKNOWN-PROJ",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "WGA",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Project")
	assert.Contains(t, cr.Errors[0].Message, "UNKNOWN-PROJ")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, CaseUnknownProject, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCase_MissingDiagnosticLab(t *testing.T) {
	projectID := 42
	analysisID := 1
	orderingOrgID := 20

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         nil,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:      "CASE-1",
			StatusCode:           "completed",
			ResolutionStatusCode: "solved",
			DiagnosticLabCode:    "UNKNOWN-LAB",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "WGA",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Diagnostic lab")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, CaseUnknownDiagnosticLab, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCase_MissingAnalysisCatalog(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	orderingOrgID := 20

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      nil,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:      "CASE-1",
			StatusCode:           "completed",
			ResolutionStatusCode: "solved",
			AnalysisCode:         "UNKNOWN-ANALYSIS",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Analysis")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, CaseUnknownAnalysisCode, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCase_MissingOrderingOrganization(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: nil,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:          "CASE-1",
			StatusCode:               "completed",
			ResolutionStatusCode:     "solved",
			OrderingOrganizationCode: "UNKNOWN-ORG",
			PriorityCode:             "routine",
			CategoryCode:             "clinical",
			AnalysisCode:             "WGA",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Ordering organization")
	assert.Contains(t, cr.Errors[0].Message, "does not exist")
	assert.Equal(t, CaseUnknownOrderingOrganization, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCase_InvalidStatusCode(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed", "pending"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:      "CASE-1",
			StatusCode:           "invalid_status",
			ResolutionStatusCode: "solved",
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "WGA",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Contains(t, cr.Errors[0].Message, "Invalid field status_code")
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
}

func Test_validateCase_InvalidFieldFormat(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "CASE-1",
		StatusCodes:            []string{"completed"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:      "CASE-1",
			StatusCode:           "completed",
			ResolutionStatusCode: "solved",
			Note:                 strings.Repeat("a", 1001),
			PriorityCode:         "routine",
			CategoryCode:         "clinical",
			AnalysisCode:         "WGA",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Len(t, cr.Errors, 1)
	assert.Equal(t, "Invalid field note for case 0. Reason: field is too long, maximum length allowed is 1000.", cr.Errors[0].Message)
	assert.Equal(t, CaseInvalidField, cr.Errors[0].Code)
	assert.Equal(t, "case[0]", cr.Errors[0].Path)
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

	ctx := &batchval.BatchValidationContext{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
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
	assert.Len(t, cr.Infos, 1)
	assert.Contains(t, cr.Infos[0].Message, "already exists")
	assert.Equal(t, CaseAlreadyExists, cr.Infos[0].Code)
	assert.True(t, cr.Skipped)
	assert.Equal(t, "case[0]", cr.Infos[0].Path)
}

func Test_validateCase_MultipleErrors(t *testing.T) {
	projectID := 42
	analysisID := 1
	orderingOrgID := 20

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
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
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.GreaterOrEqual(t, len(cr.Errors), 2)

	// Check for diagnostic lab error
	hasLabError := false
	hasStatusError := false
	for _, e := range cr.Errors {
		if e.Code == CaseUnknownDiagnosticLab {
			hasLabError = true
		}
		if e.Code == CaseInvalidField && strings.Contains(e.Message, "status_code") {
			hasStatusError = true
		}
	}
	assert.True(t, hasLabError, "Should have diagnostic lab error")
	assert.True(t, hasStatusError, "Should have status code error")
}

func Test_validateCase_OptionalSubmitterCaseId(t *testing.T) {
	projectID := 42
	diagnosisLabID := 10
	analysisID := 1
	orderingOrgID := 20

	ctx := &batchval.BatchValidationContext{}
	mockRepo := &CaseValidationMockRepo{}
	ctx.CasesRepo = mockRepo

	cr := &CaseValidationRecord{
		BaseValidationRecord:   batchval.BaseValidationRecord{Index: 0},
		Context:                ctx,
		ProjectID:              &projectID,
		DiagnosisLabID:         &diagnosisLabID,
		AnalysisCatalogID:      &analysisID,
		OrderingOrganizationID: &orderingOrgID,
		SubmitterCaseID:        "",
		StatusCodes:            []string{"completed", "unknown"},
		ResolutionStatusCodes:  []string{"solved"},
		PriorityCodes:          []string{"routine", "urgent"},
		CategoryCodes:          []string{"research", "clinical"},
		Case: types.CaseBatch{
			SubmitterCaseId:            "CASE-1",
			StatusCode:                 "completed",
			DiagnosticLabCode:          "LAB-1",
			AnalysisCode:               "WGA",
			OrderingOrganizationCode:   "LAB-2",
			PrimaryConditionCodeSystem: "HPO",
			PrimaryConditionValue:      "HP:0001234",
			ResolutionStatusCode:       "solved",
			Note:                       "Test note",
			OrderingPhysician:          "Dr. Smith",
			PriorityCode:               "routine",
			CategoryCode:               "clinical",
		},
	}

	err := cr.validateCase()

	assert.NoError(t, err)
	assert.Empty(t, cr.Errors)
	assert.False(t, cr.Skipped)
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
	mockContext := batchval.BatchValidationContext{
		CasesRepo:     &mockRepo,
		ProjectRepo:   &mockRepo,
		PatientRepo:   &mockPatients,
		SeqExpRepo:    &mockRepo,
		OrgRepo:       &mockRepo,
		ValueSetsRepo: &CodesMockRepo{},
		SampleRepo:    &mockSamples,
		TaskRepo:      &mockRepo,
	}

	vr, err := validateCaseBatch(&mockContext, []types.CaseBatch{
		{
			ProjectCode:                "PROJ-1",
			AnalysisCode:               "WGA",
			SubmitterCaseId:            "CASE-1",
			Type:                       "germline",
			StatusCode:                 "completed",
			ResolutionStatusCode:       "solved",
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
					AffectedStatusCode:      "affected",
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
	mockContext := batchval.BatchValidationContext{
		CasesRepo:     &mockRepo,
		ProjectRepo:   &mockRepo,
		PatientRepo:   &mockPatients,
		SeqExpRepo:    &mockRepo,
		OrgRepo:       &mockRepo,
		ValueSetsRepo: &CodesMockRepo{},
		SampleRepo:    &mockSamples,
		TaskRepo:      &mockRepo,
	}
	batch := types.CaseBatch{
		ProjectCode:                "PROJ-1",
		AnalysisCode:               "WGA",
		SubmitterCaseId:            "CASE-1",
		Type:                       "germline",
		StatusCode:                 "in_progress",
		ResolutionStatusCode:       "solved",
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
				AffectedStatusCode:      "affected",
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, PatientInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].family_history[0]", record.Errors[0].Path)
}

func Test_validateFamilyMemberCode_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, PatientInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Contains(t, record.Errors[0].Message, "maximum length allowed is 100")
	assert.Equal(t, "case[0].patients[0].family_history[0]", record.Errors[0].Path)
}

func Test_validateFamilyMemberCode_MultipleErrors(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, PatientInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].family_history[0]", record.Errors[0].Path)
}

func Test_validateCondition_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, PatientInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].family_history[0]", record.Errors[0].Path)
}

func Test_validateFamilyHistory_NoHistory(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		ObservationCodes:     []string{"phenotype", "condition", "note"},
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

	record.validateObsCategoricalCode(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateObsCategoricalCode_Invalid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		ObservationCodes:     []string{"phenotype", "condition", "note"},
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

	record.validateObsCategoricalCode(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, ObservationInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid observation code")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0]", record.Errors[0].Path)
}

func Test_validateOnsetCode_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		OnsetCodes:           []string{"childhood"},
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

	record.validateOnsetCode(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateOnsetCode_Invalid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		OnsetCodes:           []string{"childhood"},
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

	record.validateOnsetCode(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, ObservationInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid onset code")
	assert.Equal(t, "case[0].patients[0].observations_categorical[0]", record.Errors[0].Path)
}

func Test_validateObservationsCategorical_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		ObservationCodes:     []string{"note", "phenotype", "condition"},
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

	record.validateObsTextCode(0, 0)
	assert.Empty(t, record.Errors)
}

func Test_validateObsTextCode_Invalid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		ObservationCodes:     []string{"note", "phenotype", "condition"},
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

	record.validateObsTextCode(0, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, ObservationInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "is not a valid observation code")
	assert.Equal(t, "case[0].patients[0].observations_text[0]", record.Errors[0].Path)
}

func Test_validateObsTextValue_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, ObservationInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not match the regular expression")
	assert.Equal(t, "case[0].patients[0].observations_text[0]", record.Errors[0].Path)
}

func Test_validateObsTextValue_TooLong(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, ObservationInvalidField, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "field is too long")
	assert.Equal(t, "case[0].patients[0].observations_text[0]", record.Errors[0].Path)
}

func Test_validateObservationsText_Valid(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: &CodesMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "mother",
					AffectedStatusCode:      "affected",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
		},
		PatientAffectedStatusCodes:        []string{"affected", "unaffected", "unknown"},
		PatientRelationshipToProbandCodes: []string{"proband", "mother", "father", "sibling"},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, CaseInvalidNumberOfProbands, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "must have exactly 1 proband")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_MultipleProbands(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: &CodesMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "proband",
					AffectedStatusCode:      "affected",
				},
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-2",
					RelationToProbandCode:   "proband",
					AffectedStatusCode:      "affected",
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
		PatientAffectedStatusCodes:        []string{"affected", "unaffected", "unknown"},
		PatientRelationshipToProbandCodes: []string{"proband", "mother", "father", "sibling"},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, CaseInvalidNumberOfProbands, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "must have exactly 1 proband")
	assert.Equal(t, "case[0].patients", record.Errors[0].Path)
}

func Test_validateCasePatients_DuplicatePatient(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: &CodesMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              mockContext,
		Case: types.CaseBatch{
			ProjectCode:     "PROJ-1",
			SubmitterCaseId: "CASE-1",
			Patients: []*types.CasePatientBatch{
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "proband",
					AffectedStatusCode:      "affected",
				},
				{
					PatientOrganizationCode: "CHUSJ",
					SubmitterPatientId:      "PAT-1",
					RelationToProbandCode:   "mother",
					AffectedStatusCode:      "affected",
				},
			},
		},
		Patients: map[PatientKey]*types.Patient{
			{OrganizationCode: "CHUSJ", SubmitterPatientId: "PAT-1"}: {
				ID:                 1,
				SubmitterPatientId: "PAT-1",
			},
		},
		PatientAffectedStatusCodes:        []string{"affected", "unaffected", "unknown"},
		PatientRelationshipToProbandCodes: []string{"proband", "mother", "father", "sibling"},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, CaseDuplicatePatient, record.Errors[0].Code)
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
			AffectedStatusCode: "affected",
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
			AffectedStatusCode: "affected",
		},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		PatientAffectedStatusCodes:        []string{"affected", "unaffected", "unknown"},
		PatientRelationshipToProbandCodes: []string{"proband", "mother", "father", "sibling"},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
}

func Test_validateCasePatients_WithErrors(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		ValueSetsRepo: &CodesMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
					AffectedStatusCode: "affected",
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
					AffectedStatusCode: "affected",
				},
			},
		},
		PatientAffectedStatusCodes:        []string{"affected", "unaffected", "unknown"},
		PatientRelationshipToProbandCodes: []string{"proband", "mother", "father", "sibling"},
	}

	err := record.validateCasePatients()
	assert.NoError(t, err)
	assert.Equal(t, 10, len(record.Errors))
}

// -----------------------------------------------------------------------------
// Section: Sequencing Experiment Validation Tests
// -----------------------------------------------------------------------------

func Test_validateSeqExp_SeqExpExists(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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

	err, exists := record.validateSeqExpExists(0)
	assert.NoError(t, err)
	assert.Empty(t, record.Errors)
	assert.True(t, exists)
}

func Test_validateSeqExp_SeqExpNotFound(t *testing.T) {
	mockContext := &batchval.BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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

	err, exists := record.validateSeqExpExists(0)
	assert.NoError(t, err)
	assert.False(t, exists)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, SequencingExperimentNotFound, record.Errors[0].Code)
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context: &batchval.BatchValidationContext{
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context: &batchval.BatchValidationContext{
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
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
		SampleRepo: &SamplesMockRepo{},
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
		SampleRepo: &mockSamples,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, SequencingExperimentNotFound, record.Errors[0].Code)
	assert.Equal(t, "case[0].sequencing_experiments[1]", record.Errors[0].Path)
	assert.Equal(t, SequencingExperimentNotFound, record.Errors[1].Code)
	assert.Equal(t, "case[0].sequencing_experiments[2]", record.Errors[1].Path)
}

func Test_validateSeqExpPatientInCase_Valid(t *testing.T) {
	sample := &types.Sample{
		ID:        1,
		PatientID: 100,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, CaseSeqExpNotFoundForPatient, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "does not belong to any patient from case 0")
	assert.Equal(t, "case[0].sequencing_experiments[0]", record.Errors[0].Path)
}

func Test_validateSeqExpPatientInCase_EmptyPatientsList(t *testing.T) {
	sample := &types.Sample{
		ID:        1,
		PatientID: 100,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, CaseSeqExpNotFoundForPatient, record.Errors[0].Code)
}

func Test_validateSeqExpCaseType_GermlineWithGermlineSample(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, CaseInvalidSeqExpForType, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Tumor sequencing experiment")
	assert.Contains(t, record.Errors[0].Message, "should not be sequenced in a germline case")
	assert.Equal(t, "case[0].sequencing_experiments[0]", record.Errors[0].Path)
}

func Test_validateSeqExpCaseType_SomaticWithTumoralSample(t *testing.T) {
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	mockContext := batchval.BatchValidationContext{
		SeqExpRepo: &CaseValidationMockRepo{},
		SampleRepo: &mockSamples,
	}

	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
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
	assert.Equal(t, CaseInvalidSeqExpForType, record.Errors[0].Code)
	assert.Contains(t, record.Errors[0].Message, "Tumor sequencing experiment")
	assert.Contains(t, record.Errors[0].Message, "LAB-2 / SAMPLE-2 / ALIQUOT-2")
	assert.Equal(t, "case[0].sequencing_experiments[1]", record.Errors[0].Path)
}

// -----------------------------------------------------------------------------
// Section: Tasks Validation Tests
// -----------------------------------------------------------------------------

func Test_validateTaskTextField_OK(t *testing.T) {
	record := CaseValidationRecord{}
	regex := regexp.MustCompile("^[a-zA-Z0-9]+$")
	record.validateTaskTextField("validText123", "test_field", 0, regex, true)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateTaskTextField_RegexError(t *testing.T) {
	record := CaseValidationRecord{}
	regex := regexp.MustCompile("^[a-zA-Z0-9]+$")
	record.validateTaskTextField("validText123!", "test_field", 0, regex, true)

	expected := types.BatchMessage{
		Code:    "TASK-001",
		Message: "Invalid field test_field for case 0 - task 0. Reason: does not match the regular expression `^[a-zA-Z0-9]+$`.",
		Path:    "case[0].tasks[0].test_field",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskTextField_LengthError(t *testing.T) {
	record := CaseValidationRecord{}
	regex := regexp.MustCompile("^[a-zA-Z0-9]+$")
	record.validateTaskTextField(strings.Repeat("a", 101), "test_field", 0, regex, true)

	expected := types.BatchMessage{
		Code:    "TASK-001",
		Message: "Invalid field test_field for case 0 - task 0. Reason: field is too long, maximum length allowed is 100.",
		Path:    "case[0].tasks[0].test_field",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskTypeCode_OK(t *testing.T) {
	record := CaseValidationRecord{}
	record.TaskTypeCodes = []string{"foo"}
	record.validateTaskTypeCode("foo", 0)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateTaskTypeCode_Error(t *testing.T) {
	record := CaseValidationRecord{}
	record.TaskTypeCodes = []string{"foo", "bar"}
	record.validateTaskTypeCode("foobar", 0)

	expected := types.BatchMessage{
		Code:    "TASK-001",
		Message: "Invalid field type_code for case 0 - task 0. Reason: invalid task type code `foobar`. Valid codes are: [foo, bar].",
		Path:    "case[0].tasks[0].type_code",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskAliquot_OK(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot: "ALIQUOT-1",
				},
			},
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquots: []string{"ALIQUOT-1"},
				},
			},
		},
	}
	record.validateTaskAliquot(0)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateTaskAliquot_ErrorNoAliquot(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot: "ALIQUOT-2",
				},
			},
			Tasks: []*types.CaseTaskBatch{
				{
					Aliquots: []string{"ALIQUOT-1"},
				},
			},
		},
	}
	record.validateTaskAliquot(0)

	expected := types.BatchMessage{
		Code:    "TASK-002",
		Message: "Sequencing \"ALIQUOT-1\" is not defined for case 0 - task 0.",
		Path:    "case[0].tasks[0]",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskAliquot_ErrorExomiserNotExactly1Aliquot(t *testing.T) {
	record := CaseValidationRecord{
		Case: types.CaseBatch{
			SequencingExperiments: []*types.CaseSequencingExperimentBatch{
				{
					Aliquot: "ALIQUOT-1",
				},
				{
					Aliquot: "ALIQUOT-2",
				},
			},
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode: ExomiserTaskTypeCode,
					Aliquots: []string{"ALIQUOT-1", "ALIQUOT-2"},
				},
			},
		},
	}
	record.validateTaskAliquot(0)

	expected := types.BatchMessage{
		Code:    "TASK-001",
		Message: "Invalid field aliquots for case 0 - task 0. Reason: aliquots must contain exactly one value for exomiser task.",
		Path:    "case[0].tasks[0].aliquots",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskDocuments_OK(t *testing.T) {
	record := CaseValidationRecord{
		Documents: map[string]*types.Document{
			"s3://input/foo/bar.txt": {},
		},
		TaskContexts: map[int][]*types.TaskContext{
			0: {{TaskID: 0, SequencingExperimentID: 0}},
		},
		SequencingExperiments: map[int]*types.SequencingExperiment{0: {ID: 0}},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					InputDocuments: []*types.InputDocumentBatch{
						{
							Url: "s3://input/foo/bar.txt",
						},
					},
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	record.validateTaskDocuments(record.Case.Tasks[0], 0)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateTaskDocuments_MissingInputDocuments_OK(t *testing.T) {
	record := CaseValidationRecord{
		Documents: map[string]*types.Document{
			"s3://input/foo/bar.txt": {},
		},
		TaskContexts: map[int][]*types.TaskContext{
			0: {{TaskID: 0, SequencingExperimentID: 0}},
		},
		SequencingExperiments: map[int]*types.SequencingExperiment{0: {ID: 0}},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode: "alignment",
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	record.validateTaskDocuments(record.Case.Tasks[0], 0)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateTaskDocuments_MissingInputDocumentsError(t *testing.T) {
	record := CaseValidationRecord{
		Documents: map[string]*types.Document{
			"s3://input/foo/bar.txt": {},
		},
		TaskContexts: map[int][]*types.TaskContext{
			0: {{TaskID: 0, SequencingExperimentID: 0}},
		},
		SequencingExperiments: map[int]*types.SequencingExperiment{0: {ID: 0}},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode: "family_variant_calling",
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	record.validateTaskDocuments(record.Case.Tasks[0], 0)

	expected := types.BatchMessage{
		Code:    "TASK-003",
		Message: "Missing input documents for case 0 - task 0 of type family_variant_calling.",
		Path:    "case[0].tasks[0]",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskDocuments_MissingOutputDocumentsError(t *testing.T) {
	record := CaseValidationRecord{
		Documents: map[string]*types.Document{
			"s3://input/foo/bar.txt": {},
		},
		TaskContexts: map[int][]*types.TaskContext{
			0: {{TaskID: 0, SequencingExperimentID: 0}},
		},
		SequencingExperiments: map[int]*types.SequencingExperiment{0: {ID: 0}},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode: "family_variant_calling",
					InputDocuments: []*types.InputDocumentBatch{
						{
							Url: "s3://input/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	record.validateTaskDocuments(record.Case.Tasks[0], 0)

	expected := types.BatchMessage{
		Code:    "TASK-004",
		Message: "Missing output documents for case 0 - task 0 of type family_variant_calling.",
		Path:    "case[0].tasks[0]",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskDocuments_InputDocumentDoesNotExistsError(t *testing.T) {
	record := CaseValidationRecord{
		Documents: map[string]*types.Document{
			"s3://input/foo/bar.txt": {},
		},
		TaskContexts: map[int][]*types.TaskContext{
			0: {{TaskID: 0, SequencingExperimentID: 0}},
		},
		SequencingExperiments: map[int]*types.SequencingExperiment{0: {ID: 0}},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode: "family_variant_calling",
					InputDocuments: []*types.InputDocumentBatch{
						{
							Url: "s3://input/notfoo/bar.txt",
						},
					},
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	record.validateTaskDocuments(record.Case.Tasks[0], 0)

	expected := types.BatchMessage{
		Code:    "TASK-005",
		Message: "Input document with URL s3://input/notfoo/bar.txt does not exist for case 0 - task 0.",
		Path:    "case[0].tasks[0]",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskDocuments_InputDocumentExternalSeqExpError(t *testing.T) {
	record := CaseValidationRecord{
		Documents: map[string]*types.Document{
			"s3://input/foo/bar.txt": {Url: "s3://input/foo/bar.txt"},
		},
		TaskContexts: map[int][]*types.TaskContext{
			0: {{TaskID: 0, SequencingExperimentID: 22}},
		},
		DocumentsInTasks: map[string][]*DocumentRelation{
			"s3://input/foo/bar.txt": {{TaskID: 0, Type: "output"}},
		},
		SequencingExperiments: map[int]*types.SequencingExperiment{0: {ID: 0}},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					TypeCode: "family_variant_calling",
					InputDocuments: []*types.InputDocumentBatch{
						{
							Url: "s3://input/foo/bar.txt",
						},
					},
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	record.validateTaskDocuments(record.Case.Tasks[0], 0)

	expected := types.BatchMessage{
		Code:    "TASK-006",
		Message: "Input document with URL s3://input/foo/bar.txt for case 0 - task 0 was produced by a sequencing experiment not defined in this case.",
		Path:    "case[0].tasks[0]",
	}

	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Equal(t, expected, record.Errors[0])
}

func Test_validateTaskDocumentOutputInBatch_OK(t *testing.T) {
	record := CaseValidationRecord{
		DocumentsInTasks: map[string][]*DocumentRelation{
			"s3://output/foo/bar.txt": {{TaskID: 0, Type: "output"}},
		},
		Case: types.CaseBatch{
			Tasks: []*types.CaseTaskBatch{
				{
					OutputDocuments: []*types.OutputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
				{
					InputDocuments: []*types.InputDocumentBatch{
						{
							Url: "s3://output/foo/bar.txt",
						},
					},
				},
			},
		},
	}
	task, doc := record.getOriginTaskForInputDocument(record.Case.Tasks[1].InputDocuments[0].Url)
	assert.NotNil(t, task)
	assert.NotNil(t, doc)
}

// -----------------------------------------------------------------------------
// Section: Documents Validation Tests
// -----------------------------------------------------------------------------

func Test_validateExistingDocument_IdenticalMatch(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
	}

	size := int64(42)
	batchDoc := types.OutputDocumentBatch{
		DataCategoryCode: "FOO",
		DataTypeCode:     "BAR",
		FormatCode:       ".foobar",
		Hash:             "f00bar",
		Name:             "FooBar Document",
		Size:             &size,
		Url:              "s3://foo/bar",
	}

	existingDoc := types.Document{
		DataCategoryCode: "FOO",
		DataTypeCode:     "BAR",
		FileFormatCode:   ".foobar",
		Hash:             "f00bar",
		Name:             "FooBar Document",
		Size:             42,
		Url:              "s3://foo/bar",
	}

	record.validateDocumentExists(&batchDoc, &existingDoc, "foo[0].bar")
	assert.Len(t, record.Infos, 1)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
	assert.Equal(t, record.Infos[0], types.BatchMessage{
		Code:    "DOCUMENT-003",
		Message: "Document s3://foo/bar already exists, skipped.",
		Path:    "foo[0].bar",
	})
}

func Test_validateExistingDocument_PartialMatch(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
	}

	size := int64(42)
	batchDoc := types.OutputDocumentBatch{
		DataCategoryCode: "NOTFOO",
		DataTypeCode:     "BAR",
		FormatCode:       ".foobar",
		Hash:             "f00bar",
		Name:             "FooBar Document",
		Size:             &size,
		Url:              "s3://foo/bar",
	}

	existingDoc := types.Document{
		DataCategoryCode: "FOO",
		DataTypeCode:     "BAR",
		FileFormatCode:   ".foobar",
		Hash:             "f00bar",
		Name:             "FooBar Document",
		Size:             42,
		Url:              "s3://foo/bar",
	}

	record.validateDocumentExists(&batchDoc, &existingDoc, "foo[0].bar")
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 1)
	assert.Len(t, record.Errors, 0)
	assert.Equal(t, record.Warnings[0], types.BatchMessage{
		Code:    "DOCUMENT-004",
		Message: "A document with same url s3://foo/bar has been found but with a different data_category_code (FOO <> NOTFOO).",
		Path:    "foo[0].bar",
	})
}

func Test_validateDocumentTextField_OK(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
	}
	fieldValue := "test value"
	fieldName := "test_field"
	path := "case[0].tasks[0].documents[1]"
	taskIndex := 0
	documentIndex := 1
	regExpStr := "^[a-zA-Z0-9 ]+$"
	regExp, _ := regexp.Compile(regExpStr)

	record.validateDocumentTextField(fieldValue, fieldName, path, taskIndex, documentIndex, regExp, false)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateDocumentTextField_RegexError(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
	}
	fieldValue := "test value %$#%"
	fieldName := "test_field"
	path := "case[0].tasks[0].documents[1]"
	taskIndex := 0
	documentIndex := 1
	regExpStr := "^[a-zA-Z0-9 ]+$"
	regExp, _ := regexp.Compile(regExpStr)

	record.validateDocumentTextField(fieldValue, fieldName, path, taskIndex, documentIndex, regExp, false)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, record.Errors[0], types.BatchMessage{
		Code:    "DOCUMENT-001",
		Message: "Invalid field test_field for case 0 - task 0 - output document 1. Reason: does not match the regular expression `^[a-zA-Z0-9 ]+$`.",
		Path:    "case[0].tasks[0].documents[1]",
	})
}

func Test_validateDocumentTextField_LengthError(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
	}
	fieldValue := strings.Repeat("A", 300)
	fieldName := "test_field"
	path := "case[0].tasks[0].documents[1]"
	taskIndex := 0
	documentIndex := 1
	regExpStr := "^[a-zA-Z0-9 ]+$"
	regExp, _ := regexp.Compile(regExpStr)

	record.validateDocumentTextField(fieldValue, fieldName, path, taskIndex, documentIndex, regExp, false)
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, record.Errors[0], types.BatchMessage{
		Code:    "DOCUMENT-001",
		Message: "Invalid field test_field for case 0 - task 0 - output document 1. Reason: field is too long, maximum length allowed is 100.",
		Path:    "case[0].tasks[0].documents[1]",
	})
}

func Test_validateDocumentIsOutputOfAnotherTask_DocumentFound(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
		DocumentsInTasks: map[string][]*DocumentRelation{
			"s3://foo/bar": {{
				TaskID: 1,
				Type:   "output",
			}},
		},
	}

	doc := types.Document{
		ID:               0,
		Name:             "Foo Bar",
		DataCategoryCode: "foobar",
		DataTypeCode:     "foo",
		FileFormatCode:   "bar",
		Size:             11,
		Url:              "s3://foo/bar",
		Hash:             "abc123",
	}

	record.validateDocumentIsOutputOfAnotherTask(&doc, "foo[0].bar")
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 1)
	assert.Equal(t, record.Errors[0], types.BatchMessage{
		Code:    "DOCUMENT-005",
		Message: "A document with same url s3://foo/bar has been found in the output of a different task.",
		Path:    "foo[0].bar",
	})
}

func Test_validateDocumentIsOutputOfAnotherTask_DocumentNotFound(t *testing.T) {
	mockContext := batchval.BatchValidationContext{}
	record := CaseValidationRecord{
		BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
		Context:              &mockContext,
		DocumentsInTasks: map[string][]*DocumentRelation{
			"s3://foo/bar": {{
				TaskID: 1,
				Type:   "output",
			}},
		},
	}

	doc := types.Document{
		ID:               0,
		Name:             "Foo Bar",
		DataCategoryCode: "foobar",
		DataTypeCode:     "foo",
		FileFormatCode:   "bar",
		Size:             11,
		Url:              "s3://notfoo/bar",
		Hash:             "abc123",
	}

	record.validateDocumentIsOutputOfAnotherTask(&doc, "foo[0].bar")
	assert.Len(t, record.Infos, 0)
	assert.Len(t, record.Warnings, 0)
	assert.Len(t, record.Errors, 0)
}

func Test_validateFileMetadata_OK(t *testing.T) {
	testutils.SequentialTestWithMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string) {

		bucketName := "foo"
		objectName := "bar.txt"
		content := []byte("hello world") // Size: 11 bytes

		_ = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		_, _ = client.PutObject(ctx, bucketName, objectName, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})

		s3fs, _ := utils.NewS3Store()
		mockContext := batchval.BatchValidationContext{
			S3FS: s3fs,
		}
		record := CaseValidationRecord{
			BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
			Context:              &mockContext,
		}

		doc := types.Document{
			ID:               0,
			Name:             "Foo Bar",
			DataCategoryCode: "foobar",
			DataTypeCode:     "foo",
			FileFormatCode:   "bar",
			Size:             11,
			Url:              "s3://foo/bar.txt",
			Hash:             "5eb63bbbe01eeed093cb22bb8f5acdc3",
		}

		record.validateDocumentIsOutputOfAnotherTask(&doc, "foo[0].bar")
		assert.Len(t, record.Infos, 0)
		assert.Len(t, record.Warnings, 0)
		assert.Len(t, record.Errors, 0)
	})
}

func Test_validateFileMetadata_DocumentNotFound(t *testing.T) {
	testutils.SequentialTestWithMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string) {
		t.Setenv("AWS_ENDPOINT_URL", endpoint)
		t.Setenv("AWS_ACCESS_KEY_ID", "admin")
		t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
		t.Setenv("AWS_USE_SSL", "false")

		bucketName := "foo"
		objectName := "bar.txt"
		content := []byte("hello world") // Size: 11 bytes

		_ = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		_, _ = client.PutObject(ctx, bucketName, objectName, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})

		s3fs, _ := utils.NewS3Store()
		mockContext := batchval.BatchValidationContext{
			S3FS: s3fs,
		}
		record := CaseValidationRecord{
			BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
			Context:              &mockContext,
		}

		size := int64(11)
		doc := types.OutputDocumentBatch{
			Name:             "Foo Bar",
			DataCategoryCode: "foobar",
			DataTypeCode:     "foo",
			FormatCode:       "bar",
			Size:             &size,
			Url:              "s3://fake-enterprise-medical-records-storage-bucket-na-east-1/environment/production/validated-records/patient-metadata/2026/01/22/batch-uuid-9842-adfa-1123-lkjh/validation_report_full_final_version_v2_alpha_release.parquet", // Validates long URLs are accepted
			Hash:             "5eb63bbbe01eeed093cb22bb8f5acdc3",
		}

		err := record.validateDocumentMetadata(&doc, "foo[0].bar", 0, 1)
		assert.NoError(t, err)
		assert.Len(t, record.Infos, 0)
		assert.Len(t, record.Warnings, 0)
		assert.Len(t, record.Errors, 1)
		assert.Equal(t, record.Errors[0], types.BatchMessage{
			Code:    "DOCUMENT-002",
			Message: "No document can be found on the URL s3://fake-enterprise-medical-records-storage-bucket-na-east-1/environment/production/validated-records/patient-metadata/2026/01/22/batch-uuid-9842-adfa-1123-lkjh/validation_report_full_final_version_v2_alpha_release.parquet for case 0 - task 0 - output document 1.",
			Path:    "foo[0].bar",
		})
	})
}

func Test_validateFileMetadata_SizeMismatch(t *testing.T) {
	testutils.SequentialTestWithMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string) {
		t.Setenv("AWS_ENDPOINT_URL", endpoint)
		t.Setenv("AWS_ACCESS_KEY_ID", "admin")
		t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
		t.Setenv("AWS_USE_SSL", "false")

		bucketName := "foo"
		objectName := "bar.txt"
		content := []byte("hello world") // Size: 11 bytes

		_ = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		_, _ = client.PutObject(ctx, bucketName, objectName, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})

		s3fs, _ := utils.NewS3Store()
		mockContext := batchval.BatchValidationContext{
			S3FS: s3fs,
		}
		record := CaseValidationRecord{
			BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
			Context:              &mockContext,
		}

		size := int64(12)
		doc := types.OutputDocumentBatch{
			Name:             "Foo Bar",
			DataCategoryCode: "foobar",
			DataTypeCode:     "foo",
			FormatCode:       "bar",
			Size:             &size,
			Url:              "s3://foo/bar.txt",
			Hash:             "5eb63bbbe01eeed093cb22bb8f5acdc3",
		}

		err := record.validateDocumentMetadata(&doc, "foo[0].bar", 0, 1)
		assert.NoError(t, err)
		assert.Len(t, record.Infos, 0)
		assert.Len(t, record.Warnings, 0)
		assert.Len(t, record.Errors, 1)
		assert.Equal(t, record.Errors[0], types.BatchMessage{
			Code:    "DOCUMENT-006",
			Message: "Document size does not match the actual size of the document s3://foo/bar.txt for case 0 - task 0 - output document 1.",
			Path:    "foo[0].bar",
		})
	})
}

func Test_validateFileMetadata_HashMismatch(t *testing.T) {
	testutils.SequentialTestWithMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string) {
		t.Setenv("AWS_ENDPOINT_URL", endpoint)
		t.Setenv("AWS_ACCESS_KEY_ID", "admin")
		t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
		t.Setenv("AWS_USE_SSL", "false")

		bucketName := "foo"
		objectName := "bar.txt"
		content := []byte("hello world") // Size: 11 bytes

		_ = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		_, _ = client.PutObject(ctx, bucketName, objectName, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})

		s3fs, _ := utils.NewS3Store()
		mockContext := batchval.BatchValidationContext{
			S3FS: s3fs,
		}
		record := CaseValidationRecord{
			BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
			Context:              &mockContext,
		}

		size := int64(11)
		doc := types.OutputDocumentBatch{
			Name:             "Foo Bar",
			DataCategoryCode: "foobar",
			DataTypeCode:     "foo",
			FormatCode:       "bar",
			Size:             &size,
			Url:              "s3://foo/bar.txt",
			Hash:             "5eb63bbbe01eeed093cb22bb8f5ac",
		}

		err := record.validateDocumentMetadata(&doc, "foo[0].bar", 0, 1)
		assert.NoError(t, err)
		assert.Len(t, record.Infos, 0)
		assert.Len(t, record.Warnings, 0)
		assert.Len(t, record.Errors, 1)
		assert.Equal(t, record.Errors[0], types.BatchMessage{
			Code:    "DOCUMENT-007",
			Message: "Document hash does not match the actual hash of the document s3://foo/bar.txt for case 0 - task 0 - output document 1.",
			Path:    "foo[0].bar",
		})
	})
}

func Test_validateFileMetadata_OptionalHash(t *testing.T) {
	testutils.SequentialTestWithMinIO(t, func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string) {
		t.Setenv("AWS_ENDPOINT_URL", endpoint)
		t.Setenv("AWS_ACCESS_KEY_ID", "admin")
		t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
		t.Setenv("AWS_USE_SSL", "false")

		bucketName := "foo"
		objectName := "bar.txt"
		content := []byte("hello world") // Size: 11 bytes

		_ = client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
		_, _ = client.PutObject(ctx, bucketName, objectName, bytes.NewReader(content), int64(len(content)), minio.PutObjectOptions{})

		s3fs, _ := utils.NewS3Store()
		mockContext := batchval.BatchValidationContext{
			S3FS: s3fs,
		}
		record := CaseValidationRecord{
			BaseValidationRecord: batchval.BaseValidationRecord{Index: 0},
			Context:              &mockContext,
		}

		size := int64(11)
		doc := types.OutputDocumentBatch{
			Name:             "Foo Bar",
			DataCategoryCode: "foobar",
			DataTypeCode:     "foo",
			FormatCode:       "bar",
			Size:             &size,
			Url:              "s3://foo/bar.txt",
			Hash:             "",
		}

		err := record.validateDocumentMetadata(&doc, "foo[0].bar", 0, 1)
		assert.NoError(t, err)
		assert.Len(t, record.Infos, 0)
		assert.Len(t, record.Warnings, 0)
		assert.Len(t, record.Errors, 0)
	})
}
