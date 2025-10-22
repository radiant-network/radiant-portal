package types

// GermlineSNVOccurrence represents a germline SNV occurrence
// @Description GermlineSNVOccurrence represents a germline SNV occurrence
type GermlineSNVOccurrence struct {
	SeqId                      int               `json:"seq_id" validate:"required"`
	TaskId                     int               `json:"task_id" validate:"required"`
	Chromosome                 string            `json:"chromosome" validate:"required"`
	Start                      int64             `json:"start" validate:"required"`
	LocusId                    string            `json:"locus_id" validate:"required"`
	Locus                      string            `json:"locus" validate:"required"`
	GenotypeQuality            int32             `json:"genotype_quality" validate:"required"`
	Filter                     string            `json:"filter,omitempty"`
	Zygosity                   string            `json:"zygosity" validate:"required"`
	PfWgs                      float64           `json:"pf_wgs" validate:"required"`
	PcWgs                      int               `json:"pc_wgs,omitempty"`
	PnWgs                      int               `json:"pn_wgs,omitempty"`
	GnomadV3Af                 float64           `json:"gnomad_v3_af" validate:"required"`
	Hgvsg                      string            `json:"hgvsg" validate:"required"`
	OmimInheritanceCode        JsonArray[string] `gorm:"type:json" json:"omim_inheritance_code,omitempty"`
	AdRatio                    float32           `json:"ad_ratio" validate:"required"`
	VariantClass               string            `json:"variant_class" validate:"required"`
	VepImpact                  VepImpact         `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	Symbol                     string            `json:"symbol,omitempty"`
	Clinvar                    JsonArray[string] `gorm:"type:json" json:"clinvar,omitempty"`
	IsManeSelect               bool              `json:"is_mane_select"`
	IsManePlus                 bool              `json:"is_mane_plus"`
	IsCanonical                bool              `json:"is_canonical"`
	AaChange                   string            `json:"aa_change,omitempty"`
	Rsnumber                   string            `json:"rsnumber,omitempty"`
	PickedConsequences         JsonArray[string] `gorm:"type:json" json:"picked_consequences" validate:"required"`
	TranscriptId               string            `json:"transcript_id,omitempty"`
	MaxImpactScore             int               `json:"max_impact_score" validate:"required"`
	HasInterpretation          bool              `json:"has_interpretation" validate:"required"`
	ExomiserMoi                string            `json:"exomiser_moi" validate:"required"`
	ExomiserAcmgClassification string            `json:"exomiser_acmg_classification" validate:"required"`
	ExomiserAcmgEvidence       JsonArray[string] `gorm:"type:json" json:"exomiser_acmg_evidence" validate:"required"`
	ExomiserVariantScore       float64           `json:"exomiser_variant_score" validate:"required"`
	ExomiserGeneCombinedScore  float64           `json:"exomiser_gene_combined_score" validate:"required"`
} // @name GermlineSNVOccurrence

type ExpandedGermlineSNVOccurrence = struct {
	LocusId                            string                   `json:"locus_id" validate:"required"`
	Hgvsg                              string                   `json:"hgvsg" validate:"required"`
	Locus                              string                   `json:"locus" validate:"required"`
	Chromosome                         string                   `json:"chromosome"`
	Start                              int64                    `json:"start,omitempty"`
	End                                int64                    `json:"end,omitempty"`
	Symbol                             string                   `json:"symbol,omitempty"`
	TranscriptId                       string                   `json:"transcript_id,omitempty"`
	IsCanonical                        bool                     `json:"is_canonical"`
	IsManeSelect                       bool                     `json:"is_mane_select"`
	IsManePlus                         bool                     `json:"is_mane_plus"`
	ExonRank                           int                      `json:"exon_rank,omitempty"`
	ExonTotal                          int                      `json:"exon_total,omitempty"`
	DnaChange                          string                   `json:"dna_change,omitempty"`
	VepImpact                          VepImpact                `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	Consequences                       JsonArray[string]        `gorm:"type:json" json:"picked_consequences" validate:"required"`
	AaChange                           string                   `json:"aa_change,omitempty"`
	Rsnumber                           string                   `json:"rsnumber,omitempty"`
	ClinvarInterpretation              JsonArray[string]        `gorm:"type:json" json:"clinvar,omitempty"`
	GnomadPli                          float32                  `json:"gnomad_pli,omitempty"`
	GnomadLoeuf                        float32                  `json:"gnomad_loeuf,omitempty"`
	SpliceaiType                       JsonArray[string]        `gorm:"type:json" json:"spliceai_type,omitempty"`
	SpliceaiDs                         float32                  `json:"spliceai_ds,omitempty"`
	Af                                 float64                  `json:"af,omitempty"` // TODO
	PfWgs                              float64                  `json:"pf_wgs,omitempty"`
	PcWgsAffected                      int                      `json:"pc_wgs_affected,omitempty"`
	PnWgsAffected                      int                      `json:"pn_wgs_affected,omitempty"`
	PfWgsAffected                      float64                  `json:"pf_wgs_affected,omitempty"`
	PcWgsNotAffected                   int                      `json:"pc_wgs_not_affected,omitempty"`
	PnWgsNotAffected                   int                      `json:"pn_wgs_not_affected,omitempty"`
	PfWgsNotAffected                   float64                  `json:"pf_wgs_not_affected,omitempty"`
	GnomadV3Af                         float64                  `json:"gnomad_v3_af" validate:"required"`
	SiftPred                           string                   `json:"sift_pred,omitempty"`
	SiftScore                          float32                  `json:"sift_score,omitempty"`
	RevelScore                         float32                  `json:"revel_score,omitempty"`
	FathmmPred                         string                   `json:"fathmm_pred,omitempty"`
	FathmmScore                        float32                  `json:"fathmm_score,omitempty"`
	CaddPhred                          float32                  `json:"cadd_phred,omitempty"`
	CaddScore                          float32                  `json:"cadd_score,omitempty"`
	DannScore                          float32                  `json:"dann_score,omitempty"`
	Zygosity                           string                   `json:"zygosity,omitempty"`
	TransmissionMode                   string                   `json:"transmission,omitempty"`
	ParentalOrigin                     string                   `json:"parental_origin,omitempty"`
	OmimConditions                     JsonArray[OmimGenePanel] `gorm:"type:json" json:"omim_conditions,omitempty"`
	FatherCalls                        JsonArray[int]           `gorm:"type:json" json:"father_calls,omitempty"`
	MotherCalls                        JsonArray[int]           `gorm:"type:json" json:"mother_calls,omitempty"`
	InfoQd                             float32                  `json:"qd,omitempty"`
	AdAlt                              int32                    `json:"ad_alt,omitempty"`
	AdTotal                            int32                    `json:"ad_total,omitempty"`
	Gq                                 int32                    `json:"genotype_quality" validate:"required"`
	Filter                             string                   `json:"filter,omitempty"`
	ExomiserAcmgEvidence               JsonArray[string]        `gorm:"type:json" json:"exomiser_acmg_evidence" validate:"required"`
	ExomiserGeneCombinedScore          float64                  `json:"exomiser_gene_combined_score" validate:"required"`
	ExomiserAcmgClassification         string                   `json:"exomiser_acmg_classification,omitempty"`
	ExomiserACMGClassificationCounts   JsonMap[string, int]     `gorm:"type:json" json:"exomiser_acmg_classification_counts,omitempty"`
	InterpretationClassificationCounts JsonMap[string, int]     `gorm:"type:json" json:"interpretation_classification_counts,omitempty"`
	CaseId                             int                      `json:"case_id" validate:"required"`
} // @name ExpandedGermlineSNVOccurrence

