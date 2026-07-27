package types

import "regexp"

// CodePattern validates user-supplied natural-key codes (organizations, roles, …): lowercase,
// starts with a letter, then letters, digits, or underscores, up to 50 characters. It also
// guards codes that get interpolated into identifiers.
var CodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,49}$`)

func IsValidCode(code string) bool {
	return CodePattern.MatchString(code)
}
