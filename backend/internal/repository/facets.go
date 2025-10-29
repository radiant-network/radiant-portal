package repository

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
)

type Facet = types.Facet

type FacetsRepository struct {
	facetsDictionary map[string]Facet
}

type FacetsRepositoryDAO interface {
	GetFacets(facetNames []string) ([]Facet, error)
}

func NewFacetsRepository() *FacetsRepository {
	var dictionary = map[string]Facet{
		"variant_class": {
			Name:   "variant_class",
			Values: []string{"insertion", "deletion", "SNV", "indel", "substitution", "sequence_alteration"},
		},
		"consequences": {
			Name: "consequences",
			Values: []string{
				"transcript_ablation", "splice_acceptor_variant", "splice_donor_variant", "stop_gained", "frameshift_variant",
				"stop_lost", "start_lost", "transcript_amplification", "inframe_insertion", "inframe_deletion",
				"missense_variant", "protein_altering_variant", "splice_region_variant", "splice_donor_5th_base_variant", "splice_donor_region_variant",
				"splice_polypyrimidine_tract_variant", "incomplete_terminal_codon_variant", "start_retained_variant", "stop_retained_variant", "synonymous_variant",
				"coding_sequence_variant", "mature_miRNA_variant", "5_prime_UTR_variant", "3_prime_UTR_variant", "non_coding_transcript_exon_variant",
				"intron_variant", "NMD_transcript_variant", "non_coding_transcript_variant", "upstream_gene_variant", "downstream_gene_variant",
				"TFBS_ablation", "TFBS_amplification", "TF_binding_site_variant", "regulatory_region_ablation", "regulatory_region_amplification",
				"feature_elongation", "regulatory_region_variant", "feature_truncation", "intergenic_variant",
			},
		},
		"chromosome": {
			Name: "chromosome",
			Values: []string{
				"1", "2", "3", "4", "5",
				"6", "7", "8", "9", "10",
				"11", "12", "13", "14", "15",
				"16", "17", "18", "19", "20",
				"21", "22", "X", "Y",
			},
		},
		"biotype": {
			Name: "biotype",
			Values: []string{
				"IG_C_gene", "IG_D_gene", "IG_J_gene", "IG_LV_gene", "IG_V_gene",
				"TR_C_gene", "TR_J_gene", "TR_V_gene", "TR_D_gene", "IG_pseudogene",
				"IG_C_pseudogene", "IG_J_pseudogene", "IG_V_pseudogene", "TR_V_pseudogene", "TR_J_pseudogene",
				"Mt_rRNA", "Mt_tRNA", "miRNA", "misc_RNA", "rRNA",
				"scRNA", "snRNA", "snoRNA", "ribozyme", "sRNA",
				"scaRNA", "lncRNA", "Mt_tRNA_pseudogene", "tRNA_pseudogene", "snoRNA_pseudogene",
				"snRNA_pseudogene", "scRNA_pseudogene", "rRNA_pseudogene", "misc_RNA_pseudogene", "miRNA_pseudogene",
				"TEC", "nonsense_mediated_decay", "non_stop_decay", "retained_intron", "protein_coding",
				"protein_coding_LoF", "protein_coding_CDS_not_defined", "processed_transcript", "non_coding", "ambiguous_orf",
				"sense_intronic", "sense_overlapping", "antisense_RNA", "known_ncrna", "pseudogene",
				"processed_pseudogene", "polymorphic_pseudogene", "retrotransposed", "transcribed_processed_pseudogene", "transcribed_unprocessed_pseudogene",
				"transcribed_unitary_pseudogene", "translated_processed_pseudogene", "translated_unprocessed_pseudogene", "unitary_pseudogene", "unprocessed_pseudogene",
				"artifact", "lincRNA", "macro_lncRNA", "3prime_overlapping_ncRNA", "disrupted_domain",
				"vault_RNA", "bidirectional_promoter_lncRNA",
			},
		},
		"inheritance": {
			Name: "inheritance",
			Values: []string{
				"?AD", "?AR", "?DD", "?DR", "?IC",
				"?Mi", "?Mu", "?SMo", "?Smu", "?XL",
				"?XLD", "?XLR", "?YL", "AD", "AR",
				"DD", "DR", "IC", "Mi", "Mu",
				"NA", "NRP", "NRT", "SMo", "Smu",
				"XL", "XLD", "XLR", "YL",
			},
		},
		"clinvar_interpretation": {
			Name: "clinvar_interpretation",
			Values: []string{
				"Affects", "association", "association_not_found", "Benign", "confers_sensitivity",
				"Conflicting_classifications_of_pathogenicity", "conflicting_data_from_submitters", "Conflicting_interpretations_of_pathogenicity", "drug_response", "established_risk_allele",
				"Likely_benign", "Likely_pathogenic", "likely_pathogenic_low_penetrance", "Likely_risk_allele", "low_penetrance",
				"no_classification_for_the_single_variant", "not_provided", "other", "Pathogenic", "pathogenic_low_penetrance",
				"protective", "risk_factor", "Uncertain_risk_allele", "Uncertain_significance",
			},
		},
		"vep_impact": {
			Name: "vep_impact",
			Values: []string{
				"HIGH", "MODERATE", "LOW", "MODIFIER",
			},
		},
		"lrt_pred": {
			Name: "lrt_pred",
			Values: []string{
				"D", "N", "U",
			},
		},
		"transmission_mode": {
			Name: "transmission_mode",
			Values: []string{
				"autosomal_dominant_de_novo", "autosomal_dominant", "autosomal_recessive", "x_linked_dominant_de_novo", "x_linked_recessive_de_novo",
				"x_linked_dominant", "x_linked_recessive", "non_carrier_proband", "unknown_parents_genotype", "unknown_father_genotype",
				"unknown_mother_genotype", "unknown_proband_genotype",
			},
		},
	}

	return &FacetsRepository{
		facetsDictionary: dictionary,
	}
}

func (r *FacetsRepository) GetFacets(facetNames []string) ([]Facet, error) {
	var facets []Facet

	if len(facetNames) == 0 {
		return nil, fmt.Errorf("no facet names provided")
	}

	for _, name := range facetNames {
		if facet, exists := r.facetsDictionary[name]; exists {
			facets = append(facets, facet)
		} else {
			return nil, fmt.Errorf("facet \"%s\" not found", name)
		}
	}

	return facets, nil
}
