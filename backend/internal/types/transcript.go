package types

type Transcript = struct {
	TranscriptId       string            `json:"transcript_id,omitempty"`
	Canonical          bool              `json:"canonical,omitempty"`
	ManeSelect         bool              `json:"mane_select,omitempty"`
	ManePlus           bool              `json:"mane_plus,omitempty"`  // TODO
	ExonRank           int               `json:"exon_rank,omitempty"`  //TODO
	ExonTotal          int               `json:"exon_total,omitempty"` //TODO
	CodingDnaChange    string            `json:"coding_dna_change,omitempty"`
	AaChange           string            `json:"aa_change,omitempty"`
	Consequence        JsonArray[string] `gorm:"type:json" json:"consequence,omitempty"`                  // TODO
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
	RefseqMrnaId       string            `json:"refseq_mrna_id,omitempty"` //TODO
} // @name Transcript
