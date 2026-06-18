package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type genesReader interface {
	GetGeneAutoComplete(ctx context.Context, prefix string, limit int) (*[]types.AutoCompleteGene, error)
	SearchGenes(ctx context.Context, inputs []string) (*[]types.GeneResult, error)
}

// GetGeneAutoCompleteHandler handles retrieving genes by autocomplete
// @Summary Get types.AutoCompleteGene list of matching input string with highlighted
// @Id geneAutoComplete
// @Description Retrieve types.AutoCompleteGene list of genes matching input string with highlighted
// @Tags genes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutoCompleteGene
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/genes/autocomplete [get]
func GetGeneAutoCompleteHandler(repo genesReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		genes, err := repo.GetGeneAutoComplete(c.Request.Context(), prefix, limit)
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
// @Param tenant path string true "Tenant code"
// @Param			message	body		types.GeneSearchBody	true	"Search Body"
// @Accept json
// @Produce json
// @Success 200 {array} types.GeneResult
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/genes/search [post]
func SearchGenesHandler(repo genesReader) gin.HandlerFunc {
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
		genes, err := repo.SearchGenes(c.Request.Context(), body.Inputs)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, genes)
	}
}
