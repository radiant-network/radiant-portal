package server

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/observability"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func Test_RequestID_GeneratesIDWhenAbsent(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	var ctxID string
	r.GET("/", func(c *gin.Context) {
		id, _ := observability.RequestIDFromContext(c.Request.Context())
		ctxID = id
		c.Status(http.StatusOK)
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	r.ServeHTTP(w, req)

	header := w.Header().Get(RequestIDHeader)
	assert.NotEmpty(t, header, "response should carry a generated X-Request-ID")
	assert.Equal(t, header, ctxID, "context id should match response header")
	_, err := uuid.Parse(header)
	assert.NoError(t, err, "generated id should be a valid UUID, got %q", header)
}

func Test_RequestID_ReusesWellFormedInboundHeader(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set(RequestIDHeader, "inbound-42")
	r.ServeHTTP(w, req)

	assert.Equal(t, "inbound-42", w.Header().Get(RequestIDHeader))
}

func Test_RequestID_RejectsMalformedInboundHeader(t *testing.T) {
	r := gin.New()
	r.Use(RequestID())
	r.GET("/", func(c *gin.Context) { c.Status(http.StatusOK) })

	// A value with characters outside the safe charset must be replaced by a fresh UUID,
	// never reflected back verbatim.
	malicious := "abc\r\nSet-Cookie: x=1"
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set(RequestIDHeader, malicious)
	r.ServeHTTP(w, req)

	got := w.Header().Get(RequestIDHeader)
	assert.NotEqual(t, malicious, got)
	_, err := uuid.Parse(got)
	assert.NoError(t, err, "rejected inbound id should be replaced by a UUID, got %q", got)
}

func Test_ValidRequestID(t *testing.T) {
	assert.True(t, validRequestID("inbound-42"))
	assert.True(t, validRequestID(uuid.NewString()))
	assert.True(t, validRequestID("trace.id:00-ff_AB"))

	assert.False(t, validRequestID(""), "empty is rejected")
	assert.False(t, validRequestID("has space"), "space is rejected")
	assert.False(t, validRequestID("crlf\r\ninjection"), "CR/LF is rejected")
	assert.False(t, validRequestID("emoji😀"), "non-ASCII is rejected")
	assert.False(t, validRequestID(strings.Repeat("a", maxRequestIDLength+1)), "over-length is rejected")
}

func Test_RequestLogger_LogsRequestFields(t *testing.T) {
	var buf bytes.Buffer
	prev := slog.Default()
	slog.SetDefault(slog.New(slog.NewJSONHandler(&buf, nil)))
	defer slog.SetDefault(prev)

	r := gin.New()
	r.Use(RequestLogger())
	r.GET("/cases/:id", func(c *gin.Context) { c.Status(http.StatusTeapot) })

	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/cases/7", nil)
	r.ServeHTTP(w, req)

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	assert.Equal(t, "http_request", line["msg"])
	assert.Equal(t, http.MethodGet, line["method"])
	assert.Equal(t, "/cases/:id", line["path"], "path should be the route template, not the raw url")
	assert.Equal(t, float64(http.StatusTeapot), line["status"])
	assert.Contains(t, line, "latency_ms")
}
