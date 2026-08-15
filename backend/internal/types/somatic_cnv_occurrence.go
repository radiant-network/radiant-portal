package types

// SomaticCNVOccurrence represents a somatic CNV occurrence
// @Description SomaticCNVOccurrence represents a somatic CNV occurrence
type SomaticCNVOccurrence struct {
	// The tumor sequencing id. Somatic CNV spells this seq_id, not tumor_seq_id as somatic SNV
	// does, and has no normal_seq_id.
	SeqID      int               `json:"seq_id" validate:"required"`
	TaskID     int               `json:"task_id" validate:"required"`
	CnvID      string            `json:"cnv_id" validate:"required"`
	Aliquot    string            `json:"aliquot,omitempty"`
	Chromosome string            `json:"chromosome" validate:"required"`
	Start      int               `json:"start" validate:"required"`
	End        int               `json:"end" validate:"required"`
	Type       string            `json:"type" validate:"required" enums:"GAIN,LOSS,CNLOH,GAINLOH"`
	Length     int               `json:"length" validate:"required"`
	Name       string            `json:"name" validate:"required"`
	Quality    *float32          `json:"quality,omitempty"`
	Calls      JsonArray[int]    `json:"calls,omitempty"`
	Cytoband   JsonArray[string] `json:"cytoband,omitempty"`
	Symbol     JsonArray[string] `json:"symbol,omitempty"`
	Filter     string            `json:"filter,omitempty"`
	BC         *int              `json:"bc,omitempty"`
	PE         JsonArray[int]    `json:"pe,omitempty"`
	SM         *float32          `json:"sm,omitempty"`
	SVType     string            `json:"svtype,omitempty" gorm:"column:svtype"`
	SVLen      *int              `json:"svlen,omitempty" gorm:"column:svlen"`
	RefLen     *int              `json:"reflen,omitempty" gorm:"column:reflen"`
	CIEnd      JsonArray[int]    `json:"ciend,omitempty" gorm:"column:ciend"`
	CIPos      JsonArray[int]    `json:"cipos,omitempty" gorm:"column:cipos"`
	NbGenes    *int              `json:"nb_genes,omitempty" gorm:"column:nb_genes"`
	// Counts somatic SNVs, unlike germline CNV's identically named column, which counts germline
	// ones. Never pool or compare the two.
	NbSNV int `json:"nb_snv" gorm:"column:nb_snv"`
	// NULL by design on CNLOH rows: the gnomAD-SV join keys on type, and a copy-neutral segment
	// correctly matches nothing.
	GnomadSC *int     `json:"gnomad_sc,omitempty" gorm:"column:gnomad_sc"`
	GnomadSN *int     `json:"gnomad_sn,omitempty" gorm:"column:gnomad_sn"`
	GnomadSF *float32 `json:"gnomad_sf,omitempty" gorm:"column:gnomad_sf"`
	// DRAGEN allele-specific copy number (ASCN). 3.10.8 does not emit these at all and 4.2.4
	// declares but omits them per record, so expect them to be mostly NULL.
	CN     *int     `json:"cn,omitempty"`
	CNF    *float32 `json:"cnf,omitempty"`
	CNQ    *float32 `json:"cnq,omitempty"`
	MCN    *int     `json:"mcn,omitempty"`
	MCNF   *float32 `json:"mcnf,omitempty"`
	MCNQ   *float32 `json:"mcnq,omitempty"`
	MAF    *float32 `json:"maf,omitempty"`
	SD     *float32 `json:"sd,omitempty"`
	ASCNAS *int     `json:"ascn_as,omitempty" gorm:"column:ascn_as"`

	HasNote  bool               `json:"has_note" validate:"required"`
	FlagType OccurrenceFlagType `json:"flag_type,omitempty" enums:"flag,pin,star"`
}

var SomaticCNVOccurrenceTable = Table{
	Name:      "somatic__cnv__occurrence",
	Alias:     "scnvo",
	PerTenant: true,
}

