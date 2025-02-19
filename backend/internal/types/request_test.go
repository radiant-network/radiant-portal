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
          "value": 1640926800000
        },
        "op": ">="
      },
      {
        "content": {
          "field": "analysis.first_published_at",
          "value": 1672549199999
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
