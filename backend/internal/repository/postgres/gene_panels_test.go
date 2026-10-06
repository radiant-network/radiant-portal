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

// insertPrescriptionPanel adds an analysis catalog style panel (type physical) with one gene.
func insertPrescriptionPanel(t *testing.T, pg *gorm.DB, tenantCode, code string) {
	t.Helper()
	var id int
	require.NoError(t, pg.Raw("INSERT INTO panel (code, name, type_code, tenant_code) VALUES (?, ?, 'physical', ?) RETURNING id",
		code, code+" name", tenantCode).Scan(&id).Error)
	require.NoError(t, pg.Exec("INSERT INTO panel_has_genes (panel_id, ensembl_id, symbol) VALUES (?, 'ENSG00000092054', 'MYH7')", id).Error)
}

var epilepsyPanel = types.GenePanel{Code: "EPILEP", Name: "EPILEP", Genes: []types.GenePanelGene{
	{EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
	{EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
}}

var heartPanel = types.GenePanel{Code: "HRT", Name: "HRT", Genes: []types.GenePanelGene{
	{EnsemblID: "ENSG00000118194", Symbol: "TNNT2"},
}}

func Test_ReplaceGenePanels_CreatesNewCodesAsUploadedPanelsNamedByCode(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel, {Code: "EMPTY", Name: "EMPTY"}}))

		assert.Equal(t, []storedPanelGene{
			{Code: "EMPTY", Name: "EMPTY", TypeCode: "uploaded"},
			{Code: "EPILEP", Name: "EPILEP", TypeCode: "uploaded", EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
			{Code: "EPILEP", Name: "EPILEP", TypeCode: "uploaded", EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
		}, readTenantPanels(t, env.Postgres, tenant))
	})
}

func Test_ReplaceGenePanels_FillsTheGenesOfAnExistingPanelAndKeepsItsRow(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		insertPrescriptionPanel(t, env.Postgres, tenant, "EPILEP")
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{
			{Code: "epilep", Name: "epilep", Genes: epilepsyPanel.Genes},
		}))

		assert.Equal(t, []storedPanelGene{
			{Code: "EPILEP", Name: "EPILEP name", TypeCode: "physical", EnsemblID: "ENSG00000075043", Symbol: "KCNQ2"},
			{Code: "EPILEP", Name: "EPILEP name", TypeCode: "physical", EnsemblID: "ENSG00000144285", Symbol: "SCN1A"},
		}, readTenantPanels(t, env.Postgres, tenant), "same code in any case: name and type kept, genes replaced")
	})
}

func Test_ReplaceGenePanels_SecondUploadRemovesUploadedPanelsMissingFromIt(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel, heartPanel}))

		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{
			{Code: "HRT", Name: "HRT", Genes: []types.GenePanelGene{{EnsemblID: "ENSG00000092054", Symbol: "MYH7"}}},
		}))

		assert.Equal(t, []storedPanelGene{
			{Code: "HRT", Name: "HRT", TypeCode: "uploaded", EnsemblID: "ENSG00000092054", Symbol: "MYH7"},
		}, readTenantPanels(t, env.Postgres, tenant))
	})
}

func Test_ReplaceGenePanels_ClearsTheGenesOfAPrescriptionPanelMissingFromTheFile(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		insertPrescriptionPanel(t, env.Postgres, tenant, "PRESC")
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})

		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{heartPanel}))

		assert.Equal(t, []storedPanelGene{
			{Code: "HRT", Name: "HRT", TypeCode: "uploaded", EnsemblID: "ENSG00000118194", Symbol: "TNNT2"},
			{Code: "PRESC", Name: "PRESC name", TypeCode: "physical"},
		}, readTenantPanels(t, env.Postgres, tenant), "the catalog panel stays, with no gene")
	})
}

func Test_ReplaceGenePanels_SameUploadTwiceGivesSameResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		insertPrescriptionPanel(t, env.Postgres, tenant, "EPILEP")
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel, heartPanel}))
		first := readTenantPanels(t, env.Postgres, tenant)

		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel, heartPanel}))

		assert.Equal(t, first, readTenantPanels(t, env.Postgres, tenant))
	})
}

func Test_ReplaceGenePanels_LeavesOtherTenantsUntouched(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		other := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceGenePanels(t.Context(), other, []types.GenePanel{epilepsyPanel}))

		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{
			{Code: "EPILEP", Name: "EPILEP", Genes: heartPanel.Genes},
		}))

		assert.Len(t, readTenantPanels(t, env.Postgres, other), 2, "same code in another tenant is another panel")
	})
}

func Test_ReplaceGenePanels_UploadedPanelUsedByAnalysisCatalogIsAConflictAndRollsBack(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel, heartPanel}))
		// The seeded catalog rows set their ids explicitly, so the identity sequence lags behind.
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO analysis_catalog (id, code, name, panel_id, tenant_code)
			SELECT (SELECT MAX(id) + 1 FROM analysis_catalog), 'GPTEST', 'Gene panel test', id, tenant_code
			FROM panel WHERE tenant_code = ? AND code = 'EPILEP'`,
			tenant).Error)
		before := readTenantPanels(t, env.Postgres, tenant)

		err := repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{
			{Code: "HRT", Name: "HRT", Genes: epilepsyPanel.Genes},
		})

		var conflict *types.GenePanelConflictError
		require.True(t, errors.As(err, &conflict), "want *GenePanelConflictError, got %v", err)
		assert.Equal(t, "an uploaded panel missing from the file is used by the analysis catalog", conflict.Message)
		assert.Equal(t, before, readTenantPanels(t, env.Postgres, tenant), "a failure keeps the previous panels")
	})
}

func Test_ReplaceGenePanels_KeepingTheCatalogPanelInTheFileIsAccepted(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		tenant := genePanelScratchTenant(t, env.Postgres)
		repo := NewGenePanelsRepository(database.PostgresDB{DB: env.Postgres})
		require.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}))
		require.NoError(t, env.Postgres.Exec(`
			INSERT INTO analysis_catalog (id, code, name, panel_id, tenant_code)
			SELECT (SELECT MAX(id) + 1 FROM analysis_catalog), 'GPTEST', 'Gene panel test', id, tenant_code
			FROM panel WHERE tenant_code = ? AND code = 'EPILEP'`,
			tenant).Error)

		assert.NoError(t, repo.ReplaceGenePanels(t.Context(), tenant, []types.GenePanel{epilepsyPanel}),
			"the panel keeps its id, so the catalog link holds")
	})
}
