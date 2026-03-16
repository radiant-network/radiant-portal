package types

type SomaticSNVOccurrence struct {
	LocusId             string            `json:"locus_id" validate:"required"`
	SeqId               int               `json:"seq_id" validate:"required"`
	TaskId              int               `json:"task_id" validate:"required"`
	HasInterpretation   bool              `json:"has_interpretation" validate:"required"`
	Hgvsg               string            `json:"hgvsg" validate:"required"`
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
	// TODO CMC
	// TODO Tier
	Clinvar        JsonArray[string] `gorm:"type:json" json:"clinvar" validate:"required"`
	GnomadV3Af     *float64          `json:"gnomad_v3_af" validate:"required"`
	GermlinePfWgs  *float64          `json:"germline_pf_wgs" validate:"required"`
	GermlinePcWgs  *int              `json:"germline_pc_wgs" validate:"required"`
	SomaticPfTnWgs *float64          `json:"somatic_pf_tn_wgs" validate:"required"`
	SomaticPcTnWgs *int              `json:"somatic_pc_tn_wgs" validate:"required"`
	SomaticQuality *int32            `json:"somatic_quality" validate:"required"`
	Zygosity       string            `json:"zygosity,omitempty"`
	AdRatio        *float32          `json:"ad_ratio,omitempty"`
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
	Table:         SomaticSNVOccurrenceTable,
}

var SomaticSNVFilterField = Field{
	Name:            "filter",
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           SomaticSNVOccurrenceTable,
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
	RsNumberField,
	PickedOmimInheritanceCodeField,
	SomaticSNVInfoHotspotAlleleField,
	ClinvarField,
	GnomadV3AfField,
	GermlinePfWgsField,
	GermlinePcWgsField,
	SomaticPfTnWgsField,
	SomaticPcTnWgsField,
	// TODO somatic quality
}

var SomaticSNVOccurrencesFields = append(SomaticSNVOccurrencesDefaultFields,
	// TODO zygosity
	SomaticSNVTumorAdRatioField,

	// Variant facets
	ConsequenceField,
	ChromosomeField,
	StartField,

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
	// TODO COSMIC

	// Frequency facets
	GermlinePfWgsAffectedField,
	GermlinePfWgsNotAffectedField,
	TopmedAfField,
	ThousandGenomesAfField,

	// Occurrence facets
	// TODO zygosity and metrics
	SomaticSNVFilterField,
)

var SomaticSNVOccurrencesDefaultSort = []SortField{{Field: PickedImpactScoreField, Order: "desc"}}

var SomaticSNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     SomaticSNVOccurrencesFields,
	DefaultFields: SomaticSNVOccurrencesDefaultFields,
	DefaultSort:   SomaticSNVOccurrencesDefaultSort,
	IdField:       SomaticSNVLocusIdField,
}
