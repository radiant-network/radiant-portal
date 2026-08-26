package server

import (
	"context"
	"errors"
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

type roleCreator interface {
	CreateRole(ctx context.Context, tenantCode string, req types.CreateRoleRequest) error
}

// PostRoleHandler
// @Summary Create a custom role
// @Id createRole
// @Description Creates a custom role in the tenant in the path. Requires the `can_manage_role`
// @Description action — unlike reading the catalog, `can_manage_user` does not open this.
// @Description Returns an empty 201.
// @Description
// @Description `code` is immutable after creation, must match `[a-z][a-z0-9_]*` (max 50) and be
// @Description unique within the tenant. `name_en` is required; `name_fr` is optional and falls
// @Description back to `name_en` when omitted, so the role never renders blank to a French reader.
// @Description Each name must be unique within the tenant in its own language.
// @Description `description_en` / `description_fr` are optional and follow the same fallback.
// @Description `actions` must list at least one action, and every one of them must exist and be grantable
// @Description a reserved action (such as `can_manage_user`) yields 422, which is what keeps it out of every custom role and
// @Description makes `tenant_admin` un-duplicable.
// @Description
// @Description The role's `scope` is not supplied: it is derived from the actions and decides
// @Description whether granting the role needs organizations. A created role is never
// @Description `is_default`, so it stays editable and deletable.
// @Tags roles
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param message body types.CreateRoleRequest true "Role to create"
// @Accept json
// @Produce json
// @Success 201
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 409 {object} types.ApiError
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/roles [post]
func PostRoleHandler(repo roleCreator) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req types.CreateRoleRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			HandleValidationError(c, err)
			return
		}
		if err := req.Validate(); err != nil {
			HandleValidationError(c, err)
			return
		}
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		switch err := repo.CreateRole(c.Request.Context(), *tenant, req); {
		case err == nil:
			c.Status(http.StatusCreated)
		case errors.Is(err, types.ErrRoleCodeExists), errors.Is(err, types.ErrRoleNameExists):
			HandleConflictError(c, err.Error())
		case errors.Is(err, types.ErrRoleActionsNotGrantable):
			HandleUnprocessableEntityError(c, err.Error())
		default:
			HandleError(c, err)
		}
	}
}
