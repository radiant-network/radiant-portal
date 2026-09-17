package beacon

import (
	"strconv"

	"github.com/radiant-network/radiant-api/internal/types"
)

// GenomicVariation is the Beacon v2 default genomicVariation document, restricted to the
// variant-level fields Radiant can populate in phase 1 (no caseLevelData).
type GenomicVariation struct {
	VariantInternalID      string                   `json:"variantInternalId"`
	Variation              LegacyVariation          `json:"variation"`
	Identifiers            *Identifiers             `json:"identifiers,omitempty"`
	MolecularAttributes    *MolecularAttributes     `json:"molecularAttributes,omitempty"`
	FrequencyInPopulations []FrequencyInPopulations `json:"frequencyInPopulations,omitempty"`
	Info                   map[string]any           `json:"info,omitempty"`
} // @name BeaconGenomicVariation

type LegacyVariation struct {
	VariantType    string           `json:"variantType"`
	ReferenceBases string           `json:"referenceBases"`
	AlternateBases string           `json:"alternateBases"`
	Location       SequenceLocation `json:"location"`
} // @name BeaconLegacyVariation

type SequenceLocation struct {
	Type       string           `json:"type"`
	SequenceID string           `json:"sequence_id"`
	Interval   SequenceInterval `json:"interval"`
} // @name BeaconSequenceLocation

type SequenceInterval struct {
	Type  string `json:"type"`
	Start Number `json:"start"`
	End   Number `json:"end"`
} // @name BeaconSequenceInterval

type Number struct {
	Type  string `json:"type"`
	Value int64  `json:"value"`
} // @name BeaconNumber

type Identifiers struct {
	GenomicHGVSID         string   `json:"genomicHGVSId,omitempty"`
	ClinvarVariantID      string   `json:"clinvarVariantId,omitempty"`
	VariantAlternativeIDs []string `json:"variantAlternativeIds,omitempty"`
} // @name BeaconIdentifiers

type MolecularAttributes struct {
	GeneIDs          []string `json:"geneIds,omitempty"`
	AminoacidChanges []string `json:"aminoacidChanges,omitempty"`
} // @name BeaconMolecularAttributes

type FrequencyInPopulations struct {
	Source          string                `json:"source"`
	SourceReference string                `json:"sourceReference"`
	Version         string                `json:"version,omitempty"`
	Frequencies     []PopulationFrequency `json:"frequencies"`
} // @name BeaconFrequencyInPopulations

// PopulationFrequency carries the schema's required alleleFrequency. Radiant's cohort counts
// are participants, not alleles, so they travel in info rather than in alleleCount/alleleNumber.
type PopulationFrequency struct {
	Population      string         `json:"population"`
	AlleleFrequency float64        `json:"alleleFrequency"`
	Info            map[string]any `json:"info,omitempty"`
} // @name BeaconPopulationFrequency

const radiantFrequencySource = "Radiant tenant cohort"

// ToGenomicVariation maps one snv__variant row to its Beacon document. sourceReference names
// the beacon the cohort frequencies come from (the tenant's base URL).
func ToGenomicVariation(v types.BeaconVariant, sourceReference string) GenomicVariation {
	end := v.Start + int64(len(v.Reference)) - 1
	if v.End != nil {
		end = *v.End
	}
	doc := GenomicVariation{
		VariantInternalID: strconv.FormatInt(v.LocusID, 10),
		Variation: LegacyVariation{
			VariantType:    VariantTypeFor(v.VariantClass, v.Reference, v.Alternate),
			ReferenceBases: v.Reference,
			AlternateBases: v.Alternate,
			Location: SequenceLocation{
				Type:       "SequenceLocation",
				SequenceID: RefSeqID(v.Chromosome),
				Interval: SequenceInterval{
					Type:  "SequenceInterval",
					Start: Number{Type: "Number", Value: internalToBeaconStart(v.Start)},
					End:   Number{Type: "Number", Value: internalToBeaconEnd(end)},
				},
			},
		},
	}

	ids := Identifiers{GenomicHGVSID: v.Hgvsg, ClinvarVariantID: v.ClinvarName}
	if v.Rsnumber != "" {
		ids.VariantAlternativeIDs = []string{"dbSNP:" + v.Rsnumber}
	}
	if ids.GenomicHGVSID != "" || ids.ClinvarVariantID != "" || ids.VariantAlternativeIDs != nil {
		doc.Identifiers = &ids
	}

	attrs := MolecularAttributes{}
	if v.Symbol != "" {
		attrs.GeneIDs = []string{v.Symbol}
	}
	if v.AaChange != "" {
		attrs.AminoacidChanges = []string{ShortAminoacidChange(v.AaChange)}
	}
	if attrs.GeneIDs != nil || attrs.AminoacidChanges != nil {
		doc.MolecularAttributes = &attrs
	}

	doc.FrequencyInPopulations = frequencies(v, sourceReference)

	info := map[string]any{}
	if v.VariantClass != "" {
		info["variant_class"] = v.VariantClass
	}
	if len(v.Consequences) > 0 {
		info["consequences"] = []string(v.Consequences)
	}
	if len(info) > 0 {
		doc.Info = info
	}
	return doc
}

func frequencies(v types.BeaconVariant, sourceReference string) []FrequencyInPopulations {
	var cohort []PopulationFrequency
	add := func(population string, pc, pn *int, pf *float64) {
		if pn == nil || *pn == 0 || pf == nil {
			return
		}
		info := map[string]any{"participant_number": *pn, "frequency_basis": "participant"}
		if pc != nil {
			info["participant_count"] = *pc
		}
		cohort = append(cohort, PopulationFrequency{Population: population, AlleleFrequency: *pf, Info: info})
	}
	add("germline WGS", v.GermlinePcWgs, v.GermlinePnWgs, v.GermlinePfWgs)
	add("germline WXS", v.GermlinePcWxs, v.GermlinePnWxs, v.GermlinePfWxs)
	add("somatic tumor-normal WGS", v.SomaticPcTnWgs, v.SomaticPnTnWgs, v.SomaticPfTnWgs)
	add("somatic tumor-only WGS", v.SomaticPcToWgs, v.SomaticPnToWgs, v.SomaticPfToWgs)

	var out []FrequencyInPopulations
	if len(cohort) > 0 {
		out = append(out, FrequencyInPopulations{Source: radiantFrequencySource, SourceReference: sourceReference, Frequencies: cohort})
	}
	if v.GnomadV3Af != nil {
		out = append(out, FrequencyInPopulations{
			Source:          "gnomAD",
			SourceReference: "https://gnomad.broadinstitute.org/",
			Version:         "v3",
			Frequencies:     []PopulationFrequency{{Population: "total", AlleleFrequency: *v.GnomadV3Af}},
		})
	}
	return out
}
