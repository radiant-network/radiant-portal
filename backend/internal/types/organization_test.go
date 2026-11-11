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

func Test_SplitNotificationEmails_NilAndBlank_Empty(t *testing.T) {
	if got := SplitNotificationEmails(nil); got == nil || len(got) != 0 {
		t.Errorf("SplitNotificationEmails(nil) = %#v; want empty non-nil", got)
	}
	blank := " , "
	if got := SplitNotificationEmails(&blank); len(got) != 0 {
		t.Errorf("SplitNotificationEmails(%q) = %v; want empty", blank, got)
	}
}

func Test_SplitNotificationEmails_TrimsAndKeepsOrder(t *testing.T) {
	column := "a@lab.invalid, b@lab.invalid ,c@lab.invalid"
	got := SplitNotificationEmails(&column)
	want := []string{"a@lab.invalid", "b@lab.invalid", "c@lab.invalid"}
	if len(got) != len(want) {
		t.Fatalf("SplitNotificationEmails = %v; want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Errorf("SplitNotificationEmails[%d] = %q; want %q", i, got[i], want[i])
		}
	}
}

func Test_NotificationEmailsColumn_BlankIsNull(t *testing.T) {
	for _, blank := range []string{"", "  "} {
		if got := NotificationEmailsColumn(blank); got != nil {
			t.Errorf("NotificationEmailsColumn(%q) = %q; want nil", blank, *got)
		}
	}
}

func Test_NotificationEmailsColumn_KeepsValueAsEntered(t *testing.T) {
	got := NotificationEmailsColumn("a@lab.invalid, b@lab.invalid")
	if got == nil || *got != "a@lab.invalid, b@lab.invalid" {
		t.Errorf("NotificationEmailsColumn = %v; want the input unchanged", got)
	}
}

func Test_CreateOrganizationRequest_Validate_NotificationEmails(t *testing.T) {
	req := CreateOrganizationRequest{Code: "LDM-X", Name: "X", CategoryCode: "diagnostic_laboratory"}
	for _, ok := range []string{"", "a@lab.invalid", "a@lab.invalid,b@lab.invalid", " a@lab.invalid , b@lab.invalid "} {
		req.NotificationEmails = ok
		if err := req.Validate(); err != nil {
			t.Errorf("Validate(%q) = %v; want nil", ok, err)
		}
	}
	for _, bad := range []string{"not-an-email", "Lab <a@lab.invalid>", "a@lab.invalid;b@lab.invalid", "ok@lab.invalid,nope"} {
		req.NotificationEmails = bad
		if err := req.Validate(); err == nil {
			t.Errorf("Validate(%q) = nil; want error", bad)
		}
	}
}

func Test_UpdateOrganizationRequest_Validate_NotificationEmails(t *testing.T) {
	if err := (UpdateOrganizationRequest{Name: "X"}).Validate(); err != nil {
		t.Errorf("Validate(blank) = %v; want nil", err)
	}
	if err := (UpdateOrganizationRequest{Name: "X", NotificationEmails: "a@lab.invalid,b@lab.invalid"}).Validate(); err != nil {
		t.Errorf("Validate(two emails) = %v; want nil", err)
	}
	if err := (UpdateOrganizationRequest{Name: "X", NotificationEmails: "bad"}).Validate(); err == nil {
		t.Error("Validate(invalid email) = nil; want error")
	}
}
