package notification

import (
	"bytes"
	"strings"
	"testing"

	"github.com/radiant-network/radiant-api/internal/cli/manifest"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func sampleDocs() []types.CaseGroupDocumentRow {
	return []types.CaseGroupDocumentRow{
		{DocumentID: 10, Name: "S1.cram", Size: 100, DataTypeCode: "alignment", FormatCode: "cram", SubmitterSampleID: "S1", PatientID: 3, CaseID: 1, DiagnosisLabCode: "LDM-A"},
		{DocumentID: 11, Name: "S1.cram.crai", Size: 5, DataTypeCode: "alignment", FormatCode: "crai", SubmitterSampleID: "S1", PatientID: 3, CaseID: 1, DiagnosisLabCode: "LDM-A"},
		{DocumentID: 12, Name: "fam.vcf.gz", Size: 40, DataTypeCode: "snv", FormatCode: "vcf", SubmitterSampleID: "S2", PatientID: 4, CaseID: 1, DiagnosisLabCode: "LDM-A"},
		{DocumentID: 12, Name: "fam.vcf.gz", Size: 40, DataTypeCode: "snv", FormatCode: "vcf", SubmitterSampleID: "S1", PatientID: 3, CaseID: 1, DiagnosisLabCode: "LDM-A"},
	}
}

func Test_manifestRows_FoldsDuplicateDocumentsJoiningIds(t *testing.T) {
	rows := manifestRows("qlin", sampleDocs())
	require.Len(t, rows, 3)
	assert.Equal(t, 10, rows[0].DocumentID, "first-seen order is kept")
	fam := rows[2]
	assert.Equal(t, 12, fam.DocumentID)
	assert.Equal(t, "S1;S2", fam.SubmitterSampleID)
	assert.Equal(t, "3;4", fam.PatientID)
	assert.Equal(t, "1", fam.CaseID)
	assert.Equal(t, "qlin", fam.Tenant)
}

func Test_manifestRows_MissingSampleLeavesBlank(t *testing.T) {
	rows := manifestRows("qlin", []types.CaseGroupDocumentRow{{DocumentID: 1, Name: "x", CaseID: 7}})
	require.Len(t, rows, 1)
	assert.Equal(t, "", rows[0].SubmitterSampleID)
	assert.Equal(t, "", rows[0].PatientID)
	assert.Equal(t, "7", rows[0].CaseID)
}

func Test_WriteManifest_HeaderAndRows(t *testing.T) {
	var buf bytes.Buffer
	require.NoError(t, WriteManifest(&buf, manifestRows("qlin", sampleDocs())))
	lines := strings.Split(strings.TrimRight(buf.String(), "\n"), "\n")
	require.Len(t, lines, 4)
	assert.Equal(t, "tenant\tdocument_id\tname\tsize\tdata_type\tformat\tsubmitter_sample_id\tpatient_id\tcase_id", lines[0])
	assert.Equal(t, "qlin\t10\tS1.cram\t100\talignment\tcram\tS1\t3\t1", lines[1])
	assert.Equal(t, "qlin\t12\tfam.vcf.gz\t40\tsnv\tvcf\tS1;S2\t3;4\t1", lines[3])
}

// Contract with radiant-client: whatever the API writes, the CLI reads without a single warning.
func Test_WriteManifest_ParsesWithCLIWithoutWarnings(t *testing.T) {
	var buf bytes.Buffer
	require.NoError(t, WriteManifest(&buf, manifestRows("qlin", sampleDocs())))

	entries, warnings, err := manifest.Parse(&buf)
	require.NoError(t, err)
	assert.Empty(t, warnings)
	assert.Equal(t, []manifest.Entry{
		{Tenant: "qlin", DocumentID: 10, Name: "S1.cram", Size: 100},
		{Tenant: "qlin", DocumentID: 11, Name: "S1.cram.crai", Size: 5},
		{Tenant: "qlin", DocumentID: 12, Name: "fam.vcf.gz", Size: 40},
	}, entries)
}

func Test_WriteManifest_EmptyRows_HeaderOnly(t *testing.T) {
	var buf bytes.Buffer
	require.NoError(t, WriteManifest(&buf, nil))
	assert.Equal(t, 1, strings.Count(buf.String(), "\n"))
}
