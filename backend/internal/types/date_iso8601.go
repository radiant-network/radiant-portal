package types

import (
	"fmt"
	"strings"
	"time"
)

const DateISO8601Format = "2006-01-02"

type DateISO8601 time.Time

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
