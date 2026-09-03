// Package units parses and formats byte sizes for manifests and console output.
package units

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

var sizeRe = regexp.MustCompile(`^(\d+(?:\.\d+)?)\s*([A-Za-z]*)$`)

var multipliers = map[string]float64{
	"":    1,
	"B":   1,
	"KB":  1e3,
	"MB":  1e6,
	"GB":  1e9,
	"TB":  1e12,
	"PB":  1e15,
	"KIB": 1 << 10,
	"MIB": 1 << 20,
	"GIB": 1 << 30,
	"TIB": 1 << 40,
	"PIB": 1 << 50,
}

// ParseSize accepts "123", "123 B", "1.5 GB", "512 MiB". Empty input is 0 (unknown size).
func ParseSize(s string) (int64, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return 0, nil
	}
	m := sizeRe.FindStringSubmatch(s)
	if m == nil {
		return 0, fmt.Errorf("invalid size %q", s)
	}
	mult, ok := multipliers[strings.ToUpper(m[2])]
	if !ok {
		return 0, fmt.Errorf("invalid size unit %q", m[2])
	}
	value, err := strconv.ParseFloat(m[1], 64)
	if err != nil {
		return 0, fmt.Errorf("invalid size %q: %w", s, err)
	}
	if value < 0 {
		return 0, errors.New("negative size")
	}
	return int64(value * mult), nil
}

// FormatBytes renders a human readable decimal size ("1.5 GB"), matching the manifest convention.
func FormatBytes(n int64) string {
	const unit = 1000
	if n < unit {
		return fmt.Sprintf("%d B", n)
	}
	div, exp := int64(unit), 0
	for m := n / unit; m >= unit; m /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(n)/float64(div), "KMGTPE"[exp])
}
