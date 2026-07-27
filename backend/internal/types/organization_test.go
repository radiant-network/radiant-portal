package types

import "testing"

func Test_CreateOrganizationRequest_Validate(t *testing.T) {
	// Existing org codes are uppercase and may contain dashes (CHOP, LDM-CHUSJ); all valid.
	valid := []string{"CHOP", "LDM-CHUSJ", "chop", "org_1", "A"}
	for _, code := range valid {
		req := CreateOrganizationRequest{Code: code, Name: "X", CategoryCode: "healthcare_provider"}
		if err := req.Validate(); err != nil {
			t.Errorf("Validate(code=%q) = %v; want nil", code, err)
		}
	}

	invalid := []string{"", "9chop", "-chop", "_chop", "bad code", "bad.code", "chop/x"}
	for _, code := range invalid {
		req := CreateOrganizationRequest{Code: code, Name: "X", CategoryCode: "healthcare_provider"}
		if err := req.Validate(); err == nil {
			t.Errorf("Validate(code=%q) = nil; want error", code)
		}
	}
}
