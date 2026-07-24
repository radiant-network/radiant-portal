package starrocks

import (
	"fmt"
	"sort"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_ListOrganizations(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationsRepository(database.StarrocksDB{DB: env.Starrocks})

		organizations, err := repo.ListOrganizations(t.Context())
		assert.NoError(t, err)

		// No tenant bound → the read hits the radiant_jdbc federation, which returns every
		// tenant's organizations (the seeded radiant set + tenant_b's org). Per-tenant isolation
		// is view-based and only applies once a tenant is bound (see the routing test below),
		// exactly like the other federated reads (e.g. SearchCases).
		byCode := map[string]types.OrganizationResponse{}
		names := make([]string, len(organizations))
		for i, o := range organizations {
			byCode[o.Code] = o
			names[i] = o.Name
		}

		assert.Equal(t, "Children Hospital of Philadelphia", byCode["CHOP"].Name)
		assert.Equal(t, "healthcare_provider", byCode["CHOP"].CategoryCode)
		assert.Equal(t, "Healthcare Provider", byCode["CHOP"].CategoryName)
		assert.Equal(t, "diagnostic_laboratory", byCode["LDM-CHUSJ"].CategoryCode)
		assert.Equal(t, "Diagnostic Laboratory", byCode["LDM-CHUSJ"].CategoryName)
		assert.Equal(t, "sequencing_center", byCode["CQGC"].CategoryCode)

		assert.True(t, sort.StringsAreSorted(names), "organizations must be returned ordered by name, got %v", names)
	})
}

func Test_ListOrganizations_TenantBound_RoutesToTenantView(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewOrganizationsRepository(database.StarrocksDB{DB: env.Starrocks})
		ctx := types.ContextWithTenant(env.Ctx, "tenant1")

		var dest []types.OrganizationResponse
		tx := repo.db.Session(&gorm.Session{DryRun: true}).WithContext(ctx).
			Table(fmt.Sprintf("%s %s", types.OrganizationTable.TenantQualifiedName(ctx), types.OrganizationTable.Alias)).
			Select("org.code")
		tx = repo.joiner.OrganizationWithCategory(tx)
		sql := tx.Find(&dest).Statement.SQL.String()

		assert.Contains(t, sql, "tenant1_tenant.organization")
		assert.Contains(t, sql, "tenant1_tenant.organization_category")
		assert.NotContains(t, sql, "radiant_jdbc")
	})
}
