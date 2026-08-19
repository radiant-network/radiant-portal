package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func listUsers(t *testing.T, userID, tenant, queryString string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		usersRepo := postgres.NewUsersRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.GET("/users", server.RequireAction(auth, authRepo, types.ActionManageUser), server.ListUsersHandler(usersRepo))

		req, _ := http.NewRequest("GET", "/"+tenant+"/users"+queryString, nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_ListUsers_TenantAdmin_ReturnsTenantUsers(t *testing.T) {
	w := listUsers(t, taraID, "radiant", "?search=alice@test.authz")

	require.Equal(t, http.StatusOK, w.Code)
	var response types.UsersSearchResponse
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &response))

	assert.Equal(t, int64(1), response.Count)
	require.Len(t, response.List, 1)
	assert.Equal(t, "Alice", response.List[0].FirstName)
	assert.Len(t, response.List[0].Roles, 2, "alice holds geneticist @ CHOP and researcher tenant-wide")
}

func Test_ListUsers_WithoutManageUser_Forbidden(t *testing.T) {
	// mike holds member (no can_manage_user) → the action gate 403s before the handler.
	w := listUsers(t, mikeID, "radiant", "")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_ListUsers_CrossTenant_Forbidden(t *testing.T) {
	// tara is a radiant admin only → RequireTenantAccess rejects her on tenant_b.
	w := listUsers(t, taraID, "tenant_b", "")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

// The provisioning orchestration reaches Keycloak, Ranger and StarRocks, none of which the test
// container network provides, so each of those three is stubbed while the Postgres grants this
// endpoint is actually about are written for real.
//
// The identity provider is faked rather than skipped: the handler never sets UserInput.Sub, so
// service.ProvisionUser always mints the sub through Keycloak. Short-circuiting that with a Sub
// would take a branch the endpoint cannot reach, and the sub the grants are keyed on would come
// from the test instead of from the provisioning path being tested.
type stubKeycloak struct {
	sub    string
	rename [3]string // {userID, firstName, lastName}
}

func (k *stubKeycloak) UpsertUser(_ context.Context, _, _, _, _, _ string) (string, error) {
	return k.sub, nil
}

func (k *stubKeycloak) UpdateUserName(_ context.Context, userID, firstName, lastName string) error {
	k.rename = [3]string{userID, firstName, lastName}
	return nil
}

type noopRanger struct{}

func (noopRanger) EnsureUser(context.Context, string) error                 { return nil }
func (noopRanger) AddUserToRole(context.Context, string, string) error      { return nil }
func (noopRanger) RemoveUserFromRole(context.Context, string, string) error { return nil }

type noopStarrocks struct{}

func (noopStarrocks) EnsureJWTUser(context.Context, string) error { return nil }

func newUserAdmin(db *gorm.DB, keycloak *stubKeycloak) *service.UserAdmin {
	postgresDB := database.PostgresDB{DB: db}
	return service.NewUserAdmin(
		postgres.NewUsersRepository(postgresDB),
		postgres.NewOrganizationRepository(postgresDB),
		service.AdminDeps{
			Keycloak:  keycloak,
			Ranger:    noopRanger{},
			Starrocks: noopStarrocks{},
			Auth:      postgres.NewAuthRepository(postgresDB),
		},
	)
}

// Each test provisions its own sub: the tests run in parallel against one database, so a shared id
// would let one test's cleanup delete the grants another just wrote. A UUID mirrors what Keycloak
// actually mints, which is what the StarRocks step requires in production.
const (
	createdUserID     = "c1c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	conflictUserID    = "c2c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	badOrgUserID      = "c3c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	forbiddenUserID   = "c4c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	crossTenantUserID = "c5c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
)

func postUser(t *testing.T, userID, tenant, sub, body string, assertDB func(t *testing.T, db *gorm.DB)) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		// users / user_role are outside testutils.cleanUp's reach, so the test owns this. The grants
		// must go first: user_role holds an FK to users.
		defer func() {
			env.Postgres.Exec("DELETE FROM public.user_role WHERE user_id = ?", sub)
			env.Postgres.Exec("DELETE FROM public.users WHERE user_id = ?", sub)
		}()

		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.POST("/users", server.RequireAction(auth, authRepo, types.ActionManageUser),
			server.PostUserHandler(newUserAdmin(env.Postgres, &stubKeycloak{sub: sub}), auth))

		req, _ := http.NewRequest("POST", "/"+tenant+"/users", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if assertDB != nil {
			assertDB(t, env.Postgres)
		}
	})
	return w
}

