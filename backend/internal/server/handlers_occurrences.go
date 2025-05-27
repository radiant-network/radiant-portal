package server

import (
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/types"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// OccurrencesGermlineListHandler handles list of germline occurrences
// @Summary List germline occurrences
// @Id listGermlineOccurrences
// @Description List germline occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.ListBody	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Occurrence
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/list [post]
func OccurrencesGermlineListHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.ListBody
			query types.ListQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		var p types.Pagination
		if body.Limit != 0 && body.PageIndex != 0 {
			p = types.Pagination{Limit: body.Limit, PageIndex: body.PageIndex}
		} else if body.Limit != 0 && body.Offset != 0 {
			p = types.Pagination{Limit: body.Limit, Offset: body.Offset}
		} else if body.Limit != 0 {
			p = types.Pagination{Limit: body.Limit, Offset: 0}
		} else {
			p = types.Pagination{Limit: 10, Offset: 0}
		}
		query, err := types.NewListQuery(body.AdditionalFields, body.Sqon, types.OccurrencesFields, types.OccurrencesDefaultFields, &p, body.Sort)
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
// @Param			message	body		types.CountBody	true	"Count Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Count
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/count [post]
func OccurrencesGermlineCountHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.CountBody
			query types.CountQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		query, err := types.NewCountQuery(body.Sqon, types.OccurrencesFields)
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
// @Param			message	body		types.AggregationBody	true	"Aggregation Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Aggregation
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/aggregate [post]
func OccurrencesGermlineAggregateHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.AggregationBody
			query types.AggQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewAggregationQuery(body.Field, body.Sqon, types.OccurrencesFields)
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
// @Param			message	body		types.StatisticsBody	true	"Statistics Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Statistics
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/statistics [post]
func OccurrencesGermlineStatisticsHandler(repo repository.StarrocksDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body  types.StatisticsBody
			query types.StatisticsQuery
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewStatisticsQuery(body.Field, body.Sqon, types.OccurrencesFields)
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

// GetExpendedGermlineOccurrence handles retrieving expended information about germline occurrence
// @Summary Get a germline ExpendedOccurrence
// @Id getExpendedGermlineOccurrence
// @Description Retrieve ExpendedOccurrence data for a given locus ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.ExpendedOccurrence
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/{seq_id}/{locus_id}/expended [get]
func GetExpendedGermlineOccurrence(repo repository.StarrocksDAO) gin.HandlerFunc {
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
		expendedOccurrence, err := repo.GetExpendedOccurrence(seqId, locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if expendedOccurrence == nil {
			HandleNotFoundError(c, "occurrence")
			return
		}
		c.JSON(http.StatusOK, expendedOccurrence)
	}
}
