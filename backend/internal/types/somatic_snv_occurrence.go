package types

type SomaticSNVOccurrence struct {
	LocusId                   string             `json:"locus_id" validate:"required"`
	SeqId                     int                `json:"seq_id" validate:"required"`
	TaskId                    int                `json:"task_id" validate:"required"`
	HasInterpretation         bool               `json:"has_interpretation" validate:"required"`
	HasNote                   bool               `json:"has_note" validate:"required"`
	FlagType                  OccurrenceFlagType `json:"flag_type,omitempty" enums:"flag,pin,star"`
	Hgvsg                     string             `json:"hgvsg" validate:"required"`
	Chromosome                string             `json:"chromosome" validate:"required"`
	Start                     int64              `json:"start" validate:"required"`
	End                       int64              `json:"end" validate:"required"`
	Symbol                    string             `json:"symbol" validate:"required"`
	AaChange                  string             `json:"aa_change" validate:"required"`
	VariantClass              string             `json:"variant_class" validate:"required"`
	VepImpact                 VepImpact          `json:"vep_impact" validate:"required" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	PickedConsequences        JsonArray[string]  `gorm:"type:json" json:"picked_consequences" validate:"required"`
	IsManeSelect              *bool              `json:"is_mane_select" validate:"required"`
	IsManePlus                *bool              `json:"is_mane_plus" validate:"required"`
	IsCanonical               *bool              `json:"is_canonical" validate:"required"`
	Rsnumber                  string             `json:"rsnumber" validate:"required"`
	OmimInheritanceCode       JsonArray[string]  `gorm:"type:json" json:"omim_inheritance_code" validate:"required"`
	Hotspot                   *bool              `json:"hotspot" validate:"required"`
	Clinvar                   JsonArray[string]  `gorm:"type:json" json:"clinvar" validate:"required"`
	GnomadV3Af                *float64           `json:"gnomad_v3_af" validate:"required"`
	GermlinePfWgs             *float64           `json:"germline_pf_wgs" validate:"required"`
	GermlinePcWgs             *int               `json:"germline_pc_wgs" validate:"required"`
	SomaticPfTnWgs            *float64           `json:"somatic_pf_tn_wgs" validate:"required"`
	SomaticPcTnWgs            *int               `json:"somatic_pc_tn_wgs" validate:"required"`
	SomaticPfToWgs            *float64           `json:"somatic_pf_to_wgs" validate:"required"`
	SomaticPcToWgs            *int               `json:"somatic_pc_to_wgs" validate:"required"`
	GermlinePnWgs             *int               `json:"germline_pn_wgs,omitempty"`
	GermlineHomWgs            *int               `json:"germline_hom_wgs,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWgs             *float64           `json:"germline_af_wgs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWgsAffected     *int               `json:"germline_pc_wgs_affected,omitempty"`
	GermlinePnWgsAffected     *int               `json:"germline_pn_wgs_affected,omitempty"`
	GermlinePfWgsAffected     *float64           `json:"germline_pf_wgs_affected,omitempty"`
	GermlineHomWgsAffected    *int               `json:"germline_hom_wgs_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWgsAffected     *float64           `json:"germline_af_wgs_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWgsNotAffected  *int               `json:"germline_pc_wgs_not_affected,omitempty"`
	GermlinePnWgsNotAffected  *int               `json:"germline_pn_wgs_not_affected,omitempty"`
	GermlinePfWgsNotAffected  *float64           `json:"germline_pf_wgs_not_affected,omitempty"`
	GermlineHomWgsNotAffected *int               `json:"germline_hom_wgs_not_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWgsNotAffected  *float64           `json:"germline_af_wgs_not_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWxs             *int               `json:"germline_pc_wxs,omitempty"`
	GermlinePnWxs             *int               `json:"germline_pn_wxs,omitempty"`
	GermlinePfWxs             *float64           `json:"germline_pf_wxs,omitempty"`
	GermlineHomWxs            *int               `json:"germline_hom_wxs,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWxs             *float64           `json:"germline_af_wxs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWxsAffected     *int               `json:"germline_pc_wxs_affected,omitempty"`
	GermlinePnWxsAffected     *int               `json:"germline_pn_wxs_affected,omitempty"`
	GermlinePfWxsAffected     *float64           `json:"germline_pf_wxs_affected,omitempty"`
	GermlineHomWxsAffected    *int               `json:"germline_hom_wxs_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWxsAffected     *float64           `json:"germline_af_wxs_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWxsNotAffected  *int               `json:"germline_pc_wxs_not_affected,omitempty"`
	GermlinePnWxsNotAffected  *int               `json:"germline_pn_wxs_not_affected,omitempty"`
	GermlinePfWxsNotAffected  *float64           `json:"germline_pf_wxs_not_affected,omitempty"`
	GermlineHomWxsNotAffected *int               `json:"germline_hom_wxs_not_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWxsNotAffected  *float64           `json:"germline_af_wxs_not_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	SomaticPnTnWgs            *int               `json:"somatic_pn_tn_wgs,omitempty"`
	SomaticHomTnWgs           *int               `json:"somatic_hom_tn_wgs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfTnWgs            *float64           `json:"somatic_af_tn_wgs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	SomaticPcTnWxs            *int               `json:"somatic_pc_tn_wxs,omitempty"`
	SomaticPnTnWxs            *int               `json:"somatic_pn_tn_wxs,omitempty"`
	SomaticPfTnWxs            *float64           `json:"somatic_pf_tn_wxs,omitempty"`
	SomaticHomTnWxs           *int               `json:"somatic_hom_tn_wxs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfTnWxs            *float64           `json:"somatic_af_tn_wxs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	SomaticPnToWgs            *int               `json:"somatic_pn_to_wgs,omitempty"`
	SomaticHomToWgs           *int               `json:"somatic_hom_to_wgs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfToWgs            *float64           `json:"somatic_af_to_wgs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	SomaticPcToWxs            *int               `json:"somatic_pc_to_wxs,omitempty"`
	SomaticPnToWxs            *int               `json:"somatic_pn_to_wxs,omitempty"`
	SomaticPfToWxs            *float64           `json:"somatic_pf_to_wxs,omitempty"`
	SomaticHomToWxs           *int               `json:"somatic_hom_to_wxs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfToWxs            *float64           `json:"somatic_af_to_wxs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	AdRatio                   *float32           `json:"ad_ratio,omitempty"`
	Sq                        *float32           `json:"sq,omitempty"`
	Aq                        *float32           `json:"aq,omitempty"`
	TranscriptId              string             `json:"transcript_id,omitempty"`
	Reference                 string             `json:"reference" validate:"required"`
	Alternate                 string             `json:"alternate" validate:"required"`
	CmcSampleMutated          *int               `json:"cmc_sample_mutated,omitempty"`
	CmcSampleRatio            *float64           `json:"cmc_sample_ratio,omitempty"`
	CmcTier                   *string            `json:"cmc_tier,omitempty"`
	CmcMutationUrl            *string            `json:"cmc_mutation_url,omitempty"`
}

