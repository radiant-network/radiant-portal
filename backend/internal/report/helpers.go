package report

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"text/template"

	"github.com/radiant-network/radiant-api/internal/types"
)

// funcs are the functions a template cell may call. Values come back translated with the tenant's
// labels (the clin-arranger formatters); the fixed labels around them stay in the template cells.
func (l labelSet) funcs() template.FuncMap {
	return template.FuncMap{
		"lines":          lines,
		"join":           join,
		"exon":           l.exon,
		"score":          score,
		"af":             af,
		"zygosity":       l.zygosity,
		"gnomad":         gnomad,
		"clinvar":        l.clinvar,
		"omim":           l.omim,
		"classification": l.classification,
		"mane":           mane,
		"citations":      citations,
		// somatic
		"percent":         percent,
		"clinicalUtility": l.clinicalUtility,
		"oncogenicity":    l.oncogenicity,
		"cosmicTier":      l.cosmicTier,
	}
}

// zygosityShort is what arranger prints for a parent: the code lowercased, ref when absent.
var zygosityShortLabels = map[string]string{
	"HOM": "hom",
	"HET": "het",
	"HEM": "hem",
}

func lines(parts ...string) string {
	kept := parts[:0:0]
	for _, p := range parts {
		if p != "" {
			kept = append(kept, p)
		}
	}
	return strings.Join(kept, "\n")
}

func join(sep string, list []string) string {
	return strings.Join(list, sep)
}

func (l labelSet) exon(rank, total string) string {
	switch {
	case rank != "" && total != "":
		return fmt.Sprintf(l.get("exon.rank_total"), rank, total)
	case rank != "":
		return fmt.Sprintf(l.get("exon.rank"), rank)
	case total != "":
		return fmt.Sprintf(l.get("exon.rank"), total)
	}
	return ""
}

func score(value *float32) string {
	if value == nil || *value == 0 {
		return ""
	}
	return strconv.FormatFloat(float64(*value), 'f', -1, 32)
}

func af(value float64) string {
	return fmt.Sprintf("%.7f", value)
}

// zygosity ports clin-arranger translateZygosityAndParentalOrigins: the proband line carries the
// parental origin in parentheses, a relative shows the zygosity alone.
func (l labelSet) zygosity(occurrence types.ReportOccurrence, isProband bool) string {
	parts := []string{l.zygosityLabel(occurrence.Zygosity)}
	if !isProband {
		return parts[0]
	}
	father, mother := occurrence.FatherZygosity, occurrence.MotherZygosity
	fatherLabel, motherLabel := l.get("parent.father"), l.get("parent.mother")
	switch origin := strings.ToLower(occurrence.ParentalOrigin); origin {
	case "possible_denovo":
		if father != "" && mother == "" {
			parts = append(parts, "("+fatherLabel+" ref)")
		} else {
			parts = append(parts, "("+motherLabel+" ref)")
		}
	case "denovo":
		parts = append(parts, "("+l.get("zygosity.denovo")+")")
	default:
		fatherIn := origin == "possible_father" || origin == "father" || origin == "both"
		motherIn := origin == "possible_mother" || origin == "mother" || origin == "both"
		switch {
		case fatherIn || motherIn:
			var parents []string
			if fatherIn {
				parents = append(parents, fatherLabel+" "+zygosityShort(father))
			}
			if motherIn {
				parents = append(parents, motherLabel+" "+zygosityShort(mother))
			}
			if fatherIn && !motherIn {
				parents = append(parents, motherLabel+" ref")
			}
			if motherIn && !fatherIn {
				parents = append(parents, fatherLabel+" ref")
			}
			parts = append(parts, "("+strings.Join(parents, ", ")+")")
		case father != "" || mother != "":
			parts = append(parts, "("+fatherLabel+" "+zygosityShort(father)+", "+motherLabel+" "+zygosityShort(mother)+")")
		}
	}
	return strings.Join(parts, "\n")
}

func (l labelSet) zygosityLabel(code string) string {
	if code == "" {
		return ""
	}
	if label, ok := l.translate("zygosity." + code); ok {
		return label
	}
	return code
}

