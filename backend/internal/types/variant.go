package types

import "time"

type VariantHeader = struct {
	Hgvsg           string            `json:"hgvsg" validate:"required"`
	AssemblyVersion string            `json:"assembly_version,omitempty"`
	Source          JsonArray[string] `gorm:"type:json" json:"source,omitempty"`
} // @name VariantOverview

type VariantOverview = struct {
	Symbol                             string                   `json:"symbol,omitempty"`
	Consequences                       JsonArray[string]        `gorm:"type:json" json:"picked_consequences" validate:"required"`
	ClinvarInterpretation              JsonArray[string]        `gorm:"type:json" json:"clinvar,omitempty"`
	GermlinePcWgs                      int                      `json:"germline_pc_wgs,omitempty"`
	GermlinePnWgs                      int                      `json:"germline_pn_wgs,omitempty"`
	GermlinePfWgs                      float64                  `json:"germline_pf_wgs" validate:"required"`
	GnomadV3Af                         float64                  `json:"gnomad_v3_af" validate:"required"`
	IsCanonical                        bool                     `json:"is_canonical" validate:"required"`
	IsManeSelect                       bool                     `json:"is_mane_select" validate:"required"`
	IsManePlus                         bool                     `json:"is_mane_plus" validate:"required"`
	TranscriptId                       string                   `json:"transcript_id,omitempty"`
	ExonRank                           int                      `json:"exon_rank,omitempty"`
	ExonTotal                          int                      `json:"exon_total,omitempty"`
	DnaChange                          string                   `json:"dna_change,omitempty"`
	Rsnumber                           string                   `json:"rsnumber,omitempty"`
	SiftPred                           string                   `json:"sift_pred,omitempty"`
	SiftScore                          float32                  `json:"sift_score,omitempty"`
	RevelScore                         float32                  `json:"revel_score,omitempty"`
	GnomadLoeuf                        float32                  `json:"gnomad_loeuf,omitempty"`
	SpliceaiDs                         float32                  `json:"spliceai_ds,omitempty"`
	SpliceaiType                       JsonArray[string]        `gorm:"type:json" json:"spliceai_type,omitempty"`
	OmimConditions                     JsonArray[OmimGenePanel] `gorm:"type:json" json:"omim_conditions,omitempty"`
	Locus                              string                   `json:"locus" validate:"required"`
	FathmmPred                         string                   `json:"fathmm_pred,omitempty"`
	FathmmScore                        float32                  `json:"fathmm_score,omitempty"`
	CaddScore                          float32                  `json:"cadd_score,omitempty"`
	CaddPhred                          float32                  `json:"cadd_phred,omitempty"`
	DannScore                          float32                  `json:"dann_score,omitempty"`
	LrtPred                            string                   `json:"lrt_pred,omitempty"`
	LrtScore                           float32                  `json:"lrt_score,omitempty"`
	Polyphen2HvarPred                  string                   `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore                 float32                  `json:"polyphen2_hvar_score,omitempty"`
	PhyloP17wayPrimate                 float32                  `json:"phyloP17way_primate,omitempty"`
	GnomadPli                          float64                  `json:"gnomad_pli,omitempty"`
	ClinvarName                        string                   `json:"clinvar_name,omitempty"`
	AaChange                           string                   `json:"aa_change,omitempty"`
	VepImpact                          VepImpact                `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"`
	ExomiserACMGClassificationCounts   map[string]int           `gorm:"type:json" json:"exomiser_acmg_classification_counts,omitempty"`
	InterpretationClassificationCounts map[string]int           `gorm:"type:json" json:"interpretation_classification_counts,omitempty"`
} // @name VariantOverview

type VariantInterpretedCase = struct {
	SeqId                   int             `json:"seq_id" validate:"required"`
	CaseId                  int             `json:"case_id" validate:"required"`
	PatientId               int             `json:"patient_id" validate:"required"`
	TranscriptId            string          `json:"transcript_id" validate:"required"`
	InterpretationUpdatedOn time.Time       `json:"interpretation_updated_on" validate:"required"`
	ConditionId             string          `json:"condition_id" validate:"required"`
	ConditionName           string          `json:"condition_name" validate:"required"`
	Classification          string          `json:"classification" validate:"required"`
	SubmitterSampleId       string          `json:"submitter_sample_id,omitempty"`
	RelationshipToProband   string          `json:"relationship_to_proband,omitempty"`
	AffectedStatus          string          `json:"affected_status,omitempty"`
	ClassificationCode      string          `json:"-"`
	Zygosity                string          `json:"zygosity" validate:"required"`
	DiagnosisLabCode        string          `json:"diagnosis_lab_code,omitempty"`
	DiagnosisLabName        string          `json:"diagnosis_lab_name,omitempty"`
	AnalysisCatalogCode     string          `json:"analysis_catalog_code,omitempty"`
	AnalysisCatalogName     string          `json:"analysis_catalog_name,omitempty"`
	StatusCode              string          `json:"status_code" validate:"required"`
	PhenotypesUnparsed      string          `json:"-"`
	Phenotypes              JsonArray[Term] `json:"observed_phenotypes"`
} // @name VariantInterpretedCase

