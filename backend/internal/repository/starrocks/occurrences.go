package starrocks

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

// The keepOccurrencesWith* helpers restrict tx to the occurrences of one case/sequencing carrying a
// given annotation. They are semi joins so they filter without duplicating rows, and they have to be
// applied to the same sub-query the pagination runs on, otherwise the page would be trimmed after
// the fact.

func keepOccurrencesWithNote(occurrenceTable types.Table, occurrenceIdColumn string, caseId int, seqId int, tx *gorm.DB) *gorm.DB {
	alias := occurrenceTable.Alias
	return tx.Joins(fmt.Sprintf("LEFT SEMI JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM %s WHERE deleted = false) note_filter ON note_filter.occurrence_id = %s.%s AND note_filter.task_id = %s.task_id AND note_filter.seq_id = ? AND note_filter.case_id = ?",
		types.OccurrenceNoteTable.TenantQualifiedName(utils.CtxOf(tx)), alias, occurrenceIdColumn, alias), seqId, caseId)
}

func keepOccurrencesWithFlag(occurrenceTable types.Table, occurrenceIdColumn string, flagTypes []types.OccurrenceFlagType, caseId int, seqId int, tx *gorm.DB) *gorm.DB {
	alias := occurrenceTable.Alias
	return tx.Joins(fmt.Sprintf("LEFT SEMI JOIN %s flag_filter ON flag_filter.occurrence_id = %s.%s AND flag_filter.task_id = %s.task_id AND flag_filter.seq_id = ? AND flag_filter.case_id = ? AND flag_filter.flag_type IN (?)",
		types.OccurrenceFlagTable.TenantQualifiedName(utils.CtxOf(tx)), alias, occurrenceIdColumn, alias), seqId, caseId, flagTypes)
}

// keepOccurrencesWithInterpretation is SNV-only: interpretations key on the variant locus, and there
// is no CNV interpretation table yet. Unlike notes and flags it does not key on task_id, and the ids
// are bound as strings to match the federated column types.
func keepOccurrencesWithInterpretation(snvTable types.Table, caseId int, seqId int, tx *gorm.DB) *gorm.DB {
	interpretationTable, ok := interpretationTableFor(snvTable)
	if !ok {
		return tx
	}
	return tx.Joins(fmt.Sprintf("LEFT SEMI JOIN (SELECT DISTINCT locus_id, case_id, sequencing_id FROM %s) interpretation_filter ON interpretation_filter.locus_id = %s.locus_id AND interpretation_filter.sequencing_id = ? AND interpretation_filter.case_id = ?",
		interpretationTable.TenantQualifiedName(utils.CtxOf(tx)), snvTable.Alias), fmt.Sprintf("%d", seqId), fmt.Sprintf("%d", caseId))
}

// unannotatedQuery hides the annotation filters of a count query so only the query builder sqon is
// applied.
type unannotatedQuery struct {
	types.OccurrenceCountQuery
}

func (unannotatedQuery) WithNote() bool                       { return false }
func (unannotatedQuery) WithFlag() []types.OccurrenceFlagType { return nil }
func (unannotatedQuery) WithInterpretation() bool             { return false }

func hasAnnotationFilters(userQuery types.OccurrenceCountQuery) bool {
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
