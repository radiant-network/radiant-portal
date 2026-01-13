package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
)

// GetGeneAutoCompleteHandler handles retrieving genes by autocomplete
// @Summary Get types.AutoCompleteGene list of matching input string with highlighted
// @Id geneAutoComplete
// @Description Retrieve types.AutoCompleteGene list of genes matching input string with highlighted
// @Tags genes
// @Security bearerauth
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutoCompleteGene
// @Failure 500 {object} types.ApiError
// @Router /genes/autocomplete [get]
func GetGeneAutoCompleteHandler(repo repository.GenesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		genes, err := repo.GetGeneAutoComplete(prefix, limit)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, genes)
	}
}

// SearchGenesHandler handles retrieving genes
// @Summary Post search types.GeneResult list of matching input strings
// @Id geneSearch
// @Description Retrieve types.GeneResult list of genes matching input strings
// @Tags genes
// @Security bearerauth
// @Param			message	body		types.GeneSearchBody	true	"Search Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.GeneResult
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /genes/search [post]
func SearchGenesHandler(repo repository.GenesDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.GeneSearchBody
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		genes, err := repo.SearchGenes(body.Inputs)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, genes)
	}
}
