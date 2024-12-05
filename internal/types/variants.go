package types

var VariantTable = Table{
	Name:  "variants",
	Alias: "v",
}

var PfField = Field{
	Name:          "pf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var AfField = Field{
	Name:          "af",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var VariantClassField = Field{
	Name:            "variant_class",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           VariantTable,
}
var HgvsgField = Field{
	Name:          "hgvsg",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var ClinvarField = Field{
	Name:          "clinvar_interpretation",
	Alias:         "clinvar",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   false,
	Type:          ArrayType,
	Table:         VariantTable,
}
