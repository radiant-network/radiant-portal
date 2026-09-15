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

// @Description A case status change applied by a user.
type UpdateCaseStatusInput struct {
	StatusCode string `json:"status_code" example:"in_review"`
} // @name UpdateCaseStatusInput

// @Description A case's status after a successful change.
type CaseStatusResponse struct {
	CaseID     int    `json:"case_id"`
	StatusCode string `json:"status_code"`
} // @name CaseStatusResponse
