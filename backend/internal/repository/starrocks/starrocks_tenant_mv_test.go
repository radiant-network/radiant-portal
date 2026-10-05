package starrocks

import (
	"fmt"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

type panelSymbol struct {
	Panel  string
	Symbol string
}

// mvScratchTenant creates a throwaway tenant in Postgres, so the MV rows are only the test's
// own panels. Its StarRocks database is left behind: the test connection cannot DROP.
func mvScratchTenant(t *testing.T, pg *gorm.DB) string {
	t.Helper()
	code := fmt.Sprintf("mvtest_%d", time.Now().UnixNano())
	require.NoError(t, pg.Exec("INSERT INTO tenant (code, name) VALUES (?, ?)", code, code).Error)
	t.Cleanup(func() {
		pg.Exec("DELETE FROM panel_has_genes WHERE panel_id IN (SELECT id FROM panel WHERE tenant_code = ?)", code)
		pg.Exec("DELETE FROM panel WHERE tenant_code = ?", code)
		pg.Exec("DELETE FROM tenant WHERE code = ?", code)
	})
	return code
}

func insertPanel(t *testing.T, pg *gorm.DB, tenantCode, code, name string, genes map[string]string) {
	t.Helper()
	var id int
	require.NoError(t, pg.Raw("INSERT INTO panel (code, name, type_code, tenant_code) VALUES (?, ?, 'virtual', ?) RETURNING id",
		code, name, tenantCode).Scan(&id).Error)
	for ensemblID, symbol := range genes {
		require.NoError(t, pg.Exec("INSERT INTO panel_has_genes (panel_id, ensembl_id, symbol) VALUES (?, ?, ?)",
			id, ensemblID, symbol).Error)
	}
}

func readGenePanelMV(t *testing.T, sr *gorm.DB, tenantCode string) []panelSymbol {
	t.Helper()
	var rows []panelSymbol
	require.NoError(t, sr.Raw(fmt.Sprintf("SELECT panel, symbol FROM `%s_tenant`.`gene_panel_mv` ORDER BY panel, symbol", tenantCode)).
		Scan(&rows).Error)
	return rows
}

func Test_EnsureGenePanelMV_LoadsTenantPanelsAtCreation(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		code := mvScratchTenant(t, env.Postgres)
		insertPanel(t, env.Postgres, code, "EPI", "Epilepsy", map[string]string{"ENSG01": "SCN1A", "ENSG02": "KCNQ2"})
		repo := NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks})
		require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s_tenant`", code)).Error)

		require.NoError(t, repo.EnsureGenePanelMV(t.Context(), code))

		assert.Equal(t, []panelSymbol{{"Epilepsy", "KCNQ2"}, {"Epilepsy", "SCN1A"}}, readGenePanelMV(t, env.Starrocks, code))
	})
}

func Test_EnsureGenePanelMV_ExcludesOtherTenantsPanels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		code := mvScratchTenant(t, env.Postgres)
		other := mvScratchTenant(t, env.Postgres)
		insertPanel(t, env.Postgres, code, "EPI", "Epilepsy", map[string]string{"ENSG01": "SCN1A"})
		insertPanel(t, env.Postgres, other, "HRT", "Heart", map[string]string{"ENSG03": "MYH7"})
		repo := NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks})
		require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s_tenant`", code)).Error)

		require.NoError(t, repo.EnsureGenePanelMV(t.Context(), code))

		assert.Equal(t, []panelSymbol{{"Epilepsy", "SCN1A"}}, readGenePanelMV(t, env.Starrocks, code))
	})
}

func Test_EnsureGenePanelMV_DeduplicatesSymbolsSharedByTwoEnsemblIDs(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		code := mvScratchTenant(t, env.Postgres)
		insertPanel(t, env.Postgres, code, "EPI", "Epilepsy", map[string]string{"ENSG01": "SCN1A", "ENSG99": "SCN1A"})
		repo := NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks})
		require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s_tenant`", code)).Error)

		require.NoError(t, repo.EnsureGenePanelMV(t.Context(), code))

		assert.Equal(t, []panelSymbol{{"Epilepsy", "SCN1A"}}, readGenePanelMV(t, env.Starrocks, code))
	})
}

func Test_EnsureGenePanelMV_IsIdempotent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		code := mvScratchTenant(t, env.Postgres)
		repo := NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks})
		require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s_tenant`", code)).Error)

		require.NoError(t, repo.EnsureGenePanelMV(t.Context(), code))
		require.NoError(t, repo.EnsureGenePanelMV(t.Context(), code), "a second create must be a no-op")
	})
}

func Test_RefreshGenePanelMV_ReflectsPostgresWritesSinceCreation(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		code := mvScratchTenant(t, env.Postgres)
		insertPanel(t, env.Postgres, code, "EPI", "Epilepsy", map[string]string{"ENSG01": "SCN1A"})
		repo := NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks})
		require.NoError(t, env.Starrocks.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s_tenant`", code)).Error)
		require.NoError(t, repo.EnsureGenePanelMV(t.Context(), code))

		require.NoError(t, env.Postgres.Exec("DELETE FROM panel_has_genes WHERE panel_id IN (SELECT id FROM panel WHERE tenant_code = ?)", code).Error)
		require.NoError(t, env.Postgres.Exec("DELETE FROM panel WHERE tenant_code = ?", code).Error)
		insertPanel(t, env.Postgres, code, "HRT", "Heart", map[string]string{"ENSG03": "MYH7"})

		require.NoError(t, repo.RefreshGenePanelMV(t.Context(), code))

		assert.Equal(t, []panelSymbol{{"Heart", "MYH7"}}, readGenePanelMV(t, env.Starrocks, code),
			"the sync refresh returns only after the MV holds the new panels")
	})
}

func Test_RefreshGenePanelMV_FailsWhenMVIsMissing(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewStarrocksTenantRepository(database.StarrocksDB{DB: env.Starrocks})

		err := repo.RefreshGenePanelMV(t.Context(), "nomv_tenant_code")

		assert.Error(t, err)
	})
}
