package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
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
