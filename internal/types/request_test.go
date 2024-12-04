package types

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
)

func parse(jsonData string) (*SQON, error) {
	var sqon SQON
	return &sqon, json.Unmarshal([]byte(jsonData), &sqon)
}
func Test_Unmarshall_SQON_Return_Expected_Struct(t *testing.T) {
	t.Parallel()
	jsonData := `{
		"op": "or",
		"content": [
			{ "op": "in", "field": "age", "value": [30, 40] },
			{ "op": "and", "content": [
				{ "op": "in", "field": "age", "value": [10, 20] },
				{ "op": ">=", "field": "salary", "value": 50000 }
			]},
			{ "op": "in", "field": "clinvar_interpretations", "value": ["pathogenic", "likely_pathogenic"] },
			{ "op": "not", "content": [
				{ "op": "not-in", "field": "city", "value": ["New York", "Los Angeles"] }
			]}
		]
	}`

	sqon, err := parse(jsonData)
	assert.NoError(t, err)
	assert.NotNil(t, sqon)
}
