package report

import (
	"archive/zip"
	"bytes"
	"io"
	"path/filepath"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/xuri/excelize/v2"
)

func loadFixture(t *testing.T, cells map[string]string) *Template {
	t.Helper()
	path := writeFixture(t, t.TempDir(), "transcripts_germline_radiant.xlsx", cells, nil)
	tmpl, err := parseTemplate(path, KindGermline, "radiant", en)
	require.NoError(t, err)
	return tmpl
}

func openRendered(t *testing.T, tmpl *Template, reports ...types.TranscriptReport) *excelize.File {
	t.Helper()
	out, err := tmpl.Render(reports)
	require.NoError(t, err)
	f, err := excelize.OpenReader(bytes.NewReader(out))
	require.NoError(t, err)
	t.Cleanup(func() { _ = f.Close() })
	return f
}

func reportWith(hgvsg string, transcripts ...types.ReportTranscript) types.TranscriptReport {
	report := sampleReport()
	report.Variant.Hgvsg = hgvsg
	report.Transcripts = transcripts
	return report
}

func transcript(symbol string, interpretation *types.ReportGermlineInterpretation) types.ReportTranscript {
	return types.ReportTranscript{TranscriptID: "ENST" + symbol, Symbol: symbol, Interpretation: interpretation}
}

func Test_Render_OneSheetPerReport_TemplateSheetDropped(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T", transcript("A", nil)), reportWith("chr2:g.2C>G", transcript("B", nil)))

	assert.Equal(t, []string{"chr1_g.1A>T", "chr2_g.2C>G"}, f.GetSheetList())
}

func Test_Render_NoReport_Error(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	_, err := tmpl.Render(nil)

	assert.ErrorContains(t, err, "no report to render")
}

func Test_Render_HeaderRenderedOnce(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T", transcript("A", nil)))

	value, err := f.GetCellValue("chr1_g.1A>T", "A1")
	require.NoError(t, err)
	assert.Equal(t, "Variation (GRCh38)", value)
}

func Test_Render_PlaceholderRowRepeatedPerTranscript(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)
	pathogenic := &types.ReportGermlineInterpretation{Classification: "LA6668-3"}

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T", transcript("A", nil), transcript("B", pathogenic), transcript("C", nil)))

	rows, err := f.GetRows("chr1_g.1A>T")
	require.NoError(t, err)
	assert.Equal(t, [][]string{
		{"Variation (GRCh38)", "Interpretation"},
		{"chr1:g.1A>T\nGene: A", "ND"},
		{"chr1:g.1A>T\nGene: B", "Pathogenic"},
		{"chr1:g.1A>T\nGene: C", "ND"},
	}, rows)
}

func Test_Render_DuplicatedRowsKeepHeightAndStyle(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T", transcript("A", nil), transcript("B", nil)))

	height, err := f.GetRowHeight("chr1_g.1A>T", 3)
	require.NoError(t, err)
	assert.Equal(t, float64(150), height)
	styleRow2, err := f.GetCellStyle("chr1_g.1A>T", "A2")
	require.NoError(t, err)
	styleRow3, err := f.GetCellStyle("chr1_g.1A>T", "A3")
	require.NoError(t, err)
	assert.Equal(t, styleRow2, styleRow3)
	assert.NotZero(t, styleRow3)
}

func Test_Render_NoTranscript_PlaceholderRowRemoved(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T"))

	rows, err := f.GetRows("chr1_g.1A>T")
	require.NoError(t, err)
	assert.Equal(t, [][]string{{"Variation (GRCh38)", "Interpretation"}}, rows)
}

func Test_Render_MarkupBecomesRichTextWithTemplateFont(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T", transcript("TP53", &types.ReportGermlineInterpretation{Classification: "LA6675-8"})))

	runs, err := f.GetCellRichText("chr1_g.1A>T", "A2")
	require.NoError(t, err)
	require.Len(t, runs, 2)
	assert.Equal(t, "chr1:g.1A>T\nGene: ", runs[0].Text)
	assert.False(t, runs[0].Font.Bold)
	assert.Equal(t, "TP53", runs[1].Text)
	assert.True(t, runs[1].Font.Bold)
	assert.Equal(t, "Arial", runs[1].Font.Family)
	assert.Equal(t, float64(9), runs[1].Font.Size)

	runs, err = f.GetCellRichText("chr1_g.1A>T", "B2")
	require.NoError(t, err)
	require.Len(t, runs, 1)
	assert.Equal(t, "Benign", runs[0].Text)
	assert.True(t, runs[0].Font.Bold)
}

func Test_Render_PlainCellKeepsStyle(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T", transcript("A", nil)))

	styleID, err := f.GetCellStyle("chr1_g.1A>T", "B2")
	require.NoError(t, err)
	style, err := f.GetStyle(styleID)
	require.NoError(t, err)
	assert.True(t, style.Alignment.WrapText)
	assert.Equal(t, "Arial", style.Font.Family)
}

