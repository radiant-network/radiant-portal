package types

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func parse(jsonData string) (*Sqon, error) {
	var sqon Sqon
	return &sqon, json.Unmarshal([]byte(jsonData), &sqon)
}
func Test_Unmarshall_SQON_Return_Expected_Struct(t *testing.T) {
	t.Parallel()
	jsonData := `{
    "content": [
      {
        "content": {
          "field": "analysis.experiment.sequencing_instrument",
          "value": [
            "Illumina NextSeq 550"
          ]
        },
        "op": "in"
      },
      {
        "content": {
          "field": "analysis.first_published_at",
          "value": [1640926800000]
        },
        "op": ">="
      },
      {
        "content": {
          "field": "analysis.first_published_at",
          "value": [1672549199999]
        },
        "op": "<="
      },
      {
        "content": {
          "field": "analysis.host.host_age_bin",
          "value": [
            "20 - 29"
          ]
        },
        "op": "in"
      },
      {
        "content": {
          "field": "analysis.sample_collection.geo_loc_province",
          "value": [
            "Ontario"
          ]
        },
        "op": "in"
      }
    ],
    "op": "and"
}`

	sqon, err := parse(jsonData)
	assert.NoError(t, err)
	assert.NotNil(t, sqon)
}

func Test_Unmarshall_SQON_Keeps_OverrideValuesName(t *testing.T) {
	t.Parallel()
	jsonData := `{"op": "in", "content": {"field": "comphet_of", "value": ["-8889630551825186816"], "overrideValuesName": "chr1:g.169542092T>C"}}`
	sqon, err := parse(jsonData)
	assert.NoError(t, err)
	assert.Equal(t, LeafContent{
		Field:              "comphet_of",
		Value:              []interface{}{"-8889630551825186816"},
		OverrideValuesName: "chr1:g.169542092T>C",
	}, sqon.Content)

	out, err := json.Marshal(sqon)
	assert.NoError(t, err)
	assert.JSONEq(t, jsonData, string(out))
}

func Test_Marshall_SQON_Without_OverrideValuesName_Omits_It(t *testing.T) {
	t.Parallel()
	jsonData := `{"op": "in", "content": {"field": "chromosome", "value": ["1"]}}`
	sqon, err := parse(jsonData)
	assert.NoError(t, err)

	out, err := json.Marshal(sqon)
	assert.NoError(t, err)
	assert.JSONEq(t, jsonData, string(out))
}
