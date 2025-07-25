package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"net/http"
	"strconv"
)

// SearchCasesHandler handles search of cases
// @Summary Search cases
// @Id searchCases
// @Description Search cases
// @Tags cases
// @Security bearerauth
// @Param			message	body		types.ListBodyWithCriteria	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.CasesSearchResponse
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /cases/search [post]
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
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutocompleteResult
// @Failure 500 {object} types.ApiError
// @Router /cases/autocomplete [get]
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
// @Param			message	body		types.FiltersBodyWithCriteria	true	"Filters Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.CaseFilters
// @Failure 500 {object} types.ApiError
// @Router /cases/filters [post]
func CasesFiltersHandler(repo repository.CasesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.FiltersBodyWithCriteria
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		query, err := types.NewAggregationQueryFromCriteria(body.SearchCriteria, types.CasesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		filters, err := repo.GetCasesFilters(query)
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
// @Param case_id path string true "Case ID"
// @Produce json
// @Success 200 {object} types.CaseEntity
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /cases/{case_id} [get]
func CaseEntityHandler(repo repository.CasesDAO) gin.HandlerFunc {
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
		c.JSON(http.StatusOK, caseEntity)
	}
}
