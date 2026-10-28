package types

// CNVGeneOverlap represents a gene overlap with a CNV
// @Description CNVGeneOverlap represents a gene overlap with a CNV
type CNVGeneOverlap struct {
	Symbol         string            `json:"symbol" validate:"required"`
	GeneId         string            `json:"gene_id" validate:"required"`
	GeneLength     int               `json:"gene_length" validate:"required"`
	NbOverlapBases int               `json:"nb_overlap_bases" validate:"required"`
	Cytoband       JsonArray[string] `json:"cytoband" validate:"required"`
	// NbExons counts the exons the CNV hits, on the transcript of the gene with the most exons
	NbExons                int               `json:"nb_exons" validate:"required" gorm:"-"`
	OverlappingGenePercent float32           `json:"overlapping_gene_percent" validate:"required"`
	OverlappingCNVPercent  float32           `json:"overlapping_cnv_percent" validate:"required"`
	OverlapType            string            `json:"overlap_type" enum:"full_gene,full_cnv,partial" validate:"required"`
	TenantGenePanels       JsonArray[string] `json:"tenant_gene_panels" validate:"required"`
	Biotype                string            `json:"biotype,omitempty"`
	Strand                 string            `json:"strand,omitempty"`
	// OmimInheritanceCode lists the OMIM inheritance modes of the phenotypes of the gene
	OmimInheritanceCode []string `json:"omim_inheritance_code,omitempty" gorm:"-"`
	// GnomadPli is the highest gnomAD pLI over the Ensembl transcripts of the gene
	GnomadPli *float32 `json:"gnomad_pli,omitempty" gorm:"-"`
	// GnomadLoeuf is the lowest gnomAD LOEUF over the Ensembl transcripts of the gene
	GnomadLoeuf *float32 `json:"gnomad_loeuf,omitempty" gorm:"-"`
}
