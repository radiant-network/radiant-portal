package types

import "testing"

func Test_IsValidCode(t *testing.T) {
	valid := []string{"chop", "ldm_chusj", "a", "org1", "a_1_b"}
	for _, c := range valid {
		if !IsValidCode(c) {
			t.Errorf("IsValidCode(%q) = false; want true", c)
		}
	}

	invalid := []string{"", "1chop", "CHOP", "ldm-chusj", "chop ", "_org", "éco"}
	for _, c := range invalid {
		if IsValidCode(c) {
			t.Errorf("IsValidCode(%q) = true; want false", c)
		}
	}
}
