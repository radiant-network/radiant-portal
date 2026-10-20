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
	"sync"
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

// samples holds the dry-run input per report kind and doubles as the list of known kinds.
var samples = map[Kind]func() types.TranscriptReport{
	KindGermline: sampleReport,
	KindSomatic:  sampleSomaticReport,
}

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
	labels labelSet
	sheet  string
	name   *template.Template
	header []cellTemplate
	repeat []cellTemplate
}

// Templates holds the parsed templates by tenant and kind. The zero value / nil knows no tenant.
type Templates struct {
	byKey   map[string]*Template
	skipped int
	misses  map[string]*sync.Map
}

func key(tenant string, kind Kind) string { return tenant + "/" + string(kind) }

// LoadTemplates parses every transcripts_<kind>_<tenant>.xlsx in dir. It never fails: a broken
// file is logged and skipped so a bad template can't keep the API from booting; a report on that
// tenant fails with ErrTemplateMissing instead.
func LoadTemplates(dir string) *Templates {
	t := &Templates{byKey: map[string]*Template{}, misses: map[string]*sync.Map{}}
	if dir == "" {
		slog.Warn("report templates disabled", slog.String("reason", TemplateDirEnv+" unset"))
		return t
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		slog.Warn("report template dir unreadable", slog.String("dir", dir), slog.Any("error", err))
		return t
	}
	defaults, err := defaultLabels()
	if err != nil {
		slog.Error("report templates disabled", slog.Any("error", err))
		return t
	}
	sets := map[string]labelSet{}
	setErr := map[string]error{}
	for _, e := range entries {
		// Hidden entries are mount plumbing (Kubernetes ConfigMap volumes expose a ..data symlink), not a stray file.
		if e.IsDir() || strings.HasPrefix(e.Name(), ".") {
			continue
		}
		if _, isLabels := labelsFromFilename(e.Name()); isLabels {
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
		if _, seen := sets[tenant]; !seen && setErr[tenant] == nil {
			sets[tenant], setErr[tenant] = t.resolveLabels(dir, tenant, defaults)
		}
		if setErr[tenant] != nil {
			slog.Warn("report template skipped", slog.String("file", e.Name()), slog.Any("error", setErr[tenant]))
			t.skipped++
			continue
		}
		tmpl, err := parseTemplate(filepath.Join(dir, e.Name()), kind, tenant, sets[tenant])
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

// resolveLabels binds a tenant to its label file over the embedded defaults. A missing or incomplete
// file still serves (defaults fill the holes) but counts as skipped so GET /status shows the warning.
func (t *Templates) resolveLabels(dir, tenant string, defaults labels) (labelSet, error) {
	file, missing, err := loadLabelFile(dir, tenant)
	if err != nil {
		return labelSet{}, fmt.Errorf("labels %s: %w", labelFileName(tenant), err)
	}
	switch {
	case file == nil && tenant != types.DefaultTenantCode:
		slog.Warn("report labels missing, defaults used", slog.String("tenant", tenant), slog.String("file", labelFileName(tenant)))
		t.skipped++
	case len(missing) > 0:
		slog.Warn("report labels incomplete, defaults used", slog.String("tenant", tenant), slog.Any("keys", missing))
		t.skipped++
	}
	t.misses[tenant] = &sync.Map{}
	return labelSet{name: tenant, tenant: file, defaults: defaults, misses: t.misses[tenant]}, nil
}

func labelsFromFilename(name string) (string, bool) {
	if !strings.HasPrefix(name, templatePrefix) || !strings.HasSuffix(name, labelExt) {
		return "", false
	}
	tenant := strings.TrimSuffix(strings.TrimPrefix(name, templatePrefix), labelExt)
	return tenant, tenant != ""
}

func templateFromFilename(name string) (Kind, string, bool) {
	if !strings.HasPrefix(name, templatePrefix) || !strings.HasSuffix(name, templateExt) {
		return "", "", false
	}
	kind, tenant, found := strings.Cut(strings.TrimSuffix(strings.TrimPrefix(name, templatePrefix), templateExt), "_")
	if !found || tenant == "" || samples[Kind(kind)] == nil {
		return "", "", false
	}
	return Kind(kind), tenant, true
}

func parseTemplate(path string, kind Kind, tenant string, l labelSet) (*Template, error) {
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
	t := &Template{File: filepath.Base(path), Tenant: tenant, Kind: kind, raw: raw, labels: l, sheet: sheet}
	funcs := l.funcs()
	if t.name, err = parseCell("sheet name", sheet, funcs); err != nil {
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
	if t.header, err = parseRow(f, sheet, rows, headerRow, funcs); err != nil {
		return nil, err
	}
	if t.repeat, err = parseRow(f, sheet, rows, repeatRow, funcs); err != nil {
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

func parseRow(f *excelize.File, sheet string, rows [][]string, row int, funcs template.FuncMap) ([]cellTemplate, error) {
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
		tmpl, err := parseCell(cell, text, funcs)
		if err != nil {
			return nil, err
		}
		cells = append(cells, cellTemplate{col: col, tmpl: tmpl})
	}
	return cells, nil
}

func parseCell(name, text string, funcs template.FuncMap) (*template.Template, error) {
	tmpl, err := template.New(name).Funcs(funcs).Parse(text)
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
	}
	// a data value no label file knows, seen at render: the boot was fine, the reports are not
	for _, misses := range t.misses {
		if hasMisses(misses) {
			return types.TemplateStatusWarning
		}
	}
	return types.TemplateStatusOK
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

// Render fills the template of that tenant and kind; ErrTemplateMissing when none loaded.
func (t *Templates) Render(tenant string, kind Kind, reports []types.TranscriptReport) ([]byte, error) {
	tmpl, err := t.For(tenant, kind)
	if err != nil {
		return nil, err
	}
	return tmpl.Render(reports)
}
