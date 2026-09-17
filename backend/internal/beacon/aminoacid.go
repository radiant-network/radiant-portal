package beacon

import (
	"fmt"
	"regexp"
	"strings"
)

var oneToThree = map[string]string{
	"A": "Ala", "R": "Arg", "N": "Asn", "D": "Asp", "C": "Cys", "Q": "Gln", "E": "Glu", "G": "Gly",
	"H": "His", "I": "Ile", "L": "Leu", "K": "Lys", "M": "Met", "F": "Phe", "P": "Pro", "S": "Ser",
	"T": "Thr", "W": "Trp", "Y": "Tyr", "V": "Val", "U": "Sec", "O": "Pyl", "*": "Ter", "X": "Xaa",
}

var threeLetter = func() map[string]bool {
	m := make(map[string]bool, len(oneToThree))
	for _, t := range oneToThree {
		m[t] = true
	}
	return m
}()

var (
	oneLetterChange   = regexp.MustCompile(`^([A-Z*])(\d+)([A-Z*=])$`)
	threeLetterChange = regexp.MustCompile(`^(?:p\.)?([A-Z][a-z]{2})(\d+)([A-Z][a-z]{2}|=)$`)
)

// NormalizeAminoacidChange turns a Beacon aminoacidChange ("V600E", "R175H", "p.Arg175His",
// "Arg175His") into the HGVS three-letter form snv__variant.aa_change stores ("p.Val600Glu").
func NormalizeAminoacidChange(change string) (string, error) {
	s := strings.TrimSpace(change)
	if s == "" {
		return "", fmt.Errorf("aminoacidChange is empty")
	}
	if m := oneLetterChange.FindStringSubmatch(s); m != nil {
		ref, ok := oneToThree[m[1]]
		if !ok {
			return "", fmt.Errorf("unknown amino acid %q in aminoacidChange %q", m[1], change)
		}
		alt := "="
		if m[3] != "=" {
			if alt, ok = oneToThree[m[3]]; !ok {
				return "", fmt.Errorf("unknown amino acid %q in aminoacidChange %q", m[3], change)
			}
		}
		return "p." + ref + m[2] + alt, nil
	}
	if m := threeLetterChange.FindStringSubmatch(s); m != nil {
		if !threeLetter[m[1]] || (m[3] != "=" && !threeLetter[m[3]]) {
			return "", fmt.Errorf("unknown amino acid in aminoacidChange %q", change)
		}
		return "p." + m[1] + m[2] + m[3], nil
	}
	return "", fmt.Errorf("aminoacidChange %q is not a one-letter (V600E) or HGVS three-letter (p.Val600Glu) substitution", change)
}

// ShortAminoacidChange is the inverse used in responses: "p.Val600Glu" → "V600E". A value that is
// not a plain substitution is returned unchanged.
func ShortAminoacidChange(aaChange string) string {
	m := threeLetterChange.FindStringSubmatch(strings.TrimSpace(aaChange))
	if m == nil {
		return aaChange
	}
	ref, alt := threeToOne(m[1]), "="
	if m[3] != "=" {
		alt = threeToOne(m[3])
	}
	if ref == "" || alt == "" {
		return aaChange
	}
	return ref + m[2] + alt
}

func threeToOne(three string) string {
	for one, t := range oneToThree {
		if t == three {
			return one
		}
	}
	return ""
}
