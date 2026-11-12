package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type snvVariantSearcher interface {
	SearchVariants(ctx context.Context, seqId int, taskId int, identifier types.VariantIdentifier) ([]types.VariantSearchHit, error)
}

// OccurrencesGermlineSNVSearchHandler searches a variant identifier among the germline SNVs of a run
// @Summary Search a variant in the germline SNVs of a run
// @Id searchGermlineSNVOccurrences
// @Description Exact search of a locus, an HGVSg, an rsID or a ClinVar variation ID among the germline SNVs of a run.
// @Description Answers 200 in every case: the status tells a variant found, absent from the run or an input of no known format.
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Sequence ID"
// @Param task_id path int true "Task ID"
// @Param message body types.VariantSearchBody true "Search Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantSearchResult
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/germline/snv/{case_id}/{seq_id}/{task_id}/search [post]
func OccurrencesGermlineSNVSearchHandler(repo snvVariantSearcher) gin.HandlerFunc {
	return searchSNVVariants(repo)
}

// OccurrencesSomaticSNVSearchHandler searches a variant identifier among the somatic SNVs of a run
// @Summary Search a variant in the somatic SNVs of a run
// @Id searchSomaticSNVOccurrences
// @Description Exact search of a locus, an HGVSg, an rsID or a ClinVar variation ID among the somatic SNVs of a run; seq_id is the tumor sequencing.
// @Description Answers 200 in every case: the status tells a variant found, absent from the run or an input of no known format.
// @Tags occurrences
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param seq_id path int true "Tumor sequence ID"
// @Param task_id path int true "Task ID"
// @Param message body types.VariantSearchBody true "Search Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantSearchResult
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/occurrences/somatic/snv/{case_id}/{seq_id}/{task_id}/search [post]
func OccurrencesSomaticSNVSearchHandler(repo snvVariantSearcher) gin.HandlerFunc {
	return searchSNVVariants(repo)
}

func searchSNVVariants(repo snvVariantSearcher) gin.HandlerFunc {
	return func(c *gin.Context) {
		var body types.VariantSearchBody
		if err := c.ShouldBindJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}
		if _, err := strconv.Atoi(c.Param("case_id")); err != nil {
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

		identifier, err := types.ParseVariantIdentifier(body.Input)
		if err != nil {
			c.JSON(http.StatusOK, types.VariantSearchResult{Status: types.VariantSearchUnrecognizedFormat, Variants: []types.VariantSearchHit{}})
			return
		}

		hits, err := repo.SearchVariants(c.Request.Context(), seqID, taskID, identifier)
		if err != nil {
			HandleError(c, err)
			return
		}
		result := types.VariantSearchResult{
			Status:          types.VariantSearchFound,
			MatchedField:    identifier.Field,
			NormalizedInput: identifier.Value,
			Variants:        hits,
		}
		if len(hits) == 0 {
			result.Status = types.VariantSearchNotFoundInRun
			result.Variants = []types.VariantSearchHit{}
		}
		c.JSON(http.StatusOK, result)
	}
}
