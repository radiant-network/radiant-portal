package types

import (
	"strconv"
	"strings"
)

// MitochondrialChromosome is the canonical name of the mitochondrial chromosome, as in the variants.
// The Ensembl tables name it EnsemblMitochondrialChromosome.
const MitochondrialChromosome = "M"

// EnsemblMitochondrialChromosome is the name of the mitochondrial chromosome in the Ensembl tables.
const EnsemblMitochondrialChromosome = "MT"

// NormalizeChromosome returns the canonical name of a chromosome of the human genome given without
// the chr prefix, ignoring case: 1-22, X, Y or M (MT is read as M). It returns false when name is
// not such a chromosome.
func NormalizeChromosome(name string) (string, bool) {
	upper := strings.ToUpper(name)
	switch upper {
	case "X", "Y", MitochondrialChromosome:
		return upper, true
	case EnsemblMitochondrialChromosome:
		return MitochondrialChromosome, true
	}
	n, err := strconv.Atoi(upper)
	if err != nil || n < 1 || n > 22 || strings.HasPrefix(upper, "0") || strings.HasPrefix(upper, "+") {
		return "", false
	}
	return upper, true
}
