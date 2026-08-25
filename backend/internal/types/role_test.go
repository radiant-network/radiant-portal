package types

import (
	"strings"
	"testing"
)

func validCreateRoleRequest() CreateRoleRequest {
	return CreateRoleRequest{
		Code:        "clinical_reviewer",
		Name:        "Clinical Reviewer",
		Description: "Full clinical work as one role.",
		Actions:     []string{ActionSearchCase, ActionReadPII},
	}
}

func Test_CreateRoleRequest_Validate_AcceptsValidCodes(t *testing.T) {
	// Lowercase, must start with a letter, digits and underscores allowed, up to 50 characters.
	valid := []string{"a", "member", "clinical_reviewer", "role_2", "r0", strings.Repeat("a", 50)}
	for _, code := range valid {
		req := validCreateRoleRequest()
		req.Code = code
		if err := req.Validate(); err != nil {
			t.Errorf("Validate(code=%q) = %v; want nil", code, err)
		}
	}
}

func Test_CreateRoleRequest_Validate_RejectsInvalidCodes(t *testing.T) {
	// Uppercase and dashes are accepted for org codes but not here: a role code is shared
	// vocabulary with the seeded roles, which are all lowercase.
	invalid := []string{"", "Clinical", "CLINICAL", "clinical-reviewer", "9role", "_role", "role x", "role.x", strings.Repeat("a", 51)}
	for _, code := range invalid {
		req := validCreateRoleRequest()
		req.Code = code
		if err := req.Validate(); err == nil {
			t.Errorf("Validate(code=%q) = nil; want error", code)
		}
	}
}

func Test_CreateRoleRequest_Validate_RejectsBlankName(t *testing.T) {
	for _, name := range []string{"", "   ", "\t"} {
		req := validCreateRoleRequest()
		req.Name = name
		if err := req.Validate(); err == nil {
			t.Errorf("Validate(name=%q) = nil; want error", name)
		}
	}
}

func Test_CreateRoleRequest_Validate_RejectsEmptyActions(t *testing.T) {
	req := validCreateRoleRequest()
	req.Actions = []string{}
	if err := req.Validate(); err == nil {
		t.Error("Validate(actions=[]) = nil; want error — a role binding no action grants nothing")
	}

	req.Actions = nil
	if err := req.Validate(); err == nil {
		t.Error("Validate(actions=nil) = nil; want error")
	}
}

func Test_CreateRoleRequest_Validate_RejectsBlankAction(t *testing.T) {
	req := validCreateRoleRequest()
	req.Actions = []string{ActionSearchCase, "  "}
	if err := req.Validate(); err == nil {
		t.Error("Validate(actions with a blank entry) = nil; want error")
	}
}

func Test_CreateRoleRequest_Validate_RejectsDuplicateAction(t *testing.T) {
	req := validCreateRoleRequest()
	req.Actions = []string{ActionSearchCase, ActionReadPII, ActionSearchCase}
	err := req.Validate()
	if err == nil {
		t.Fatal("Validate(actions with a duplicate) = nil; want error")
	}
	if !strings.Contains(err.Error(), ActionSearchCase) {
		t.Errorf("Validate() error = %q; want it to name the duplicated action %q", err, ActionSearchCase)
	}
}

func Test_CreateRoleRequest_Validate_AllowsEmptyDescription(t *testing.T) {
	req := validCreateRoleRequest()
	req.Description = ""
	if err := req.Validate(); err != nil {
		t.Errorf("Validate(description=\"\") = %v; want nil — the description is optional", err)
	}
}
