package service

import (
	"context"
	"fmt"
)

// Cluster-level ("admin") Ranger policy — not tied to any tenant. Kept separate from the
// tenant/masking policies in ranger_masking.go.
const warehouseAccessPolicy = "sr_access_warehouse"

// warehouseAdminUsers are the identities that run warehouse admin ops: root is the
// control-plane identity that resumes a warehouse, admin is a second break-glass identity.
var warehouseAdminUsers = []string{"root", "admin"}

// RangerAdminProvisioner is the Ranger surface the admin-policy bootstrap needs.
type RangerAdminProvisioner interface {
	EnsureWarehouseAccessPolicy(ctx context.Context, name string, warehouses, users []string) error
}

// BootstrapAdminPolicies ensures the cluster-level Ranger policies that aren't tied to a
// tenant. Today that's one grant: it lets root/admin resume a suspended warehouse. With
// Ranger on, "resume" needs the ALTER permission on the warehouse, so without this grant a
// suspended warehouse can't be brought back. Idempotent; run from cmd/bootstrap-admin-policies.
func BootstrapAdminPolicies(ctx context.Context, ranger RangerAdminProvisioner) error {
	if err := ranger.EnsureWarehouseAccessPolicy(ctx, warehouseAccessPolicy, []string{"*"}, warehouseAdminUsers); err != nil {
		return fmt.Errorf("ranger: ensure warehouse access policy %q: %w", warehouseAccessPolicy, err)
	}
	return nil
}
