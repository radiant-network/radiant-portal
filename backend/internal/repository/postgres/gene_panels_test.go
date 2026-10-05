package postgres

import (
	"errors"
	"fmt"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

type storedPanelGene struct {
	Code      string
	Name      string
	TypeCode  string
	EnsemblID string
	Symbol    string
}

// genePanelScratchTenant creates a throwaway tenant, so the test owns all the panels it reads.
func genePanelScratchTenant(t *testing.T, pg *gorm.DB) string {
	t.Helper()
	code := fmt.Sprintf("gptest_%d", time.Now().UnixNano())
	require.NoError(t, pg.Exec("INSERT INTO tenant (code, name) VALUES (?, ?)", code, code).Error)
	t.Cleanup(func() {
		pg.Exec("DELETE FROM analysis_catalog WHERE tenant_code = ?", code)
		pg.Exec("DELETE FROM panel_has_genes WHERE panel_id IN (SELECT id FROM panel WHERE tenant_code = ?)", code)
		pg.Exec("DELETE FROM panel WHERE tenant_code = ?", code)
		pg.Exec("DELETE FROM tenant WHERE code = ?", code)
	})
	return code
}

func readTenantPanels(t *testing.T, pg *gorm.DB, tenantCode string) []storedPanelGene {
	t.Helper()
	var rows []storedPanelGene
	require.NoError(t, pg.Raw(`
		SELECT p.code, p.name, p.type_code, COALESCE(g.ensembl_id, '') AS ensembl_id, COALESCE(g.symbol, '') AS symbol
		FROM panel p LEFT JOIN panel_has_genes g ON g.panel_id = p.id
		WHERE p.tenant_code = ?
		ORDER BY p.code, g.ensembl_id`, tenantCode).Scan(&rows).Error)
	return rows
}

func insertPrescriptionPanel(t *testing.T, pg *gorm.DB, tenantCode, code string) {
	t.Helper()
	require.NoError(t, pg.Exec("INSERT INTO panel (code, name, type_code, tenant_code) VALUES (?, ?, 'physical', ?)",
		code, code+" name", tenantCode).Error)
}

var epilepsyPanel = types.GenePanel{Code: "EPI", Name: "Epilepsy", Genes: []types.GenePanelGene{
	{EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
	{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
}}

func Test_ReplaceUploadedGenePanels_CreatesUploadedPanelsWithGenes(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{
			epilepsyPanel,
			{Code: "EMPTY", Name: "No gene matched"},
		}))

		assert.Equal(t, []storedPanelGene{
			{Code: "EMPTY", Name: "No gene matched", TypeCode: "uploaded"},
			{Code: "EPI", Name: "Epilepsy", TypeCode: "uploaded", EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
			{Code: "EPI", Name: "Epilepsy", TypeCode: "uploaded", EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
		}, readTenantPanels(t, env.Postgres, tenant))
	})
}

func Test_ReplaceUploadedGenePanels_SecondUploadRemovesPanelsNotInIt(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{
			epilepsyPanel,
			{Code: "HRT", Name: "Heart", Genes: []types.GenePanelGene{{EnsemblID: "ENSG00000092054", Symbol: "MYH7"}}},
		}))

		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{
			{Code: "HRT", Name: "Heart", Genes: []types.GenePanelGene{{EnsemblID: "ENSG00000118194", Symbol: "TNNT2"}}},
		}))

		assert.Equal(t, []storedPanelGene{
			{Code: "HRT", Name: "Heart", TypeCode: "uploaded", EnsemblID: "ENSG00000118194", Symbol: "TNNT2"},
		}, readTenantPanels(t, env.Postgres, tenant))
	})
}

func Test_ReplaceUploadedGenePanels_SameUploadTwiceGivesSameResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))
		first := readTenantPanels(t, env.Postgres, tenant)

		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))

		assert.Equal(t, first, readTenantPanels(t, env.Postgres, tenant))
	})
}

func Test_ReplaceUploadedGenePanels_KeepsPrescriptionPanels(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		insertPrescriptionPanel(t, env.Postgres, tenant, "PRESC")
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))
		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))

		rows := readTenantPanels(t, env.Postgres, tenant)
		assert.Contains(t, rows, storedPanelGene{Code: "PRESC", Name: "PRESC name", TypeCode: "physical"})
		assert.Len(t, rows, 3)
	})
}

func Test_ReplaceUploadedGenePanels_LeavesOtherTenantsUntouched(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		other := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), other, []types.GenePanel{epilepsyPanel}))

		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{{Code: "HRT", Name: "Heart"}}))

		assert.Len(t, readTenantPanels(t, env.Postgres, other), 2)
	})
}

func Test_ReplaceUploadedGenePanels_CodeOfAPrescriptionPanelIsAConflictAndRollsBack(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		insertPrescriptionPanel(t, env.Postgres, tenant, "PRESC")
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))
		before := readTenantPanels(t, env.Postgres, tenant)

		err := repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{
			{Code: "HRT", Name: "Heart"},
			{Code: "presc", Name: "Clash"},
		})

		var conflict *types.GenePanelConflictError
		require.True(t, errors.As(err, &conflict), "want *GenePanelConflictError, got %v", err)
		assert.Equal(t, `panel_code "presc" is already used by another panel of the tenant`, conflict.Message)
		assert.Equal(t, before, readTenantPanels(t, env.Postgres, tenant), "a failure on panel N keeps the previous panels")
	})
}

func Test_ReplaceUploadedGenePanels_UploadedPanelUsedByAnalysisCatalogIsAConflict(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))
		// The seeded catalog rows set their ids explicitly, so the identity sequence lags behind.
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO analysis_catalog (id, code, name, panel_id, tenant_code)
			SELECT (SELECT MAX(id) + 1 FROM analysis_catalog), 'GPTEST', 'Gene panel test', id, tenant_code
			FROM panel WHERE tenant_code = ? AND code = 'EPI'`,
			tenant).Error)

		err := repo.ReplaceUploadedGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel})

		var conflict *types.GenePanelConflictError
		require.True(t, errors.As(err, &conflict), "want *GenePanelConflictError, got %v", err)
		assert.Equal(t, "an uploaded gene panel is used by the analysis catalog", conflict.Message)
	})
}
