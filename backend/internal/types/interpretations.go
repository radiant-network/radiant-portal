package types

import (
	"time"
)

// project specific, optional fields than can be used for search queries
type InterpretationMetadata struct {
	AnalysisId  string `json:"analysis_id,omitempty"`
	PatientId   string `json:"patient_id,omitempty"`
	VariantHash string `json:"variant_hash,omitempty"`
}

type InterpretationCommon struct {
	ID             string                 `json:"id,omitempty"`
	CaseId         string                 `json:"case_id,omitempty"`
	SequencingId   string                 `json:"sequencing_id,omitempty"`
	LocusId        string                 `json:"locus_id,omitempty"`
	TranscriptId   string                 `json:"transcript_id,omitempty"`
	Interpretation string                 `json:"interpretation,omitempty"`
	Pubmed         []InterpretationPubmed `json:"pubmed,omitempty"`
	Metadata       InterpretationMetadata `json:"metadata,omitempty"`
	CreatedBy      string                 `json:"created_by,omitempty"`
	CreatedByName  string                 `json:"created_by_name,omitempty"`
	CreatedAt      time.Time              `json:"created_at,omitempty"`
	UpdatedBy      string                 `json:"updated_by,omitempty"`
	UpdatedByName  string                 `json:"updated_by_name,omitempty"`
	UpdatedAt      time.Time              `json:"updated_at,omitempty"`
}

type InterpretationGermline struct {
	InterpretationCommon
	Condition               string   `json:"condition,omitempty"`
	Classification          string   `json:"classification,omitempty"`
	ClassificationCriterias []string `json:"classification_criterias,omitempty"`
	TransmissionModes       []string `json:"transmission_modes,omitempty"`
} // @name InterpretationGermline

type InterpretationSomatic struct {
	InterpretationCommon
	TumoralType                         string   `json:"tumoral_type,omitempty"`
	Oncogenicity                        string   `json:"oncogenicity,omitempty"`
	OncogenicityClassificationCriterias []string `json:"oncogenicity_classification_criterias,omitempty"`
	ClinicalUtility                     string   `json:"clinical_utility,omitempty"`
} // @name InterpretationSomatic

type InterpretationPubmed struct {
	CitationID string `json:"citation_id,omitempty"`
	Citation   string `json:"citation,omitempty"`
} // @name InterpretationPubmed

var InterpretationGermlineTable = Table{
	Name:  "interpretation_germline",
	Alias: "ig",
}

var InterpretationSomaticTable = Table{
	Name: "interpretation_somatic",
}

type InterpretationCommonDAO struct {
	ID             string `gorm:"primary_key; unique; type:uuid; default:gen_random_uuid()"`
	SequencingId   string
	LocusId        string
	TranscriptId   string
	Interpretation string
	Pubmed         string
	Metadata       []byte
	CreatedBy      string
	CreatedByName  string
	CreatedAt      time.Time
	UpdatedBy      string
	UpdatedByName  string
	UpdatedAt      time.Time
}

type InterpretationGermlineDAO struct {
	InterpretationCommonDAO
	Condition               string
	Classification          string
	ClassificationCriterias string
	TransmissionModes       string
}

type InterpretationSomaticDAO struct {
	InterpretationCommonDAO
	TumoralType                         string
	Oncogenicity                        string
	OncogenicityClassificationCriterias string
	ClinicalUtility                     string
}

var GermlineInterpretationClassificationField = Field{
	Name:          "classification",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         InterpretationGermlineTable,
}

var GermlineInterpretationUpdatedOnField = Field{
	Name:          "updated_at",
	Alias:         "interpretation_updated_on",
	CanBeSelected: true,
	CanBeSorted:   true,
	Table:         InterpretationGermlineTable,
}

type ClassificationCounts struct {
	Classification      string `json:"classification" validate:"required"`
	ClassificationCount int    `json:"classification_count" validate:"required"`
}
