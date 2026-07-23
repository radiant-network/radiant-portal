package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// createTestCase inserts a minimal, valid case row under the given id (reusing existing
// seed project/analysis_catalog/proband ids) so clinical-child delete-by-case-id tests have
// a case to satisfy the FK on case_id, and registers its cleanup. The case repository is
// dual-purpose (still in the root repository package) and takes a raw *gorm.DB.
func createTestCase(t *testing.T, db *gorm.DB, id int) {
	t.Helper()
	repo := repository.NewCasesRepository(db)
	orgCode := "CQGC"
	require.NoError(t, repo.CreateCase(t.Context(), &types.Case{
		ID:                       id,
		ProbandID:                1,
		ProjectID:                1,
		StatusCode:               "in_progress",
		AnalysisCatalogID:        1,
		CaseTypeCode:             "germline",
		CaseCategoryCode:         "postnatal",
		OrderingOrganizationCode: &orgCode,
		DiagnosisLabCode:         &orgCode,
		TenantCode:               types.DefaultTenantCode,
	}))
	t.Cleanup(func() { db.Exec("DELETE FROM cases WHERE id = ?", id) })
}
