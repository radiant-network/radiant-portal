package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
)

// Masking-subject marker role. Every tenant role is nested under it, so any tenant
// member is a masking subject; root and anyone outside it match no mask item and see
// raw values. This mirrors the role model in compose/scripts/03_ranger_policies.py.
const RangerMaskingRole = "user_role"

// The auth database holds the views answering "who can read PII where": pii_grant, keyed on
// the patient's own organization, and pii_lab_patient, which derives from it the patients a
// grant at a case's diagnosis lab reaches. The patient views read BOTH (a reveal by either
// path), and their can_read_pii subqueries run with invoker privileges, so masking subjects
// need SELECT on both — hence the grant covers the whole database rather than a table list:
// a future auth view the patient template starts reading would otherwise fail every patient
// read with access-denied until someone remembered to extend the policy.
//
// Each view is row-filtered to the caller's own rows, so neither can be used to enumerate
// other people's grants. pii_lab_patient is filtered explicitly rather than relying on the
// filter propagating through pii_grant, its only source.
const (
	authGrantDatabase   = "auth"
	authAllTables       = "*"
	authGrantTable      = "pii_grant"
	authLabPatientTable = "pii_lab_patient"

	// patientTable is the per-tenant view masks apply to; tenantDatabaseGlob matches every
	// <code>_tenant database (see types.TenantDatabase) so one mask policy covers all tenants.
	patientTable       = "patient"
	tenantDatabaseGlob = "*_tenant"
)

// Global masking policy names (static, independent of tenant count).
const (
	authAccessPolicy           = "sr_access_auth"
	sharedAccessPolicy         = "sr_access_shared"
	authRowFilterPolicy        = "sr_rowfilter_auth"
	authLabPatientRowFilterPol = "sr_rowfilter_auth_lab_patient"
	maskRedactPolicy           = "sr_mask_pii_redact"
	maskDobPolicy              = "sr_mask_dob"
)

// current_user() returns '<user_id>'@'%'; drop the leading quote and take up to the next
// one to recover the Keycloak sub. Must match the expression the auth/patient views use
// (internal/repository/views/*.sql). The row-filter keys auth.pii_grant on it.
const currentUserLogin = "substring_index(substr(current_user(), 2), char(39), 1)"

var authRowFilterExpr = "user_id = " + currentUserLogin

// PII masks. The patient views expose can_read_pii (1 when the current user holds
// can_read_pii for the row's org), so the rule lives in one place and the masks just
// branch on it. Ranger substitutes {col} per masked column.
const (
	maskRedactExpr = "CASE WHEN can_read_pii THEN {col} ELSE '***' END"
	maskDobExpr    = "CASE WHEN can_read_pii THEN {col} ELSE cast(date_trunc('year', {col}) as date) END"
)

var maskRedactColumns = []string{"submitter_patient_id", "first_name", "last_name", "jhn"}

// RangerMaskingProvisioner is the Ranger surface the masking bootstrap needs.
type RangerMaskingProvisioner interface {
	EnsureRole(ctx context.Context, name string) error
	EnsureAccessPolicy(ctx context.Context, name string, databases, tables, roles []string) error
	EnsureRowFilterPolicy(ctx context.Context, name, database, table, filterExpr string, roles []string) error
	EnsureMaskPolicy(ctx context.Context, name string, databases []string, table string, columns []string, maskExpr string, roles []string) error
}

