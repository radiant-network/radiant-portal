package types

import (
	"errors"
	"strings"
	"time"
)

// DateRFC3339 is a custom type that wraps time.Time to provide more descriptive
// error messages when unmarshaling dates in RFC3339 format from JSON.
// This wrapper exists solely to customize the error message shown to users
// when date parsing fails, making it clearer what format is expected.
type DateRFC3339 time.Time

// MarshalJSON converts a DateRFC3339 object to a JSON-encoded string in RFC3339 format.
//
// Returns:
// - A byte slice containing the JSON-encoded date string.
// - An error if the marshaling process fails.
func (d *DateRFC3339) MarshalJSON() ([]byte, error) {
	return time.Time(*d).MarshalJSON()
}

// UnmarshalJSON parses a JSON-encoded string into a DateRFC3339 object.
// It expects the date string to be in RFC3339 format (e.g., "2020-01-02T15:04:05Z").
// This method wraps the standard time.Parse to provide a more user-friendly error message.
//
// Parameters:
// - b: The JSON-encoded byte slice containing the date string.
//
// Returns:
// - An error if the date string is empty or not in the expected RFC3339 format.
func (d *DateRFC3339) UnmarshalJSON(b []byte) error {
	s := strings.Trim(string(b), `"`)
	if s == "" {
		return errors.New("date cannot be empty")
	}

	t, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return errors.New("invalid date format, expected RFC3339 (e.g. 2020-01-02T15:04:05Z)")
	}

	*d = DateRFC3339(t)
	return nil
}

// UnmarshalText parses a text-encoded string into a DateRFC3339 object.
// It expects the date string to be in RFC3339 format.
//
// Parameters:
// - text: The byte slice containing the date string.
//
// Returns:
// - An error if the date string is not in the expected RFC3339 format.
func (d *DateRFC3339) UnmarshalText(text []byte) error {
	t, err := time.Parse(time.RFC3339, string(text))
	if err != nil {
		return err
	}

	*(*time.Time)(d) = t
	return nil
}

// String returns the string representation of the date in RFC3339 format.
// This satisfies the fmt.Stringer interface. Necessary when used in fmt.Printf and similar functions.
func (d DateRFC3339) String() string {
	return time.Time(d).String()
}
