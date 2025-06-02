package types

type ObservationCoding struct {
	ID                 int
	CaseID             int
	Case               Case `gorm:"foreignKey:ID;references:CaseID"`
	PatientID          int
	Patient            Patient `gorm:"foreignKey:ID;references:PatientID"`
	ObservationCode    string
	Observation        Observation `gorm:"foreignKey:code;references:ObservationCode"`
	CodingSystem       string
	CodingValue        string
	OnsetCode          string
	Onset              Onset `gorm:"foreignKey:code;references:OnsetCode"`
	InterpretationCode string
	Interpretation     ObservationInterpretation `gorm:"foreignKey:code;references:InterpretationCode"`
	Note               string
}

var ObservationCodingTable = Table{
	Name: "radiant_jdbc.public.observation_coding",
}

func (ObservationCoding) TableName() string {
	return ObservationCodingTable.Name
}
