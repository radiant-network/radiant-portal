package types

type ValueSet struct {
	Code   string `json:"id,omitempty"`
	NameEn string `json:"name,omitempty"`
}

var SexTable = Table{
	Name:           "sex",
	FederationName: "radiant_jdbc.public.sex",
	Alias:          "sex",
}

type Sex struct {
	ValueSet
} // @name Sex

func (Sex) TableName() string {
	return SexTable.Name
}

var StatusTable = Table{
	Name:           "status",
	FederationName: "radiant_jdbc.public.status",
	Alias:          "status",
}

type Status struct {
	ValueSet
} // @name Status

func (Status) TableName() string {
	return StatusTable.Name
}

var PriorityTable = Table{
	Name:           "priority",
	FederationName: "radiant_jdbc.public.priority",
	Alias:          "prio",
}

type Priority struct {
	ValueSet
} // @name Priority

func (Priority) TableName() string {
	return PriorityTable.Name
}

var ExperimentalStrategyTable = Table{
	Name:           "experimental_strategy",
	FederationName: "radiant_jdbc.public.experimental_strategy",
	Alias:          "exp_str",
}

type ExperimentalStrategy struct {
	ValueSet
} // @name ExperimentalStrategy

func (ExperimentalStrategy) TableName() string {
	return ExperimentalStrategyTable.Name
}

var PlatformTable = Table{
	Name:           "platform",
	FederationName: "radiant_jdbc.public.platform",
	Alias:          "platform",
}

type Platform struct {
	ValueSet
} // @name Platform

func (Platform) TableName() string {
	return PlatformTable.Name
}

var FamilyRelationshipTable = Table{
	Name:           "family_relationship",
	FederationName: "radiant_jdbc.public.family_relationship",
	Alias:          "fam_rel",
}

type FamilyRelationship struct {
	ValueSet
} // @name FamilyRelationship

func (FamilyRelationship) TableName() string {
	return FamilyRelationshipTable.Name
}

var ObservationInterpretationTable = Table{
	Name:           "obs_interpretation",
	FederationName: "radiant_jdbc.public.obs_interpretation",
	Alias:          "obs_int",
}

type ObservationInterpretation struct {
	ValueSet
} // @name ObservationInterpretation

func (ObservationInterpretation) TableName() string {
	return ObservationInterpretationTable.Name
}

var SampleTypeTable = Table{
	Name:           "sample_type",
	FederationName: "radiant_jdbc.public.sample_type",
	Alias:          "spl_type",
}

type SampleType struct {
	ValueSet
} // @name SampleType

func (SampleType) TableName() string {
	return SampleTypeTable.Name
}

var HistologyTypeTable = Table{
	Name:           "histology_type",
	FederationName: "radiant_jdbc.public.histology_type",
	Alias:          "hist_type",
}

type HistologyType struct {
	ValueSet
} // @name HistologyType

func (HistologyType) TableName() string {
	return HistologyTypeTable.Name
}

var AffectedStatusTable = Table{
	Name:           "affected_status",
	FederationName: "radiant_jdbc.public.affected_status",
	Alias:          "affected_status",
}

type AffectedStatus struct {
	ValueSet
} // @name AffectedStatus

func (AffectedStatus) TableName() string {
	return AffectedStatusTable.Name
}

var DataCategoryTable = Table{
	Name:           "data_category",
	FederationName: "radiant_jdbc.public.data_category",
	Alias:          "data_ctg",
}

type DataCategory struct {
	ValueSet
} // @name DataCategory

func (DataCategory) TableName() string {
	return DataCategoryTable.Name
}

var ObservationTable = Table{
	Name:           "observation",
	FederationName: "radiant_jdbc.public.observation",
	Alias:          "obs_type",
}

type Observation struct {
	ValueSet
	Category string `json:"category,omitempty"`
} // @name Observation

func (Observation) TableName() string {
	return ObservationTable.Name
}

var OnsetTable = Table{
	Name:           "onset",
	FederationName: "radiant_jdbc.public.onset",
	Alias:          "onset",
}

type Onset struct {
	ValueSet
} // @name Onset

func (Onset) TableName() string {
	return OnsetTable.Name
}

var DataTypeTable = Table{
	Name:           "data_type",
	FederationName: "radiant_jdbc.public.data_type",
	Alias:          "data_type",
}

type DataType struct {
	ValueSet
} // @name DataType

func (DataType) TableName() string {
	return DataTypeTable.Name
}

var FileFormatTable = Table{
	Name:           "file_format",
	FederationName: "radiant_jdbc.public.file_format",
	Alias:          "format",
}

type FileFormat struct {
	ValueSet
} // @name FileFormat

func (FileFormat) TableName() string {
	return FileFormatTable.Name
}

var TaskTypeTable = Table{
	Name:           "task_type",
	FederationName: "radiant_jdbc.public.task_type",
	Alias:          "task_type",
}

type TaskType struct {
	ValueSet
} // @name TaskType

func (TaskType) TableName() string {
	return TaskTypeTable.Name
}

var OrganizationCategoryTable = Table{
	Name:           "organization_category",
	FederationName: "radiant_jdbc.public.organization_category",
	Alias:          "org_cat",
}

type OrganizationCategory struct {
	ValueSet
} // @name OrganizationCategory

func (OrganizationCategory) TableName() string {
	return OrganizationCategoryTable.Name
}

var PanelTypeTable = Table{
	Name:           "panel_type",
	FederationName: "radiant_jdbc.public.panel_type",
	Alias:          "panel_type",
}

type PanelType struct {
	ValueSet
} // @name PanelType

func (PanelType) TableName() string {
	return PanelTypeTable.Name
}

var CaseCategoryTable = Table{
	Name:           "case_category",
	FederationName: "radiant_jdbc.public.case_category",
	Alias:          "case_cat",
}

type CaseCategory struct {
	ValueSet
} // @name CaseCategory

func (CaseCategory) TableName() string {
	return CaseCategoryTable.Name
}

var ResolutionStatusTable = Table{
	Name:           "resolution_status",
	FederationName: "radiant_jdbc.public.resolution_status",
	Alias:          "resolution_status",
}

type ResolutionStatus struct {
	ValueSet
} // @name ResolutionStatus

func (ResolutionStatus) TableName() string {
	return ResolutionStatusTable.Name
}

var CaseTypeTable = Table{
	Name:           "case_type",
	FederationName: "radiant_jdbc.public.case_type",
	Alias:          "case_type",
}

type CaseType struct {
	ValueSet
} // @name CaseType

func (CaseType) TableName() string {
	return CaseTypeTable.Name
}

var SequencingReadTechnologyTable = Table{
	Name:           "sequencing_read_technology",
	FederationName: "radiant_jdbc.public.sequencing_read_technology",
	Alias:          "seq_read_tech",
}

type SequencingReadTechnology struct {
	ValueSet
} // @name SequencingReadTechnology

func (SequencingReadTechnology) TableName() string {
	return SequencingReadTechnologyTable.Name
}

var LifeStatusTable = Table{
	Name:           "life_status",
	FederationName: "radiant_jdbc.public.life_status",
	Alias:          "life_status",
}

type LifeStatus struct {
	ValueSet
} // @name LifeStatus

func (LifeStatus) TableName() string {
	return LifeStatusTable.Name
}
