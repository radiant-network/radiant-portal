package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"net/http"
	"strconv"
)

// CasesListHandler handles list of cases
// @Summary List cases
// @Id listCases
// @Description List cases
// @Tags cases
// @Security bearerauth
// @Param			message	body		types.ListBodyWithCriteria	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.CaseResult
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /cases/list [post]
func CasesListHandler(repo repository.CasesDAO) gin.HandlerFunc {
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
		cases, err := repo.SearchCases(query)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, cases)
	}
}

// CasesCountHandler handles counting cases
// @Summary Count cases
// @Id countCases
// @Description Counts cases
// @Tags cases
// @Security bearerauth
// @Param			message	body		types.CountBodyWithCriteria	true	"Count Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Count
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /cases/count [post]
func CasesCountHandler(repo repository.CasesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.CountBodyWithCriteria
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		query, err := types.NewCountQueryFromCriteria(body.SearchCriteria, types.CasesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		count, err := repo.CountCases(query)
		if err != nil {
			HandleError(c, err)
			return
		}
		countResponse := types.Count{*count}
		c.JSON(http.StatusOK, countResponse)
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
