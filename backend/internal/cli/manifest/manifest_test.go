package manifest

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Parse_RequiredColumnsOnly(t *testing.T) {
	entries, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\t273\nqlin\t278\n"))
	require.NoError(t, err)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 273}, {Tenant: "qlin", DocumentID: 278}}, entries)
}

func Test_Parse_AllColumnsAnyOrder(t *testing.T) {
	entries, err := Parse(strings.NewReader("size\tName\tDocument_ID\tTENANT\n9080\t420010.cnv.vcf.gz\t273\tqlin\n"))
	require.NoError(t, err)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 273, Name: "420010.cnv.vcf.gz", Size: 9080}}, entries)
}

func Test_Parse_SizeWithUnit(t *testing.T) {
	entries, err := Parse(strings.NewReader("tenant\tdocument_id\tsize\nqlin\t278\t3.1 GB\n"))
	require.NoError(t, err)
	assert.Equal(t, int64(3_100_000_000), entries[0].Size)
}

func Test_Parse_SkipsRowsWithoutDocumentID(t *testing.T) {
	entries, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\t273\n\t\n\nqlin\t\n"))
	require.NoError(t, err)
	assert.Len(t, entries, 1)
}

func Test_Parse_TrimsCells(t *testing.T) {
	entries, err := Parse(strings.NewReader("tenant\tdocument_id\tname\n qlin \t 273 \t file.cram \n"))
	require.NoError(t, err)
	assert.Equal(t, Entry{Tenant: "qlin", DocumentID: 273, Name: "file.cram"}, entries[0])
}

func Test_Parse_MissingRequiredColumn(t *testing.T) {
	_, err := Parse(strings.NewReader("document_id\tname\n273\tx\n"))
	assert.ErrorContains(t, err, `missing column "tenant"`)
}

func Test_Parse_InvalidDocumentID(t *testing.T) {
	_, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\tabc\n"))
	assert.ErrorContains(t, err, `line 2: invalid document_id "abc"`)
}

func Test_Parse_NegativeDocumentID(t *testing.T) {
	_, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\t-1\n"))
	assert.ErrorContains(t, err, "invalid document_id")
}

func Test_Parse_MissingTenantOnRow(t *testing.T) {
	_, err := Parse(strings.NewReader("tenant\tdocument_id\n\t273\n"))
	assert.ErrorContains(t, err, "line 2: missing tenant")
}

func Test_Parse_InvalidSize(t *testing.T) {
	_, err := Parse(strings.NewReader("tenant\tdocument_id\tsize\nqlin\t273\tbig\n"))
	assert.ErrorContains(t, err, "line 2: invalid size")
}

func Test_Parse_EmptyFile(t *testing.T) {
	_, err := Parse(strings.NewReader(""))
	assert.ErrorContains(t, err, "empty manifest")
}

func Test_Parse_HeaderOnly(t *testing.T) {
	_, err := Parse(strings.NewReader("tenant\tdocument_id\n"))
	assert.ErrorContains(t, err, "no documents")
}
