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
// @Description action. Returns an empty 201.
// @Description
// @Description `code` is immutable after creation, must match `[a-z][a-z0-9_]*` (max 50) and be
// @Description unique per tenant; `name_en` is required and each name stays unique per tenant too
// @Description (409). `name_fr`/`description_fr` fall back to their English counterparts.
// @Description `actions` must list at least one, and every one must exist and be grantable — a
// @Description reserved action such as `can_manage_user` yields 422. `scope` is derived from the
// @Description actions; a created role is never `is_default`.
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

		var conflict *types.RoleConflictError
		switch err := repo.CreateRole(c.Request.Context(), *tenant, req); {
		case err == nil:
			c.Status(http.StatusCreated)
		case errors.As(err, &conflict):
			HandleFieldConflictError(c, conflict.Error(), conflict.Field)
		case errors.Is(err, types.ErrRoleActionsNotGrantable):
			HandleUnprocessableEntityError(c, err.Error())
		default:
			HandleError(c, err)
		}
	}
}

type roleUpdater interface {
	UpdateRole(ctx context.Context, tenantCode, roleCode string, req types.UpdateRoleRequest) error
}

// PutRoleHandler
// @Summary Edit a custom role
// @Id updateRole
// @Description Replaces the labels and actions of the custom role with the code in the path.
// @Description Requires the `can_manage_role` action. Returns an empty 200.
// @Description
// @Description Full replacement, not a patch: an omitted optional field is cleared, and the
// @Description `actions` listed become the role's whole set, so one left out is revoked from every
// @Description holder. `name_fr`/`description_fr` fall back to their English counterparts; each name
// @Description stays unique per tenant (409). `code` is immutable; `scope` is re-derived from the
// @Description actions. Every action must be grantable (422); a seeded role is locked (403).
// @Tags roles
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param code path string true "Role code"
// @Param message body types.UpdateRoleRequest true "Desired state of the role"
// @Accept json
// @Produce json
// @Success 200
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 409 {object} types.ApiError
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/roles/{code} [put]
func PutRoleHandler(repo roleUpdater) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req types.UpdateRoleRequest
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

		var conflict *types.RoleConflictError
		switch err := repo.UpdateRole(c.Request.Context(), *tenant, c.Param("code"), req); {
		case err == nil:
			c.Status(http.StatusOK)
		case errors.Is(err, types.ErrRoleNotFound):
			HandleNotFoundError(c, "role")
		case errors.Is(err, types.ErrRoleIsDefault):
			HandleForbiddenError(c, err.Error())
		case errors.As(err, &conflict):
			HandleFieldConflictError(c, conflict.Error(), conflict.Field)
		case errors.Is(err, types.ErrRoleActionsNotGrantable):
			HandleUnprocessableEntityError(c, err.Error())
		default:
			HandleError(c, err)
		}
	}
}
