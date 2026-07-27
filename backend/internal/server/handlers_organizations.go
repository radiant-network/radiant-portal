package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type organizationsReader interface {
	ListOrganizations(ctx context.Context) ([]types.OrganizationResponse, error)
}

type organizationCreator interface {
	CreateOrganization(ctx context.Context, org types.Organization) error
}

// ListOrganizationsHandler
// @Summary List the tenant's organizations
// @Id listOrganizations
// @Description Returns the organizations of the tenant in the path, each with its category label.
// @Description Readable by any member of the tenant; it also feeds the organization picker when
// @Description assigning org-scoped roles to a user.
// @Tags organizations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Produce json
// @Success 200 {array} types.OrganizationResponse
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/organizations [get]
func ListOrganizationsHandler(repo organizationsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		organizations, err := repo.ListOrganizations(c.Request.Context())
		if err != nil {
			HandleError(c, err)
			return
		}
		c.JSON(http.StatusOK, organizations)
	}
}

// PostOrganizationHandler
// @Summary Create an organization
// @Id createOrganization
// @Description Creates an organization in the tenant in the path. Requires the `can_manage_org`
// @Description action. The code must be unique within the tenant and is immutable after creation.
// @Tags organizations
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param message body types.CreateOrganizationRequest true "Organization to create"
// @Accept json
// @Produce json
// @Success 201
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 409 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/organizations [post]
func PostOrganizationHandler(repo organizationCreator) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req types.CreateOrganizationRequest
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

		org := types.Organization{
			Code:         req.Code,
			Name:         req.Name,
			CategoryCode: req.CategoryCode,
			TenantCode:   *tenant,
		}
		switch err := repo.CreateOrganization(c.Request.Context(), org); {
		case err == nil:
			c.Status(http.StatusCreated)
		case errors.Is(err, types.ErrOrganizationCodeExists):
			HandleConflictError(c, err.Error())
		case errors.Is(err, types.ErrOrganizationUnknownCategory):
			HandleValidationError(c, err)
		default:
			HandleError(c, err)
		}
	}
}
