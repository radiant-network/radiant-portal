package types

type AutoCompleteTerm struct {
	HighLight Term `json:"highlight,omitempty"`
	Source    Term `json:"source,omitempty"`
}

type Term struct {
	ID   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
	Term string `json:"term,omitempty"`
}

var MondoTable = Table{
	Name:  "mondo_term",
	Alias: "mondo",
}

var HPOTable = Table{
	Name:  "hpo_term",
	Alias: "hpo",
}

var ConditionIdField = Field{
	Name:          "id",
	Alias:         "condition_id",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         MondoTable,
}

var ConditionNameField = Field{
	Name:          "name",
	Alias:         "condition_name",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         MondoTable,
}

var ConditionTermField = Field{
	Name:          "term",
	Alias:         "condition_term",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         MondoTable,
}

var PhenotypeIdField = Field{
	Name:          "id",
	Alias:         "phenotype_id",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         HPOTable,
}

var PhenotypeNameField = Field{
	Name:          "name",
	Alias:         "phenotype_name",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         HPOTable,
}

var PhenotypeTermField = Field{
	Name:          "term",
	Alias:         "phenotype_term",
	CanBeSelected: true,
	CanBeSorted:   true,
	CanBeFiltered: true,
	Table:         HPOTable,
}
