package manifest

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_Parse_RequiredColumnsOnly(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\t273\nqlin\t278\n"))
	require.NoError(t, err)
	assert.Empty(t, warnings)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 273}, {Tenant: "qlin", DocumentID: 278}}, entries)
}

func Test_Parse_AllColumnsAnyOrder(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("size\tName\tDocument_ID\tTENANT\n9080\t420010.cnv.vcf.gz\t273\tqlin\n"))
	require.NoError(t, err)
	assert.Empty(t, warnings)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 273, Name: "420010.cnv.vcf.gz", Size: 9080}}, entries)
}

func Test_Parse_SizeWithUnit(t *testing.T) {
	entries, _, err := Parse(strings.NewReader("tenant\tdocument_id\tsize\nqlin\t278\t3.1 GB\n"))
	require.NoError(t, err)
	assert.Equal(t, int64(3_100_000_000), entries[0].Size)
}

func Test_Parse_TrimsCells(t *testing.T) {
	entries, _, err := Parse(strings.NewReader("tenant\tdocument_id\tname\n qlin \t 273 \t file.cram \n"))
	require.NoError(t, err)
	assert.Equal(t, Entry{Tenant: "qlin", DocumentID: 273, Name: "file.cram"}, entries[0])
}

func Test_Parse_BlankLinesSkippedSilently(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\t273\n\t\n\n"))
	require.NoError(t, err)
	assert.Len(t, entries, 1)
	assert.Empty(t, warnings)
}

func Test_Parse_RowWithoutDocumentIDWarns(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\tname\nqlin\t273\t\nqlin\t\tlost.cram\n"))
	require.NoError(t, err)
	assert.Len(t, entries, 1)
	assert.Equal(t, []string{"line 3: no document_id, row skipped"}, warnings)
}

func Test_Parse_InvalidDocumentIDWarns(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\tabc\nqlin\t-1\nqlin\t273\n"))
	require.NoError(t, err)
	assert.Len(t, entries, 1)
	assert.Equal(t, []string{
		`line 2: invalid document_id "abc", row skipped`,
		`line 3: invalid document_id "-1", row skipped`,
	}, warnings)
}

func Test_Parse_MissingTenantWarns(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\n\t273\nqlin\t278\n"))
	require.NoError(t, err)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 278}}, entries)
	assert.Equal(t, []string{"line 2: missing tenant for document 273, row skipped"}, warnings)
}

func Test_Parse_DuplicateDocumentIDKeepsFirst(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\tname\nqlin\t273\tfirst\nqlin\t278\t\nqlin\t273\tsecond\n"))
	require.NoError(t, err)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 273, Name: "first"}, {Tenant: "qlin", DocumentID: 278}}, entries)
	assert.Equal(t, []string{"line 4: document 273 already listed on line 2, row skipped"}, warnings)
}

func Test_Parse_InvalidSizeKeepsRowAsUnknown(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\tsize\nqlin\t273\tbig\n"))
	require.NoError(t, err)
	assert.Equal(t, []Entry{{Tenant: "qlin", DocumentID: 273, Size: 0}}, entries)
	assert.Equal(t, []string{`line 2: invalid size "big" for document 273, size treated as unknown`}, warnings)
}

func Test_Parse_UnknownColumnWarns(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\tmd5\nqlin\t273\tabc\n"))
	require.NoError(t, err)
	assert.Len(t, entries, 1)
	assert.Equal(t, []string{`column "md5" is ignored (known columns: tenant, document_id, name, size)`}, warnings)
}

func Test_Parse_DuplicateColumnWarns(t *testing.T) {
	entries, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\tname\tname\nqlin\t273\ta\tb\n"))
	require.NoError(t, err)
	assert.Equal(t, "a", entries[0].Name)
	assert.Equal(t, []string{`column "name" appears twice, the first one is used`}, warnings)
}

func Test_Parse_MissingRequiredColumn(t *testing.T) {
	_, _, err := Parse(strings.NewReader("document_id\tname\n273\tx\n"))
	assert.ErrorContains(t, err, `missing column "tenant"`)
}

func Test_Parse_EmptyFile(t *testing.T) {
	_, _, err := Parse(strings.NewReader(""))
	assert.ErrorContains(t, err, "empty manifest")
}

func Test_Parse_HeaderOnly(t *testing.T) {
	_, _, err := Parse(strings.NewReader("tenant\tdocument_id\n"))
	assert.ErrorContains(t, err, "no valid document row")
}

func Test_Parse_OnlyBadRowsIsAnError(t *testing.T) {
	_, warnings, err := Parse(strings.NewReader("tenant\tdocument_id\nqlin\tabc\n"))
	assert.ErrorContains(t, err, "no valid document row")
	assert.Len(t, warnings, 1)
}
