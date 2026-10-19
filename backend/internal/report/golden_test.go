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

const (
	citation1 = "Tomlinson E, Davis SS. Increased uptake of an anionic drug by mucous membrane, upon formation of ion-association species with quaternary ammonium salts [proceedings]. J Pharm Pharmacol. 1976 Dec;28 Suppl:75P. PMID: 12354."
	citation2 = "Jøorgensen A, Staehr P. On the biological half-life of amitroptyline. J Pharm Pharmacol. 1976 Jan;28(1):62-4. doi: 10.1111/j.2042-7158.1976.tb04026.x. PMID: 6654."
)

// arrangerGermlineMock is the clin-arranger `mockGermlineVariant` of patientTranscription.spec.js
// as a report object; the expected cells are the ones that spec asserts.
func arrangerGermlineMock() types.TranscriptReport {
	return types.TranscriptReport{
		Case:       types.ReportCase{CaseID: 762051, SubmitterSampleID: "SampleMother", IsProband: true, GenomeBuild: "GRCh38"},
		Variant:    types.ReportVariant{Hgvsg: "chr11:g.198062C>G", Rsnumber: "rs11605246", ClinvarID: "clin id", ClinvarInterpretation: []string{"association_not_found"}, Gnomad: &types.ReportGnomad{Ac: 77907, Af: 0.512, An: 152054, Hom: 20535}},
		Occurrence: types.ReportOccurrence{Zygosity: "HET", ParentalOrigin: "unknown"},
		Genes: []types.ReportGene{
			{Symbol: "BET1L", Omim: []types.ReportOmim{{PhenotypeID: "id", Name: "name", InheritanceCode: []string{"code"}}}},
			{Symbol: "ODF3", Omim: []types.ReportOmim{}},
		},
		Transcripts: []types.ReportTranscript{
			{
				TranscriptID: "ENST00000342878", Symbol: "BET1L", IsManeSelect: true, RefseqIDs: []string{"NM_145651.3", "NM_123456"},
				DnaChange: "n.515+19962_515+19963del", Consequences: []string{"downstream_gene_variant"},
				Interpretation: &types.ReportGermlineInterpretation{Classification: "LA6668-3", Pubmed: []types.InterpretationPubmed{{CitationID: "12354", Citation: citation1}, {CitationID: "6654", Citation: citation2}}},
			},
			{
				TranscriptID: "ENST00000382762", Symbol: "ODF3", IsManePlus: true, RefseqIDs: []string{"NM_001098787.2"},
				ExonRank: "5", ExonTotal: "10", Consequences: []string{"downstream_gene_variant"},
			},
		},
	}
}

func qlinGermlineTemplate(t *testing.T) *Template {
	t.Helper()
	tmpl, err := parseTemplate(filepath.Join("testdata", "transcripts_germline_qlin.xlsx"), KindGermline, "qlin", en)
	require.NoError(t, err)
	return tmpl
}

func Test_Golden_QlinGermline_ArrangerMockCells(t *testing.T) {
	f := openRendered(t, qlinGermlineTemplate(t), arrangerGermlineMock())

	require.Equal(t, []string{"chr11_g.198062C>G"}, f.GetSheetList())
	rows, err := f.GetRows("chr11_g.198062C>G")
	require.NoError(t, err)
	// GetRows drops trailing empty cells, the arranger spec asserts them.
	for i := range rows {
		for len(rows[i]) < 11 {
			rows[i] = append(rows[i], "")
		}
	}
	assert.Equal(t, [][]string{
		{
			"Variation nucléotidique (GRCh38)", "Zygosité (origine parentale)", "Fréquence allélique¹", "Prédiction in silico²", "ClinVar",
			"OMIM et PMID³", "Interprétation⁴", "MANE", "Numéro requête CQGC", "Numéro échantillon", "Citations",
		},
		{
			"chr11:g.198062C>G\nGène : BET1L\nNM_145651.3\nNM_123456\nn.515+19962_515+19963del",
			"Heterozygous",
			"77907 / 152054 allèles (20535 hom) 0.5120000",
			"Délétère/Incertaine/Bénigne/Non applicable (REVEL = ND; CADD (Phred) = 0)",
			"Association not found\n(ID : clin id)",
			"name\n(MIM: id, code)\nPMID: 12354\nPMID: 6654",
			"Pathogenic",
			"MANE Select (NM_145651.3)\n",
			"762051",
			"SampleMother",
			citation1 + "\n" + citation2,
		},
		{
			"chr11:g.198062C>G\nGène : ODF3\nNM_001098787.2\nExon: 5/10",
			"Heterozygous",
			"77907 / 152054 allèles (20535 hom) 0.5120000",
			"Délétère/Incertaine/Bénigne/Non applicable (REVEL = ND; CADD (Phred) = 0)",
			"Association not found\n(ID : clin id)",
			"Non répertorié",
			"",
			"MANE Plus (NM_001098787.2)\n",
			"762051",
			"SampleMother",
			"",
		},
	}, rows)
}

