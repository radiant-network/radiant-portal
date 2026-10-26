package types

// CNVProfile holds the tracks of the CNV profile of a sequencing, on chromosomes 1-22, X and Y
// @Description CNVProfile holds the copy ratio and B-allele frequency points, the called CNVs, the regions of homozygosity and the cytobands of a sequencing
type CNVProfile struct {
	Chromosomes []CNVProfileChromosome `json:"chromosomes" validate:"required"`
	CopyRatio   []CNVProfileTrack      `json:"copy_ratio" validate:"required"`
	BAF         []CNVProfileTrack      `json:"baf" validate:"required"`
	Segments    []CNVProfileSegment    `json:"segments" validate:"required"`
	ROH         []CNVProfileROH        `json:"roh" validate:"required"`
	Cytobands   []Cytoband             `json:"cytobands" validate:"required"`
}

type CNVProfileChromosome struct {
	Name string `json:"name" validate:"required"`
	Size int    `json:"size" validate:"required"`
}

// CNVProfileTrack holds the points of one chromosome, as two parallel arrays
// @Description CNVProfileTrack holds the points of one chromosome as two parallel arrays: the 0-based positions and their values
type CNVProfileTrack struct {
	Chromosome string    `json:"chromosome" validate:"required"`
	Positions  []int     `json:"positions" validate:"required"`
	Values     []float64 `json:"values" validate:"required"`
}

type CNVProfileSegment struct {
	CnvID      string   `json:"cnv_id" validate:"required"`
	Chromosome string   `json:"chromosome" validate:"required"`
	Start      int      `json:"start" validate:"required"`
	End        int      `json:"end" validate:"required"`
	Type       string   `json:"type" validate:"required"`
	Length     int      `json:"length" validate:"required"`
	Quality    *float32 `json:"quality,omitempty"`
	Filter     string   `json:"filter,omitempty"`
	CN         *int     `json:"cn,omitempty"`
	SM         *float32 `json:"sm,omitempty"`
}

type CNVProfileROH struct {
	Chromosome string  `json:"chromosome" validate:"required"`
	Start      int     `json:"start" validate:"required"`
	End        int     `json:"end" validate:"required"`
	Score      float64 `json:"score" validate:"required"`
	NbHom      int     `json:"nb_hom" validate:"required"`
	NbHet      int     `json:"nb_het" validate:"required"`
}

type Cytoband struct {
	Chromosome string `json:"chromosome" validate:"required"`
	Cytoband   string `json:"cytoband" validate:"required"`
	Start      int    `json:"start" validate:"required"`
	End        int    `json:"end" validate:"required"`
	GieStain   string `json:"gie_stain,omitempty"`
}

// CNVProfileDocument is an igv file of a sequencing that a CNV profile track is read from.
type CNVProfileDocument struct {
	TaskID       int    `json:"task_id"`
	DocumentName string `json:"document_name"`
	FormatCode   string `json:"format_code"`
	URL          string `json:"url" gorm:"column:url"`
}

// GeneTrackGene is a gene of the gene track, with its exons merged over all its transcripts
// @Description GeneTrackGene is a gene of the gene track, with its exons merged over all its transcripts
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
}

// GeneTrackMaxSpan is the widest region the gene track lists, in bases.
const GeneTrackMaxSpan = 20_000_000

type GeneTrackExon struct {
	Start int `json:"start" validate:"required"`
	End   int `json:"end" validate:"required"`
}

var CytobandTable = Table{
	Name:  "cytoband",
	Alias: "cb",
}

var EnsemblExonByGeneTable = Table{
	Name:  "ensembl_exon_by_gene",
	Alias: "e",
}
