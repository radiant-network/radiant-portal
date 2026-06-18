package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeColumnSource struct {
	cols map[string][]string
	err  error
}

func (f fakeColumnSource) FederatableColumnsForViews(ctx context.Context) (map[string][]string, error) {
	return f.cols, f.err
}

func Test_printViews_RendersTenantDatabaseAndViews(t *testing.T) {
	var buf bytes.Buffer
	src := fakeColumnSource{cols: map[string][]string{
		"patient": {"id", "organization_code"},
		"cases":   {"id"},
	}}

	require.NoError(t, printViews(t.Context(), &buf, "demo", src))

	out := buf.String()
	assert.Contains(t, out, "CREATE DATABASE IF NOT EXISTS `demo_tenant`")
	assert.Contains(t, out, "CREATE OR REPLACE VIEW `demo_tenant`.`cases`")
	assert.Contains(t, out, "can_read_pii") // patient view from its template
}

func Test_printViews_PropagatesColumnSourceError(t *testing.T) {
	err := printViews(t.Context(), io.Discard, "demo", fakeColumnSource{err: errors.New("boom")})
	require.Error(t, err)
	assert.Contains(t, err.Error(), "boom")
}

func Test_printViews_PropagatesInvalidTenantCodeError(t *testing.T) {
	err := printViews(t.Context(), io.Discard, "Bad Code", fakeColumnSource{cols: map[string][]string{"cases": {"id"}}})
	require.Error(t, err) // BuildViewStatements rejects the code
}

func Test_printCreatePlan_ShowsAllThreePhases(t *testing.T) {
	var buf bytes.Buffer
	src := fakeColumnSource{cols: map[string][]string{"patient": {"id", "organization_code"}}}

	require.NoError(t, printCreatePlan(t.Context(), &buf, "demo", "Demo Hospital", src))

	out := buf.String()
	// Phase A — Postgres
	assert.Contains(t, out, "Phase A — Postgres")
	assert.Contains(t, out, `INSERT INTO public.tenant (code, name) VALUES ("demo", "Demo Hospital")`)
	assert.Contains(t, out, "seed role demo/geneticist")
	// Phase B — StarRocks (auth + tenant views)
	assert.Contains(t, out, "Phase B — StarRocks")
	assert.Contains(t, out, "CREATE OR REPLACE VIEW auth.pii_grant")
	assert.Contains(t, out, "`demo_tenant`.`patient`")
	// Phase C — Ranger
	assert.Contains(t, out, "Phase C — Ranger")
	assert.Contains(t, out, "ensure role demo_user")
	assert.Contains(t, out, "sr_access_demo")
	assert.Contains(t, out, "demo_tenant.*", "access policy is on the _tenant database")
}

func Test_printCreatePlan_PropagatesError(t *testing.T) {
	err := printCreatePlan(t.Context(), io.Discard, "demo", "Demo", fakeColumnSource{err: errors.New("boom")})
	require.Error(t, err)
}

func Test_printCreatePlan_AuthBlockPrecedesViews(t *testing.T) {
	var buf bytes.Buffer
	src := fakeColumnSource{cols: map[string][]string{"patient": {"id", "organization_code"}}}
	require.NoError(t, printCreatePlan(t.Context(), &buf, "demo", "Demo", src))

	out := buf.String()
	assert.Less(t, strings.Index(out, "auth.pii_grant"), strings.Index(out, "`demo_tenant`.`patient`"),
		"auth.pii_grant must be created before the patient view that references it")
}
