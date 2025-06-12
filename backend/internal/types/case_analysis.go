package types

type CaseAnalysis struct {
	ID       int
	Code     string
	Name     string
	TypeCode string
	Type     CaseAnalysisType `gorm:"foreignKey:Code;references:TypeCode"`
	PanelID  int
	Panel    Panel `gorm:"foreignKey:ID;references:PanelID"`

	Description string
}

var CaseAnalysisTable = Table{
	Name:  "radiant_jdbc.public.case_analysis",
	Alias: "ca",
}

func (CaseAnalysis) TableName() string {
	return CaseAnalysisTable.Name
}

var CaseAnalysisTypeCodeField = Field{
	Name:          "type_code",
	Alias:         "case_analysis_type_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseAnalysisTable,
}

var CaseAnalysisCodeField = Field{
	Name:          "code",
	Alias:         "case_analysis_code",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         CaseAnalysisTable,
}

var CaseAnalysisNameField = Field{
	Name:          "name",
	Alias:         "case_analysis_name",
	CanBeSelected: true,
	Table:         CaseAnalysisTable,
}
