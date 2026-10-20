package report

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/xuri/excelize/v2"
)

// fixtureCells is the minimal template: sheet "{{ .Variant.Hgvsg }}", two header cells, two
// placeholder cells. Tests override cells or mutate the workbook before it is saved.
var fixtureCells = map[string]string{
	"A1": "Variation ({{ .Case.GenomeBuild }})",
	"B1": "Interpretation",
	"A2": `{{ lines .Variant.Hgvsg (printf "Gene: **%s**" .Transcript.Symbol) }}`,
	"B2": "{{ with classification .Transcript.Interpretation }}**{{ . }}**{{ else }}ND{{ end }}",
}

func writeFixture(t *testing.T, dir, name string, cells map[string]string, mutate func(f *excelize.File, sheet string)) string {
	t.Helper()
	f := excelize.NewFile()
	sheet := "{{ .Variant.Hgvsg }}"
	require.NoError(t, f.SetSheetName("Sheet1", sheet))
	style, err := f.NewStyle(&excelize.Style{Font: &excelize.Font{Family: "Arial", Size: 9}, Alignment: &excelize.Alignment{WrapText: true, Vertical: "top"}})
	require.NoError(t, err)
	for cell, text := range cells {
		require.NoError(t, f.SetCellStr(sheet, cell, text))
		require.NoError(t, f.SetCellStyle(sheet, cell, cell, style))
	}
	require.NoError(t, f.SetRowHeight(sheet, 2, 150))
	require.NoError(t, f.AutoFilter(sheet, "A1:B1", nil))
	if mutate != nil {
		mutate(f, sheet)
	}
	path := filepath.Join(dir, name)
	require.NoError(t, f.SaveAs(path))
	return path
}

func Test_LoadTemplates_TenantWithoutLabels_DefaultsAndWarning(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", withCell("B2", "{{ zygosity .Occurrence .Case.IsProband }}"), nil)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_qlin.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusWarning, templates.Status())
	tmpl, err := templates.For("qlin", KindGermline)
	require.NoError(t, err)
	f := openRendered(t, tmpl, sampleReport())
	value, err := f.GetCellValue("chr1_g.100A>T", "B2")
	require.NoError(t, err)
	assert.Equal(t, "Heterozygous\n(Mother het, Father ref)", value)
}

func Test_LoadTemplates_DefaultTenantWithoutLabels_NoWarning(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_radiant.xlsx", fixtureCells, nil)

	templates := LoadTemplates(dir)

	assert.Equal(t, types.TemplateStatusOK, templates.Status())
}

func Test_LoadTemplates_TenantLabelsOverrideDefaults(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", withCell("B2", "{{ zygosity .Occurrence .Case.IsProband }}"), nil)
	writeLabels(t, dir, "qlin", fullLabels(map[string]string{"zygosity.HET": "Hz", "parent.mother": "M", "parent.father": "F"}))

	templates := LoadTemplates(dir)

	assert.Equal(t, types.TemplateStatusOK, templates.Status())
	tmpl, err := templates.For("qlin", KindGermline)
	require.NoError(t, err)
	f := openRendered(t, tmpl, sampleReport())
	value, err := f.GetCellValue("chr1_g.100A>T", "B2")
	require.NoError(t, err)
	assert.Equal(t, "Hz\n(M het, F ref)", value)
}

func Test_LoadTemplates_TenantLabelsIncomplete_DefaultsAndWarning(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", withCell("B2", "{{ zygosity .Occurrence .Case.IsProband }}"), nil)
	writeLabels(t, dir, "qlin", `{"zygosity.HET": "Hz"}`)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_qlin.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusWarning, templates.Status())
	tmpl, err := templates.For("qlin", KindGermline)
	require.NoError(t, err)
	f := openRendered(t, tmpl, sampleReport())
	value, err := f.GetCellValue("chr1_g.100A>T", "B2")
	require.NoError(t, err)
	assert.Equal(t, "Hz\n(Mother het, Father ref)", value)
}

func Test_LoadTemplates_UnknownValueAtRender_StatusWarning(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", withCell("B2", "{{ clinvar .Variant.ClinvarInterpretation }}"), nil)
	writeLabels(t, dir, "qlin", fullLabels(nil))
	templates := LoadTemplates(dir)
	require.Equal(t, types.TemplateStatusOK, templates.Status())
	report := sampleReport()
	report.Variant.ClinvarInterpretation = []string{"Pathogenic/Likely pathogenic"}

	_, err := templates.Render("qlin", KindGermline, []types.TranscriptReport{report})

	require.NoError(t, err)
	assert.Equal(t, types.TemplateStatusWarning, templates.Status())
}

