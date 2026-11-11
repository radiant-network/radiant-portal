package service

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// adminRecorder captures the admin-policy bootstrap calls with their arguments.
type adminRecorder struct {
	ensuredUsers   []string
	warehouseNames []string
	warehouseUsers map[string][]string
	failUser       string // EnsureUser returns an error for this user name
}

func (a *adminRecorder) EnsureUser(ctx context.Context, name string) error {
	a.ensuredUsers = append(a.ensuredUsers, name)
	if a.failUser == name {
		return errors.New("boom")
	}
	return nil
}

func (a *adminRecorder) EnsureWarehouseAccessPolicy(ctx context.Context, name string, warehouses, users []string) error {
	a.warehouseNames = append(a.warehouseNames, name)
	if a.warehouseUsers == nil {
		a.warehouseUsers = map[string][]string{}
	}
	a.warehouseUsers[name] = users
	return nil
}

func Test_BootstrapAdminPolicies_RegistersUsersThenGrantsWarehouse(t *testing.T) {
	a := &adminRecorder{}

	require.NoError(t, BootstrapAdminPolicies(context.Background(), a, []string{"root", "admin"}))

	assert.Equal(t, []string{"root", "admin"}, a.ensuredUsers,
		"each granted user is registered in Ranger first (Ranger won't grant a user it doesn't know)")
	assert.Equal(t, []string{warehouseAccessPolicy}, a.warehouseNames,
		"the warehouse grant is ensured so the given users can resume a suspended warehouse")
	assert.Equal(t, []string{"root", "admin"}, a.warehouseUsers[warehouseAccessPolicy],
		"grants exactly the users passed in, not a hardcoded list")
}

func Test_BootstrapAdminPolicies_ErrorsWhenNoUsers(t *testing.T) {
	a := &adminRecorder{}

	err := BootstrapAdminPolicies(context.Background(), a, nil)

	require.Error(t, err, "refuse to create a grantee-less policy")
	assert.Empty(t, a.ensuredUsers, "no users registered")
	assert.Empty(t, a.warehouseNames, "no policy is written when no users are given")
}

func Test_BootstrapAdminPolicies_StopsIfUserRegistrationFails(t *testing.T) {
	a := &adminRecorder{failUser: "root"}

	err := BootstrapAdminPolicies(context.Background(), a, []string{"root", "admin"})

	require.Error(t, err)
	assert.Contains(t, err.Error(), "root")
	assert.Empty(t, a.warehouseNames, "no policy is written if a user can't be registered")
}
