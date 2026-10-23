package report

import (
	"regexp"
	"strconv"
	"strings"
	"time"
)

var fileNameUnsafe = regexp.MustCompile(`[^A-Za-z0-9._-]+`)

// FileName is the QLIN list-report rule, <MRN>_<case id>_<UTC timestamp>.xlsx; an empty or
// masked MRN drops its part.
func FileName(mrn string, caseId int, now time.Time) string {
	parts := []string{fileNameUnsafe.ReplaceAllString(mrn, ""), strconv.Itoa(caseId), now.UTC().Format("20060102T150405Z")}
	kept := parts[:0]
	for _, p := range parts {
		if p != "" {
			kept = append(kept, p)
		}
	}
	return strings.Join(kept, "_") + ".xlsx"
}
