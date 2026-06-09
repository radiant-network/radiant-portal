package main

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// Unit tests for validatePatchCaseRecord — the per-record validator the worker
// runs when processing a PATCH /cases/batch (patch_case batch type). Mocks reuse
// CaseValidationMockRepo defined in case_validation_test.go.

func newCachePatch(repo *CaseValidationMockRepo) (*batchval.BatchValidationCache, *batchval.BatchValidationContext) {
	ctx := &batchval.BatchValidationContext{
		ProjectRepo: repo,
		CasesRepo:   repo,
		SeqExpRepo:  repo,
		OrgRepo:     repo,
	}
	return batchval.NewBatchValidationCache(ctx), ctx
}

// newCachePatchWithTasks wires the extra repos the task validators reach (value-set codes,
// documents, task contexts). S3FS is intentionally left nil — these tests use a pre-existing
// output document URL so document metadata (the only S3-backed check) is never invoked.
func newCachePatchWithTasks(repo *CaseValidationMockRepo) (*batchval.BatchValidationCache, *batchval.BatchValidationContext) {
	ctx := &batchval.BatchValidationContext{
		ProjectRepo:   repo,
		CasesRepo:     repo,
		SeqExpRepo:    repo,
		OrgRepo:       repo,
		DocRepo:       repo,
		TaskRepo:      repo,
		ValueSetsRepo: repo,
	}
	return batchval.NewBatchValidationCache(ctx), ctx
}

func caseExistsMock() *CaseValidationMockRepo {
	return &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return &repository.Case{ID: 100}, nil
		},
	}
}

// Tasks attached via PATCH are validated with the exact POST machinery. A task whose output
// document is already another task's output must be rejected — proving the task path runs and
// its errors are merged onto the patch record, and that Task is captured for the persist phase.
func Test_validatePatchCaseRecord_Tasks_DocumentAlreadyOutputOfAnotherTask(t *testing.T) {
	cache, ctx := newCachePatchWithTasks(caseExistsMock())
	size := int64(11)
	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-1",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"},
		},
		Tasks: []*types.CaseTaskBatch{
			{
				TypeCode:        "alignment_germline_variant_calling",
				Aliquots:        []string{"ALIQUOT-1"},
				PipelineVersion: "1.0.0",
				OutputDocuments: []*types.OutputDocumentBatch{
					// file://bucket/file.bam already exists as the output of task 300 in the mock.
					{DataCategoryCode: "genomic", DataTypeCode: "snv", FormatCode: "vcf", Name: "file.bam", Size: &size, Url: "file://bucket/file.bam"},
				},
			},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.NotNil(t, rec.Task)
	assert.True(t, hasErrorCode(rec.Errors, DocumentAlreadyOutputOfAnotherTask), "expected %s, got %+v", DocumentAlreadyOutputOfAnotherTask, rec.Errors)
}

func Test_validatePatchCaseRecord_Tasks_InvalidTypeCode(t *testing.T) {
	cache, ctx := newCachePatchWithTasks(caseExistsMock())
	size := int64(11)
	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-1",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"},
		},
		Tasks: []*types.CaseTaskBatch{
			{
				TypeCode:        "not_a_real_task_type",
				Aliquots:        []string{"ALIQUOT-1"},
				PipelineVersion: "1.0.0",
				OutputDocuments: []*types.OutputDocumentBatch{
					{DataCategoryCode: "genomic", DataTypeCode: "snv", FormatCode: "vcf", Name: "file.bam", Size: &size, Url: "file://bucket/file.bam"},
				},
			},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.NotNil(t, rec.Task)
	assert.True(t, hasErrorCode(rec.Errors, TaskInvalidField), "expected %s, got %+v", TaskInvalidField, rec.Errors)
}

func Test_validatePatchCaseRecord_Tasks_UnknownAliquot(t *testing.T) {
	cache, ctx := newCachePatchWithTasks(caseExistsMock())
	size := int64(11)
	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-1",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"},
		},
		Tasks: []*types.CaseTaskBatch{
			{
				TypeCode:        "alignment_germline_variant_calling",
				Aliquots:        []string{"ALIQUOT-UNKNOWN"}, // not among the attached experiments
				PipelineVersion: "1.0.0",
				OutputDocuments: []*types.OutputDocumentBatch{
					{DataCategoryCode: "genomic", DataTypeCode: "snv", FormatCode: "vcf", Name: "file.bam", Size: &size, Url: "file://bucket/file.bam"},
				},
			},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.NotNil(t, rec.Task)
	assert.True(t, hasErrorCode(rec.Errors, TaskUnknownAliquot), "expected %s, got %+v", TaskUnknownAliquot, rec.Errors)
}

// When the case does not exist, tasks must not be validated or staged for persistence.
func Test_validatePatchCaseRecord_Tasks_SkippedWhenCaseMissing(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return nil, nil // case missing
		},
	}
	cache, ctx := newCachePatchWithTasks(mockRepo)
	size := int64(11)
	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-MISSING",
		Tasks: []*types.CaseTaskBatch{
			{
				TypeCode:        "alignment_germline_variant_calling",
				Aliquots:        []string{"ALIQUOT-1"},
				PipelineVersion: "1.0.0",
				OutputDocuments: []*types.OutputDocumentBatch{
					{DataCategoryCode: "genomic", DataTypeCode: "snv", FormatCode: "vcf", Name: "file.bam", Size: &size, Url: "file://bucket/file.bam"},
				},
			},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Nil(t, rec.Task)
	assert.Nil(t, rec.CaseID)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, CaseNotFoundForAttach, rec.Errors[0].Code)
}

