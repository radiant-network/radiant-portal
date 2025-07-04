package server

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"net/http"
	"strconv"
)

// GetGermlineVariantHeader handles retrieving a germline variant header by its locus
// @Summary Get a germline VariantHeader
// @Id getGermlineVariantHeader
// @Description Retrieve germline Variant Header data for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantHeader
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/header [get]
func GetGermlineVariantHeader(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		variantHeader, err := repo.GetVariantHeader(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if variantHeader == nil {
			HandleNotFoundError(c, "variant")
			return
		}
		c.JSON(http.StatusOK, variantHeader)
	}
}

// GetGermlineVariantOverview handles retrieving a germline variant overview by its locus
// @Summary Get a germline VariantOverview
// @Id getGermlineVariantOverview
// @Description Retrieve germline Variant Overview data for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantOverview
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/overview [get]
func GetGermlineVariantOverview(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		variantOverview, err := repo.GetVariantOverview(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if variantOverview == nil {
			HandleNotFoundError(c, "variant")
			return
		}
		c.JSON(http.StatusOK, variantOverview)
	}
}

// GetGermlineVariantConsequences handles retrieving a germline variant consequences by its locus
// @Summary Get list of VariantConsequences for a germline variant
// @Id getGermlineVariantConsequences
// @Description Retrieve germline Variant Consequences for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {array} types.VariantConsequence
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/consequences [get]
func GetGermlineVariantConsequences(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		variantConsequences, err := repo.GetVariantConsequences(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if variantConsequences == nil {
			HandleNotFoundError(c, "variant")
			return
		}
		c.JSON(http.StatusOK, variantConsequences)
	}
}

// GetGermlineVariantInterpretedCases handles retrieving a variant interpreted cases by its locus
// @Summary Get list of interpreted Cases for a germline variant
// @Id getGermlineVariantInterpretedCases
// @Description Retrieve Germline Variant interpreted cases for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Param			message	body		types.ListBodyWithCriteria	true	"Search Body with criteria"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantInterpretedCasesSearchResponse
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/cases/interpreted [post]
func GetGermlineVariantInterpretedCases(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
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
		query, err := types.NewListQueryFromCriteria(types.VariantInterpretedCasesQueryConfig, body.AdditionalFields, body.SearchCriteria, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		cases, count, err := repo.GetVariantInterpretedCases(locusID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		if cases == nil {
			HandleNotFoundError(c, "variant interpreted cases")
			return
		}
		searchResponse := types.SearchResponse[types.VariantInterpretedCase]{List: *cases, Count: *count}
		c.JSON(http.StatusOK, searchResponse)
	}
}

// GetGermlineVariantUninterpretedCases handles retrieving a variant uninterpreted cases by its locus
// @Summary Get list of uninterpreted Cases for a germline variant
// @Id getGermlineVariantUninterpretedCases
// @Description Retrieve Germline Variant uninterpreted cases for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Param			message	body		types.ListBodyWithCriteria	true	"Search Body with criteria"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantUninterpretedCasesSearchResponse
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/cases/uninterpreted [post]
func GetGermlineVariantUninterpretedCases(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
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
		query, err := types.NewListQueryFromCriteria(types.VariantUninterpretedCasesQueryConfig, body.AdditionalFields, body.SearchCriteria, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		cases, count, err := repo.GetVariantUninterpretedCases(locusID, query)
		if err != nil {
			HandleError(c, err)
			return
		}
		if cases == nil {
			HandleNotFoundError(c, "variant uninterpreted cases")
			return
		}
		searchResponse := types.SearchResponse[types.VariantUninterpretedCase]{List: *cases, Count: *count}
		c.JSON(http.StatusOK, searchResponse)
	}
}

// GetExpendedGermlineVariantInterpretedCase handles retrieving expended interpreted case for a given locus, sequencing and transcript
// @Summary Get expended germline interpreted case for a given locus, sequencing and transcript
// @Id getExpendedGermlineVariantInterpretedCase
// @Description Retrieve germline expended interpreted case for a given locus, sequencing and transcript
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Param seq_id path string true "Seq ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.VariantExpendedInterpretedCase
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/cases/interpreted/{seq_id}/{transcript_id} [get]
func GetExpendedGermlineVariantInterpretedCase(repo repository.VariantsDAO) gin.HandlerFunc {
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
		transcriptId := c.Param("transcript_id")
		cases, err := repo.GetVariantExpendedInterpretedCase(locusId, seqId, transcriptId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if cases == nil {
			HandleNotFoundError(c, "variant expended interpreted case")
			return
		}
		c.JSON(http.StatusOK, cases)
	}
}

// GetGermlineVariantCasesCount handles retrieving cases count for a given locus id
// @Summary Get germline cases count for a given locus
// @Id getGermlineVariantCasesCount
// @Description Retrieve cases count for a given locus id
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.Count
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/cases/count [get]
func GetGermlineVariantCasesCount(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusId, errLocus := strconv.Atoi(c.Param("locus_id"))
		if errLocus != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		count, err := repo.GetVariantCasesCount(locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		countResponse := types.Count{Count: count}
		c.JSON(http.StatusOK, countResponse)
	}
}

// GetGermlineVariantCasesFilters handles retrieving cases filters for variant entity
// @Summary Get cases filters for germline variant entity
// @Id getGermlineVariantCasesFilters
// @Description Retrieve cases filters for germline variant entity
// @Tags variant
// @Security bearerauth
// @Produce json
// @Success 200 {object} types.VariantCasesFilters
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/cases/filters [get]
func GetGermlineVariantCasesFilters(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		filters, err := repo.GetVariantCasesFilters()
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, filters)
	}
}