func Test_CreateUser_TenantAdmin_GrantsMemberAndRequestedRoles(t *testing.T) {
	type grantRow struct {
		RoleCode  string
		OrgCode   *string
		GrantedBy string
	}
	var grants []grantRow

	w := postUser(t, taraID, "radiant", createdUserID, `{
		"email":"created@test.authz","first_name":"New","last_name":"Bie",
		"roles":[{"role_code":"geneticist","org_codes":["CHOP"]}]
	}`, func(t *testing.T, db *gorm.DB) {
		require.NoError(t, db.Raw(`
			SELECT role_code, org_code, granted_by FROM public.user_role
			WHERE user_id = ? AND tenant_code = 'radiant' ORDER BY role_code`, createdUserID).Scan(&grants).Error)
	})

	require.Equal(t, http.StatusCreated, w.Code)
	assert.Empty(t, w.Body.String())

	require.Len(t, grants, 2)
	assert.Equal(t, "geneticist", grants[0].RoleCode)
	require.NotNil(t, grants[0].OrgCode)
	assert.Equal(t, "CHOP", *grants[0].OrgCode)
	assert.Equal(t, taraID, grants[0].GrantedBy, "granted_by attributes the grant to the acting admin")

	assert.Equal(t, "member", grants[1].RoleCode)
	assert.Nil(t, grants[1].OrgCode, "the auto-granted member role is tenant-wide")
}

func Test_CreateUser_ExistingTenantUser_Conflict(t *testing.T) {
	// alice already holds roles in radiant (test/data/auth/06_user_role.sql).
	w := postUser(t, taraID, "radiant", conflictUserID,
		`{"email":"alice@test.authz","first_name":"Alice","last_name":"Adams"}`, nil)

	assert.Equal(t, http.StatusConflict, w.Code)
}

func Test_CreateUser_UnknownOrganization_BadRequest(t *testing.T) {
	w := postUser(t, taraID, "radiant", badOrgUserID, `{
		"email":"badorg@test.authz","first_name":"New","last_name":"Bie",
		"roles":[{"role_code":"geneticist","org_codes":["TENANT_B_ORG"]}]
	}`, nil)

	assert.Equal(t, http.StatusBadRequest, w.Code, "another tenant's org is not grantable in radiant")
}

func Test_CreateUser_WithoutManageUser_Forbidden(t *testing.T) {
	// mike holds member only → the action gate 403s before the handler.
	w := postUser(t, mikeID, "radiant", forbiddenUserID,
		`{"email":"forbidden@test.authz","first_name":"New","last_name":"Bie"}`, nil)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_CreateUser_CrossTenant_Forbidden(t *testing.T) {
	w := postUser(t, taraID, "tenant_b", crossTenantUserID,
		`{"email":"crosstenant@test.authz","first_name":"New","last_name":"Bie"}`, nil)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

// --- PUT /:tenant/users/:user_id --------------------------------------------

const (
	editedUserID   = "e1c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	revokedUserID  = "e2c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	badOrgEditedID = "e3c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	forbiddenEdit  = "e4c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
)

// seedEditableUser provisions a radiant member who is also a geneticist at CHOP, and hands the
// test its teardown: users / user_role are outside testutils.cleanUp's reach.
func seedEditableUser(t *testing.T, db *gorm.DB, userID string) {
	t.Helper()
	t.Cleanup(func() {
		db.Exec("DELETE FROM public.user_role WHERE user_id = ?", userID)
		db.Exec("DELETE FROM public.users WHERE user_id = ?", userID)
	})
	require.NoError(t, db.Exec(`
		INSERT INTO public.users (user_id, email, first_name, last_name)
		VALUES (?, ?, 'Edit', 'Target')`, userID, userID+"@test.authz").Error)
	require.NoError(t, db.Exec(`
		INSERT INTO public.user_role (user_id, tenant_code, org_code, role_code, granted_by)
		VALUES (?, 'radiant', NULL, 'member', 'seed'),
		       (?, 'radiant', 'CHOP', 'geneticist', 'seed')`, userID, userID).Error)
}

// seed provisions the target before the request; the tests that expect a rejection before any
// lookup (403) and the unknown-user 404 leave it off.
func putUser(t *testing.T, callerID, tenant, targetID, body string, seed bool, run func(t *testing.T, db *gorm.DB, keycloak *stubKeycloak)) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		if seed {
			seedEditableUser(t, env.Postgres, targetID)
		}
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: callerID}
		keycloak := &stubKeycloak{sub: targetID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.PUT("/users/:user_id", server.RequireAction(auth, authRepo, types.ActionManageUser),
			server.PutUserHandler(newUserAdmin(env.Postgres, keycloak), auth))

		req, _ := http.NewRequest("PUT", "/"+tenant+"/users/"+targetID, strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if run != nil {
			run(t, env.Postgres, keycloak)
		}
	})
	return w
}

