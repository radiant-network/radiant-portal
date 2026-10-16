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

func Test_BootstrapAdminPolicies_GrantsWarehouseResumeToGivenUsers(t *testing.T) {
	a := &adminRecorder{}

	require.NoError(t, BootstrapAdminPolicies(context.Background(), a, []string{"root", "admin"}))

	assert.Equal(t, []string{warehouseAccessPolicy}, a.warehouseNames,
		"the warehouse grant is ensured so the given users can resume a suspended warehouse")
	assert.Equal(t, []string{"root", "admin"}, a.warehouseUsers[warehouseAccessPolicy],
		"grants exactly the users passed in, not a hardcoded list")
}

func Test_BootstrapAdminPolicies_ErrorsWhenNoUsers(t *testing.T) {
	a := &adminRecorder{}

	err := BootstrapAdminPolicies(context.Background(), a, nil)

	require.Error(t, err, "refuse to create a grantee-less policy")
	assert.Empty(t, a.warehouseNames, "no policy is written when no users are given")
}