// excelize has no autofilter getter: read the worksheet XML of the rendered workbook.
func Test_Render_AutoFilterKept(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)
	out, err := tmpl.Render([]types.TranscriptReport{reportWith("chr1:g.1A>T", transcript("A", nil))})
	require.NoError(t, err)

	archive, err := zip.NewReader(bytes.NewReader(out), int64(len(out)))
	require.NoError(t, err)
	var sheets []string
	for _, file := range archive.File {
		if !strings.HasPrefix(file.Name, "xl/worksheets/sheet") {
			continue
		}
		reader, err := file.Open()
		require.NoError(t, err)
		content, err := io.ReadAll(reader)
		require.NoError(t, err)
		require.NoError(t, reader.Close())
		sheets = append(sheets, string(content))
	}
	require.Len(t, sheets, 1)
	assert.Regexp(t, `<autoFilter ref="\$?A\$?1:\$?B\$?1"`, sheets[0])
}

func Test_Render_SheetNameSanitisedAndTruncated(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.123456789_123456799del[1]/?*\\"))

	assert.Equal(t, []string{"chr1_g.123456789_123456799del_1"}, f.GetSheetList())
}

func Test_Render_DuplicateSheetNamesSuffixed(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith("chr1:g.1A>T"), reportWith("chr1:g.1A>T"), reportWith("chr1:g.1A>T"))

	assert.Equal(t, []string{"chr1_g.1A>T", "chr1_g.1A>T (1)", "chr1_g.1A>T (2)"}, f.GetSheetList())
}

func Test_Render_EmptySheetNameFallsBack(t *testing.T) {
	tmpl := loadFixture(t, fixtureCells)

	f := openRendered(t, tmpl, reportWith(""))

	assert.Equal(t, []string{"Report"}, f.GetSheetList())
}

func Test_Render_GeneOfTranscriptResolved(t *testing.T) {
	tmpl := loadFixture(t, withCell("B2", "{{ with .Gene }}{{ len .Omim }}{{ else }}no gene{{ end }}"))
	report := reportWith("chr1:g.1A>T", transcript("GENE1", nil), transcript("OTHER", nil))

	f := openRendered(t, tmpl, report)

	rows, err := f.GetRows("chr1_g.1A>T")
	require.NoError(t, err)
	assert.Equal(t, "1", rows[1][1])
	assert.Equal(t, "no gene", rows[2][1])
}

func Test_Render_QlinGermlineFile_SampleReport(t *testing.T) {
	tmpl, err := parseTemplate(filepath.Join("testdata", "transcripts_germline_qlin.xlsx"), KindGermline, "qlin", en)
	require.NoError(t, err)

	f := openRendered(t, tmpl, sampleReport())

	sheet := "chr1_g.100A>T"
	assert.Equal(t, []string{sheet}, f.GetSheetList())
	rows, err := f.GetRows(sheet)
	require.NoError(t, err)
	require.Len(t, rows, 2)
	require.Len(t, rows[1], 11)
	// The wording is the tenant's (French), checked by the lab on the deployed file; here only the shape.
	for i, cell := range rows[1] {
		assert.NotEmpty(t, cell, "column %d", i)
		assert.NotContains(t, cell, "{{", "column %d", i)
	}
	assert.Contains(t, rows[1][0], "chr1:g.100A>T\n")
	assert.Contains(t, rows[1][0], "NM_000001.1\nc.1A>T\np.Met1Leu\n")
	assert.Contains(t, rows[1][1], "het")
	assert.Contains(t, rows[1][2], "1 / 1536252")
	assert.Contains(t, rows[1][3], "(REVEL = 0.9; CADD (Phred) = 25)")
	assert.Contains(t, rows[1][4], "(ID : 12345)")
	assert.Contains(t, rows[1][5], "123456, AD")
	assert.Equal(t, "MANE Select (NM_000001.1)\nMANE Plus (NM_000001.1)\nEnsembl Canonical (ENST00000001)", rows[1][7])
	assert.Equal(t, "1", rows[1][8])
	assert.Equal(t, "S-1", rows[1][9])
	assert.Equal(t, "Author A. Title. Journal. 2020.", rows[1][10])

	runs, err := f.GetCellRichText(sheet, "D1")
	require.NoError(t, err)
	require.Len(t, runs, 3)
	assert.True(t, runs[1].Font.Italic)
	assert.True(t, runs[1].Font.Bold)
	assert.Equal(t, "in silico", runs[1].Text)
	height, err := f.GetRowHeight(sheet, 2)
	require.NoError(t, err)
	assert.Equal(t, float64(150), height)
}