var GermlineSNVOccurrenceTable = Table{
	Name:  "germline__snv__occurrence",
	Alias: "o",
}

var GermlineSNVFilterField = Field{
	Name:            "filter",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVSeqIdField = Field{
	Name:          "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVLocusIdField = Field{
	Name:          "locus_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVZygosityField = Field{
	Name:            "zygosity",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVTransmissionModeField = Field{
	Name:            "transmission_mode",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVParentalOriginField = Field{
	Name:            "parental_origin",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVMotherZygosityField = Field{
	Name:            "mother_zygosity",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVFatherZygosityField = Field{
	Name:            "father_zygosity",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVGenotypeQualityField = Field{
	Name:          "gq",
	Alias:         "genotype_quality",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVAdRatioField = Field{
	Name:          "ad_ratio",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVAdAltField = Field{
	Name:          "ad_alt",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVAdTotalField = Field{
	Name:          "ad_total",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVInfoQdField = Field{
	Name:          "info_qd",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVExomiserMoiField = Field{
	Name:            "exomiser_moi",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVExomiserAcmgClassificationField = Field{
	Name:            "exomiser_acmg_classification",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVExomiserAcmgEvidenceField = Field{
	Name:            "exomiser_acmg_evidence",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	IsArray:         true,
	Table:           GermlineSNVOccurrenceTable,
}
var GermlineSNVExomiserVariantScoreField = Field{
	Name:          "exomiser_variant_score",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineSNVOccurrenceTable,
}
var GermlineSNVExomiserGeneCombinedScoreField = Field{
	Name:          "exomiser_gene_combined_score",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineSNVOccurrenceTable,
}

var GermlineSNVOccurrencesFields = []Field{
	GermlineSNVSeqIdField,
	GermlineSNVTaskIdField,
	GermlineSNVLocusIdField,
	GermlineSNVFilterField,
	GermlineSNVGenotypeQualityField,
	GermlineSNVAdRatioField,
	GermlineSNVAdAltField,
	GermlineSNVAdTotalField,
	HgvsgField,
	ClinvarField,
	ConsequenceField,
	SymbolField,
	PickedImpactScoreField,
	ImpactScoreField,
	RsNumberField,
	PickedAaChangeField,
	PickedConsequencesField,
	PickedSymbolField,
	PickedIsManeSelectField,
	PickedIsManePlusField,
	PickedIsCanonicalField,
	PickedOmimInheritanceCodeField,
	PickedTranscriptIdField,
	GermlineSNVTransmissionModeField,
	GermlineSNVParentalOriginField,
	GermlineSNVMotherZygosityField,
	GermlineSNVFatherZygosityField,
	GermlineSNVInfoQdField,

	// Frequencies
	PfWgsField,
	PnWgsField,
	PcWgsField,
	PfWgsAffectedField,
	PfWgsNotAffectedField,
	GnomadV3AfField,
	TopmedAfField,
	ThousandGenomesAfField,

	// Variants
	VariantClassField,
	ChromosomeField,
	StartField,
	GermlineSNVZygosityField,

	// Genes
	PickedVepImpactField,
	VepImpactFilterField,
	GnomadPliField,
	GnomadLoeufField,
	BiotypeField,
	OmimGenePanelField,
	HpoGenePanelField,
	DddGenePanelField,
	CosmicGenePanelField,
	OmimInheritanceField,
	OrphanetGenePanelField,

	// Predictions
	CaddScoreField,
	CaddPhredField,
	DannScoreField,
	FathmmPredField,
	LrtPredField,
	Polyphen2HvarPredField,
	RevelScoreField,
	SpliceaiDsField,
	SiftPredField,

	// Exomiser
	GermlineSNVExomiserMoiField,
	GermlineSNVExomiserAcmgClassificationField,
	GermlineSNVExomiserAcmgEvidenceField,
	GermlineSNVExomiserGeneCombinedScoreField,
	GermlineSNVExomiserVariantScoreField,
}

var GermlineSNVOccurrencesDefaultFields = []Field{
	GermlineSNVSeqIdField,
	GermlineSNVTaskIdField,
	GermlineSNVLocusIdField,
	HgvsgField,
	VariantClassField,
	GnomadV3AfField,
	PfWgsField,
	GermlineSNVGenotypeQualityField,
	GermlineSNVZygosityField,
	GermlineSNVAdRatioField,
	PickedConsequencesField,
	PickedAaChangeField,
	ClinvarField,
	PickedIsManeSelectField,
	PickedIsManePlusField,
	PickedVepImpactField,
	PickedImpactScoreField,
	PickedSymbolField,
	ChromosomeField,
	StartField,
	GermlineSNVExomiserMoiField,
	GermlineSNVExomiserAcmgClassificationField,
	GermlineSNVExomiserAcmgEvidenceField,
	GermlineSNVExomiserGeneCombinedScoreField,
	GermlineSNVExomiserVariantScoreField,
}

var GermlineSNVOccurrencesDefaultSort = []SortField{{Field: PickedImpactScoreField, Order: "desc"}}

var GermlineSNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     GermlineSNVOccurrencesFields,
	DefaultFields: GermlineSNVOccurrencesDefaultFields,
	DefaultSort:   GermlineSNVOccurrencesDefaultSort,
	IdField:       GermlineSNVLocusIdField,
}
