package types

// GermlineCNVOccurrence represents a germline CNV occurrence
// @Description GermlineCNVOccurrence represents a germline CNV occurrence
type GermlineCNVOccurrence struct {
	SeqID                    int                `json:"seq_id" validate:"required"`
	TaskID                   int                `json:"task_id" validate:"required"`
	CnvID                    string             `json:"cnv_id" validate:"required"`
	Aliquot                  string             `json:"aliquot,omitempty"`
	Chromosome               string             `json:"chromosome" validate:"required"`
	Start                    int                `json:"start" validate:"required"`
	End                      int                `json:"end" validate:"required"`
	Type                     string             `json:"type" validate:"required"`
	Length                   int                `json:"length" validate:"required"`
	Name                     string             `json:"name" validate:"required"`
	Quality                  *float32           `json:"quality,omitempty"`
	Calls                    JsonArray[int]     `json:"calls,omitempty"`
	Cytoband                 JsonArray[string]  `json:"cytoband,omitempty"`
	Symbol                   JsonArray[string]  `json:"symbol,omitempty"`
	Filter                   string             `json:"filter,omitempty"`
	BC                       *int               `json:"bc,omitempty"`
	CN                       *int               `json:"cn,omitempty"`
	PE                       JsonArray[int]     `json:"pe,omitempty"`
	SM                       *float32           `json:"sm,omitempty"`
	SVType                   string             `json:"svtype,omitempty" gorm:"column:svtype"`
	SVLen                    *int               `json:"svlen,omitempty" gorm:"column:svlen"`
	RefLen                   *int               `json:"reflen,omitempty" gorm:"column:reflen"`
	CIEnd                    JsonArray[int]     `json:"ciend,omitempty" gorm:"column:ciend"`
	CIPos                    JsonArray[int]     `json:"cipos,omitempty" gorm:"column:cipos"`
	NbGenes                  *int               `json:"nb_genes,omitempty" gorm:"column:nb_genes"`
	NbSNV                    int                `json:"nb_snv" gorm:"column:nb_snv"`
	GnomadSC                 *int               `json:"gnomad_sc,omitempty" gorm:"column:gnomad_sc"`
	GnomadSN                 *int               `json:"gnomad_sn,omitempty" gorm:"column:gnomad_sn"`
	GnomadSF                 *float32           `json:"gnomad_sf,omitempty" gorm:"column:gnomad_sf"`
	GermlinePcWgs            *int               `json:"germline_pc_wgs,omitempty"`
	GermlinePnWgs            *int               `json:"germline_pn_wgs,omitempty"`
	GermlinePfWgs            *float64           `json:"germline_pf_wgs,omitempty"`
	GermlinePcWgsAffected    *int               `json:"germline_pc_wgs_affected,omitempty"`
	GermlinePnWgsAffected    *int               `json:"germline_pn_wgs_affected,omitempty"`
	GermlinePfWgsAffected    *float64           `json:"germline_pf_wgs_affected,omitempty"`
	GermlinePcWgsNotAffected *int               `json:"germline_pc_wgs_not_affected,omitempty"`
	GermlinePnWgsNotAffected *int               `json:"germline_pn_wgs_not_affected,omitempty"`
	GermlinePfWgsNotAffected *float64           `json:"germline_pf_wgs_not_affected,omitempty"`
	GermlinePcWxs            *int               `json:"germline_pc_wxs,omitempty"`
	GermlinePnWxs            *int               `json:"germline_pn_wxs,omitempty"`
	GermlinePfWxs            *float64           `json:"germline_pf_wxs,omitempty"`
	GermlinePcWxsAffected    *int               `json:"germline_pc_wxs_affected,omitempty"`
	GermlinePnWxsAffected    *int               `json:"germline_pn_wxs_affected,omitempty"`
	GermlinePfWxsAffected    *float64           `json:"germline_pf_wxs_affected,omitempty"`
	GermlinePcWxsNotAffected *int               `json:"germline_pc_wxs_not_affected,omitempty"`
	GermlinePnWxsNotAffected *int               `json:"germline_pn_wxs_not_affected,omitempty"`
	GermlinePfWxsNotAffected *float64           `json:"germline_pf_wxs_not_affected,omitempty"`
	HasNote                  bool               `json:"has_note" validate:"required"`
	FlagType                 OccurrenceFlagType `json:"flag_type,omitempty" enums:"flag,pin,star"`
}

