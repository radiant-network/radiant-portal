package server

import (
	"github.com/Ferlab-Ste-Justine/radiant-api/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// GetVariantHeader handles retrieving a variant header by its locus
// @Summary Get a VariantHeader
// @Id getVariantHeader
// @Description Retrieve Variant Header data for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantHeader
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/{locus_id}/header [get]
func GetVariantHeader(repo repository.StarrocksDAO) gin.HandlerFunc {
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

// GetVariantOverview handles retrieving a variant overview by its locus
// @Summary Get a VariantOverview
// @Id getVariantOverview
// @Description Retrieve Variant Overview data for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {object} types.VariantOverview
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/{locus_id}/overview [get]
func GetVariantOverview(repo repository.StarrocksDAO) gin.HandlerFunc {
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

// GetVariantConsequences handles retrieving a variant consequences by its locus
// @Summary Get list of VariantConsequences
// @Id getVariantConsequences
// @Description Retrieve Variant Consequences for a given locus
// @Tags variant
// @Security bearerauth
// @Param locus_id path string true "Locus ID"
// @Produce json
// @Success 200 {array} types.VariantConsequence
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /variants/{locus_id}/consequences [get]
func GetVariantConsequences(repo repository.StarrocksDAO) gin.HandlerFunc {
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
