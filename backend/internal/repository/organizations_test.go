package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetOrganizationByCode_Not_Null(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(env.Postgres)
		org, err := repo.GetOrganizationByCode("CHOP")
		assert.NoError(t, err)
		assert.NotNil(t, org)
		assert.Equal(t, "CHOP", org.Code)
		assert.Equal(t, "Children Hospital of Philadelphia", org.Name)
		assert.Equal(t, "healthcare_provider", org.CategoryCode)
	})
}
func Test_GetOrganizationByCode_Null(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(env.Postgres)
		org, err := repo.GetOrganizationByCode("Unknown")
		assert.NoError(t, err)
		assert.Nil(t, org)
	})
}

func Test_GetOrganizationCodesByTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(env.Postgres)
		codes, err := repo.GetOrganizationCodesByTenant("radiant")
		assert.NoError(t, err)
		assert.ElementsMatch(t, []string{"CHOP", "UCSF", "CHUSJ", "LDM-CHUSJ", "LDM-CHOP", "CQGC"}, codes)
	})
}

func Test_GetOrganizationCodesByTenant_UnknownTenant(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationRepository(env.Postgres)
		codes, err := repo.GetOrganizationCodesByTenant("does_not_exist")
		assert.NoError(t, err)
		assert.Empty(t, codes)
	})
}