type VariantUninterpretedCase = struct {
	CaseId                    int             `json:"case_id" validate:"required"`
	SeqId                     int             `json:"seq_id" validate:"required"`
	PatientId                 int             `json:"patient_id" validate:"required"`
	UpdatedOn                 time.Time       `json:"updated_on" validate:"required"`
	SubmitterSampleId         string          `json:"submitter_sample_id" validate:"required"`
	RelationshipToProbandCode string          `json:"relationship_to_proband,omitempty"`
	AffectedStatusCode        string          `json:"affected_status" validate:"required"`
	PrimaryConditionId        string          `json:"primary_condition_id,omitempty"`
	PrimaryConditionName      string          `json:"primary_condition_name,omitempty"`
	Zygosity                  string          `json:"zygosity" validate:"required"`
	DiagnosisLabCode          string          `json:"diagnosis_lab_code" validate:"required"`
	DiagnosisLabName          string          `json:"diagnosis_lab_name" validate:"required"`
	AnalysisCatalogCode       string          `json:"analysis_catalog_code,omitempty"`
	AnalysisCatalogName       string          `json:"analysis_catalog_name,omitempty"`
	PhenotypesUnparsed        string          `json:"-"`
	Phenotypes                JsonArray[Term] `json:"observed_phenotypes" validate:"required"`
	FilterIsPass              *bool           `json:"filter_is_pass" validate:"required"`
	TransmissionMode          string          `json:"transmission_mode" validate:"required"`
	InfoQd                    float32         `json:"info_qd,omitempty"`
	GenotypeQuality           int             `json:"genotype_quality,omitempty"`
	AdAlt                     int             `json:"ad_alt,omitempty"`
	AdTotal                   int             `json:"ad_total,omitempty"`
	AdRatio                   float32         `json:"ad_ratio,omitempty"`
	SexCode                   string          `json:"sex_code,omitempty"`
} // @name VariantUninterpretedCase

type VariantCasesFilters = struct {
	Classification   []FiltersValue `json:"classification" validate:"required"`
	AnalysisCatalog  []FiltersValue `json:"analysis_catalog_code" validate:"required"`
	DiagnosisLab     []FiltersValue `json:"diagnosis_lab_code" validate:"required"`
	Sex              []FiltersValue `json:"sex_code" validate:"required"`
	Zygosity         []FiltersValue `json:"zygosity" validate:"required"`
	TransmissionMode []FiltersValue `json:"transmission_mode" validate:"required"`
} // @name VariantCasesFilters

type VariantCasesCount struct {
	CountInterpreted   int64 `json:"count_interpreted" validate:"required"`
	CountUninterpreted int64 `json:"count_uninterpreted" validate:"required"`
} // @name VariantCasesCount

type VariantExternalFrequencies struct {
	Locus               string                         `json:"locus" validate:"required"`
	ExternalFrequencies JsonArray[ExternalFrequencies] `json:"external_frequencies" validate:"required"`
	TopmedAf            *float64                       `json:"-"`
	TopmedAc            *int                           `json:"-"`
	TopmedAn            *int                           `json:"-"`
	TopmedHom           *int                           `json:"-"`
	GnomadV3Af          *float64                       `json:"-"`
	GnomadV3Ac          *int                           `json:"-"`
	GnomadV3An          *int                           `json:"-"`
	GnomadV3Hom         *int                           `json:"-"`
	ThousandGenomesAf   *float64                       `json:"-"`
	ThousandGenomesAc   *int                           `json:"-"`
	ThousandGenomesAn   *int                           `json:"-"`
} // @name VariantExternalFrequencies

type VariantInternalFrequencies struct {
	SplitRows JsonArray[InternalFrequenciesSplitBy] `json:"split_rows" validate:"required"`
}

var VariantTable = Table{
	Name:      "snv__variant",
	Alias:     "v",
	PerTenant: true,
}

var VariantInterpretedCasesFields = append(CasesFields, GermlineInterpretationClassificationField, GermlineInterpretationUpdatedOnField, ConditionIdField, ConditionNameField, ConditionTermField, AggregatedPhenotypeTermField)
var VariantInterpretedCasesDefaultSort = []SortField{{Field: GermlineInterpretationUpdatedOnField, Order: "desc"}}

