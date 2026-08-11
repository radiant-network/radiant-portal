package types

import "testing"

func Test_ListUsersParams_Validate_AcceptsPositiveValues(t *testing.T) {
	params := ListUsersParams{Search: "chen", Limit: 25, Offset: 50}
	if err := params.Validate(); err != nil {
		t.Errorf("Validate(limit=25, offset=50) = %v; want nil", err)
	}
}

func Test_ListUsersParams_Validate_AcceptsOmittedValues(t *testing.T) {
	if err := (ListUsersParams{}).Validate(); err != nil {
		t.Errorf("Validate(no param) = %v; want nil", err)
	}
}

func Test_ListUsersParams_Validate_RejectsNegativeValues(t *testing.T) {
	negatives := []ListUsersParams{{Limit: -1}, {Limit: 25, Offset: -1}, {Limit: 25, PageIndex: -1}}
	for _, params := range negatives {
		if err := params.Validate(); err == nil {
			t.Errorf("Validate(%+v) = nil; want error", params)
		}
	}
}

func Test_ListUsersParams_ToQuery_ResolvesPagination(t *testing.T) {
	query := ListUsersParams{Search: "chen", Limit: 10, Offset: 20}.ToQuery()

	if query.Search != "chen" {
		t.Errorf("ToQuery().Search = %q; want %q", query.Search, "chen")
	}
	if query.Pagination.Limit != 10 || query.Pagination.Offset != 20 {
		t.Errorf("ToQuery().Pagination = %+v; want limit 10, offset 20", *query.Pagination)
	}
}

func Test_ListUsersParams_ToQuery_OmittedLimitFallsBackToDefaultPage(t *testing.T) {
	query := ListUsersParams{}.ToQuery()

	if query.Pagination.Limit != 25 {
		t.Errorf("ToQuery().Pagination.Limit = %d; want the API-wide default of 25", query.Pagination.Limit)
	}
}
