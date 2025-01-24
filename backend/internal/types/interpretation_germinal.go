package types

type InterpretationGerminal struct {
	ID               	int               	`json:"id,omitempty"`
	SequencingID        string         		`json:"sequencing_id,omitempty"`
	Locus               string             	`json:"locus,omitempty"`
	TranscriptID     	string             	`json:"transcript_id,omitempty"`
	
} // @name InterpretationGerminal

var InterpretationGerminalTable = Table{
	Name:  "interpretation_germinal",
	Alias: "ig",
}

var SequencingIdField = Field{
	Name:            "sequencing_id",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     false,
	CanBeAggregated: true,
	//Type:            ArrayType,
	Table:           InterpretationGerminalTable,
}