var VariantUninterpretedCasesDefaultFields = []Field{
	CaseIdField,
	FamilyRelationshipToProbandCodeField,
	SequencingExperimentIdField,
	SampleSubmitterSampleIdField,
	FamilyAffectedStatusCodeField,
	AggregatedPhenotypeUnparsedField,
	GermlineSNVFilterIsPassField,
	GermlineSNVZygosityField,
	GermlineSNVTransmissionModeField,
	CaseDiagnosisLabCodeField,
	CaseDiagnosisLabNameField,
	CaseUpdatedOnField,
	SamplePatientIdField,
	TaskContextTaskIdField,
}

var VariantUninterpretedCasesFields = append(VariantUninterpretedCasesDefaultFields,
	AggregatedPhenotypeTermField,
	CasePrimaryConditionIdField,
	CasePrimaryConditionNameField,
	AnalysisCatalogCodeField,
	AnalysisCatalogNameField,
	GermlineSNVInfoQdField,
	GermlineSNVGenotypeQualityField,
	GermlineSNVAdAltField,
	GermlineSNVAdTotalField,
	GermlineSNVAdRatioField,
	PatientSexCodeField,
)

var VariantInterpretedCasesQueryConfig = QueryConfig{
	AllFields:     VariantInterpretedCasesFields,
	DefaultFields: []Field{},
	DefaultSort:   VariantInterpretedCasesDefaultSort,
	IdField:       CaseIdField,
}

var VariantUninterpretedCasesQueryConfig = QueryConfig{
	AllFields:     VariantUninterpretedCasesFields,
	DefaultFields: VariantUninterpretedCasesDefaultFields,
	DefaultSort:   append(CasesDefaultSort, SortField{Field: CaseIdField, Order: "asc"}, SortField{Field: SequencingExperimentIdField, Order: "desc"}, SortField{Field: TaskContextTaskIdField, Order: "desc"}),
	IdField:       CaseIdField,
}

var ChromosomeField = Field{
	Name:            "chromosome",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           VariantTable,
}

var StartField = Field{
	Name:            "start",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Type:            IntegerType,
	Table:           VariantTable,
}

var EndField = Field{
	Name:            "end",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Type:            IntegerType,
	Table:           VariantTable,
}

