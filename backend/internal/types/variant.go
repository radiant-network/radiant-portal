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
var PcField = Field{
	Name:          "pc",
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
	Name:            "clinvar_interpretation",
	Alias:           "clinvar",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     false,
	CanBeAggregated: true,
	Type:            ArrayType,
	Table:           VariantTable,
}

var RsNumberField = Field{
	Name:          "rsnumber",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var AaChangeField = Field{
	Name:          "aa_change",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}

var ConsequenceField = Field{
	Name:            "consequence",
	Alias:           "picked_consequences",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     false,
	CanBeAggregated: true,
	Type:            ArrayType,
	Table:           VariantTable,
}
var VepImpactField = Field{
	Name:          "vep_impact",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var SymbolField = Field{
	Name:          "symbol",
	CanBeSelected: true,
	CanBeFiltered: false,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var ManeSelectField = Field{
	Name:          "mane_select",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
var OmimInheritanceCodeField = Field{
	Name:          "omim_inheritance_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          ArrayType,
	Table:         VariantTable,
}
var GnomadV3AfField = Field{
	Name:          "gnomad_v3_af",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         VariantTable,
}
