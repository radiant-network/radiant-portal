package types

var ThousandGenomesTable = Table{
	Name:  "1000_genomes",
	Alias: "1000_genomes",
}

var ThousandGenomesAfField = Field{
	Name:          "af",
	Alias:         "thousand_genome_af",
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         ThousandGenomesTable,
}
