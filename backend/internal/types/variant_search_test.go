package types

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func assertVariantIdentifier(t *testing.T, input string, field VariantSearchField, value string) {
	t.Helper()
	got, err := ParseVariantIdentifier(input)
	assert.NoError(t, err, "ParseVariantIdentifier(%q)", input)
	assert.Equal(t, VariantIdentifier{Field: field, Value: value}, got, "ParseVariantIdentifier(%q)", input)
}

func assertUnrecognizedVariantIdentifier(t *testing.T, input string) {
	t.Helper()
	got, err := ParseVariantIdentifier(input)
	assert.ErrorIs(t, err, ErrUnrecognizedVariantIdentifier, "ParseVariantIdentifier(%q)", input)
	assert.Equal(t, VariantIdentifier{}, got, "ParseVariantIdentifier(%q)", input)
}

func Test_ParseVariantIdentifier_Rsid(t *testing.T) {
	assertVariantIdentifier(t, "rs341", VariantSearchFieldRsnumber, "rs341")
}

func Test_ParseVariantIdentifier_RsidUpperCase(t *testing.T) {
	assertVariantIdentifier(t, "RS341", VariantSearchFieldRsnumber, "rs341")
}

func Test_ParseVariantIdentifier_RsidWithSpaces(t *testing.T) {
	assertVariantIdentifier(t, "  rs341 ", VariantSearchFieldRsnumber, "rs341")
}

func Test_ParseVariantIdentifier_ClinvarId(t *testing.T) {
	assertVariantIdentifier(t, "13961", VariantSearchFieldClinvarId, "13961")
}

func Test_ParseVariantIdentifier_HgvsgSnv(t *testing.T) {
	assertVariantIdentifier(t, "chr7:g.140753336A>T", VariantSearchFieldHgvsg, "chr7:g.140753336A>T")
}

func Test_ParseVariantIdentifier_HgvsgWithoutChr(t *testing.T) {
	assertVariantIdentifier(t, "7:g.140753336A>T", VariantSearchFieldHgvsg, "chr7:g.140753336A>T")
}

func Test_ParseVariantIdentifier_HgvsgLowerCaseBases(t *testing.T) {
	assertVariantIdentifier(t, "chr7:g.140753336a>t", VariantSearchFieldHgvsg, "chr7:g.140753336A>T")
}

func Test_ParseVariantIdentifier_HgvsgIndelUpperCase(t *testing.T) {
	assertVariantIdentifier(t, "CHR1:G.30004963_30004966DUP", VariantSearchFieldHgvsg, "chr1:g.30004963_30004966dup")
}

func Test_ParseVariantIdentifier_HgvsgDelins(t *testing.T) {
	assertVariantIdentifier(t, "chr2:g.100_101DELINSAG", VariantSearchFieldHgvsg, "chr2:g.100_101delinsAG")
}

func Test_ParseVariantIdentifier_HgvsgInsertion(t *testing.T) {
	assertVariantIdentifier(t, "chr2:g.100_101insct", VariantSearchFieldHgvsg, "chr2:g.100_101insCT")
}

func Test_ParseVariantIdentifier_HgvsgDeletionAndInversion(t *testing.T) {
	assertVariantIdentifier(t, "chr2:g.100_102DEL", VariantSearchFieldHgvsg, "chr2:g.100_102del")
	assertVariantIdentifier(t, "chr2:g.100_102INV", VariantSearchFieldHgvsg, "chr2:g.100_102inv")
}

func Test_ParseVariantIdentifier_HgvsgLowerCaseChromosomeX(t *testing.T) {
	assertVariantIdentifier(t, "chrx:g.100A>G", VariantSearchFieldHgvsg, "chrX:g.100A>G")
}

func Test_ParseVariantIdentifier_HgvsgMitochondrial(t *testing.T) {
	assertVariantIdentifier(t, "chrM:m.1551G>A", VariantSearchFieldHgvsg, "chrM:m.1551G>A")
}

func Test_ParseVariantIdentifier_HgvsgMitochondrialLowerCase(t *testing.T) {
	assertVariantIdentifier(t, "chrm:M.7471DEL", VariantSearchFieldHgvsg, "chrM:m.7471del")
}

