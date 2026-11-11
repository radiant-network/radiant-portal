package server

import (
	"cmp"
	"context"
	"log/slog"
	"maps"
	"slices"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

type caseStatusChangeAuthorizer interface {
	actionChecker
	DiagnosisLabForCases(ctx context.Context, tenantCode string, caseIDs []int) (map[int]string, error)
}

// caseStatusChangeAction is the action a status change needs at its case's lab: a change that
// sets or leaves a system status is the pipeline's to make, any other is a geneticist's.
func caseStatusChangeAction(change types.CaseStatusChange) string {
	if types.IsSystemCaseStatusChange(change) {
		return types.ActionIngestData
	}
	return types.ActionEditCase
}

// RequireCaseStatusChangeActions gates PATCH /cases/status change by change: each one needs its
// own action at the diagnosis lab of its case, and a single missing grant refuses the whole
// request. A payload that names no case, or a case the tenant does not hold, is refused with the
// same generic 403, so the gate never reveals whether a case exists.
func RequireCaseStatusChangeActions(auth utils.Auth, repo caseStatusChangeAuthorizer) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			c.Abort()
			return
		}
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}

		deny := func(reason string, attrs ...any) {
			slog.WarnContext(c.Request.Context(), "forbidden: "+reason,
				append([]any{slog.String("user_id", *userID), slog.String("tenant", *tenant)}, attrs...)...)
			HandleForbiddenError(c)
			c.Abort()
		}

		// Binding through ShouldBindBodyWithJSON caches the body, so the handler binds it again.
		var body types.CasesStatusRequest
		if err := c.ShouldBindBodyWithJSON(&body); err != nil || len(body.Cases) == 0 {
			deny("case status request names no case")
			return
		}
		caseIDs := make([]int, 0, len(body.Cases))
		for _, change := range body.Cases {
			if change.CaseID == 0 {
				deny("case status change names no case")
				return
			}
			caseIDs = append(caseIDs, change.CaseID)
		}

		labs, err := repo.DiagnosisLabForCases(c.Request.Context(), *tenant, caseIDs)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}

		required := map[[2]string]bool{}
		for _, change := range body.Cases {
			lab, found := labs[change.CaseID]
			if !found {
				deny("case status change on a case the tenant does not hold", slog.Int("case_id", change.CaseID))
				return
			}
			required[[2]string{lab, caseStatusChangeAction(change)}] = true
		}

		for _, need := range slices.SortedFunc(maps.Keys(required), func(a, b [2]string) int {
			return cmp.Or(cmp.Compare(a[0], b[0]), cmp.Compare(a[1], b[1]))
		}) {
			allowed, err := repo.HasAction(c.Request.Context(), *userID, *tenant, need[0], need[1])
			if err != nil {
				HandleError(c, err)
				c.Abort()
				return
			}
			if !allowed {
				deny("caller lacks the action a case status change needs", slog.String("org", need[0]), slog.String("action", need[1]))
				return
			}
		}

		c.Set(OrgContextKey, slices.Compact(slices.Sorted(maps.Values(labs))))
		c.Next()
	}
}
