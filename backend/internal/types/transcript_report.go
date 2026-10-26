package types

// TranscriptReport is the tenant-independent data behind one worksheet of the transcript
// report (one variant occurrence of a case). Report templates select from it; they never
// extend it.
// @Description Report data of one germline SNV occurrence: case context, variant, occurrence, genes and one entry per transcript row.
// @Name TranscriptReport
type TranscriptReport struct {
	Case        ReportCase         `json:"case" validate:"required"`
	Variant     ReportVariant      `json:"variant" validate:"required"`
	Occurrence  ReportOccurrence   `json:"occurrence" validate:"required"`
	Genes       []ReportGene       `json:"genes" validate:"required"`
	Transcripts []ReportTranscript `json:"transcripts" validate:"required"`
} // @name TranscriptReport

// @Description Case context of the report: identifiers printed in the file name and the sheet.
// @Name ReportCase
type ReportCase struct {
	CaseID             int    `json:"case_id" validate:"required"`
	SeqID              int    `json:"seq_id" validate:"required"`
	TaskID             int    `json:"task_id" validate:"required"`
	SubmitterPatientID string `json:"submitter_patient_id,omitempty"`
	SubmitterSampleID  string `json:"submitter_sample_id,omitempty"`
	IsProband          bool   `json:"is_proband" validate:"required"`
	GenomeBuild        string `json:"genome_build,omitempty"`
} // @name ReportCase

// @Description Variant level data of the report.
// @Name ReportVariant
type ReportVariant struct {
	LocusID               string        `json:"locus_id" validate:"required"`
	Hgvsg                 string        `json:"hgvsg,omitempty"`
	Rsnumber              string        `json:"rsnumber,omitempty"`
	Chromosome            string        `json:"chromosome,omitempty"`
	Start                 int64         `json:"start,omitempty"`
	Reference             string        `json:"reference,omitempty"`
	Alternate             string        `json:"alternate,omitempty"`
	Symbol                string        `json:"symbol,omitempty"`
	ClinvarID             string        `json:"clinvar_id,omitempty"`
	ClinvarInterpretation []string      `json:"clinvar_interpretation,omitempty"`
	Gnomad                *ReportGnomad `json:"gnomad,omitempty"`
	Cosmic                *ReportCosmic `json:"cosmic,omitempty"`
} // @name ReportVariant

// @Description COSMIC Cancer Mutation Census entry of the variant; absent when COSMIC reports no sample for it.
// @Name ReportCosmic
type ReportCosmic struct {
	CosmicID      string `json:"cosmic_id" validate:"required"`
	SampleMutated int    `json:"sample_mutated" validate:"required"`
	Tier          string `json:"tier,omitempty"`
} // @name ReportCosmic

// @Description gnomAD joint frequency of the variant; absent when the variant is not in gnomAD.
// @Name ReportGnomad
type ReportGnomad struct {
	Af  float64 `json:"af" validate:"required"`
	Ac  int     `json:"ac" validate:"required"`
	An  int     `json:"an" validate:"required"`
	Hom int     `json:"hom" validate:"required"`
} // @name ReportGnomad

// @Description Occurrence level data of the report (germline call of the sequencing).
// @Name ReportOccurrence
type ReportOccurrence struct {
	Zygosity         string  `json:"zygosity,omitempty"`
	ParentalOrigin   string  `json:"parental_origin,omitempty"`
	FatherZygosity   string  `json:"father_zygosity,omitempty"`
	MotherZygosity   string  `json:"mother_zygosity,omitempty"`
	TransmissionMode string  `json:"transmission_mode,omitempty"`
	AdRatio          float32 `json:"ad_ratio,omitempty"`
	AdAlt            int     `json:"ad_alt,omitempty"`
	AdTotal          int     `json:"ad_total,omitempty"`
	// Somatic call: tumor reads, and the normal sequencing when the analysis was tumor-normal (0 when tumor-only).
	TumorAdRatio float32 `json:"tumor_ad_ratio,omitempty"`
	TumorAdAlt   int     `json:"tumor_ad_alt,omitempty"`
	TumorAdTotal int     `json:"tumor_ad_total,omitempty"`
	NormalSeqID  int     `json:"normal_seq_id,omitempty"`
} // @name ReportOccurrence

// @Description A gene of the variant with its OMIM phenotypes.
// @Name ReportGene
type ReportGene struct {
	Symbol string       `json:"symbol" validate:"required"`
	Omim   []ReportOmim `json:"omim" validate:"required"`
} // @name ReportGene

// @Description An OMIM phenotype of a gene.
// @Name ReportOmim
type ReportOmim struct {
	PhenotypeID     string   `json:"phenotype_id" validate:"required"`
	Name            string   `json:"name" validate:"required"`
	InheritanceCode []string `json:"inheritance_code,omitempty"`
} // @name ReportOmim

