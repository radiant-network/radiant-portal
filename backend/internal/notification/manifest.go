package notification

import (
	"encoding/csv"
	"fmt"
	"io"
	"sort"
	"strconv"
	"strings"

	"github.com/radiant-network/radiant-api/internal/cli/manifest"
	"github.com/radiant-network/radiant-api/internal/types"
)

const ManifestContentType = "text/tab-separated-values"

// ManifestRow is one line of the lab manifest, one per document.
type ManifestRow struct {
	Tenant            string
	DocumentID        int
	Name              string
	Size              int64
	DataType          string
	Format            string
	SubmitterSampleID string
	PatientID         string
	CaseID            string
}

// manifestRows folds the document rows (one per sample a document was produced from) into one
// manifest line per document, joining the distinct sample / patient / case ids with ";". The CLI
// skips a repeated document_id with a warning, so the fold is what keeps the download clean.
func manifestRows(tenant string, docs []types.CaseGroupDocumentRow) []ManifestRow {
	byID := map[int]*ManifestRow{}
	samples := map[int]map[string]bool{}
	patients := map[int]map[string]bool{}
	cases := map[int]map[string]bool{}
	order := []int{}
	for _, d := range docs {
		if _, seen := byID[d.DocumentID]; !seen {
			byID[d.DocumentID] = &ManifestRow{Tenant: tenant, DocumentID: d.DocumentID, Name: d.Name, Size: d.Size, DataType: d.DataTypeCode, Format: d.FormatCode}
			samples[d.DocumentID], patients[d.DocumentID], cases[d.DocumentID] = map[string]bool{}, map[string]bool{}, map[string]bool{}
			order = append(order, d.DocumentID)
		}
		if d.SubmitterSampleID != "" {
			samples[d.DocumentID][d.SubmitterSampleID] = true
		}
		if d.PatientID != 0 {
			patients[d.DocumentID][strconv.Itoa(d.PatientID)] = true
		}
		cases[d.DocumentID][strconv.Itoa(d.CaseID)] = true
	}
	rows := make([]ManifestRow, 0, len(order))
	for _, id := range order {
		row := byID[id]
		row.SubmitterSampleID = joinSorted(samples[id])
		row.PatientID = joinSorted(patients[id])
		row.CaseID = joinSorted(cases[id])
		rows = append(rows, *row)
	}
	return rows
}

func joinSorted(set map[string]bool) string {
	vals := make([]string, 0, len(set))
	for v := range set {
		vals = append(vals, v)
	}
	sort.Strings(vals)
	return strings.Join(vals, ";")
}

// WriteManifest writes the TSV the CLI consumes. The header is the CLI's own column list, so the
// two cannot drift apart silently (pinned by the contract test).
func WriteManifest(w io.Writer, rows []ManifestRow) error {
	cw := csv.NewWriter(w)
	cw.Comma = '\t'
	if err := cw.Write(manifest.KnownColumns()); err != nil {
		return fmt.Errorf("write manifest header: %w", err)
	}
	for _, r := range rows {
		record := []string{r.Tenant, strconv.Itoa(r.DocumentID), r.Name, strconv.FormatInt(r.Size, 10), r.DataType, r.Format, r.SubmitterSampleID, r.PatientID, r.CaseID}
		if err := cw.Write(record); err != nil {
			return fmt.Errorf("write manifest row for document %d: %w", r.DocumentID, err)
		}
	}
	cw.Flush()
	if err := cw.Error(); err != nil {
		return fmt.Errorf("flush manifest: %w", err)
	}
	return nil
}
