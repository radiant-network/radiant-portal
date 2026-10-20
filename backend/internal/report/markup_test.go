package report

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_ParseMarkup_PlainText(t *testing.T) {
	assert.Equal(t, []run{{Text: "chr1:g.100A>T"}}, parseMarkup("chr1:g.100A>T"))
}

func Test_ParseMarkup_Empty(t *testing.T) {
	assert.Empty(t, parseMarkup(""))
}

func Test_ParseMarkup_Bold(t *testing.T) {
	assert.Equal(t, []run{
		{Text: "Gene: "},
		{Text: "TP53", Bold: true},
		{Text: "\nNM_000546.6"},
	}, parseMarkup("Gene: **TP53**\nNM_000546.6"))
}

func Test_ParseMarkup_WholeCellBold(t *testing.T) {
	assert.Equal(t, []run{{Text: "Pathogenic", Bold: true}}, parseMarkup("**Pathogenic**"))
}

func Test_ParseMarkup_EmptyBoldRendersNothing(t *testing.T) {
	assert.Empty(t, parseMarkup("****"))
}

func Test_ParseMarkup_UnmatchedBoldIsLiteral(t *testing.T) {
	assert.Equal(t, []run{{Text: "**a"}}, parseMarkup("**a"))
	assert.Equal(t, []run{{Text: "a ** b"}}, parseMarkup("a ** b"))
}

func Test_ParseMarkup_Italic(t *testing.T) {
	assert.Equal(t, []run{
		{Text: "Prediction "},
		{Text: "in silico", Italic: true},
		{Text: "²"},
	}, parseMarkup("Prediction _in silico_²"))
}

func Test_ParseMarkup_ItalicLine(t *testing.T) {
	assert.Equal(t, []run{
		{Text: "Gene1", Italic: true},
		{Text: "\n(MIM: 123456, AD)"},
	}, parseMarkup("_Gene1_\n(MIM: 123456, AD)"))
}

func Test_ParseMarkup_IntrawordUnderscoreIsLiteral(t *testing.T) {
	assert.Equal(t, []run{{Text: "NM_000546.6\nNM_001126112.3"}}, parseMarkup("NM_000546.6\nNM_001126112.3"))
}

func Test_ParseMarkup_BoldAndItalicNested(t *testing.T) {
	assert.Equal(t, []run{
		{Text: "a ", Bold: true},
		{Text: "b", Bold: true, Italic: true},
	}, parseMarkup("**a _b_**"))
}
