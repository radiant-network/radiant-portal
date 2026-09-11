package starrocks

import (
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

// keepOccurrencesWithNote restricts tx to the occurrences of one case/sequencing that carry at least
// one note. It is a semi join so it filters without duplicating rows, and it has to be applied to the
// same sub-query the pagination runs on, otherwise the page would be trimmed after the fact.
func keepOccurrencesWithNote(occurrenceTable types.Table, occurrenceIdColumn string, caseId int, seqId int, tx *gorm.DB) *gorm.DB {
	alias := occurrenceTable.Alias
	return tx.Joins(fmt.Sprintf("LEFT SEMI JOIN (SELECT DISTINCT occurrence_id, case_id, seq_id, task_id FROM %s WHERE deleted = false) note_filter ON note_filter.occurrence_id = %s.%s AND note_filter.task_id = %s.task_id AND note_filter.seq_id = ? AND note_filter.case_id = ?",
		types.OccurrenceNoteTable.TenantQualifiedName(utils.CtxOf(tx)), alias, occurrenceIdColumn, alias), seqId, caseId)
}