func Test_Golden_QlinGermline_RichTextRuns(t *testing.T) {
	f := openRendered(t, qlinGermlineTemplate(t), arrangerGermlineMock())
	sheet := "chr11_g.198062C>G"

	runs, err := f.GetCellRichText(sheet, "A2")
	require.NoError(t, err)
	require.Len(t, runs, 3)
	assert.Equal(t, "BET1L", runs[1].Text)
	assert.True(t, runs[1].Font.Bold)
	assert.False(t, runs[0].Font.Bold)
	assert.Equal(t, "Arial", runs[1].Font.Family)
	assert.Equal(t, float64(9), runs[1].Font.Size)

	runs, err = f.GetCellRichText(sheet, "F2")
	require.NoError(t, err)
	require.Len(t, runs, 2)
	assert.Equal(t, "name", runs[0].Text)
	assert.True(t, runs[0].Font.Italic)
	assert.False(t, runs[1].Font.Italic)

	runs, err = f.GetCellRichText(sheet, "G2")
	require.NoError(t, err)
	require.Len(t, runs, 1)
	assert.Equal(t, "Pathogenic", runs[0].Text)
	assert.True(t, runs[0].Font.Bold)

	runs, err = f.GetCellRichText(sheet, "D1")
	require.NoError(t, err)
	require.Len(t, runs, 3)
	assert.Equal(t, "in silico", runs[1].Text)
	assert.True(t, runs[1].Font.Italic)
	assert.True(t, runs[1].Font.Bold)
}

