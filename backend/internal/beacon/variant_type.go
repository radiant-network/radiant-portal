package beacon

import (
	"fmt"
	"strings"
)

// Beacon documents VCF-like variantType terms. snv__variant.variant_class carries the VEP
// variant_class vocabulary; these two tables translate between them.
const (
	classSNV          = "SNV"
	classInsertion    = "insertion"
	classDeletion     = "deletion"
	classIndel        = "indel"
	classSubstitution = "substitution"
)

var beaconTypeToClass = map[string]string{
	"SNP": classSNV, "SNV": classSNV,
	"INS": classInsertion, "INSERTION": classInsertion,
	"DEL": classDeletion, "DELETION": classDeletion,
	"INDEL": classIndel,
	"MNP":   classSubstitution, "MNV": classSubstitution, "SUBSTITUTION": classSubstitution,
}

var classToBeaconType = map[string]string{
	classSNV:          "SNP",
	classInsertion:    "INS",
	classDeletion:     "DEL",
	classIndel:        "INDEL",
	classSubstitution: "MNP",
}

// ParseVariantType maps a requested variantType to the variant_class value to filter on. Only
// small-variant terms resolve: structural (DUP, CNV, BND, EFO:…) types have no rows in the SNV
// table and are rejected rather than matched to nothing.
func ParseVariantType(t string) (string, error) {
	s := strings.ToUpper(strings.TrimSpace(t))
	if s == "" {
		return "", fmt.Errorf("variantType is empty")
	}
	if class, ok := beaconTypeToClass[s]; ok {
		return class, nil
	}
	return "", fmt.Errorf("unsupported variantType %q (this beacon serves small variants: SNP, INS, DEL, INDEL, MNP)", t)
}

// VariantTypeFor is the output direction. A known variant_class maps to its VCF term; otherwise
// the type is derived from the allele lengths so the required field is never empty.
func VariantTypeFor(variantClass, reference, alternate string) string {
	if t, ok := classToBeaconType[variantClass]; ok {
		return t
	}
	switch {
	case len(reference) == 1 && len(alternate) == 1:
		return "SNP"
	case len(reference) < len(alternate):
		return "INS"
	case len(reference) > len(alternate):
		return "DEL"
	default:
		return "MNP"
	}
}
