package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type rolesReader interface {
	ListTenantRoles(ctx context.Context, tenantCode string) ([]types.RoleResult, error)
}

// ListRolesHandler
// @Summary List the tenant's roles
// @Id listRoles
// @Description Returns every role defined in the tenant in the path — the seeded ones and the
// @Description tenant's own custom ones — each with the actions it grants and the number of users
// @Description holding it. Requires the `can_manage_role` or the `can_manage_user` action: the
// @Description catalog is both the roles section's own list and the role picker the add and edit
// @Description user screens are built from. `is_default` marks a seeded
// @Description role, which is locked and can be neither edited nor deleted. `scope` is derived
// @Description from the actions: `tenant` when they are all tenant-scoped, `org` when they are all
// @Description org-scoped, `mixed` when both — it is what decides whether granting the role needs
// @Description organizations. The list is small and bounded, so it is returned unpaged.
// @Tags roles
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {array} types.RoleResult
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/roles [get]
func ListRolesHandler(repo rolesReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		roles, err := repo.ListTenantRoles(c.Request.Context(), *tenant)
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, roles)
	}
}
