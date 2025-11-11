package types

type ValueSet struct {
	Code   string `json:"id,omitempty"`
	NameEn string `json:"name,omitempty"`
}

var SexTable = Table{
	Name: "radiant_jdbc.public.sex",
}

type Sex struct {
	ValueSet
} // @name Sex

func (Sex) TableName() string {
	return SexTable.Name
}

var StatusTable = Table{
	Name:  "radiant_jdbc.public.status",
	Alias: "status",
}

type Status struct {
	ValueSet
} // @name Status

func (Status) TableName() string {
	return StatusTable.Name
}

var PriorityTable = Table{
	Name:  "radiant_jdbc.public.priority",
	Alias: "priority",
}

type Priority struct {
	ValueSet
} // @name Priority

func (Priority) TableName() string {
	return PriorityTable.Name
}

var ExperimentalStrategyTable = Table{
	Name: "radiant_jdbc.public.experimental_strategy",
}

type ExperimentalStrategy struct {
	ValueSet
} // @name ExperimentalStrategy

func (ExperimentalStrategy) TableName() string {
	return ExperimentalStrategyTable.Name
}

var PlatformTable = Table{
	Name: "radiant_jdbc.public.platform",
}

type Platform struct {
	ValueSet
} // @name Platform

func (Platform) TableName() string {
	return PlatformTable.Name
}

var FamilyRelationshipTable = Table{
	Name:  "radiant_jdbc.public.family_relationship",
	Alias: "fam_rel",
}

type FamilyRelationship struct {
	ValueSet
} // @name FamilyRelationship

func (FamilyRelationship) TableName() string {
	return FamilyRelationshipTable.Name
}

var ObservationInterpretationTable = Table{
	Name: "radiant_jdbc.public.obs_interpretation",
}

type ObservationInterpretation struct {
	ValueSet
} // @name ObservationInterpretation

func (ObservationInterpretation) TableName() string {
	return ObservationInterpretationTable.Name
}

var SampleTypeTable = Table{
	Name: "radiant_jdbc.public.sample_type",
}

type SampleType struct {
	ValueSet
} // @name SampleType

func (SampleType) TableName() string {
	return SampleTypeTable.Name
}

var HistologyTypeTable = Table{
	Name: "radiant_jdbc.public.histology_type",
}

type HistologyType struct {
	ValueSet
} // @name HistologyType

func (HistologyType) TableName() string {
	return HistologyTypeTable.Name
}

var AffectedStatusTable = Table{
	Name: "radiant_jdbc.public.affected_status",
}

type AffectedStatus struct {
	ValueSet
} // @name AffectedStatus

func (AffectedStatus) TableName() string {
	return AffectedStatusTable.Name
}

var DataCategoryTable = Table{
	Name: "radiant_jdbc.public.data_category",
}

type DataCategory struct {
	ValueSet
} // @name DataCategory

func (DataCategory) TableName() string {
	return DataCategoryTable.Name
}

var ObservationTable = Table{
	Name: "radiant_jdbc.public.observation",
}

type Observation struct {
	ValueSet
	Category string `json:"category,omitempty"`
} // @name Observation

func (Observation) TableName() string {
	return ObservationTable.Name
}

var OnsetTable = Table{
	Name: "radiant_jdbc.public.onset",
}

type Onset struct {
	ValueSet
} // @name Onset

func (Onset) TableName() string {
	return OnsetTable.Name
}

var DataTypeTable = Table{
	Name:  "radiant_jdbc.public.data_type",
	Alias: "data_type",
}

type DataType struct {
	ValueSet
} // @name DataType

func (DataType) TableName() string {
	return DataTypeTable.Name
}

var FileFormatTable = Table{
	Name:  "radiant_jdbc.public.file_format",
	Alias: "format",
}

type FileFormat struct {
	ValueSet
} // @name FileFormat

func (FileFormat) TableName() string {
	return FileFormatTable.Name
}

var TaskTypeTable = Table{
	Name: "radiant_jdbc.public.task_type",
}

type TaskType struct {
	ValueSet
} // @name TaskType

func (TaskType) TableName() string {
	return TaskTypeTable.Name
}

var OrganizationCategoryTable = Table{
	Name: "radiant_jdbc.public.organization_category",
}

type OrganizationCategory struct {
	ValueSet
} // @name OrganizationCategory

func (OrganizationCategory) TableName() string {
	return OrganizationCategoryTable.Name
}

var PanelTypeTable = Table{
	Name: "radiant_jdbc.public.panel_type",
}

type PanelType struct {
	ValueSet
} // @name PanelType

func (PanelType) TableName() string {
	return PanelTypeTable.Name
}

var CaseCategoryTable = Table{
	Name: "radiant_jdbc.public.case_category",
}

type CaseCategory struct {
	ValueSet
} // @name CaseCategory

func (CaseCategory) TableName() string {
	return CaseCategoryTable.Name
}

var ResolutionStatusTable = Table{
	Name: "radiant_jdbc.public.resolution_status",
}

type ResolutionStatus struct {
	ValueSet
} // @name ResolutionStatus

func (ResolutionStatus) TableName() string {
	return ResolutionStatusTable.Name
}

var CaseTypeTable = Table{
	Name: "radiant_jdbc.public.case_type",
}

type CaseType struct {
	ValueSet
} // @name CaseType

func (CaseType) TableName() string {
	return CaseTypeTable.Name
}

var SequencingReadTechnologyTable = Table{
	Name: "radiant_jdbc.public.sequencing_read_technology",
}

type SequencingReadTechnology struct {
	ValueSet
} // @name SequencingReadTechnology

func (SequencingReadTechnology) TableName() string {
	return SequencingReadTechnologyTable.Name
}
