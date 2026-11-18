package types

type Gene = struct {
	GeneID          string            `json:"gene_id,omitempty"`
	Chromosome      string            `json:"chromosome,omitempty"`
	Start           int64             `json:"start,omitempty"`
	End             int64             `json:"end,omitempty"`
	Version         int               `json:"version,omitempty"`
	Type            string            `json:"type,omitempty"`
	Strand          string            `json:"strand,omitempty"`
	Phase           int               `json:"phase,omitempty"`
	Name            string            `json:"name,omitempty"`
	Alias           JsonArray[string] `json:"alias,omitempty"`
	Biotype         string            `json:"biotype,omitempty"`
	Ccdsid          string            `json:"ccdsid,omitempty"`
	Constitutive    string            `json:"constitutive,omitempty"`
	Description     string            `json:"description,omitempty"`
	EnsemblEndPhase string            `json:"ensembl_end_phase,omitempty"`
	EnsemblPhase    string            `json:"ensembl_phase,omitempty"`
	ExternalName    string            `json:"external_name,omitempty"`
	LogicName       string            `json:"logic_name,omitempty"`
	Lenght          int64             `json:"lenght,omitempty"`
}

type GeneSearchBody struct {
	Inputs []string `json:"inputs"`
}

type GeneResult = struct {
	GeneID string `json:"ensembl_gene_id,omitempty"`
	Name   string `json:"symbol,omitempty"`
}

type AutoCompleteGene = AutoCompleteTerm

var EnsemblGeneTable = Table{
	Name:  "ensembl_gene",
	Alias: "g",
}

// EnsemblExonByGeneTable lists the Ensembl exons of each gene, with the transcripts each exon belongs to.
var EnsemblExonByGeneTable = Table{
	Name:  "ensembl_exon_by_gene",
	Alias: "e",
}

// GeneReferenceTranscriptTable gives the reference transcript of a gene (MANE Select when it has one).
var GeneReferenceTranscriptTable = Table{
	Name:  "gene_reference_transcript",
	Alias: "rt",
}

// GnomadConstraintTable holds the gnomAD loss-of-function constraint of each Ensembl transcript.
var GnomadConstraintTable = Table{
	Name:  "gnomad_constraint",
	Alias: "gc",
}
