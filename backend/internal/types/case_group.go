package types

import (
	"errors"
	"fmt"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"
)

// caseGroupNamePattern is strict because the name becomes a manifest filename and an SMTP
// header value downstream: ASCII letters/digits/underscore/dot/dash, starts alphanumeric,
// 1-100 characters.
var caseGroupNamePattern = regexp.MustCompile(`^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$`)

type CaseGroup struct {
	TenantCode string `gorm:"primaryKey"`
	Name       string `gorm:"primaryKey"`
	CaseIDs    string
	CreatedOn  time.Time `gorm:"autoCreateTime"`
	CreatedBy  string
}

var CaseGroupTable = Table{
	Name:  "case_group",
	Alias: "cg",
}

func (CaseGroup) TableName() string {
	return CaseGroupTable.Name
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

// JoinCaseIDs serializes ids for the case_ids column: sorted, deduplicated, comma-joined.
func JoinCaseIDs(ids []int) string {
	sorted := slices.Clone(ids)
	slices.Sort(sorted)
	sorted = slices.Compact(sorted)
	parts := make([]string, len(sorted))
	for i, id := range sorted {
		parts[i] = strconv.Itoa(id)
	}
	return strings.Join(parts, ",")
}

// ParseCaseIDs is the inverse of JoinCaseIDs. An empty column is an empty group, never nil, so
// JSON serializes []. A non-integer token is a data error, not a zero.
func ParseCaseIDs(s string) ([]int, error) {
	ids := []int{}
	if strings.TrimSpace(s) == "" {
		return ids, nil
	}
	for _, token := range strings.Split(s, ",") {
		id, err := strconv.Atoi(strings.TrimSpace(token))
		if err != nil {
			return nil, fmt.Errorf("invalid case id %q in case_ids: %w", token, err)
		}
		ids = append(ids, id)
	}
	slices.Sort(ids)
	return slices.Compact(ids), nil
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

func (g CaseGroup) ToResponse() (*CaseGroupResponse, error) {
	ids, err := ParseCaseIDs(g.CaseIDs)
	if err != nil {
		return nil, fmt.Errorf("case group %q: %w", g.Name, err)
	}
	return &CaseGroupResponse{Name: g.Name, TenantCode: g.TenantCode, CaseIDs: ids}, nil
}
