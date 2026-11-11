package types

import (
	"encoding/json"
	"strings"
)

type TrimmedString string

func (t *TrimmedString) UnmarshalJSON(b []byte) error {
	// Convert JSON bytes -> Go string (including quotes)
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	// Trim the string
	*t = TrimmedString(strings.TrimSpace(s))
	return nil
}

func (t TrimmedString) MarshalJSON() ([]byte, error) {
	s := strings.TrimSpace(string(t))
	return json.Marshal(s)
}

func (t TrimmedString) String() string {
	return string(t)
}
