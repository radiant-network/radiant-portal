package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type casesReader interface {
	SearchCases(ctx context.Context, userQuery types.ListQuery) (*[]types.CaseResult, *int64, error)
	SearchById(ctx context.Context, prefix string, limit int) (*[]types.AutocompleteResult, error)
	GetCasesFilters(ctx context.Context) (*types.CaseFilters, error)
	GetCaseEntity(ctx context.Context, caseId int) (*types.CaseEntity, error)
}

type caseDocumentsReader interface {
	SearchDocuments(ctx context.Context, userQuery types.ListQuery) (*[]types.DocumentResult, *int64, error)
	GetDocumentsFilters(ctx context.Context, withProjectAndLab bool) (*types.DocumentFilters, error)
}

type caseTasksReader interface {
	ListTasksByCaseSeqAndTaskType(ctx context.Context, caseId int, seqId int, taskTypeCode string) ([]types.TaskOccurrenceType, error)
}

// SearchCasesHandler handles search of cases
// @Summary Search cases
// @Id searchCases
// @Description Search cases
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param			message	body		types.ListBodyWithCriteria	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.CasesSearchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/search [post]
func SearchCasesHandler(repo casesReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.ListBodyWithCriteria
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		var p = types.ResolvePagination(body.Limit, body.Offset, body.PageIndex)
		query, err := types.NewListQueryFromCriteria(types.CasesQueryConfig, body.AdditionalFields, body.SearchCriteria, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		cases, count, err := repo.SearchCases(c.Request.Context(), query)
		if err != nil {
			HandleError(c, err)
			return
		}

		searchResponse := types.SearchResponse[types.CaseResult]{List: *cases, Count: *count}
		c.JSON(http.StatusOK, searchResponse)
	}
}

// CasesAutocompleteHandler handles retrieving ids by autocomplete
// @Summary Get types.AutocompleteResult list of matching prefix
// @Id autocompleteCases
// @Description Retrieve types.AutocompleteResult list of ids matching prefix
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutocompleteResult
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/autocomplete [get]
func CasesAutocompleteHandler(repo casesReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		ids, err := repo.SearchById(c.Request.Context(), prefix, limit)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, ids)
	}
}

// CasesFiltersHandler handles retrieving cases filters
// @Summary Get types.CaseFilters cases filters
// @Id casesFilters
// @Description Retrieve types.CaseFilters cases filters
// @Tags cases
// @Security bearerauth
// @Produce json
// @Success 200 {object} types.CaseFilters
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Param tenant path string true "Tenant code"
// @Router /{tenant}/cases/filters [get]
func CasesFiltersHandler(repo casesReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		filters, err := repo.GetCasesFilters(c.Request.Context())
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, filters)
	}
}

// CaseEntityHandler handles retrieving a case by its ID
// @Summary Get types.CaseEntity case entity
// @Id caseEntity
// @Description Retrieve types.CaseEntity by its ID
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Produce json
// @Success 200 {object} types.CaseEntity
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/{case_id} [get]
func CaseEntityHandler(repo casesReader, igvRepo igvReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, errCaseId := strconv.Atoi(c.Param("case_id"))
		if errCaseId != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		caseEntity, err := repo.GetCaseEntity(c.Request.Context(), caseId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if caseEntity == nil {
			HandleNotFoundError(c, "case")
			return
		}
		igvTracks, err := igvRepo.GetIGV(c.Request.Context(), caseId)
		if err != nil {
			HandleError(c, err)
			return
		}
		caseEntity.HasIGVFiles = len(igvTracks) > 0
		c.JSON(http.StatusOK, caseEntity)
	}
}

// CaseEntityDocumentsSearchHandler handles searching for documents for specific case
// @Summary Search types.DocumentResult list for a case entity
// @Id caseEntityDocumentsSearch
// @Description Search for types.DocumentResult list for a case entity
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param			message	body		types.ListBodyWithCriteria	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.DocumentsSearchResponse
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/{case_id}/documents/search [post]
func CaseEntityDocumentsSearchHandler(repo caseDocumentsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.ListBodyWithCriteria
		)
		caseId, errCaseId := strconv.Atoi(c.Param("case_id"))
		if errCaseId != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		var p = types.ResolvePagination(body.Limit, body.Offset, body.PageIndex)
		var caseIdFilter = types.SearchCriterion{FieldName: types.CaseIdField.Alias, Value: []interface{}{caseId}}
		var criteria = append(body.SearchCriteria, caseIdFilter)
		query, err := types.NewListQueryFromCriteria(types.DocumentsQueryConfig, body.AdditionalFields, criteria, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		documents, count, err := repo.SearchDocuments(c.Request.Context(), query)
		if err != nil {
			HandleError(c, err)
			return
		}

		searchResponse := types.DocumentsSearchResponse{List: *documents, Count: *count}
		c.JSON(http.StatusOK, searchResponse)
	}
}

// CaseOccurrenceTasksHandler returns the tasks attached to a (case, sequencing) pair
// whose task type produces occurrences of the requested OccurrenceType. Used to
// populate the task dropdown of the Variants tab header.
//
// The task_type that produces each occurrence type is resolved server-side; clients
// only need to pass the occurrence type (germline_snv, germline_cnv, somatic_snv).
// @Summary List tasks producing occurrences of a given type for a (case, sequencing) pair
// @Id caseTasksWithOccurrences
// @Description Return tasks attached to the given case and sequencing experiment whose task type produces occurrences of the requested occurrence type. Sorted by created_on DESC. Returns an empty list (200) when no task matches.
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequencing Experiment ID"
// @Param data_type query string true "Occurrence type" Enums(germline_snv, germline_cnv, somatic_snv)
// @Produce json
// @Success 200 {array} types.TaskOccurrenceType
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/{case_id}/{seq_id}/tasks_with_occurrences [get]
func CaseOccurrenceTasksHandler(repo caseTasksReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqId, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskTypeCode, err := types.OccurrenceType(c.Query("data_type")).TaskTypeCode()
		if err != nil {
			HandleValidationError(c, err)
			return
		}

		tasks, err := repo.ListTasksByCaseSeqAndTaskType(c.Request.Context(), caseId, seqId, *taskTypeCode)
		if err != nil {
			HandleError(c, err)
			return
		}
		if tasks == nil {
			tasks = []types.TaskOccurrenceType{}
		}
		c.JSON(http.StatusOK, tasks)
	}
}

// CaseEntityDocumentsFiltersHandler handles retrieving documents filters for a specific case
// @Summary Get types.DocumentFilters documents filters for a specific case
// @Id caseEntityDocumentsFilters
// @Description Retrieve types.DocumentFilters documents filters for a specific case
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Produce json
// @Success 200 {object} types.DocumentFilters
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/{case_id}/documents/filters [get]
func CaseEntityDocumentsFiltersHandler(repo caseDocumentsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		filters, err := repo.GetDocumentsFilters(c.Request.Context(), false)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, filters)
	}
}
