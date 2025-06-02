package types

type Pipeline struct {
	ID          int
	Description string
	GenomeBuild string
}

var PipelineTable = Table{
	Name: "radiant_jdbc.public.pipeline",
}

func (Pipeline) TableName() string {
	return PipelineTable.Name
}
