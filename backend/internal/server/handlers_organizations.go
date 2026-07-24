package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type organizationsReader interface {
	ListOrganizations(ctx context.Context) ([]types.OrganizationResponse, error)
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
