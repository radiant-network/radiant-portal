package types

import (
	"reflect"
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

func Test_PatchCase_PriorityCodeEnumMatchesCasePriorities(t *testing.T) {
	field, ok := reflect.TypeOf(PatchCase{}).FieldByName("PriorityCode")
	assert.True(t, ok, "PatchCase.PriorityCode has been renamed; update this guard")

	documented := strings.Split(field.Tag.Get("enums"), ",")
	assert.Equal(t, CasePriorities, documented, "the `enums` tag on PatchCase.PriorityCode has drifted from CasePriorities")
}

func Test_ValidateCasePriority_AcceptsEveryPriority(t *testing.T) {
	for _, code := range CasePriorities {
		assert.NoErrorf(t, ValidateCasePriority(code), "ValidateCasePriority(%q) = error; want nil", code)
	}
}

func Test_ValidateCasePriority_RejectsUnknownCode(t *testing.T) {
	err := ValidateCasePriority("critical")
	assert.EqualError(t, err, `unknown priority_code "critical", expected one of: routine, urgent, asap, stat`)
}

func Test_ValidateCasePriority_RejectsWrongCase(t *testing.T) {
	err := ValidateCasePriority("URGENT")
	assert.EqualError(t, err, `unknown priority_code "URGENT", expected one of: routine, urgent, asap, stat`)
}

func Test_ValidateCasePriority_RejectsEmptyCode(t *testing.T) {
	err := ValidateCasePriority("")
	assert.EqualError(t, err, "priority_code is required, expected one of: routine, urgent, asap, stat")
}

func Test_ValidatePatchCase_AcceptsStatusOnly(t *testing.T) {
	assert.NoError(t, ValidatePatchCase(PatchCase{StatusCode: CaseStatusInReview}))
}

func Test_ValidatePatchCase_AcceptsPriorityOnly(t *testing.T) {
	assert.NoError(t, ValidatePatchCase(PatchCase{PriorityCode: CasePriorityStat}))
}

func Test_ValidatePatchCase_AcceptsStatusAndPriority(t *testing.T) {
	assert.NoError(t, ValidatePatchCase(PatchCase{StatusCode: CaseStatusRevoked, PriorityCode: CasePriorityUrgent}))
}

func Test_ValidatePatchCase_RejectsEmptyPatch(t *testing.T) {
	err := ValidatePatchCase(PatchCase{})
	assert.EqualError(t, err, "no field to update, expected status_code or priority_code")
}

func Test_ValidatePatchCase_RejectsSystemStatusWithValidPriority(t *testing.T) {
	err := ValidatePatchCase(PatchCase{StatusCode: CaseStatusSubmitted, PriorityCode: CasePriorityUrgent})
	assert.EqualError(t, err, `status_code "submitted" is system-applied and cannot be set by a user`)
}

func Test_ValidatePatchCase_RejectsUnknownPriorityWithValidStatus(t *testing.T) {
	err := ValidatePatchCase(PatchCase{StatusCode: CaseStatusInReview, PriorityCode: "critical"})
	assert.EqualError(t, err, `unknown priority_code "critical", expected one of: routine, urgent, asap, stat`)
}

func Test_CaseStatuses_UserAndSystemSetsAreDisjoint(t *testing.T) {
	for _, code := range SystemAppliedCaseStatuses {
		assert.NotContainsf(t, UserAppliedCaseStatuses, code, "%q is listed as both system- and user-applied", code)
	}
}

func Test_ValidateCaseStatusChange_AcceptsSubmittedToProcessing(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.NoError(t, err)
}

func Test_ValidateCaseStatusChange_AcceptsProcessingToInProgress(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusInProgress, ExpectedStatusCodes: []string{CaseStatusProcessing}})
	assert.NoError(t, err)
}

func Test_ValidateCaseStatusChange_AcceptsUserToUser(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusCompleted, ExpectedStatusCodes: []string{CaseStatusInProgress, CaseStatusInReview}})
	assert.NoError(t, err)
}

func Test_ValidateCaseStatusChange_RejectsSubmittedAsTarget(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusSubmitted, ExpectedStatusCodes: []string{CaseStatusDraft}})
	assert.EqualError(t, err, "case 1: draft -> submitted is not an allowed change, the only changes involving a system status are submitted -> processing and processing -> in_progress")
}

func Test_ValidateCaseStatusChange_RejectsSubmittedToInProgress(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusInProgress, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.EqualError(t, err, "case 1: submitted -> in_progress is not an allowed change, the only changes involving a system status are submitted -> processing and processing -> in_progress")
}

func Test_ValidateCaseStatusChange_RejectsProcessingToUserStatusOtherThanInProgress(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusInReview, ExpectedStatusCodes: []string{CaseStatusProcessing}})
	assert.EqualError(t, err, "case 1: processing -> in_review is not an allowed change, the only changes involving a system status are submitted -> processing and processing -> in_progress")
}

func Test_ValidateCaseStatusChange_RejectsUserStatusToProcessing(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted, CaseStatusInReview}})
	assert.EqualError(t, err, "case 1: in_review -> processing is not an allowed change, the only changes involving a system status are submitted -> processing and processing -> in_progress")
}

func Test_ValidateCaseStatusChange_RejectsUnknownTarget(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: "archived", ExpectedStatusCodes: []string{CaseStatusInProgress}})
	assert.EqualError(t, err, `case 1: unknown status_code "archived"`)
}

func Test_ValidateCaseStatusChange_RejectsUnknownExpected(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusCompleted, ExpectedStatusCodes: []string{"archived"}})
	assert.EqualError(t, err, `case 1: unknown expected status code "archived"`)
}

func Test_ValidateCaseStatusChange_RejectsEmptyTarget(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.EqualError(t, err, "case 1: status_code is required")
}

func Test_ValidateCaseStatusChange_RejectsMissingExpected(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{CaseID: 1, StatusCode: CaseStatusProcessing})
	assert.EqualError(t, err, "case 1: expected_status_codes is required")
}

func Test_ValidateCaseStatusChange_RejectsMissingCaseId(t *testing.T) {
	err := ValidateCaseStatusChange(CaseStatusChange{StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted}})
	assert.EqualError(t, err, "case_id must be a positive integer, got 0")
}

func Test_IsSystemCaseStatusChange_SystemTarget(t *testing.T) {
	assert.True(t, IsSystemCaseStatusChange(CaseStatusChange{StatusCode: CaseStatusProcessing, ExpectedStatusCodes: []string{CaseStatusSubmitted}}))
}

func Test_IsSystemCaseStatusChange_SystemExpectedOnly(t *testing.T) {
	assert.True(t, IsSystemCaseStatusChange(CaseStatusChange{StatusCode: CaseStatusInProgress, ExpectedStatusCodes: []string{CaseStatusProcessing}}),
		"processing -> in_progress lands on a user status but leaves a system one")
}

func Test_IsSystemCaseStatusChange_OneSystemExpectedAmongUserOnes(t *testing.T) {
	assert.True(t, IsSystemCaseStatusChange(CaseStatusChange{StatusCode: CaseStatusInReview, ExpectedStatusCodes: []string{CaseStatusInProgress, CaseStatusDraft}}))
}

func Test_IsSystemCaseStatusChange_UserToUser(t *testing.T) {
	assert.False(t, IsSystemCaseStatusChange(CaseStatusChange{StatusCode: CaseStatusInReview, ExpectedStatusCodes: []string{CaseStatusInProgress}}))
}
