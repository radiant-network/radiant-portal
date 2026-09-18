package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ListAssignmentCandidatesParams_DefaultsPagination(t *testing.T) {
	query, err := ListAssignmentCandidatesParams{}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, 25, query.Pagination.Limit)
	assert.Equal(t, 0, query.Pagination.Offset)
}

func Test_ListAssignmentCandidatesParams_KeepsSearch(t *testing.T) {
	query, err := ListAssignmentCandidatesParams{Search: "wal"}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, "wal", query.Search)
}

// A negative limit cancels GORM's LIMIT clause, which would return every eligible user.
func Test_ListAssignmentCandidatesParams_NegativeLimitRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesParams{Limit: -1}.Resolve()

	assert.ErrorContains(t, err, "must not be negative")
}

func Test_ListAssignmentCandidatesParams_NegativeOffsetRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesParams{Offset: -1}.Resolve()

	assert.ErrorContains(t, err, "must not be negative")
}

func Test_ListAssignmentCandidatesParams_NegativePageIndexRejected(t *testing.T) {
	_, err := ListAssignmentCandidatesParams{PageIndex: -1}.Resolve()

	assert.ErrorContains(t, err, "must not be negative")
}
