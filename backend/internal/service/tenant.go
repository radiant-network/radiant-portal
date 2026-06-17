package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
)

type TenantStore interface {
	EnsureTenant(code, name string) error
	SeedDefaultRoles(tenantCode string) error
}

type ViewColumnSource interface {
	FederatableColumnsForViews() (map[string][]string, error)
}

// TenantReader is everything a full view refresh needs: list the tenants and read
// their federatable columns. Both come from the same source, so refresh takes one.
type TenantReader interface {
	ViewColumnSource
	ListTenants() ([]string, error)
}

type StarrocksTenantProvisioner interface {
	EnsureAuthDatabase(ctx context.Context) error
	EnsureClinicalViews(ctx context.Context, tenantCode string, columns map[string][]string) error
}

type RangerTenantProvisioner interface {
	EnsureRole(ctx context.Context, name string) error
	EnsureAccessPolicy(ctx context.Context, name string, databases, tables, roles []string) error
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

// CreateTenant onboards a tenant, idempotently. Order is load-bearing: Ranger's
// access policy references the database created in the StarRocks phase, which in turn
// follows the Postgres source of truth.
func CreateTenant(ctx context.Context, deps TenantDeps, code, name string) error {
	if err := deps.Store.EnsureTenant(code, name); err != nil {
		return fmt.Errorf("postgres: ensure tenant %q: %w", code, err)
	}
	if err := deps.Store.SeedDefaultRoles(code); err != nil {
		return fmt.Errorf("postgres: seed default roles for %q: %w", code, err)
	}

	if err := deps.Starrocks.EnsureAuthDatabase(ctx); err != nil {
		return fmt.Errorf("starrocks: ensure auth database: %w", err)
	}
	columns, err := deps.Columns.FederatableColumnsForViews()
	if err != nil {
		return fmt.Errorf("starrocks: federatable columns: %w", err)
	}
	if err := deps.Starrocks.EnsureClinicalViews(ctx, code, columns); err != nil {
		return fmt.Errorf("starrocks: create views for %q: %w", code, err)
	}

	role := RangerTenantRole(code)
	if err := deps.Ranger.EnsureRole(ctx, role); err != nil {
		return fmt.Errorf("ranger: ensure role %q: %w", role, err)
	}
	policy := TenantAccessPolicy(code)
	if err := deps.Ranger.EnsureAccessPolicy(ctx, policy, []string{types.TenantDatabase(code)}, []string{"*"}, []string{role}); err != nil {
		return fmt.Errorf("ranger: ensure access policy %q: %w", policy, err)
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
	cols, err := reader.FederatableColumnsForViews()
	if err != nil {
		return nil, fmt.Errorf("federatable columns: %w", err)
	}
	codes, err := reader.ListTenants()
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