func Test_ParseVariantIdentifier_HgvsgMitochondrialMT(t *testing.T) {
	assertVariantIdentifier(t, "chrMT:m.100A>G", VariantSearchFieldHgvsg, "chrM:m.100A>G")
}

func Test_ParseVariantIdentifier_HgvsgMitochondrialWrittenWithG(t *testing.T) {
	assertVariantIdentifier(t, "MT:g.100A>G", VariantSearchFieldHgvsg, "chrM:m.100A>G")
}

func Test_ParseVariantIdentifier_HgvsgMPrefixOnNuclearChromosome(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "chr7:m.140753336A>T")
}

func Test_ParseVariantIdentifier_HgvsgFreeText(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "7:g.hello")
}

func Test_ParseVariantIdentifier_HgvsgWithoutChange(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "chr7:g.140753336")
}

func Test_ParseVariantIdentifier_HgvsgInsertionWithoutBases(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "chr2:g.100_101ins")
}

func Test_ParseVariantIdentifier_HgvsgSubstitutionOfTwoBases(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "chr7:g.140753336AC>T")
}

func Test_ParseVariantIdentifier_Locus(t *testing.T) {
	assertVariantIdentifier(t, "8-43159045-G-A", VariantSearchFieldLocus, "8-43159045-G-A")
}

func Test_ParseVariantIdentifier_LocusWithChrAndColons(t *testing.T) {
	assertVariantIdentifier(t, "chr8:43159045:g:a", VariantSearchFieldLocus, "8-43159045-G-A")
}

func Test_ParseVariantIdentifier_LocusIndel(t *testing.T) {
	assertVariantIdentifier(t, "1-30004947-C-CAAAA", VariantSearchFieldLocus, "1-30004947-C-CAAAA")
}

func Test_ParseVariantIdentifier_LocusChromosomeY(t *testing.T) {
	assertVariantIdentifier(t, "y-2781480-g-a", VariantSearchFieldLocus, "Y-2781480-G-A")
}

func Test_ParseVariantIdentifier_LocusMitochondrialMT(t *testing.T) {
	assertVariantIdentifier(t, "chrMT-100-a-g", VariantSearchFieldLocus, "M-100-A-G")
}

func Test_ParseVariantIdentifier_Empty(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "")
}

func Test_ParseVariantIdentifier_OnlySpaces(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "   ")
}

func Test_ParseVariantIdentifier_GeneSymbol(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "BRAF")
}

func Test_ParseVariantIdentifier_RegexCharacters(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "(")
}

func Test_ParseVariantIdentifier_ClinvarAccession(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "VCV000013961")
}

func Test_ParseVariantIdentifier_ChromosomeOutOfRange(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "23-100-A-G")
	assertUnrecognizedVariantIdentifier(t, "chr0:g.100A>G")
}

func Test_ParseVariantIdentifier_ChromosomeWithLeadingZero(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "07-100-A-G")
}

func Test_ParseVariantIdentifier_LocusWithoutAlternate(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "8-43159045-G")
}

func Test_ParseVariantIdentifier_TooLong(t *testing.T) {
	assertUnrecognizedVariantIdentifier(t, "rs"+strings.Repeat("1", maxVariantSearchInputLength))
}

func Test_VariantSearchField_Column(t *testing.T) {
	for field, column := range map[VariantSearchField]string{
		VariantSearchFieldLocus:     "locus",
		VariantSearchFieldHgvsg:     "hgvsg",
		VariantSearchFieldRsnumber:  "rsnumber",
		VariantSearchFieldClinvarId: "clinvar_name",
	} {
		got, err := field.Column()
		assert.NoError(t, err, "%q.Column()", field)
		assert.Equal(t, column, got, "%q.Column()", field)
	}
}

func Test_VariantSearchField_ColumnUnknown(t *testing.T) {
	got, err := VariantSearchField("symbol").Column()
	assert.Error(t, err)
	assert.Empty(t, got)
}

func Test_VariantSearchField_ColumnEmpty(t *testing.T) {
	got, err := VariantSearchField("").Column()
	assert.Error(t, err)
	assert.Empty(t, got)
}
