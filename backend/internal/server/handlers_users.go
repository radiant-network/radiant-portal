package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type usersReader interface {
	ListTenantUsers(ctx context.Context, tenantCode string, query types.ListUsersQuery) ([]types.UserResult, int64, error)
}

// ListUsersHandler
// @Summary List the tenant's users
// @Id listUsers
// @Description Returns the users holding at least one role in the tenant in the path, each with the
// @Description roles granted to them there and the organizations those roles apply at. Requires the
// @Description `can_manage_user` action. `count` is the total matching `search`, before pagination.
// @Tags users
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param search query string false "Case-insensitive substring of the user's name or email"
// @Param roles query string false "Comma-separated role codes; keeps users holding any of them"
// @Param limit query int false "Page size (default 25, capped at 200)"
// @Param offset query int false "Number of users to skip"
// @Param page_index query int false "Page to return, as an alternative to offset"
// @Produce json
// @Success 200 {object} types.UsersSearchResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/users [get]
func ListUsersHandler(repo usersReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		var params types.ListUsersParams
		if err := c.ShouldBindQuery(&params); err != nil {
			HandleValidationError(c, err)
			return
		}
		if err := params.Validate(); err != nil {
			HandleValidationError(c, err)
			return
		}
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		users, count, err := repo.ListTenantUsers(c.Request.Context(), *tenant, params.ToQuery())
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, types.UsersSearchResponse{List: users, Count: count})
	}
}
