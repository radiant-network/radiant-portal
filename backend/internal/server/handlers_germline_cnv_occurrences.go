package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"net/http"
	"strconv"
)

// OccurrencesGermlineCNVListHandler handles list of germline CNV occurrences
// @Summary List germline CNV occurrences
// @Id listGermlineCNVOccurrences
// @Description List germline CNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.ListBodyWithSqon	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.GermlineCNVOccurrence
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/cnv/{seq_id}/list [post]
func OccurrencesGermlineCNVListHandler(repo repository.GermlineCNVOccurrencesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.ListBodyWithSqon
			query types.ListQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		var p = types.ResolvePagination(body.Limit, body.Offset, body.PageIndex)
		query, err := types.NewListQueryFromSqon(types.GermlineCNVOccurrencesQueryConfig, body.AdditionalFields, body.Sqon, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		occurrences, err := repo.GetOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, occurrences)
	}
}

// OccurrencesGermlineCNVCountHandler handles counting germline CNV occurrences
// @Summary Count germline CNV occurrences
// @Id countGermlineCNVOccurrences
// @Description Counts germline CNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.CountBodyWithSqon	true	"Count Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Count
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/cnv/{seq_id}/count [post]
func OccurrencesGermlineCNVCountHandler(repo repository.GermlineCNVOccurrencesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.CountBodyWithSqon
			query types.CountQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		query, err := types.NewCountQueryFromSqon(body.Sqon, types.GermlineCNVOccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		count, err := repo.CountOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		countResponse := types.Count{count}
		c.JSON(http.StatusOK, countResponse)
	}
}

// OccurrencesGermlineCNVAggregateHandler handles aggregation of germline CNV occurrences
// @Summary Aggregate germline CNV occurrences
// @Id aggregateGermlineCNVOccurrences
// @Description Aggregate germline CNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.AggregationBodyWithSqon	true	"Aggregation Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Aggregation
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/cnv/{seq_id}/aggregate [post]
func OccurrencesGermlineCNVAggregateHandler(repo repository.GermlineCNVOccurrencesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.AggregationBodyWithSqon
			query types.AggQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewAggregationQueryFromSqon(body.Field, body.Sqon, types.GermlineCNVOccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		aggregation, err := repo.AggregateOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, aggregation)
	}
}
