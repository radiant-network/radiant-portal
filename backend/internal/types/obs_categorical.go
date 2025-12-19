package types

type ObsCategorical struct {
	ID                 int
	CaseID             int
	Case               Case `gorm:"foreignKey:ID;references:CaseID"`
	PatientID          int
	Patient            Patient `gorm:"foreignKey:ID;references:PatientID"`
	ObservationCode    string
	Observation        Observation `gorm:"foreignKey:code;references:ObservationCode"`
	CodingSystem       string
	CodeValue          string
	OnsetCode          string
	Onset              Onset `gorm:"foreignKey:code;references:OnsetCode"`
	InterpretationCode string
	Interpretation     ObservationInterpretation `gorm:"foreignKey:code;references:InterpretationCode"`
	Note               string
}

type PhenotypeObsCategorical struct {
	PatientID          int
	OnsetCode          string
	InterpretationCode string
	PhenotypeID        string
	PhenotypeName      string
}

var ObsCategoricalTable = Table{
	Name:           "obs_categorical",
	FederationName: "radiant_jdbc.public.obs_categorical",
	Alias:          "obs",
}

var ObsCategoricalAggregatedTmpTable = Table{
	Name:  "agg_phenotypes",
	Alias: "agg_phenotypes",
}

var AggregatedPhenotypeTermField = Field{
	Name:          "phenotypes_term",
	Alias:         "phenotypes_term",
	CanBeFiltered: true,
	Table:         ObsCategoricalAggregatedTmpTable,
}

func (ObsCategorical) TableName() string {
	return ObsCategoricalTable.Name
}
