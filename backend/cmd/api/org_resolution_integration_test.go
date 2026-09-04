package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/server"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// Every fixture case carries diagnosis_lab_code 'CQGC', so a grant there is the positive and
// alice's geneticist grant at CHOP is the negative: same action, same case, different lab.
// The positive's grantee is seeded per test rather than added to the shared auth fixture,
// which the users-list tests assert against.
const (
	carolID     = "b6e6d0dd-7aa5-4018-ae03-1f5076801360"
	caseAtCQGC  = "1"
	unknownCase = "999999"
	// Document 245 hangs off task 4, whose task_context names case 1 outright. Document 27
	// hangs off tasks 1 and 73, whose task_context rows carry a NULL case_id — it is
	// attributed through their sequencing experiment instead (seq 1 belongs to case 1).
	documentOnCase1       = "245"
	documentViaSequencing = "27"
	unknownDocument       = "999999"
	noteOnCase1           = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
)

// seedGeneticistAt provisions a fresh user holding the geneticist role (org-scoped:
// interpret, comment, flag, pii, download) at one org, and removes it when the test ends.
// The id is unique per call: these tests run in parallel, so a shared one would let one
// test's cleanup delete the user another is still authorizing as.
func seedGeneticistAt(t *testing.T, db *gorm.DB, orgCode string) string {
	t.Helper()
	userID := uuid.NewString()
	t.Cleanup(func() {
		db.Exec(`DELETE FROM user_role WHERE user_id = ?`, userID)
		db.Exec(`DELETE FROM users WHERE user_id = ?`, userID)
	})
	require.NoError(t, db.Exec(`
		INSERT INTO users (user_id, email, first_name, last_name)
		VALUES (?, ?, 'Lea', 'Lambert')`, userID, userID+"@test.authz").Error)
	require.NoError(t, db.Exec(`
		INSERT INTO user_role (user_id, tenant_code, org_code, role_code, granted_by)
		VALUES (?, 'radiant', ?, 'geneticist', 'seed')`, userID, orgCode).Error)
	return userID
}

// probe is one route under test: the resolver it is gated by, and a request that exercises it.
type probe struct {
	name        string
	method      string
	routePath   string
	requestPath string
	action      string
	resolver    func(*postgres.AuthRepository) server.OrgResolver
	body        string
}

// caseProbes reach case 1 — whose diagnosis lab is CQGC — through each resolver in turn.
var caseProbes = []probe{
	{"case param", "GET", "/probe/:case_id", "/radiant/probe/" + caseAtCQGC, types.ActionFlagVariant,
		func(r *postgres.AuthRepository) server.OrgResolver { return server.OrgFromCaseParam(r) }, ""},
	{"case body", "POST", "/probe", "/radiant/probe", types.ActionCommentVariant,
		func(r *postgres.AuthRepository) server.OrgResolver { return server.OrgFromCaseBody(r) }, `{"case_id":1}`},
	{"note param", "DELETE", "/probe/:id", "/radiant/probe/" + noteOnCase1, types.ActionCommentVariant,
		func(r *postgres.AuthRepository) server.OrgResolver { return server.OrgFromNoteParam(r) }, ""},
	{"document param", "GET", "/probe/:document_id", "/radiant/probe/" + documentOnCase1, types.ActionDownloadFile,
		func(r *postgres.AuthRepository) server.OrgResolver { return server.OrgFromDocumentParam(r) }, ""},
	{"document via sequencing", "GET", "/probe/:document_id", "/radiant/probe/" + documentViaSequencing, types.ActionDownloadFile,
		func(r *postgres.AuthRepository) server.OrgResolver { return server.OrgFromDocumentParam(r) }, ""},
}

