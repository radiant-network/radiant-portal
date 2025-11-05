package types

import (
	"time"
)

type Task struct {
	ID                    int
	TypeCode              string
	Type                  TaskType `gorm:"foreignKey:code;references:CaseTypeCode"`
	PipelineID            int
	Pipeline              Pipeline `gorm:"foreignKey:ID;references:PipelineID"`
	CreatedOn             time.Time
	SequencingExperiments []SequencingExperiment `gorm:"many2many:radiant_jdbc.public.task_has_sequencing_experiment;"`
	RelatedTasks          []Task                 `gorm:"many2many:radiant_jdbc.public.task_has_related_task;foreignKey:ID;joinForeignKey:TaskID;References:ID;joinReferences:RelatedTaskID"`
	Documents             []Document             `gorm:"many2many:radiant_jdbc.public.task_has_document;"`
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

var TaskHasSequencingExperimentTable = Table{
	Name:  "radiant_jdbc.public.task_has_sequencing_experiment",
	Alias: "thseq",
}

func (Task) TableName() string {
	return TaskTable.Name
}
