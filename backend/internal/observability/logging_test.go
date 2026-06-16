package observability

import (
	"bytes"
	"context"
	"encoding/json"
	"log/slog"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// newTestLogger returns a logger writing JSON to buf through the contextHandler under test.
func newTestLogger(buf *bytes.Buffer) *slog.Logger {
	base := slog.NewJSONHandler(buf, &slog.HandlerOptions{Level: slog.LevelInfo})
	return slog.New(&contextHandler{handler: base})
}

func Test_ContextHandler_AddsRequestIDWhenPresent(t *testing.T) {
	var buf bytes.Buffer
	logger := newTestLogger(&buf)

	ctx := ContextWithRequestID(context.Background(), "req-123")
	logger.InfoContext(ctx, "hello")

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	assert.Equal(t, "req-123", line[requestIDLogKey])
}

func Test_ContextHandler_OmitsRequestIDWhenAbsent(t *testing.T) {
	var buf bytes.Buffer
	logger := newTestLogger(&buf)

	logger.InfoContext(context.Background(), "hello")

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	_, present := line[requestIDLogKey]
	assert.False(t, present, "request_id should be absent when ctx carries none")
}

func Test_RequestIDFromContext_RoundTrips(t *testing.T) {
	ctx := ContextWithRequestID(context.Background(), "abc")
	id, ok := RequestIDFromContext(ctx)
	assert.True(t, ok)
	assert.Equal(t, "abc", id)
}

func Test_RequestIDFromContext_MissingReturnsFalse(t *testing.T) {
	_, ok := RequestIDFromContext(context.Background())
	assert.False(t, ok)
}

func Test_ParseLevel_KnownAndUnknown(t *testing.T) {
	assert.Equal(t, slog.LevelDebug, parseLevel("debug"))
	assert.Equal(t, slog.LevelWarn, parseLevel("warn"))
	assert.Equal(t, slog.LevelError, parseLevel("error"))
	assert.Equal(t, slog.LevelInfo, parseLevel("info"))
	assert.Equal(t, slog.LevelInfo, parseLevel("nonsense"))
}
