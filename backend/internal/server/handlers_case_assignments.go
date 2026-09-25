package server

import (
	"context"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type assignmentCandidatesReader interface {
	EligibleAssignees(ctx context.Context, tenantCode, orgCode, callerID string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error)
}

type caseLabReader interface {
	OrgsForCase(ctx context.Context, tenantCode string, caseID int) ([]string, error)
}

type caseAssignmentsStore interface {
	ReplaceAssignees(ctx context.Context, tenantCode string, caseID int, userIDs []string) error
}

// ListCaseAssignmentCandidatesHandler serves the assignee picker
// @Summary List the users who may be assigned a case
// @Id listCaseAssignmentCandidates
// @Description Retrieve the users eligible to be assigned the case: those holding the
// @Description permission to interpret variants at the case's diagnosis lab. Requires
// @Description permission to edit the case, since the picker is only of use to a caller who
// @Description can then act on the assignment. The caller comes first in the list when they are
// @Description themselves eligible, so assigning a case to oneself is the top row.
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param search query string false "Filter on first name, last name or email"
// @Param limit query int false "Page size"
// @Param offset query int false "Page offset"
// @Param page_index query int false "Page index, an alternative to offset"
// @Produce json
// @Success 200 {array} types.CaseAssignee
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/{case_id}/assignment_candidates [get]
func ListCaseAssignmentCandidatesHandler(repo assignmentCandidatesReader, labs caseLabReader, auth utils.Auth) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		callerID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleNotFoundError(c, "user id")
			return
		}

		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}

		var params types.ListAssignmentCandidatesParams
		if err := c.ShouldBindQuery(&params); err != nil {
			HandleValidationError(c, err)
			return
		}
		query, err := params.Resolve()
		if err != nil {
			HandleValidationError(c, err)
			return
		}

		labsForCase, err := labs.OrgsForCase(c.Request.Context(), *tenant, caseID)
		if err != nil {
			HandleError(c, err)
			return
		}
		if len(labsForCase) == 0 {
			HandleNotFoundError(c, "case")
			return
		}

		candidates, err := repo.EligibleAssignees(c.Request.Context(), *tenant, labsForCase[0], *callerID, *query)
		if err != nil {
			HandleError(c, err)
			return
		}
		if candidates == nil {
			candidates = []types.CaseAssignee{}
		}
		c.JSON(http.StatusOK, candidates)
	}
}

// PutCaseAssignmentsHandler replaces who a case is assigned to
// @Summary Set the users a case is assigned to
// @Id putCaseAssignments
// @Description Replace the case's assignees with the given set. An empty list unassigns the
// @Description case, which is a valid state. An assignee who has since lost the permission to
// @Description interpret at the case's lab is dropped by this call — losing it does not
// @Description unassign anyone on its own, but the next update prunes them. Naming a user who
// @Description is not assigned and not eligible is refused. Because of that pruning the stored
// @Description set is not always the one submitted; read the case back to display it.
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param case_id path int true "Case ID"
// @Param message body types.UpdateCaseAssignmentsRequest true "Assignees to set"
// @Accept json
// @Success 200
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 404 {object} types.ApiError
// @Failure 422 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/{case_id}/assignments [put]
func PutCaseAssignmentsHandler(repo caseAssignmentsStore) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		caseID, err := strconv.Atoi(c.Param("case_id"))
		if err != nil {
			HandleNotFoundError(c, "case_id")
			return
		}

		var request types.UpdateCaseAssignmentsRequest
		if err := c.ShouldBindJSON(&request); err != nil {
			HandleValidationError(c, err)
			return
		}
		userIDs, err := request.Resolve()
		if err != nil {
			HandleValidationError(c, err)
			return
		}

		err = repo.ReplaceAssignees(c.Request.Context(), *tenant, caseID, userIDs)
		var ineligible *types.IneligibleAssigneesError
		switch {
		case errors.Is(err, types.ErrCaseNotFound):
			HandleNotFoundError(c, "case")
		case errors.As(err, &ineligible):
			HandleUnprocessableEntityError(c, ineligible.Error())
		case err != nil:
			HandleError(c, err)
		default:
			c.Status(http.StatusOK)
		}
	}
}