func zygosityShort(code string) string {
	if label, ok := zygosityShortLabels[code]; ok {
		return label
	}
	if code == "" {
		return "ref"
	}
	return strings.ToLower(code)
}

// gnomad is nil when the variant is unknown to gnomAD (absent or counted nowhere), so the
// template takes its else branch.
func gnomad(value *types.ReportGnomad) *types.ReportGnomad {
	if value == nil || value.Ac == 0 && value.Hom == 0 && value.Af == 0 {
		return nil
	}
	return value
}

func (l labelSet) clinvar(interpretations []string) string {
	if len(interpretations) == 0 {
		return l.get("clinvar.none")
	}
	translated := make([]string, len(interpretations))
	for i, code := range interpretations {
		// ClinVar spells a value either way across sources (Likely_benign, Likely benign)
		if label, ok := l.translate("clinvar." + strings.ReplaceAll(strings.ToLower(code), " ", "_")); ok {
			translated[i] = label
		} else {
			translated[i] = code
		}
	}
	return strings.Join(translated, ", ")
}

func (l labelSet) omim(gene *types.ReportGene, interpretation *types.ReportGermlineInterpretation) string {
	var blocks []string
	if gene != nil {
		for _, phenotype := range gene.Omim {
			mim := phenotype.PhenotypeID
			if len(phenotype.InheritanceCode) > 0 {
				mim += ", " + strings.Join(phenotype.InheritanceCode, ", ")
			}
			blocks = append(blocks, "_"+phenotype.Name+"_\n("+fmt.Sprintf(l.get("omim.mim"), mim)+")")
		}
	}
	if interpretation != nil {
		for _, pubmed := range interpretation.Pubmed {
			blocks = append(blocks, fmt.Sprintf(l.get("omim.pmid"), pubmed.CitationID))
		}
	}
	return strings.Join(blocks, "\n")
}

func (l labelSet) classification(interpretation *types.ReportGermlineInterpretation) string {
	if interpretation == nil || interpretation.Classification == "" {
		return ""
	}
	label, _ := l.translate("classification." + interpretation.Classification)
	return label
}

func mane(transcript types.ReportTranscript) string {
	paired := transcript.TranscriptID
	if len(transcript.RefseqIDs) > 0 {
		paired = transcript.RefseqIDs[0]
	}
	var out strings.Builder
	if transcript.IsManeSelect {
		out.WriteString("MANE Select (" + paired + ")\n")
	}
	if transcript.IsManePlus {
		out.WriteString("MANE Plus (" + paired + ")\n")
	}
	if transcript.IsCanonical {
		out.WriteString("Ensembl Canonical (" + transcript.TranscriptID + ")")
	}
	return out.String()
}

func citations(pubmed []types.InterpretationPubmed) string {
	var texts []string
	for _, p := range pubmed {
		if p.Citation != "" {
			texts = append(texts, p.Citation)
		}
	}
	return strings.Join(texts, "\n")
}

func percent(ratio float32) string {
	return strconv.Itoa(int(math.Round(float64(ratio) * 100)))
}

func (l labelSet) clinicalUtility(interpretation *types.ReportSomaticInterpretation) string {
	if interpretation == nil || interpretation.ClinicalUtility == "" {
		return ""
	}
	label, _ := l.translate("clinical_utility." + strings.ToLower(interpretation.ClinicalUtility))
	return label
}

// The somatic form stores oncogenicity as the five germline LOINC codes; older rows and the seed
// carry the arranger strings, both have a key.
func (l labelSet) oncogenicity(interpretation *types.ReportSomaticInterpretation) string {
	if interpretation == nil || interpretation.Oncogenicity == "" {
		return ""
	}
	label, _ := l.translate("oncogenicity." + interpretation.Oncogenicity)
	return label
}

func (l labelSet) cosmicTier(cosmic *types.ReportCosmic) string {
	if cosmic == nil || cosmic.Tier == "" {
		return ""
	}
	label, _ := l.translate("cosmic_tier." + strings.ToLower(cosmic.Tier))
	return label
}
