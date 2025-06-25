package types

type Project struct {
	ID          int
	Code        string
	Name        string
	Description string
}

var ProjectTable = Table{
	Name:  "radiant_jdbc.public.project",
	Alias: "prj",
}

func (Project) TableName() string {
	return ProjectTable.Name
}

var ProjectCodeField = Field{
	Name:            "code",
	Alias:           "project_code",
	CanBeSelected:   true,
	CanBeFiltered:   true,
	CanBeSorted:     true,
	CanBeAggregated: true,
	Table:           ProjectTable,
}