func hasErrorCode(msgs []types.BatchMessage, code string) bool {
	for _, m := range msgs {
		if m.Code == code {
			return true
		}
	}
	return false
}

func Test_validatePatchCaseRecord_Success(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			if submitterCaseId == "CASE-1" && projectId == 42 {
				return &repository.Case{ID: 100, SubmitterCaseID: "CASE-1", ProjectID: projectId}, nil
			}
			return nil, nil
		},
	}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-1",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"},
			{Aliquot: "ALIQUOT-2", SubmitterSampleId: "SAMPLE-2", SampleOrganizationCode: "LAB-2"},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
	assert.NotNil(t, rec.CaseID)
	assert.Equal(t, 100, *rec.CaseID)
	assert.Len(t, rec.SequencingExperiments, 2)
	assert.Contains(t, rec.SequencingExperiments, 200)
	assert.Contains(t, rec.SequencingExperiments, 201)
}

func Test_validatePatchCaseRecord_EmptyExperimentsIsNoOp(t *testing.T) {
	// An empty sequencing_experiments array is a no-op — the case still resolves, no errors.
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return &repository.Case{ID: 100}, nil
		},
	}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:           "PROJ-1",
		SubmitterCaseId:       "CASE-1",
		SequencingExperiments: nil,
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
	assert.NotNil(t, rec.CaseID)
	assert.Empty(t, rec.SequencingExperiments)
}

func Test_validatePatchCaseRecord_UnknownProject(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-UNKNOWN",
		SubmitterCaseId: "CASE-1",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, CaseUnknownProject, rec.Errors[0].Code)
	assert.Equal(t, "patch_case[0]", rec.Errors[0].Path)
	assert.Nil(t, rec.CaseID)
	assert.Empty(t, rec.SequencingExperiments)
}

func Test_validatePatchCaseRecord_CaseNotFound(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return nil, nil // case missing
		},
	}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-MISSING",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"},
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, CaseNotFoundForAttach, rec.Errors[0].Code)
	assert.Nil(t, rec.CaseID)
	assert.Empty(t, rec.SequencingExperiments)
}

func Test_validatePatchCaseRecord_DiagnosticLabCode_Resolved(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return &repository.Case{ID: 100}, nil
		},
	}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:       "PROJ-1",
		SubmitterCaseId:   "CASE-1",
		DiagnosticLabCode: "LAB-1", // exists in mock
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Empty(t, rec.Errors)
	assert.Equal(t, "LAB-1", rec.DiagnosisLabCodeUpdate)
}

func Test_validatePatchCaseRecord_DiagnosticLabCode_Unknown(t *testing.T) {
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return &repository.Case{ID: 100}, nil
		},
	}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:       "PROJ-1",
		SubmitterCaseId:   "CASE-1",
		DiagnosticLabCode: "LAB-UNKNOWN", // not in mock
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, CaseUnknownDiagnosticLab, rec.Errors[0].Code)
	assert.Equal(t, "patch_case[0].diagnostic_lab_code", rec.Errors[0].Path)
	assert.Empty(t, rec.DiagnosisLabCodeUpdate)
}

func Test_validatePatchCaseRecord_SequencingExperimentMissing(t *testing.T) {
	// Case resolves, one experiment resolves, one doesn't → one SEQ-007 error per missing item;
	// the resolved experiment is still captured in the record so persistence attaches it.
	mockRepo := &CaseValidationMockRepo{
		GetCaseBySubmitterCaseIdAndProjectIdFunc: func(submitterCaseId string, projectId int) (*repository.Case, error) {
			return &repository.Case{ID: 100}, nil
		},
	}
	cache, ctx := newCachePatch(mockRepo)

	patch := types.CaseBatchPatch{
		ProjectCode:     "PROJ-1",
		SubmitterCaseId: "CASE-1",
		SequencingExperiments: []*types.CaseSequencingExperimentBatch{
			{Aliquot: "ALIQUOT-1", SubmitterSampleId: "SAMPLE-1", SampleOrganizationCode: "LAB-1"}, // resolves to ID 200
			{Aliquot: "MISSING", SubmitterSampleId: "X", SampleOrganizationCode: "Y"},              // not found
		},
	}

	rec, err := validatePatchCaseRecord(ctx, cache, patch, 0)
	assert.NoError(t, err)
	assert.Len(t, rec.Errors, 1)
	assert.Equal(t, SequencingExperimentNotFound, rec.Errors[0].Code)
	assert.Equal(t, "patch_case[0].sequencing_experiments[1]", rec.Errors[0].Path)
	assert.NotNil(t, rec.CaseID)
	assert.Len(t, rec.SequencingExperiments, 1)
	assert.Contains(t, rec.SequencingExperiments, 200)
}
