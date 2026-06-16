package repository

import (
	"slices"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func testColumns() map[string][]string {
	cols := map[string][]string{}
	for _, t := range ViewTables {
		cols[t] = []string{"id", "tenant_code"}
	}
	cols["patient"] = []string{"id", "organization_code"} // can_read_pii references organization_code
	return cols
}

// --- ViewTables --------------------------------------------------------------

func Test_ViewTables_IncludesPatientAndExcludesNonFederatedTables(t *testing.T) {
	assert.True(t, slices.Contains(ViewTables, "patient"), "patient must get a view")
	assert.False(t, slices.Contains(ViewTables, "batch"), "batch is tenant-scoped but not federated")
	assert.False(t, slices.Contains(ViewTables, "user_set"), "user_set is tenant-scoped but not federated")
}

// --- template registry (loadViewTemplates) -----------------------------------

func Test_ViewTemplates_RegistersOnlyTmplFilesKeyedByTable(t *testing.T) {
	_, ok := viewTemplates["patient"]
	assert.True(t, ok, "patient.sql.tmpl should be registered under its table name")

	_, ok = viewTemplates["auth_pii_grant"]
	assert.False(t, ok, "auth_pii_grant.sql is not a .sql.tmpl and must not be a view template")

	_, ok = viewTemplates["cases"]
	assert.False(t, ok, "a table with no .sql.tmpl has no template (uses the generated SELECT)")
}

// --- BuildAuthStatements -----------------------------------------------------

func Test_BuildAuthStatements_CreatesAuthDbThenReplacesPiiGrant(t *testing.T) {
	stmts := BuildAuthStatements()
	require.Len(t, stmts, 2)
	assert.Contains(t, stmts[0], "CREATE DATABASE IF NOT EXISTS auth")
	assert.Contains(t, stmts[1], "CREATE OR REPLACE VIEW auth.pii_grant")
}

// --- BuildViewStatements: database -------------------------------------------

func Test_BuildViewStatements_FirstStatementCreatesTenantDatabaseWithSuffix(t *testing.T) {
	stmts, err := BuildViewStatements("demo", testColumns())
	require.NoError(t, err)
	require.NotEmpty(t, stmts)
	assert.Equal(t, "CREATE DATABASE IF NOT EXISTS `demo_tenant`", stmts[0])
}

func Test_BuildViewStatements_EmptyColumns_OnlyCreatesDatabase(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{})
	require.NoError(t, err)
	assert.Equal(t, []string{"CREATE DATABASE IF NOT EXISTS `demo_tenant`"}, stmts,
		"no columns for any table → just the database, no views")
}

// --- BuildViewStatements: templated path (patient) ---------------------------

func Test_BuildViewStatements_PatientUsesTemplateWithMaskingAndTenantFilter(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{"patient": {"id", "organization_code"}})
	require.NoError(t, err)
	joined := strings.Join(stmts, "\n")

	assert.Contains(t, joined, "CREATE OR REPLACE VIEW `demo_tenant`.`patient` AS")
	assert.Contains(t, joined, "SELECT `id`, `organization_code`,")
	assert.Contains(t, joined, "AS can_read_pii", "patient view exposes the masking flag")
	assert.Contains(t, joined, "g.tenant_code = 'demo'", "mask subquery scoped to the tenant")
	assert.Contains(t, joined, "FROM radiant_jdbc.public.patient")
	assert.Contains(t, joined, "WHERE tenant_code = 'demo'")
}

// --- BuildViewStatements: generic path ---------------------------------------

func Test_BuildViewStatements_GenericTableProjectsColumnsWithoutMasking(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{"cases": {"id", "submitter_case_id"}})
	require.NoError(t, err)
	joined := strings.Join(stmts, "\n")

	assert.NotContains(t, joined, "SELECT *", "must not SELECT * (unfederatable columns break it)")
	assert.Contains(t, joined,
		"CREATE OR REPLACE VIEW `demo_tenant`.`cases` AS SELECT `id`, `submitter_case_id` FROM radiant_jdbc.public.`cases` WHERE tenant_code = 'demo'")
	assert.NotContains(t, joined, "can_read_pii", "only the patient template carries the mask flag")
}

func Test_BuildViewStatements_BacktickQuotesEveryColumn(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{"cases": {"id", "status_code"}})
	require.NoError(t, err)
	assert.Contains(t, strings.Join(stmts, "\n"), "SELECT `id`, `status_code`")
}

func Test_BuildViewStatements_FiltersByBareTenantCodeNotDatabaseName(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{"cases": {"id"}})
	require.NoError(t, err)
	joined := strings.Join(stmts, "\n")
	assert.Contains(t, joined, "WHERE tenant_code = 'demo'")
	assert.NotContains(t, joined, "tenant_code = 'demo_tenant'", "filter uses the tenant code, not the db name")
}

// --- BuildViewStatements: table selection ------------------------------------

func Test_BuildViewStatements_SkipsTablesWithNoColumns(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{"cases": {"id"}})
	require.NoError(t, err)
	assert.NotContains(t, strings.Join(stmts, "\n"), "`demo_tenant`.`occurrence_note`",
		"a table absent from the columns map gets no view")
}

func Test_BuildViewStatements_IgnoresColumnsForTablesNotInViewTables(t *testing.T) {
	stmts, err := BuildViewStatements("demo", map[string][]string{"batch": {"id", "status"}})
	require.NoError(t, err)
	assert.NotContains(t, strings.Join(stmts, "\n"), "`batch`",
		"batch is not in ViewTables; no view even if columns are provided")
}

func Test_BuildViewStatements_CoversEveryViewTable(t *testing.T) {
	stmts, err := BuildViewStatements("demo", testColumns())
	require.NoError(t, err)
	joined := strings.Join(stmts, "\n")
	for _, table := range ViewTables {
		assert.Contains(t, joined, "CREATE OR REPLACE VIEW `demo_tenant`.`"+table+"`", "missing view for %q", table)
	}
}

// --- BuildViewStatements: idempotency & validation ---------------------------

func Test_BuildViewStatements_ViewsAreCreateOrReplaceWithNoDrop(t *testing.T) {
	stmts, err := BuildViewStatements("demo", testColumns())
	require.NoError(t, err)
	for _, s := range stmts {
		assert.NotContains(t, s, "DROP VIEW", "views are CREATE OR REPLACE; no DROP step")
		if strings.Contains(s, " VIEW ") {
			assert.Contains(t, s, "CREATE OR REPLACE VIEW", "every view is idempotent via CREATE OR REPLACE: %q", s)
		}
	}
}

func Test_BuildViewStatements_AcceptsValidCodeWithUnderscoreAndDigits(t *testing.T) {
	stmts, err := BuildViewStatements("tenant_a1", map[string][]string{"cases": {"id"}})
	require.NoError(t, err)
	assert.Equal(t, "CREATE DATABASE IF NOT EXISTS `tenant_a1_tenant`", stmts[0])
}

func Test_BuildViewStatements_RejectsInvalidTenantCode(t *testing.T) {
	for _, code := range []string{"", "Demo", "a.b", "te nant", "x'; DROP DATABASE y; --"} {
		_, err := BuildViewStatements(code, testColumns())
		assert.Error(t, err, "expected error for invalid tenant code %q", code)
	}
}
