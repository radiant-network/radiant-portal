package types

// BeaconVariant is the slice of snv__variant a Beacon v2 genomicVariation document is built from.
// Coordinates are the table's own convention (1-based, inclusive); internal/beacon converts them.
type BeaconVariant struct {
	LocusID        int64             `gorm:"column:locus_id"`
	Chromosome     string            `gorm:"column:chromosome"`
	Start          int64             `gorm:"column:start"`
	End            *int64            `gorm:"column:end"`
	Reference      string            `gorm:"column:reference"`
	Alternate      string            `gorm:"column:alternate"`
	VariantClass   string            `gorm:"column:variant_class"`
	Symbol         string            `gorm:"column:symbol"`
	Hgvsg          string            `gorm:"column:hgvsg"`
	Rsnumber       string            `gorm:"column:rsnumber"`
	AaChange       string            `gorm:"column:aa_change"`
	ClinvarName    string            `gorm:"column:clinvar_name"`
	Consequences   JsonArray[string] `gorm:"column:consequences;type:json"`
	GermlinePcWgs  *int              `gorm:"column:germline_pc_wgs"`
	GermlinePnWgs  *int              `gorm:"column:germline_pn_wgs"`
	GermlinePfWgs  *float64          `gorm:"column:germline_pf_wgs"`
	GermlinePcWxs  *int              `gorm:"column:germline_pc_wxs"`
	GermlinePnWxs  *int              `gorm:"column:germline_pn_wxs"`
	GermlinePfWxs  *float64          `gorm:"column:germline_pf_wxs"`
	SomaticPcTnWgs *int              `gorm:"column:somatic_pc_tn_wgs"`
	SomaticPnTnWgs *int              `gorm:"column:somatic_pn_tn_wgs"`
	SomaticPfTnWgs *float64          `gorm:"column:somatic_pf_tn_wgs"`
	SomaticPcToWgs *int              `gorm:"column:somatic_pc_to_wgs"`
	SomaticPnToWgs *int              `gorm:"column:somatic_pn_to_wgs"`
	SomaticPfToWgs *float64          `gorm:"column:somatic_pf_to_wgs"`
	GnomadV3Af     *float64          `gorm:"column:gnomad_v3_af"`
}

// BeaconVariantColumns is the projection every Beacon variant read selects, so the row struct
// and the SQL cannot drift apart.
const BeaconVariantColumns = "locus_id, chromosome, start, end, reference, alternate, variant_class, symbol, hgvsg, rsnumber, aa_change, clinvar_name, consequences, " +
	"germline_pc_wgs, germline_pn_wgs, germline_pf_wgs, germline_pc_wxs, germline_pn_wxs, germline_pf_wxs, " +
	"somatic_pc_tn_wgs, somatic_pn_tn_wgs, somatic_pf_tn_wgs, somatic_pc_to_wgs, somatic_pn_to_wgs, somatic_pf_to_wgs, gnomad_v3_af"