func Test_Golden_QlinGermline_Layout(t *testing.T) {
	tmpl := qlinGermlineTemplate(t)
	out, err := tmpl.Render([]types.TranscriptReport{arrangerGermlineMock()})
	require.NoError(t, err)
	f, err := excelize.OpenReader(bytes.NewReader(out))
	require.NoError(t, err)
	defer func() { _ = f.Close() }()
	sheet := "chr11_g.198062C>G"

	for col, width := range map[string]float64{"A": 14.57, "B": 10.29, "C": 8.86, "D": 8.43, "E": 11.71, "F": 15.57, "G": 11.86, "H": 16.27, "I": 10.85, "J": 10.85, "K": 108.5} {
		got, err := f.GetColWidth(sheet, col)
		require.NoError(t, err)
		assert.InDelta(t, width, got, 0.01, col)
	}
	for row, height := range map[int]float64{1: 30, 2: 150, 3: 150} {
		got, err := f.GetRowHeight(sheet, row)
		require.NoError(t, err)
		assert.Equal(t, height, got, "row %d", row)
	}
	for _, cell := range []string{"A1", "K1", "A2", "K2", "A3", "K3"} {
		styleID, err := f.GetCellStyle(sheet, cell)
		require.NoError(t, err)
		style, err := f.GetStyle(styleID)
		require.NoError(t, err)
		assert.Equal(t, "Arial", style.Font.Family, cell)
		assert.Equal(t, float64(9), style.Font.Size, cell)
		assert.Equal(t, cell[1] == '1', style.Font.Bold, cell)
		assert.True(t, style.Alignment.WrapText, cell)
		assert.Equal(t, "top", style.Alignment.Vertical, cell)
		assert.Equal(t, 1, style.Border[0].Style, cell) // 1 = thin
	}
	for cell, horizontal := range map[string]string{"A1": "center", "B1": "center", "A2": "left", "B2": "center", "K2": "left", "A3": "left"} {
		styleID, err := f.GetCellStyle(sheet, cell)
		require.NoError(t, err)
		style, err := f.GetStyle(styleID)
		require.NoError(t, err)
		assert.Equal(t, horizontal, style.Alignment.Horizontal, cell)
	}

	archive, err := zip.NewReader(bytes.NewReader(out), int64(len(out)))
	require.NoError(t, err)
	var worksheets []string
	for _, file := range archive.File {
		if strings.HasPrefix(file.Name, "xl/worksheets/sheet") {
			reader, err := file.Open()
			require.NoError(t, err)
			content, err := io.ReadAll(reader)
			require.NoError(t, err)
			require.NoError(t, reader.Close())
			worksheets = append(worksheets, string(content))
		}
	}
	require.Len(t, worksheets, 1)
	assert.Regexp(t, `<autoFilter ref="\$?A\$?1:\$?K\$?1"`, worksheets[0])
	// the qlin file stores its cells inline; a leftover inline string hides the shared rich text in Excel
	assert.NotContains(t, worksheets[0], "<is>")
	assert.NotContains(t, worksheets[0], "{{")
}

func Test_Golden_QlinGermline_ZygosityCases(t *testing.T) {
	proband := func(hgvsg string, occurrence types.ReportOccurrence) types.TranscriptReport {
		report := arrangerGermlineMock()
		report.Variant.Hgvsg = hgvsg
		report.Occurrence = occurrence
		return report
	}
	f := openRendered(t, qlinGermlineTemplate(t),
		proband("chr1:g.1A>T", types.ReportOccurrence{Zygosity: "HET", ParentalOrigin: "mother", FatherZygosity: "WT", MotherZygosity: "HET"}),
		proband("chr1:g.2A>T", types.ReportOccurrence{Zygosity: "HOM", ParentalOrigin: "both", FatherZygosity: "HET", MotherZygosity: "HET"}),
		proband("chr1:g.3A>T", types.ReportOccurrence{Zygosity: "HET", ParentalOrigin: "denovo", FatherZygosity: "WT", MotherZygosity: "WT"}),
		proband("chr1:g.4A>T", types.ReportOccurrence{Zygosity: "HET", ParentalOrigin: "unknown", FatherZygosity: "WT", MotherZygosity: "HET"}),
	)

	for sheet, expected := range map[string]string{
		"chr1_g.1A>T": "Heterozygous\n(Mother het, Father ref)",
		"chr1_g.2A>T": "Homozygous\n(Father het, Mother het)",
		"chr1_g.3A>T": "Heterozygous\n(de novo)",
		"chr1_g.4A>T": "Heterozygous\n(Father wt, Mother het)",
	} {
		value, err := f.GetCellValue(sheet, "B2")
		require.NoError(t, err)
		assert.Equal(t, expected, value, sheet)
	}
}

// arrangerSomaticMock is the clin-arranger `mockSomaticVariant` as a report object.
func arrangerSomaticMock() types.TranscriptReport {
	report := arrangerGermlineMock()
	report.Occurrence = types.ReportOccurrence{TumorAdRatio: 0.0661764705882353, TumorAdAlt: 17, TumorAdTotal: 34, NormalSeqID: 2}
	report.Variant.ClinvarID, report.Variant.ClinvarInterpretation = "", nil
	report.Variant.Cosmic = &types.ReportCosmic{CosmicID: "ID", SampleMutated: 99, Tier: "3"}
	report.Transcripts[0].AaChange = "AASuperchange"
	report.Transcripts[0].Interpretation = nil
	report.Transcripts[0].SomaticInterpretation = &types.ReportSomaticInterpretation{
		ClinicalUtility: "category_ib",
		Oncogenicity:    "LA26332-9",
		Pubmed:          []types.InterpretationPubmed{{CitationID: "12354", Citation: citation1}, {CitationID: "6654", Citation: citation2}},
	}
	return report
}

