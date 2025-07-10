package types

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_MapToAggregationArray(t *testing.T) {
	var agg = MapToAggregationArray()

	assert.Len(t, agg, 5)
	assert.Equal(t, "LA6668-3", agg[0].Bucket)
	assert.Equal(t, "pathogenic", agg[0].Label)
	assert.Equal(t, "LA26332-9", agg[1].Bucket)
	assert.Equal(t, "likelyPathogenic", agg[1].Label)
	assert.Equal(t, "LA26333-7", agg[2].Bucket)
	assert.Equal(t, "vus", agg[2].Label)
	assert.Equal(t, "LA26334-5", agg[3].Bucket)
	assert.Equal(t, "likelyBenign", agg[3].Label)
	assert.Equal(t, "LA6675-8", agg[4].Bucket)
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
