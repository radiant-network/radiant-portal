package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

// OccurrencesSomaticSNVListHandler handles list of somatic SNV occurrences
// @Summary List somatic SNV occurrences
// @Id listSomaticSNVOccurrences
// @Description List somatic SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param			message	body		types.ListBodyWithSqon	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.SomaticSNVOccurrence
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/somatic/snv/{case_id}/{seq_id}/list [post]
func OccurrencesSomaticSNVListHandler(repo repository.SomaticSNVOccurrencesDAO) gin.HandlerFunc {
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

		occurrences, err := repo.GetOccurrences(caseID, seqID, query)
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
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param			message	body		types.CountBodyWithSqon	true	"Count Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Count
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/somatic/snv/{case_id}/{seq_id}/count [post]
func OccurrencesSomaticSNVCountHandler(repo repository.SomaticSNVOccurrencesDAO) gin.HandlerFunc {
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
		count, err := repo.CountOccurrences(caseID, seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		countResponse := types.Count{count}
		c.JSON(http.StatusOK, countResponse)
	}
}

// OccurrencesSomaticSNVAggregateHandler handles aggregation of somatic SNV occurrences
// @Summary Aggregate somatic SNV occurrences
// @Id aggregateSomaticSNVOccurrences
// @Description Aggregate somatic SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param with_dictionary query bool false "Whether to include all possible facet values" default(false)
// @Param			message	body		types.AggregationBodyWithSqon	true	"Aggregation Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Aggregation
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/somatic/snv/{case_id}/{seq_id}/aggregate [post]
func OccurrencesSomaticSNVAggregateHandler(repo repository.SomaticSNVOccurrencesDAO, facetsRepo repository.FacetsRepositoryDAO) gin.HandlerFunc {
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
		aggregation, err := repo.AggregateOccurrences(caseID, seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}

		if err := c.ShouldBindQuery(&queryParam); err != nil {
			HandleValidationError(c, err)
			return
		}

		if queryParam.WithDictionary {
			facets, err := facetsRepo.GetFacets([]string{body.Field})
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
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param			message	body		types.StatisticsBodyWithSqon	true	"Statistics Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.Statistics
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/somatic/snv/{case_id}/{seq_id}/statistics [post]
func OccurrencesSomaticSNVStatisticsHandler(repo repository.SomaticSNVOccurrencesDAO) gin.HandlerFunc {
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
		statistics, err := repo.GetStatisticsOccurrences(caseID, seqID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, statistics)
	}
}
