package types

import "fmt"

// OccurrenceType identifies the kind of occurrences a Variants tab is showing.
// Used to resolve which tasks to list for a (case, sequencing) pair.
// @Description Occurrence type filter for the case-sequencing task list
// @Name OccurrenceType
type OccurrenceType string

const (
	OccurrenceTypeGermlineSNV OccurrenceType = "germline_snv"
	OccurrenceTypeGermlineCNV OccurrenceType = "germline_cnv"
	// Deprecated: alias of OccurrenceTypeSomaticSNVTumorNormal. Remove once every client
	// sends somatic_snv_tn.
	OccurrenceTypeSomaticSNV            OccurrenceType = "somatic_snv"
	OccurrenceTypeSomaticSNVTumorNormal OccurrenceType = "somatic_snv_tn"
	OccurrenceTypeSomaticSNVTumorOnly   OccurrenceType = "somatic_snv_to"
)

// AllOccurrenceTypes lists every accepted value of the data_type query param.
// swaggo reads the handler's Enums(...) annotation string, not these constants — a value
// added here without editing handlers_cases.go vanishes from the generated clients with
// no build error.
var AllOccurrenceTypes = []OccurrenceType{
	OccurrenceTypeGermlineSNV,
	OccurrenceTypeGermlineCNV,
	OccurrenceTypeSomaticSNV,
	OccurrenceTypeSomaticSNVTumorNormal,
	OccurrenceTypeSomaticSNVTumorOnly,
}

// SomaticCohort narrows a somatic task list to one tumor/normal arrangement. Tumor-only and
// tumor-normal are independent predicates, not complements — a malformed task belongs to
// neither, so never express one as the negation of the other.
// See design/SJRA-1751-somatic-tumor-only-portal-backend.md.
type SomaticCohort string

const (
	SomaticCohortNone        SomaticCohort = ""
	SomaticCohortTumorNormal SomaticCohort = "tumor_normal"
	SomaticCohortTumorOnly   SomaticCohort = "tumor_only"
)

// TaskSelector is the set of criteria that narrows the task list down to the tasks producing
// occurrences of one OccurrenceType. Tumor-only and tumor-normal share a task_type_code, so
// the task type alone cannot tell them apart.
type TaskSelector struct {
	TaskTypeCode  string
	SomaticCohort SomaticCohort
}

// TaskSelector returns the criteria selecting the tasks that produce occurrences of this type.
// Returns a zero selector and an error when the occurrence type is not recognized.
func (o OccurrenceType) TaskSelector() (TaskSelector, error) {
	switch o {
	case OccurrenceTypeGermlineSNV:
		return TaskSelector{TaskTypeCode: RadiantGermlineAnnotationTask, SomaticCohort: SomaticCohortNone}, nil
	case OccurrenceTypeGermlineCNV:
		return TaskSelector{TaskTypeCode: AlignmentGermlineVariantCallingTaskTypeCode, SomaticCohort: SomaticCohortNone}, nil
	case OccurrenceTypeSomaticSNV, OccurrenceTypeSomaticSNVTumorNormal:
		return TaskSelector{TaskTypeCode: RadiantSomaticAnnotationTask, SomaticCohort: SomaticCohortTumorNormal}, nil
	case OccurrenceTypeSomaticSNVTumorOnly:
		return TaskSelector{TaskTypeCode: RadiantSomaticAnnotationTask, SomaticCohort: SomaticCohortTumorOnly}, nil
	default:
		return TaskSelector{}, fmt.Errorf("unknown occurrence type %q", string(o))
	}
}
