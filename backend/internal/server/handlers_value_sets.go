package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type valueSetReader interface {
	ListValueSet(ctx context.Context, valueSetType string) ([]types.ValueSetItem, error)
}

// ListValueSetHandler
// @Summary List a value set
// @Id listValueSet
// @Description Returns the (code, label) options of an instance-wide value set — e.g.
// @Description `organization_category`. Not tenant-scoped; any authenticated user may read it.
// @Tags value_sets
// @Security bearerauth
// @Param type path string true "Value set type (a value-set table name, e.g. organization_category)"
// @Produce json
// @Success 200 {array} types.ValueSetItem
// @Failure 401 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /value_sets/{type} [get]
func ListValueSetHandler(repo valueSetReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		items, err := repo.ListValueSet(c.Request.Context(), c.Param("type"))
		if err != nil {
			if errors.Is(err, types.ErrUnknownValueSet) {
				HandleNotFoundError(c, "value set")
				return
			}
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, items)
	}
}
