package report

import (
	"fmt"
	"strconv"
	"strings"
	"text/template"

	"github.com/radiant-network/radiant-api/internal/types"
)

// helpers are the functions a template cell may call. Values come back translated (the
// clin-arranger formatters); the fixed French labels around them stay in the template cells.
var helpers = template.FuncMap{
	"lines":          lines,
	"join":           join,
	"exon":           exon,
	"score":          score,
	"af":             af,
	"zygosity":       zygosity,
	"gnomad":         gnomad,
	"clinvar":        clinvar,
	"omim":           omim,
	"classification": classification,
	"mane":           mane,
	"citations":      citations,
}

var zygosityLabels = map[string]string{
	"HOM": "Homozygote",
	"HET": "Hétérozygote",
	"HEM": "Hémizygote",
}

var zygosityShortLabels = map[string]string{
	"HOM": "hom",
	"HET": "het",
	"HEM": "hem",
}

var clinvarLabels = map[string]string{
	"Affects":               "Affecte",
	"association":           "Association",
	"association_not_found": "Association non trouvée",
	"Benign":                "Bénigne",
	"confers_sensitivity":   "Confère une sensibilité",
	"Conflicting_classifications_of_pathogenicity": "Classifications conflictuelles",
	"Conflicting_interpretations_of_pathogenicity": "Interprétations conflictuelles",
	"drug_response":                            "Réponse au médicament",
	"Likely_benign":                            "Probablement bénigne",
	"Likely_pathogenic":                        "Probablement pathogénique",
	"Likely_risk_allele":                       "Allèle de risque probable",
	"low_penetrance":                           "Faible pénétrance",
	"no_classification_for_the_single_variant": "Pas de classification pour le variant unique",
	"not_provided":                             "Non fourni",
	"other":                                    "Autre",
	"Pathogenic":                               "Pathogénique",
	"protective":                               "Protecteur",
	"risk_factor":                              "Facteur de risque",
	"Uncertain_risk_allele":                    "Allèle à risque incertain",
	"Uncertain_significance":                   "De signification incertaine",
}

var classificationLabels = map[string]string{
	"LA6668-3":  "Pathogénique",
	"LA26332-9": "Probablement pathogénique",
	"LA26333-7": "Variant de signification incertaine",
	"LA26334-5": "Probablement bénigne",
	"LA6675-8":  "Bénigne",
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

func exon(rank, total string) string {
	ratio := lines(rank, total)
	if ratio == "" {
		return ""
	}
	return "Exon : " + strings.ReplaceAll(ratio, "\n", "/")
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
func zygosity(occurrence types.ReportOccurrence, isProband bool) string {
	parts := []string{zygosityLabel(occurrence.Zygosity)}
	if !isProband {
		return parts[0]
	}
	father, mother := occurrence.FatherZygosity, occurrence.MotherZygosity
	switch origin := strings.ToLower(occurrence.ParentalOrigin); origin {
	case "possible_denovo":
		if father != "" && mother == "" {
			parts = append(parts, "(Père ref)")
		} else {
			parts = append(parts, "(Mère ref)")
		}
	case "denovo":
		parts = append(parts, "(de novo)")
	default:
		fatherIn := origin == "possible_father" || origin == "father" || origin == "both"
		motherIn := origin == "possible_mother" || origin == "mother" || origin == "both"
		switch {
		case fatherIn || motherIn:
			var parents []string
			if fatherIn {
				parents = append(parents, "Père "+zygosityShort(father))
			}
			if motherIn {
				parents = append(parents, "Mère "+zygosityShort(mother))
			}
			if fatherIn && !motherIn {
				parents = append(parents, "Mère ref")
			}
			if motherIn && !fatherIn {
				parents = append(parents, "Père ref")
			}
			parts = append(parts, "("+strings.Join(parents, ", ")+")")
		case father != "" || mother != "":
			parts = append(parts, "(Père "+zygosityShort(father)+", Mère "+zygosityShort(mother)+")")
		}
	}
	return strings.Join(parts, "\n")
}

func zygosityLabel(code string) string {
	if label, ok := zygosityLabels[code]; ok {
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

func clinvar(interpretations []string) string {
	if len(interpretations) == 0 {
		return "Aucune donnée"
	}
	labels := make([]string, len(interpretations))
	for i, code := range interpretations {
		if label, ok := clinvarLabels[code]; ok {
			labels[i] = label
		} else {
			labels[i] = code
		}
	}
	return strings.Join(labels, ", ")
}

func omim(gene *types.ReportGene, interpretation *types.ReportGermlineInterpretation) string {
	var blocks []string
	if gene != nil {
		for _, phenotype := range gene.Omim {
			block := "_" + phenotype.Name + "_\n(MIM : " + phenotype.PhenotypeID
			if len(phenotype.InheritanceCode) > 0 {
				block += ", " + strings.Join(phenotype.InheritanceCode, ", ")
			}
			blocks = append(blocks, block+")")
		}
	}
	if interpretation != nil {
		for _, pubmed := range interpretation.Pubmed {
			blocks = append(blocks, "PMID : "+pubmed.CitationID)
		}
	}
	return strings.Join(blocks, "\n")
}

func classification(interpretation *types.ReportGermlineInterpretation) string {
	if interpretation == nil {
		return ""
	}
	return classificationLabels[interpretation.Classification]
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
