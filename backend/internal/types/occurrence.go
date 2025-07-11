package types

// Occurrence represents an occurrence
// @Description Occurrence represents an occurrence
type Occurrence struct {
	SeqId                      int               `json:"seq_id" validate:"required"`
	TaskId                     int               `json:"task_id" validate:"required"`
	Chromosome                 string            `json:"chromosome" validate:"required"`
	Start                      int64             `json:"start" validate:"required"`
	LocusId                    string            `json:"locus_id" validate:"required"`
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
	RsNumber                   string            `json:"rsnumber,omitempty"`
	PickedConsequences         JsonArray[string] `gorm:"type:json" json:"picked_consequences" validate:"required"`
	TranscriptId               string            `json:"transcript_id,omitempty"`
	MaxImpactScore             int               `json:"max_impact_score" validate:"required"`
	HasInterpretation          bool              `json:"has_interpretation" validate:"required"`
	ExomiserMoi                string            `json:"exomiser_moi" validate:"required"`
	ExomiserAcmgClassification string            `json:"exomiser_acmg_classification" validate:"required"`
	ExomiserAcmgEvidence       JsonArray[string] `gorm:"type:json" json:"exomiser_acmg_evidence" validate:"required"`
	ExomiserVariantScore       float64           `json:"exomiser_variant_score" validate:"required"`
	ExomiserGeneCombinedScore  float64           `json:"exomiser_gene_combined_score" validate:"required"`
} // @name Occurrence