func Test_UpdateUser_TenantAdmin_AppliesNameAndRoleDiff(t *testing.T) {
	type grantRow struct {
		RoleCode  string
		OrgCode   *string
		GrantedBy string
	}
	var grants []grantRow
	var name string
	var renamed [3]string

	w := putUser(t, taraID, "radiant", editedUserID, `{
		"first_name":"Edited","last_name":"Target",
		"roles":[{"role_code":"geneticist","org_codes":["CHUSJ"]},{"role_code":"researcher"}]
	}`, true, func(t *testing.T, db *gorm.DB, keycloak *stubKeycloak) {
		require.NoError(t, db.Raw(`
			SELECT role_code, org_code, granted_by FROM public.user_role
			WHERE user_id = ? AND tenant_code = 'radiant' ORDER BY role_code`, editedUserID).Scan(&grants).Error)
		require.NoError(t, db.Raw(`SELECT first_name FROM public.users WHERE user_id = ?`, editedUserID).Scan(&name).Error)
		renamed = keycloak.rename
	})

	require.Equal(t, http.StatusOK, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Equal(t, "Edited", name)
	assert.Equal(t, [3]string{editedUserID, "Edited", "Target"}, renamed, "the identity provider is kept in sync")

	require.Len(t, grants, 3)
	assert.Equal(t, "geneticist", grants[0].RoleCode)
	require.NotNil(t, grants[0].OrgCode)
	assert.Equal(t, "CHUSJ", *grants[0].OrgCode, "the CHOP grant is replaced, not added to")
	assert.Equal(t, taraID, grants[0].GrantedBy, "granted_by attributes the new grant to the acting admin")

	assert.Equal(t, "member", grants[1].RoleCode)
	assert.Equal(t, "seed", grants[1].GrantedBy, "an untouched grant keeps its original author")

	assert.Equal(t, "researcher", grants[2].RoleCode)
	assert.Nil(t, grants[2].OrgCode, "a tenant-scoped role is granted tenant-wide")
}

func Test_UpdateUser_OmittedRolesRevokeAllButMember(t *testing.T) {
	var roles []string

	w := putUser(t, taraID, "radiant", revokedUserID, `{"first_name":"Edit","last_name":"Target"}`, true,
		func(t *testing.T, db *gorm.DB, _ *stubKeycloak) {
			require.NoError(t, db.Raw(`
				SELECT role_code FROM public.user_role
				WHERE user_id = ? AND tenant_code = 'radiant'`, revokedUserID).Scan(&roles).Error)
		})

	require.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, []string{"member"}, roles)
}

