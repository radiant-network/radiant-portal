package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// maskingRecorder captures the masking bootstrap calls with their arguments.
type maskingRecorder struct {
	roles        []string
	accessNames  []string
	accessTables map[string][]string // policy name -> tables
	rowFilters   map[string]string   // policy name -> filterExpr
	masks        map[string][]string // policy name -> columns
	maskExprs    map[string]string   // policy name -> mask expr
	nested       []string            // "parent/child" from AddRoleToRole
	failAtMask   string
	failRole     string // EnsureRole returns an error for this role name
}

func newMaskingRecorder() *maskingRecorder {
	return &maskingRecorder{accessTables: map[string][]string{}, rowFilters: map[string]string{}, masks: map[string][]string{}, maskExprs: map[string]string{}}
}

func (m *maskingRecorder) EnsureRole(ctx context.Context, name string) error {
	m.roles = append(m.roles, name)
	if m.failRole == name {
		return errors.New("boom")
	}
	return nil
}
func (m *maskingRecorder) EnsureAccessPolicy(ctx context.Context, name string, databases, tables, roles []string) error {
	m.accessNames = append(m.accessNames, name)
	m.accessTables[name] = tables
	return nil
}
func (m *maskingRecorder) EnsureRowFilterPolicy(ctx context.Context, name, database, table, filterExpr string, roles []string) error {
	m.rowFilters[name] = filterExpr
	return nil
}
func (m *maskingRecorder) EnsureMaskPolicy(ctx context.Context, name string, databases []string, table string, columns []string, maskExpr string, roles []string) error {
	if m.failAtMask == name {
		return errors.New("boom")
	}
	m.masks[name] = columns
	m.maskExprs[name] = maskExpr
	return nil
}
func (m *maskingRecorder) AddRoleToRole(ctx context.Context, parent, child string) error {
	m.nested = append(m.nested, parent+"/"+child)
	return nil
}

func Test_BootstrapMaskingPolicies_CreatesMarkerRoleAuthGrantRowFilterAndMasks(t *testing.T) {
	m := newMaskingRecorder()

	require.NoError(t, BootstrapMaskingPolicies(context.Background(), m))

	assert.Equal(t, []string{RangerMaskingRole}, m.roles, "the masking-subject marker role is ensured")
	assert.Equal(t, []string{authAccessPolicy, sharedAccessPolicy}, m.accessNames, "SELECT on the auth views + the shared base DB is granted")
	assert.Equal(t, []string{authAllTables}, m.accessTables[authAccessPolicy],
		"the whole auth database is granted, so a new auth view can't fail every patient read by being left out of the policy")
	assert.Equal(t, "user_id = "+currentUserLogin, m.rowFilters[authRowFilterPolicy], "row-filter keys pii_grant on the caller's sub")
	assert.Equal(t, "user_id = "+currentUserLogin, m.rowFilters[authLabPatientRowFilterPol],
		"pii_lab_patient is filtered explicitly, not by assuming the filter propagates through pii_grant")
	assert.Equal(t, []string{"submitter_patient_id", "first_name", "last_name", "jhn"}, m.masks[maskRedactPolicy])
	assert.Equal(t, []string{"date_of_birth"}, m.masks[maskDobPolicy])
	assert.Contains(t, m.maskExprs[maskRedactPolicy], "can_read_pii", "mask branches on the can_read_pii flag")
}

func Test_BootstrapMaskingPolicies_WrapsFailureWithPolicyName(t *testing.T) {
	m := newMaskingRecorder()
	m.failAtMask = maskDobPolicy

	err := BootstrapMaskingPolicies(context.Background(), m)

	require.Error(t, err)
	assert.Contains(t, err.Error(), maskDobPolicy)
}

func Test_RefreshMaskingPolicies_BootstrapsThenReconcilesEveryTenant(t *testing.T) {
	m := newMaskingRecorder()

	require.NoError(t, RefreshMaskingPolicies(context.Background(), m, []string{"cbtn", "udp"}))

	// Bootstrap ensures the marker role once, then each tenant's role is ensured before
	// nesting — this is the self-heal: a tenant whose role never existed gets created.
	assert.Equal(t, []string{RangerMaskingRole, "cbtn_user", "udp_user"}, m.roles)
	assert.Equal(t, []string{
		RangerMaskingRole + "/cbtn_user",
		RangerMaskingRole + "/udp_user",
	}, m.nested, "each tenant role nested under the marker")
}

func Test_RefreshMaskingPolicies_ContinuesPastAFailingTenant(t *testing.T) {
	m := newMaskingRecorder()
	m.failRole = "cbtn_user" // cbtn's per-tenant reconcile fails at EnsureRole

	err := RefreshMaskingPolicies(context.Background(), m, []string{"cbtn", "udp"})

	require.Error(t, err)
	assert.Contains(t, err.Error(), "cbtn_user")
	assert.Equal(t, []string{RangerMaskingRole + "/udp_user"}, m.nested,
		"udp still reconciled despite cbtn failing")
}
