package types

type Ancestry struct {
	ValueSet
}

var AncestryTable = Table{
	Name:           "ancestry",
	FederationName: "radiant_jdbc.public.ancestry",
	Alias:          "anc",
}
