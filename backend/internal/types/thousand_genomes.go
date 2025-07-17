package types

var ThousandGenomesTable = Table{
	Name:  "1000_genomes",
	Alias: "1000_genomes",
}

var ThousandGenomesAfField = Field{
	Name:          "af",
	Alias:         "thousand_genome_af",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          NumericType,
	Table:         ThousandGenomesTable,
}
