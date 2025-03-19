package types

type AutoCompleteTerm struct {
	HighLight Term `json:"highlight,omitempty"`
	Source    Term `json:"_source,omitempty"`
}

type AutoCompleteTermBody struct {
	Input string `json:"input,omitempty"`
}

type Term struct {
	ID   string `json:"id,omitempty"`
	Name string `json:"name,omitempty"`
}

type TermWithHighLight struct {
	Term
	HighlightedName string
}

var MondoTable = Table{
	Name:  "mondo_terms",
	Alias: "mondo",
}

var HPOTable = Table{
	Name:  "hpo_terms",
	Alias: "hpo",
}
