package report

import (
	"bytes"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/xuri/excelize/v2"
)

var ErrTemplateMissing = errors.New("report template missing for tenant")

const (
	TemplateDirEnv = "REPORT_TEMPLATE_DIR"

	templatePrefix = "transcripts_"
	templateExt    = ".xlsx"
	headerRow      = 1
	repeatRow      = 2
)

type Kind string

const (
	KindGermline Kind = "germline"
	KindSomatic  Kind = "somatic"
)

// samples holds the dry-run input per report kind; a kind without one has no engine yet and its
// files are ignored at load, not reported as broken.
var samples = map[Kind]func() types.TranscriptReport{
	KindGermline: sampleReport,
}

var knownKinds = map[Kind]bool{KindGermline: true, KindSomatic: true}

type cellTemplate struct {
	col  int
	tmpl *template.Template
}

// Template is one parsed xlsx: the raw file is reopened at each render, the parsed cells drive
// what gets written into the copy.
type Template struct {
	File   string
	Tenant string
	Kind   Kind
	raw    []byte
	sheet  string
	name   *template.Template
	header []cellTemplate
	repeat []cellTemplate
}

// Templates holds the parsed templates by tenant and kind. The zero value / nil knows no tenant.
type Templates struct {
	byKey   map[string]*Template
	skipped int
}

func key(tenant string, kind Kind) string { return tenant + "/" + string(kind) }

// LoadTemplates parses every transcripts_<kind>_<tenant>.xlsx in dir. It never fails: a broken
// file is logged and skipped so a bad template can't keep the API from booting; a report on that
// tenant fails with ErrTemplateMissing instead.
func LoadTemplates(dir string) *Templates {
	t := &Templates{byKey: map[string]*Template{}}
	if dir == "" {
		slog.Warn("report templates disabled", slog.String("reason", TemplateDirEnv+" unset"))
		return t
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		slog.Warn("report template dir unreadable", slog.String("dir", dir), slog.Any("error", err))
		return t
	}
	for _, e := range entries {
		// Hidden entries are mount plumbing (Kubernetes ConfigMap volumes expose a ..data symlink), not a stray file.
		if e.IsDir() || strings.HasPrefix(e.Name(), ".") {
			continue
		}
		kind, tenant, ok := templateFromFilename(e.Name())
		if !ok {
			slog.Warn("report template dir holds an unexpected file, ignored", slog.String("file", e.Name()))
			t.skipped++
			continue
		}
		if samples[kind] == nil {
			slog.Info("report template kind not supported yet, ignored", slog.String("file", e.Name()))
			continue
		}
		tmpl, err := parseTemplate(filepath.Join(dir, e.Name()), kind, tenant)
		if err != nil {
			slog.Warn("report template skipped", slog.String("file", e.Name()), slog.Any("error", err))
			t.skipped++
			continue
		}
		t.byKey[key(tenant, kind)] = tmpl
	}
	if len(t.byKey) == 0 {
		slog.Warn("no report template loaded", slog.String("dir", dir))
		return t
	}
	slog.Info("report templates loaded", slog.String("dir", dir), slog.Int("count", len(t.byKey)), slog.Any("files", t.Files()))
	return t
}

func templateFromFilename(name string) (Kind, string, bool) {
	if !strings.HasPrefix(name, templatePrefix) || !strings.HasSuffix(name, templateExt) {
		return "", "", false
	}
	kind, tenant, found := strings.Cut(strings.TrimSuffix(strings.TrimPrefix(name, templatePrefix), templateExt), "_")
	if !found || tenant == "" || !knownKinds[Kind(kind)] {
		return "", "", false
	}
	return Kind(kind), tenant, true
}

