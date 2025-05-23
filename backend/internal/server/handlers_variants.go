package server

import (
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/gin-gonic/gin"
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
func GetGermlineVariantHeader(repo repository.StarrocksDAO) gin.HandlerFunc {
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
func GetGermlineVariantOverview(repo repository.StarrocksDAO) gin.HandlerFunc {
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
func GetGermlineVariantConsequences(repo repository.StarrocksDAO) gin.HandlerFunc {
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
