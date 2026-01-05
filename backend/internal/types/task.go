package types

import (
	"time"
)

type Task struct {
	ID              int `gorm:"unique;primaryKey;autoIncrement"`
	TaskTypeCode    string
	TaskType        TaskType `gorm:"foreignKey:code;references:TaskTypeCode"`
	PipelineName    string
	PipelineVersion string
	GenomeBuild     string
	CreatedOn       time.Time
}

type TaskContext struct {
	TaskID                 int
	Task                   Task `gorm:"foreignKey:TaskID;references:ID"`
	CaseID                 *int
	Case                   Case `gorm:"foreignKey:CaseID;references:ID"`
	SequencingExperimentID int
	SequencingExperiment   SequencingExperiment `gorm:"foreignKey:SequencingExperimentID;references:ID"`
}

type TaskHasDocument struct {
	TaskID     int
	Task       Task `gorm:"foreignKey:TaskID;references:ID"`
	DocumentID int
	Document   Document `gorm:"foreignKey:DocumentID;references:ID"`
	Type       string
}

var TaskHasDocumentTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         TaskHasDocumentTable,
}

var TaskTable = Table{
	Name:           "task",
	FederationName: "radiant_jdbc.public.task",
	Alias:          "task",
}

var TaskHasDocumentTable = Table{
	Name:           "task_has_document",
	FederationName: "radiant_jdbc.public.task_has_document",
	Alias:          "thd",
}

var TaskContextTable = Table{
	Name:           "task_context",
	FederationName: "radiant_jdbc.public.task_context",
	Alias:          "tctx",
}

func (Task) TableName() string {
	return TaskTable.Name
}

func (TaskContext) TableName() string {
	return TaskContextTable.Name
}

func (TaskHasDocument) TableName() string {
	return TaskHasDocumentTable.Name
}
