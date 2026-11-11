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

func ptr(values []string) *[]string { return &values }

func Test_UpdateCaseAssignmentsRequest_KeepsOrderAndDeduplicates(t *testing.T) {
	userIDs, err := UpdateCaseAssignmentsRequest{UserIDs: ptr([]string{"b", "a", "b"})}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, []string{"b", "a"}, userIDs)
}

func Test_UpdateCaseAssignmentsRequest_TrimsIDs(t *testing.T) {
	userIDs, err := UpdateCaseAssignmentsRequest{UserIDs: ptr([]string{" a "})}.Resolve()

	require.NoError(t, err)
	assert.Equal(t, []string{"a"}, userIDs)
}

// An explicit empty list is how a case is unassigned, so it must resolve rather than error.
func Test_UpdateCaseAssignmentsRequest_EmptyListIsValid(t *testing.T) {
	userIDs, err := UpdateCaseAssignmentsRequest{UserIDs: ptr([]string{})}.Resolve()

	require.NoError(t, err)
	assert.Empty(t, userIDs)
}

// An omitted field is not the same as an empty one: clearing a case is asked for, never inferred.
func Test_UpdateCaseAssignmentsRequest_OmittedFieldRejected(t *testing.T) {
	_, err := UpdateCaseAssignmentsRequest{}.Resolve()

	assert.ErrorContains(t, err, "user_ids is required")
}

func Test_UpdateCaseAssignmentsRequest_BlankIDRejected(t *testing.T) {
	_, err := UpdateCaseAssignmentsRequest{UserIDs: ptr([]string{"a", "   "})}.Resolve()

	assert.ErrorContains(t, err, "blank id")
}

func Test_ClassifyAssignees_KeepsTheEligible(t *testing.T) {
	keep, rejected := ClassifyAssignees([]string{"a", "b"}, []string{"a", "b"}, nil)

	assert.Equal(t, []string{"a", "b"}, keep)
	assert.Empty(t, rejected)
}

// Already assigned but no longer eligible: dropped, not rejected. This is what makes the next
// write prune an assignee who lost their permission.
func Test_ClassifyAssignees_DropsIneligibleAlreadyAssigned(t *testing.T) {
	keep, rejected := ClassifyAssignees([]string{"stale"}, nil, []string{"stale"})

	assert.Empty(t, keep)
	assert.Empty(t, rejected)
}

// Neither eligible nor already assigned: a client error, not something to drop quietly.
func Test_ClassifyAssignees_RejectsIneligibleNewcomer(t *testing.T) {
	keep, rejected := ClassifyAssignees([]string{"outsider"}, nil, nil)

	assert.Empty(t, keep)
	assert.Equal(t, []string{"outsider"}, rejected)
}

func Test_ClassifyAssignees_SplitsAMixedRequest(t *testing.T) {
	keep, rejected := ClassifyAssignees(
		[]string{"ok", "stale", "outsider"},
		[]string{"ok"},
		[]string{"stale"},
	)

	assert.Equal(t, []string{"ok"}, keep)
	assert.Equal(t, []string{"outsider"}, rejected)
}

func Test_ClassifyAssignees_PreservesRequestedOrder(t *testing.T) {
	keep, _ := ClassifyAssignees([]string{"b", "a"}, []string{"a", "b"}, nil)

	assert.Equal(t, []string{"b", "a"}, keep)
}

// Both returns are non-nil even with nothing to report. Asserted with Equal rather than Empty
// on purpose: Empty passes for a nil slice too, so it would not catch a regression to nil —
// which is the one thing this test is here to pin.
func Test_ClassifyAssignees_NothingRequested(t *testing.T) {
	keep, rejected := ClassifyAssignees(nil, nil, nil)

	assert.Equal(t, []string{}, keep)
	assert.Equal(t, []string{}, rejected)
}

func Test_IneligibleAssigneesError_NamesOrgAndUsers(t *testing.T) {
	err := &IneligibleAssigneesError{OrgCode: "CQGC", UserIDs: []string{"a", "b"}}

	assert.EqualError(t, err, "cannot be assigned to a case at CQGC: a, b")
}