func parseTemplate(path string, kind Kind, tenant string) (*Template, error) {
	raw, err := os.ReadFile(path) // #nosec G304 -- path comes from the operator-controlled template dir
	if err != nil {
		return nil, fmt.Errorf("read template: %w", err)
	}
	f, err := excelize.OpenReader(bytes.NewReader(raw))
	if err != nil {
		return nil, fmt.Errorf("open template: %w", err)
	}
	defer func() { _ = f.Close() }()

	sheets := f.GetSheetList()
	if len(sheets) != 1 {
		return nil, fmt.Errorf("template must hold one sheet, found %d", len(sheets))
	}
	sheet := sheets[0]
	t := &Template{File: filepath.Base(path), Tenant: tenant, Kind: kind, raw: raw, sheet: sheet}
	if t.name, err = parseCell("sheet name", sheet); err != nil {
		return nil, err
	}
	if err := rejectLayout(f, sheet); err != nil {
		return nil, err
	}
	rows, err := f.GetRows(sheet)
	if err != nil {
		return nil, fmt.Errorf("read rows: %w", err)
	}
	for r := repeatRow; r < len(rows); r++ {
		if strings.Join(rows[r], "") != "" {
			return nil, fmt.Errorf("row %d: only the header row and the placeholder row are allowed", r+1)
		}
	}
	if t.header, err = parseRow(f, sheet, rows, headerRow); err != nil {
		return nil, err
	}
	if t.repeat, err = parseRow(f, sheet, rows, repeatRow); err != nil {
		return nil, err
	}
	if len(t.repeat) == 0 {
		return nil, fmt.Errorf("row %d: placeholder row is empty", repeatRow)
	}
	// The zero report still carries one (zero) transcript so the placeholder row renders its else branches.
	zero := types.TranscriptReport{Transcripts: []types.ReportTranscript{{}}}
	for _, sample := range []types.TranscriptReport{samples[kind](), zero} {
		if _, err := t.Render([]types.TranscriptReport{sample}); err != nil {
			return nil, fmt.Errorf("dry run: %w", err)
		}
	}
	return t, nil
}

// rejectLayout refuses what the row duplication cannot reproduce faithfully.
func rejectLayout(f *excelize.File, sheet string) error {
	merged, err := f.GetMergeCells(sheet)
	if err != nil {
		return fmt.Errorf("read merged cells: %w", err)
	}
	if len(merged) > 0 {
		return fmt.Errorf("merged cells are not supported (%s)", merged[0].GetStartAxis()+":"+merged[0].GetEndAxis())
	}
	formats, err := f.GetConditionalFormats(sheet)
	if err != nil {
		return fmt.Errorf("read conditional formats: %w", err)
	}
	if len(formats) > 0 {
		return errors.New("conditional formatting is not supported")
	}
	return nil
}

func parseRow(f *excelize.File, sheet string, rows [][]string, row int) ([]cellTemplate, error) {
	if row > len(rows) {
		return nil, nil
	}
	var cells []cellTemplate
	for i, text := range rows[row-1] {
		col := i + 1
		cell, err := excelize.CoordinatesToCellName(col, row)
		if err != nil {
			return nil, fmt.Errorf("cell name: %w", err)
		}
		formula, err := f.GetCellFormula(sheet, cell)
		if err != nil {
			return nil, fmt.Errorf("read %s: %w", cell, err)
		}
		if formula != "" {
			return nil, fmt.Errorf("%s: formulas are not supported", cell)
		}
		if text == "" {
			continue
		}
		tmpl, err := parseCell(cell, text)
		if err != nil {
			return nil, err
		}
		cells = append(cells, cellTemplate{col: col, tmpl: tmpl})
	}
	return cells, nil
}

func parseCell(name, text string) (*template.Template, error) {
	tmpl, err := template.New(name).Funcs(helpers).Parse(text)
	if err != nil {
		return nil, fmt.Errorf("parse %s: %w", name, err)
	}
	return tmpl, nil
}

func (t *Templates) For(tenant string, kind Kind) (*Template, error) {
	if t != nil {
		if tmpl, ok := t.byKey[key(tenant, kind)]; ok {
			return tmpl, nil
		}
	}
	return nil, fmt.Errorf("%w %q (%s)", ErrTemplateMissing, tenant, kind)
}

func (t *Templates) Status() string {
	switch {
	case t == nil || len(t.byKey) == 0:
		return types.TemplateStatusError
	case t.skipped > 0:
		return types.TemplateStatusWarning
	default:
		return types.TemplateStatusOK
	}
}

func (t *Templates) Files() []string {
	if t == nil {
		return nil
	}
	files := make([]string, 0, len(t.byKey))
	for _, tmpl := range t.byKey {
		files = append(files, tmpl.File)
	}
	sort.Strings(files)
	return files
}
