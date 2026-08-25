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

type roleDetailReader interface {
	GetTenantRole(ctx context.Context, tenantCode, roleCode string) (*types.RoleResult, error)
}

// GetRoleHandler
// @Summary Get one of the tenant's roles
// @Id getRole
// @Description Returns the role with the code in the path, in the same shape the list serves it:
// @Description the actions it grants, the `scope` derived from them, and the number of users
// @Description holding it. Requires the `can_manage_role` or the `can_manage_user` action, the same
// @Description gate as the list — it backs the role detail panel, the duplicate flow (read the
// @Description role, then create a new one from its actions), and the "what this grants" preview
// @Description the user screens show at assignment. `is_default` marks a seeded role, which is
// @Description locked and can be neither edited nor deleted. Roles are keyed per tenant, so a role
// @Description of another tenant is reported as not found.
// @Tags roles
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param code path string true "Role code"
// @Produce json
// @Success 200 {object} types.RoleResult
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/roles/{code} [get]
func GetRoleHandler(repo roleDetailReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		role, err := repo.GetTenantRole(c.Request.Context(), *tenant, c.Param("code"))
		if err != nil {
			HandleError(c, err)
			return
		}
		if role == nil {
			HandleNotFoundError(c, "role")
			return
		}
		c.JSON(http.StatusOK, role)
	}
}
