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

// ListAssignmentCandidatesBody is the assignment candidates request. CaseIDs names the cases an
// assignment is being made on. Eligibility is decided at the case's diagnosis lab, so every case
// named must belong to the same one — the batch picker offers a single list, not one per
// organization.
type ListAssignmentCandidatesBody struct {
	CaseIDs   []int  `json:"case_ids"`
	Search    string `json:"search"`
	Limit     int    `json:"limit"`
	Offset    int    `json:"offset"`
	PageIndex int    `json:"page_index"`
} // @name ListAssignmentCandidatesBody

// ListAssignmentCandidatesQuery is the resolved candidates request handed to the repository.
type ListAssignmentCandidatesQuery struct {
	CaseIDs    []int
	Search     string
	Pagination *Pagination
}

func (b ListAssignmentCandidatesBody) Resolve() (*ListAssignmentCandidatesQuery, error) {
	// A negative limit would cancel the LIMIT clause in GORM and return every eligible user.
	if b.Limit < 0 || b.Offset < 0 || b.PageIndex < 0 {
		return nil, fmt.Errorf("limit, offset and page_index must not be negative")
	}

	caseIDs := []int{}
	seen := map[int]bool{}
	for _, id := range b.CaseIDs {
		if id <= 0 {
			return nil, fmt.Errorf("case_ids must name positive case ids, got %d", id)
		}
		if !seen[id] {
			seen[id] = true
			caseIDs = append(caseIDs, id)
		}
	}
	if len(caseIDs) == 0 {
		return nil, fmt.Errorf("case_ids is required")
	}

	return &ListAssignmentCandidatesQuery{
		CaseIDs:    caseIDs,
		Search:     b.Search,
		Pagination: ResolvePagination(b.Limit, b.Offset, b.PageIndex),
	}, nil
}
