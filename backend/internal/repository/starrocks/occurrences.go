package starrocks

import (
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

// annotationQuery is the annotation-filter half of an occurrence query, shared by list and count.
type annotationQuery interface {
	WithNote() bool
	WithFlag() []types.OccurrenceFlagType
	WithInterpretation() bool
}

// keepOccurrencesWithAnyAnnotation restricts tx to the occurrences of one case/sequencing carrying at
// least one of the annotations userQuery asks for.
//
// The annotations cannot be brought in with semi joins any more: a semi join only ever narrows, so it
// cannot take part in a disjunction. Plain left joins are safe here because each one yields at most
// one row per occurrence — the note and interpretation sub-queries are DISTINCT, and occurrence_flag
// is keyed on (case_id, occurrence_id, seq_id, task_id) — so nothing fans out. Like the semi joins
// before them they have to be applied to the same sub-query the pagination runs on, otherwise the
// page would be trimmed after the fact.
func keepOccurrencesWithAnyAnnotation(occurrenceTable types.Table, occurrenceIdColumn string, caseId int, seqId int, userQuery annotationQuery, tx *gorm.DB) *gorm.DB {
	if userQuery == nil {
		return tx
	}
	ctx := utils.CtxOf(tx)
	alias := occurrenceTable.Alias
	var conditions []string
	var args []any

	if userQuery.WithNote() {
		tx = tx.Joins(fmt.Sprintf("LEFT JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM %s WHERE deleted = false) note_filter ON note_filter.occurrence_id = %s.%s AND note_filter.task_id = %s.task_id AND note_filter.seq_id = ? AND note_filter.case_id = ?",
			types.OccurrenceNoteTable.TenantQualifiedName(ctx), alias, occurrenceIdColumn, alias), seqId, caseId)
		conditions = append(conditions, "note_filter.occurrence_id IS NOT NULL")
	}

	if flagTypes := userQuery.WithFlag(); len(flagTypes) > 0 {
		tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s flag_filter ON flag_filter.occurrence_id = %s.%s AND flag_filter.task_id = %s.task_id AND flag_filter.seq_id = ? AND flag_filter.case_id = ?",
			types.OccurrenceFlagTable.TenantQualifiedName(ctx), alias, occurrenceIdColumn, alias), seqId, caseId)
		conditions = append(conditions, "flag_filter.flag_type IN (?)")
		args = append(args, flagTypes)
	}

	// Interpretations are SNV-only: they key on the variant locus and there is no CNV interpretation
	// table yet. Unlike notes and flags they do not key on task_id, and the ids are bound as strings
	// to match the federated column types.
	if userQuery.WithInterpretation() {
		if interpretationTable, ok := interpretationTableFor(occurrenceTable); ok {
			tx = tx.Joins(fmt.Sprintf("LEFT JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM %s) interpretation_filter ON interpretation_filter.locus_id = %s.locus_id AND interpretation_filter.sequencing_id = ? AND interpretation_filter.case_id = ?",
				interpretationTable.TenantQualifiedName(ctx), alias), fmt.Sprintf("%d", seqId), fmt.Sprintf("%d", caseId))
			conditions = append(conditions, "interpretation_filter.locus_id IS NOT NULL")
		} else {
			// A CNV occurrence cannot carry an interpretation. The term has to be false rather than
			// absent: a query asking for this filter alone would otherwise carry no condition at all
			// and return every occurrence instead of none.
			conditions = append(conditions, "false")
		}
	}

	if len(conditions) == 0 {
		return tx
	}
	return tx.Where("("+strings.Join(conditions, " OR ")+")", args...)
}

// unannotatedQuery hides the annotation filters of a count query so only the query builder sqon is
// applied.
type unannotatedQuery struct {
	types.OccurrenceCountQuery
}

func (unannotatedQuery) WithNote() bool                       { return false }
func (unannotatedQuery) WithFlag() []types.OccurrenceFlagType { return nil }
func (unannotatedQuery) WithInterpretation() bool             { return false }

func hasAnnotationFilters(userQuery annotationQuery) bool {
	return userQuery != nil && (userQuery.WithNote() || len(userQuery.WithFlag()) > 0 || userQuery.WithInterpretation())
}

// countWithAndWithoutAnnotations reports the count of the query builder sqon alone next to the count
// the annotation filters leave: those filters are an extra layer on top of the query builder and must
// not move its total. The unfiltered count is the one the sqon alone yields, so it is always run; the
// second pass is skipped when no annotation filter is set.
func countWithAndWithoutAnnotations(userQuery types.OccurrenceCountQuery, count func(types.OccurrenceCountQuery) (int64, error)) (types.OccurrenceCount, error) {
	unfilteredQuery := userQuery
	if userQuery != nil {
		unfilteredQuery = unannotatedQuery{userQuery}
	}
	unfiltered, err := count(unfilteredQuery)
	if err != nil {
		return types.OccurrenceCount{}, err
	}
	if !hasAnnotationFilters(userQuery) {
		return types.OccurrenceCount{Count: unfiltered, FilteredCount: unfiltered}, nil
	}
	filtered, err := count(userQuery)
	if err != nil {
		return types.OccurrenceCount{}, err
	}
	return types.OccurrenceCount{Count: unfiltered, FilteredCount: filtered}, nil
}

func interpretationTableFor(snvTable types.Table) (types.Table, bool) {
	switch snvTable {
	case types.GermlineSNVOccurrenceTable:
		return types.InterpretationGermlineTable, true
	case types.SomaticSNVOccurrenceTable:
		return types.InterpretationSomaticTable, true
	default:
		return types.Table{}, false
	}
}
