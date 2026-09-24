package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/notification"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// caseGroupsRouter mirrors the /:tenant/case_groups wiring of setupRouter: tenant membership, then
// can_ingest_data in-tenant to write (gabe: data_manager '*') and can_search_case to read (mike: member).
func caseGroupsRouter(env *testutils.Env, userID string) *gin.Engine {
	pg := database.PostgresDB{DB: env.Postgres}
	authRepo := postgres.NewAuthRepository(pg)
	repo := postgres.NewCaseGroupsRepository(pg)
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, authRepo))
	tenantRoutes.POST("/case_groups", server.RequireActionInTenant(auth, authRepo, types.ActionIngestData), server.PostCaseGroupHandler(repo, auth))
	tenantRoutes.GET("/case_groups/:name", server.RequireAction(auth, authRepo, types.ActionSearchCase), server.GetCaseGroupHandler(repo))
	return router
}

type captureMailer struct{ sent []notification.Message }

func (m *captureMailer) Send(_ context.Context, msg notification.Message) error {
	m.sent = append(m.sent, msg)
	return nil
}

const radiantTestTemplate = `{{define "subject"}}{{if .HasStat}}[STAT] {{end}}New data for {{.OrganizationName}}{{end}}
{{define "body"}}<p>{{len .Cases}} case(s), {{.DocumentCount}} file(s): <code>{{.ManifestFilename}}</code></p>{{end}}`

// notifyRouter adds the notify route on top of caseGroupsRouter's wiring, with a capturing mailer,
// fixed settings and the templates loaded from dir (empty dir = no template for any tenant).
func notifyRouter(env *testutils.Env, userID string, dir string, mailer *captureMailer) *gin.Engine {
	pg := database.PostgresDB{DB: env.Postgres}
	authRepo := postgres.NewAuthRepository(pg)
	repo := postgres.NewCaseGroupsRepository(pg)
	svc := notification.NewService(repo, postgres.NewOrganizationRepository(pg), notification.LoadTemplates(dir), mailer).
		WithSettings(func() (notification.Settings, error) {
			return notification.Settings{PortalURL: "https://portal.invalid", CC: []string{}, BCC: []string{"bcc@lab.invalid"}, Location: time.UTC}, nil
		})
	auth := &testutils.MockAuth{Id: userID}

	router := caseGroupsRouter(env, userID)
	router.POST("/:tenant/case_groups/:name/notify", server.RequireTenantAccess(auth, authRepo), server.RequireActionInTenant(auth, authRepo, types.ActionIngestData), server.PostCaseGroupNotifyHandler(svc))
	return router
}

func templateDir(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "manifest_radiant.tmpl"), []byte(radiantTestTemplate), 0o600))
	return dir
}

// seedLabCase inserts a case at LDM-CHUSJ (two seeded emails, no documents) so a group holding it
// exercises the contact path while the seeded case 1 (CQGC, no emails, documents) exercises the other.
func seedLabCase(t *testing.T, env *testutils.Env, caseID int) {
	t.Helper()
	repo := postgres.NewCasesRepository(database.PostgresDB{DB: env.Postgres})
	lab := "LDM-CHUSJ"
	require.NoError(t, repo.CreateCase(t.Context(), &types.Case{
		ID: caseID, ProbandID: 1, ProjectID: 1, StatusCode: "in_progress", DiagnosisLabCode: &lab, OrderingOrganizationCode: &lab,
		AnalysisCatalogID: 1, PriorityCode: "stat", CaseTypeCode: "germline", CaseCategoryCode: "postnatal",
		SubmitterCaseID: fmt.Sprintf("notify-%d", caseID), TenantCode: types.DefaultTenantCode,
	}))
	t.Cleanup(func() { env.Postgres.Exec("DELETE FROM cases WHERE id = ?", caseID) })
}

func serve(router *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
	req, _ := http.NewRequest(method, path, strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func trackCaseGroup(t *testing.T, env *testutils.Env, name string) {
	t.Helper()
	t.Cleanup(func() { env.Postgres.Exec("DELETE FROM case_group WHERE tenant_code = 'radiant' AND name = ?", name) })
}

// Seeded cases 1 and 2 exist in tenant radiant (test/data/clinical/03_cases.sql).

func Test_PostCaseGroup_DataManager_CreatesAndReturnsIds(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_create")
		router := caseGroupsRouter(env, gabeID)

		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_create","case_ids":[2,1]}`)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"name":"it_cg_create","tenant_code":"radiant","case_ids":[1,2]}`, w.Body.String())
	})
}

func Test_PostCaseGroup_SameName_Overwrites(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_overwrite")
		router := caseGroupsRouter(env, gabeID)

		require.Equal(t, http.StatusOK, serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_overwrite","case_ids":[1,2]}`).Code)
		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_overwrite","case_ids":[2]}`)
		assert.Equal(t, http.StatusOK, w.Code)

		// data_manager alone does not carry can_search_case; reads go through a member.
		got := serve(caseGroupsRouter(env, mikeID), "GET", "/radiant/case_groups/it_cg_overwrite", "")
		assert.Equal(t, http.StatusOK, got.Code)
		assert.JSONEq(t, `{"name":"it_cg_overwrite","tenant_code":"radiant","case_ids":[2]}`, got.Body.String())
	})
}

