package types

type Project struct {
	ID          int
	Code        string
	Name        string
	Description string
}

var ProjectTable = Table{
	Name: "radiant_jdbc.public.project",
}

func (Project) TableName() string {
	return ProjectTable.Name
}
