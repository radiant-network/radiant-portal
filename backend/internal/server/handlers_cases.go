package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

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
// @Router /{tenant}/cases/search [post]
func SearchCasesHandler(repo repository.CasesDAO) gin.HandlerFunc {
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
		cases, count, err := repo.SearchCases(query)
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
// @Router /{tenant}/cases/autocomplete [get]
func CasesAutocompleteHandler(repo repository.CasesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		ids, err := repo.SearchById(prefix, limit)
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
// @Param tenant path string true "Tenant code"
// @Router /{tenant}/cases/filters [get]
func CasesFiltersHandler(repo repository.CasesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		filters, err := repo.GetCasesFilters()
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
// @Router /{tenant}/cases/{case_id} [get]
func CaseEntityHandler(repo repository.CasesDAO, igvRepo igvReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, errCaseId := strconv.Atoi(c.Param("case_id"))
		if errCaseId != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		caseEntity, err := repo.GetCaseEntity(caseId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if caseEntity == nil {
			HandleNotFoundError(c, "case")
			return
		}
		igvTracks, err := igvRepo.GetIGV(caseId)
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
// @Router /{tenant}/cases/{case_id}/documents/search [post]
func CaseEntityDocumentsSearchHandler(repo repository.DocumentsDAO) gin.HandlerFunc {
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
		documents, count, err := repo.SearchDocuments(query)
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
// @Router /{tenant}/cases/{case_id}/{seq_id}/tasks_with_occurrences [get]
func CaseOccurrenceTasksHandler(repo repository.TaskDAO) gin.HandlerFunc {
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

		tasks, err := repo.ListTasksByCaseSeqAndTaskType(caseId, seqId, *taskTypeCode)
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
// @Router /{tenant}/cases/{case_id}/documents/filters [get]
func CaseEntityDocumentsFiltersHandler(repo repository.DocumentsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		filters, err := repo.GetDocumentsFilters(false)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, filters)
	}
}
