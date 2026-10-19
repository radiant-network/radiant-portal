package report

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func Test_Lines_SkipsEmptyParts(t *testing.T) {
	assert.Equal(t, "a\nc", lines("a", "", "c"))
	assert.Equal(t, "", lines("", ""))
}

func Test_Exon_RankAndTotal(t *testing.T) {
	assert.Equal(t, "Exon : 3/10", exon("3", "10"))
}

func Test_Exon_RankOnly(t *testing.T) {
	assert.Equal(t, "Exon : 3", exon("3", ""))
}

func Test_Exon_Empty(t *testing.T) {
	assert.Equal(t, "", exon("", ""))
}

func Test_Score_NilOrZeroIsEmpty(t *testing.T) {
	assert.Equal(t, "", score(nil))
	assert.Equal(t, "", score(ptr[float32](0)))
}

func Test_Score_ShortestDecimal(t *testing.T) {
	assert.Equal(t, "0.931", score(ptr[float32](0.931)))
	assert.Equal(t, "32", score(ptr[float32](32)))
}

func Test_Af_SevenDecimals(t *testing.T) {
	assert.Equal(t, "0.1230000", af(0.123))
	assert.Equal(t, "0.0000007", af(0.0000007))
}

func proband(zygosity, origin, father, mother string) types.ReportOccurrence {
	return types.ReportOccurrence{Zygosity: zygosity, ParentalOrigin: origin, FatherZygosity: father, MotherZygosity: mother}
}

func Test_Zygosity_UnknownOriginTrio_ShowsParentZygosities(t *testing.T) {
	assert.Equal(t, "Homozygote\n(Père hem, Mère het)", zygosity(proband("HOM", "unknown", "HEM", "HET"), true))
}

func Test_Zygosity_UnknownOriginSolo_ZygosityOnly(t *testing.T) {
	assert.Equal(t, "Homozygote", zygosity(proband("HOM", "unknown", "", ""), true))
}

func Test_Zygosity_UnknownOriginDuo_MissingParentIsRef(t *testing.T) {
	assert.Equal(t, "Homozygote\n(Père ref, Mère het)", zygosity(proband("HOM", "unknown", "", "HET"), true))
}

func Test_Zygosity_NullOrigin_SameAsUnknown(t *testing.T) {
	assert.Equal(t, "Hétérozygote\n(Père wt, Mère het)", zygosity(proband("HET", "", "WT", "HET"), true))
}

func Test_Zygosity_MotherOrigin(t *testing.T) {
	assert.Equal(t, "Homozygote\n(Mère het, Père ref)", zygosity(proband("HOM", "mother", "HEM", "HET"), true))
}

func Test_Zygosity_FatherOrigin(t *testing.T) {
	assert.Equal(t, "Homozygote\n(Père hem, Mère ref)", zygosity(proband("HOM", "father", "HEM", "HET"), true))
}

func Test_Zygosity_BothOrigin(t *testing.T) {
	assert.Equal(t, "Homozygote\n(Père hem, Mère het)", zygosity(proband("HOM", "both", "HEM", "HET"), true))
}

func Test_Zygosity_PossibleDenovoDuoMother(t *testing.T) {
	assert.Equal(t, "Hétérozygote\n(Mère ref)", zygosity(proband("HET", "possible_denovo", "", "HOM"), true))
}

func Test_Zygosity_PossibleDenovoDuoFather(t *testing.T) {
	assert.Equal(t, "Hétérozygote\n(Père ref)", zygosity(proband("HET", "possible_denovo", "HOM", ""), true))
}

func Test_Zygosity_Denovo(t *testing.T) {
	assert.Equal(t, "Hétérozygote\n(de novo)", zygosity(proband("HET", "denovo", "", ""), true))
}

func Test_Zygosity_NotProband_ZygosityOnly(t *testing.T) {
	assert.Equal(t, "Homozygote", zygosity(proband("HOM", "both", "HEM", "HET"), false))
}

func Test_Zygosity_UnknownCodeKeptRaw(t *testing.T) {
	assert.Equal(t, "UNK", zygosity(proband("UNK", "", "", ""), false))
}

func Test_Gnomad_Known(t *testing.T) {
	value := &types.ReportGnomad{Af: 0.123, Ac: 1230, An: 10, Hom: 20}
	assert.Same(t, value, gnomad(value))
}

func Test_Gnomad_NilWhenAbsent(t *testing.T) {
	assert.Nil(t, gnomad(nil))
}

