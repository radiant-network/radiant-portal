package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type somaticInterpretationCountsReader interface {
	RetrieveSomaticInterpretationClassificationCounts(ctx context.Context, locusId int) (types.JsonMap[string, int], error)
}

type somaticSNVOccurrencesReader interface {
	GetOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userFilter types.ListQuery) ([]types.SomaticSNVOccurrence, error)
	CountOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.CountQuery) (int64, error)
	AggregateOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.AggQuery) ([]types.Aggregation, error)
	GetStatisticsOccurrences(ctx context.Context, caseId int, seqId int, taskId int, userQuery types.StatisticsQuery) (*types.Statistics, error)
	GetExpandedOccurrence(ctx context.Context, caseId int, seqId int, taskId int, locusId int) (*types.ExpandedSomaticSNVOccurrence, error)
}

// OccurrencesSomaticSNVListHandler handles list of somatic SNV occurrences
// @Summary List somatic SNV occurrences
// @Id listSomaticSNVOccurrences
// @Description List somatic SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param			message	body		types.ListBodyWithSqon	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.SomaticSNVOccurrence
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/list [post]
func OccurrencesSomaticSNVListHandler(repo somaticSNVOccurrencesReader) gin.HandlerFunc {
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
		query, err := types.NewListQueryFromSqon(types.SomaticSNVOccurrencesQueryConfig, body.AdditionalFields, body.Sqon, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskID, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}

		occurrences, err := repo.GetOccurrences(c.Request.Context(), caseID, seqID, taskID, query)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, occurrences)
	}
}

// OccurrencesSomaticSNVCountHandler handles counting somatic SNV occurrences
// @Summary Count somatic SNV occurrences
// @Id countSomaticSNVOccurrences
// @Description Counts somatic SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param			message	body		types.CountBodyWithSqon	true	"Count Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Count
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/count [post]
func OccurrencesSomaticSNVCountHandler(repo somaticSNVOccurrencesReader) gin.HandlerFunc {
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
		query, err := types.NewCountQueryFromSqon(body.Sqon, types.SomaticSNVOccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskID, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}
		count, err := repo.CountOccurrences(c.Request.Context(), caseID, seqID, taskID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		countResponse := types.Count{Count: count}
		c.JSON(http.StatusOK, countResponse)
	}
}

// OccurrencesSomaticSNVAggregateHandler handles aggregation of somatic SNV occurrences
// @Summary Aggregate somatic SNV occurrences
// @Id aggregateSomaticSNVOccurrences
// @Description Aggregate somatic SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param with_dictionary query bool false "Whether to include all possible facet values" default(false)
// @Param			message	body		types.AggregationBodyWithSqon	true	"Aggregation Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Aggregation
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/aggregate [post]
func OccurrencesSomaticSNVAggregateHandler(repo somaticSNVOccurrencesReader, facetsRepo facetsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body       types.AggregationBodyWithSqon
			query      types.AggQuery
			queryParam types.AggregationQueryParam
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}

		query, err := types.NewAggregationQueryFromSqon(body.Field, body.Sqon, types.SomaticSNVOccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskID, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}
		aggregation, err := repo.AggregateOccurrences(c.Request.Context(), caseID, seqID, taskID, query)
		if err != nil {
			HandleError(c, err)
			return
		}

		if err := c.ShouldBindQuery(&queryParam); err != nil {
			HandleValidationError(c, err)
			return
		}

		if queryParam.WithDictionary {
			facets, err := facetsRepo.GetFacets(c.Request.Context(), []string{body.Field})
			if err != nil {
				HandleError(c, err)
				return
			}
			if len(facets) == 0 {
				HandleNotFoundError(c, "facet")
				return
			}

			existingBuckets := make(map[string]struct{}, len(aggregation))
			for _, agg := range aggregation {
				existingBuckets[agg.Bucket] = struct{}{}
			}

			for _, facet := range facets { // Should be only one facet for now
				for _, facetValue := range facet.Values {
					if _, found := existingBuckets[facetValue]; !found {
						aggregation = append(aggregation, types.Aggregation{
							Bucket: facetValue,
							Count:  0,
						})
					}
				}
			}
		}

		c.JSON(http.StatusOK, aggregation)
	}
}

// OccurrencesSomaticSNVStatisticsHandler handles statistics of somatic SNV occurrences
// @Summary Statistics of somatic SNV occurrences
// @Id statisticsSomaticSNVOccurrences
// @Description Return statistics about a field for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param			message	body		types.StatisticsBodyWithSqon	true	"Statistics Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Statistics
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/statistics [post]
func OccurrencesSomaticSNVStatisticsHandler(repo somaticSNVOccurrencesReader) gin.HandlerFunc {
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

		query, err := types.NewStatisticsQueryFromSqon(body.Field, body.Sqon, types.SomaticSNVOccurrencesFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqID, err := strconv.Atoi(c.Param("seq_id"))
		if err != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskID, err := strconv.Atoi(c.Param("task_id"))
		if err != nil {
			HandleNotFoundError(c, "task_id")
			return
		}
		statistics, err := repo.GetStatisticsOccurrences(c.Request.Context(), caseID, seqID, taskID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, statistics)
	}
}

// GetExpandedSomaticSNVOccurrence handles retrieving expanded information about somatic SNV occurrence
// @Summary Get a somatic ExpandedSomaticSNVOccurrence
// @Id getExpandedSomaticSNVOccurrence
// @Description Retrieve ExpandedSomaticSNVOccurrence data for a given locus ID
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.ExpandedSomaticSNVOccurrence
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/{locus_id}/expanded [get]
func GetExpandedSomaticSNVOccurrence(repo somaticSNVOccurrencesReader, interpretationRepo somaticInterpretationCountsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, errSeq := strconv.Atoi(c.Param("case_id"))
		if errSeq != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
		seqId, errSeq := strconv.Atoi(c.Param("seq_id"))
		if errSeq != nil {
			HandleNotFoundError(c, "seq_id")
			return
		}
		taskId, errTask := strconv.Atoi(c.Param("task_id"))
		if errTask != nil {
			HandleNotFoundError(c, "task_id")
			return
		}
		locusId, errLocus := strconv.Atoi(c.Param("locus_id"))
		if errLocus != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		expandedOccurrence, err := repo.GetExpandedOccurrence(c.Request.Context(), caseId, seqId, taskId, locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if expandedOccurrence == nil {
			HandleNotFoundError(c, "occurrence")
			return
		}

		interpretationClassificationCounts, err := interpretationRepo.RetrieveSomaticInterpretationClassificationCounts(c.Request.Context(), locusId)
		if err != nil {
			HandleError(c, err)
			return
		}

		if interpretationClassificationCounts != nil {
			expandedOccurrence.InterpretationClassificationCounts = interpretationClassificationCounts
		}

		c.JSON(http.StatusOK, expandedOccurrence)
	}
}
