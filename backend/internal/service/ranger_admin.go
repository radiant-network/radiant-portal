package service

import (
	"context"
	"fmt"
)

// Cluster-level ("admin") Ranger policy — not tied to any tenant. Kept separate from the
// tenant/masking policies in ranger_masking.go.
const warehouseAccessPolicy = "sr_access_warehouse"

// RangerAdminProvisioner is the Ranger surface the admin-policy bootstrap needs.
type RangerAdminProvisioner interface {
	EnsureWarehouseAccessPolicy(ctx context.Context, name string, warehouses, users []string) error
}

// BootstrapAdminPolicies ensures the cluster-level Ranger policies that aren't tied to a
// tenant. Today that's one grant: it lets the given users resume a suspended warehouse. With
// Ranger on, "resume" needs the ALTER permission on the warehouse, so without this grant a
// suspended warehouse can't be brought back. The admin users are passed in (the caller
// decides the cluster's admin identities) rather than hardcoded, so it works on a deployment
// whose admin users differ. Idempotent; run from cmd/bootstrap-admin-policies.
func BootstrapAdminPolicies(ctx context.Context, ranger RangerAdminProvisioner, users []string) error {
	if len(users) == 0 {
		return fmt.Errorf("ranger: no users given for warehouse access policy %q", warehouseAccessPolicy)
	}
	if err := ranger.EnsureWarehouseAccessPolicy(ctx, warehouseAccessPolicy, []string{"*"}, users); err != nil {
		return fmt.Errorf("ranger: ensure warehouse access policy %q: %w", warehouseAccessPolicy, err)
	}
	return nil
}
