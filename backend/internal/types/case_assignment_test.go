package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ListAssignmentCandidatesBody_ParsesCaseIDs(t *testing.T) {
	query, err := ListAssignmentCandidatesBody{CaseIDs: []int{12, 13}}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, []int{12, 13}, query.CaseIDs)
}

// The same case named twice must not widen the IN list or double a lab in the mixed-lab check.
func Test_ListAssignmentCandidatesBody_DeduplicatesCaseIDs(t *testing.T) {
	query, err := ListAssignmentCandidatesBody{CaseIDs: []int{12, 13, 12}}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, []int{12, 13}, query.CaseIDs)
}

func Test_ListAssignmentCandidatesBody_DefaultsPagination(t *testing.T) {
	query, err := ListAssignmentCandidatesBody{CaseIDs: []int{12}}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, 25, query.Pagination.Limit)
	assert.Equal(t, 0, query.Pagination.Offset)
}

func Test_ListAssignmentCandidatesBody_EmptyCaseIDsRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesBody{}.Resolve()

	assert.ErrorContains(t, err, "case_ids is required")
}

// A case id is a positive identity; 0 and negatives would silently match nothing rather than
// telling the caller they asked for something impossible.
func Test_ListAssignmentCandidatesBody_ZeroCaseIDRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesBody{CaseIDs: []int{0}}.Resolve()

	assert.ErrorContains(t, err, "case_ids")
}

func Test_ListAssignmentCandidatesBody_NegativeCaseIDRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesBody{CaseIDs: []int{-3}}.Resolve()

	assert.ErrorContains(t, err, "case_ids")
}

// A negative limit cancels GORM's LIMIT clause, which would return every eligible user.
func Test_ListAssignmentCandidatesBody_NegativeLimitRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesBody{CaseIDs: []int{12}, Limit: -1}.Resolve()

	assert.ErrorContains(t, err, "must not be negative")
}

func Test_ListAssignmentCandidatesBody_NegativeOffsetRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesBody{CaseIDs: []int{12}, Offset: -1}.Resolve()

	assert.ErrorContains(t, err, "must not be negative")
}

func Test_ListAssignmentCandidatesBody_NegativePageIndexRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesBody{CaseIDs: []int{12}, PageIndex: -1}.Resolve()

	assert.ErrorContains(t, err, "must not be negative")
}
