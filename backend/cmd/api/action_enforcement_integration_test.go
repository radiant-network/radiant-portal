package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// Enforcement tests for RequireAction against the real AuthRepository, plus the two guards that
// keep every /:tenant route consciously gated.
//
// Probe users, from the seeded fixtures (test/data/auth/06_user_role.sql + migration 000012):
//
//	wendy → geneticist @ '*'   → read_pii, interpret, comment, flag, download_file
//	mike  → member @ '*'       → search_case, view_kb
//	gabe  → data_manager @ '*' → ingest_data
//	alice → geneticist @ CHOP + researcher tenant-wide → search_case, view_kb
//
// alice is the negative for org-scoped actions: she holds them, but at CHOP, and RequireAction
// matches an org-scoped action only against a '*' grant. Per-resource org resolution — what
// production routes actually use — is tested in org_resolution_integration_test.go.
const (
	wendyID = "79a8855e-3782-4dc8-be2a-8afdb34d6359"
	mikeID  = "9f1d2c3b-4a5e-4f60-8c71-2d3e4f5a6b7c"
	gabeID  = "0a1b2c3d-4e5f-4061-8273-849506a7b8c9"
)

// assertActionEnforced runs RequireTenantAccess then RequireAction against the real repository
// and asserts the status for the given user.
func assertActionEnforced(t *testing.T, userID, action string, expectedStatus int) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.New()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, repo))
		tenantRoutes.GET("/probe", server.RequireAction(auth, repo, action), func(c *gin.Context) {
			c.Status(http.StatusOK)
		})

		req, _ := http.NewRequest("GET", "/radiant/probe", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, expectedStatus, w.Code)
	})
}

func Test_ActionEnforcement_SearchCase_GranteeAllowed(t *testing.T) {
	assertActionEnforced(t, aliceID, types.ActionSearchCase, http.StatusOK)
}

func Test_ActionEnforcement_SearchCase_WithoutActionDenied(t *testing.T) {
	// wendy belongs to radiant (geneticist '*') but holds no can_search_case.
	assertActionEnforced(t, wendyID, types.ActionSearchCase, http.StatusForbidden)
}

func Test_ActionEnforcement_InterpretVariant_WildcardGranteeAllowed(t *testing.T) {
	assertActionEnforced(t, wendyID, types.ActionInterpretVariant, http.StatusOK)
}

func Test_ActionEnforcement_InterpretVariant_SpecificOrgGranteeDenied(t *testing.T) {
	// alice's geneticist grant is at CHOP only, which an empty org does not match.
	assertActionEnforced(t, aliceID, types.ActionInterpretVariant, http.StatusForbidden)
}

func Test_ActionEnforcement_CommentVariant_WildcardGranteeAllowed(t *testing.T) {
	assertActionEnforced(t, wendyID, types.ActionCommentVariant, http.StatusOK)
}

func Test_ActionEnforcement_CommentVariant_WithoutActionDenied(t *testing.T) {
	assertActionEnforced(t, aliceID, types.ActionCommentVariant, http.StatusForbidden)
}

func Test_ActionEnforcement_FlagVariant_WildcardGranteeAllowed(t *testing.T) {
	assertActionEnforced(t, wendyID, types.ActionFlagVariant, http.StatusOK)
}

func Test_ActionEnforcement_FlagVariant_WithoutActionDenied(t *testing.T) {
	assertActionEnforced(t, aliceID, types.ActionFlagVariant, http.StatusForbidden)
}

func Test_ActionEnforcement_DownloadFile_GranteeAllowed(t *testing.T) {
	assertActionEnforced(t, wendyID, types.ActionDownloadFile, http.StatusOK)
}

func Test_ActionEnforcement_DownloadFile_WithoutActionDenied(t *testing.T) {
	assertActionEnforced(t, mikeID, types.ActionDownloadFile, http.StatusForbidden)
}

func Test_ActionEnforcement_IngestData_GranteeAllowed(t *testing.T) {
	assertActionEnforced(t, gabeID, types.ActionIngestData, http.StatusOK)
}

func Test_ActionEnforcement_IngestData_WithoutActionDenied(t *testing.T) {
	assertActionEnforced(t, aliceID, types.ActionIngestData, http.StatusForbidden)
}

