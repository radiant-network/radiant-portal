package types

import (
	"errors"
	"fmt"
	"regexp"
	"time"
)

// caseGroupNamePattern is strict because the name becomes a manifest filename and an SMTP
// header value downstream: ASCII letters/digits/underscore/dot/dash, starts alphanumeric,
// 1-100 characters.
var caseGroupNamePattern = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$`)

type CaseGroup struct {
	ID         int `gorm:"primaryKey;autoIncrement"`
	TenantCode string
	Name       string
	CreatedOn  time.Time `gorm:"autoCreateTime"`
	CreatedBy  string
}

type CaseGroupCase struct {
	CaseGroupID int `gorm:"primaryKey"`
	CaseID      int `gorm:"primaryKey"`
}

var CaseGroupTable = Table{
	Name:  "case_group",
	Alias: "cg",
}

var CaseGroupCaseTable = Table{
	Name:  "case_group_case",
	Alias: "cgc",
}

func (CaseGroup) TableName() string {
	return CaseGroupTable.Name
}

func (CaseGroupCase) TableName() string {
	return CaseGroupCaseTable.Name
}

var ErrCaseGroupNotFound = errors.New("case group not found in this tenant")

// UnknownCaseIDsError lists the case ids of a request that do not exist in the tenant.
type UnknownCaseIDsError struct {
	IDs []int
}

func (e *UnknownCaseIDsError) Error() string {
	return fmt.Sprintf("unknown case ids in this tenant: %v", e.IDs)
}

func ValidateCaseGroupName(name string) error {
	if !caseGroupNamePattern.MatchString(name) {
		return fmt.Errorf("case group name %q is invalid: must start with a letter or digit and contain only letters, digits, underscores, dots, or dashes (max 100)", name)
	}
	return nil
}

// NormalizeCaseIDs deduplicates, keeping the client's order (first occurrence wins). Never nil: an
// empty group serializes as [].
func NormalizeCaseIDs(ids []int) []int {
	out := make([]int, 0, len(ids))
	seen := make(map[int]bool, len(ids))
	for _, id := range ids {
		if !seen[id] {
			seen[id] = true
			out = append(out, id)
		}
	}
	return out
}

// @Description Payload to create a case group, or overwrite the case list of an existing one
// @Description (same name in the tenant). An empty case_ids list is accepted and empties the group.
type CaseGroupRequest struct {
	Name    string `json:"name" binding:"required"`
	CaseIDs []int  `json:"case_ids" binding:"required"`
} // @name CaseGroupRequest

func (r CaseGroupRequest) Validate() error {
	return ValidateCaseGroupName(r.Name)
}

// @Description A named set of cases within a tenant.
type CaseGroupResponse struct {
	Name       string `json:"name" validate:"required"`
	TenantCode string `json:"tenant_code" validate:"required"`
	CaseIDs    []int  `json:"case_ids" validate:"required"`
} // @name CaseGroupResponse

func NewCaseGroupResponse(group CaseGroup, caseIDs []int) CaseGroupResponse {
	return CaseGroupResponse{Name: group.Name, TenantCode: group.TenantCode, CaseIDs: NormalizeCaseIDs(caseIDs)}
}
