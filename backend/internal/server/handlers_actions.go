package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type actionsReader interface {
	ListActions(ctx context.Context) ([]types.ActionResponse, error)
}

// ListActionsHandler
// @Summary List the authorization action catalog
// @Id listActions
// @Description Returns the global action catalog with localized labels, used to build the
// @Description role-editing action picker. Requires the `can_manage_role` action.
// @Tags actions
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {array} types.ActionResponse
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/actions [get]
func ListActionsHandler(repo actionsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		actions, err := repo.ListActions(c.Request.Context())
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, actions)
	}
}