// @Description One row of the report: an Ensembl transcript with its RefSeq pair, or a RefSeq transcript of a gene that has no Ensembl transcript.
// @Name ReportTranscript
type ReportTranscript struct {
	TranscriptID          string                        `json:"transcript_id" validate:"required"`
	Source                string                        `json:"source,omitempty"`
	Version               string                        `json:"version,omitempty"`
	Symbol                string                        `json:"symbol,omitempty"`
	IsManeSelect          bool                          `json:"is_mane_select" validate:"required"`
	IsManePlus            bool                          `json:"is_mane_plus" validate:"required"`
	IsCanonical           bool                          `json:"is_canonical" validate:"required"`
	RefseqIDs             []string                      `json:"refseq_ids,omitempty"`
	DnaChange             string                        `json:"dna_change,omitempty"`
	AaChange              string                        `json:"aa_change,omitempty"`
	ExonRank              string                        `json:"exon_rank,omitempty"`
	ExonTotal             string                        `json:"exon_total,omitempty"`
	RevelScore            *float32                      `json:"revel_score,omitempty"`
	CaddPhred             *float32                      `json:"cadd_phred,omitempty"`
	Consequences          []string                      `json:"consequences,omitempty"`
	VepImpact             string                        `json:"vep_impact,omitempty"`
	Interpretation        *ReportGermlineInterpretation `json:"interpretation,omitempty"`
	SomaticInterpretation *ReportSomaticInterpretation  `json:"somatic_interpretation,omitempty"`
} // @name ReportTranscript

// @Description The germline interpretation of the case on this transcript. Citations are empty when PubMed could not resolve the id.
// @Name ReportGermlineInterpretation
type ReportGermlineInterpretation struct {
	Classification          string                 `json:"classification,omitempty"`
	ClassificationCriterias []string               `json:"classification_criterias,omitempty"`
	Condition               string                 `json:"condition,omitempty"`
	TransmissionModes       []string               `json:"transmission_modes,omitempty"`
	Pubmed                  []InterpretationPubmed `json:"pubmed,omitempty"`
} // @name ReportGermlineInterpretation

// @Description The somatic interpretation of the case on this transcript. Oncogenicity is a LOINC code, clinical utility an AMP tier code.
// @Name ReportSomaticInterpretation
type ReportSomaticInterpretation struct {
	TumoralType                         string                 `json:"tumoral_type,omitempty"`
	Oncogenicity                        string                 `json:"oncogenicity,omitempty"`
	OncogenicityClassificationCriterias []string               `json:"oncogenicity_classification_criterias,omitempty"`
	ClinicalUtility                     string                 `json:"clinical_utility,omitempty"`
	Pubmed                              []InterpretationPubmed `json:"pubmed,omitempty"`
} // @name ReportSomaticInterpretation

// Row types of the report repositories. Not API types.

type ReportContext struct {
	Part               int
	SubmitterPatientID string
	SubmitterSampleID  string
	IsProband          bool
	GenomeBuild        string
}

type ReportOccurrenceRow struct {
	LocusID               int64
	Hgvsg                 string
	Rsnumber              string
	Chromosome            string
	Start                 int64
	Reference             string
	Alternate             string
	Symbol                string
	ClinvarName           string
	ClinvarInterpretation JsonArray[string] `gorm:"type:json"`
	Zygosity              string
	ParentalOrigin        string
	FatherZygosity        string
	MotherZygosity        string
	TransmissionMode      string
	AdRatio               float32
	AdAlt                 int
	AdTotal               int
	GnomadAf              *float64
	GnomadAc              *int
	GnomadAn              *int
	GnomadHom             *int
	// Somatic occurrence only.
	NormalSeqID         *int
	TumorAdRatio        float32
	TumorAdAlt          int
	TumorAdTotal        int
	CosmicMutationURL   string
	CosmicSampleMutated *int
	CosmicTier          string
}

type ReportConsequenceRow struct {
	LocusID              int64
	Symbol               string
	TranscriptID         string
	TranscriptVersion    string
	Source               string
	IsManeSelect         bool
	IsManePlus           bool
	IsCanonical          bool
	ManeSelect           string
	ManePairTranscriptID string
	ExonRank             string
	ExonTotal            string
	DnaChange            string
	AaChange             string
	RevelScore           *float32
	CaddPhred            *float32
	Consequences         JsonArray[string] `gorm:"type:json"`
	VepImpact            string
}

type ReportOmimRow struct {
	Symbol          string
	OmimPhenotypeID string
	Panel           string
	InheritanceCode JsonArray[string] `gorm:"type:json"`
}
