package utils

import "time"

// NilIfEmpty returns nil for an empty string, otherwise a pointer to the value.
// Used to persist optional FK columns as NULL rather than "" (which would violate
// the foreign key).
func NilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func IntPtr(i int) *int {
	return &i
}

func TimePtr(t time.Time) *time.Time {
	return &t
}
