package types

import (
	"fmt"
	"strings"
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

// SomaticOncogenicities maps the LOINC codes the somatic form stores to the keys older rows store as is.
var SomaticOncogenicities = []Classification{
	{Code: "LA6668-3", Label: "oncogenic"},
	{Code: "LA26332-9", Label: "likely_oncogenic"},
	{Code: "LA26333-7", Label: "uncertain_significance"},
	{Code: "LA26334-5", Label: "likely_benign"},
	{Code: "LA6675-8", Label: "benign"},
}

// GetSomaticOncogenicityKey ignores case and reads a space as "_", so a stored "Likely Oncogenic" maps like "likely_oncogenic".
func GetSomaticOncogenicityKey(value string) (string, error) {
	key := strings.ReplaceAll(strings.ToLower(strings.TrimSpace(value)), " ", "_")
	for _, o := range SomaticOncogenicities {
		if strings.EqualFold(o.Code, key) || o.Label == key {
			return o.Label, nil
		}
	}
	return "", fmt.Errorf("unknown oncogenicity %s", value)
}

func MapToFiltersValueArray() []FiltersValue {
	var filtersValues = make([]FiltersValue, len(Classifications))
	for i, c := range Classifications {
		filtersValues[i] = FiltersValue{Key: c.Code, Label: c.Label}
	}
	return filtersValues
}

func GetLabelFromCode(code string) (string, error) {
	for _, classification := range Classifications {
		if classification.Code == code {
			return classification.Label, nil
		}
	}
	return "", fmt.Errorf("unknown classification code %s", code)
}