func Test_LoadTemplates_TenantLabelsBadJSON_TemplatesSkipped(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)
	writeFixture(t, dir, "transcripts_germline_radiant.xlsx", fixtureCells, nil)
	writeLabels(t, dir, "qlin", `{`)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_radiant.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusWarning, templates.Status())
	_, err := templates.For("qlin", KindGermline)
	assert.ErrorIs(t, err, ErrTemplateMissing)
}

// fullLabels is a complete label file built from the defaults with overrides, so no warning fires.
func fullLabels(overrides map[string]string) string {
	full := labels{}
	for k, v := range en.defaults {
		full[k] = v
	}
	for k, v := range overrides {
		full[k] = v
	}
	raw, err := json.Marshal(full)
	if err != nil {
		panic(err)
	}
	return string(raw)
}

func Test_LoadTemplates_EmptyDirEnv_NoTemplates(t *testing.T) {
	templates := LoadTemplates("")

	assert.Empty(t, templates.Files())
	assert.Equal(t, types.TemplateStatusError, templates.Status())
}

func Test_LoadTemplates_MissingDir_NoTemplates(t *testing.T) {
	templates := LoadTemplates(filepath.Join(t.TempDir(), "does-not-exist"))

	assert.Empty(t, templates.Files())
	assert.Equal(t, types.TemplateStatusError, templates.Status())
}

func Test_LoadTemplates_OneTemplatePerTenantAndKind(t *testing.T) {
	dir := t.TempDir()
	writeLabels(t, dir, "qlin", fullLabels(nil))
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)
	writeFixture(t, dir, "transcripts_germline_radiant.xlsx", fixtureCells, nil)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_qlin.xlsx", "transcripts_germline_radiant.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusOK, templates.Status())
	tmpl, err := templates.For("qlin", KindGermline)
	require.NoError(t, err)
	assert.Equal(t, "qlin", tmpl.Tenant)
	assert.Equal(t, KindGermline, tmpl.Kind)
}

func Test_LoadTemplates_UnknownTenant_ErrTemplateMissing(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)

	_, err := LoadTemplates(dir).For("other", KindGermline)

	assert.ErrorIs(t, err, ErrTemplateMissing)
}

func Test_LoadTemplates_NilTemplates_ErrTemplateMissing(t *testing.T) {
	var templates *Templates

	_, err := templates.For("qlin", KindGermline)

	assert.ErrorIs(t, err, ErrTemplateMissing)
	assert.Equal(t, types.TemplateStatusError, templates.Status())
}

func Test_LoadTemplates_HiddenEntriesIgnored(t *testing.T) {
	dir := t.TempDir()
	writeLabels(t, dir, "qlin", fullLabels(nil))
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)
	require.NoError(t, os.Mkdir(filepath.Join(dir, "..data"), 0o750))
	require.NoError(t, os.WriteFile(filepath.Join(dir, ".hidden"), []byte("x"), 0o600))

	templates := LoadTemplates(dir)

	assert.Equal(t, types.TemplateStatusOK, templates.Status())
}

func Test_LoadTemplates_UnexpectedFile_Warning(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)
	require.NoError(t, os.WriteFile(filepath.Join(dir, "notes.txt"), []byte("x"), 0o600))
	writeFixture(t, dir, "transcripts_cnv_qlin.xlsx", fixtureCells, nil)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_qlin.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusWarning, templates.Status())
}

func Test_LoadTemplates_SomaticAndGermlineOfOneTenant(t *testing.T) {
	dir := t.TempDir()
	writeLabels(t, dir, "qlin", fullLabels(nil))
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)
	writeFixture(t, dir, "transcripts_somatic_qlin.xlsx", withCell("B2", "{{ oncogenicity .Transcript.SomaticInterpretation }}"), nil)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_qlin.xlsx", "transcripts_somatic_qlin.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusOK, templates.Status())
	tmpl, err := templates.For("qlin", KindSomatic)
	require.NoError(t, err)
	assert.Equal(t, KindSomatic, tmpl.Kind)
}

func Test_LoadTemplates_BrokenFile_SkippedWarning(t *testing.T) {
	dir := t.TempDir()
	writeFixture(t, dir, "transcripts_germline_qlin.xlsx", fixtureCells, nil)
	require.NoError(t, os.WriteFile(filepath.Join(dir, "transcripts_germline_radiant.xlsx"), []byte("not xlsx"), 0o600))

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"transcripts_germline_qlin.xlsx"}, templates.Files())
	assert.Equal(t, types.TemplateStatusWarning, templates.Status())
}

