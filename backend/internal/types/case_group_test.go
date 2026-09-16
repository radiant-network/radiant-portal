package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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

func Test_JoinCaseIDs_SortsAndDedups(t *testing.T) {
	assert.Equal(t, "1,2,10", JoinCaseIDs([]int{10, 2, 1, 2}))
}

func Test_JoinCaseIDs_Empty(t *testing.T) {
	assert.Equal(t, "", JoinCaseIDs(nil))
	assert.Equal(t, "", JoinCaseIDs([]int{}))
}

func Test_ParseCaseIDs_RoundTrip(t *testing.T) {
	ids, err := ParseCaseIDs("1,2,10")
	require.NoError(t, err)
	assert.Equal(t, []int{1, 2, 10}, ids)
}

func Test_ParseCaseIDs_SortsDedupsAndTrims(t *testing.T) {
	ids, err := ParseCaseIDs(" 10, 2,1,2")
	require.NoError(t, err)
	assert.Equal(t, []int{1, 2, 10}, ids)
}

func Test_ParseCaseIDs_Empty(t *testing.T) {
	ids, err := ParseCaseIDs("")
	require.NoError(t, err)
	assert.Equal(t, []int{}, ids)
	assert.NotNil(t, ids)
}

func Test_ParseCaseIDs_NonInteger_Error(t *testing.T) {
	ids, err := ParseCaseIDs("1,abc")
	assert.Error(t, err)
	assert.Nil(t, ids)
}

func Test_CaseGroupRequest_Validate_InvalidName(t *testing.T) {
	assert.Error(t, CaseGroupRequest{Name: "bad/name", CaseIDs: []int{1}}.Validate())
}

func Test_CaseGroup_ToResponse(t *testing.T) {
	resp, err := CaseGroup{TenantCode: "radiant", Name: "run_1", CaseIDs: "3,1"}.ToResponse()
	require.NoError(t, err)
	assert.Equal(t, &CaseGroupResponse{Name: "run_1", TenantCode: "radiant", CaseIDs: []int{1, 3}}, resp)
}

func Test_CaseGroup_ToResponse_CorruptColumn_Error(t *testing.T) {
	_, err := CaseGroup{Name: "run_1", CaseIDs: "1,x"}.ToResponse()
	assert.ErrorContains(t, err, `case group "run_1"`)
}
