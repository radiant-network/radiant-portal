package types

import (
	"testing"
	"time"

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
	createdOn := time.Date(2026, 9, 29, 14, 0, 0, 0, time.UTC)
	resp := NewCaseGroupResponse(CaseGroup{ID: 7, TenantCode: "radiant", Name: "run_1", CreatedOn: createdOn}, []int{3, 1, 3})
	assert.Equal(t, CaseGroupResponse{Name: "run_1", TenantCode: "radiant", CaseIDs: []int{3, 1}, CreatedOn: createdOn}, resp)
}

func Test_NewCaseGroupResponse_NoCases_EmptyList(t *testing.T) {
	assert.Equal(t, []int{}, NewCaseGroupResponse(CaseGroup{Name: "run_1"}, nil).CaseIDs)
}

func Test_SplitCaseGroupCriteria_NoneLeavesCriteriaUntouched(t *testing.T) {
	criteria := []SearchCriterion{{FieldName: "priority_code", Value: []interface{}{"stat"}}}
	names, rest, err := SplitCaseGroupCriteria(criteria)
	assert.NoError(t, err)
	assert.Nil(t, names)
	assert.Equal(t, criteria, rest)
}

func Test_SplitCaseGroupCriteria_ExtractsNamesKeepsOthers(t *testing.T) {
	criteria := []SearchCriterion{
		{FieldName: "case_group", Value: []interface{}{"run_1", "run_2", "run_1"}},
		{FieldName: "priority_code", Operator: "in", Value: []interface{}{"stat"}},
		{FieldName: "case_group", Operator: "in", Value: []interface{}{"run_3"}},
	}
	names, rest, err := SplitCaseGroupCriteria(criteria)
	assert.NoError(t, err)
	assert.Equal(t, []string{"run_1", "run_2", "run_3"}, names)
	assert.Equal(t, []SearchCriterion{{FieldName: "priority_code", Operator: "in", Value: []interface{}{"stat"}}}, rest)
}

func Test_SplitCaseGroupCriteria_UnsupportedOperator(t *testing.T) {
	_, _, err := SplitCaseGroupCriteria([]SearchCriterion{{FieldName: "case_group", Operator: "not-in", Value: []interface{}{"run_1"}}})
	assert.EqualError(t, err, "operation not-in is not supported on case_group, only in")
}

func Test_SplitCaseGroupCriteria_EmptyValue(t *testing.T) {
	_, _, err := SplitCaseGroupCriteria([]SearchCriterion{{FieldName: "case_group", Value: []interface{}{}}})
	assert.EqualError(t, err, "value must be defined: case_group")
}

func Test_SplitCaseGroupCriteria_NonStringValue(t *testing.T) {
	_, _, err := SplitCaseGroupCriteria([]SearchCriterion{{FieldName: "case_group", Value: []interface{}{float64(7)}}})
	assert.EqualError(t, err, "case_group values must be strings, got 7")
}
