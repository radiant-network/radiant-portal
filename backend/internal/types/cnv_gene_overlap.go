package types

// CNVGeneOverlap represents a gene overlap with a CNV
// @Description CNVGeneOverlap represents a gene overlap with a CNV
type CNVGeneOverlap struct {
	Symbol                 string            `json:"symbol"`
	GeneId                 string            `json:"gene_id"`
	GeneLength             int               `json:"gene_length"`
	NbOverlapBases         int               `json:"nb_overlap_bases"`
	Cytoband               JsonArray[string] `json:"cytoband,omitempty"`
	NbExons                int               `json:"nb_exons"`
	OverlappingGenePercent float32           `json:"overlapping_gene_percent"`
	OverlappingCNVPercent  float32           `json:"overlapping_cnv_percent"`
	OverlapType            string            `json:"overlap_type" enum:"full_gene,full_cnv,partial"`
}