// BootstrapMaskingPolicies ensures the global, tenant-independent Ranger objects that
// drive PII masking: the masking-subject marker role, self-access + row-filter on
// auth.pii_grant, and the patient column masks. Idempotent — safe to run on every tenant
// create/refresh.
func BootstrapMaskingPolicies(ctx context.Context, ranger RangerMaskingProvisioner) error {
	if err := ranger.EnsureRole(ctx, RangerMaskingRole); err != nil {
		return fmt.Errorf("ranger: ensure role %q: %w", RangerMaskingRole, err)
	}
	roles := []string{RangerMaskingRole}

	// Grant SELECT on the auth database, then row-filter each view in it to the caller's own
	// rows (else they could enumerate everyone's grants — see the const block above).
	if err := ranger.EnsureAccessPolicy(ctx, authAccessPolicy, []string{authGrantDatabase}, []string{authAllTables}, roles); err != nil {
		return fmt.Errorf("ranger: ensure access policy %q: %w", authAccessPolicy, err)
	}
	for _, filtered := range []struct{ policy, table string }{
		{authRowFilterPolicy, authGrantTable},
		{authLabPatientRowFilterPol, authLabPatientTable},
	} {
		if err := ranger.EnsureRowFilterPolicy(ctx, filtered.policy, authGrantDatabase, filtered.table, authRowFilterExpr, roles); err != nil {
			return fmt.Errorf("ranger: ensure row-filter policy %q: %w", filtered.policy, err)
		}
	}

	// Cross-tenant reference/annotation data (snv__consequence, genes, HPO/MONDO, external
	// frequencies, staging_sequencing_experiment, …) lives in the shared base database, which
	// per-tenant reads join (types.SharedDatabase). These are base tables (Ranger-enforced,
	// unlike the tenant views), non-PII, and readable by every tenant user, so grant the marker
	// role SELECT. snv__variant is *not* here — it is per-tenant, covered by the tenant DB
	// grant in EnsureTenantRangerConfig.
	if err := ranger.EnsureAccessPolicy(ctx, sharedAccessPolicy, []string{types.SharedDatabase}, []string{"*"}, roles); err != nil {
		return fmt.Errorf("ranger: ensure access policy %q: %w", sharedAccessPolicy, err)
	}

	dbs := []string{tenantDatabaseGlob}
	if err := ranger.EnsureMaskPolicy(ctx, maskRedactPolicy, dbs, patientTable, maskRedactColumns, maskRedactExpr, roles); err != nil {
		return fmt.Errorf("ranger: ensure mask policy %q: %w", maskRedactPolicy, err)
	}
	if err := ranger.EnsureMaskPolicy(ctx, maskDobPolicy, dbs, patientTable, []string{"date_of_birth"}, maskDobExpr, roles); err != nil {
		return fmt.Errorf("ranger: ensure mask policy %q: %w", maskDobPolicy, err)
	}
	return nil
}

// EnsureTenantRangerConfig idempotently establishes a tenant's per-tenant Ranger objects:
// its role, the access policy granting that role SELECT on the tenant DB, and its nesting
// under the masking-subject marker. Shared by CreateTenant and the refresh path so both
// converge to the same state. The marker role must already exist (BootstrapMaskingPolicies);
// ensuring the tenant role here is what lets refresh self-heal a tenant that skipped
// create-tenant (its role wouldn't exist, and nesting a missing role is a Ranger error).
func EnsureTenantRangerConfig(ctx context.Context, ranger RangerTenantProvisioner, code string) error {
	role := RangerTenantRole(code)
	if err := ranger.EnsureRole(ctx, role); err != nil {
		return fmt.Errorf("ranger: ensure role %q: %w", role, err)
	}
	policy := TenantAccessPolicy(code)
	if err := ranger.EnsureAccessPolicy(ctx, policy, []string{types.TenantDatabase(code)}, []string{"*"}, []string{role}); err != nil {
		return fmt.Errorf("ranger: ensure access policy %q: %w", policy, err)
	}
	if err := ranger.AddRoleToRole(ctx, RangerMaskingRole, role); err != nil {
		return fmt.Errorf("ranger: nest role %q under %q: %w", role, RangerMaskingRole, err)
	}
	return nil
}

// RefreshMaskingPolicies re-applies the global masking policies, then reconciles every
// given tenant's Ranger config (role + access policy + nesting). It carries the Ranger work
// the standalone refresh CLI does — the API-startup view refresh deliberately excludes it
// (no Ranger creds at API runtime), so masking stays a control-plane concern. A per-tenant
// failure is collected and the rest still processed, so one unprovisioned tenant can't abort
// the run.
func RefreshMaskingPolicies(ctx context.Context, ranger RangerTenantProvisioner, codes []string) error {
	if err := BootstrapMaskingPolicies(ctx, ranger); err != nil {
		return err
	}
	var errs []error
	for _, code := range codes {
		if err := EnsureTenantRangerConfig(ctx, ranger, code); err != nil {
			errs = append(errs, err)
		}
	}
	return errors.Join(errs...)
}
