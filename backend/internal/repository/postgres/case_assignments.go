package postgres

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type CaseAssignmentsRepository struct {
	db *gorm.DB
}

func NewCaseAssignmentsRepository(db database.PostgresDB) *CaseAssignmentsRepository {
	return &CaseAssignmentsRepository{db: db.DB}
}

// caseAssignee carries one row of the join: the assignee, plus the case it attaches them to so
// the caller can bucket a whole page in a single query.
type caseAssignee struct {
	CaseID int
	types.CaseAssignee
}

// ListForCases returns the assignees of each case given, keyed by case id. A case with no
// assignee is absent from the map; it is the caller that decides how an empty assignment renders.
//
// The join to users is inner: an assignment whose user vanished from the registry has no identity
// to display, and the foreign key means it cannot happen short of a manual delete.
func (r *CaseAssignmentsRepository) ListForCases(ctx context.Context, caseIDs []int) (map[int][]types.CaseAssignee, error) {
	byCase := map[int][]types.CaseAssignee{}
	if len(caseIDs) == 0 {
		return byCase, nil
	}

	alias := types.CaseAssignmentTable.Alias
	var rows []caseAssignee
	tx := r.db.WithContext(ctx).
		Table(fmt.Sprintf("%s %s", types.CaseAssignmentTable.Name, alias)).
		Joins(fmt.Sprintf("JOIN users u ON u.user_id = %s.user_id", alias)).
		Scopes(WithTenantOn(ctx, alias)).
		Where(fmt.Sprintf("%s.case_id IN ?", alias), caseIDs).
		Select(fmt.Sprintf("%s.case_id, u.user_id, u.first_name, u.last_name, u.email", alias)).
		// user_id breaks ties so an avatar stack keeps the same order between two reads.
		Order("u.last_name, u.first_name, u.user_id")
	if err := tx.Scan(&rows).Error; err != nil {
		return nil, fmt.Errorf("error listing case assignments: %w", err)
	}

	for _, row := range rows {
		byCase[row.CaseID] = append(byCase[row.CaseID], row.CaseAssignee)
	}
	return byCase, nil
}
