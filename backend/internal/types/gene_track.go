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

// IsChromosome tells whether name is a chromosome of the human genome: 1-22, X or Y, without the
// chr prefix.
func IsChromosome(name string) bool {
	switch name {
	case "X", "Y":
		return true
	}
	n := 0
	for _, r := range name {
		if r < '0' || r > '9' {
			return false
		}
		n = n*10 + int(r-'0')
	}
	return name != "" && name[0] != '0' && n >= 1 && n <= 22
}
