package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// membershipReader returns a caller's tenant memberships. GetMeHandler needs only this
// slice of the auth repository.
type membershipReader interface {
	GetMemberships(ctx context.Context, userID string) ([]types.TenantMembership, error)
}

// GetMeHandler
// @Summary Get the caller's effective authorization
// @Id getMe
// @Description Returns the authenticated caller's tenant memberships, each with the
// @Description tenant-scoped actions they hold and the org-scoped actions mapped to the
// @Description orgs where they apply.
// @Tags auth
// @Security bearerauth
// @Produce json
// @Success 200 {array} types.TenantMembership
// @Failure 401 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /auth/me [get]
func GetMeHandler(repo membershipReader, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			return
		}
		memberships, err := repo.GetMemberships(c.Request.Context(), *userID)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, memberships)
	}
}
