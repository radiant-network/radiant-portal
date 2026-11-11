package types

import (
	"errors"
	"fmt"
	"slices"
	"strings"
)

var CaseAssignmentTable = Table{
	Name:  "case_assignment",
	Alias: "assignment",
}

// CaseAssignment links a case to a user made responsible for reviewing and interpreting it.
type CaseAssignment struct {
	CaseID     int    `gorm:"primaryKey;column:case_id"`
	UserID     string `gorm:"primaryKey;column:user_id"`
	TenantCode string `gorm:"column:tenant_code"`
}

func (CaseAssignment) TableName() string {
	return CaseAssignmentTable.Name
}

// CaseAssignee - User assigned to a case
// @Description User assigned to a case, as shown in the cases list and on the case entity page.
// @Description Name and email are the attributes the identity registry holds for them, and are
// @Description absent for an account that never filled them in.
// @Name CaseAssignee
type CaseAssignee struct {
	UserID    string `json:"user_id" validate:"required"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Email     string `json:"email,omitempty"`
}

// ListAssignmentCandidatesParams is the query string of the assignment candidates list. The
// case itself is named by the route, not here.
type ListAssignmentCandidatesParams struct {
	Search    string `form:"search"`
	Limit     int    `form:"limit"`
	Offset    int    `form:"offset"`
	PageIndex int    `form:"page_index"`
}

// ListAssignmentCandidatesQuery is the resolved candidates request handed to the repository.
type ListAssignmentCandidatesQuery struct {
	Search     string
	Pagination *Pagination
}

func (p ListAssignmentCandidatesParams) Resolve() (*ListAssignmentCandidatesQuery, error) {
	// A negative limit would cancel the LIMIT clause in GORM and return every eligible user.
	if p.Limit < 0 || p.Offset < 0 || p.PageIndex < 0 {
		return nil, fmt.Errorf("limit, offset and page_index must not be negative")
	}
	return &ListAssignmentCandidatesQuery{
		Search:     p.Search,
		Pagination: ResolvePagination(p.Limit, p.Offset, p.PageIndex),
	}, nil
}

// UpdateCaseAssignmentsRequest is the complete set of users a case should end up assigned to.
// UserIDs is a pointer so an omitted field is told apart from an explicit empty list: clearing
// a case has to be asked for (`{"user_ids": []}`), never inferred from a body that forgot to
// mention it.
//
// The `validate` tag is what marks the field required in the OpenAPI spec, so a generated client
// cannot type-check a call the server answers with a 400. Enforcement stays in Resolve rather
// than moving to a `binding` tag: gin's would reject the field on its own terms, losing the
// message that tells the caller how to unassign instead.
type UpdateCaseAssignmentsRequest struct {
	UserIDs *[]string `json:"user_ids" validate:"required"`
} // @name UpdateCaseAssignmentsRequest

// Resolve validates the payload and returns the assignees to write, deduplicated and in the
// order given.
func (r UpdateCaseAssignmentsRequest) Resolve() ([]string, error) {
	if r.UserIDs == nil {
		return nil, fmt.Errorf("user_ids is required; send an empty list to unassign the case")
	}

	userIDs := []string{}
	seen := map[string]bool{}
	for _, userID := range *r.UserIDs {
		trimmed := strings.TrimSpace(userID)
		if trimmed == "" {
			return nil, fmt.Errorf("user_ids must not contain a blank id")
		}
		if !seen[trimmed] {
			seen[trimmed] = true
			userIDs = append(userIDs, trimmed)
		}
	}
	return userIDs, nil
}

// IneligibleAssigneesError names the users a case could not be assigned to. It is a typed error
// so the transport layer maps it to a status code without re-deriving why.
type IneligibleAssigneesError struct {
	OrgCode string
	UserIDs []string
}

func (e *IneligibleAssigneesError) Error() string {
	return fmt.Sprintf("cannot be assigned to a case at %s: %s", e.OrgCode, strings.Join(e.UserIDs, ", "))
}

// ErrCaseNotFound is returned when the tenant holds no such case.
var ErrCaseNotFound = errors.New("case not found")

// ClassifyAssignees sorts each requested assignee into one of three outcomes, given who is
// eligible and who is already assigned. Only two are returned — a pruned user appears in
// neither — so this is not a split of the input.
//
//   - eligible → written.
//   - not eligible but already assigned → dropped. Losing the permission does not retroactively
//     unassign anyone (reads keep showing them), but the next write prunes them.
//   - neither → rejected. Naming someone who can never be assigned is a client error, and
//     dropping it quietly would hide it.
func ClassifyAssignees(requested, eligible, assigned []string) (keep, rejected []string) {
	keep, rejected = []string{}, []string{}
	for _, userID := range requested {
		switch {
		case slices.Contains(eligible, userID):
			keep = append(keep, userID)
		case slices.Contains(assigned, userID):
			// Pruned: assigned before losing the permission, so not an error to report.
		default:
			rejected = append(rejected, userID)
		}
	}
	return keep, rejected
}