var GermlinePfWgsField = Field{
	Name:          "germline_pf_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePcWgsField = Field{
	Name:          "germline_pc_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePnWgsField = Field{
	Name:          "germline_pn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePfWgsAffectedField = Field{
	Name:          "germline_pf_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePfWgsNotAffectedField = Field{
	Name:          "germline_pf_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlineHomWgsField = Field{
	Name:          "germline_hom_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineAfWgsField = Field{
	Name:          "germline_af_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePcWgsAffectedField = Field{
	Name:          "germline_pc_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePnWgsAffectedField = Field{
	Name:          "germline_pn_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineHomWgsAffectedField = Field{
	Name:          "germline_hom_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineAfWgsAffectedField = Field{
	Name:          "germline_af_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePcWgsNotAffectedField = Field{
	Name:          "germline_pc_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePnWgsNotAffectedField = Field{
	Name:          "germline_pn_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineHomWgsNotAffectedField = Field{
	Name:          "germline_hom_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineAfWgsNotAffectedField = Field{
	Name:          "germline_af_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePcWxsField = Field{
	Name:          "germline_pc_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePnWxsField = Field{
	Name:          "germline_pn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePfWxsField = Field{
	Name:          "germline_pf_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlineHomWxsField = Field{
	Name:          "germline_hom_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineAfWxsField = Field{
	Name:          "germline_af_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePcWxsAffectedField = Field{
	Name:          "germline_pc_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePnWxsAffectedField = Field{
	Name:          "germline_pn_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePfWxsAffectedField = Field{
	Name:          "germline_pf_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlineHomWxsAffectedField = Field{
	Name:          "germline_hom_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineAfWxsAffectedField = Field{
	Name:          "germline_af_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlinePcWxsNotAffectedField = Field{
	Name:          "germline_pc_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePnWxsNotAffectedField = Field{
	Name:          "germline_pn_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlinePfWxsNotAffectedField = Field{
	Name:          "germline_pf_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var GermlineHomWxsNotAffectedField = Field{
	Name:          "germline_hom_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var GermlineAfWxsNotAffectedField = Field{
	Name:          "germline_af_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var VariantClassField = Field{
	Name:            "variant_class",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           VariantTable,
}
var HgvsgField = Field{
	Name:          "hgvsg",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var ClinvarField = Field{
	Name:            "clinvar_interpretation",
	Alias:           "clinvar",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	IsArray:         true,
	Table:           VariantTable,
}

var RsNumberField = Field{
	Name:          "rsnumber",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var PickedAaChangeField = Field{
	Name:          "aa_change",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var PickedConsequencesField = Field{
	Name:            "consequences",
	Alias:           "picked_consequences",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	IsArray:         true,
	Table:           VariantTable,
}
var PickedVepImpactField = Field{
	Name:          "vep_impact",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var PickedSymbolField = Field{
	Name:          "symbol",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var PickedIsManeSelectField = Field{
	Name:          "is_mane_select",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var PickedIsManePlusField = Field{
	Name:          "is_mane_plus",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var PickedIsCanonicalField = Field{
	Name:          "is_canonical",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var PickedOmimInheritanceCodeField = Field{
	Name:          "omim_inheritance_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	IsArray:       true,
	Table:         VariantTable,
}
var GnomadV3AfField = Field{
	Name:            "gnomad_v3_af",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Type:            DecimalType,
	Table:           VariantTable,
}
var CmcSampleMutatedField = Field{
	Name:            "cmc_sample_mutated",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	SortNullsLast:   true,
	Type:            IntegerType,
	Table:           VariantTable,
}
var CmcSampleRatioField = Field{
	Name:            "cmc_sample_ratio",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	SortNullsLast:   true,
	Type:            DecimalType,
	Table:           VariantTable,
}
var CmcTierField = Field{
	Name:            "cmc_tier",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	SortNullsLast:   true,
	Table:           VariantTable,
}
var CmcMutationUrlField = Field{
	Name:          "cmc_mutation_url",
	CanBeSelected: true,
	Table:         VariantTable,
}
var ReferenceField = Field{
	Name:          "reference",
	CanBeSelected: true,
	Table:         VariantTable,
}
var AlternateField = Field{
	Name:          "alternate",
	CanBeSelected: true,
	Table:         VariantTable,
}
var PickedTranscriptIdField = Field{
	Name:          "transcript_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var PickedImpactScoreField = Field{
	Name:          "impact_score",
	Alias:         "max_impact_score",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var SomaticPfTnWgsField = Field{
	Name:          "somatic_pf_tn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticPcTnWgsField = Field{
	Name:          "somatic_pc_tn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticPfToWgsField = Field{
	Name:          "somatic_pf_to_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticPcToWgsField = Field{
	Name:          "somatic_pc_to_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticPnTnWgsField = Field{
	Name:          "somatic_pn_tn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticHomTnWgsField = Field{
	Name:          "somatic_hom_tn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticAfTnWgsField = Field{
	Name:          "somatic_af_tn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticPcTnWxsField = Field{
	Name:          "somatic_pc_tn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticPnTnWxsField = Field{
	Name:          "somatic_pn_tn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticPfTnWxsField = Field{
	Name:          "somatic_pf_tn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticHomTnWxsField = Field{
	Name:          "somatic_hom_tn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticAfTnWxsField = Field{
	Name:          "somatic_af_tn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticPnToWgsField = Field{
	Name:          "somatic_pn_to_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticHomToWgsField = Field{
	Name:          "somatic_hom_to_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticAfToWgsField = Field{
	Name:          "somatic_af_to_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticPcToWxsField = Field{
	Name:          "somatic_pc_to_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticPnToWxsField = Field{
	Name:          "somatic_pn_to_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticPfToWxsField = Field{
	Name:          "somatic_pf_to_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

var SomaticHomToWxsField = Field{
	Name:          "somatic_hom_to_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}

var SomaticAfToWxsField = Field{
	Name:          "somatic_af_to_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}

// SNVVariantFrequencyFields lists the internal frequencies of a variant: pc, pn, pf, hom and af
// for each germline (WGS, WXS × all, affected, not affected) and somatic (TN, TO × WGS, WXS) cohort.
var SNVVariantFrequencyFields = []Field{
	GermlinePcWgsField,
	GermlinePnWgsField,
	GermlinePfWgsField,
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
	SomaticPcTnWgsField,
	SomaticPnTnWgsField,
	SomaticPfTnWgsField,
	SomaticHomTnWgsField,
	SomaticAfTnWgsField,
	SomaticPcTnWxsField,
	SomaticPnTnWxsField,
	SomaticPfTnWxsField,
	SomaticHomTnWxsField,
	SomaticAfTnWxsField,
	SomaticPcToWgsField,
	SomaticPnToWgsField,
	SomaticPfToWgsField,
	SomaticHomToWgsField,
	SomaticAfToWgsField,
	SomaticPcToWxsField,
	SomaticPnToWxsField,
	SomaticPfToWxsField,
	SomaticHomToWxsField,
	SomaticAfToWxsField,
}
