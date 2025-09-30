package types

// GermlineCNVOccurrence represents a germline CNV occurrence
// @Description GermlineCNVOccurrence represents a germline CNV occurrence
type GermlineCNVOccurrence struct {
	SeqID      int               `json:"seq_id"`
	Aliquot    string            `json:"aliquot,omitempty"`
	Chromosome string            `json:"chromosome"`
	Start      int               `json:"start"`
	End        int               `json:"end"`
	Type       string            `json:"type"`
	Length     int               `json:"length"`
	Name       string            `json:"name"`
	Quality    float32           `json:"quality,omitempty"`
	Calls      JsonArray[int]    `json:"calls,omitempty"`
	Cytoband   JsonArray[string] `json:"cytoband,omitempty"`
	Filter     string            `json:"filter,omitempty"`
	BC         int               `json:"bc,omitempty"`
	CN         int               `json:"cn,omitempty"`
	PE         JsonArray[int]    `json:"pe,omitempty"`
	SM         float32           `json:"sm,omitempty"`
	SVType     string            `json:"svtype,omitempty" gorm:"column:svtype"`
	SVLen      int               `json:"svlen,omitempty" gorm:"column:svlen"`
	RefLen     int               `json:"reflen,omitempty" gorm:"column:reflen"`
	CIEnd      JsonArray[int]    `json:"ciend,omitempty" gorm:"column:ciend"`
	CIPos      JsonArray[int]    `json:"cipos,omitempty" gorm:"column:cipos"`
	NbGenes    int               `json:"nb_genes,omitempty" gorm:"column:nb_genes"`
	NbSNV      int               `json:"nb_snv,omitempty" gorm:"column:nb_snv"`
	GnomadSC   int               `json:"gnomad_sc,omitempty" gorm:"column:gnomad_sc"`
	GnomadSN   int               `json:"gnomad_sn,omitempty" gorm:"column:gnomad_sn"`
	GnomadSF   float32           `json:"gnomad_sf,omitempty" gorm:"column:gnomad_sf"`
}

var GermlineCNVOccurrenceTable = Table{
	Name:  "germline__cnv__occurrence",
	Alias: "cnvo",
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
	Name:            "chromosome",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineCNVOccurrenceTable,
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
	Name:            "type",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	CanBeSorted:     true,
	Table:           GermlineCNVOccurrenceTable,
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
	IsArray:       true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVFilterField = Field{
	Name:            "filter",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           GermlineCNVOccurrenceTable,
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
	IsArray:       true,
	Type:          IntegerType,
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
	IsArray:       true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVCIPosField = Field{
	Name:          "cipos",
	CanBeSelected: true,
	CanBeFiltered: true,
	IsArray:       true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVNbGenesField = Field{
	Name:          "nb_genes",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVNbSNVField = Field{
	Name:          "nb_snv",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVGnomadSC = Field{
	Name:          "gnomad_sc",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVGnomadSN = Field{
	Name:          "gnomad_sn",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVGnomadSF = Field{
	Name:          "gnomad_sf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVCytobandField = Field{
	Name:            "cytoband",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	IsArray:         true,
	Table:           GermlineCNVOccurrenceTable,
}

var GermlineCNVSymbolField = Field{
	Name:          "symbol",
	CanBeFiltered: true,
	IsArray:       true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVOccurrencesFields = []Field{
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
	GermlineCNVNbGenesField,
	GermlineCNVNbSNVField,
	GermlineCNVGnomadSC,
	GermlineCNVGnomadSN,
	GermlineCNVGnomadSF,
	GermlineCNVCytobandField,
	GermlineCNVSymbolField,
	OmimGenePanelField,
	HpoGenePanelField,
	DddGenePanelField,
	CosmicGenePanelField,
	OmimInheritanceField,
	OrphanetGenePanelField,
}

var GermlineCNVOccurrencesDefaultFields = []Field{
	GermlineCNVSeqIdField,
	GermlineCNVChromosomeField,
	GermlineCNVStartField,
	GermlineCNVEndField,
	GermlineCNVTypeField,
	GermlineCNVLengthField,
	GermlineCNVNameField,
	GermlineCNVCNField,
	GermlineCNVNbGenesField,
	GermlineCNVNbSNVField,
	GermlineCNVGnomadSF,
	GermlineCNVSymbolField,
	GermlineCNVCytobandField,
}

var GermlineCNVOccurrencesDefaultSort = []SortField{
	{Field: GermlineCNVSeqIdField, Order: "asc"},
}

var GermlineCNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     GermlineCNVOccurrencesFields,
	DefaultFields: GermlineCNVOccurrencesDefaultFields,
	DefaultSort:   GermlineCNVOccurrencesDefaultSort,
	IdField:       GermlineCNVNameField,
}
