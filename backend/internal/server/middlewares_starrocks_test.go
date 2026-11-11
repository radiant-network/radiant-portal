package server

import (
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/radiant-network/radiant-api/test/testutils"
)

// tenantSetter mimics the piece of RequireTenantAccess the pool middleware depends on: the
// resolved tenant stored in the gin context.
func tenantSetter(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) }

func lazyPool(t *testing.T) *sql.DB {
	t.Helper()
	db, err := sql.Open("mysql", "u:p@tcp(127.0.0.1:9999)/")
	require.NoError(t, err)
	t.Cleanup(func() { _ = db.Close() })
	return db
}

func Test_BindStarrocksUserPool_OpensPoolForTenantDBAndRunsHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	var gotSub, gotJWT, gotDB string
	factory := func(sub, jwt, defaultDB string) (*sql.DB, error) {
		gotSub, gotJWT, gotDB = sub, jwt, defaultDB
		return lazyPool(t), nil
	}
	handlerRan := false

	r := gin.New()
	r.GET("/:tenant/x", tenantSetter,
		BindStarrocksUserPool(&testutils.MockAuth{Id: "the-sub"}, factory),
		func(c *gin.Context) { handlerRan = true; c.Status(http.StatusOK) })

	req := httptest.NewRequest(http.MethodGet, "/radiant/x", nil)
	req.Header.Set("Authorization", "Bearer ey.some.jwt")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	require.Equal(t, http.StatusOK, w.Code)
	assert.True(t, handlerRan, "downstream handler runs")
	assert.Equal(t, "the-sub", gotSub)
	assert.Equal(t, "ey.some.jwt", gotJWT)
	assert.Equal(t, "radiant_tenant", gotDB, "default DB is the tenant's view schema")
}

func Test_BindStarrocksUserPool_MissingBearerIsUnauthorized(t *testing.T) {
	gin.SetMode(gin.TestMode)
	factoryCalled := false
	factory := func(sub, jwt, defaultDB string) (*sql.DB, error) {
		factoryCalled = true
		return lazyPool(t), nil
	}

	r := gin.New()
	r.GET("/:tenant/x", tenantSetter,
		BindStarrocksUserPool(&testutils.MockAuth{Id: "the-sub"}, factory),
		func(c *gin.Context) { c.Status(http.StatusOK) })

	req := httptest.NewRequest(http.MethodGet, "/radiant/x", nil) // no Authorization header
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.False(t, factoryCalled, "no pool is opened without a bearer token")
}
