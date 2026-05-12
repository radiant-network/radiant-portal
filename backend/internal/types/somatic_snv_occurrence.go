package types

type SomaticSNVOccurrence struct {
	LocusId             string            `json:"locus_id" validate:"required"`
	SeqId               int               `json:"seq_id" validate:"required"`
	TaskId              int               `json:"task_id" validate:"required"`
	HasInterpretation   bool              `json:"has_interpretation" validate:"required"`
	HasNote             bool              `json:"has_note" validate:"required"`
	Hgvsg               string            `json:"hgvsg" validate:"required"`
	Chromosome          string            `json:"chromosome" validate:"required"`
	Start               int64             `json:"start" validate:"required"`
	End                 int64             `json:"end" validate:"required"`
	Symbol              string            `json:"symbol" validate:"required"`
	AaChange            string            `json:"aa_change" validate:"required"`
	VariantClass        string            `json:"variant_class" validate:"required"`
	VepImpact           VepImpact         `json:"vep_impact" validate:"required" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	PickedConsequences  JsonArray[string] `gorm:"type:json" json:"picked_consequences" validate:"required"`
	IsManeSelect        *bool             `json:"is_mane_select" validate:"required"`
	IsManePlus          *bool             `json:"is_mane_plus" validate:"required"`
	IsCanonical         *bool             `json:"is_canonical" validate:"required"`
	Rsnumber            string            `json:"rsnumber" validate:"required"`
	OmimInheritanceCode JsonArray[string] `gorm:"type:json" json:"omim_inheritance_code" validate:"required"`
	Hotspot             *bool             `json:"hotspot" validate:"required"`
	Clinvar             JsonArray[string] `gorm:"type:json" json:"clinvar" validate:"required"`
	GnomadV3Af          *float64          `json:"gnomad_v3_af" validate:"required"`
	GermlinePfWgs       *float64          `json:"germline_pf_wgs" validate:"required"`
	GermlinePcWgs       *int              `json:"germline_pc_wgs" validate:"required"`
	SomaticPfTnWgs      *float64          `json:"somatic_pf_tn_wgs" validate:"required"`
	SomaticPcTnWgs      *int              `json:"somatic_pc_tn_wgs" validate:"required"`
	AdRatio             *float32          `json:"ad_ratio,omitempty"`
	TranscriptId        string            `json:"transcript_id,omitempty"`
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
	AdAlt                              *int32                   `json:"ad_alt,omitempty"`
	AdTotal                            *int32                   `json:"ad_total,omitempty"`
	AdRatio                            *float32                 `json:"ad_ratio,omitempty"`
	Filter                             string                   `json:"filter,omitempty"`
	InterpretationClassificationCounts JsonMap[string, int]     `gorm:"type:json" json:"interpretation_classification_counts,omitempty"`
	EnsemblGeneId                      string                   `json:"ensembl_gene_id,omitempty"`
}

var SomaticSNVOccurrenceTable = Table{
	Name:  "somatic__snv__occurrence",
	Alias: "s_snv_o",
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

var SomaticSNVInfoHotspotAlleleField = Field{
	Name:            "info_hotspotallele",
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
	SomaticSNVInfoHotspotAlleleField,
	ClinvarField,
	GnomadV3AfField,
	GermlinePfWgsField,
	GermlinePcWgsField,
	SomaticPfTnWgsField,
	SomaticPcTnWgsField,
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
	GermlinePfWgsAffectedField,
	GermlinePfWgsNotAffectedField,
	TopmedAfField,
	ThousandGenomesAfField,

	// Occurrence facets
	SomaticSNVFilterField,
	SomaticSNVInfoQdField,
	SomaticSNVTumorAdRatioField,
	SomaticSNVTumorAdAltField,
	SomaticSNVTumorAdTotalField,
)

var SomaticSNVOccurrencesDefaultSort = []SortField{{Field: PickedImpactScoreField, Order: "desc"}}

var SomaticSNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     SomaticSNVOccurrencesFields,
	DefaultFields: SomaticSNVOccurrencesDefaultFields,
	DefaultSort:   SomaticSNVOccurrencesDefaultSort,
	IdField:       SomaticSNVLocusIdField,
}
