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
