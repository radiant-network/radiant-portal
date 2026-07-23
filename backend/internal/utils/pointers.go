package utils

// NilIfEmpty returns nil for an empty string, otherwise a pointer to the value.
// Used to persist optional FK columns as NULL rather than "" (which would violate
// the foreign key).
func NilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// IntPtr returns a pointer to i. Useful for populating nullable *int fields (e.g. a subject
// FK that must be nil for one type of subject and set for the other) from an int literal or
// variable, which Go doesn't allow taking the address of directly.
func IntPtr(i int) *int {
	return &i
}
