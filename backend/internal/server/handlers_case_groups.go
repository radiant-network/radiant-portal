package server

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type caseGroupStore interface {
	UpsertCaseGroup(ctx context.Context, tenantCode, name string, caseIDs []int, createdBy string) (*types.CaseGroup, error)
	GetCaseGroupByName(ctx context.Context, tenantCode, name string) (*types.CaseGroup, error)
}

// PostCaseGroupHandler
// @Summary Create or overwrite a case group
// @Id createCaseGroup
// @Description Creates a named set of cases in the tenant in the path. The name is the key:
// @Description posting an existing name overwrites its case list, so a pipeline retry is idempotent.
// @Description Every case id must exist in the tenant. Requires the `can_ingest_data` action.
// @Tags case_groups
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param message body types.CaseGroupRequest true "Case group to create or overwrite"
// @Accept json
// @Produce json
// @Success 200 {object} types.CaseGroupResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/case_groups [post]
func PostCaseGroupHandler(store caseGroupStore, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req types.CaseGroupRequest
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
		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			return
		}

		group, err := store.UpsertCaseGroup(c.Request.Context(), *tenant, req.Name, req.CaseIDs, *userID)
		var unknown *types.UnknownCaseIDsError
		switch {
		case errors.As(err, &unknown):
			HandleValidationError(c, err)
			return
		case err != nil:
			HandleError(c, err)
			return
		}
		respondCaseGroup(c, group)
	}
}

// GetCaseGroupHandler
// @Summary Get a case group
// @Id getCaseGroup
// @Description Returns the case group with this name in the tenant in the path, with its case ids.
// @Description Requires the `can_search_case` action, so the portal can turn a group into a case filter.
// @Tags case_groups
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param name path string true "Case group name"
// @Produce json
// @Success 200 {object} types.CaseGroupResponse
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/case_groups/{name} [get]
func GetCaseGroupHandler(store caseGroupStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		name := c.Param("name")
		if err := types.ValidateCaseGroupName(name); err != nil {
			HandleValidationError(c, err)
			return
		}
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		group, err := store.GetCaseGroupByName(c.Request.Context(), *tenant, name)
		if err != nil {
			HandleError(c, err)
			return
		}
		if group == nil {
			HandleNotFoundError(c, "case group")
			return
		}
		respondCaseGroup(c, group)
	}
}

func respondCaseGroup(c *gin.Context, group *types.CaseGroup) {
	resp, err := group.ToResponse()
	if err != nil {
		HandleError(c, err)
		return
	}
	c.JSON(http.StatusOK, resp)
}