func qlinSomaticTemplate(t *testing.T) *Template {
	t.Helper()
	tmpl, err := parseTemplate(filepath.Join("testdata", "transcripts_somatic_qlin.xlsx"), KindSomatic, "qlin", en)
	require.NoError(t, err)
	return tmpl
}

func Test_Golden_QlinSomatic_ArrangerMockCells(t *testing.T) {
	f := openRendered(t, qlinSomaticTemplate(t), arrangerSomaticMock())

	require.Equal(t, []string{"chr11_g.198062C>G"}, f.GetSheetList())
	rows, err := f.GetRows("chr11_g.198062C>G")
	require.NoError(t, err)
	for i := range rows {
		for len(rows[i]) < 13 {
			rows[i] = append(rows[i], "")
		}
	}
	assert.Equal(t, [][]string{
		{
			"Variation nucléotidique (GRCh38)", "Fréquence allélique du variant [VAF] (lectures variant / total)", "Origine du variant*",
			"Fréquence allélique population¹", "Nombre de cas rapportés (COSMIC)²", "Impact fonctionnel", "Niveau de signification clinique⁵",
			"Oncogénicité", "Transcrit MANE Select", "Numéro requête CQGC", "Numéro échantillon", "Publication PubMed", "Citations",
		},
		{
			"chr11:g.198062C>G\nGène : BET1L\nNM_145651.3\nNM_123456\nn.515+19962_515+19963del\nAASuperchange",
			"7%\n(17/34 lectures)",
			"Somatique",
			"0.5120000\n(77907 / 152054 allèles)",
			"99\n(ID)",
			"Gain de fonction/Perte de fonction/Délétère/Bénigne/Incertaine/Non applicable (REVEL = ND)",
			"Tier IB",
			"Likely oncogenic",
			"Oui",
			"762051",
			"SampleMother",
			"PMID : 12354\nPMID : 6654",
			citation1 + "\n" + citation2,
		},
		{
			"chr11:g.198062C>G\nGène : ODF3\nNM_001098787.2\nExon: 5/10",
			"7%\n(17/34 lectures)",
			"Somatique",
			"0.5120000\n(77907 / 152054 allèles)",
			"99\n(ID)",
			"Gain de fonction/Perte de fonction/Délétère/Bénigne/Incertaine/Non applicable (REVEL = ND)",
			"COSMIC : Tier 3",
			"",
			"Non",
			"762051",
			"SampleMother",
			"",
			"",
		},
	}, rows)

	runs, err := f.GetCellRichText("chr11_g.198062C>G", "G2")
	require.NoError(t, err)
	require.Len(t, runs, 1)
	assert.True(t, runs[0].Font.Bold)
	runs, err = f.GetCellRichText("chr11_g.198062C>G", "G3")
	require.NoError(t, err)
	require.Len(t, runs, 1)
	assert.True(t, runs[0].Font.Bold)
	height, err := f.GetRowHeight("chr11_g.198062C>G", 1)
	require.NoError(t, err)
	assert.Equal(t, 63.75, height)
}

func Test_Golden_QlinSomatic_TumorOnlyWithoutCosmic(t *testing.T) {
	report := arrangerSomaticMock()
	report.Occurrence.NormalSeqID = 0
	report.Variant.Cosmic = nil
	report.Transcripts = report.Transcripts[1:]

	f := openRendered(t, qlinSomaticTemplate(t), report)

	rows, err := f.GetRows("chr11_g.198062C>G")
	require.NoError(t, err)
	assert.Equal(t, "Non déterminée", rows[1][2])
	assert.Equal(t, "Non répertoriée", rows[1][4])
	assert.Equal(t, "Non répertorié", rows[1][6])
}
