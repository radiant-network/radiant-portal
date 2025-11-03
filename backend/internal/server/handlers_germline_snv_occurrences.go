package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

// OccurrencesGermlineSNVListHandler handles list of germline SNV occurrences
// @Summary List germline SNV occurrences
// @Id listGermlineSNVOccurrences
// @Description List germline SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param			message	body		types.ListBodyWithSqon	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.GermlineSNVOccurrence
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/snv/{seq_id}/list [post]
func OccurrencesGermlineSNVListHandler(repo repository.GermlineSNVOccurrencesDAO) gin.HandlerFunc {
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
		query, err := types.NewListQueryFromSqon(types.GermlineSNVOccurrencesQueryConfig, body.AdditionalFields, body.Sqon, p, body.Sort)
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

// OccurrencesGermlineSNVCountHandler handles counting germline SNV occurrences
// @Summary Count germline SNV occurrences
// @Id countGermlineSNVOccurrences
// @Description Counts germline SNV occurrences for a given sequence ID
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
// @Router /occurrences/germline/snv/{seq_id}/count [post]
func OccurrencesGermlineSNVCountHandler(repo repository.GermlineSNVOccurrencesDAO) gin.HandlerFunc {
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
		query, err := types.NewCountQueryFromSqon(body.Sqon, types.GermlineSNVOccurrencesFields)
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

// OccurrencesGermlineSNVAggregateHandler handles aggregation of germline SNV occurrences
// @Summary Aggregate germline SNV occurrences
// @Id aggregateGermlineSNVOccurrences
// @Description Aggregate germline SNV occurrences for a given sequence ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param with_dictionary query bool false "Whether to include all possible facet values" default(false)
// @Param			message	body		types.AggregationBodyWithSqon	true	"Aggregation Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.Aggregation
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/snv/{seq_id}/aggregate [post]
func OccurrencesGermlineSNVAggregateHandler(repo repository.GermlineSNVOccurrencesDAO, facetsRepo repository.FacetsRepositoryDAO) gin.HandlerFunc {
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

		query, err := types.NewAggregationQueryFromSqon(body.Field, body.Sqon, types.GermlineSNVOccurrencesFields)
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

// OccurrencesGermlineSNVStatisticsHandler handles statistics of germline SNV occurrences
// @Summary Statistics of germline SNV occurrences
// @Id statisticsGermlineSNVOccurrences
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
// @Router /occurrences/germline/snv/{seq_id}/statistics [post]
func OccurrencesGermlineSNVStatisticsHandler(repo repository.GermlineSNVOccurrencesDAO) gin.HandlerFunc {
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

		query, err := types.NewStatisticsQueryFromSqon(body.Field, body.Sqon, types.GermlineSNVOccurrencesFields)
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

// GetExpandedGermlineSNVOccurrence handles retrieving expanded information about germline SNV occurrence
// @Summary Get a germline ExpandedGermlineSNVOccurrence
// @Id getExpandedGermlineSNVOccurrence
// @Description Retrieve ExpandedGermlineSNVOccurrence data for a given locus ID
// @Tags occurrences
// @Security bearerauth
// @Param seq_id path string true "Sequence ID"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.ExpandedGermlineSNVOccurrence
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/snv/{seq_id}/{locus_id}/expanded [get]
func GetExpandedGermlineSNVOccurrence(repo repository.GermlineSNVOccurrencesDAO, exomiserRepo repository.ExomiserDAO, interpretationRepo repository.InterpretationsDAO) gin.HandlerFunc {
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

		exomiserACMGClassificationCounts, err := exomiserRepo.GetExomiserACMGClassificationCounts(locusId)
		if err != nil {
			HandleError(c, err)
			return
		}

		if exomiserACMGClassificationCounts != nil {
			expandedOccurrence.ExomiserACMGClassificationCounts = exomiserACMGClassificationCounts
		}

		interpretationClassificationCounts, err := interpretationRepo.RetrieveGermlineInterpretationClassificationCounts(locusId)
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

// GetGermlineSNVDictionary handles retrieving germline SNV facets dictionary
// @Summary Get germline SNV facets dictionary
// @Id getGermlineSNVDictionary
// @Description Retrieve germline SNV facets
// @Tags occurrences
// @Security bearerauth
// @Param facets query []string false "One or more facets to retrieve"
// @Produce json
// @Success 200 {array} types.Facet
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /occurrences/germline/snv/dictionary [get]
func GetGermlineSNVDictionary(repo repository.FacetsRepositoryDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var queryParam types.FacetsQueryParam
		if err := c.ShouldBindQuery(&queryParam); err != nil {
			HandleValidationError(c, err)
			return
		}

		facets, err := repo.GetFacets(queryParam.Facets)
		if err != nil {
			HandleNotFoundError(c, "facet")
			return
		}

		c.JSON(http.StatusOK, facets)
	}
}
