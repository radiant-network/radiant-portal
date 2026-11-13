package types

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// PartsPerVariantPart mirrors PARTS_PER_VARIANT_PART of the ETL: variant part n of snv__variant_partitioned
// holds the variants of the occurrence parts 10n to 10n + 9. Changing it on one side only silently breaks the search.
const PartsPerVariantPart = 10

const maxVariantSearchInputLength = 2000

var VariantPartitionedTable = Table{
	Name:      "snv__variant_partitioned",
	Alias:     "vp",
	PerTenant: true,
}

type VariantSearchStatus string

const (
	VariantSearchFound              VariantSearchStatus = "found"
	VariantSearchNotFoundInRun      VariantSearchStatus = "not_found_in_run"
	VariantSearchUnrecognizedFormat VariantSearchStatus = "unrecognized_format"
)

type VariantSearchField string

const (
	VariantSearchFieldLocus     VariantSearchField = "locus"
	VariantSearchFieldHgvsg     VariantSearchField = "hgvsg"
	VariantSearchFieldRsnumber  VariantSearchField = "rsnumber"
	VariantSearchFieldClinvarId VariantSearchField = "clinvar_id"
)

func (f VariantSearchField) Column() (string, error) {
	switch f {
	case VariantSearchFieldLocus:
		return "locus", nil
	case VariantSearchFieldHgvsg:
		return "hgvsg", nil
	case VariantSearchFieldRsnumber:
		return "rsnumber", nil
	case VariantSearchFieldClinvarId:
		return "clinvar_name", nil
	default:
		return "", fmt.Errorf("unknown variant search field %q", f)
	}
}

type VariantIdentifier struct {
	Field VariantSearchField
	Value string
}

// VariantSearchBody - Body of a search by variant identifier
// @Description Body of a search by variant identifier: a locus, an HGVSg, an rsID or a ClinVar variation ID
type VariantSearchBody struct {
	Input string `json:"input" validate:"required"`
} // @name VariantSearchBody

// VariantSearchHit - A variant of the run matching the searched identifier
// @Description A variant of the run matching the searched identifier
type VariantSearchHit struct {
	Hgvsg     string `json:"hgvsg" validate:"required"`
	Locus     string `json:"locus" validate:"required"`
	Rsnumber  string `json:"rsnumber,omitempty"`
	ClinvarId string `json:"clinvar_id,omitempty"`
	Symbol    string `json:"symbol,omitempty"`
	AaChange  string `json:"aa_change,omitempty"`
} // @name VariantSearchHit

// VariantSearchResult - Result of a search by variant identifier in a run
// @Description Result of a search by variant identifier in a run
type VariantSearchResult struct {
	Status          VariantSearchStatus `json:"status" validate:"required"`
	MatchedField    VariantSearchField  `json:"matched_field,omitempty"`
	NormalizedInput string              `json:"normalized_input,omitempty"`
	Variants        []VariantSearchHit  `json:"variants" validate:"required"`
} // @name VariantSearchResult

var (
	rsidPattern      = regexp.MustCompile(`^(?i)rs(\d+)$`)
	clinvarIdPattern = regexp.MustCompile(`^\d+$`)
	hgvsgPattern     = regexp.MustCompile(`^(?i)(?:chr)?([0-9]{1,2}|X|Y|MT|M):([gm])\.(.+)$`)
	hgvsgChange      = regexp.MustCompile(`^\d+(?:_\d+)?(?:[ACGTN]>[ACGTN]|delins[ACGTN]+|del[ACGTN]*|ins[ACGTN]+|dup[ACGTN]*|inv[ACGTN]*)$`)
	locusPattern     = regexp.MustCompile(`^(?i)(?:chr)?([0-9]{1,2}|X|Y|MT|M)[-:](\d+)[-:]([ACGTN]+)[-:]([ACGTN]+)$`)
	hgvsKeywords     = strings.NewReplacer("DELINS", "delins", "DEL", "del", "INS", "ins", "DUP", "dup", "INV", "inv")
)

var ErrUnrecognizedVariantIdentifier = errors.New("unrecognized variant identifier")

// ParseVariantIdentifier detects which identifier the input is and normalizes it to the form snv__variant stores.
func ParseVariantIdentifier(input string) (VariantIdentifier, error) {
	trimmed := strings.TrimSpace(input)
	if trimmed == "" || len(trimmed) > maxVariantSearchInputLength {
		return VariantIdentifier{}, ErrUnrecognizedVariantIdentifier
	}
	if m := rsidPattern.FindStringSubmatch(trimmed); m != nil {
		return VariantIdentifier{Field: VariantSearchFieldRsnumber, Value: "rs" + m[1]}, nil
	}
	if clinvarIdPattern.MatchString(trimmed) {
		return VariantIdentifier{Field: VariantSearchFieldClinvarId, Value: trimmed}, nil
	}
	if m := hgvsgPattern.FindStringSubmatch(trimmed); m != nil {
		chromosome, err := normalizeChromosome(m[1])
		if err != nil {
			return VariantIdentifier{}, err
		}
		// The ETL writes the mitochondrial HGVSg with the m. prefix (chrM:m.1551G>A) and every other one with g.
		prefix := "g."
		if chromosome == "M" {
			prefix = "m."
		} else if strings.EqualFold(m[2], "m") {
			return VariantIdentifier{}, ErrUnrecognizedVariantIdentifier
		}
		change := hgvsKeywords.Replace(strings.ToUpper(m[3]))
		if !hgvsgChange.MatchString(change) {
			return VariantIdentifier{}, ErrUnrecognizedVariantIdentifier
		}
		return VariantIdentifier{Field: VariantSearchFieldHgvsg, Value: "chr" + chromosome + ":" + prefix + change}, nil
	}
	if m := locusPattern.FindStringSubmatch(trimmed); m != nil {
		chromosome, err := normalizeChromosome(m[1])
		if err != nil {
			return VariantIdentifier{}, err
		}
		return VariantIdentifier{Field: VariantSearchFieldLocus, Value: strings.Join([]string{chromosome, m[2], strings.ToUpper(m[3]), strings.ToUpper(m[4])}, "-")}, nil
	}
	return VariantIdentifier{}, ErrUnrecognizedVariantIdentifier
}

func normalizeChromosome(chromosome string) (string, error) {
	upper := strings.ToUpper(chromosome)
	switch upper {
	case "X", "Y", "M":
		return upper, nil
	case "MT":
		return "M", nil
	}
	n, err := strconv.Atoi(upper)
	if err != nil || n < 1 || n > 22 || strings.HasPrefix(upper, "0") {
		return "", ErrUnrecognizedVariantIdentifier
	}
	return upper, nil
}
