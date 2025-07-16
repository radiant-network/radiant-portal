package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

// OccurrencesGermlineListHandler handles list of germline occurrences
// @Summary List germline occurrences
// @Id listGermlineOccurrences
// @Description List germline occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.ListBodyWithSqon	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Occurrence
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/list [post]
func OccurrencesGermlineListHandler(repo repository.OccurrencesDAO) gin.HandlerFunc {
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
		query, err := types.NewListQueryFromSqon(types.OccurrencesQueryConfig, body.AdditionalFields, body.Sqon, p, body.Sort)
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

// OccurrencesGermlineCountHandler handles counting germline occurrences
// @Summary Count germline occurrences
// @Id countGermlineOccurrences
// @Description Counts germline occurrences for a given sequence ID
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
// @Router /occurrences/germline/{seq_id}/count [post]
func OccurrencesGermlineCountHandler(repo repository.OccurrencesDAO) gin.HandlerFunc {
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
		query, err := types.NewCountQueryFromSqon(body.Sqon, types.OccurrencesFields)
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

// OccurrencesGermlineAggregateHandler handles aggregation of germline occurrences
// @Summary Aggregate germline occurrences
// @Id aggregateGermlineOccurrences
// @Description Aggregate germline occurrences for a given sequence ID
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
// @Router /occurrences/germline/{seq_id}/aggregate [post]
func OccurrencesGermlineAggregateHandler(repo repository.OccurrencesDAO) gin.HandlerFunc {
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

		query, err := types.NewAggregationQueryFromSqon(body.Field, body.Sqon, types.OccurrencesFields)
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

// OccurrencesGermlineStatisticsHandler handles statistics of occurrences
// @Summary Statistics of germline occurrences
// @Id statisticsGermlineOccurrences
// @Description Return statistics about a field for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.StatisticsBodyWithSqon	true	"Statistics Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Statistics
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/statistics [post]
func OccurrencesGermlineStatisticsHandler(repo repository.OccurrencesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.StatisticsBodyWithSqon
			query types.StatisticsQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewStatisticsQueryFromSqon(body.Field, body.Sqon, types.OccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		statistics, err := repo.GetStatisticsOccurrences(seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, statistics)
	}
}

// GetExpandedGermlineOccurrence handles retrieving expanded information about germline occurrence
// @Summary Get a germline ExpandedOccurrence
// @Id getExpandedGermlineOccurrence
// @Description Retrieve ExpandedOccurrence data for a given locus ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.ExpandedOccurrence
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/{locus_id}/expanded [get]
func GetExpandedGermlineOccurrence(repo repository.OccurrencesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		seqId, errSeq := strconv.Atoi(c.Param("seq_id"))
		if errSeq != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		locusId, errLocus := strconv.Atoi(c.Param("locus_id"))
		if errLocus != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		expandedOccurrence, err := repo.GetExpandedOccurrence(seqId, locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if expandedOccurrence == nil {
			HandleNotFoundError(c, "occurrence")
			return
		}
		c.JSON(http.StatusOK, expandedOccurrence)
	}
}
