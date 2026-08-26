package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func listRoles(t *testing.T, userID, tenant string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		rolesRepo := postgres.NewRolesRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		// Mirrors production: either management action opens the catalog.
		tenantRoutes.GET("/roles", server.RequireAnyAction(auth, authRepo, types.ActionManageRole, types.ActionManageUser), server.ListRolesHandler(rolesRepo))

		req, _ := http.NewRequest("GET", "/"+tenant+"/roles", nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_ListRoles_RoleManager_ReturnsTenantCatalog(t *testing.T) {
	w := listRoles(t, taraID, "radiant")
	require.Equal(t, http.StatusOK, w.Code)

	var roles []types.RoleResult
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &roles))

	byCode := map[string]types.RoleResult{}
	for _, role := range roles {
		byCode[role.Code] = role
	}
	assert.NotContains(t, byCode, types.RoleMember, "the implicit member role is not part of the catalog")
	assert.True(t, byCode["geneticist"].IsDefault)
	assert.False(t, byCode["practitioner"].IsDefault)
	assert.Equal(t, types.RoleScopeMixed, byCode["practitioner"].Scope)
	assert.NotEmpty(t, byCode["geneticist"].Actions)
}

func Test_ListRoles_WithoutEitherManagementActionDenied(t *testing.T) {
	// mike is a radiant member: tenant access passes, the action gate is what denies.
	w := listRoles(t, mikeID, "radiant")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_ListRoles_CrossTenant_Forbidden(t *testing.T) {
	// tara manages roles in radiant only → RequireTenantAccess rejects before the handler runs.
	w := listRoles(t, taraID, "tenant_b")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func getRole(t *testing.T, userID, tenant, code string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		rolesRepo := postgres.NewRolesRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.Default()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
		// Mirrors production: the detail shares the list's gate.
		tenantRoutes.GET("/roles/:code", server.RequireAnyAction(auth, authRepo, types.ActionManageRole, types.ActionManageUser), server.GetRoleHandler(rolesRepo))

		req, _ := http.NewRequest("GET", "/"+tenant+"/roles/"+code, nil)
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_GetRole_RoleManager_ReturnsSeededRole(t *testing.T) {
	w := getRole(t, taraID, "radiant", "geneticist")
	require.Equal(t, http.StatusOK, w.Code)

	var role types.RoleResult
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &role))

	assert.Equal(t, "geneticist", role.Code)
	assert.True(t, role.IsDefault)
	assert.Equal(t, types.RoleScopeOrg, role.Scope)
	assert.NotEmpty(t, role.Actions)
}

func Test_GetRole_RoleManager_ReturnsCustomRoleWithMixedScope(t *testing.T) {
	w := getRole(t, taraID, "radiant", "practitioner")
	require.Equal(t, http.StatusOK, w.Code)

	var role types.RoleResult
	require.NoError(t, json.Unmarshal(w.Body.Bytes(), &role))

	assert.False(t, role.IsDefault)
	assert.Equal(t, types.RoleScopeMixed, role.Scope)
}

func Test_GetRole_UnknownRole_NotFound(t *testing.T) {
	w := getRole(t, taraID, "radiant", "no_such_role")

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_GetRole_WithoutEitherManagementActionDenied(t *testing.T) {
	// mike is a radiant member: tenant access passes, the action gate is what denies.
	w := getRole(t, mikeID, "radiant", "geneticist")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_GetRole_CrossTenant_Forbidden(t *testing.T) {
	// tara manages roles in radiant only → RequireTenantAccess rejects before the handler runs.
	w := getRole(t, taraID, "tenant_b", "geneticist")

	assert.Equal(t, http.StatusForbidden, w.Code)
}

// postRoleRouter mirrors production's wiring for the create route: tenant membership, then the
// can_manage_role gate alone — can_manage_user does not open it.
func postRoleRouter(env *testutils.Env, userID string) (*gin.Engine, *postgres.RolesRepository) {
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
	rolesRepo := postgres.NewRolesRepository(database.PostgresDB{DB: env.Postgres})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.Default()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.POST("/roles", server.RequireAction(auth, authRepo, types.ActionManageRole), server.PostRoleHandler(rolesRepo))
	return router, rolesRepo
}

func postRole(t *testing.T, userID, tenant, body string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router, _ := postRoleRouter(env, userID)
		req, _ := http.NewRequest("POST", "/"+tenant+"/roles", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w = httptest.NewRecorder()
		router.ServeHTTP(w, req)
	})
	return w
}

func Test_PostRole_RoleManager_CreatesRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const code = "zz_int_reviewer"
		defer env.Postgres.Exec("DELETE FROM role WHERE tenant_code = 'radiant' AND code = ?", code)

		router, repo := postRoleRouter(env, taraID)
		body := `{"code":"` + code + `","name_en":"ZZ Integration Reviewer","description_en":"Created by the integration test.","actions":["can_search_case","can_read_pii"]}`
		req, _ := http.NewRequest("POST", "/radiant/roles", strings.NewReader(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		require.Equal(t, http.StatusCreated, w.Code)
		assert.Empty(t, w.Body.String(), "the create endpoints answer an empty 201")

		// The role is really in the catalog, with its actions mapped.
		stored, err := repo.GetTenantRole(t.Context(), "radiant", code)
		require.NoError(t, err)
		require.NotNil(t, stored)
		assert.Equal(t, code, stored.Code)
		assert.Equal(t, "ZZ Integration Reviewer", stored.Name)
		assert.False(t, stored.IsDefault, "a role created through the API stays editable")
		assert.Equal(t, types.RoleScopeMixed, stored.Scope)
		assert.EqualValues(t, 0, stored.AssignedUsersCount)
		assert.Len(t, stored.Actions, 2)
	})
}

func Test_PostRole_ClashWithSeededRoleName_Conflict(t *testing.T) {
	// "Geneticist" is seeded in radiant; the name is unique per tenant, so this is a 409.
	w := postRole(t, taraID, "radiant", `{"code":"zz_int_clash","name_en":"Geneticist","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t,
		`{"status":409,"message":"a role with the same name_en already exists in this tenant","detail":{"field":"name_en"}}`,
		w.Body.String(), "the 409 names the field so the form flags name_en alone")
}

func Test_PostRole_ClashWithSeededRoleCode_Conflict(t *testing.T) {
	// The seeded geneticist's code, under a name nothing else carries: only the code collides.
	w := postRole(t, taraID, "radiant", `{"code":"geneticist","name_en":"ZZ Int Free Name","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t,
		`{"status":409,"message":"a role with the same code already exists in this tenant","detail":{"field":"code"}}`,
		w.Body.String())
}

func Test_PostRole_ClashWithSeededFrenchName_Conflict(t *testing.T) {
	// "Généticien" is the seeded geneticist's French name, supplied here as name_fr.
	w := postRole(t, taraID, "radiant",
		`{"code":"zz_int_clash_fr","name_en":"ZZ Int Clash Fr","name_fr":"Généticien","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusConflict, w.Code)
	assert.JSONEq(t,
		`{"status":409,"message":"a role with the same name_fr already exists in this tenant","detail":{"field":"name_fr"}}`,
		w.Body.String())
}

func Test_PostRole_ReservedAction_Unprocessable(t *testing.T) {
	// can_manage_user is not grantable, which is what makes tenant_admin un-duplicable.
	w := postRole(t, taraID, "radiant", `{"code":"zz_int_admin","name_en":"ZZ Almost Admin","actions":["can_manage_user"]}`)

	assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
	assert.Contains(t, w.Body.String(), "can_manage_user")
}

func Test_PostRole_InvalidCode_BadRequest(t *testing.T) {
	w := postRole(t, taraID, "radiant", `{"code":"ZZ-Int-Bad","name_en":"ZZ Int Bad","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PostRole_WithoutManageRoleDenied(t *testing.T) {
	// mike is a radiant member: tenant access passes, the action gate is what denies.
	w := postRole(t, mikeID, "radiant", `{"code":"zz_int_denied","name_en":"ZZ Int Denied","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

func Test_PostRole_CrossTenant_Forbidden(t *testing.T) {
	// tara manages roles in radiant only → RequireTenantAccess rejects before the handler runs.
	w := postRole(t, taraID, "tenant_b", `{"code":"zz_int_cross","name_en":"ZZ Int Cross","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
}

// putRoleRouter mirrors production's wiring for the edit route: tenant membership, then the
// can_manage_role gate alone — can_manage_user does not open it.
func putRoleRouter(env *testutils.Env, userID string) (*gin.Engine, *postgres.RolesRepository) {
	authRepo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
	rolesRepo := postgres.NewRolesRepository(database.PostgresDB{DB: env.Postgres})
	auth := &testutils.MockAuth{Id: userID}

	router := gin.Default()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.PUT("/roles/:code", server.RequireAction(auth, authRepo, types.ActionManageRole), server.PutRoleHandler(rolesRepo))
	return router, rolesRepo
}

func servePutRoleRequest(router *gin.Engine, tenant, code, body string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest("PUT", "/"+tenant+"/roles/"+code, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func putRole(t *testing.T, userID, tenant, code, body string) *httptest.ResponseRecorder {
	t.Helper()
	var w *httptest.ResponseRecorder
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router, _ := putRoleRouter(env, userID)
		w = servePutRoleRequest(router, tenant, code, body)
	})
	return w
}

func Test_PutRole_RoleManager_EditsRole(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const code = "zz_int_editable"
		defer env.Postgres.Exec("DELETE FROM role WHERE tenant_code = 'radiant' AND code = ?", code)

		router, repo := putRoleRouter(env, taraID)
		require.NoError(t, repo.CreateRole(t.Context(), "radiant", types.CreateRoleRequest{
			Code:          code,
			NameEn:        "ZZ Integration Editable",
			DescriptionEn: "Created by the integration test.",
			Actions:       []string{types.ActionSearchCase},
		}))

		body := `{"name_en":"ZZ Integration Edited","description_en":"Edited by the integration test.","actions":["can_view_kb","can_read_pii"]}`
		w := servePutRoleRequest(router, "radiant", code, body)

		require.Equal(t, http.StatusOK, w.Code)
		assert.Empty(t, w.Body.String(), "the edit endpoint answers an empty 200")

		stored, err := repo.GetTenantRole(t.Context(), "radiant", code)
		require.NoError(t, err)
		require.NotNil(t, stored)
		assert.Equal(t, code, stored.Code, "the code is immutable")
		assert.Equal(t, "ZZ Integration Edited", stored.Name)
		assert.Equal(t, "Edited by the integration test.", stored.Description)
		assert.False(t, stored.IsDefault)
		assert.Equal(t, types.RoleScopeMixed, stored.Scope, "re-derived from the new actions")
		assert.Len(t, stored.Actions, 2)
	})
}

func Test_PutRole_DefaultRole_Forbidden(t *testing.T) {
	// geneticist is seeded in radiant with is_default = true: tara holds can_manage_role, so the
	// gate passes and the role itself is what refuses the edit.
	w := putRole(t, taraID, "radiant", "geneticist", `{"name_en":"ZZ Int Renamed","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.JSONEq(t,
		`{"status":403,"message":"cannot edit a default role"}`,
		w.Body.String(), "the reason distinguishes a locked role from a missing action")
}

func Test_PutRole_UnknownRole_NotFound(t *testing.T) {
	w := putRole(t, taraID, "radiant", "no_such_role", `{"name_en":"ZZ Int Ghost","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusNotFound, w.Code)
}

func Test_PutRole_ClashWithSeededRoleName_Conflict(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const code = "zz_int_clash_edit"
		defer env.Postgres.Exec("DELETE FROM role WHERE tenant_code = 'radiant' AND code = ?", code)

		router, repo := putRoleRouter(env, taraID)
		require.NoError(t, repo.CreateRole(t.Context(), "radiant", types.CreateRoleRequest{
			Code: code, NameEn: "ZZ Int Clash Edit", Actions: []string{types.ActionViewKb},
		}))

		// "Geneticist" is seeded in radiant; the name is unique per tenant, so this is a 409.
		w := servePutRoleRequest(router, "radiant", code, `{"name_en":"Geneticist","actions":["can_view_kb"]}`)

		assert.Equal(t, http.StatusConflict, w.Code)
		assert.JSONEq(t,
			`{"status":409,"message":"a role with the same name_en already exists in this tenant","detail":{"field":"name_en"}}`,
			w.Body.String(), "the 409 names the field so the form flags name_en alone")
	})
}

func Test_PutRole_ReservedAction_Unprocessable(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		const code = "zz_int_escalate"
		defer env.Postgres.Exec("DELETE FROM role WHERE tenant_code = 'radiant' AND code = ?", code)

		router, repo := putRoleRouter(env, taraID)
		require.NoError(t, repo.CreateRole(t.Context(), "radiant", types.CreateRoleRequest{
			Code: code, NameEn: "ZZ Int Escalate", Actions: []string{types.ActionViewKb},
		}))

		// Editing is not a way around the refusal at creation: can_manage_user stays reserved.
		w := servePutRoleRequest(router, "radiant", code, `{"name_en":"ZZ Int Escalate","actions":["can_manage_user"]}`)

		assert.Equal(t, http.StatusUnprocessableEntity, w.Code)
		assert.Contains(t, w.Body.String(), "can_manage_user")

		unchanged, err := repo.GetTenantRole(t.Context(), "radiant", code)
		require.NoError(t, err)
		assert.Equal(t, []string{types.ActionViewKb}, []string{unchanged.Actions[0].Code})
	})
}

func Test_PutRole_EmptyActions_BadRequest(t *testing.T) {
	w := putRole(t, taraID, "radiant", "practitioner", `{"name_en":"ZZ Int Empty","actions":[]}`)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func Test_PutRole_WithoutManageRoleDenied(t *testing.T) {
	// mike is a radiant member: tenant access passes, the action gate is what denies.
	w := putRole(t, mikeID, "radiant", "practitioner", `{"name_en":"ZZ Int Denied","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.JSONEq(t, `{"status":403,"message":"Forbidden"}`, w.Body.String(),
		"the action gate stays generic — it never says which action is missing")
}

func Test_PutRole_CrossTenant_Forbidden(t *testing.T) {
	// tara manages roles in radiant only → RequireTenantAccess rejects before the handler runs.
	w := putRole(t, taraID, "tenant_b", "researcher", `{"name_en":"ZZ Int Cross","actions":["can_view_kb"]}`)

	assert.Equal(t, http.StatusForbidden, w.Code)
}
