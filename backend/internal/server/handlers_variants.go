package server

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
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
func GetGermlineVariantOverview(repo repository.VariantsDAO, exomiserRepository repository.ExomiserDAO, interpretationRepo repository.InterpretationsDAO) gin.HandlerFunc {
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

		exomiserACMGClassificationCounts, err := exomiserRepository.GetExomiserACMGClassificationCounts(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}

		if exomiserACMGClassificationCounts != nil {
			variantOverview.ExomiserACMGClassificationCounts = exomiserACMGClassificationCounts
		}

		interpretationClassificationCounts, err := interpretationRepo.RetrieveGermlineInterpretationClassificationCounts(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}

		if interpretationClassificationCounts != nil {
			variantOverview.InterpretationClassificationCounts = interpretationClassificationCounts
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

// GetExpandedGermlineVariantInterpretedCase handles retrieving expanded interpreted case for a given locus, sequencing and transcript
// @Summary Get expanded germline interpreted case for a given locus, sequencing and transcript
// @Id getExpandedGermlineVariantInterpretedCase
// @Description Retrieve germline expanded interpreted case for a given locus, sequencing and transcript
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Param case_id path string true "Case ID"
// @Param seq_id path string true "Seq ID"
// @Param transcript_id path string true "Transcript ID"
// @Produce json
// @Success 200 {object} types.VariantExpandedInterpretedCase
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/cases/interpreted/{case_id}/{seq_id}/{transcript_id} [get]
func GetExpandedGermlineVariantInterpretedCase(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		caseId, errCase := strconv.Atoi(c.Param("case_id"))
		if errCase != nil {
			HandleNotFoundError(c, "case_id")
			return
		}
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
		cases, err := repo.GetVariantExpandedInterpretedCase(locusId, caseId, seqId, transcriptId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if cases == nil {
			HandleNotFoundError(c, "variant expanded interpreted case")
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
// @Success 200 {object} types.VariantCasesCount
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
		counts, err := repo.GetVariantCasesCount(locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, counts)
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

// GetGermlineVariantConditions handles retrieving conditions for germline variant entity for a specific gene panel
// @Summary Get conditions for germline variant entity for a specific gene panel
// @Id getGermlineVariantConditions
// @Description Retrieve conditions for germline variant entity for a specific gene panel
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Param panel_type path string true "Gene panel type" Enums(omim, hpo, orphanet)
// @Param filter query string false "Condition filter"
// @Produce json
// @Success 200 {object} types.GenePanelConditions
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/conditions/{panel_type} [get]
func GetGermlineVariantConditions(repo repository.GenePanelsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusId, errLocus := strconv.Atoi(c.Param("locus_id"))
		if errLocus != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		panelType := c.Param("panel_type")
		filter := c.Query("filter")
		genePanelConditions, err := repo.GetVariantGenePanelConditions(panelType, locusId, filter)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, genePanelConditions)
	}
}

// GetGermlineVariantConditionsClinvar handles retrieving ClinVar conditions for germline variant entity
// @Summary Get ClinVar conditions for germline variant entity
// @Id GetGermlineVariantConditionsClinvar
// @Description Retrieve ClinVar conditions for germline variant entity
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {array} types.ClinvarRCV
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/conditions/clinvar [get]
func GetGermlineVariantConditionsClinvar(repo repository.ClinvarRCVDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusId, errLocus := strconv.Atoi(c.Param("locus_id"))
		if errLocus != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		clinvarConditions, err := repo.GetVariantClinvarConditions(locusId)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, clinvarConditions)
	}
}

// GetGermlineVariantExternalFrequenciesHandler handles retrieving external frequencies for a given locus id
// @Summary Get external frequencies
// @Id getGermlineVariantExternalFrequencies
// @Description Retrieve external frequencies for a given locus id
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantExternalFrequencies
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/external_frequencies [get]
func GetGermlineVariantExternalFrequenciesHandler(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		variantExternalFrequencies, err := repo.GetVariantExternalFrequencies(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if variantExternalFrequencies == nil {
			HandleNotFoundError(c, "variant")
			return
		}
		c.JSON(http.StatusOK, variantExternalFrequencies)
	}
}

// GetGermlineVariantInternalFrequenciesHandler handles retrieving internal frequencies for a given locus id
// @Summary Get internal frequencies
// @Id getGermlineVariantInternalFrequencies
// @Description Retrieve internal frequencies for a given locus id
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Param split query string true "split type (project or primary_condition)"
// @Produce json
// @Success 200 {object} types.VariantInternalFrequencies
// @Failure 400 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/germline/{locus_id}/internal_frequencies [get]
func GetGermlineVariantInternalFrequenciesHandler(repo repository.VariantsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var variantInternalFrequencies *types.VariantInternalFrequencies

		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}
		split := c.Request.URL.Query().Get("split")
		switch split {
		case "project":
			variantInternalFrequencies, err = repo.GetVariantInternalFrequenciesSplitByProject(locusID)
			break
		default:
			HandleValidationError(c, fmt.Errorf("incorrect split"))
			return
		}
		if err != nil {
			HandleError(c, err)
			return
		}
		if variantInternalFrequencies == nil {
			HandleNotFoundError(c, "variant")
			return
		}
		c.JSON(http.StatusOK, variantInternalFrequencies)
	}
}
