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

func Test_ListUsersParams_ToQuery_SplitsRoles(t *testing.T) {
	query := ListUsersParams{Roles: "member, geneticist"}.ToQuery()

	if len(query.Roles) != 2 || query.Roles[0] != "member" || query.Roles[1] != "geneticist" {
		t.Errorf("ToQuery(roles=%q).Roles = %v; want [member geneticist]", "member, geneticist", query.Roles)
	}
}

func Test_ListUsersParams_ToQuery_BlankRolesIsNoFilter(t *testing.T) {
	for _, raw := range []string{"", ",", " , "} {
		query := ListUsersParams{Roles: raw}.ToQuery()
		if len(query.Roles) != 0 {
			t.Errorf("ToQuery(roles=%q).Roles = %v; want no filter", raw, query.Roles)
		}
	}
}

func newCreateUserRequest() CreateUserRequest {
	return CreateUserRequest{
		Email:     "grace.chen@chop.edu",
		FirstName: "Grace",
		LastName:  "Chen",
		Roles:     []CreateUserRole{{RoleCode: "geneticist", OrgCodes: []string{"CHOP"}}},
	}
}

func Test_CreateUserRequest_Validate_AcceptsCompleteRequest(t *testing.T) {
	if err := newCreateUserRequest().Validate(); err != nil {
		t.Errorf("Validate(%+v) = %v; want nil", newCreateUserRequest(), err)
	}
}

func Test_CreateUserRequest_Validate_AcceptsNoRoles(t *testing.T) {
	req := newCreateUserRequest()
	req.Roles = nil
	if err := req.Validate(); err != nil {
		t.Errorf("Validate(no role) = %v; want nil — member is granted server-side", err)
	}
}

func Test_CreateUserRequest_Validate_RejectsMalformedEmail(t *testing.T) {
	for _, email := range []string{"", "grace.chen", "grace chen@chop.edu", "Grace Chen <grace.chen@chop.edu>"} {
		req := newCreateUserRequest()
		req.Email = email
		if err := req.Validate(); err == nil {
			t.Errorf("Validate(email=%q) = nil; want error", email)
		}
	}
}

func Test_CreateUserRequest_Validate_RejectsBlankName(t *testing.T) {
	req := newCreateUserRequest()
	req.FirstName = "  "
	if err := req.Validate(); err == nil {
		t.Errorf("Validate(first_name=%q) = nil; want error", req.FirstName)
	}
}

func Test_CreateUserRequest_Validate_RejectsDuplicateRole(t *testing.T) {
	req := newCreateUserRequest()
	req.Roles = []CreateUserRole{
		{RoleCode: "geneticist", OrgCodes: []string{"CHOP"}},
		{RoleCode: "geneticist", OrgCodes: []string{"BOSTON"}},
	}
	if err := req.Validate(); err == nil {
		t.Errorf("Validate(duplicate role_code) = nil; want error — the orgs belong in one entry")
	}
}

func Test_CreateUserRequest_Validate_RejectsBlankRoleCode(t *testing.T) {
	req := newCreateUserRequest()
	req.Roles = []CreateUserRole{{RoleCode: " "}}
	if err := req.Validate(); err == nil {
		t.Errorf("Validate(blank role_code) = nil; want error")
	}
}

func Test_CreateUserRequest_Validate_RejectsBlankOrgCode(t *testing.T) {
	req := newCreateUserRequest()
	req.Roles = []CreateUserRole{{RoleCode: "geneticist", OrgCodes: []string{"CHOP", ""}}}
	if err := req.Validate(); err == nil {
		t.Errorf("Validate(blank org_code) = nil; want error")
	}
}
