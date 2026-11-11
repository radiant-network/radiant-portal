package main

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/radiant-network/radiant-api/internal/repository/starrocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestParseViewOfTheGeneratedViews(t *testing.T) {
	stmts, err := starrocks.BuildViewStatements(sampleTenant, map[string][]string{
		"cases":   {"id", "tenant_code", "status_code"},
		"patient": {"id", "organization_code", "tenant_code"},
	})
	require.NoError(t, err)
	got := map[string][]string{}
	for _, stmt := range stmts[1:] {
		v, err := parseView(stmt)
		require.NoError(t, err)
		got[v.Name] = v.Columns
	}
	assert.Equal(t, []string{"id", "tenant_code", "status_code"}, got["cases"])
	// patient.sql.tmpl adds a computed column after the federated ones.
	assert.Equal(t, []string{"id", "organization_code", "tenant_code", "can_read_pii"}, got["patient"])
}

func TestParseViewOfTheGenePanelMV(t *testing.T) {
	stmt, err := starrocks.BuildGenePanelMVStatement(sampleTenant)
	require.NoError(t, err)
	v, err := parseView(stmt)
	require.NoError(t, err)
	assert.Equal(t, View{Name: "gene_panel_mv", Columns: []string{"panel", "symbol"}}, v)
}

func TestParseViewStarRocksSyntax(t *testing.T) {
	v, err := parseView(`/* doc, with a comma */
CREATE OR REPLACE VIEW t_tenant.v_x AS
SELECT p.id, -- the id, FROM nowhere
       CAST(substr(d.dob, 1, 4) AS INT) AS birth_year,
       array_filter(x -> x > 0, d.vals) AS vals,
       (SELECT max(y) FROM radiant_jdbc.public.z WHERE z.id = p.id) AS latest,
       'a,b' AS literal
FROM radiant_jdbc.public.patient p JOIN t_tenant.d d ON d.id = p.id`)
	require.NoError(t, err)
	assert.Equal(t, View{Name: "v_x", Columns: []string{"id", "birth_year", "vals", "latest", "literal"}}, v)
}

func TestParseViewRejectsAnUnnamedItem(t *testing.T) {
	_, err := parseView("CREATE VIEW v AS SELECT count(*) FROM t")
	assert.ErrorContains(t, err, "give it an alias")
}

func TestLogicalType(t *testing.T) {
	for pg, want := range map[string]string{
		"integer": "integer", "bigint": "integer", "numeric": "number", "boolean": "boolean",
		"timestamp with time zone": "timestamp", "date": "date", "text": "string",
		"character varying": "string", "text[]": "array",
	} {
		assert.Equal(t, want, logicalType(pg), pg)
	}
}

func testContracts() []Contract {
	pg := map[string]string{"id": "integer", "status_code": "text"}
	return []Contract{
		newContract(View{Name: "cases", Columns: []string{"id", "status_code", "note"}}, "view", "", "", pg),
		newContract(View{Name: "sex", Columns: []string{"code"}}, "view", "", "", nil),
	}
}

func writeContract(t *testing.T, dir, name, body string) {
	t.Helper()
	d := filepath.Join(dir, "starrocks", "tenant")
	require.NoError(t, os.MkdirAll(d, 0o755))
	require.NoError(t, os.WriteFile(filepath.Join(d, name+".odcs.yaml"), []byte(body), 0o644))
}

func TestScaffoldNeverOverwritesAContract(t *testing.T) {
	dir := t.TempDir()
	writeContract(t, dir, "cases", "hand-edited\n")
	written, kept, err := scaffold(dir, testContracts(), nil)
	require.NoError(t, err)
	assert.Equal(t, []string{"sex"}, written)
	assert.Equal(t, []string{"cases"}, kept)
	raw, err := os.ReadFile(filepath.Join(dir, "starrocks", "tenant", "cases.odcs.yaml"))
	require.NoError(t, err)
	assert.Equal(t, "hand-edited\n", string(raw))

	_, _, err = scaffold(dir, testContracts(), []string{"nope"})
	assert.ErrorContains(t, err, "no such view")
}

func TestCheckAContractIsASubsetOfItsView(t *testing.T) {
	dir := t.TempDir()
	// note is left out (not published); descriptions and list values are hand-edited extras.
	writeContract(t, dir, "cases", `schema:
  - name: cases
    properties:
      - name: id
        logicalType: integer
        description: Case id.
      - name: status_code
        customProperties:
          - property: consumers
            value: [mcp/radiant_mcp/queries/hits.py]
`)
	problems, unpublished, err := check(dir, testContracts())
	require.NoError(t, err)
	assert.Empty(t, problems)
	assert.Equal(t, []string{"sex"}, unpublished)
}

func TestCheckReportsWhatTheViewDoesNotHave(t *testing.T) {
	dir := t.TempDir()
	writeContract(t, dir, "cases", `schema:
  - name: cases
    properties:
      - name: id
        logicalType: string
      - name: closed_at
`)
	writeContract(t, dir, "gone", "schema:\n  - name: gone\n    properties: []\n")
	problems, _, err := check(dir, testContracts())
	require.NoError(t, err)
	assert.ElementsMatch(t, []string{
		"cases.id: logicalType string in the contract, integer in the view",
		"cases.closed_at: in the contract, not in the view",
		"gone: the portal creates no such view (dropped or renamed?)",
	}, problems)
}
