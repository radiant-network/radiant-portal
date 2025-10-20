package types

// CNVGeneOverlap represents a gene overlap with a CNV
// @Description CNVGeneOverlap represents a gene overlap with a CNV
type CNVGeneOverlap struct {
	Symbol                 string            `json:"symbol" validate:"required"`
	GeneId                 string            `json:"gene_id" validate:"required"`
	GeneLength             int               `json:"gene_length" validate:"required"`
	NbOverlapBases         int               `json:"nb_overlap_bases" validate:"required"`
	Cytoband               JsonArray[string] `json:"cytoband" validate:"required"`
	NbExons                int               `json:"nb_exons" validate:"required"`
	OverlappingGenePercent float32           `json:"overlapping_gene_percent" validate:"required"`
	OverlappingCNVPercent  float32           `json:"overlapping_cnv_percent" validate:"required"`
	OverlapType            string            `json:"overlap_type" enum:"full_gene,full_cnv,partial" validate:"required"`
}
