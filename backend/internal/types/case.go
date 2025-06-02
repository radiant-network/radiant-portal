package types

import "time"

type Case struct {
	ID               int
	ProbandID        int
	Proband          Patient `gorm:"foreignKey:ID;references:ProbandID"`
	ProjectID        int
	Project          Project `gorm:"foreignKey:ID;references:ProjectID"`
	TypeCode         string
	Type             CaseType `gorm:"foreignKey:code;references:TypeCode"`
	StatusCode       string
	Status           Status `gorm:"foreignKey:Code;references:StatusCode"`
	PrimaryCondition string
	PanelID          int
	RequestID        int
	Request          Request `gorm:"foreignKey:ID;references:RequestID"`
	PerformerLabID   int
	PerformerLab     Organization `gorm:"foreignKey:ID;references:PerformerLabID"`
	Note             string
	CreatedOn        time.Time
	UpdatedOn        time.Time
}

var CaseTable = Table{
	Name: "radiant_jdbc.public.case",
}

func (Case) TableName() string {
	return CaseTable.Name
}