// serveProbe mirrors the production wiring — RequireTenantAccess then RequireActionAt with the
// route's resolver — against the real AuthRepository.
func serveProbe(repo *postgres.AuthRepository, userID string, p probe) *httptest.ResponseRecorder {
	auth := &testutils.MockAuth{Id: userID}

	router := gin.New()
	tenantRoutes := router.Group("/:tenant")
	tenantRoutes.Use(server.RequireTenantAccess(auth, repo))
	tenantRoutes.Handle(p.method, p.routePath,
		server.RequireActionAt(auth, repo, p.action, p.resolver(repo)),
		func(c *gin.Context) { c.Status(http.StatusOK) })

	req, _ := http.NewRequest(p.method, p.requestPath, strings.NewReader(p.body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

// assertOrgResolved runs one probe as an existing fixture user. Read-only: the seeded-grantee
// positives all live in the single write test below, because a WritePostgres test fires the
// shared destructive cleanUp against every other test running in parallel.
func assertOrgResolved(t *testing.T, userID string, p probe, expected int) {
	t.Helper()
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		assert.Equal(t, expected, serveProbe(repo, userID, p).Code)
	})
}

// Test_OrgResolution_GranteeAtTheCasesLabAllowed is the positive for every resolver: one
// geneticist granted only at CQGC, admitted on each resource that hangs off a CQGC case.
func Test_OrgResolution_GranteeAtTheCasesLabAllowed(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := postgres.NewAuthRepository(database.PostgresDB{DB: env.Postgres})
		userID := seedGeneticistAt(t, env.Postgres, "CQGC")

		for _, p := range caseProbes {
			assert.Equalf(t, http.StatusOK, serveProbe(repo, userID, p).Code, "resolver %q denied its own lab", p.name)
		}
	})
}

func probeByName(name string) probe {
	for _, p := range caseProbes {
		if p.name == name {
			return p
		}
	}
	panic("unknown probe " + name)
}

func withRequest(p probe, requestPath, body string) probe {
	p.requestPath = requestPath
	p.body = body
	return p
}

func Test_OrgResolution_GranteeAtAnotherOrgDenied(t *testing.T) {
	// alice holds every geneticist action, but at CHOP — case 1's lab is CQGC.
	for _, p := range caseProbes {
		t.Run(p.name, func(t *testing.T) {
			assertOrgResolved(t, aliceID, p, http.StatusForbidden)
		})
	}
}

func Test_OrgResolution_WildcardGranteeAllowed(t *testing.T) {
	for _, p := range caseProbes {
		t.Run(p.name, func(t *testing.T) {
			assertOrgResolved(t, wendyID, p, http.StatusOK)
		})
	}
}

func Test_OrgResolution_UnknownCaseDenied(t *testing.T) {
	// Not a 404: an unresolvable case is denied with the same generic 403 as a missing grant,
	// so the gate never reveals whether a case exists.
	p := probeByName("case param")
	assertOrgResolved(t, wendyID, withRequest(p, "/radiant/probe/"+unknownCase, ""), http.StatusForbidden)
}

func Test_OrgResolution_MalformedCaseIdDenied(t *testing.T) {
	p := probeByName("case param")
	assertOrgResolved(t, wendyID, withRequest(p, "/radiant/probe/not-a-number", ""), http.StatusForbidden)
}

func Test_OrgResolution_CrossTenantCaseDenied(t *testing.T) {
	// carol is a wildcard geneticist in tenant_b; case 1 belongs to radiant, so it resolves to
	// no org under tenant_b even though she holds the action there.
	p := probeByName("case param")
	assertOrgResolved(t, carolID, withRequest(p, "/tenant_b/probe/"+caseAtCQGC, ""), http.StatusForbidden)
}

func Test_OrgResolution_CaseBody_WithoutCaseIdDenied(t *testing.T) {
	p := probeByName("case body")
	assertOrgResolved(t, wendyID, withRequest(p, p.requestPath, `{"content":"no case"}`), http.StatusForbidden)
}

func Test_OrgResolution_CaseBody_MalformedBodyDenied(t *testing.T) {
	p := probeByName("case body")
	assertOrgResolved(t, wendyID, withRequest(p, p.requestPath, "not json"), http.StatusForbidden)
}

func Test_OrgResolution_UnknownNoteDenied(t *testing.T) {
	p := probeByName("note param")
	assertOrgResolved(t, wendyID, withRequest(p, "/radiant/probe/11111111-2222-3333-4444-555555555555", ""), http.StatusForbidden)
}

func Test_OrgResolution_MalformedNoteIdDenied(t *testing.T) {
	// A non-uuid must be refused before the query: occurrence_note.id is a uuid column, so it
	// would fault rather than miss.
	p := probeByName("note param")
	assertOrgResolved(t, wendyID, withRequest(p, "/radiant/probe/not-a-uuid", ""), http.StatusForbidden)
}

func Test_OrgResolution_UnknownDocumentDenied(t *testing.T) {
	// A document nothing attributes to a case cannot be checked against any org.
	p := probeByName("document param")
	assertOrgResolved(t, wendyID, withRequest(p, "/radiant/probe/"+unknownDocument, ""), http.StatusForbidden)
}
