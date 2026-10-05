package types

import (
	"maps"
	"reflect"
	"slices"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_ValidateUserAppliedCaseStatus_AcceptsEveryUserAppliedCode(t *testing.T) {
	for _, code := range UserAppliedCaseStatuses {
		assert.NoErrorf(t, ValidateUserAppliedCaseStatus(code), "ValidateUserAppliedCaseStatus(%q) = error; want nil", code)
	}
}

func Test_ValidateUserAppliedCaseStatus_RejectsSubmitted(t *testing.T) {
	err := ValidateUserAppliedCaseStatus(CaseStatusSubmitted)
	assert.EqualError(t, err, `status_code "submitted" is system-applied and cannot be set by a user`)
}

func Test_ValidateUserAppliedCaseStatus_RejectsProcessing(t *testing.T) {
	err := ValidateUserAppliedCaseStatus(CaseStatusProcessing)
	assert.EqualError(t, err, `status_code "processing" is system-applied and cannot be set by a user`)
}

func Test_ValidateUserAppliedCaseStatus_RejectsUnknownCode(t *testing.T) {
	err := ValidateUserAppliedCaseStatus("archived")
	assert.EqualError(t, err, `unknown status_code "archived", expected one of: in_progress, in_review, completed, resolved, unresolved, inconclusive, reopened, revoked`)
}

func Test_ValidateUserAppliedCaseStatus_RejectsEmptyCode(t *testing.T) {
	err := ValidateUserAppliedCaseStatus("")
	assert.EqualError(t, err, "status_code is required, expected one of: in_progress, in_review, completed, resolved, unresolved, inconclusive, reopened, revoked")
}

func Test_ReadModels_StatusCodeEnumCoversEveryCaseStatus(t *testing.T) {
	all := append(append([]string{}, SystemAppliedCaseStatuses...), UserAppliedCaseStatuses...)

	for _, model := range []any{CaseResult{}, CaseEntity{}} {
		field, ok := reflect.TypeOf(model).FieldByName("StatusCode")
		assert.Truef(t, ok, "%T.StatusCode has been renamed; update this guard", model)

		documented := strings.Split(field.Tag.Get("enums"), ",")
		assert.Equalf(t, all, documented, "the `enums` tag on %T.StatusCode has drifted from the status sets", model)
	}
}

func Test_PatchCase_StatusCodeEnumMatchesUserApplied(t *testing.T) {
	field, ok := reflect.TypeOf(PatchCase{}).FieldByName("StatusCode")
	assert.True(t, ok, "PatchCase.StatusCode has been renamed; update this guard")

	documented := strings.Split(field.Tag.Get("enums"), ",")
	assert.Equal(t, UserAppliedCaseStatuses, documented, "the `enums` tag on PatchCase.StatusCode has drifted from UserAppliedCaseStatuses")
}

func Test_CaseStatuses_UserAndSystemSetsAreDisjoint(t *testing.T) {
	for _, code := range SystemAppliedCaseStatuses {
		assert.NotContainsf(t, UserAppliedCaseStatuses, code, "%q is listed as both system- and user-applied", code)
	}
}

func Test_ValidateSystemCaseStatusChange_AcceptsSubmittedToProcessing(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.NoError(t, err)
}

func Test_ValidateSystemCaseStatusChange_AcceptsProcessingToInProgress(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusInProgress, ExpectedStatusCodes: []string{CaseStatusProcessing}})
	assert.NoError(t, err)
}

func Test_ValidateSystemCaseStatusChange_RejectsUserTargetStatus(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusCompleted, ExpectedStatusCodes: []string{CaseStatusInProgress}})
	assert.EqualError(t, err, `case 1: status_code "completed" cannot be set by the system, expected one of: processing, in_progress`)
}

func Test_ValidateSystemCaseStatusChange_RejectsSubmittedAsTarget(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusSubmitted, ExpectedStatusCodes: []string{CaseStatusDraft}})
	assert.EqualError(t, err, `case 1: status_code "submitted" cannot be set by the system, expected one of: processing, in_progress`)
}

func Test_ValidateSystemCaseStatusChange_RejectsEmptyTarget(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.EqualError(t, err, `case 1: status_code "" cannot be set by the system, expected one of: processing, in_progress`)
}

func Test_ValidateSystemCaseStatusChange_RejectsSubmittedToInProgress(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusInProgress, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.EqualError(t, err, "case 1: submitted -> in_progress is not an allowed change, in_progress can only be set from processing")
}

func Test_ValidateSystemCaseStatusChange_RejectsUserStatusAsExpected(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted, CaseStatusInReview}})
	assert.EqualError(t, err, "case 1: in_review -> processing is not an allowed change, processing can only be set from submitted")
}

func Test_ValidateSystemCaseStatusChange_RejectsMissingExpected(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{CaseID: 1, StatusCode: CaseStatusProcessing})
	assert.EqualError(t, err, "case 1: expected_status_codes is required")
}

func Test_ValidateSystemCaseStatusChange_RejectsMissingCaseId(t *testing.T) {
	err := ValidateSystemCaseStatusChange(CaseSystemStatusChange{StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.EqualError(t, err, "case_id must be a positive integer, got 0")
}

func Test_CaseSystemStatusChange_StatusCodeEnumMatchesTransitions(t *testing.T) {
	field, ok := reflect.TypeOf(CaseSystemStatusChange{}).FieldByName("StatusCode")
	assert.True(t, ok, "CaseSystemStatusChange.StatusCode has been renamed; update this guard")

	documented := strings.Split(field.Tag.Get("enums"), ",")
	assert.ElementsMatch(t, slices.Collect(maps.Keys(systemCaseStatusTransitions)), documented, "the `enums` tag on CaseSystemStatusChange.StatusCode has drifted from the allowed transitions")
}
