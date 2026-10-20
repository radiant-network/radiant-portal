package report

import (
	"context"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// en is the embedded default label set, what every helper test asserts against.
var en = func() labelSet {
	defaults, err := defaultLabels()
	if err != nil {
		panic(err)
	}
	return labelSet{defaults: defaults}
}()

func writeLabels(t *testing.T, dir, tenant, content string) {
	t.Helper()
	require.NoError(t, os.WriteFile(filepath.Join(dir, labelFileName(tenant)), []byte(content), 0o600))
}

func Test_DefaultLabels_HoldEveryKeyAndNothingElse(t *testing.T) {
	expected := map[string]bool{}
	for _, k := range labelKeys {
		expected[k] = true
		assert.NotEmpty(t, en.defaults[k], k)
	}
	for k := range en.defaults {
		assert.True(t, expected[k], "unexpected key %s", k)
	}
}

func Test_LabelKeys_LowerCaseUnlessCode(t *testing.T) {
	for _, k := range labelKeys {
		assert.Regexp(t, `^[a-z_]+\.[a-z_0-9]+$|^zygosity\.[A-Z]+$|^(classification|oncogenicity)\.LA[0-9-]+$`, k)
	}
}

func Test_LoadLabelFile_MissingIsNotAnError(t *testing.T) {
	file, missing, err := loadLabelFile(t.TempDir(), "qlin")
	require.NoError(t, err)
	assert.Nil(t, file)
	assert.Nil(t, missing)
}

func Test_LoadLabelFile_ReportsMissingKeys(t *testing.T) {
	dir := t.TempDir()
	writeLabels(t, dir, "qlin", `{"zygosity.HET": "Hz", "extra": "ignored"}`)

	file, missing, err := loadLabelFile(dir, "qlin")

	require.NoError(t, err)
	assert.Equal(t, "Hz", file["zygosity.HET"])
	assert.Len(t, missing, len(labelKeys)-1)
	assert.NotContains(t, missing, "zygosity.HET")
}

func Test_LoadLabelFile_BadJSON(t *testing.T) {
	dir := t.TempDir()
	writeLabels(t, dir, "qlin", `{`)

	_, _, err := loadLabelFile(dir, "qlin")

	assert.ErrorContains(t, err, "parse labels")
}

func Test_LabelSet_TenantOverDefaultOverKey(t *testing.T) {
	set := labelSet{tenant: labels{"zygosity.HET": "Hz"}, defaults: labels{"zygosity.HET": "Het", "zygosity.HOM": "Hom"}}
	assert.Equal(t, "Hz", set.get("zygosity.HET"))
	assert.Equal(t, "Hom", set.get("zygosity.HOM"))
	assert.Equal(t, "zygosity.XYZ", set.get("zygosity.XYZ"))
}

func Test_LabelsFromFilename(t *testing.T) {
	tenant, ok := labelsFromFilename("transcripts_qlin.json")
	assert.True(t, ok)
	assert.Equal(t, "qlin", tenant)
	for _, name := range []string{"transcripts_.json", "transcripts_germline_qlin.xlsx", "labels_qlin.json"} {
		_, ok := labelsFromFilename(name)
		assert.False(t, ok, name)
	}
}

// recordingHandler keeps the warnings emitted while a test runs.
type recordingHandler struct {
	slog.Handler
	records *[]slog.Record
}

func (h recordingHandler) Handle(_ context.Context, r slog.Record) error {
	*h.records = append(*h.records, r)
	return nil
}

func captureLogs(t *testing.T) *[]slog.Record {
	t.Helper()
	records := &[]slog.Record{}
	previous := slog.Default()
	slog.SetDefault(slog.New(recordingHandler{Handler: previous.Handler(), records: records}))
	t.Cleanup(func() { slog.SetDefault(previous) })
	return records
}

func Test_LabelSet_UnknownValue_LoggedOnceAndRecorded(t *testing.T) {
	records := captureLogs(t)
	set := labelSet{name: "qlin", defaults: en.defaults, misses: &sync.Map{}}

	assert.Equal(t, "weird", set.clinvar([]string{"weird"}))
	assert.Equal(t, "weird", set.clinvar([]string{"weird"}))
	assert.Equal(t, "UNK", set.zygosity(proband("UNK", "", "", ""), false))

	require.Len(t, *records, 2)
	assert.Equal(t, "report label unknown value, raw value rendered", (*records)[0].Message)
	assert.True(t, hasMisses(set.misses))
	_, clinvarMissed := set.misses.Load("clinvar.weird")
	_, zygosityMissed := set.misses.Load("zygosity.UNK")
	assert.True(t, clinvarMissed)
	assert.True(t, zygosityMissed)
}

func Test_LabelSet_KnownValue_NotRecorded(t *testing.T) {
	set := labelSet{name: "qlin", defaults: en.defaults, misses: &sync.Map{}}

	assert.Equal(t, "Pathogenic", set.clinvar([]string{"Pathogenic"}))
	assert.Equal(t, "", set.classification(&types.ReportGermlineInterpretation{}))

	assert.False(t, hasMisses(set.misses))
}
