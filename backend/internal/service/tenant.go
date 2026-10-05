package service

import (
	"context"
	"errors"
	"fmt"
)

type TenantStore interface {
	EnsureTenant(ctx context.Context, code, name string) error
	SeedDefaultRoles(ctx context.Context, tenantCode string) error
}

type ViewColumnSource interface {
	FederatableColumnsForViews(ctx context.Context) (map[string][]string, error)
}

// TenantReader is everything a full view refresh needs: list the tenants and read
// their federatable columns. Both come from the same source, so refresh takes one.
type TenantReader interface {
	ViewColumnSource
	ListTenants(ctx context.Context) ([]string, error)
}

type StarrocksTenantProvisioner interface {
	EnsureAuthDatabase(ctx context.Context) error
	EnsureClinicalViews(ctx context.Context, tenantCode string, columns map[string][]string) error
	EnsureGenePanelMV(ctx context.Context, tenantCode string) error
}

type RangerTenantProvisioner interface {
	RangerMaskingProvisioner
	EnsureMaterializedViewAccessPolicy(ctx context.Context, name string, databases, mvs, roles []string) error
	AddRoleToRole(ctx context.Context, parent, child string) error
}

type TenantDeps struct {
	Store     TenantStore
	Columns   ViewColumnSource
	Starrocks StarrocksTenantProvisioner
	Ranger    RangerTenantProvisioner
}

func TenantAccessPolicy(tenantCode string) string {
	return "sr_access_" + tenantCode
}

func TenantViewAccessPolicy(tenantCode string) string {
	return "sr_access_" + tenantCode + "_views"
}

func TenantMaterializedViewAccessPolicy(tenantCode string) string {
	return "sr_access_" + tenantCode + "_mvs"
}

// CreateTenant onboards a tenant, idempotently. Order is load-bearing: Ranger's
// access policy references the database created in the StarRocks phase, which in turn
// follows the Postgres source of truth.
func CreateTenant(ctx context.Context, deps TenantDeps, code, name string) error {
	if err := deps.Store.EnsureTenant(ctx, code, name); err != nil {
		return fmt.Errorf("postgres: ensure tenant %q: %w", code, err)
	}
	if err := deps.Store.SeedDefaultRoles(ctx, code); err != nil {
		return fmt.Errorf("postgres: seed default roles for %q: %w", code, err)
	}

	if err := deps.Starrocks.EnsureAuthDatabase(ctx); err != nil {
		return fmt.Errorf("starrocks: ensure auth database: %w", err)
	}
	columns, err := deps.Columns.FederatableColumnsForViews(ctx)
	if err != nil {
		return fmt.Errorf("starrocks: federatable columns: %w", err)
	}
	if err := deps.Starrocks.EnsureClinicalViews(ctx, code, columns); err != nil {
		return fmt.Errorf("starrocks: create views for %q: %w", code, err)
	}
	if err := deps.Starrocks.EnsureGenePanelMV(ctx, code); err != nil {
		return fmt.Errorf("starrocks: create gene panel mv for %q: %w", code, err)
	}

	// Global PII-masking policies first (they ensure the marker role the tenant role nests
	// into), then this tenant's role + access policy + nesting. Both idempotent.
	if err := BootstrapMaskingPolicies(ctx, deps.Ranger); err != nil {
		return err
	}
	if err := EnsureTenantRangerConfig(ctx, deps.Ranger, code); err != nil {
		return err
	}

	return nil
}

// RefreshAllTenantViews re-applies view definitions to every tenant, continuing past
// a per-tenant failure and returning the failures joined. The shared auth database and
// the (tenant-independent) federatable column set are resolved once up front.
// It returns the tenant codes it processed so the caller can report them without
// listing again.
func RefreshAllTenantViews(ctx context.Context, reader TenantReader, sr StarrocksTenantProvisioner) ([]string, error) {
	if err := sr.EnsureAuthDatabase(ctx); err != nil {
		return nil, fmt.Errorf("ensure auth database: %w", err)
	}
	cols, err := reader.FederatableColumnsForViews(ctx)
	if err != nil {
		return nil, fmt.Errorf("federatable columns: %w", err)
	}
	codes, err := reader.ListTenants(ctx)
	if err != nil {
		return nil, fmt.Errorf("list tenants: %w", err)
	}
	var errs []error
	for _, code := range codes {
		if err := sr.EnsureClinicalViews(ctx, code, cols); err != nil {
			errs = append(errs, fmt.Errorf("refresh %q: %w", code, err))
		}
	}
	return codes, errors.Join(errs...)
}

type GenePanelMVProvisioner interface {
	EnsureGenePanelMV(ctx context.Context, tenantCode string) error
}

// EnsureAllGenePanelMVs creates (if missing) and refreshes the gene panel MV of each given
// tenant, continuing past a per-tenant failure and returning the failures joined. It is kept
// out of RefreshAllTenantViews on purpose: the API startup refresh calls that function and
// exits on error, so a JDBC refresh failure there would crash-loop every replica.
func EnsureAllGenePanelMVs(ctx context.Context, sr GenePanelMVProvisioner, codes []string) error {
	var errs []error
	for _, code := range codes {
		if err := sr.EnsureGenePanelMV(ctx, code); err != nil {
			errs = append(errs, fmt.Errorf("refresh gene panel mv %q: %w", code, err))
		}
	}
	return errors.Join(errs...)
}