// assertAnyActionEnforced is assertActionEnforced's RequireAnyAction twin: holding any one of
// the actions admits the caller.
func assertAnyActionEnforced(t *testing.T, userID string, actions []string, expectedStatus int) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		auth := &testutils.MockAuth{Id: userID}

		router := gin.New()
		tenantRoutes := router.Group("/:tenant")
		tenantRoutes.Use(server.RequireTenantAccess(auth, repo))
		tenantRoutes.GET("/probe", server.RequireAnyAction(auth, repo, actions...), func(c *gin.Context) {
			c.Status(http.StatusOK)
		})

		req, _ := http.NewRequest("GET", "/radiant/probe", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, expectedStatus, w.Code)
	})
}

func Test_ActionEnforcement_AnyAction_HoldsOnlyTheSecond_Allowed(t *testing.T) {
	// gabe holds can_ingest_data but no can_search_case — the second action is what admits him.
	assertAnyActionEnforced(t, gabeID, []string{types.ActionSearchCase, types.ActionIngestData}, http.StatusOK)
}

func Test_ActionEnforcement_AnyAction_HoldsNone_Denied(t *testing.T) {
	// mike is a plain member: neither management action, so the gate denies.
	assertAnyActionEnforced(t, mikeID, []string{types.ActionManageRole, types.ActionManageUser}, http.StatusForbidden)
}

// Test_TenantRoutesAreMappedToActions fails if a /:tenant route appears in none of the four
// route sets below, so a new route cannot ship ungated. It also checks the reverse, so a set
// cannot name a route that no longer exists.
func Test_TenantRoutesAreMappedToActions(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple", Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		os.Setenv("CORS_ALLOWED_ORIGINS", "*")
		defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

		router := setupRouter(env.Starrocks, env.Postgres)

		actual := map[string]bool{}
		for _, route := range router.Routes() {
			if !strings.HasPrefix(route.Path, "/:tenant") {
				continue
			}
			key := route.Method + " " + route.Path
			actual[key] = true
			_, mapped := expectedTenantActions[key]
			_, mappedToAny := expectedTenantAnyActions[key]
			_, memberOnly := membershipOnlyTenantRoutes[key]
			assert.Truef(t, mapped || mappedToAny || memberOnly, "route %q is not mapped to an action — gate it with RequireAction and add it to expectedTenantActions (or RequireAnyAction and expectedTenantAnyActions), or declare it in membershipOnlyTenantRoutes if it is intentionally member-readable", key)
		}

		// Reverse direction: every mapped route must still exist, so the maps can't rot.
		for key := range expectedTenantActions {
			assert.Truef(t, actual[key], "mapped route %q is no longer registered — remove it from expectedTenantActions", key)
		}
		for key := range expectedTenantAnyActions {
			assert.Truef(t, actual[key], "mapped route %q is no longer registered — remove it from expectedTenantAnyActions", key)
		}
		for key := range membershipOnlyTenantRoutes {
			assert.Truef(t, actual[key], "member-only route %q is no longer registered — remove it from membershipOnlyTenantRoutes", key)
		}
	})
}

// Gated by tenant membership alone: referential reads any member may see.
var membershipOnlyTenantRoutes = map[string]bool{
	"GET /:tenant/organizations": true,
}

// RequireAnyAction: any one of the listed actions admits. Reads shared by several admin sections.
var expectedTenantAnyActions = map[string][]string{
	"GET /:tenant/roles":       {types.ActionManageRole, types.ActionManageUser},
	"GET /:tenant/roles/:code": {types.ActionManageRole, types.ActionManageUser},
}

// Checked against the resource's own organization: a resolver walks the resource back to its
// case and takes that case's diagnosis_lab_code.
var orgResolvedTenantRoutes = map[string]bool{
	"POST /:tenant/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id": true,
	"POST /:tenant/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id":  true,
	"POST /:tenant/notes":       true,
	"PUT /:tenant/notes/:id":    true,
	"DELETE /:tenant/notes/:id": true,
	"POST /:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id":   true,
	"DELETE /:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id": true,
	"GET /:tenant/documents/:document_id/download_url":                           true,
	// One lab per record, and the action is required at every one of them.
	"POST /:tenant/cases/batch":  true,
	"PATCH /:tenant/cases/batch": true,
	"PUT /:tenant/cases/batch":   true,
}

