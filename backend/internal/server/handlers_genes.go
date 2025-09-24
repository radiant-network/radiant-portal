package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
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
