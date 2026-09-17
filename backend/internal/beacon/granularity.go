package beacon

import "fmt"

// Granularity is the amount of detail a Beacon response carries, from the spec's three tiers.
type Granularity string

const (
	GranularityBoolean Granularity = "boolean"
	GranularityCount   Granularity = "count"
	GranularityRecord  Granularity = "record"
)

// DefaultGranularity applies when a request names none. The framework's own default is boolean.
const DefaultGranularity = GranularityBoolean

func ParseGranularity(s string) (Granularity, error) {
	switch Granularity(s) {
	case GranularityBoolean, GranularityCount, GranularityRecord:
		return Granularity(s), nil
	case "":
		return DefaultGranularity, nil
	default:
		return "", fmt.Errorf("unknown requestedGranularity %q (expected boolean, count or record)", s)
	}
}

func (g Granularity) rank() int {
	switch g {
	case GranularityRecord:
		return 2
	case GranularityCount:
		return 1
	default:
		return 0
	}
}

// Clamp lowers the requested granularity to the ceiling the caller is entitled to. A request is
// never refused for asking too much; it is answered at the most detailed level allowed.
func Clamp(requested, ceiling Granularity) Granularity {
	if requested.rank() > ceiling.rank() {
		return ceiling
	}
	return requested
}
