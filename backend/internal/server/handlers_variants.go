package server

import (
	"fmt"
	"net/http"
	"slices"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type genePanelConditionsReader interface {
	GetVariantGenePanelConditions(panelType string, locusId int, conditionFilter string) (*types.GenePanelConditions, error)
}

type clinvarConditionsReader interface {
	GetVariantClinvarConditions(locusId int) ([]types.ClinvarRCV, error)
}

type variantsReader interface {
	GetVariantHeader(locusId int) (*types.VariantHeader, error)
	GetVariantOverview(locusId int) (*types.VariantOverview, error)
	GetVariantConsequences(locusId int) (*[]types.VariantConsequence, error)
	GetVariantInterpretedCases(locusId int, userQuery types.ListQuery) (*[]types.VariantInterpretedCase, *int64, error)
	GetVariantUninterpretedCases(locusId int, userQuery types.ListQuery) (*[]types.VariantUninterpretedCase, *int64, error)
	GetVariantCasesCount(locusId int) (*types.VariantCasesCount, error)
	GetVariantCasesFilters() (*types.VariantCasesFilters, error)
	GetVariantExternalFrequencies(locusId int) (*types.VariantExternalFrequencies, error)
	GetGermlineVariantGlobalInternalFrequencies(locusId int) (*types.InternalFrequencies, error)
	GetGermlineVariantInternalFrequenciesSplitBy(locusId int, splitType types.SplitType) (*[]types.InternalFrequenciesSplitBy, error)
}

// GetGermlineVariantHeader handles retrieving a germline variant header by its locus
// @Summary Get a germline VariantHeader
// @Id getGermlineVariantHeader
// @Description Retrieve germline Variant Header data for a given locus
// @Tags variant
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantHeader
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/header [get]
func GetGermlineVariantHeader(repo variantsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantOverview
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/overview [get]
func GetGermlineVariantOverview(repo variantsReader, exomiserRepository exomiserClassificationCountsReader, interpretationRepo germlineInterpretationCountsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {array} types.VariantConsequence
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/consequences [get]
func GetGermlineVariantConsequences(repo variantsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Param			message	body		types.ListBodyWithCriteria	true	"Search Body with criteria"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantInterpretedCasesSearchResponse
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/cases/interpreted [post]
func GetGermlineVariantInterpretedCases(repo variantsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Param			message	body		types.ListBodyWithCriteria	true	"Search Body with criteria"
// @Accept json
// @Produce json
// @Success 200 {object} types.VariantUninterpretedCasesSearchResponse
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/cases/uninterpreted [post]
func GetGermlineVariantUninterpretedCases(repo variantsReader) gin.HandlerFunc {
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

// GetGermlineVariantCasesCount handles retrieving cases count for a given locus id
// @Summary Get germline cases count for a given locus
// @Id getGermlineVariantCasesCount
// @Description Retrieve cases count for a given locus id
// @Tags variant
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantCasesCount
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/cases/count [get]
func GetGermlineVariantCasesCount(repo variantsReader) gin.HandlerFunc {
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
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Param tenant path string true "Tenant code"
// @Router /{tenant}/variants/germline/cases/filters [get]
func GetGermlineVariantCasesFilters(repo variantsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Param panel_type path string true "Gene panel type" Enums(omim, hpo, orphanet)
// @Param filter query string false "Condition filter"
// @Produce json
// @Success 200 {object} types.GenePanelConditions
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/conditions/{panel_type} [get]
func GetGermlineVariantConditions(repo genePanelConditionsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.ClinvarVariantConditions
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/conditions/clinvar [get]
func GetGermlineVariantConditionsClinvar(repo clinvarConditionsReader) gin.HandlerFunc {
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

		if len(clinvarConditions) == 0 {
			c.JSON(http.StatusOK, types.ClinvarVariantConditions{
				Conditions: []types.ClinvarRCV{},
			})
			return
		}

		returnPayload := types.ClinvarVariantConditions{
			ClinvarId:  clinvarConditions[0].ClinvarId,
			Conditions: clinvarConditions,
		}

		c.JSON(http.StatusOK, returnPayload)
	}
}

// GetGermlineVariantExternalFrequenciesHandler handles retrieving external frequencies for a given locus id
// @Summary Get external frequencies
// @Id getGermlineVariantExternalFrequencies
// @Description Retrieve external frequencies for a given locus id
// @Tags variant
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantExternalFrequencies
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/external_frequencies [get]
func GetGermlineVariantExternalFrequenciesHandler(repo variantsReader) gin.HandlerFunc {
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
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Param split query string true "split type" Enums(project, primary_condition, analysis)
// @Produce json
// @Success 200 {object} types.VariantInternalFrequencies
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/internal_frequencies [get]
func GetGermlineVariantInternalFrequenciesHandler(repo variantsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		var variantInternalFrequencies *types.VariantInternalFrequencies
		var splitRows *[]types.InternalFrequenciesSplitBy

		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}

		split := c.Request.URL.Query().Get("split")

		if !slices.Contains(types.SplitTypes, split) {
			HandleValidationError(c, fmt.Errorf("incorrect split"))
			return
		}
		splitRows, err = repo.GetGermlineVariantInternalFrequenciesSplitBy(locusID, split)
		if err != nil {
			HandleError(c, err)
			return
		}

		variantInternalFrequencies = &types.VariantInternalFrequencies{
			SplitRows: *splitRows,
		}

		c.JSON(http.StatusOK, variantInternalFrequencies)
	}
}

// GetGermlineVariantGlobalInternalFrequenciesHandler handles retrieving global internal frequencies for a given locus id
// @Summary Get global internal frequencies
// @Id getGermlineVariantGlobalInternalFrequencies
// @Description Retrieve global internal frequencies for a given locus id
// @Tags variant
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.InternalFrequencies
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /{tenant}/variants/germline/{locus_id}/internal_frequencies/global [get]
func GetGermlineVariantGlobalInternalFrequenciesHandler(repo variantsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		var globalFrequencies *types.InternalFrequencies

		locusID, err := strconv.Atoi(c.Param("locus_id"))
		if err != nil {
			HandleNotFoundError(c, "locus_id")
			return
		}

		globalFrequencies, err = repo.GetGermlineVariantGlobalInternalFrequencies(locusID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if globalFrequencies == nil {
			HandleNotFoundError(c, "variant")
			return
		}

		c.JSON(http.StatusOK, globalFrequencies)
	}
}
