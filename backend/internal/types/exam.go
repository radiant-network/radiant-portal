package types

var ExamTable = Table{
	Name:           "exam",
	FederationName: "radiant_jdbc.public.exam",
	Alias:          "exam",
}

type Exam struct {
	ValueSet
	NameFr string `json:"name_fr,omitempty"`
} // @name Exam

func (Exam) TableName() string {
	return ExamTable.Name
}
