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

type AutoCompleteGene = AutoCompleteTerm

var EnsemblGeneTable = Table{
	Name:  "ensembl_gene",
	Alias: "g",
}
