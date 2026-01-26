package types

type Consanguinity struct {
	ValueSet
}

var ConsanguinityTable = Table{
	Name:           "consanguinity",
	FederationName: "radiant_jdbc.public.consanguinity",
	Alias:          "c",
}