func Test_PostCaseGroup_UnknownCase_400(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_unknown")
		router := caseGroupsRouter(env, gabeID)

		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_unknown","case_ids":[1,999999]}`)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		assert.JSONEq(t, `{"status":400,"message":"unknown case ids in this tenant: [999999]"}`, w.Body.String())
		assert.Equal(t, http.StatusNotFound, serve(caseGroupsRouter(env, mikeID), "GET", "/radiant/case_groups/it_cg_unknown", "").Code)
	})
}

func Test_PostCaseGroup_Member_Forbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := caseGroupsRouter(env, mikeID)

		w := serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_forbidden","case_ids":[1]}`)

		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}

func Test_GetCaseGroup_Member_CanRead(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_member_read")
		require.Equal(t, http.StatusOK, serve(caseGroupsRouter(env, gabeID), "POST", "/radiant/case_groups", `{"name":"it_cg_member_read","case_ids":[1]}`).Code)

		w := serve(caseGroupsRouter(env, mikeID), "GET", "/radiant/case_groups/it_cg_member_read", "")

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"name":"it_cg_member_read","tenant_code":"radiant","case_ids":[1]}`, w.Body.String())
	})
}

func Test_GetCaseGroup_Unknown_404(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := caseGroupsRouter(env, mikeID)

		w := serve(router, "GET", "/radiant/case_groups/it_cg_missing", "")

		assert.Equal(t, http.StatusNotFound, w.Code)
		assert.JSONEq(t, `{"status":404,"message":"case group not found"}`, w.Body.String())
	})
}

func Test_GetCaseGroup_DataManagerWithoutSearch_Forbidden(t *testing.T) {
	// gabe holds data_manager only: can_ingest_data, no can_search_case → 403 on the read.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		assert.Equal(t, http.StatusForbidden, serve(caseGroupsRouter(env, gabeID), "GET", "/radiant/case_groups/whatever", "").Code)
	})
}

func Test_GetCaseGroup_CrossTenant_Forbidden(t *testing.T) {
	// mike has no grant in tenant_b → RequireTenantAccess rejects before the handler runs.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := caseGroupsRouter(env, mikeID)

		assert.Equal(t, http.StatusForbidden, serve(router, "GET", "/tenant_b/case_groups/it_cg_create", "").Code)
	})
}

func Test_NotifyCaseGroup_DataManager_ReportsPerLab(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_notify")
		seedLabCase(t, env, 1226)
		mailer := &captureMailer{}
		router := notifyRouter(env, gabeID, templateDir(t), mailer)
		require.Equal(t, http.StatusOK, serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_notify","case_ids":[1,1226]}`).Code)

		w := serve(router, "POST", "/radiant/case_groups/it_cg_notify/notify", "")

		require.Equal(t, http.StatusOK, w.Code, w.Body.String())
		var resp types.NotifyCaseGroupResponse
		require.NoError(t, json.Unmarshal(w.Body.Bytes(), &resp))
		assert.Equal(t, types.CaseGroupResponse{Name: "it_cg_notify", TenantCode: "radiant", CaseIDs: []int{1, 1226}}, resp.Group)
		require.Len(t, resp.Emails, 2)

		cqgc, ldm := resp.Emails[0], resp.Emails[1]
		assert.Equal(t, "CQGC", cqgc.OrganizationCode)
		assert.Equal(t, types.CaseGroupEmailSkippedNoContact, cqgc.Status, "seeded CQGC has no notification_emails")
		assert.Positive(t, cqgc.DocumentCount, "seeded case 1 has output documents")
		assert.Equal(t, []int{1}, cqgc.Context.CaseIDs)
		assert.Equal(t, "manifest_radiant.tmpl", cqgc.Template)

		assert.Equal(t, "LDM-CHUSJ", ldm.OrganizationCode)
		assert.Equal(t, types.CaseGroupEmailSkippedNoDocuments, ldm.Status, "fresh case has no documents yet")
		assert.Equal(t, []string{"ldm-chusj@example.invalid", "ldm-chusj-bis@example.invalid"}, ldm.Recipients)
		assert.True(t, ldm.Context.HasStat)
		assert.Regexp(t, `^it_cg_notify_\d{8}_manifest\.tsv$`, ldm.Context.ManifestFilename)

		assert.Empty(t, mailer.sent, "no lab had both documents and a contact")
	})
}

func Test_NotifyCaseGroup_TemplateMissing_500_NothingSent(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		trackCaseGroup(t, env, "it_cg_notify_tmpl")
		mailer := &captureMailer{}
		router := notifyRouter(env, gabeID, t.TempDir(), mailer)
		require.Equal(t, http.StatusOK, serve(router, "POST", "/radiant/case_groups", `{"name":"it_cg_notify_tmpl","case_ids":[1]}`).Code)

		w := serve(router, "POST", "/radiant/case_groups/it_cg_notify_tmpl/notify", "")

		assert.Equal(t, http.StatusInternalServerError, w.Code)
		assert.JSONEq(t, `{"status":500,"message":"Internal Server Error"}`, w.Body.String())
		assert.Empty(t, mailer.sent)
	})
}

func Test_NotifyCaseGroup_Unknown_404(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := notifyRouter(env, gabeID, templateDir(t), &captureMailer{})
		w := serve(router, "POST", "/radiant/case_groups/does_not_exist/notify", "")
		assert.Equal(t, http.StatusNotFound, w.Code)
	})
}

func Test_NotifyCaseGroup_Member_Forbidden(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		router := notifyRouter(env, mikeID, templateDir(t), &captureMailer{})
		w := serve(router, "POST", "/radiant/case_groups/whatever/notify", "")
		assert.Equal(t, http.StatusForbidden, w.Code)
	})
}