type ExpendedOccurrence = struct {
	LocusId                   string                   `json:"locus_id" validate:"required"`
	Hgvsg                     string                   `json:"hgvsg" validate:"required"`
	Locus                     string                   `json:"locus" validate:"required"`
	Chromosome                string                   `json:"chromosome"`
	Start                     int64                    `json:"start,omitempty"`
	End                       int64                    `json:"end,omitempty"`
	Symbol                    string                   `json:"symbol,omitempty"`
	TranscriptId              string                   `json:"transcript_id,omitempty"`
	IsCanonical               bool                     `json:"is_canonical"`
	IsManeSelect              bool                     `json:"is_mane_select"`
	IsManePlus                bool                     `json:"is_mane_plus"`
	ExonRank                  int                      `json:"exon_rank,omitempty"`
	ExonTotal                 int                      `json:"exon_total,omitempty"`
	DnaChange                 string                   `json:"dna_change,omitempty"`
	VepImpact                 VepImpact                `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	Consequences              JsonArray[string]        `gorm:"type:json" json:"picked_consequences" validate:"required"`
	AaChange                  string                   `json:"aa_change,omitempty"`
	Rsnumber                  string                   `json:"rsnumber,omitempty"`
	ClinvarInterpretation     JsonArray[string]        `gorm:"type:json" json:"clinvar,omitempty"`
	GnomadPli                 float32                  `json:"gnomad_pli,omitempty"`
	GnomadLoeuf               float32                  `json:"gnomad_loeuf,omitempty"`
	SpliceaiType              JsonArray[string]        `gorm:"type:json" json:"spliceai_type,omitempty"`
	SpliceaiDs                float32                  `json:"spliceai_ds,omitempty"`
	Af                        float64                  `json:"af,omitempty"` // TODO
	PfWgs                     float64                  `json:"pf_wgs,omitempty"`
	GnomadV3Af                float64                  `json:"gnomad_v3_af" validate:"required"`
	SiftPred                  string                   `json:"sift_pred,omitempty"`
	SiftScore                 float32                  `json:"sift_score,omitempty"`
	RevelScore                float32                  `json:"revel_score,omitempty"`
	FathmmPred                string                   `json:"fathmm_pred,omitempty"`
	FathmmScore               float32                  `json:"fathmm_score,omitempty"`
	CaddPhred                 float32                  `json:"cadd_phred,omitempty"`
	CaddScore                 float32                  `json:"cadd_score,omitempty"`
	DannScore                 float32                  `json:"dann_score,omitempty"`
	Zygosity                  string                   `json:"zygosity,omitempty"`
	TransmissionMode          string                   `json:"transmission,omitempty"`
	ParentalOrigin            string                   `json:"parental_origin,omitempty"`
	OmimConditions            JsonArray[OmimGenePanel] `gorm:"type:json" json:"omim_conditions,omitempty"`
	FatherCalls               JsonArray[int]           `gorm:"type:json" json:"father_calls,omitempty"`
	MotherCalls               JsonArray[int]           `gorm:"type:json" json:"mother_calls,omitempty"`
	InfoQd                    float32                  `json:"qd,omitempty"`
	AdAlt                     int32                    `json:"ad_alt,omitempty"`
	AdTotal                   int32                    `json:"ad_total,omitempty"`
	Gq                        int32                    `json:"genotype_quality" validate:"required"`
	Filter                    string                   `json:"filter,omitempty"`
	ExomiserAcmgEvidence      JsonArray[string]        `gorm:"type:json" json:"exomiser_acmg_evidence" validate:"required"`
	ExomiserGeneCombinedScore float64                  `json:"exomiser_gene_combined_score" validate:"required"`
} // @name ExpendedOccurrence

var OccurrenceTable = Table{
	Name:  "germline__snv__occurrence",
	Alias: "o",
}

var FilterField = Field{
	Name:            "filter",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var SeqIdField = Field{
	Name:          "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         OccurrenceTable,
}
var TaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         OccurrenceTable,
}
var LocusIdField = Field{
	Name:          "locus_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         OccurrenceTable,
}
var ZygosityField = Field{
	Name:            "zygosity",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var TransmissionModeField = Field{
	Name:            "transmission_mode",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var GenotypeQualityField = Field{
	Name:          "gq",
	Alias:         "genotype_quality",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}
var AdRatioField = Field{
	Name:          "ad_ratio",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}
var AdAltField = Field{
	Name:          "ad_alt",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}
var AdTotalField = Field{
	Name:          "ad_total",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}
var InfoQdField = Field{
	Name:          "info_qd",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}
var ExomiserMoiField = Field{
	Name:            "exomiser_moi",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var ExomiserAcmgClassificationField = Field{
	Name:            "exomiser_acmg_classification",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           OccurrenceTable,
}
var ExomiserAcmgEvidenceField = Field{
	Name:            "exomiser_acmg_evidence",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Type:            ArrayType,
	Table:           OccurrenceTable,
}
var ExomiserVariantScoreField = Field{
	Name:          "exomiser_variant_score",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}
var ExomiserGeneCombinedScoreField = Field{
	Name:          "exomiser_gene_combined_score",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         OccurrenceTable,
}

var OccurrencesFields = []Field{
	SeqIdField,
	TaskIdField,
	LocusIdField,
	FilterField,
	GenotypeQualityField,
	AdRatioField,
	AdAltField,
	AdTotalField,
	PfWgsField,
	PnWgsField,
	PcWgsField,
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
	GnomadV3AfField,
	PickedTranscriptIdField,
	TransmissionModeField,
	InfoQdField,

	// Variants
	VariantClassField,
	ChromosomeField,
	StartField,
	ZygosityField,

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
	ExomiserMoiField,
	ExomiserAcmgClassificationField,
	ExomiserAcmgEvidenceField,
	ExomiserGeneCombinedScoreField,
	ExomiserVariantScoreField,
}

var OccurrencesDefaultFields = []Field{
	SeqIdField,
	TaskIdField,
	LocusIdField,
	HgvsgField,
	VariantClassField,
	GnomadV3AfField,
	PfWgsField,
	GenotypeQualityField,
	ZygosityField,
	AdRatioField,
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
	ExomiserMoiField,
	ExomiserAcmgClassificationField,
	ExomiserAcmgEvidenceField,
	ExomiserGeneCombinedScoreField,
	ExomiserVariantScoreField,
}

var OccurrencesDefaultSort = []SortField{{Field: PickedImpactScoreField, Order: "desc"}}

var OccurrencesQueryConfig = QueryConfig{
	AllFields:     OccurrencesFields,
	DefaultFields: OccurrencesDefaultFields,
	DefaultSort:   OccurrencesDefaultSort,
	IdField:       LocusIdField,
}
