package types

type Transcript = struct {
	TranscriptId       string            `json:"transcript_id,omitempty"`
	IsCanonical        bool              `json:"is_canonical"`
	IsManeSelect       bool              `json:"is_mane_select"`
	IsManePlus         bool              `json:"is_mane_plus"`
	ExonRank           int               `json:"exon_rank,omitempty"`
	ExonTotal          int               `json:"exon_total,omitempty"`
	DnaChange          string            `json:"dna_change,omitempty"`
	AaChange           string            `json:"aa_change,omitempty"`
	Consequences       JsonArray[string] `gorm:"type:json" json:"consequences,omitempty"`
	VepImpact          VepImpact         `json:"vep_impact,omitempty" enums:"MODIFIER,LOW,MODERATE,HIGH"` // TODO
	SiftPred           string            `json:"sift_pred,omitempty"`
	SiftScore          float32           `json:"sift_score,omitempty"`
	FathmmPred         string            `json:"fathmm_pred,omitempty"`
	FathmmScore        float32           `json:"fathmm_score,omitempty"`
	CaddScore          float32           `json:"cadd_score,omitempty"`
	CaddPhred          float32           `json:"cadd_phred,omitempty"`
	DannScore          float32           `json:"dann_score,omitempty"`
	LrtPred            string            `json:"lrt_pred,omitempty"`
	LrtScore           float32           `json:"lrt_score,omitempty"`
	RevelScore         float32           `json:"revel_score,omitempty"`
	Polyphen2HvarPred  string            `json:"polyphen2_hvar_pred,omitempty"`
	Polyphen2HvarScore float32           `json:"polyphen2_hvar_score,omitempty"`
	PhyloP17wayPrimate float32           `json:"phyloP17way_primate,omitempty"`
} // @name Transcript
