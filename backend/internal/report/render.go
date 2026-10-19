package report

import (
	"bytes"
	"errors"
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/xuri/excelize/v2"
)

const sheetNameMax = 31

var sheetNameIllegal = strings.NewReplacer(`\`, "_", "/", "_", "?", "_", "*", "_", "[", "_", "]", "_", ":", "_")

// rowContext is what a cell template sees: the report, the transcript of the row (zero on the
// header row) and the gene of that transcript when the report knows it.
type rowContext struct {
	types.TranscriptReport
	Transcript types.ReportTranscript
	Gene       *types.ReportGene
}

func newRowContext(report types.TranscriptReport, transcript types.ReportTranscript) rowContext {
	ctx := rowContext{TranscriptReport: report, Transcript: transcript}
	for i := range report.Genes {
		if transcript.Symbol != "" && report.Genes[i].Symbol == transcript.Symbol {
			ctx.Gene = &report.Genes[i]
			break
		}
	}
	return ctx
}

// Render fills one copy of the template sheet per report, the placeholder row repeated once per
// transcript, and returns the workbook bytes.
func (t *Template) Render(reports []types.TranscriptReport) ([]byte, error) {
	if len(reports) == 0 {
		return nil, errors.New("no report to render")
	}
	f, err := excelize.OpenReader(bytes.NewReader(t.raw))
	if err != nil {
		return nil, fmt.Errorf("open template %s: %w", t.File, err)
	}
	defer func() { _ = f.Close() }()
	source, err := f.GetSheetIndex(t.sheet)
	if err != nil {
		return nil, fmt.Errorf("template sheet %s: %w", t.File, err)
	}
	names := newSheetNames()
	for _, report := range reports {
		name, err := t.sheetName(report, names)
		if err != nil {
			return nil, err
		}
		index, err := f.NewSheet(name)
		if err != nil {
			return nil, fmt.Errorf("add sheet %q: %w", name, err)
		}
		if err := f.CopySheet(source, index); err != nil {
			return nil, fmt.Errorf("copy template sheet to %q: %w", name, err)
		}
		if err := t.fillSheet(f, name, report); err != nil {
			return nil, err
		}
	}
	if err := f.DeleteSheet(t.sheet); err != nil {
		return nil, fmt.Errorf("drop template sheet: %w", err)
	}
	f.SetActiveSheet(0)
	buf, err := f.WriteToBuffer()
	if err != nil {
		return nil, fmt.Errorf("write workbook: %w", err)
	}
	return buf.Bytes(), nil
}

func (t *Template) sheetName(report types.TranscriptReport, names *sheetNames) (string, error) {
	var buf bytes.Buffer
	if err := t.name.Execute(&buf, newRowContext(report, types.ReportTranscript{})); err != nil {
		return "", fmt.Errorf("render sheet name: %w", err)
	}
	name := truncate(sheetNameIllegal.Replace(strings.TrimSpace(buf.String())), sheetNameMax)
	if name == "" {
		name = "Report"
	}
	return names.claim(name), nil
}

// sheetNames keeps workbook sheet names unique: a repeated name gets " (n)", n counting its
// previous occurrences.
type sheetNames struct {
	used   map[string]bool
	counts map[string]int
}

func newSheetNames() *sheetNames {
	return &sheetNames{used: map[string]bool{}, counts: map[string]int{}}
}

func (s *sheetNames) claim(base string) string {
	n := s.counts[base]
	s.counts[base]++
	name := base
	for ; s.used[name]; n++ {
		suffix := fmt.Sprintf(" (%d)", n)
		name = truncate(base, sheetNameMax-len(suffix)) + suffix
	}
	s.used[name] = true
	return name
}

func truncate(s string, max int) string {
	runes := []rune(s)
	if len(runes) <= max {
		return s
	}
	return string(runes[:max])
}

func (t *Template) fillSheet(f *excelize.File, sheet string, report types.TranscriptReport) error {
	if err := fillRow(f, sheet, headerRow, t.header, newRowContext(report, types.ReportTranscript{})); err != nil {
		return err
	}
	if len(report.Transcripts) == 0 {
		if err := f.RemoveRow(sheet, repeatRow); err != nil {
			return fmt.Errorf("%s: remove placeholder row: %w", sheet, err)
		}
		return nil
	}
	for i := 1; i < len(report.Transcripts); i++ {
		if err := f.DuplicateRowTo(sheet, repeatRow, repeatRow+i); err != nil {
			return fmt.Errorf("%s: duplicate placeholder row: %w", sheet, err)
		}
	}
	for i, transcript := range report.Transcripts {
		if err := fillRow(f, sheet, repeatRow+i, t.repeat, newRowContext(report, transcript)); err != nil {
			return err
		}
	}
	return nil
}

func fillRow(f *excelize.File, sheet string, row int, cells []cellTemplate, ctx rowContext) error {
	for _, c := range cells {
		cell, err := excelize.CoordinatesToCellName(c.col, row)
		if err != nil {
			return fmt.Errorf("cell name: %w", err)
		}
		var buf bytes.Buffer
		if err := c.tmpl.Execute(&buf, ctx); err != nil {
			return fmt.Errorf("render %s!%s: %w", sheet, cell, err)
		}
		if err := writeCell(f, sheet, cell, buf.String()); err != nil {
			return fmt.Errorf("write %s!%s: %w", sheet, cell, err)
		}
	}
	return nil
}

// writeCell keeps the template cell style; markup runs get that style's font with bold or italic
// added (a bold header cell stays bold around an italic run), a cell without markup stays a plain string.
func writeCell(f *excelize.File, sheet, cell, text string) error {
	runs := parseMarkup(text)
	styled := false
	for _, r := range runs {
		styled = styled || r.Bold || r.Italic
	}
	if !styled {
		return f.SetCellStr(sheet, cell, text)
	}
	styleID, err := f.GetCellStyle(sheet, cell)
	if err != nil {
		return fmt.Errorf("read style: %w", err)
	}
	style, err := f.GetStyle(styleID)
	if err != nil {
		return fmt.Errorf("read style %d: %w", styleID, err)
	}
	base := excelize.Font{}
	if style != nil && style.Font != nil {
		base = *style.Font
	}
	rich := make([]excelize.RichTextRun, len(runs))
	for i, r := range runs {
		font := base
		font.Bold = base.Bold || r.Bold
		font.Italic = base.Italic || r.Italic
		rich[i] = excelize.RichTextRun{Font: &font, Text: r.Text}
	}
	return f.SetCellRichText(sheet, cell, rich)
}
