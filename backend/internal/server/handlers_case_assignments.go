package server

import (
	"context"
	"fmt"
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
)

type assignmentCandidatesReader interface {
	EligibleAssignees(ctx context.Context, tenantCode, orgCode string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error)
}

type caseLabsReader interface {
	OrgsForCases(ctx context.Context, tenantCode string, caseIDs []int) (map[int]string, error)
}

// ListCaseAssignmentCandidatesHandler serves the assignee picker
// @Summary List the users who may be assigned the given cases
// @Id listCaseAssignmentCandidates
// @Description Retrieve the users eligible to be assigned the cases named by case_ids: those
// @Description holding at least one organization-scoped permission at the cases' diagnosis lab.
// @Description Every case named must belong to the same diagnosis lab, since eligibility is
// @Description decided there; a selection spanning several is rejected rather than merged.
// @Description Requires permission to edit every case named: the picker is only of use to a
// @Description caller who can then act on the assignment.
// @Tags cases
// @Security bearerauth
// @Param tenant path string true "Tenant code"
// @Param message body types.ListAssignmentCandidatesBody true "Candidates request"
// @Accept json
// @Produce json
// @Success 200 {array} types.CaseAssignee
// @Failure 400 {object} types.ApiError
// @Failure 401 {object} types.ApiError
// @Failure 403 {object} types.ApiError
// @Failure 500 {object} types.ApiError
// @Header 500 {string} X-Correlation-ID "Unique id correlating this error with the server-side log entry"
// @Router /{tenant}/cases/assignment_candidates [post]
func ListCaseAssignmentCandidatesHandler(repo assignmentCandidatesReader, labs caseLabsReader) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			return
		}

		// ShouldBindBodyWithJSON, not ShouldBindJSON: the org gate in front of this handler has
		// already read the body, and only the cached variant can bind it a second time.
		var body types.ListAssignmentCandidatesBody
		if err := c.ShouldBindBodyWithJSON(&body); err != nil {
			HandleValidationError(c, err)
			return
		}
		query, err := body.Resolve()
		if err != nil {
			HandleValidationError(c, err)
			return
		}

		labByCase, err := labs.OrgsForCases(c.Request.Context(), *tenant, query.CaseIDs)
		if err != nil {
			HandleError(c, err)
			return
		}
		lab, err := singleDiagnosisLab(labByCase, query.CaseIDs)
		if err != nil {
			HandleValidationError(c, err)
			return
		}

		candidates, err := repo.EligibleAssignees(c.Request.Context(), *tenant, lab, *query)
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

// singleDiagnosisLab resolves the one diagnosis lab the cases share. A case the tenant does not
// hold is a bad request rather than a silent omission: the caller named it, and answering for
// the rest would quietly widen the candidate list to a lab they did not ask about.
func singleDiagnosisLab(labByCase map[int]string, caseIDs []int) (string, error) {
	found := []string{}
	for _, caseID := range caseIDs {
		lab, exists := labByCase[caseID]
		if !exists {
			return "", fmt.Errorf("case %d not found", caseID)
		}
		if !slices.Contains(found, lab) {
			found = append(found, lab)
		}
	}
	if len(found) > 1 {
		slices.Sort(found)
		return "", fmt.Errorf("the selected cases belong to several organizations (%v); assignees can only be listed for one at a time", found)
	}
	return found[0], nil
}
