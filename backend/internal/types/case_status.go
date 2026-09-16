package types

import (
	"fmt"
	"slices"
	"strings"
)

// Case status codes, mirroring the `status` dictionary. The dictionary is shared with
// sequencing_experiment.status_code on purpose, so a few codes (in_review, resolved, unresolved, inconclusive)
// are meaningless for a sequencing experiment.
const (
	CaseStatusSubmitted    = "submitted"
	CaseStatusProcessing   = "processing"
	CaseStatusInProgress   = "in_progress"
	CaseStatusInReview     = "in_review"
	CaseStatusCompleted    = "completed"
	CaseStatusResolved     = "resolved"
	CaseStatusUnresolved   = "unresolved"
	CaseStatusInconclusive = "inconclusive"
	CaseStatusReopened     = "reopened"
	CaseStatusRevoked      = "revoked"
)

var SystemAppliedCaseStatuses = []string{
	CaseStatusSubmitted,
	CaseStatusProcessing,
}

var UserAppliedCaseStatuses = []string{
	CaseStatusInProgress,
	CaseStatusInReview,
	CaseStatusCompleted,
	CaseStatusResolved,
	CaseStatusUnresolved,
	CaseStatusInconclusive,
	CaseStatusReopened,
	CaseStatusRevoked,
}

func ValidateUserAppliedCaseStatus(code string) error {
	switch {
	case code == "":
		return fmt.Errorf("status_code is required, expected one of: %s", strings.Join(UserAppliedCaseStatuses, ", "))
	case slices.Contains(SystemAppliedCaseStatuses, code):
		return fmt.Errorf("status_code %q is system-applied and cannot be set by a user", code)
	case !slices.Contains(UserAppliedCaseStatuses, code):
		return fmt.Errorf("unknown status_code %q, expected one of: %s", code, strings.Join(UserAppliedCaseStatuses, ", "))
	}
	return nil
}

// CasePatch carries the case fields a PATCH may change. status_code is the only one so far.
// @Description Case fields to change. Omitted fields are left untouched.
type CasePatch struct {
	StatusCode *string `json:"status_code,omitempty" example:"in_review"`
} // @name CasePatch

// Validate checks the fields the patch actually carries. An empty patch is refused rather than
// treated as a no-op: a request that changes nothing is a client bug worth surfacing.
func (p CasePatch) Validate() error {
	if p.StatusCode == nil {
		return fmt.Errorf("no field to update, expected at least one of: %s", strings.Join(patchableCaseFields, ", "))
	}
	return ValidateUserAppliedCaseStatus(*p.StatusCode)
}

var patchableCaseFields = []string{"status_code"}

// @Description A case after a successful patch, echoing the fields that were applied.
type PatchCaseResponse struct {
	CaseID     int    `json:"case_id"`
	StatusCode string `json:"status_code,omitempty"`
} // @name PatchCaseResponse
