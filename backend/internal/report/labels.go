package report

import (
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
)

// The embedded file is the radiant tenant's labels and the fallback of every other tenant;
// a tenant ships its own transcripts_<tenant>.json next to its templates.
//
//go:embed transcripts_radiant.json
var defaultLabelFile []byte

const labelExt = ".json"

// labelKeys is the contract a tenant label file is checked against at boot.
var labelKeys = []string{
	"zygosity.HOM", "zygosity.HET", "zygosity.HEM", "zygosity.denovo",
	"parent.father", "parent.mother",
	"exon.rank_total", "exon.rank",
	"clinvar.none",
	"clinvar.affects", "clinvar.association", "clinvar.association_not_found", "clinvar.benign",
	"clinvar.confers_sensitivity", "clinvar.conflicting_classifications_of_pathogenicity",
	"clinvar.conflicting_interpretations_of_pathogenicity", "clinvar.drug_response", "clinvar.likely_benign",
	"clinvar.likely_pathogenic", "clinvar.likely_risk_allele", "clinvar.low_penetrance",
	"clinvar.no_classification_for_the_single_variant", "clinvar.not_provided", "clinvar.other",
	"clinvar.pathogenic", "clinvar.protective", "clinvar.risk_factor", "clinvar.uncertain_risk_allele",
	"clinvar.uncertain_significance",
	"omim.mim", "omim.pmid",
	"classification.LA6668-3", "classification.LA26332-9", "classification.LA26333-7",
	"classification.LA26334-5", "classification.LA6675-8",
}

type labels map[string]string

// labelSet resolves a key in the tenant's file first, then the embedded default.
type labelSet struct {
	tenant   labels
	defaults labels
}

func (s labelSet) lookup(key string) (string, bool) {
	if value, ok := s.tenant[key]; ok {
		return value, true
	}
	value, ok := s.defaults[key]
	return value, ok
}

// get falls back to the key so a missing label shows up in the report instead of a blank cell.
func (s labelSet) get(key string) string {
	if value, ok := s.lookup(key); ok {
		return value
	}
	return key
}

var defaultLabels = sync.OnceValues(func() (labels, error) {
	var l labels
	if err := json.Unmarshal(defaultLabelFile, &l); err != nil {
		return nil, fmt.Errorf("parse embedded labels: %w", err)
	}
	return l, nil
})

func labelFileName(tenant string) string { return templatePrefix + tenant + labelExt }

// loadLabelFile reads dir/transcripts_<tenant>.json: a missing file is (nil, nil, nil), a present
// one comes back with the keys of labelKeys it does not define.
func loadLabelFile(dir, tenant string) (labels, []string, error) {
	raw, err := os.ReadFile(filepath.Join(dir, labelFileName(tenant))) // #nosec G304 -- operator-controlled template dir
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil, nil
	}
	if err != nil {
		return nil, nil, fmt.Errorf("read labels: %w", err)
	}
	var l labels
	if err := json.Unmarshal(raw, &l); err != nil {
		return nil, nil, fmt.Errorf("parse labels: %w", err)
	}
	var missing []string
	for _, key := range labelKeys {
		if _, ok := l[key]; !ok {
			missing = append(missing, key)
		}
	}
	return l, missing, nil
}
