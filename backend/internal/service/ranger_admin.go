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
	EnsureUser(ctx context.Context, name string) error
	EnsureWarehouseAccessPolicy(ctx context.Context, name string, warehouses, users []string) error
}

// BootstrapAdminPolicies ensures the cluster-level Ranger policies that aren't tied to a
// tenant. Today that's one grant: it lets the given users resume a suspended warehouse. With
// Ranger on, "resume" needs the ALTER permission on the warehouse, so without this grant a
// suspended warehouse can't be brought back. The admin users are passed in (the caller
// decides the cluster's admin identities) rather than hardcoded, so it works on a deployment
// whose admin users differ. It registers each user in Ranger first — Ranger rejects a policy
// that grants a user it doesn't know. Run from cmd/bootstrap-admin-policies.
func BootstrapAdminPolicies(ctx context.Context, ranger RangerAdminProvisioner, users []string) error {
	if len(users) == 0 {
		return fmt.Errorf("ranger: no users given for warehouse access policy %q", warehouseAccessPolicy)
	}
	// Register each granted user first. Ranger returns a 400
	// ("user ... does not exist in ranger admin") if a policy names a user it
	// doesn't know.
	for _, u := range users {
		if err := ranger.EnsureUser(ctx, u); err != nil {
			return fmt.Errorf("ranger: ensure user %q: %w", u, err)
		}
	}
	if err := ranger.EnsureWarehouseAccessPolicy(ctx, warehouseAccessPolicy, []string{"*"}, users); err != nil {
		return fmt.Errorf("ranger: ensure warehouse access policy %q: %w", warehouseAccessPolicy, err)
	}
	return nil
}