var GermlineCNVOccurrenceTable = Table{
	Name:      "germline__cnv__occurrence",
	Alias:     "cnvo",
	PerTenant: true,
}

var GermlineCNVSeqIdField = Field{
	Name:          "seq_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVIdField = Field{
	Name:          "cnv_id",
	CanBeSelected: true,
	CanBeFiltered: true,
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
	CanBeSelected: true,
	IsArray:       true,
	Table:         GermlineCNVOccurrenceTable,
}

var GermlineCNVVariantFrequencyTable = Table{
	Name:      "germline__cnv__variant_frequency",
	Alias:     "cnvf",
	PerTenant: true,
}

var GermlineCNVPcWgsField = Field{
	Name:          "pc_wgs",
	Alias:         "germline_pc_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPnWgsField = Field{
	Name:          "pn_wgs",
	Alias:         "germline_pn_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPfWgsField = Field{
	Name:          "pf_wgs",
	Alias:         "germline_pf_wgs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPcWgsAffectedField = Field{
	Name:          "pc_wgs_affected",
	Alias:         "germline_pc_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPnWgsAffectedField = Field{
	Name:          "pn_wgs_affected",
	Alias:         "germline_pn_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPfWgsAffectedField = Field{
	Name:          "pf_wgs_affected",
	Alias:         "germline_pf_wgs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPcWgsNotAffectedField = Field{
	Name:          "pc_wgs_not_affected",
	Alias:         "germline_pc_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPnWgsNotAffectedField = Field{
	Name:          "pn_wgs_not_affected",
	Alias:         "germline_pn_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPfWgsNotAffectedField = Field{
	Name:          "pf_wgs_not_affected",
	Alias:         "germline_pf_wgs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPcWxsField = Field{
	Name:          "pc_wxs",
	Alias:         "germline_pc_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPnWxsField = Field{
	Name:          "pn_wxs",
	Alias:         "germline_pn_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPfWxsField = Field{
	Name:          "pf_wxs",
	Alias:         "germline_pf_wxs",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPcWxsAffectedField = Field{
	Name:          "pc_wxs_affected",
	Alias:         "germline_pc_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPnWxsAffectedField = Field{
	Name:          "pn_wxs_affected",
	Alias:         "germline_pn_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPfWxsAffectedField = Field{
	Name:          "pf_wxs_affected",
	Alias:         "germline_pf_wxs_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPcWxsNotAffectedField = Field{
	Name:          "pc_wxs_not_affected",
	Alias:         "germline_pc_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPnWxsNotAffectedField = Field{
	Name:          "pn_wxs_not_affected",
	Alias:         "germline_pn_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          IntegerType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVPfWxsNotAffectedField = Field{
	Name:          "pf_wxs_not_affected",
	Alias:         "germline_pf_wxs_not_affected",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Type:          DecimalType,
	Table:         GermlineCNVVariantFrequencyTable,
}

var GermlineCNVOccurrencesFields = []Field{
	GermlineCNVSeqIdField,
	GermlineCNVTaskIdField,
	GermlineCNVIdField,
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
	TenantGenePanelField,
	GermlineCNVPcWgsField,
	GermlineCNVPnWgsField,
	GermlineCNVPfWgsField,
	GermlineCNVPcWgsAffectedField,
	GermlineCNVPnWgsAffectedField,
	GermlineCNVPfWgsAffectedField,
	GermlineCNVPcWgsNotAffectedField,
	GermlineCNVPnWgsNotAffectedField,
	GermlineCNVPfWgsNotAffectedField,
	GermlineCNVPcWxsField,
	GermlineCNVPnWxsField,
	GermlineCNVPfWxsField,
	GermlineCNVPcWxsAffectedField,
	GermlineCNVPnWxsAffectedField,
	GermlineCNVPfWxsAffectedField,
	GermlineCNVPcWxsNotAffectedField,
	GermlineCNVPnWxsNotAffectedField,
	GermlineCNVPfWxsNotAffectedField,
}

var GermlineCNVOccurrencesDefaultFields = []Field{
	GermlineCNVSeqIdField,
	GermlineCNVTaskIdField,
	GermlineCNVIdField,
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
