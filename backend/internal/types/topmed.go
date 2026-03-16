package types

var TopmedTable = Table{
	Name:  "topmed_bravo",
	Alias: "topmed",
}

var TopmedAfField = Field{
	Name:          "af",
	Alias:         "topmed_af",
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         TopmedTable,
}
