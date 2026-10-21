package report

import (
	"os"
	"path/filepath"
	"testing"

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
		assert.Regexp(t, `^[a-z_]+\.[a-z_]+$|^zygosity\.[A-Z]+$|^classification\.LA[0-9-]+$`, k)
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