func Test_LoadTemplates_OnlyBrokenFiles_Error(t *testing.T) {
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "transcripts_germline_radiant.xlsx"), []byte("not xlsx"), 0o600))

	assert.Equal(t, types.TemplateStatusError, LoadTemplates(dir).Status())
}

func withCell(cell, text string) map[string]string {
	cells := map[string]string{}
	for k, v := range fixtureCells {
		cells[k] = v
	}
	cells[cell] = text
	return cells
}

func Test_ParseTemplate_UnknownField_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", withCell("A2", "{{ .Transcript.Nope }}"), nil)

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "dry run")
	assert.Contains(t, err.Error(), "Nope")
}

func Test_ParseTemplate_UnknownFieldInElseBranch_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", withCell("B2", "{{ with .Transcript.Interpretation }}ok{{ else }}{{ .Variant.Nope }}{{ end }}"), nil)

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "Nope")
}

func Test_ParseTemplate_UnknownHelper_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", withCell("A2", "{{ nope .Variant }}"), nil)

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), `parse A2`)
}

func Test_ParseTemplate_BadSheetName_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", fixtureCells, func(f *excelize.File, sheet string) {
		require.NoError(t, f.SetSheetName(sheet, "{{ .Variant.Nope }}"))
	})

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "sheet name")
}

func Test_ParseTemplate_Formula_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", fixtureCells, func(f *excelize.File, sheet string) {
		require.NoError(t, f.SetCellFormula(sheet, "B2", "=A2"))
	})

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "formulas are not supported")
}

func Test_ParseTemplate_MergedCells_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", fixtureCells, func(f *excelize.File, sheet string) {
		require.NoError(t, f.MergeCell(sheet, "A2", "B2"))
	})

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "merged cells are not supported")
}

func Test_ParseTemplate_ConditionalFormat_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", fixtureCells, func(f *excelize.File, sheet string) {
		style, err := f.NewConditionalStyle(&excelize.Style{Font: &excelize.Font{Color: "9A0511"}})
		require.NoError(t, err)
		require.NoError(t, f.SetConditionalFormat(sheet, "A2:B2", []excelize.ConditionalFormatOptions{{Type: "cell", Criteria: "==", Format: &style, Value: "x"}}))
	})

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "conditional formatting is not supported")
}

func Test_ParseTemplate_ContentBelowPlaceholderRow_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", withCell("A4", "legend"), nil)

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "row 4")
}

func Test_ParseTemplate_SecondSheet_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", fixtureCells, func(f *excelize.File, sheet string) {
		_, err := f.NewSheet("Notes")
		require.NoError(t, err)
	})

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "one sheet")
}

func Test_ParseTemplate_EmptyPlaceholderRow_Rejected(t *testing.T) {
	path := writeFixture(t, t.TempDir(), "transcripts_germline_qlin.xlsx", map[string]string{"A1": "Header"}, nil)

	_, err := parseTemplate(path, KindGermline, "qlin", en)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "placeholder row is empty")
}

func Test_ParseTemplate_QlinGermlineFile_Loads(t *testing.T) {
	tmpl, err := parseTemplate(filepath.Join("testdata", "transcripts_germline_qlin.xlsx"), KindGermline, "qlin", en)

	require.NoError(t, err)
	assert.Len(t, tmpl.header, 11)
	assert.Len(t, tmpl.repeat, 11)
}

func Test_ParseTemplate_QlinSomaticFile_Loads(t *testing.T) {
	tmpl, err := parseTemplate(filepath.Join("testdata", "transcripts_somatic_qlin.xlsx"), KindSomatic, "qlin", en)

	require.NoError(t, err)
	assert.Len(t, tmpl.header, 13)
	assert.Len(t, tmpl.repeat, 13)
}

func Test_TemplateFromFilename(t *testing.T) {
	kind, tenant, ok := templateFromFilename("transcripts_germline_qlin.xlsx")
	assert.True(t, ok)
	assert.Equal(t, KindGermline, kind)
	assert.Equal(t, "qlin", tenant)

	kind, tenant, ok = templateFromFilename("transcripts_somatic_my_lab.xlsx")
	assert.True(t, ok)
	assert.Equal(t, KindSomatic, kind)
	assert.Equal(t, "my_lab", tenant)

	for _, name := range []string{"transcripts_qlin.xlsx", "transcripts_germline_.xlsx", "transcripts_cnv_qlin.xlsx", "manifest_qlin.tmpl", "transcripts_germline_qlin.xls"} {
		_, _, ok := templateFromFilename(name)
		assert.False(t, ok, name)
	}
}
