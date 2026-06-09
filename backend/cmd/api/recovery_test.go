package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// Test_Recovery_PanicReturns500WithGzip guards the middleware ordering: a handler panic must
// surface as HTTP 500 even when gzip is active. Before the fix (gin.Default() put Recovery
// outside gzip), gzip's deferred gz.Close() committed a 200 status during panic unwind and
// Recovery could no longer override it, so the client wrongly got 200. See SJRA-1578.
func Test_Recovery_PanicReturns500WithGzip(t *testing.T) {
	gin.SetMode(gin.TestMode)

	os.Setenv("CORS_ALLOWED_ORIGINS", "*")
	defer os.Unsetenv("CORS_ALLOWED_ORIGINS")

	r := newEngine()
	r.GET("/panic", func(c *gin.Context) {
		panic("boom")
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/panic", nil)
	// Accept-Encoding: gzip is essential — the bug only manifests when the gzip middleware
	// compresses (and thereby flushes) the response on the way out.
	req.Header.Set("Accept-Encoding", "gzip")

	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
}
