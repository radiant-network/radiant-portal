package report

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func somaticOccurrenceRow(locusId int64) types.ReportOccurrenceRow {
	return types.ReportOccurrenceRow{
		LocusID: locusId, Hgvsg: "chr7:g.140753336A>T", Symbol: "BRAF", ClinvarName: "13961",
		NormalSeqID: ptr(2), TumorAdRatio: 0.5, TumorAdAlt: 17, TumorAdTotal: 34,
		GnomadAf: ptr(0.0000123), GnomadAc: ptr(2), GnomadAn: ptr(152000), GnomadHom: ptr(0),
		CosmicID: "COSV56056643", CosmicSampleMutated: ptr(99), CosmicTier: "1",
	}
}

func Test_BuildSomatic_AssemblesReport(t *testing.T) {
	data := &fakeData{
		reportContext: &types.ReportContext{Part: 1, SubmitterPatientID: "MRN-1", SubmitterSampleID: "S-1", GenomeBuild: "GRCh38"},
		occurrences:   []types.ReportOccurrenceRow{somaticOccurrenceRow(1000)},
		consequences:  brafRows(),
	}
	interpretations := &fakeInterpretations{somatic: []types.InterpretationSomatic{{
		InterpretationCommon:                types.InterpretationCommon{LocusId: "1000", TranscriptId: "ENST00000646891", Pubmed: []types.InterpretationPubmed{{CitationID: "1", Citation: "format1"}}},
		TumoralType:                         "MONDO:0000004",
		Oncogenicity:                        "LA26332-9",
		OncogenicityClassificationCriterias: []string{"OS1"},
		ClinicalUtility:                     "category_ib",
	}}}

	reports, err := newBuilder(data, interpretations).BuildSomatic(t.Context(), 1, 1, 5, []int{1000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 1) {
		report := reports[0]
		assert.Equal(t, types.ReportCase{CaseID: 1, SeqID: 1, TaskID: 5, SubmitterPatientID: "MRN-1", SubmitterSampleID: "S-1", GenomeBuild: "GRCh38"}, report.Case)
		assert.Equal(t, types.ReportOccurrence{TumorAdRatio: 0.5, TumorAdAlt: 17, TumorAdTotal: 34, NormalSeqID: 2}, report.Occurrence)
		assert.Equal(t, &types.ReportCosmic{CosmicID: "COSV56056643", SampleMutated: 99, Tier: "1"}, report.Variant.Cosmic)
		assert.Equal(t, &types.ReportGnomad{Af: 0.0000123, Ac: 2, An: 152000, Hom: 0}, report.Variant.Gnomad)
		if assert.Len(t, report.Transcripts, 1) {
			if assert.NotNil(t, report.Transcripts[0].SomaticInterpretation) {
				assert.Equal(t, "LA26332-9", report.Transcripts[0].SomaticInterpretation.Oncogenicity)
				assert.Equal(t, "category_ib", report.Transcripts[0].SomaticInterpretation.ClinicalUtility)
				assert.Equal(t, "MONDO:0000004", report.Transcripts[0].SomaticInterpretation.TumoralType)
				assert.Equal(t, []types.InterpretationPubmed{{CitationID: "1", Citation: "format1"}}, report.Transcripts[0].SomaticInterpretation.Pubmed)
			}
			assert.Nil(t, report.Transcripts[0].Interpretation)
		}
	}
}

func Test_BuildSomatic_InterpretedTranscriptWithoutMane_Kept(t *testing.T) {
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{somaticOccurrenceRow(1000)}, consequences: brafRows()}
	interpretations := &fakeInterpretations{somatic: []types.InterpretationSomatic{{
		InterpretationCommon: types.InterpretationCommon{LocusId: "1000", TranscriptId: "T001"},
		Oncogenicity:         "LA6668-3",
	}}}

	reports, err := newBuilder(data, interpretations).BuildSomatic(t.Context(), 1, 1, 5, []int{1000})

	require.NoError(t, err)
	require.Len(t, reports, 1)
	assert.Equal(t, []string{"ENST00000646891", "T001"}, transcriptIDs(reports[0].Transcripts))
	assert.Nil(t, reports[0].Transcripts[0].SomaticInterpretation)
	if assert.NotNil(t, reports[0].Transcripts[1].SomaticInterpretation) {
		assert.Equal(t, "LA6668-3", reports[0].Transcripts[1].SomaticInterpretation.Oncogenicity)
	}
}

func Test_BuildSomatic_TumorOnly_NoNormalSeq(t *testing.T) {
	row := somaticOccurrenceRow(1000)
	row.NormalSeqID = nil
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{row}}

	reports, err := newBuilder(data, &fakeInterpretations{}).BuildSomatic(t.Context(), 1, 1, 5, []int{1000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 1) {
		assert.Equal(t, 0, reports[0].Occurrence.NormalSeqID)
	}
}

func Test_BuildSomatic_CosmicWithoutMutatedSample_Absent(t *testing.T) {
	row := somaticOccurrenceRow(1000)
	row.CosmicSampleMutated = ptr(0)
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{row}}

	reports, err := newBuilder(data, &fakeInterpretations{}).BuildSomatic(t.Context(), 1, 1, 5, []int{1000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 1) {
		assert.Nil(t, reports[0].Variant.Cosmic)
	}
}

func Test_BuildSomatic_NoCosmicRow_Absent(t *testing.T) {
	row := somaticOccurrenceRow(1000)
	row.CosmicID, row.CosmicSampleMutated, row.CosmicTier = "", nil, ""
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{row}}

	reports, err := newBuilder(data, &fakeInterpretations{}).BuildSomatic(t.Context(), 1, 1, 5, []int{1000})

	assert.NoError(t, err)
	if assert.Len(t, reports, 1) {
		assert.Nil(t, reports[0].Variant.Cosmic)
	}
}

func Test_BuildSomatic_InterpretationError_Propagates(t *testing.T) {
	data := &fakeData{reportContext: &types.ReportContext{Part: 1}, occurrences: []types.ReportOccurrenceRow{somaticOccurrenceRow(1000)}}

	_, err := newBuilder(data, &fakeInterpretations{err: assert.AnError}).BuildSomatic(t.Context(), 1, 1, 5, []int{1000})

	assert.ErrorIs(t, err, assert.AnError)
	assert.ErrorContains(t, err, "list somatic interpretations")
}
