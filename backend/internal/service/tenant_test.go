package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type recordingTenantDeps struct {
	calls  []string
	failAt string
}

func (d *recordingTenantDeps) record(step string) error {
	d.calls = append(d.calls, step)
	if d.failAt == step {
		return errors.New("boom")
	}
	return nil
}

func (d *recordingTenantDeps) EnsureTenant(ctx context.Context, code, name string) error {
	return d.record("EnsureTenant")
}
func (d *recordingTenantDeps) SeedDefaultRoles(ctx context.Context, tenantCode string) error {
	return d.record("SeedDefaultRoles")
}
func (d *recordingTenantDeps) EnsureAuthDatabase(ctx context.Context) error {
	return d.record("EnsureAuthDatabase")
}
func (d *recordingTenantDeps) FederatableColumnsForViews(ctx context.Context) (map[string][]string, error) {
	if err := d.record("FederatableColumnsForViews"); err != nil {
		return nil, err
	}
	return map[string][]string{}, nil
}
func (d *recordingTenantDeps) EnsureClinicalViews(ctx context.Context, tenantCode string, columns map[string][]string) error {
	return d.record("EnsureClinicalViews")
}
func (d *recordingTenantDeps) EnsureRole(ctx context.Context, name string) error {
	return d.record("EnsureRole")
}
func (d *recordingTenantDeps) EnsureAccessPolicy(ctx context.Context, name string, databases, tables, roles []string) error {
	return d.record("EnsureAccessPolicy")
}
func (d *recordingTenantDeps) EnsureRowFilterPolicy(ctx context.Context, name, database, table, filterExpr string, roles []string) error {
	return d.record("EnsureRowFilterPolicy")
}
func (d *recordingTenantDeps) EnsureMaskPolicy(ctx context.Context, name string, databases []string, table string, columns []string, maskExpr string, roles []string) error {
	return d.record("EnsureMaskPolicy")
}
func (d *recordingTenantDeps) AddRoleToRole(ctx context.Context, parent, child string) error {
	return d.record("AddRoleToRole")
}

func (d *recordingTenantDeps) deps() TenantDeps {
	return TenantDeps{Store: d, Columns: d, Starrocks: d, Ranger: d}
}

func Test_CreateTenant_RunsAllStepsInPostgresStarrocksRangerOrder(t *testing.T) {
	d := &recordingTenantDeps{}

	err := CreateTenant(context.Background(), d.deps(), "demo", "Demo Hospital")

	require.NoError(t, err)
	assert.Equal(t, []string{
		"EnsureTenant", "SeedDefaultRoles", // Phase A — Postgres
		"EnsureAuthDatabase", "FederatableColumnsForViews", "EnsureClinicalViews", // Phase B — StarRocks
		// Phase C — Ranger: global masking bootstrap (marker role + auth grant/row-filter +
		// shared-DB grant + 2 masks)...
		"EnsureRole", "EnsureAccessPolicy", "EnsureRowFilterPolicy", "EnsureAccessPolicy", "EnsureMaskPolicy", "EnsureMaskPolicy",
		// ...then this tenant's role + access policy + nesting under the marker.
		"EnsureRole", "EnsureAccessPolicy", "AddRoleToRole",
	}, d.calls)
}

func Test_CreateTenant_StopsAndWrapsOnFirstFailure(t *testing.T) {
	d := &recordingTenantDeps{failAt: "EnsureClinicalViews"}

	err := CreateTenant(context.Background(), d.deps(), "demo", "Demo Hospital")

	require.Error(t, err)
	assert.Contains(t, err.Error(), "starrocks: create views")
	assert.Equal(t, []string{"EnsureTenant", "SeedDefaultRoles", "EnsureAuthDatabase", "FederatableColumnsForViews", "EnsureClinicalViews"}, d.calls)
}

// refreshRecorder records which tenants EnsureClinicalViews was called for, and can
// be told to fail for specific tenant codes.
type refreshRecorder struct {
	tenants     []string
	refreshed   []string
	authCalls   int
	columnCalls int
	failTenant  map[string]bool
}

func (d *refreshRecorder) ListTenants(ctx context.Context) ([]string, error) { return d.tenants, nil }
func (d *refreshRecorder) EnsureAuthDatabase(ctx context.Context) error      { d.authCalls++; return nil }
func (d *refreshRecorder) FederatableColumnsForViews(ctx context.Context) (map[string][]string, error) {
	d.columnCalls++
	return map[string][]string{}, nil
}
func (d *refreshRecorder) EnsureClinicalViews(ctx context.Context, tenantCode string, columns map[string][]string) error {
	d.refreshed = append(d.refreshed, tenantCode)
	if d.failTenant[tenantCode] {
		return errors.New("boom")
	}
	return nil
}

func Test_RefreshAllTenantViews_EnsuresAuthAndFetchesColumnsOnceThenRefreshesEveryTenant(t *testing.T) {
	d := &refreshRecorder{tenants: []string{"radiant", "demo", "cbtn"}}

	codes, err := RefreshAllTenantViews(context.Background(), d, d)

	require.NoError(t, err)
	assert.Equal(t, 1, d.authCalls, "auth database ensured once up front, not per tenant")
	assert.Equal(t, 1, d.columnCalls, "federatable columns fetched once, not per tenant")
	assert.Equal(t, []string{"radiant", "demo", "cbtn"}, d.refreshed)
	assert.Equal(t, []string{"radiant", "demo", "cbtn"}, codes, "returns the codes it processed")
}

func Test_RefreshAllTenantViews_ContinuesPastAFailingTenantAndJoinsErrors(t *testing.T) {
	d := &refreshRecorder{tenants: []string{"radiant", "demo", "cbtn"}, failTenant: map[string]bool{"demo": true}}

	_, err := RefreshAllTenantViews(context.Background(), d, d)

	require.Error(t, err)
	assert.Contains(t, err.Error(), `refresh "demo"`)
	assert.Equal(t, []string{"radiant", "demo", "cbtn"}, d.refreshed, "a failing tenant must not stop the others")
}

func Test_TenantAccessPolicy_And_RangerTenantRole_NamingConventions(t *testing.T) {
	assert.Equal(t, "sr_access_demo", TenantAccessPolicy("demo"))
	assert.Equal(t, "demo_user", RangerTenantRole("demo"))
}
