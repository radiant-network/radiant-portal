package server

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/cnvprofile"
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

type geneTrackReader interface {
	GetGeneTrack(ctx context.Context, chromosome string, start int, end int) ([]types.GeneTrackGene, error)
	GetGeneTrackBySymbol(ctx context.Context, symbol string) ([]types.GeneTrackGene, error)
}

// GetGeneTrackHandler handles listing the genes of a region, or finding one by its symbol
// @Summary List the genes of a region
// @Id geneTrack
// @Description List the genes of every biotype overlapping a region of at most 20 Mb, or the one with a symbol, each
// @Description with the exons of its transcript with the most exons. A symbol takes precedence over a region.
// @Tags genes
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param symbol query string false "Gene symbol, ignoring case"
// @Param chromosome query string false "Chromosome, without chr prefix; required without symbol"
// @Param start query int false "Region start; required without symbol"
// @Param end query int false "Region end; required without symbol"
// @Produce json
// @Success 200 {array} types.GeneTrackGene
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/genes/track [get]
func GetGeneTrackHandler(repo geneTrackReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		if symbol := c.Query("symbol"); symbol != "" {
			genes, err := repo.GetGeneTrackBySymbol(c.Request.Context(), symbol)
			if err != nil {
				HandleError(c, err)
				return
			}
			c.JSON(http.StatusOK, genes)
			return
		}
		chromosome, start, end, err := parseRegionQuery(c, types.GeneTrackMaxSpan)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		genes, err := repo.GetGeneTrack(c.Request.Context(), chromosome, start, end)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, genes)
	}
}

// parseRegionQuery reads the chromosome, start and end query parameters of a region of at most
// maxSpan bases.
func parseRegionQuery(c *gin.Context, maxSpan int) (string, int, int, error) {
	chromosome := c.Query("chromosome")
	if chromosome == "" {
		return "", 0, 0, errors.New("chromosome is required")
	}
	if !cnvprofile.IsChromosome(chromosome) {
		return "", 0, 0, fmt.Errorf("chromosome must be one of 1-22, X or Y, got %q", chromosome)
	}
	start, err := strconv.Atoi(c.Query("start"))
	if err != nil {
		return "", 0, 0, fmt.Errorf("invalid start: %w", err)
	}
	end, err := strconv.Atoi(c.Query("end"))
	if err != nil {
		return "", 0, 0, fmt.Errorf("invalid end: %w", err)
	}
	if start < 0 || end < start || end-start > maxSpan {
		return "", 0, 0, fmt.Errorf("region must satisfy 0 <= start <= end and span at most %d bases", maxSpan)
	}
	return chromosome, start, end, nil
}
