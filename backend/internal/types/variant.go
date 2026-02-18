package types

import "time"

/*
+----------------------+-------------------+----+-----+-------+-----+
|Field                 |Type               |Null|Key  |Default|Extra|
+----------------------+-------------------+----+-----+-------+-----+
|locus_id              |bigint             |NO  |true |null   |     |
|pf_wgs                |double             |YES |false|null   |     |
|gnomad_v3_af          |double             |YES |false|null   |     |
|topmed_af             |double             |YES |false|null   |     |
|tg_af                 |double             |YES |false|null   |     |
|pc_wgs                |int                |YES |false|null   |     |
|pn_wgs                |int                |YES |false|null   |     |
|chromosome            |char(2)            |YES |false|null   |     |
|start                 |bigint             |YES |false|null   |     |
|clinvar_name          |varchar(2000)      |YES |false|null   |     |
|variant_class         |varchar(50)        |YES |false|null   |     |
|clinvar_interpretation|array<varchar(100)>|YES |false|null   |     |
|symbol                |varchar(20)        |YES |false|null   |     |
|impact_score          |tinyint            |YES |false|null   |     |
|consequences          |array<varchar(50)> |YES |false|null   |     |
|vep_impact            |varchar(20)        |YES |false|null   |     |
|is_mane_select        |boolean            |YES |false|null   |     |
|is_mane_plus          |boolean            |YES |false|null   |     |
|is_canonical          |boolean            |YES |false|null   |     |
|rsnumber              |array<varchar(15)> |YES |false|null   |     |
|reference             |varchar(2000)      |YES |false|null   |     |
|alternate             |varchar(2000)      |YES |false|null   |     |
|mane_select           |varchar(200)       |YES |false|null   |     |
|hgvsg                 |varchar(2000)      |YES |false|null   |     |
|hgvsc                 |varchar(2000)      |YES |false|null   |     |
|hgvsp                 |varchar(2000)      |YES |false|null   |     |
|locus                 |varchar(2000)      |YES |false|null   |     |
|dna_change            |varchar(2000)      |YES |false|null   |     |
|aa_change             |varchar(2000)      |YES |false|null   |     |
|transcript_id         |varchar(100)       |YES |false|null   |     |
|omim_inheritance_code |array<varchar(5)>  |YES |false|null   |     |
+----------------------+-------------------+----+-----+-------+-----+

*/

type VariantHeader = struct {
	Hgvsg           string            `json:"hgvsg" validate:"required"`
	AssemblyVersion string            `json:"assembly_version,omitempty"`
	Source          JsonArray[string] `gorm:"type:json" json:"source,omitempty"`
} // @name VariantOverview

type VariantOverview = struct {
	Symbol                             string                   `json:"symbol,omitempty"`
	Consequences                       JsonArray[string]        `gorm:"type:json" json:"picked_consequences" validate:"required"`
	ClinvarInterpretation              JsonArray[string]        `gorm:"type:json" json:"clinvar,omitempty"`
	PcWgs                              int                      `json:"pc_wgs,omitempty"`
	PnWgs                              int                      `json:"pn_wgs,omitempty"`
	PfWgs                              float64                  `json:"pf_wgs" validate:"required"`
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
	CaseId                     int               `json:"case_id" validate:"required"`
	SeqId                      int               `json:"seq_id" validate:"required"`
	PatientId                  int               `json:"patient_id" validate:"required"`
	CreatedOn                  time.Time         `json:"created_on" validate:"required"`
	UpdatedOn                  time.Time         `json:"updated_on" validate:"required"`
	SubmitterSampleId          string            `json:"submitter_sample_id,omitempty"`
	RelationshipToProbandCode  string            `json:"relationship_to_proband,omitempty"`
	AffectedStatusCode         string            `json:"affected_status,omitempty"`
	PrimaryConditionId         string            `json:"primary_condition_id,omitempty"`
	PrimaryConditionName       string            `json:"primary_condition_name,omitempty"`
	Zygosity                   string            `json:"zygosity" validate:"required"`
	DiagnosisLabCode           string            `json:"diagnosis_lab_code,omitempty"`
	DiagnosisLabName           string            `json:"diagnosis_lab_name,omitempty"`
	AnalysisCatalogCode        string            `json:"analysis_catalog_code,omitempty"`
	AnalysisCatalogName        string            `json:"analysis_catalog_name,omitempty"`
	StatusCode                 string            `json:"status_code" validate:"required"`
	PhenotypesUnparsed         string            `json:"-"`
	Phenotypes                 JsonArray[Term]   `json:"observed_phenotypes"`
	ExomiserACMGClassification string            `json:"exomiser_acmg_classification,omitempty"`
	ExomiserACMGEvidence       JsonArray[string] `json:"exomiser_acmg_evidence,omitempty"`
	FilterIsPass               *bool             `json:"filter_is_pass,omitempty"`
} // @name VariantUninterpretedCase

