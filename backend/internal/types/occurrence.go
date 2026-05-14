package types

import "fmt"

// OccurrenceType identifies the kind of occurrences a Variants tab is showing.
// Used to resolve which task_type to filter by when listing tasks attached
// to a (case, sequencing) pair.
// @Description Occurrence type filter for the case-sequencing task list
// @Name OccurrenceType
type OccurrenceType string

const (
	OccurrenceTypeGermlineSNV OccurrenceType = "germline_snv"
	OccurrenceTypeGermlineCNV OccurrenceType = "germline_cnv"
	OccurrenceTypeSomaticSNV  OccurrenceType = "somatic_snv"
)

// TaskTypeCode returns the task_type code that produces occurrences of this type.
// Returns nil and an error when the occurrence type is not recognized.
func (o OccurrenceType) TaskTypeCode() (*string, error) {
	var code string
	switch o {
	case OccurrenceTypeGermlineSNV:
		code = RadiantGermlineAnnotationTask
	case OccurrenceTypeGermlineCNV:
		code = AlignmentGermlineVariantCallingTaskTypeCode
	case OccurrenceTypeSomaticSNV:
		code = RadiantSomaticAnnotationTask
	default:
		return nil, fmt.Errorf("unknown occurrence type %q", string(o))
	}
	return &code, nil
}
