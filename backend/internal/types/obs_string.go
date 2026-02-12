package types

type ObsString struct {
	ID              int `gorm:"unique;primaryKey;autoIncrement"`
	CaseID          int
	Case            Case `gorm:"foreignKey:ID;references:CaseID"`
	PatientID       int
	Patient         Patient `gorm:"foreignKey:ID;references:PatientID"`
	ObservationCode string
	Value           string
}

var ObsStringTable = Table{
	Name:           "obs_string",
	FederationName: "radiant_jdbc.public.obs_string",
	Alias:          "obs_string",
}

func (ObsString) TableName() string {
	return ObsStringTable.Name
}
