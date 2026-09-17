package beacon

import (
	"fmt"
	"strings"
)

// grch38 maps Radiant's bare chromosome names to their GRCh38 RefSeq accessions. Beacon clients
// may name a chromosome either way; responses always use the accession.
var grch38 = map[string]string{
	"1": "NC_000001.11", "2": "NC_000002.12", "3": "NC_000003.12", "4": "NC_000004.12",
	"5": "NC_000005.10", "6": "NC_000006.12", "7": "NC_000007.14", "8": "NC_000008.11",
	"9": "NC_000009.12", "10": "NC_000010.11", "11": "NC_000011.10", "12": "NC_000012.12",
	"13": "NC_000013.11", "14": "NC_000014.9", "15": "NC_000015.10", "16": "NC_000016.10",
	"17": "NC_000017.11", "18": "NC_000018.10", "19": "NC_000019.10", "20": "NC_000020.11",
	"21": "NC_000021.9", "22": "NC_000022.11", "X": "NC_000023.11", "Y": "NC_000024.10",
	mitochondrialChromosome: "NC_012920.1",
}

// mitochondrialChromosome is the value snv__variant.chromosome carries for the mitochondrion;
// "MT", "chrM" and "chrMT" are accepted as aliases on input.
const mitochondrialChromosome = "M"

var accessionToChromosome = func() map[string]string {
	m := make(map[string]string, len(grch38))
	for chr, acc := range grch38 {
		m[acc] = chr
	}
	return m
}()

// ParseReferenceName resolves a Beacon referenceName ("17", "chr17", "NC_000017.11",
// "refseq:NC_000017.11") to the bare chromosome name stored in snv__variant.
func ParseReferenceName(name string) (string, error) {
	s := strings.TrimSpace(name)
	if s == "" {
		return "", fmt.Errorf("referenceName is required")
	}
	s = strings.TrimPrefix(strings.ToUpper(s), "REFSEQ:")
	if chr, ok := accessionToChromosome[s]; ok {
		return chr, nil
	}
	s = strings.TrimPrefix(s, "CHR")
	if s == "MT" {
		s = mitochondrialChromosome
	}
	if _, ok := grch38[s]; ok {
		return s, nil
	}
	return "", fmt.Errorf("unknown referenceName %q (expected a GRCh38 chromosome such as 17, chr17 or NC_000017.11)", name)
}

// RefSeqID returns the CURIE Beacon responses carry for a chromosome, e.g. "refseq:NC_000017.11".
// A chromosome the table holds that is not in the GRCh38 map is passed through bare rather than
// dropped, so a data problem shows up in the payload instead of hiding it.
func RefSeqID(chromosome string) string {
	if acc, ok := grch38[chromosome]; ok {
		return "refseq:" + acc
	}
	return chromosome
}

// ParseAssemblyID accepts the assemblies Radiant data is aligned to. An empty value is allowed
// because RefSeq accessions already pin the assembly and the beacon serves a single one.
func ParseAssemblyID(id string) error {
	s := strings.ToUpper(strings.TrimSpace(id))
	switch {
	case s == "", s == "HG38", strings.HasPrefix(s, "GRCH38"):
		return nil
	default:
		return fmt.Errorf("unsupported assemblyId %q (this beacon serves GRCh38 only)", id)
	}
}
