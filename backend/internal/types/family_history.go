package types

type FamilyHistory struct {
	ID               int `gorm:"unique;primaryKey;autoIncrement"`
	CaseID           int
	Case             Case `gorm:"foreignKey:ID;references:CaseID"`
	PatientID        int
	Patient          Patient `gorm:"foreignKey:ID;references:PatientID"`
	FamilyMemberCode string
	Condition        string
}

var FamilyHistoryTable = Table{
	Name:           "family_history",
	FederationName: "radiant_jdbc.public.family_history",
	Alias:          "family_history",
}

func (FamilyHistory) TableName() string {
	return FamilyHistoryTable.Name
}