// Org-scoped action, but nothing in the request names an organization: these batch records are
// not attached to a case yet, and a batch row carries no org. RequireActionInTenant admits the
// action held anywhere in the tenant.
//
// RequireAction would be wrong here — it matches an org-scoped action only against '*' grants,
// refusing every specific-org grantee.
var inTenantOrgActionRoutes = map[string]bool{
	"GET /:tenant/batches/:batch_id": true,
	"POST /:tenant/patients/batch":   true,
	"PUT /:tenant/patients/batch":    true,
	"POST /:tenant/samples/batch":    true,
	"PUT /:tenant/samples/batch":     true,
	"POST /:tenant/sequencing/batch": true,
	"PUT /:tenant/sequencing/batch":  true,
}

// Test_OrgScopedRoutesResolveTheirOrg reads each action's scope from the catalog and fails if a
// route on an org-scoped action is in neither orgResolvedTenantRoutes nor
// inTenantOrgActionRoutes — that is, if it was left on RequireAction.
func Test_OrgScopedRoutesResolveTheirOrg(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		actions, err := repo.ListActions(t.Context())
		assert.NoError(t, err)

		scopes := map[string]string{}
		for _, action := range actions {
			scopes[action.Code] = action.Scope
		}

		for route, action := range expectedTenantActions {
			scope, known := scopes[action]
			assert.Truef(t, known, "route %q maps to unknown action %q", route, action)
			if scope != types.ActionScopeOrg {
				assert.Falsef(t, orgResolvedTenantRoutes[route], "route %q maps to the tenant-scoped action %q, so it pays for an org lookup it ignores — use requireAction", route, action)
				continue
			}
			assert.Truef(t, orgResolvedTenantRoutes[route] || inTenantOrgActionRoutes[route],
				"route %q is gated on the org-scoped action %q but resolves no org — gate it with requireActionAt and a resolver, then declare it in orgResolvedTenantRoutes, or gate it with requireActionInTenant and declare it in inTenantOrgActionRoutes if the request names no org", route, action)
		}

		for route := range orgResolvedTenantRoutes {
			_, mapped := expectedTenantActions[route]
			assert.Truef(t, mapped, "org-resolved route %q is no longer mapped — remove it from orgResolvedTenantRoutes", route)
		}
		for route := range inTenantOrgActionRoutes {
			_, mapped := expectedTenantActions[route]
			assert.Truef(t, mapped, "in-tenant route %q is no longer mapped — remove it from inTenantOrgActionRoutes", route)
		}
	})
}

