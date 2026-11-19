package types

// GeneTrackGene is a gene of the gene track, with the exons of its reference transcript
// @Description GeneTrackGene is a gene of the gene track, with the exons of its reference transcript (none when it has no reference transcript)
type GeneTrackGene struct {
	GeneID      string          `json:"gene_id" validate:"required"`
	Symbol      string          `json:"symbol" validate:"required"`
	Chromosome  string          `json:"chromosome" validate:"required"`
	Start       int             `json:"start" validate:"required"`
	End         int             `json:"end" validate:"required"`
	Strand      string          `json:"strand,omitempty"`
	Biotype     string          `json:"biotype,omitempty"`
	Description string          `json:"description,omitempty"`
	Exons       []GeneTrackExon `json:"exons" validate:"required" gorm:"-"`
	// OmimInheritanceCode lists the OMIM inheritance modes of the phenotypes of the gene
	OmimInheritanceCode []string `json:"omim_inheritance_code,omitempty" gorm:"-"`
	// OmimConditions lists the OMIM phenotypes of the gene, with their inheritance modes
	OmimConditions []OmimGenePanel `json:"omim_conditions,omitempty" gorm:"-"`
	// GnomadPli is the gnomAD pLI of the reference transcript of the gene
	GnomadPli *float32 `json:"gnomad_pli,omitempty" gorm:"-"`
	// GnomadLoeuf is the gnomAD LOEUF of the reference transcript of the gene
	GnomadLoeuf *float32 `json:"gnomad_loeuf,omitempty" gorm:"-"`
}

type GeneTrackExon struct {
	Start int `json:"start" validate:"required"`
	End   int `json:"end" validate:"required"`
}

// GeneTrackMaxSpan is the widest region the gene track lists, in bases.
const GeneTrackMaxSpan = 20_000_000
