package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_ValidateCaseGroupName_Valid(t *testing.T) {
	assert.NoError(t, ValidateCaseGroupName("postprocessing-scheduled-2026-09-11T02-00-00"))
	assert.NoError(t, ValidateCaseGroupName("run_1.b"))
}

func Test_ValidateCaseGroupName_Empty(t *testing.T) {
	assert.Error(t, ValidateCaseGroupName(""))
}

func Test_ValidateCaseGroupName_PathSeparatorRejected(t *testing.T) {
	assert.Error(t, ValidateCaseGroupName("run/2026"))
	assert.Error(t, ValidateCaseGroupName("-leading-dash"))
	assert.Error(t, ValidateCaseGroupName("with space"))
}

func Test_ValidateCaseGroupName_TooLong(t *testing.T) {
	long := make([]byte, 101)
	for i := range long {
		long[i] = 'a'
	}
	assert.Error(t, ValidateCaseGroupName(string(long)))
}

func Test_UnknownCaseIDsError_Message(t *testing.T) {
	err := &UnknownCaseIDsError{IDs: []int{7, 42}}
	assert.Equal(t, "unknown case ids in this tenant: [7 42]", err.Error())
}

func Test_NormalizeCaseIDs_DedupsKeepingOrder(t *testing.T) {
	assert.Equal(t, []int{10, 2, 1}, NormalizeCaseIDs([]int{10, 2, 1, 2, 10}))
}

func Test_NormalizeCaseIDs_Empty_NotNil(t *testing.T) {
	assert.Equal(t, []int{}, NormalizeCaseIDs(nil))
	assert.NotNil(t, NormalizeCaseIDs([]int{}))
}

func Test_CaseGroupRequest_Validate_InvalidName(t *testing.T) {
	assert.Error(t, CaseGroupRequest{Name: "bad/name", CaseIDs: []int{1}}.Validate())
}

func Test_NewCaseGroupResponse(t *testing.T) {
	resp := NewCaseGroupResponse(CaseGroup{ID: 7, TenantCode: "radiant", Name: "run_1"}, []int{3, 1, 3})
	assert.Equal(t, CaseGroupResponse{Name: "run_1", TenantCode: "radiant", CaseIDs: []int{3, 1}}, resp)
}

func Test_NewCaseGroupResponse_NoCases_EmptyList(t *testing.T) {
	assert.Equal(t, []int{}, NewCaseGroupResponse(CaseGroup{Name: "run_1"}, nil).CaseIDs)
}
