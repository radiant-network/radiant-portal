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
	Name: "radiant_jdbc.public.case_analysis",
}

func (CaseAnalysis) TableName() string {
	return CaseAnalysisTable.Name
}
