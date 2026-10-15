package service

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// adminRecorder captures the admin-policy bootstrap calls with their arguments.
type adminRecorder struct {
	warehouseNames []string
	warehouseUsers map[string][]string
}

func (a *adminRecorder) EnsureWarehouseAccessPolicy(ctx context.Context, name string, warehouses, users []string) error {
	a.warehouseNames = append(a.warehouseNames, name)
	if a.warehouseUsers == nil {
		a.warehouseUsers = map[string][]string{}
	}
	a.warehouseUsers[name] = users
	return nil
}

func Test_BootstrapAdminPolicies_GrantsWarehouseResumeToRootAndAdmin(t *testing.T) {
	a := &adminRecorder{}

	require.NoError(t, BootstrapAdminPolicies(context.Background(), a))

	assert.Equal(t, []string{warehouseAccessPolicy}, a.warehouseNames,
		"the warehouse grant is ensured so root/admin can resume a suspended warehouse")
	assert.Equal(t, []string{"root", "admin"}, a.warehouseUsers[warehouseAccessPolicy])
}
