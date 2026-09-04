// Package manifest parses the TSV listing the documents to download.
package manifest

import (
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"

	"github.com/radiant-network/radiant-api/internal/cli/units"
)

const (
	ColumnTenant     = "tenant"
	ColumnDocumentID = "document_id"
	ColumnName       = "name"
	ColumnSize       = "size"
)

var RequiredColumns = []string{ColumnTenant, ColumnDocumentID}
var OptionalColumns = []string{ColumnName, ColumnSize}

type Entry struct {
	Tenant     string
	DocumentID int
	Name       string
	Size       int64 // 0 = unknown
}

// Parse reads a tab separated file with a header row. Columns are matched by name, case
// insensitive, in any order. Only an unusable file is an error (empty, required column missing,
// no valid row); anything odd on a row is reported as a warning and the row is skipped, or kept
// with an unknown size when only the size is bad.
func Parse(r io.Reader) (entries []Entry, warnings []string, err error) {
	cr := csv.NewReader(r)
	cr.Comma = '\t'
	cr.LazyQuotes = true
	cr.FieldsPerRecord = -1
	// TrimLeadingSpace stays off: a tab is whitespace to it, so it would swallow empty fields.

	header, err := cr.Read()
	if errors.Is(err, io.EOF) {
		return nil, nil, errors.New("empty manifest")
	}
	if err != nil {
		return nil, nil, fmt.Errorf("read manifest header: %w", err)
	}
	known := map[string]bool{}
	for _, c := range append(append([]string{}, RequiredColumns...), OptionalColumns...) {
		known[c] = true
	}
	cols := map[string]int{}
	for i, h := range header {
		name := strings.ToLower(strings.TrimSpace(h))
		if name == "" {
			continue
		}
		if !known[name] {
			warnings = append(warnings, fmt.Sprintf("column %q is ignored (known columns: %s)", strings.TrimSpace(h), strings.Join(append(append([]string{}, RequiredColumns...), OptionalColumns...), ", ")))
			continue
		}
		if _, dup := cols[name]; dup {
			warnings = append(warnings, fmt.Sprintf("column %q appears twice, the first one is used", name))
			continue
		}
		cols[name] = i
	}
	for _, c := range RequiredColumns {
		if _, ok := cols[c]; !ok {
			return nil, warnings, fmt.Errorf("missing column %q", c)
		}
	}

	seen := map[int]int{}
	for line := 2; ; line++ {
		rec, err := cr.Read()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return nil, warnings, fmt.Errorf("read manifest line %d: %w", line, err)
		}
		get := func(col string) string {
			i, ok := cols[col]
			if !ok || i >= len(rec) {
				return ""
			}
			return strings.TrimSpace(rec[i])
		}
		warn := func(format string, args ...any) {
			warnings = append(warnings, fmt.Sprintf("line %d: ", line)+fmt.Sprintf(format, args...))
		}
		rawID := get(ColumnDocumentID)
		if rawID == "" {
			if !blank(rec) {
				warn("no document_id, row skipped")
			}
			continue
		}
		id, err := strconv.Atoi(rawID)
		if err != nil || id <= 0 {
			warn("invalid document_id %q, row skipped", rawID)
			continue
		}
		tenant := get(ColumnTenant)
		if tenant == "" {
			warn("missing tenant for document %d, row skipped", id)
			continue
		}
		if first, dup := seen[id]; dup {
			warn("document %d already listed on line %d, row skipped", id, first)
			continue
		}
		seen[id] = line
		size, err := units.ParseSize(get(ColumnSize))
		if err != nil {
			warn("%v for document %d, size treated as unknown", err, id)
			size = 0
		}
		entries = append(entries, Entry{Tenant: tenant, DocumentID: id, Name: get(ColumnName), Size: size})
	}
	if len(entries) == 0 {
		return nil, warnings, errors.New("manifest has no valid document row")
	}
	return entries, warnings, nil
}

func blank(rec []string) bool {
	for _, c := range rec {
		if strings.TrimSpace(c) != "" {
			return false
		}
	}
	return true
}
