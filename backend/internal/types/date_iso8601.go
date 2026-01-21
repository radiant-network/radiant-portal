package types

import (
	"fmt"
	"strings"
	"time"
)

const DateISO8601Format = "2006-01-02"

type DateISO8601 time.Time

// UnmarshalText parses a byte slice containing a date in ISO8601 format (YYYY-MM-DD)
// and sets the value of the DateISO8601 receiver. Returns an error if parsing fails.
func (d *DateISO8601) UnmarshalText(text []byte) error {
	t, err := time.Parse(DateISO8601Format, string(text))
	if err != nil {
		return err
	}

	*(*time.Time)(d) = t
	return nil
}

func (d *DateISO8601) UnmarshalJSON(b []byte) (err error) {
	s := strings.Trim(string(b), `"`)
	if s == "null" || s == "" {
		return fmt.Errorf("error parsing date")
	}
	parsedTime, err := time.Parse(DateISO8601Format, s)
	if err != nil {
		return fmt.Errorf("invalid date format, expected ISO8601 (e.g. 2020-01-31)")
	}
	*d = DateISO8601(parsedTime)
	return
}

func (d *DateISO8601) MarshalJSON() ([]byte, error) {
	if time.Time(*d).IsZero() {
		return []byte(`""`), nil
	}
	s := time.Time(*d).Format(DateISO8601Format)
	return fmt.Appendf(nil, `"%s"`, s), nil
}
