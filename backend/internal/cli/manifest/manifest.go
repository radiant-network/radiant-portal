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

// Parse reads a tab separated file with a header row. Column names are case insensitive, rows
// with an empty document_id are skipped.
func Parse(r io.Reader) ([]Entry, error) {
	cr := csv.NewReader(r)
	cr.Comma = '\t'
	cr.LazyQuotes = true
	cr.FieldsPerRecord = -1
	// TrimLeadingSpace stays off: a tab is whitespace to it, so it would swallow empty fields.

	header, err := cr.Read()
	if errors.Is(err, io.EOF) {
		return nil, errors.New("empty manifest")
	}
	if err != nil {
		return nil, fmt.Errorf("read manifest header: %w", err)
	}
	cols := map[string]int{}
	for i, h := range header {
		cols[strings.ToLower(strings.TrimSpace(h))] = i
	}
	for _, c := range RequiredColumns {
		if _, ok := cols[c]; !ok {
			return nil, fmt.Errorf("missing column %q", c)
		}
	}

	var entries []Entry
	for line := 2; ; line++ {
		rec, err := cr.Read()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read manifest line %d: %w", line, err)
		}
		get := func(col string) string {
			i, ok := cols[col]
			if !ok || i >= len(rec) {
				return ""
			}
			return strings.TrimSpace(rec[i])
		}
		rawID := get(ColumnDocumentID)
		if rawID == "" {
			continue
		}
		id, err := strconv.Atoi(rawID)
		if err != nil || id <= 0 {
			return nil, fmt.Errorf("line %d: invalid document_id %q", line, rawID)
		}
		tenant := get(ColumnTenant)
		if tenant == "" {
			return nil, fmt.Errorf("line %d: missing tenant", line)
		}
		size, err := units.ParseSize(get(ColumnSize))
		if err != nil {
			return nil, fmt.Errorf("line %d: %w", line, err)
		}
		entries = append(entries, Entry{Tenant: tenant, DocumentID: id, Name: get(ColumnName), Size: size})
	}
	if len(entries) == 0 {
		return nil, errors.New("manifest has no documents")
	}
	return entries, nil
}