type VariantExpandedInterpretedCase = struct {
	PatientID                     int               `json:"patient_id" validate:"required"`
	InterpreterName               string            `json:"interpreter_name" validate:"required"`
	Interpretation                string            `json:"interpretation" validate:"required"`
	GeneSymbol                    string            `json:"gene_symbol" validate:"required"`
	ClassificationCriteriasString string            `json:"-"`
	ClassificationCriterias       JsonArray[string] `json:"classification_criterias" validate:"required"`
	InheritancesString            string            `json:"-"`
	Inheritances                  JsonArray[string] `json:"inheritances" validate:"required"`
	PatientSexCode                string            `json:"patient_sex_code" validate:"required"`
	PubmedIDsString               string            `json:"-"`
	PubmedIDs                     JsonArray[string] `json:"pubmed_ids" validate:"required"`
} // @name VariantExpandedInterpretedCase

type VariantCasesFilters = struct {
	Classification  []Aggregation `json:"classification" validate:"required"`
	AnalysisCatalog []Aggregation `json:"analysis_catalog_code" validate:"required"`
	DiagnosisLab    []Aggregation `json:"diagnosis_lab_code" validate:"required"`
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
	Name:  "germline__snv__variant",
	Alias: "v",
}

var VariantInterpretedCasesFields = append(CasesFields, GermlineInterpretationClassificationField, GermlineInterpretationUpdatedOnField, ConditionIdField, ConditionNameField, ConditionTermField, AggregatedPhenotypeTermField)
var VariantUninterpretedCasesFields = append(CasesFields, ConditionTermField, AggregatedPhenotypeTermField, GermlineSNVZygosityField, GermlineSNVTransmissionModeField, GermlineSNVFilterField, GermlineSNVFilterIsPassField)
var VariantInterpretedCasesDefaultSort = []SortField{{Field: GermlineInterpretationUpdatedOnField, Order: "desc"}}

var VariantUninterpretedCasesDefaultFields = []Field{
	CaseIdField,
	FamilyRelationshipToProbandCodeField,
	SequencingExperimentIdField,
	SamplePatientIdField,
	SampleSubmitterSampleIdField,
	FamilyAffectedStatusCodeField,
	GermlineSNVZygosityField,
	GermlineSNVTransmissionModeField,
	GermlineSNVFilterField,
	GermlineSNVFilterIsPassField,
	CaseDiagnosisLabCodeField,
	CaseDiagnosisLabNameField,
	AnalysisCatalogCodeField,
	AnalysisCatalogNameField,
	CaseStatusCodeField,
	CaseCreatedOnField,
	CaseUpdatedOnField,
	GermlineSNVExomiserAcmgClassificationField,
	GermlineSNVExomiserAcmgEvidenceField,
	AggregatedPhenotypeUnparsedField,
	CasePrimaryConditionIdField,
	CasePrimaryConditionNameField,
}

var VariantInterpretedCasesQueryConfig = QueryConfig{
	AllFields:     VariantInterpretedCasesFields,
	DefaultFields: []Field{},
	DefaultSort:   VariantInterpretedCasesDefaultSort,
	IdField:       CaseIdField,
}

var VariantUninterpretedCasesQueryConfig = QueryConfig{
	AllFields:     VariantUninterpretedCasesFields,
	DefaultFields: VariantUninterpretedCasesDefaultFields,
	DefaultSort:   CasesDefaultSort,
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

var PfWgsField = Field{
	Name:          "pf_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var PcWgsField = Field{
	Name:          "pc_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var PnWgsField = Field{
	Name:          "pn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         VariantTable,
}
var PfWgsAffectedField = Field{
	Name:          "pf_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         VariantTable,
}
var PfWgsNotAffectedField = Field{
	Name:          "pf_wgs_not_affected",
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