type ExpandedSomaticSNVOccurrence struct {
	LocusId                            string                   `json:"locus_id" validate:"required"`
	Hgvsg                              string                   `json:"hgvsg" validate:"required"`
	Locus                              string                   `json:"locus" validate:"required"`
	Chromosome                         string                   `json:"chromosome" validate:"required"`
	Start                              int64                    `json:"start" validate:"required"`
	End                                int64                    `json:"end" validate:"required"`
	Symbol                             string                   `json:"symbol,omitempty"`
	TranscriptId                       string                   `json:"transcript_id,omitempty"`
	IsCanonical                        *bool                    `json:"is_canonical,omitempty"`
	IsManeSelect                       *bool                    `json:"is_mane_select,omitempty"`
	IsManePlus                         *bool                    `json:"is_mane_plus,omitempty"`
	ExonRank                           *int                     `json:"exon_rank,omitempty"`
	ExonTotal                          *int                     `json:"exon_total,omitempty"`
	DnaChange                          string                   `json:"dna_change,omitempty"`
	VepImpact                          VepImpact                `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	Consequences                       JsonArray[string]        `gorm:"type:json" json:"picked_consequences,omitempty"`
	AaChange                           string                   `json:"aa_change,omitempty"`
	Rsnumber                           string                   `json:"rsnumber,omitempty"`
	ClinvarInterpretation              JsonArray[string]        `gorm:"type:json" json:"clinvar,omitempty"`
	GnomadPli                          float32                  `json:"gnomad_pli,omitempty"`
	GnomadLoeuf                        float32                  `json:"gnomad_loeuf,omitempty"`
	SpliceaiType                       JsonArray[string]        `gorm:"type:json" json:"spliceai_type,omitempty"`
	SpliceaiDs                         float32                  `json:"spliceai_ds,omitempty"`
	SomaticPcTnWgs                     *int                     `json:"somatic_pc_tn_wgs,omitempty"`
	SomaticPnTnWgs                     *int                     `json:"somatic_pn_tn_wgs,omitempty"`
	SomaticPfTnWgs                     *float64                 `json:"somatic_pf_tn_wgs,omitempty"`
	SomaticPcToWgs                     *int                     `json:"somatic_pc_to_wgs,omitempty"`
	SomaticPnToWgs                     *int                     `json:"somatic_pn_to_wgs,omitempty"`
	SomaticPfToWgs                     *float64                 `json:"somatic_pf_to_wgs,omitempty"`
	GermlinePcWgs                      *int                     `json:"germline_pc_wgs,omitempty"`
	GermlinePnWgs                      *int                     `json:"germline_pn_wgs,omitempty"`
	GermlinePfWgs                      *float64                 `json:"germline_pf_wgs,omitempty"`
	GermlineHomWgs                     *int                     `json:"germline_hom_wgs,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWgs                      *float64                 `json:"germline_af_wgs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWgsAffected              *int                     `json:"germline_pc_wgs_affected,omitempty"`
	GermlinePnWgsAffected              *int                     `json:"germline_pn_wgs_affected,omitempty"`
	GermlinePfWgsAffected              *float64                 `json:"germline_pf_wgs_affected,omitempty"`
	GermlineHomWgsAffected             *int                     `json:"germline_hom_wgs_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWgsAffected              *float64                 `json:"germline_af_wgs_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWgsNotAffected           *int                     `json:"germline_pc_wgs_not_affected,omitempty"`
	GermlinePnWgsNotAffected           *int                     `json:"germline_pn_wgs_not_affected,omitempty"`
	GermlinePfWgsNotAffected           *float64                 `json:"germline_pf_wgs_not_affected,omitempty"`
	GermlineHomWgsNotAffected          *int                     `json:"germline_hom_wgs_not_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWgsNotAffected           *float64                 `json:"germline_af_wgs_not_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWxs                      *int                     `json:"germline_pc_wxs,omitempty"`
	GermlinePnWxs                      *int                     `json:"germline_pn_wxs,omitempty"`
	GermlinePfWxs                      *float64                 `json:"germline_pf_wxs,omitempty"`
	GermlineHomWxs                     *int                     `json:"germline_hom_wxs,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWxs                      *float64                 `json:"germline_af_wxs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWxsAffected              *int                     `json:"germline_pc_wxs_affected,omitempty"`
	GermlinePnWxsAffected              *int                     `json:"germline_pn_wxs_affected,omitempty"`
	GermlinePfWxsAffected              *float64                 `json:"germline_pf_wxs_affected,omitempty"`
	GermlineHomWxsAffected             *int                     `json:"germline_hom_wxs_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWxsAffected              *float64                 `json:"germline_af_wxs_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	GermlinePcWxsNotAffected           *int                     `json:"germline_pc_wxs_not_affected,omitempty"`
	GermlinePnWxsNotAffected           *int                     `json:"germline_pn_wxs_not_affected,omitempty"`
	GermlinePfWxsNotAffected           *float64                 `json:"germline_pf_wxs_not_affected,omitempty"`
	GermlineHomWxsNotAffected          *int                     `json:"germline_hom_wxs_not_affected,omitempty"` // Number of patients with a HOM or HEM call
	GermlineAfWxsNotAffected           *float64                 `json:"germline_af_wxs_not_affected,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM.
	SomaticHomTnWgs                    *int                     `json:"somatic_hom_tn_wgs,omitempty"`            // Number of patients with a HOM or HEM tumor call
	SomaticAfTnWgs                     *float64                 `json:"somatic_af_tn_wgs,omitempty"`             // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	SomaticPcTnWxs                     *int                     `json:"somatic_pc_tn_wxs,omitempty"`
	SomaticPnTnWxs                     *int                     `json:"somatic_pn_tn_wxs,omitempty"`
	SomaticPfTnWxs                     *float64                 `json:"somatic_pf_tn_wxs,omitempty"`
	SomaticHomTnWxs                    *int                     `json:"somatic_hom_tn_wxs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfTnWxs                     *float64                 `json:"somatic_af_tn_wxs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	SomaticHomToWgs                    *int                     `json:"somatic_hom_to_wgs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfToWgs                     *float64                 `json:"somatic_af_to_wgs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	SomaticPcToWxs                     *int                     `json:"somatic_pc_to_wxs,omitempty"`
	SomaticPnToWxs                     *int                     `json:"somatic_pn_to_wxs,omitempty"`
	SomaticPfToWxs                     *float64                 `json:"somatic_pf_to_wxs,omitempty"`
	SomaticHomToWxs                    *int                     `json:"somatic_hom_to_wxs,omitempty"` // Number of patients with a HOM or HEM tumor call
	SomaticAfToWxs                     *float64                 `json:"somatic_af_to_wxs,omitempty"`  // Approximate allele frequency, (pc + hom) / (2 * pn). Assumes diploid genotypes; HEM is counted as HOM. Does not account for tumor purity, copy number or loss of heterozygosity.
	GnomadV3Af                         *float64                 `json:"gnomad_v3_af,omitempty"`
	SiftPred                           string                   `json:"sift_pred,omitempty"`
	SiftScore                          *float32                 `json:"sift_score,omitempty"`
	RevelScore                         *float32                 `json:"revel_score,omitempty"`
	FathmmPred                         string                   `json:"fathmm_pred,omitempty"`
	FathmmScore                        *float32                 `json:"fathmm_score,omitempty"`
	CaddPhred                          *float32                 `json:"cadd_phred,omitempty"`
	CaddScore                          *float32                 `json:"cadd_score,omitempty"`
	DannScore                          *float32                 `json:"dann_score,omitempty"`
	LrtPred                            string                   `json:"lrt_pred,omitempty"`
	LrtScore                           *float32                 `json:"lrt_score,omitempty"`
	Polyphen2HvarPred                  string                   `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore                 *float32                 `json:"polyphen2_hvar_score,omitempty"`
	OmimConditions                     JsonArray[OmimGenePanel] `gorm:"type:json" json:"omim_conditions,omitempty"`
	InfoQd                             float32                  `json:"qd,omitempty"`
	Sq                                 *float32                 `json:"sq,omitempty"`
	Aq                                 *float32                 `json:"aq,omitempty"`
	AdAlt                              *int32                   `json:"ad_alt,omitempty"`
	AdTotal                            *int32                   `json:"ad_total,omitempty"`
	AdRatio                            *float32                 `json:"ad_ratio,omitempty"`
	Filter                             string                   `json:"filter,omitempty"`
	InterpretationClassificationCounts JsonMap[string, int]     `gorm:"type:json" json:"interpretation_classification_counts,omitempty"`
	EnsemblGeneId                      string                   `json:"ensembl_gene_id,omitempty"`
	CmcSampleMutated                   *int                     `json:"cmc_sample_mutated,omitempty"`
	CmcSampleRatio                     *float64                 `json:"cmc_sample_ratio,omitempty"`
	CmcTier                            *string                  `json:"cmc_tier,omitempty"`
	CmcMutationUrl                     *string                  `json:"cmc_mutation_url,omitempty"`
}

var SomaticSNVOccurrenceTable = Table{
	Name:      "somatic__snv__occurrence",
	Alias:     "s_snv_o",
	PerTenant: true,
}

var SomaticSNVLocusIdField = Field{
	Name:          "locus_id",
	CanBeSelected: true,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVTumorSeqIdField = Field{
	Name:          "tumor_seq_id",
	Alias:         "seq_id",
	CanBeSelected: true,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVTumorAdRatioField = Field{
	Name:          "tumor_ad_ratio",
	Alias:         "ad_ratio",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Type:          DecimalType,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVTumorAdAltField = Field{
	Name:          "tumor_ad_alt",
	Alias:         "ad_alt",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Type:          IntegerType,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVTumorAdTotalField = Field{
	Name:          "tumor_ad_total",
	Alias:         "ad_total",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Type:          IntegerType,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVFilterField = Field{
	Name:            "filter",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           SomaticSNVOccurrenceTable,
}

var SomaticSNVInfoQdField = Field{
	Name:          "info_qd",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVTumorSqField = Field{
	Name:          "tumor_sq",
	Alias:         "sq",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVInfoAqField = Field{
	Name:          "info_aq",
	Alias:         "aq",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticSNVOccurrenceTable,
}

// info_hotspot is the caller-agnostic boolean the ETL resolves from whichever INFO key the caller
// emits — DRAGEN's lowercase `hotspot` flag, or `HotspotAllele` from GATK-era callers. Never fall
// back to info_hotspotallele here: that fallback already happened at ingestion, and the raw allele
// index is truthy for values that resolve to false.
var SomaticSNVInfoHotspotField = Field{
	Name:            "info_hotspot",
	Alias:           "hotspot",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           SomaticSNVOccurrenceTable,
}

var SomaticSNVOccurrencesDefaultFields = []Field{
	SomaticSNVLocusIdField,
	ChromosomeField,
	StartField,
	EndField,
	SomaticSNVTumorSeqIdField,
	SomaticSNVTaskIdField,
	HgvsgField,
	PickedSymbolField,
	PickedAaChangeField,
	VariantClassField,
	PickedVepImpactField,
	PickedConsequencesField,
	PickedIsCanonicalField,
	PickedIsManeSelectField,
	PickedIsManePlusField,
	PickedTranscriptIdField,
	RsNumberField,
	PickedOmimInheritanceCodeField,
	SomaticSNVInfoHotspotField,
	ClinvarField,
	GnomadV3AfField,
	GermlinePfWgsField,
	GermlinePcWgsField,
	SomaticPfTnWgsField,
	SomaticPcTnWgsField,
	SomaticPfToWgsField,
	SomaticPcToWgsField,
	ReferenceField,
	AlternateField,
	CmcSampleMutatedField,
	CmcSampleRatioField,
	CmcTierField,
	CmcMutationUrlField,
}

var SomaticSNVOccurrencesFields = append(SomaticSNVOccurrencesDefaultFields,
	// Variant facets
	ConsequenceField,

	// Gene facets
	SymbolField,
	BiotypeField,
	GnomadPliField,
	GnomadLoeufField,
	OmimInheritanceField,
	HpoGenePanelField,
	OrphanetGenePanelField,
	OmimGenePanelField,
	DddGenePanelField,
	CosmicGenePanelField,
	TenantGenePanelField,

	// Pathogenicity facets
	VepImpactFilterField,
	CaddScoreField,
	CaddPhredField,
	DannScoreField,
	FathmmPredField,
	LrtPredField,
	Polyphen2HvarPredField,
	RevelScoreField,
	SpliceaiDsField,
	SiftPredField,

	// Frequency facets
	GermlinePnWgsField,
	GermlineHomWgsField,
	GermlineAfWgsField,
	GermlinePcWgsAffectedField,
	GermlinePnWgsAffectedField,
	GermlinePfWgsAffectedField,
	GermlineHomWgsAffectedField,
	GermlineAfWgsAffectedField,
	GermlinePcWgsNotAffectedField,
	GermlinePnWgsNotAffectedField,
	GermlinePfWgsNotAffectedField,
	GermlineHomWgsNotAffectedField,
	GermlineAfWgsNotAffectedField,
	GermlinePcWxsField,
	GermlinePnWxsField,
	GermlinePfWxsField,
	GermlineHomWxsField,
	GermlineAfWxsField,
	GermlinePcWxsAffectedField,
	GermlinePnWxsAffectedField,
	GermlinePfWxsAffectedField,
	GermlineHomWxsAffectedField,
	GermlineAfWxsAffectedField,
	GermlinePcWxsNotAffectedField,
	GermlinePnWxsNotAffectedField,
	GermlinePfWxsNotAffectedField,
	GermlineHomWxsNotAffectedField,
	GermlineAfWxsNotAffectedField,
	SomaticPnTnWgsField,
	SomaticHomTnWgsField,
	SomaticAfTnWgsField,
	SomaticPcTnWxsField,
	SomaticPnTnWxsField,
	SomaticPfTnWxsField,
	SomaticHomTnWxsField,
	SomaticAfTnWxsField,
	SomaticPnToWgsField,
	SomaticHomToWgsField,
	SomaticAfToWgsField,
	SomaticPcToWxsField,
	SomaticPnToWxsField,
	SomaticPfToWxsField,
	SomaticHomToWxsField,
	SomaticAfToWxsField,
	TopmedAfField,
	ThousandGenomesAfField,

	// Occurrence facets
	SomaticSNVFilterField,
	SomaticSNVInfoQdField,
	SomaticSNVTumorAdRatioField,
	SomaticSNVTumorAdAltField,
	SomaticSNVTumorAdTotalField,
	SomaticSNVTumorSqField,
	SomaticSNVInfoAqField,
)

var SomaticSNVOccurrencesDefaultSort = []SortField{{Field: PickedImpactScoreField, Order: "desc"}}

var SomaticSNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     SomaticSNVOccurrencesFields,
	DefaultFields: SomaticSNVOccurrencesDefaultFields,
	DefaultSort:   SomaticSNVOccurrencesDefaultSort,
	IdField:       SomaticSNVLocusIdField,
}
