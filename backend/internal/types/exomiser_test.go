package types

import (
	"bytes"
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test_Exomiser_ToJSON(t *testing.T) {
	var exomiser = Exomiser{
		Part:               1,
		SeqId:              12345,
		LocusId:            "locus123",
		Id:                 "exomiser123",
		LocusHash:          "hash123",
		Moi:                "AD",
		VariantScore:       0.95,
		GeneCombinedScore:  0.85,
		VariantRank:        1,
		Rank:               1,
		Symbol:             "GENE1",
		AcmgClassification: "Pathogenic",
		AcmgEvidence:       JsonArray[string]{"PVS1", "PS1"},
	}

	var expected = []byte(`{"part":1,"seq_id":12345,"locus_id":"locus123","id":"exomiser123","locus_hash":"hash123","moi":"AD","variant_score":0.95,"gene_combined_score":0.85,"variant_rank":1,"rank":1,"symbol":"GENE1","acmg_classification":"Pathogenic","acmg_evidence":["PVS1","PS1"]}`)
	jsonData, err := json.Marshal(exomiser)
	assert.Nil(t, err, "Failed to marshal Exomiser to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "Objects should be equal after unmarshalling from JSON")
}

func Test_Exomiser_FromJSON(t *testing.T) {
	var jsonData = []byte(`{"part":1,"seq_id":12345,"locus_id":"locus123","id":"exomiser123","locus_hash":"hash123","moi":"AD","variant_score":0.95,"gene_combined_score":0.85,"variant_rank":1,"rank":1,"symbol":"GENE1","acmg_classification":"Pathogenic","acmg_evidence":["PVS1","PS1"]}`)
	var expected = Exomiser{
		Part:               1,
		SeqId:              12345,
		LocusId:            "locus123",
		Id:                 "exomiser123",
		LocusHash:          "hash123",
		Moi:                "AD",
		VariantScore:       0.95,
		GeneCombinedScore:  0.85,
		VariantRank:        1,
		Rank:               1,
		Symbol:             "GENE1",
		AcmgClassification: "Pathogenic",
		AcmgEvidence:       JsonArray[string]{"PVS1", "PS1"},
	}

	var exomiser Exomiser
	err := json.Unmarshal(jsonData, &exomiser)
	assert.Nil(t, err, "Failed to unmarshal JSON to Exomiser")
	assert.Equal(t, expected, exomiser, "Objects should be equal after unmarshalling from JSON")
}

func Test_ExomiserACMGClassificationCounts_ToJSON(t *testing.T) {
	var counts = ExomiserACMGClassificationCounts{
		AcmgClassification:      "Pathogenic",
		AcmgClassificationCount: 10,
	}

	var expected = []byte(`{"acmg_classification":"Pathogenic","acmg_classification_count":10}`)
	jsonData, err := json.Marshal(counts)
	assert.Nil(t, err, "Failed to marshal ExomiserACMGClassificationCounts to JSON")

	var is_equal = bytes.Equal(expected, jsonData)
	assert.True(t, is_equal, "ExomiserACMGClassificationCounts should contain a valid JSON")
}

func Test_ExomiserACMGClassificationCounts_FromJSON(t *testing.T) {
	var jsonData = []byte(`{"acmg_classification":"Pathogenic","acmg_classification_count":10}`)
	var expected = ExomiserACMGClassificationCounts{
		AcmgClassification:      "Pathogenic",
		AcmgClassificationCount: 10,
	}

	var counts ExomiserACMGClassificationCounts
	err := json.Unmarshal(jsonData, &counts)
	assert.Nil(t, err, "Failed to unmarshal JSON to ExomiserACMGClassificationCounts")
	assert.Equal(t, expected, counts, "Objects should be equal after unmarshalling from JSON")
}
