package server

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

// ---------------------------------------------------------------------------
// Task mock methods, attached to the shared MockRepository.
// ---------------------------------------------------------------------------

var mockTaskFixedTime = time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)

func (m *MockRepository) CreateTask(task *postgres.Task) error             { return nil }
func (m *MockRepository) CreateTaskContext(tc *postgres.TaskContext) error { return nil }
func (m *MockRepository) CreateTaskHasDocument(thd *postgres.TaskHasDocument) error {
	return nil
}
func (m *MockRepository) GetTaskTypeCodes() ([]types.TaskType, error) { return nil, nil }
func (m *MockRepository) GetTaskById(int) (*postgres.Task, error)     { return nil, nil }
func (m *MockRepository) GetTaskContextByTaskId(int) ([]*postgres.TaskContext, error) {
	return nil, nil
}
func (m *MockRepository) GetTaskHasDocumentByTaskId(int) ([]*postgres.TaskHasDocument, error) {
	return nil, nil
}
func (m *MockRepository) GetTaskHasDocumentByDocumentId(int) ([]*postgres.TaskHasDocument, error) {
	return nil, nil
}
func (m *MockRepository) GetTaskContextBySequencingExperimentId(int) ([]*postgres.TaskContext, error) {
	return nil, nil
}

func (m *MockRepository) ListTasksByCaseSeqAndTaskType(ctx context.Context, caseId int, seqId int, taskTypeCode string) ([]types.TaskOccurrenceType, error) {
	if caseId == 9999 {
		return nil, fmt.Errorf("mock repo error")
	}
	switch taskTypeCode {
	case types.AlignmentGermlineVariantCallingTaskTypeCode:
		return []types.TaskOccurrenceType{{
			ID: 91, TaskTypeCode: taskTypeCode, TaskTypeName: "Genome Alignment and Germline Variant Calling",
			PipelineName: "Dragen", PipelineVersion: "4.4.4", GenomeBuild: "GRch38", CreatedOn: mockTaskFixedTime,
		}}, nil
	case types.RadiantGermlineAnnotationTask:
		return []types.TaskOccurrenceType{{
			ID: 92, TaskTypeCode: taskTypeCode, TaskTypeName: "RADIANT Germline Annotation",
			PipelineName: "Dragen", PipelineVersion: "4.4.4", GenomeBuild: "GRch38", CreatedOn: mockTaskFixedTime,
		}}, nil
	case types.RadiantSomaticAnnotationTask:
		return []types.TaskOccurrenceType{{
			ID: 93, TaskTypeCode: taskTypeCode, TaskTypeName: "RADIANT Somatic Annotation",
			PipelineVersion: "1.0.0", GenomeBuild: "GRch38", CreatedOn: mockTaskFixedTime,
		}}, nil
	}
	return nil, nil
}

// emptyTaskRepo overrides ListTasksByCaseSeqAndTaskType to return nil so the
// handler's nil → [] coercion can be exercised explicitly.
type emptyTaskRepo struct{ MockRepository }

func (e *emptyTaskRepo) ListTasksByCaseSeqAndTaskType(context.Context, int, int, string) ([]types.TaskOccurrenceType, error) {
	return nil, nil
}

// ---------------------------------------------------------------------------
// Test helper
// ---------------------------------------------------------------------------

// caseOccurrenceTasksRequest takes the path params as raw strings so the helper
// can exercise both happy and non-integer-id branches.
func caseOccurrenceTasksRequest(caseId string, seqId string, dataType string) *httptest.ResponseRecorder {
	repo := &MockRepository{}
	router := gin.Default()
	router.GET("/:tenant/cases/:case_id/:seq_id/tasks_with_occurrences", CaseOccurrenceTasksHandler(repo))

	url := fmt.Sprintf("/radiant/cases/%s/%s/tasks_with_occurrences", caseId, seqId)
	if dataType != "" {
		url = fmt.Sprintf("%s?data_type=%s", url, dataType)
	}
	req, _ := http.NewRequest("GET", url, nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

func Test_CaseOccurrenceTasksHandler_GermlineSNV_DispatchesGermlineAnnotationTaskType(t *testing.T) {
	w := caseOccurrenceTasksRequest("1", "1", "germline_snv")

	expected := `[{"id":92,"task_type_code":"radiant_germline_annotation","task_type_name":"RADIANT Germline Annotation","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2024-01-01T00:00:00Z"}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_CaseOccurrenceTasksHandler_GermlineCNV_DispatchesGermlineAlignmentTaskType(t *testing.T) {
	w := caseOccurrenceTasksRequest("1", "1", "germline_cnv")

	expected := `[{"id":91,"task_type_code":"alignment_germline_variant_calling","task_type_name":"Genome Alignment and Germline Variant Calling","pipeline_name":"Dragen","pipeline_version":"4.4.4","genome_build":"GRch38","created_on":"2024-01-01T00:00:00Z"}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_CaseOccurrenceTasksHandler_SomaticSNV_DispatchesSomaticAnnotationTaskType(t *testing.T) {
	w := caseOccurrenceTasksRequest("71", "73", "somatic_snv")

	// pipeline_name uses omitempty and is "" in the mock — must be absent from JSON.
	expected := `[{"id":93,"task_type_code":"radiant_somatic_annotation","task_type_name":"RADIANT Somatic Annotation","pipeline_version":"1.0.0","genome_build":"GRch38","created_on":"2024-01-01T00:00:00Z"}]`
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, expected, w.Body.String())
}

func Test_CaseOccurrenceTasksHandler_NilRepoResult_RendersAsEmptyJSONArray(t *testing.T) {
	router := gin.Default()
	router.GET("/:tenant/cases/:case_id/:seq_id/tasks_with_occurrences", CaseOccurrenceTasksHandler(&emptyTaskRepo{}))

	req, _ := http.NewRequest("GET", "/radiant/cases/1/1/tasks_with_occurrences?data_type=germline_snv", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "[]", w.Body.String())
}

func Test_CaseOccurrenceTasksHandler_RepositoryError_Returns500(t *testing.T) {
	w := caseOccurrenceTasksRequest("9999", "1", "germline_snv")

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}

func Test_CaseOccurrenceTasksHandler_NonIntegerCaseId_Returns404(t *testing.T) {
	w := caseOccurrenceTasksRequest("not-a-number", "1", "germline_snv")

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_CaseOccurrenceTasksHandler_NonIntegerSeqId_Returns404(t *testing.T) {
	w := caseOccurrenceTasksRequest("1", "not-a-number", "germline_snv")

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_CaseOccurrenceTasksHandler_MissingDataType_Returns400(t *testing.T) {
	w := caseOccurrenceTasksRequest("1", "1", "")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_CaseOccurrenceTasksHandler_InvalidDataType_Returns400(t *testing.T) {
	w := caseOccurrenceTasksRequest("1", "1", "not_a_real_type")

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
