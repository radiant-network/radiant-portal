package types

import (
	"fmt"
)

type Classification = struct {
	Code  string
	Label string
}

var Classifications = []Classification{
	{Code: "LA6668-3", Label: "pathogenic"},
	{Code: "LA26332-9", Label: "likelyPathogenic"},
	{Code: "LA26333-7", Label: "vus"},
	{Code: "LA26334-5", Label: "likelyBenign"},
	{Code: "LA6675-8", Label: "benign"},
}

func MapToAggregationArray() []Aggregation {
	var aggregations = make([]Aggregation, len(Classifications))
	for i, c := range Classifications {
		aggregations[i] = Aggregation{Bucket: c.Code, Label: c.Label}
	}
	return aggregations
}

func GetLabelFromCode(code string) (string, error) {
	for _, classification := range Classifications {
		if classification.Code == code {
			return classification.Label, nil
		}
	}
	return "", fmt.Errorf("unknown classification code %s", code)
}
