package types

import (
	"time"
)

// Task type codes (values found in the task_type table).
const (
	RadiantGermlineAnnotationTask               = "radiant_germline_annotation"
	RadiantSomaticAnnotationTask                = "radiant_somatic_annotation"
	ExomiserTaskTypeCode                        = "exomiser"
	AlignmentGermlineVariantCallingTaskTypeCode = "alignment_germline_variant_calling"
	AlignmentSomaticVariantCallingTaskTypeCode  = "alignment_somatic_variant_calling"
)

// TaskOccurrenceType is a row of GET /cases/{case_id}/{seq_id}/tasks_with_occurrences —
// a task attached to the (case, sequencing) pair that produces occurrences of the
// requested OccurrenceType.
// @Description Task attached to a (case, sequencing) pair, used by the Variants tab task dropdown.
// @Name TaskOccurrenceType
type TaskOccurrenceType struct {
	ID              int       `json:"id" validate:"required"`
	TaskTypeCode    string    `json:"task_type_code" validate:"required"`
	TaskTypeName    string    `json:"task_type_name" validate:"required"`
	PipelineName    string    `json:"pipeline_name,omitempty"`
	PipelineVersion string    `json:"pipeline_version" validate:"required"`
	GenomeBuild     string    `json:"genome_build,omitempty"`
	CreatedOn       time.Time `json:"created_on" validate:"required"`
}

type Task struct {
	ID              int `gorm:"unique;primaryKey;autoIncrement"`
	TaskTypeCode    string
	TaskType        TaskType `gorm:"foreignKey:code;references:TaskTypeCode"`
	PipelineName    string
	PipelineVersion string
	GenomeBuild     string
	CreatedOn       time.Time `gorm:"autoCreateTime"`
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

var TaskContextTaskIdField = Field{
	Name:          "task_id",
	CanBeSelected: true,
	CanBeFiltered: true,
	CanBeSorted:   true,
	Table:         TaskContextTable,
}