// Every gated /:tenant route and the action it requires, mirroring setupRouter.
var expectedTenantActions = map[string]string{
	"POST /:tenant/roles":                                        types.ActionManageRole,
	"PUT /:tenant/roles/:code":                                   types.ActionManageRole,
	"DELETE /:tenant/roles/:code":                                types.ActionManageRole,
	"GET /:tenant/users":                                         types.ActionManageUser,
	"POST /:tenant/users":                                        types.ActionManageUser,
	"PUT /:tenant/users/:user_id":                                types.ActionManageUser,
	"DELETE /:tenant/users/:user_id":                             types.ActionManageUser,
	"POST /:tenant/organizations":                                types.ActionManageOrg,
	"PUT /:tenant/organizations/:code":                           types.ActionManageOrg,
	"POST /:tenant/cases/search":                                 types.ActionSearchCase,
	"GET /:tenant/cases/autocomplete":                            types.ActionSearchCase,
	"GET /:tenant/cases/filters":                                 types.ActionSearchCase,
	"GET /:tenant/cases/:case_id":                                types.ActionSearchCase,
	"POST /:tenant/cases/:case_id/documents/search":              types.ActionSearchCase,
	"GET /:tenant/cases/:case_id/documents/filters":              types.ActionSearchCase,
	"GET /:tenant/cases/:case_id/:seq_id/tasks_with_occurrences": types.ActionSearchCase,
	"GET /:tenant/genes/autocomplete":                            types.ActionSearchCase,
	"POST /:tenant/genes/search":                                 types.ActionSearchCase,
	"GET /:tenant/hpo/autocomplete":                              types.ActionSearchCase,
	"GET /:tenant/igv/:case_id":                                  types.ActionSearchCase,
	"GET /:tenant/interpretations/pubmed/:citation_id":           types.ActionSearchCase,
	"GET /:tenant/interpretations/germline":                      types.ActionSearchCase,
	"GET /:tenant/interpretations/somatic":                       types.ActionSearchCase,
	"GET /:tenant/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id":  types.ActionSearchCase,
	"POST /:tenant/interpretations/v2/germline/:case_id/:sequencing_id/:locus_id/:transcript_id": types.ActionInterpretVariant,
	"GET /:tenant/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id":   types.ActionSearchCase,
	"POST /:tenant/interpretations/v2/somatic/:case_id/:sequencing_id/:locus_id/:transcript_id":  types.ActionInterpretVariant,
	"GET /:tenant/mondo/autocomplete":                                                       types.ActionSearchCase,
	"POST /:tenant/notes":                                                                   types.ActionCommentVariant,
	"PUT /:tenant/notes/:id":                                                                types.ActionCommentVariant,
	"DELETE /:tenant/notes/:id":                                                             types.ActionCommentVariant,
	"GET /:tenant/notes/:case_id/:seq_id/:task_id/:occurrence_id":                           types.ActionSearchCase,
	"GET /:tenant/notes/:case_id/:seq_id/:task_id/:occurrence_id/count":                     types.ActionSearchCase,
	"POST /:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id":              types.ActionFlagVariant,
	"DELETE /:tenant/occurrences/flags/:case_id/:seq_id/:task_id/:occurrence_id":            types.ActionFlagVariant,
	"POST /:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/count":                types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/list":                 types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/aggregate":            types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/statistics":           types.ActionSearchCase,
	"GET /:tenant/occurrences/germline/cnv/:case_id/:seq_id/:task_id/:cnv_id/genes_overlap": types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/count":                types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/list":                 types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/aggregate":            types.ActionSearchCase,
	"POST /:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/statistics":           types.ActionSearchCase,
	"GET /:tenant/occurrences/germline/snv/:case_id/:seq_id/:task_id/:locus_id/expanded":    types.ActionSearchCase,
	"GET /:tenant/occurrences/germline/snv/dictionary":                                      types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/count":                 types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/list":                  types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/aggregate":             types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/statistics":            types.ActionSearchCase,
	"GET /:tenant/occurrences/somatic/cnv/:case_id/:seq_id/:task_id/:cnv_id/genes_overlap":  types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/count":                 types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/list":                  types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/aggregate":             types.ActionSearchCase,
	"POST /:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/statistics":            types.ActionSearchCase,
	"GET /:tenant/occurrences/somatic/snv/:case_id/:seq_id/:task_id/:locus_id/expanded":     types.ActionSearchCase,
	"GET /:tenant/sequencing/:seq_id/details":                                               types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/header":                                       types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/overview":                                     types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/consequences":                                 types.ActionSearchCase,
	"POST /:tenant/variants/germline/:locus_id/cases/interpreted":                           types.ActionSearchCase,
	"POST /:tenant/variants/germline/:locus_id/cases/uninterpreted":                         types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/cases/count":                                  types.ActionSearchCase,
	"GET /:tenant/variants/germline/cases/filters":                                          types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/conditions/:panel_type":                       types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/conditions/clinvar":                           types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/external_frequencies":                         types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/internal_frequencies":                         types.ActionSearchCase,
	"GET /:tenant/variants/germline/:locus_id/internal_frequencies/global":                  types.ActionSearchCase,
	"POST /:tenant/documents/search":                                                        types.ActionSearchCase,
	"GET /:tenant/documents/autocomplete":                                                   types.ActionSearchCase,
	"GET /:tenant/documents/filters":                                                        types.ActionSearchCase,
	"GET /:tenant/documents/:document_id/download_url":                                      types.ActionDownloadFile,
	"GET /:tenant/batches/:batch_id":                                                        types.ActionIngestData,
	"POST /:tenant/patients/batch":                                                          types.ActionIngestData,
	"PUT /:tenant/patients/batch":                                                           types.ActionIngestData,
	"POST /:tenant/samples/batch":                                                           types.ActionIngestData,
	"PUT /:tenant/samples/batch":                                                            types.ActionIngestData,
	"POST /:tenant/sequencing/batch":                                                        types.ActionIngestData,
	"PUT /:tenant/sequencing/batch":                                                         types.ActionIngestData,
	"POST /:tenant/cases/batch":                                                             types.ActionIngestData,
	"PATCH /:tenant/cases/batch":                                                            types.ActionIngestData,
	"PUT /:tenant/cases/batch":                                                              types.ActionIngestData,
}
