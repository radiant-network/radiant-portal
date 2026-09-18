package postgres

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
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

// EligibleAssignees returns the users who may be assigned a case at orgCode: those holding
// can_interpret_variant there, either by a grant at that organization or by the '*' wildcard.
// A tenant-wide grant (org_code NULL) does not qualify — it carries no organization, which is
// also why GetMemberships drops org-scoped actions on such a grant.
//
// Being assigned a case means being expected to interpret it, so the permission to do that is
// the rule; it is deliberately not the same action as the one gating who may *make* the
// assignment (can_edit_case).
//
// EXISTS rather than a join, so one line per user is structural instead of something DISTINCT
// has to repair afterwards.
func (r *CaseAssignmentsRepository) EligibleAssignees(ctx context.Context, tenantCode, orgCode string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error) {
	candidates := []types.CaseAssignee{}
	tx := r.db.WithContext(ctx).
		Table("users u").
		Where(personalAccount).
		Where(`EXISTS (
			SELECT 1
			FROM user_role ur
			JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
			WHERE ur.user_id = u.user_id AND ur.tenant_code = ?
			  AND (ur.org_code = ? OR ur.org_code = ?) AND ra.action_code = ?
		)`, tenantCode, orgCode, types.WildcardOrg, types.ActionInterpretVariant).
		Select("u.user_id, u.first_name, u.last_name, u.email").
		// user_id breaks ties so a page stays stable across limit/offset calls.
		Order("u.last_name, u.first_name, u.user_id")
	tx = withNameOrEmailSearch(tx, query.Search)
	utils.AddPagination(tx, query.Pagination)

	if err := tx.Scan(&candidates).Error; err != nil {
		return nil, fmt.Errorf("error listing assignment candidates at %q: %w", orgCode, err)
	}
	return candidates, nil
}
