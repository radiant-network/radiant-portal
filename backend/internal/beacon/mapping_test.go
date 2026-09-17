package beacon

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_ParseReferenceName_Bare(t *testing.T) {
	chr, err := ParseReferenceName("17")
	require.NoError(t, err)
	assert.Equal(t, "17", chr)
}

func Test_ParseReferenceName_ChrPrefix_CaseInsensitive(t *testing.T) {
	chr, err := ParseReferenceName("ChrX")
	require.NoError(t, err)
	assert.Equal(t, "X", chr)
}

func Test_ParseReferenceName_RefSeqAccession(t *testing.T) {
	chr, err := ParseReferenceName("NC_000017.11")
	require.NoError(t, err)
	assert.Equal(t, "17", chr)
}

func Test_ParseReferenceName_RefSeqCurie(t *testing.T) {
	chr, err := ParseReferenceName("refseq:NC_012920.1")
	require.NoError(t, err)
	assert.Equal(t, "M", chr)
}

func Test_ParseReferenceName_MitochondrialAliases(t *testing.T) {
	for _, in := range []string{"MT", "chrM", "chrMT", "M"} {
		chr, err := ParseReferenceName(in)
		require.NoError(t, err, in)
		assert.Equal(t, "M", chr, in)
	}
}

func Test_ParseReferenceName_Empty_Error(t *testing.T) {
	_, err := ParseReferenceName("")
	assert.Error(t, err)
}

func Test_ParseReferenceName_Unknown_Error(t *testing.T) {
	_, err := ParseReferenceName("chr23")
	assert.Error(t, err)
}

func Test_ParseReferenceName_GRCh37Accession_Error(t *testing.T) {
	_, err := ParseReferenceName("NC_000017.10")
	assert.Error(t, err)
}

func Test_RefSeqID_Known(t *testing.T) {
	assert.Equal(t, "refseq:NC_000017.11", RefSeqID("17"))
}

func Test_RefSeqID_Unknown_PassedThrough(t *testing.T) {
	assert.Equal(t, "Un", RefSeqID("Un"))
}

func Test_ParseAssemblyID_Accepted(t *testing.T) {
	for _, in := range []string{"", "GRCh38", "grch38", "GRCh38.p14", "hg38"} {
		assert.NoError(t, ParseAssemblyID(in), in)
	}
}

func Test_ParseAssemblyID_Rejected(t *testing.T) {
	assert.Error(t, ParseAssemblyID("GRCh37"))
	assert.Error(t, ParseAssemblyID("hg19"))
}

func Test_ParseVariantType_Known(t *testing.T) {
	for in, want := range map[string]string{"SNP": "SNV", "snv": "SNV", "INS": "insertion", "DEL": "deletion", "INDEL": "indel", "MNP": "substitution"} {
		got, err := ParseVariantType(in)
		require.NoError(t, err, in)
		assert.Equal(t, want, got, in)
	}
}

func Test_ParseVariantType_Empty_Error(t *testing.T) {
	_, err := ParseVariantType("")
	assert.Error(t, err)
}

func Test_ParseVariantType_Structural_Error(t *testing.T) {
	_, err := ParseVariantType("EFO:0030070")
	assert.Error(t, err)
	_, err = ParseVariantType("DUP")
	assert.Error(t, err)
}

func Test_VariantTypeFor_KnownClass(t *testing.T) {
	assert.Equal(t, "SNP", VariantTypeFor("SNV", "C", "T"))
	assert.Equal(t, "DEL", VariantTypeFor("deletion", "CT", "C"))
}

func Test_VariantTypeFor_UnknownClass_DerivedFromAlleles(t *testing.T) {
	assert.Equal(t, "SNP", VariantTypeFor("", "C", "T"))
	assert.Equal(t, "INS", VariantTypeFor("weird", "C", "CTT"))
	assert.Equal(t, "DEL", VariantTypeFor("", "CTT", "C"))
	assert.Equal(t, "MNP", VariantTypeFor("", "CT", "AG"))
}

func Test_NormalizeAminoacidChange_OneLetter(t *testing.T) {
	got, err := NormalizeAminoacidChange("V600E")
	require.NoError(t, err)
	assert.Equal(t, "p.Val600Glu", got)
}

func Test_NormalizeAminoacidChange_OneLetterStopAndSynonymous(t *testing.T) {
	got, err := NormalizeAminoacidChange("R175*")
	require.NoError(t, err)
	assert.Equal(t, "p.Arg175Ter", got)
	got, err = NormalizeAminoacidChange("R175=")
	require.NoError(t, err)
	assert.Equal(t, "p.Arg175=", got)
}

func Test_NormalizeAminoacidChange_ThreeLetterWithAndWithoutPrefix(t *testing.T) {
	for _, in := range []string{"p.Arg175His", "Arg175His"} {
		got, err := NormalizeAminoacidChange(in)
		require.NoError(t, err, in)
		assert.Equal(t, "p.Arg175His", got)
	}
}

func Test_NormalizeAminoacidChange_Empty_Error(t *testing.T) {
	_, err := NormalizeAminoacidChange("")
	assert.Error(t, err)
}

func Test_NormalizeAminoacidChange_Unknown_Error(t *testing.T) {
	_, err := NormalizeAminoacidChange("p.Foo175His")
	assert.Error(t, err)
	_, err = NormalizeAminoacidChange("175H")
	assert.Error(t, err)
}

