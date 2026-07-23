package types

import "time"

// Fetus is the clinical subject of a prenatal case, modeled as tissue of its mother (the case's
// proband) — it has no administrative identity of its own. See
// project-tasks/radiant-migration/foetus-analysis.md in the parent clin-localstack repo.
type Fetus struct {
	ID                  int `gorm:"unique;primaryKey;autoIncrement"`
	MotherID            int
	Mother              Patient `gorm:"foreignKey:ID;references:MotherID"`
	LifeStatusCode      string
	LifeStatus          LifeStatus `gorm:"foreignKey:Code;references:LifeStatusCode"`
	SexCode             string
	Sex                 Sex        `gorm:"foreignKey:Code;references:SexCode"`
	LastMenstrualPeriod *time.Time `gorm:"type:DATE"`
	EstimatedDueDate    *time.Time `gorm:"type:DATE"`
	TenantCode          string
}

var FetusTable = Table{
	Name:           "fetus",
	FederationName: "radiant_jdbc.public.fetus",
	Alias:          "fetus",
}

func (Fetus) TableName() string {
	return FetusTable.Name
}
