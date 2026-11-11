package types

var ExamTable = Table{
	Name:           "exam",
	FederationName: "radiant_jdbc.public.exam",
	Alias:          "exam",
}

type Exam struct {
	Code       string `gorm:"primaryKey" json:"id,omitempty"`
	TenantCode string `gorm:"primaryKey"`
	NameEn     string `json:"name,omitempty"`
	NameFr     string `json:"name_fr,omitempty"`
} // @name Exam

func (Exam) TableName() string {
	return ExamTable.Name
}

// CaseExam - Paraclinical exam observation
// @Description Paraclinical exam observation to display in Case Entity
// @Name CaseExam
type CaseExam struct {
	ExamCode           string `json:"exam_code" validate:"required"`
	Name               string `json:"name,omitempty"`
	InterpretationCode string `json:"interpretation_code,omitempty"`
	Value              string `json:"value,omitempty"`
	ValueName          string `json:"value_name,omitempty"`
	CodingSystem       string `json:"coding_system,omitempty"`
}

type ExamObservation struct {
	PatientID *int
	FetusID   *int
	CaseExam
}