func Test_UpdateUser_UnknownUser_NotFound(t *testing.T) {
	w := putUser(t, taraID, "radiant", "00000000-0000-4000-8000-000000000000",
		`{"first_name":"Nobody","last_name":"Here"}`, false, nil)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_UpdateUser_LastAdminLosingTheRole_Conflict(t *testing.T) {
	var roles []string

	// tara is radiant's only tenant_admin, and the payload leaves the role out.
	w := putUser(t, taraID, "radiant", taraID, `{"first_name":"Tara","last_name":"Admin"}`, false,
		func(t *testing.T, db *gorm.DB, _ *stubKeycloak) {
			require.NoError(t, db.Raw(`
				SELECT role_code FROM public.user_role
				WHERE user_id = ? AND tenant_code = 'radiant'`, taraID).Scan(&roles).Error)
		})

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.Equal(t, []string{"tenant_admin"}, roles, "the rejected edit wrote nothing")
}

func Test_UpdateUser_UnknownOrganization_BadRequest(t *testing.T) {
	w := putUser(t, taraID, "radiant", badOrgEditedID, `{
		"first_name":"Edit","last_name":"Target",
		"roles":[{"role_code":"geneticist","org_codes":["TENANT_B_ORG"]}]
	}`, true, nil)

	assert.Equal(t, http.StatusBadRequest, w.Code, "another tenant's org is not grantable in radiant")
}

func Test_UpdateUser_WithoutManageUser_Forbidden(t *testing.T) {
	// mike holds member only → the action gate 403s before the handler.
	w := putUser(t, mikeID, "radiant", forbiddenEdit, `{"first_name":"Edit","last_name":"Target"}`, false, nil)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_UpdateUser_CrossTenant_Forbidden(t *testing.T) {
	w := putUser(t, taraID, "tenant_b", editedUserID, `{"first_name":"Edit","last_name":"Target"}`, false, nil)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

// --- DELETE /:tenant/users/:user_id ------------------------------------------

const (
	deletedUserID      = "f1c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	multiTenantUserID  = "f2c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	forbiddenDeleteID  = "f3c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
	crossTenantDeleted = "f4c2c3c4-d5d6-4e70-8f90-a1a2a3a4a5a6"
)

// seedMultiTenantUser gives the revoke target access to a second tenant, so a test can assert the
// revoke is scoped to the tenant in the path. tenant_b has no member role of its own
// (test/data/auth/03_role.sql), hence researcher.
func seedMultiTenantUser(t *testing.T, db *gorm.DB, userID string) {
	t.Helper()
	seedEditableUser(t, db, userID)
	require.NoError(t, db.Exec(`
		INSERT INTO public.user_role (user_id, tenant_code, org_code, role_code, granted_by)
		VALUES (?, 'tenant_b', NULL, 'researcher', 'seed')`, userID).Error)
}

// seed provisions the target before the request; the tests that expect a rejection before any
// lookup (403) and the unknown-user 404 pass nil.
func deleteUser(t *testing.T, callerID, tenant, targetID string, seed func(*testing.T, *gorm.DB, string), run func(t *testing.T, db *gorm.DB)) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		if seed != nil {
			seed(t, env.Postgres, targetID)
		}
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: callerID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		tenantRoutes.DELETE("/users/:user_id", server.RequireAction(auth, authRepo, types.ActionManageUser),
			server.DeleteUserHandler(newUserAdmin(env.Postgres, &stubKeycloak{sub: targetID}), auth))

		req, _ := http.NewRequest("DELETE", "/"+tenant+"/users/"+targetID, nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if run != nil {
			run(t, env.Postgres)
		}
	})
	return w
}

func Test_DeleteUser_TenantAdmin_RevokesEveryGrantAndKeepsTheIdentity(t *testing.T) {
	var roles []string
	var identities int64

	w := deleteUser(t, taraID, "radiant", deletedUserID, seedEditableUser, func(t *testing.T, db *gorm.DB) {
		require.NoError(t, db.Raw(`
			SELECT role_code FROM public.user_role
			WHERE user_id = ? AND tenant_code = 'radiant'`, deletedUserID).Scan(&roles).Error)
		require.NoError(t, db.Raw(`
			SELECT count(*) FROM public.users WHERE user_id = ?`, deletedUserID).Scan(&identities).Error)
	})

	require.Equal(t, http.StatusNoContent, w.Code)
	assert.Empty(t, w.Body.String())
	assert.Empty(t, roles, "member is revoked too, unlike an edit")
	assert.Equal(t, int64(1), identities, "the identity survives — this revokes one tenant, not the account")
}

func Test_DeleteUser_LeavesTheUsersOtherTenantsAlone(t *testing.T) {
	var elsewhere []string

	w := deleteUser(t, taraID, "radiant", multiTenantUserID, seedMultiTenantUser, func(t *testing.T, db *gorm.DB) {
		require.NoError(t, db.Raw(`
			SELECT role_code FROM public.user_role
			WHERE user_id = ? AND tenant_code = 'tenant_b'`, multiTenantUserID).Scan(&elsewhere).Error)
	})

	require.Equal(t, http.StatusNoContent, w.Code)
	assert.Equal(t, []string{"researcher"}, elsewhere)
}

func Test_DeleteUser_UnknownUser_NotFound(t *testing.T) {
	w := deleteUser(t, taraID, "radiant", "00000000-0000-4000-8000-000000000000", nil, nil)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_DeleteUser_RemovingYourself_BadRequest(t *testing.T) {
	var roles []string

	w := deleteUser(t, taraID, "radiant", taraID, nil, func(t *testing.T, db *gorm.DB) {
		require.NoError(t, db.Raw(`
			SELECT role_code FROM public.user_role
			WHERE user_id = ? AND tenant_code = 'radiant'`, taraID).Scan(&roles).Error)
	})

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Equal(t, []string{"tenant_admin"}, roles, "the rejected revoke wrote nothing")
}

func Test_DeleteUser_WithoutManageUser_Forbidden(t *testing.T) {
	// mike holds member only → the action gate 403s before the handler.
	w := deleteUser(t, mikeID, "radiant", forbiddenDeleteID, nil, nil)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_DeleteUser_CrossTenant_Forbidden(t *testing.T) {
	w := deleteUser(t, taraID, "tenant_b", crossTenantDeleted, nil, nil)

	assert.Equal(t, http.StatusForbidden, w.Code)
}
