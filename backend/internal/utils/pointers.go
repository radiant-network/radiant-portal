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
