package report

import (
	"context"
	"errors"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

type fakeData struct {
	reportContext *types.ReportContext
	occurrences   []types.ReportOccurrenceRow
	consequences  []types.ReportConsequenceRow
	omim          []types.ReportOmimRow
	err           error

	omimSymbols []string
}

func (f *fakeData) GetGermlineReportContext(context.Context, int, int, int) (*types.ReportContext, error) {
	return f.reportContext, f.err
}

func (f *fakeData) ListGermlineReportOccurrences(context.Context, int, int, int, []int) ([]types.ReportOccurrenceRow, error) {
	return f.occurrences, nil
}

func (f *fakeData) ListReportConsequences(context.Context, []int) ([]types.ReportConsequenceRow, error) {
	return f.consequences, nil
}

func (f *fakeData) ListReportOmim(_ context.Context, symbols []string) ([]types.ReportOmimRow, error) {
	f.omimSymbols = symbols
	return f.omim, nil
}

type fakeInterpretations struct {
	interpretations []types.InterpretationGermline
	err             error
}

func (f *fakeInterpretations) ListGermlineForReport(context.Context, string, string, []string) ([]types.InterpretationGermline, error) {
	return f.interpretations, f.err
}

func ptr[T any](v T) *T { return &v }

func brafRows() []types.ReportConsequenceRow {
	return []types.ReportConsequenceRow{
		{LocusID: 1000, Symbol: "BRAF", TranscriptID: "ENST00000288602", TranscriptVersion: "11", Source: "Ensembl", DnaChange: "c.1799T>A"},
		{LocusID: 1000, Symbol: "BRAF", TranscriptID: "ENST00000646891", TranscriptVersion: "6", Source: "Ensembl", IsManeSelect: true, IsCanonical: true, ManeSelect: "NM_004333.6", ManePairTranscriptID: "NM_004333", RevelScore: ptr(float32(0.931))},
		{LocusID: 1000, Symbol: "BRAF", TranscriptID: "NM_001374258", TranscriptVersion: "1", Source: "RefSeq"},
		{LocusID: 1000, Symbol: "BRAF", TranscriptID: "NM_004333", TranscriptVersion: "6", Source: "RefSeq", IsManeSelect: true, ManeSelect: "NM_004333.6", ManePairTranscriptID: "ENST00000646891"},
		{LocusID: 1000, Symbol: "LINC01", TranscriptID: "NR_027010", TranscriptVersion: "2", Source: "RefSeq"},
		{LocusID: 1000, Symbol: "BRAF", TranscriptID: "T001"},
	}
}

func transcriptIDs(transcripts []types.ReportTranscript) []string {
	ids := make([]string, len(transcripts))
	for i, transcript := range transcripts {
		ids[i] = transcript.TranscriptID
	}
	return ids
}

func Test_BuildTranscripts_OneRowPerEnsemblTranscript_ManeSelectFirst(t *testing.T) {
	transcripts := buildTranscripts(brafRows())

	assert.Equal(t, []string{"ENST00000646891", "ENST00000288602", "T001", "NR_027010"}, transcriptIDs(transcripts))
}

func Test_BuildTranscripts_RefseqIdFromManePair(t *testing.T) {
	transcripts := buildTranscripts(brafRows())

	assert.Equal(t, []string{"NM_004333.6"}, transcripts[0].RefseqIDs)
	assert.Nil(t, transcripts[1].RefseqIDs)
}

func Test_BuildTranscripts_RefseqIdFromPairRow_WhenManeSelectEmpty(t *testing.T) {
	transcripts := buildTranscripts([]types.ReportConsequenceRow{
		{LocusID: 1, Symbol: "G", TranscriptID: "ENST1", Source: "Ensembl", IsManePlus: true, ManePairTranscriptID: "NM_1"},
		{LocusID: 1, Symbol: "G", TranscriptID: "NM_1", TranscriptVersion: "3", Source: "RefSeq", IsManePlus: true, ManePairTranscriptID: "ENST1"},
	})

	if assert.Len(t, transcripts, 1) {
		assert.Equal(t, []string{"NM_1.3"}, transcripts[0].RefseqIDs)
	}
}

func Test_BuildTranscripts_RefseqOnlyGene_KeepsItsRow(t *testing.T) {
	transcripts := buildTranscripts(brafRows())

	refseqOnly := transcripts[3]
	assert.Equal(t, "LINC01", refseqOnly.Symbol)
	assert.Equal(t, "RefSeq", refseqOnly.Source)
	assert.Equal(t, []string{"NR_027010.2"}, refseqOnly.RefseqIDs)
}

func Test_BuildTranscripts_LegacyNullSource_CountsAsEnsembl(t *testing.T) {
	transcripts := buildTranscripts(brafRows())

	assert.Equal(t, "T001", transcripts[2].TranscriptID)
	assert.Equal(t, "", transcripts[2].Source)
}

func Test_BuildTranscripts_NoRows(t *testing.T) {
	transcripts := buildTranscripts(nil)

	assert.NotNil(t, transcripts)
	assert.Empty(t, transcripts)
}

func Test_BuildTranscripts_Order_ManeSelect_ManePlus_Canonical_Symbol_Id(t *testing.T) {
	transcripts := buildTranscripts([]types.ReportConsequenceRow{
		{Symbol: "B", TranscriptID: "ENST4", Source: "Ensembl"},
		{Symbol: "A", TranscriptID: "ENST3", Source: "Ensembl"},
		{Symbol: "B", TranscriptID: "ENST2", Source: "Ensembl", IsCanonical: true},
		{Symbol: "B", TranscriptID: "ENST1", Source: "Ensembl", IsManePlus: true},
		{Symbol: "B", TranscriptID: "ENST0", Source: "Ensembl", IsManeSelect: true},
	})

	assert.Equal(t, []string{"ENST0", "ENST1", "ENST2", "ENST3", "ENST4"}, transcriptIDs(transcripts))
}

func occurrenceRow(locusId int64) types.ReportOccurrenceRow {
	return types.ReportOccurrenceRow{
		LocusID: locusId, Hgvsg: "chr7:g.140753336A>T", Rsnumber: "rs113488022", Chromosome: "7", Start: 140753336,
		Reference: "A", Alternate: "T", Symbol: "BRAF", ClinvarName: "13961", ClinvarInterpretation: []string{"Pathogenic"},
		Zygosity: "HET", ParentalOrigin: "mother", FatherZygosity: "WT", MotherZygosity: "HET", TransmissionMode: "autosomal_dominant",
		AdRatio: 0.5, AdAlt: 10, AdTotal: 20,
		GnomadAf: ptr(0.0000123), GnomadAc: ptr(2), GnomadAn: ptr(152000), GnomadHom: ptr(0),
	}
}

func newBuilder(data *fakeData, interpretations *fakeInterpretations) *GermlineBuilder {
	return NewGermlineBuilder(data, interpretations)
}

func Test_Build_AssemblesReport(t *testing.T) {
	data := &fakeData{
		reportContext: &types.ReportContext{Part: 1, SubmitterPatientID: "MRN-1", SubmitterSampleID: "S-1", IsProband: true, GenomeBuild: "GRCh38"},
		occurrences:   []types.ReportOccurrenceRow{occurrenceRow(1000)},
		consequences:  brafRows(),
		omim: []types.ReportOmimRow{
			{Symbol: "BRAF", OmimPhenotypeID: "613706", Panel: "Noonan syndrome 7", InheritanceCode: []string{"AD"}},
		},
	}
	interpretations := &fakeInterpretations{interpretations: []types.InterpretationGermline{{
		InterpretationCommon: types.InterpretationCommon{LocusId: "1000", TranscriptId: "ENST00000646891", Pubmed: []types.InterpretationPubmed{{CitationID: "1", Citation: "format1"}}},
		Classification:       "LA6668-3",
		Condition:            "MONDO:0000001",
	}}}

	reports, err := newBuilder(data, interpretations).Build(t.Context(), 1, 1, 5, []int{1000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 1) {
		report := reports[0]
		assert.Equal(t, types.ReportCase{CaseID: 1, SeqID: 1, TaskID: 5, SubmitterPatientID: "MRN-1", SubmitterSampleID: "S-1", IsProband: true, GenomeBuild: "GRCh38"}, report.Case)
		assert.Equal(t, "1000", report.Variant.LocusID)
		assert.Equal(t, "13961", report.Variant.ClinvarID)
		assert.Equal(t, &types.ReportGnomad{Af: 0.0000123, Ac: 2, An: 152000, Hom: 0}, report.Variant.Gnomad)
		assert.Equal(t, types.ReportOccurrence{Zygosity: "HET", ParentalOrigin: "mother", FatherZygosity: "WT", MotherZygosity: "HET", TransmissionMode: "autosomal_dominant", AdRatio: 0.5, AdAlt: 10, AdTotal: 20}, report.Occurrence)
		assert.Equal(t, []types.ReportGene{
			{Symbol: "BRAF", Omim: []types.ReportOmim{{PhenotypeID: "613706", Name: "Noonan syndrome 7", InheritanceCode: []string{"AD"}}}},
			{Symbol: "LINC01", Omim: []types.ReportOmim{}},
		}, report.Genes)
		assert.Equal(t, []string{"BRAF", "LINC01"}, data.omimSymbols)
		if assert.Len(t, report.Transcripts, 4) {
			if assert.NotNil(t, report.Transcripts[0].Interpretation) {
				assert.Equal(t, "LA6668-3", report.Transcripts[0].Interpretation.Classification)
				assert.Equal(t, "MONDO:0000001", report.Transcripts[0].Interpretation.Condition)
				assert.Equal(t, []types.InterpretationPubmed{{CitationID: "1", Citation: "format1"}}, report.Transcripts[0].Interpretation.Pubmed)
			}
			assert.Nil(t, report.Transcripts[1].Interpretation)
			assert.Nil(t, report.Transcripts[2].Interpretation)
			assert.Nil(t, report.Transcripts[3].Interpretation)
		}
	}
}

func Test_Build_IntergenicLocus_EmptyGenesAndTranscripts_NoGnomad(t *testing.T) {
	row := occurrenceRow(2000)
	row.Symbol = ""
	row.GnomadAf, row.GnomadAc, row.GnomadAn, row.GnomadHom = nil, nil, nil, nil
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{row}}

	reports, err := newBuilder(data, &fakeInterpretations{}).Build(t.Context(), 1, 1, 5, []int{2000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 1) {
		assert.Nil(t, reports[0].Variant.Gnomad)
		assert.Equal(t, []types.ReportGene{}, reports[0].Genes)
		assert.Equal(t, []types.ReportTranscript{}, reports[0].Transcripts)
	}
}

func Test_Build_KeepsRequestOrder_SkipsMissingLocus(t *testing.T) {
	data := &fakeData{
		reportContext: &types.ReportContext{Part: 1},
		occurrences:   []types.ReportOccurrenceRow{occurrenceRow(1000), occurrenceRow(2000)},
	}

	reports, err := newBuilder(data, &fakeInterpretations{}).Build(t.Context(), 1, 1, 5, []int{2000, 3000, 1000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 2) {
		assert.Equal(t, "2000", reports[0].Variant.LocusID)
		assert.Equal(t, "1000", reports[1].Variant.LocusID)
	}
}

func Test_Build_NoOccurrence_ReturnsEmpty(t *testing.T) {
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}}

	reports, err := newBuilder(data, &fakeInterpretations{}).Build(t.Context(), 1, 1, 5, []int{3000})

	assert.NoError(t, err)
	assert.NotNil(t, reports)
	assert.Empty(t, reports)
}

func Test_Build_TaskNotOfCase_ReturnsNil(t *testing.T) {
	reports, err := newBuilder(&fakeData{}, &fakeInterpretations{}).Build(t.Context(), 1, 1, 77, []int{1000})

	assert.NoError(t, err)
	assert.Nil(t, reports)
}

func Test_Build_DataError_Propagates(t *testing.T) {
	data := &fakeData{err: errors.New("starrocks down")}

	reports, err := newBuilder(data, &fakeInterpretations{}).Build(t.Context(), 1, 1, 5, []int{1000})

	assert.Nil(t, reports)
	assert.EqualError(t, err, "starrocks down")
}

func Test_Build_InterpretationError_Propagates(t *testing.T) {
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{occurrenceRow(1000)}}
	interpretations := &fakeInterpretations{err: errors.New("postgres down")}

	reports, err := newBuilder(data, interpretations).Build(t.Context(), 1, 1, 5, []int{1000})

	assert.Nil(t, reports)
	assert.EqualError(t, err, "list germline interpretations: postgres down")
}