func Test_Gnomad_NilWhenCountedNowhere(t *testing.T) {
	assert.Nil(t, gnomad(&types.ReportGnomad{An: 1607224}))
	assert.Nil(t, gnomad(&types.ReportGnomad{}))
}

func Test_Clinvar_Translated(t *testing.T) {
	assert.Equal(t, "Pathogénique, Non fourni", clinvar([]string{"Pathogenic", "not_provided"}))
}

func Test_Clinvar_UnknownKeptRaw(t *testing.T) {
	assert.Equal(t, "test", clinvar([]string{"test"}))
}

func Test_Clinvar_EmptyIsNoData(t *testing.T) {
	assert.Equal(t, "Aucune donnée", clinvar(nil))
}

func Test_Omim_EmptyWhenNothing(t *testing.T) {
	assert.Equal(t, "", omim(nil, nil))
	assert.Equal(t, "", omim(&types.ReportGene{}, &types.ReportGermlineInterpretation{}))
}

func Test_Omim_Phenotypes(t *testing.T) {
	gene := &types.ReportGene{Omim: []types.ReportOmim{
		{Name: "Gene1", PhenotypeID: "123456", InheritanceCode: []string{"AD"}},
		{Name: "Gene2", PhenotypeID: "789012", InheritanceCode: []string{"AR"}},
	}}
	assert.Equal(t, "_Gene1_\n(MIM : 123456, AD)\n_Gene2_\n(MIM : 789012, AR)", omim(gene, nil))
}

func Test_Omim_PhenotypeWithoutInheritance(t *testing.T) {
	gene := &types.ReportGene{Omim: []types.ReportOmim{{Name: "Gene1", PhenotypeID: "123456"}}}
	assert.Equal(t, "_Gene1_\n(MIM : 123456)", omim(gene, nil))
}

func Test_Omim_Pubmed(t *testing.T) {
	interpretation := &types.ReportGermlineInterpretation{Pubmed: []types.InterpretationPubmed{{CitationID: "987654"}, {CitationID: "321098"}}}
	assert.Equal(t, "PMID : 987654\nPMID : 321098", omim(nil, interpretation))
}

func Test_Omim_PhenotypesAndPubmed(t *testing.T) {
	gene := &types.ReportGene{Omim: []types.ReportOmim{{Name: "Gene1", PhenotypeID: "123456", InheritanceCode: []string{"AD"}}}}
	interpretation := &types.ReportGermlineInterpretation{Pubmed: []types.InterpretationPubmed{{CitationID: "987654"}}}
	assert.Equal(t, "_Gene1_\n(MIM : 123456, AD)\nPMID : 987654", omim(gene, interpretation))
}

func Test_Classification_Translated(t *testing.T) {
	assert.Equal(t, "Pathogénique", classification(&types.ReportGermlineInterpretation{Classification: "LA6668-3"}))
	assert.Equal(t, "Variant de signification incertaine", classification(&types.ReportGermlineInterpretation{Classification: "LA26333-7"}))
}

func Test_Classification_NilOrUnknownIsEmpty(t *testing.T) {
	assert.Equal(t, "", classification(nil))
	assert.Equal(t, "", classification(&types.ReportGermlineInterpretation{Classification: "LA0-0"}))
}

func Test_Mane_SelectUsesRefseqPair(t *testing.T) {
	transcript := types.ReportTranscript{TranscriptID: "ENST1", RefseqIDs: []string{"NM_1.1"}, IsManeSelect: true, IsCanonical: true}
	assert.Equal(t, "MANE Select (NM_1.1)\nEnsembl Canonical (ENST1)", mane(transcript))
}

func Test_Mane_PlusWithoutRefseqUsesTranscript(t *testing.T) {
	assert.Equal(t, "MANE Plus (ENST1)\n", mane(types.ReportTranscript{TranscriptID: "ENST1", IsManePlus: true}))
}

func Test_Mane_NoFlagIsEmpty(t *testing.T) {
	assert.Equal(t, "", mane(types.ReportTranscript{TranscriptID: "ENST1"}))
}

func Test_Citations_SkipsUnresolved(t *testing.T) {
	pubmed := []types.InterpretationPubmed{{CitationID: "1", Citation: "A."}, {CitationID: "2"}, {CitationID: "3", Citation: "C."}}
	assert.Equal(t, "A.\nC.", citations(pubmed))
}

func Test_Citations_Empty(t *testing.T) {
	assert.Equal(t, "", citations(nil))
}
