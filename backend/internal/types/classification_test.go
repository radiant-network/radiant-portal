package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_MapToAggregationArray(t *testing.T) {
	var agg = MapToFiltersValueArray()

	assert.Len(t, agg, 5)
	assert.Equal(t, "LA6668-3", agg[0].Key)
	assert.Equal(t, "pathogenic", agg[0].Label)
	assert.Equal(t, "LA26332-9", agg[1].Key)
	assert.Equal(t, "likelyPathogenic", agg[1].Label)
	assert.Equal(t, "LA26333-7", agg[2].Key)
	assert.Equal(t, "vus", agg[2].Label)
	assert.Equal(t, "LA26334-5", agg[3].Key)
	assert.Equal(t, "likelyBenign", agg[3].Label)
	assert.Equal(t, "LA6675-8", agg[4].Key)
	assert.Equal(t, "benign", agg[4].Label)
}

func Test_GetLabelFromCode_NotFound(t *testing.T) {
	label, err := GetLabelFromCode("INVALID")

	assert.Error(t, err)
	assert.Equal(t, "", label)
}

func Test_GetLabelFromCodeFound(t *testing.T) {
	label, err := GetLabelFromCode("LA6675-8")

	assert.NoError(t, err)
	assert.Equal(t, "benign", label)
}

func Test_GetSomaticOncogenicityKey_FromLoincCode(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("LA26332-9")

	assert.NoError(t, err)
	assert.Equal(t, "likely_oncogenic", key)
}

func Test_GetSomaticOncogenicityKey_FromStoredKey(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("oncogenic")

	assert.NoError(t, err)
	assert.Equal(t, "oncogenic", key)
}

func Test_GetSomaticOncogenicityKey_IgnoresCase(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("Oncogenic")

	assert.NoError(t, err)
	assert.Equal(t, "oncogenic", key)
}

func Test_GetSomaticOncogenicityKey_ReadsSpaceAsUnderscore(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("Likely Oncogenic")

	assert.NoError(t, err)
	assert.Equal(t, "likely_oncogenic", key)
}

func Test_GetSomaticOncogenicityKey_LowercaseLoincCode(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("la6668-3")

	assert.NoError(t, err)
	assert.Equal(t, "oncogenic", key)
}

func Test_GetSomaticOncogenicityKey_Unknown(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("tier_1")

	assert.Error(t, err)
	assert.Equal(t, "", key)
}

func Test_GetSomaticOncogenicityKey_Empty(t *testing.T) {
	key, err := GetSomaticOncogenicityKey("")

	assert.Error(t, err)
	assert.Equal(t, "", key)
}
