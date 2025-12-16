package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// SearchDocumentsHandler handles search of documents
// @Summary Search documents
// @Id searchDocuments
// @Description Search documents
// @Tags documents
// @Security bearerauth
// @Param			message	body		types.ListBodyWithCriteria	true	"List Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.DocumentsSearchResponse
// @Failure 400 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /documents/search [post]
func SearchDocumentsHandler(repo repository.DocumentsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
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
		query, err := types.NewListQueryFromCriteria(types.DocumentsQueryConfig, body.AdditionalFields, body.SearchCriteria, p, body.Sort)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		documents, count, err := repo.SearchDocuments(query)
		if err != nil {
			HandleError(c, err)
			return
		}

		searchResponse := types.DocumentsSearchResponse{List: *documents, Count: *count}
		c.JSON(http.StatusOK, searchResponse)
	}
}

// DocumentsAutocompleteHandler handles retrieving ids by autocomplete
// @Summary Get types.AutocompleteResult list of matching prefix
// @Id autocompleteDocuments
// @Description Retrieve types.AutocompleteResult list of ids matching prefix
// @Tags documents
// @Security bearerauth
// @Param prefix query string true "Prefix"
// @Param limit query string false "Limit"
// @Produce json
// @Success 200 {array} types.AutocompleteResult
// @Failure 500 {object} types.ApiError
// @Router /documents/autocomplete [get]
func DocumentsAutocompleteHandler(repo repository.DocumentsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		prefix := c.Query("prefix")
		limit, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			limit = 25
		}
		ids, err := repo.SearchById(prefix, limit)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, ids)
	}
}

// DocumentsFiltersHandler handles retrieving documents filters
// @Summary Get types.DocumentFilters documents filters
// @Id documentsFilters
// @Description Retrieve types.DocumentFilters documents filters
// @Tags documents
// @Security bearerauth
// @Param			message	body		types.FiltersBodyWithCriteria	true	"Filters Body"
// @Accept json
// @Produce json
// @Success 200 {object} types.DocumentFilters
// @Failure 500 {object} types.ApiError
// @Router /documents/filters [post]
func DocumentsFiltersHandler(repo repository.DocumentsDAO) gin.HandlerFunc {
	return func(c *gin.Context) {
		var (
			body types.FiltersBodyWithCriteria
		)

		// Bind JSON to the struct
		if err := c.ShouldBindJSON(&body); err != nil {
			// Return a 400 Bad Request if validation fails
			HandleValidationError(c, err)
			return
		}
		query, err := types.NewAggregationQueryFromCriteria(body.SearchCriteria, types.DocumentFields)
		if err != nil {
			HandleValidationError(c, err)
			return
		}
		filters, err := repo.GetDocumentsFilters(query, true)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, filters)
	}
}

// GetDocumentsDownloadUrlHandler handles generating a pre-signed S3 download URL for a document
// @Summary Get pre-signed S3 download URL for a document
// @Id getDocumentDownloadUrl
// @Description Generate a pre-signed S3 download URL for a document
// @Tags documents
// @Security bearerauth
// @Param document_id path string true "Document ID"
// @Produce json
// @Success 200 {object} utils.PreSignedURL
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Router /documents/{document_id}/download_url [get]
func GetDocumentsDownloadUrlHandler(repo repository.DocumentsDAO, presigner utils.PreSigner) gin.HandlerFunc {
	if presigner == nil {
		presigner = utils.NewS3PreSigner()
	}

	return func(c *gin.Context) {
		documentId, err := strconv.Atoi(c.Param("document_id"))
		if err != nil {
			HandleNotFoundError(c, "document_id")
			return
		}

		document, err := repo.GetById(documentId)
		if err != nil {
			HandleError(c, err)
			return
		}
		if document == nil {
			HandleNotFoundError(c, "document_id")
			return
		}

		preSignedUrl, err := presigner.GeneratePreSignedURL(document.Url)
		if err != nil {
			HandleError(c, err)
			return
		}

		c.JSON(http.StatusOK, preSignedUrl)
	}
}
