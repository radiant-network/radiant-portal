package server

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type assignmentCandidatesReader interface {
	EligibleAssignees(ctx context.Context, tenantCode, orgCode string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error)
}

type caseLabReader interface {
	OrgsForCase(ctx context.Context, tenantCode string, caseID int) ([]string, error)
}

// ListCaseAssignmentCandidatesHandler serves the assignee picker
// @Summary List the users who may be assigned a case
// @Id listCaseAssignmentCandidates
// @Description Retrieve the users eligible to be assigned the case: those holding the
// @Description permission to interpret variants at the case's diagnosis lab. Requires
// @Description permission to edit the case, since the picker is only of use to a caller who
// @Description can then act on the assignment.
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
func ListCaseAssignmentCandidatesHandler(repo assignmentCandidatesReader, labs caseLabReader) gin.HandlerFunc {
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

		candidates, err := repo.EligibleAssignees(c.Request.Context(), *tenant, labsForCase[0], *query)
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
