package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type usersReader interface {
	ListTenantUsers(ctx context.Context, tenantCode string, query types.ListUsersQuery) ([]types.UserResult, int64, error)
}

// userCreator adds a user to the tenant across every store. Implemented by service.UserAdmin.
type userCreator interface {
	CreateTenantUser(ctx context.Context, tenantCode string, req types.CreateUserRequest, actor string) error
}

// userUpdater applies an edited user within the tenant. Implemented by service.UserAdmin.
type userUpdater interface {
	UpdateTenantUser(ctx context.Context, tenantCode, userID string, req types.UpdateUserRequest, actor string) error
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
// @Param search query string false "Case-insensitive prefix of the user's first name, last name or email"
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

// PostUserHandler
// @Summary Add a user to the tenant
// @Id createUser
// @Description Provisions the user across the identity provider and the data stores, then grants
// @Description them the requested roles in the tenant in the path. Requires the `can_manage_user`
// @Description action. The `member` role is granted tenant-wide automatically and must not be
// @Description listed. Whether a role needs organizations is derived from its actions: a role
// @Description holding only tenant-scoped actions must come with no `org_codes`, one holding any
// @Description org-scoped action needs at least one (`*` meaning every organization). No password
// @Description is ever set — the identity provider links the account by email at first sign-in.
// @Tags users
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param message body types.CreateUserRequest true "User to add"
// @Accept json
// @Produce json
// @Success 201
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 409 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/users [post]
func PostUserHandler(svc userCreator, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req types.CreateUserRequest
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
		actor, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		switch err := svc.CreateTenantUser(c.Request.Context(), *tenant, req, *actor); {
		case err == nil:
			c.Status(http.StatusCreated)
		case errors.Is(err, types.ErrUserAlreadyInTenant):
			HandleConflictError(c, err.Error())
		case errors.Is(err, types.ErrUnknownRole), errors.Is(err, types.ErrUnknownOrganizations),
			errors.Is(err, types.ErrRoleRequiresOrg), errors.Is(err, types.ErrRoleNotOrgScoped):
			HandleValidationError(c, err)
		default:
			HandleError(c, err)
		}
	}
}

// PutUserHandler
// @Summary Update a user of the tenant
// @Id updateUser
// @Description Updates the user's name and replaces the roles granted to them in the tenant in the
// @Description path with the ones in the payload — a role left out is revoked. Requires the
// @Description `can_manage_user` action. The email is the identity the account signs in with and
// @Description cannot be changed here. The `member` role is kept tenant-wide whether or not it is
// @Description listed, and the last user able to manage users cannot lose that ability (409).
// @Description Whether a role needs organizations is derived from its actions: a role holding only
// @Description tenant-scoped actions must come with no `org_codes`, one holding any org-scoped
// @Description action needs at least one (`*` meaning every organization).
// @Tags users
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param user_id path string true "User id (the identity provider's subject id)"
// @Param message body types.UpdateUserRequest true "Desired state of the user"
// @Accept json
// @Produce json
// @Success 200
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 409 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/users/{user_id} [put]
func PutUserHandler(svc userUpdater, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req types.UpdateUserRequest
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
		actor, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		switch err := svc.UpdateTenantUser(c.Request.Context(), *tenant, c.Param("user_id"), req, *actor); {
		case err == nil:
			c.Status(http.StatusOK)
		case errors.Is(err, types.ErrUserNotInTenant):
			HandleNotFoundError(c, "user")
		case errors.Is(err, types.ErrLastTenantAdmin):
			HandleConflictError(c, err.Error())
		case errors.Is(err, types.ErrUnknownRole), errors.Is(err, types.ErrUnknownOrganizations),
			errors.Is(err, types.ErrRoleRequiresOrg), errors.Is(err, types.ErrRoleNotOrgScoped):
			HandleValidationError(c, err)
		default:
			HandleError(c, err)
		}
	}
}
