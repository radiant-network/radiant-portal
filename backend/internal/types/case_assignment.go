package types

import "fmt"

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
