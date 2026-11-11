package postgres

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
func (r *CaseAssignmentsRepository) EligibleAssignees(ctx context.Context, tenantCode, orgCode, callerID string, query types.ListAssignmentCandidatesQuery) ([]types.CaseAssignee, error) {
	candidates := []types.CaseAssignee{}
	// The caller sorts first when they are eligible, so "assign it to me" is the top row. Done
	// in SQL rather than by reordering the result: the list is paginated, and a caller whose
	// name falls past the page limit would otherwise be missing from the first page entirely
	// instead of leading it. user_id breaks the remaining ties so a page stays stable across
	// limit/offset calls.
	tx := eligibleAt(r.db.WithContext(ctx), tenantCode, orgCode).
		Select("u.user_id, u.first_name, u.last_name, u.email").
		Order(clause.OrderBy{Expression: clause.Expr{
			SQL:  "CASE WHEN u.user_id = ? THEN 0 ELSE 1 END, u.last_name, u.first_name, u.user_id",
			Vars: []any{callerID},
		}})
	tx = withNameOrEmailSearch(tx, query.Search)
	utils.AddPagination(tx, query.Pagination)

	if err := tx.Scan(&candidates).Error; err != nil {
		return nil, fmt.Errorf("error listing assignment candidates at %q: %w", orgCode, err)
	}
	return candidates, nil
}

// eligibleAt narrows `users u` to the accounts that may be assigned a case at orgCode. It backs
// both the picker and the check run when an assignment is written, so the two can never
// disagree about who is eligible.
func eligibleAt(tx *gorm.DB, tenantCode, orgCode string) *gorm.DB {
	return tx.
		Table("users u").
		Where(personalAccount).
		Where(`EXISTS (
			SELECT 1
			FROM user_role ur
			JOIN role_action ra ON ra.tenant_code = ur.tenant_code AND ra.role_code = ur.role_code
			WHERE ur.user_id = u.user_id AND ur.tenant_code = ?
			  AND (ur.org_code = ? OR ur.org_code = ?) AND ra.action_code = ?
		)`, tenantCode, orgCode, types.WildcardOrg, types.ActionInterpretVariant)
}

// eligibleAssigneeIDs returns which of the given users may be assigned a case at orgCode. The
// caller compares it against what it asked for: whoever is missing is either unknown to the
// registry or not eligible there, and the distinction does not change the answer.
func eligibleAssigneeIDs(tx *gorm.DB, tenantCode, orgCode string, userIDs []string) ([]string, error) {
	eligible := []string{}
	if len(userIDs) == 0 {
		return eligible, nil
	}
	query := eligibleAt(tx, tenantCode, orgCode).
		Where("u.user_id IN ?", userIDs).
		Select("u.user_id")
	if err := query.Scan(&eligible).Error; err != nil {
		return nil, fmt.Errorf("error checking assignment eligibility at %q: %w", orgCode, err)
	}
	return eligible, nil
}

// ReplaceAssignees sets the case's assignees to the eligible members of userIDs. It is the whole
// operation — read, decide, write — in one transaction that opens by locking the case, so two
// concurrent callers cannot each decide against a set the other has already replaced, and a
// reader never sees the case half-reassigned. The transaction alone would not be enough: see
// lockCaseDiagnosisLab for why the lock is what serializes them.
//
// It returns types.ErrCaseNotFound when the tenant holds no such case, and
// *types.IneligibleAssigneesError when the request names someone who is neither eligible nor
// already assigned. See types.ClassifyAssignees for what happens to each requested user. The
// stored set is therefore not always the requested one, so a caller that needs to display it
// reads it back through ListForCases.
func (r *CaseAssignmentsRepository) ReplaceAssignees(ctx context.Context, tenantCode string, caseID int, userIDs []string) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		orgCode, err := lockCaseDiagnosisLab(tx, tenantCode, caseID)
		if err != nil {
			return err
		}

		current, err := assignedIDs(tx, tenantCode, caseID)
		if err != nil {
			return err
		}
		eligible, err := eligibleAssigneeIDs(tx, tenantCode, orgCode, userIDs)
		if err != nil {
			return err
		}

		keep, rejected := types.ClassifyAssignees(userIDs, eligible, current)
		if len(rejected) > 0 {
			return &types.IneligibleAssigneesError{OrgCode: orgCode, UserIDs: rejected}
		}
		return writeAssignees(tx, tenantCode, caseID, keep)
	})
}

func assignedIDs(tx *gorm.DB, tenantCode string, caseID int) ([]string, error) {
	userIDs := []string{}
	err := tx.Table(types.CaseAssignmentTable.Name).
		Where("case_id = ? AND tenant_code = ?", caseID, tenantCode).
		Pluck("user_id", &userIDs).Error
	if err != nil {
		return nil, fmt.Errorf("error reading assignees of case %d: %w", caseID, err)
	}
	return userIDs, nil
}

// writeAssignees persists an already-decided set: it makes userIDs the case's complete list of
// assignees. Eligibility is settled by the time it is called — that is ReplaceAssignees' job —
// so this one asks no questions about who is in the set.
func writeAssignees(tx *gorm.DB, tenantCode string, caseID int, userIDs []string) error {
	remove := tx.Where("case_id = ? AND tenant_code = ?", caseID, tenantCode)
	if len(userIDs) > 0 {
		remove = remove.Where("user_id NOT IN ?", userIDs)
	}
	if err := remove.Delete(&types.CaseAssignment{}).Error; err != nil {
		return fmt.Errorf("error clearing assignees of case %d: %w", caseID, err)
	}
	if len(userIDs) == 0 {
		return nil
	}

	assignments := make([]types.CaseAssignment, len(userIDs))
	for i, userID := range userIDs {
		assignments[i] = types.CaseAssignment{CaseID: caseID, UserID: userID, TenantCode: tenantCode}
	}
	// The rows already there are exactly the ones the delete above kept, so re-inserting them is
	// a no-op rather than a conflict to resolve.
	if err := tx.Clauses(clause.OnConflict{DoNothing: true}).Create(&assignments).Error; err != nil {
		return fmt.Errorf("error assigning case %d: %w", caseID, err)
	}
	return nil
}
