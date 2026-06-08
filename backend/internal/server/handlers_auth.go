package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/utils"
)

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
// @Router /auth/me [get]
func GetMeHandler(repo repository.AuthRepositoryDAO, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			return
		}
		memberships, err := repo.GetMemberships(*userID)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, memberships)
	}
}