var SomaticCNVSeqIdField = Field{
	Name:          "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVIdField = Field{
	Name:          "cnv_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVAliquotField = Field{
	Name:          "aliquot",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVChromosomeField = Field{
	Name:            "chromosome",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           SomaticCNVOccurrenceTable,
}

var SomaticCNVStartField = Field{
	Name:          "start",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVEndField = Field{
	Name:          "end",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVTypeField = Field{
	Name:            "type",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	CanBeSorted:     true,
	Table:           SomaticCNVOccurrenceTable,
}

var SomaticCNVLengthField = Field{
	Name:          "length",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVNameField = Field{
	Name:          "name",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVQualityField = Field{
	Name:          "quality",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVCallsField = Field{
	Name:          "calls",
	CanBeSelected: true,
	CanBeFiltered: true,
	IsArray:       true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVFilterField = Field{
	Name:            "filter",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	Table:           SomaticCNVOccurrenceTable,
}

var SomaticCNVBCField = Field{
	Name:          "bc",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVPEField = Field{
	Name:          "pe",
	CanBeSelected: true,
	CanBeFiltered: true,
	IsArray:       true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVSMField = Field{
	Name:          "sm",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVSVTypeField = Field{
	Name:          "svtype",
	CanBeSelected: true,
	CanBeFiltered: true,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVSVLenField = Field{
	Name:          "svlen",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVRefLenField = Field{
	Name:          "reflen",
	CanBeSelected: true,
	CanBeFiltered: true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVCIEndField = Field{
	Name:          "ciend",
	CanBeSelected: true,
	CanBeFiltered: true,
	IsArray:       true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVCIPosField = Field{
	Name:          "cipos",
	CanBeSelected: true,
	CanBeFiltered: true,
	IsArray:       true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVNbGenesField = Field{
	Name:          "nb_genes",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVNbSNVField = Field{
	Name:          "nb_snv",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVGnomadSC = Field{
	Name:          "gnomad_sc",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVGnomadSN = Field{
	Name:          "gnomad_sn",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVGnomadSF = Field{
	Name:          "gnomad_sf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVCytobandField = Field{
	Name:            "cytoband",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeAggregated: true,
	IsArray:         true,
	Table:           SomaticCNVOccurrenceTable,
}

var SomaticCNVSymbolField = Field{
	Name:          "symbol",
	CanBeFiltered: true,
	CanBeSelected: true,
	IsArray:       true,
	Table:         SomaticCNVOccurrenceTable,
}

// The ASCN block below is selectable, filterable and sortable but never aggregable: the values are
// continuous, and /statistics already reports their min/max. None are default fields — clients ask
// for them through additional_fields.

var SomaticCNVCNField = Field{
	Name:          "cn",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVCNFField = Field{
	Name:          "cnf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVCNQField = Field{
	Name:          "cnq",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVMCNField = Field{
	Name:          "mcn",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVMCNFField = Field{
	Name:          "mcnf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVMCNQField = Field{
	Name:          "mcnq",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVMAFField = Field{
	Name:          "maf",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVSDField = Field{
	Name:          "sd",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         SomaticCNVOccurrenceTable,
}

// DRAGEN's FORMAT/AS, stored as ascn_as because `as` is reserved in StarRocks.
var SomaticCNVASField = Field{
	Name:          "ascn_as",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         SomaticCNVOccurrenceTable,
}

var SomaticCNVOccurrencesFields = []Field{
	SomaticCNVSeqIdField,
	SomaticCNVTaskIdField,
	SomaticCNVIdField,
	SomaticCNVAliquotField,
	SomaticCNVChromosomeField,
	SomaticCNVStartField,
	SomaticCNVEndField,
	SomaticCNVTypeField,
	SomaticCNVLengthField,
	SomaticCNVNameField,
	SomaticCNVQualityField,
	SomaticCNVCallsField,
	SomaticCNVFilterField,
	SomaticCNVBCField,
	SomaticCNVPEField,
	SomaticCNVSMField,
	SomaticCNVSVTypeField,
	SomaticCNVSVLenField,
	SomaticCNVRefLenField,
	SomaticCNVCIEndField,
	SomaticCNVCIPosField,
	SomaticCNVNbGenesField,
	SomaticCNVNbSNVField,
	SomaticCNVGnomadSC,
	SomaticCNVGnomadSN,
	SomaticCNVGnomadSF,
	SomaticCNVCytobandField,
	SomaticCNVSymbolField,
	SomaticCNVCNField,
	SomaticCNVCNFField,
	SomaticCNVCNQField,
	SomaticCNVMCNField,
	SomaticCNVMCNFField,
	SomaticCNVMCNQField,
	SomaticCNVMAFField,
	SomaticCNVSDField,
	SomaticCNVASField,
	OmimGenePanelField,
	HpoGenePanelField,
	DddGenePanelField,
	CosmicGenePanelField,
	OmimInheritanceField,
	OrphanetGenePanelField,
}

var SomaticCNVOccurrencesDefaultFields = []Field{
	SomaticCNVSeqIdField,
	SomaticCNVTaskIdField,
	SomaticCNVIdField,
	SomaticCNVChromosomeField,
	SomaticCNVStartField,
	SomaticCNVEndField,
	SomaticCNVTypeField,
	SomaticCNVLengthField,
	SomaticCNVNameField,
	SomaticCNVNbGenesField,
	SomaticCNVNbSNVField,
	SomaticCNVGnomadSF,
	SomaticCNVSymbolField,
	SomaticCNVCytobandField,
}

var SomaticCNVOccurrencesDefaultSort = []SortField{
	{Field: SomaticCNVSeqIdField, Order: "asc"},
}

var SomaticCNVOccurrencesQueryConfig = QueryConfig{
	AllFields:     SomaticCNVOccurrencesFields,
	DefaultFields: SomaticCNVOccurrencesDefaultFields,
	DefaultSort:   SomaticCNVOccurrencesDefaultSort,
	IdField:       SomaticCNVNameField,
}
