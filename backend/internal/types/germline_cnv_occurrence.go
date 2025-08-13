package types

// GermlineCNVOccurrence represents a germline CNV occurrence
// @Description GermlineCNVOccurrence represents a germline CNV occurrence
type GermlineCNVOccurrence struct {
	Id         string         `json:"id"`
	SeqID      int            `json:"seq_id"`
	Aliquot    string         `json:"aliquot"`
	Chromosome string         `json:"chromosome"`
	Start      int            `json:"start"`
	End        int            `json:"end"`
	Type       string         `json:"type"`
	Length     int            `json:"length"`
	Name       string         `json:"name"`
	Quality    float32        `json:"quality,omitempty"`
	Calls      JsonArray[int] `json:"calls,omitempty"`
	Filter     string         `json:"filter,omitempty"`
	BC         int            `json:"bc,omitempty"`
	CN         int            `json:"cn,omitempty"`
	PE         JsonArray[int] `json:"pe,omitempty"`
	SM         float32        `json:"sm,omitempty"`
	SVType     string         `json:"svtype,omitempty" gorm:"column:svtype"`
	SVLen      int            `json:"svlen,omitempty" gorm:"column:svlen"`
	RefLen     int            `json:"reflen,omitempty" gorm:"column:refle"`
	CIEnd      JsonArray[int] `json:"ciend,omitempty" gorm:"column:ciend"`
	CIPos      JsonArray[int] `json:"cipos,omitempty" gorm:"column:cipos"`
}

var GermlineCNVOccurrenceTable = Table{
	Name:  "germline__cnv__occurrence",
	Alias: "cnvo",
}

var GermlineCNVIdField = Field{
	Name:          "id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVSeqIdField = Field{
	Name:          "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVAliquotField = Field{
	Name:          "aliquot",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVChromosomeField = Field{
	Name:          "chromosome",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVStartField = Field{
	Name:          "start",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVEndField = Field{
	Name:          "end",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVTypeField = Field{
	Name:          "type",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVLengthField = Field{
	Name:          "length",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVNameField = Field{
	Name:          "name",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVQualityField = Field{
	Name:          "quality",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVCallsField = Field{
	Name:          "calls",
	CanBeSelected: true,
	CanBeFiltered: true,
	Type:          ArrayType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVFilterField = Field{
	Name:          "filter",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVBCField = Field{
	Name:          "bc",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVCNField = Field{
	Name:          "cn",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVPEField = Field{
	Name:          "pe",
	CanBeSelected: true,
	CanBeFiltered: true,
	Type:          ArrayType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVSMField = Field{
	Name:          "sm",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVSVTypeField = Field{
	Name:          "svtype",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVSVLenField = Field{
	Name:          "svlen",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVRefLenField = Field{
	Name:          "reflen",
	CanBeSelected: true,
	CanBeFiltered: true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVCIEndField = Field{
	Name:          "ciend",
	CanBeSelected: true,
	CanBeFiltered: true,
	Type:          ArrayType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVCIPosField = Field{
	Name:          "cipos",
	CanBeSelected: true,
	CanBeFiltered: true,
	Type:          ArrayType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVOccurrencesFields = []Field{
	GermlineCNVIdField,
	GermlineCNVSeqIdField,
	GermlineCNVAliquotField,
	GermlineCNVChromosomeField,
	GermlineCNVStartField,
	GermlineCNVEndField,
	GermlineCNVTypeField,
	GermlineCNVLengthField,
	GermlineCNVNameField,
	GermlineCNVQualityField,
	GermlineCNVCallsField,
	GermlineCNVFilterField,
	GermlineCNVBCField,
	GermlineCNVCNField,
	GermlineCNVPEField,
	GermlineCNVSMField,
	GermlineCNVSVTypeField,
	GermlineCNVSVLenField,
	GermlineCNVRefLenField,
	GermlineCNVCIEndField,
	GermlineCNVCIPosField,
}

var GermlineCNVOccurrencesDefaultFields = []Field{
	GermlineCNVIdField,
	GermlineCNVSeqIdField,
	GermlineCNVAliquotField,
	GermlineCNVChromosomeField,
	GermlineCNVStartField,
	GermlineCNVEndField,
	GermlineCNVTypeField,
	GermlineCNVLengthField,
	GermlineCNVNameField,
	GermlineCNVQualityField,
	GermlineCNVCallsField,
	GermlineCNVFilterField,
	GermlineCNVBCField,
	GermlineCNVCNField,
	GermlineCNVPEField,
	GermlineCNVSMField,
	GermlineCNVSVTypeField,
	GermlineCNVSVLenField,
	GermlineCNVRefLenField,
	GermlineCNVCIEndField,
	GermlineCNVCIPosField,
}

var GermlineCNVOccurrencesDefaultSort = []SortField{
	{Field: GermlineCNVSeqIdField, Order: "asc"},
}

var GermlineCNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     GermlineCNVOccurrencesFields,
	DefaultFields: GermlineCNVOccurrencesDefaultFields,
	DefaultSort:   GermlineCNVOccurrencesDefaultSort,
	IdField:       GermlineCNVIdField,
}