func Test_ShortAminoacidChange(t *testing.T) {
	assert.Equal(t, "R175H", ShortAminoacidChange("p.Arg175His"))
	assert.Equal(t, "R175*", ShortAminoacidChange("p.Arg175Ter"))
	assert.Equal(t, "p.Arg175fs", ShortAminoacidChange("p.Arg175fs"))
}

func Test_Granularity_Parse(t *testing.T) {
	g, err := ParseGranularity("")
	require.NoError(t, err)
	assert.Equal(t, DefaultGranularity, g)
	g, err = ParseGranularity("record")
	require.NoError(t, err)
	assert.Equal(t, GranularityRecord, g)
	_, err = ParseGranularity("all")
	assert.Error(t, err)
}

func Test_Granularity_Clamp(t *testing.T) {
	assert.Equal(t, GranularityCount, Clamp(GranularityRecord, GranularityCount))
	assert.Equal(t, GranularityBoolean, Clamp(GranularityBoolean, GranularityRecord))
	assert.Equal(t, GranularityRecord, Clamp(GranularityRecord, GranularityRecord))
}

func intp(i int) *int         { return &i }
func f64p(f float64) *float64 { return &f }
func i64p(i int64) *int64     { return &i }

func fullVariant() types.BeaconVariant {
	return types.BeaconVariant{
		LocusID: 1000, Chromosome: "17", Start: 7674220, End: i64p(7674220), Reference: "C", Alternate: "T",
		VariantClass: "SNV", Symbol: "TP53", Hgvsg: "chr17:g.7674220C>T", Rsnumber: "rs28934578", AaChange: "p.Arg175His",
		ClinvarName: "VCV000012374", Consequences: types.JsonArray[string]{"missense_variant"},
		GermlinePcWgs: intp(3), GermlinePnWgs: intp(412), GermlinePfWgs: f64p(0.0073),
		GermlinePcWxs: intp(0), GermlinePnWxs: intp(0), GermlinePfWxs: f64p(0),
		SomaticPcTnWgs: intp(1), SomaticPnTnWgs: intp(20), SomaticPfTnWgs: f64p(0.05),
		GnomadV3Af: f64p(0.00001),
	}
}

func Test_ToGenomicVariation_FullRow(t *testing.T) {
	doc := ToGenomicVariation(fullVariant(), "https://api.example.org/radiant/beacon")

	assert.Equal(t, "1000", doc.VariantInternalID)
	assert.Equal(t, "SNP", doc.Variation.VariantType)
	assert.Equal(t, "C", doc.Variation.ReferenceBases)
	assert.Equal(t, "refseq:NC_000017.11", doc.Variation.Location.SequenceID)
	assert.Equal(t, int64(7674219), doc.Variation.Location.Interval.Start.Value)
	assert.Equal(t, int64(7674220), doc.Variation.Location.Interval.End.Value)

	require.NotNil(t, doc.Identifiers)
	assert.Equal(t, "chr17:g.7674220C>T", doc.Identifiers.GenomicHGVSID)
	assert.Equal(t, "VCV000012374", doc.Identifiers.ClinvarVariantID)
	assert.Equal(t, []string{"dbSNP:rs28934578"}, doc.Identifiers.VariantAlternativeIDs)

	require.NotNil(t, doc.MolecularAttributes)
	assert.Equal(t, []string{"TP53"}, doc.MolecularAttributes.GeneIDs)
	assert.Equal(t, []string{"R175H"}, doc.MolecularAttributes.AminoacidChanges)

	require.Len(t, doc.FrequencyInPopulations, 2)
	cohort := doc.FrequencyInPopulations[0]
	assert.Equal(t, "https://api.example.org/radiant/beacon", cohort.SourceReference)
	require.Len(t, cohort.Frequencies, 2, "WXS has pn=0 and must be omitted")
	assert.Equal(t, "germline WGS", cohort.Frequencies[0].Population)
	assert.Equal(t, 0.0073, cohort.Frequencies[0].AlleleFrequency)
	assert.Equal(t, 3, cohort.Frequencies[0].Info["participant_count"])
	assert.Equal(t, 412, cohort.Frequencies[0].Info["participant_number"])
	assert.Equal(t, "somatic tumor-normal WGS", cohort.Frequencies[1].Population)
	assert.Equal(t, "gnomAD", doc.FrequencyInPopulations[1].Source)
	assert.Equal(t, 0.00001, doc.FrequencyInPopulations[1].Frequencies[0].AlleleFrequency)

	assert.Equal(t, "SNV", doc.Info["variant_class"])
	assert.Equal(t, []string{"missense_variant"}, doc.Info["consequences"])
}

func Test_ToGenomicVariation_SparseRow(t *testing.T) {
	doc := ToGenomicVariation(types.BeaconVariant{LocusID: 7, Chromosome: "1", Start: 100, Reference: "AT", Alternate: "A"}, "ref")

	assert.Equal(t, "DEL", doc.Variation.VariantType)
	assert.Equal(t, int64(99), doc.Variation.Location.Interval.Start.Value)
	assert.Equal(t, int64(101), doc.Variation.Location.Interval.End.Value, "end derived from reference length when the column is null")
	assert.Nil(t, doc.Identifiers)
	assert.Nil(t, doc.MolecularAttributes)
	assert.Nil(t, doc.FrequencyInPopulations)
	assert.Nil(t, doc.Info)
}

func Test_ToDataset(t *testing.T) {
	d := ToDataset(types.Project{ID: 1, Code: "N1", Name: "NeuroDev Phase I", Description: "Phase one"})
	assert.Equal(t, Dataset{ID: "N1", Name: "NeuroDev Phase I", Description: "Phase one", Info: map[string]any{"radiant_project_id": 1}}, d)
}
