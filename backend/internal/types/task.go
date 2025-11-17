package types

import (
	"time"
)

type Task struct {
	ID              int
	TaskTypeCode    string
	TaskType        TaskType `gorm:"foreignKey:code;references:TaskTypeCode"`
	PipelineName    string
	PipelineVersion string
	GenomeBuild     string
	CreatedOn       time.Time
}

var TaskHasDocumentTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         TaskHasDocumentTable,
}

var TaskTable = Table{
	Name:  "radiant_jdbc.public.task",
	Alias: "task",
}

var TaskHasDocumentTable = Table{
	Name:  "radiant_jdbc.public.task_has_document",
	Alias: "thd",
}

var TaskContextTable = Table{
	Name:  "radiant_jdbc.public.task_context",
	Alias: "tctx",
}

func (Task) TableName() string {
	return TaskTable.Name
}
