// Package observability wires the backend's structured logging and metrics.
//
// Logging uses stdlib log/slog with a JSON handler so log lines are machine
// parseable. A contextHandler enriches every record with the request id carried
// on the context (see ContextWithRequestID), so any slog.*Context call made while
// handling a request automatically correlates to that request.
package observability

import (
	"context"
	"log/slog"
	"os"

	"github.com/radiant-network/radiant-api/internal/utils"
)

// requestIDKey is the unexported context key under which the per-request id is stored.
type contextKey int

const requestIDKey contextKey = iota

// requestIDLogKey is the attribute name used for the request id in log records.
const requestIDLogKey = "request_id"

// Setup installs a JSON slog handler as the default logger. The level is read from
// LOG_LEVEL (debug|info|warn|error, default info). It is called once at process start
// by both the API and the worker.
func Setup() {
	level := parseLevel(utils.GetEnvOrDefault("LOG_LEVEL", "info"))
	base := slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{Level: level})
	slog.SetDefault(slog.New(&contextHandler{handler: base}))
}

// parseLevel maps a LOG_LEVEL string to an slog.Level, falling back to info for
// unrecognised values.
func parseLevel(s string) slog.Level {
	switch s {
	case "debug", "DEBUG":
		return slog.LevelDebug
	case "warn", "WARN", "warning", "WARNING":
		return slog.LevelWarn
	case "error", "ERROR":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

// contextHandler wraps an slog.Handler and appends the request id from the context
// (when present) as a request_id attribute to every record.
type contextHandler struct {
	handler slog.Handler
}

func (h *contextHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return h.handler.Enabled(ctx, level)
}

func (h *contextHandler) Handle(ctx context.Context, record slog.Record) error {
	if id, ok := RequestIDFromContext(ctx); ok {
		record.AddAttrs(slog.String(requestIDLogKey, id))
	}
	return h.handler.Handle(ctx, record)
}

func (h *contextHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &contextHandler{handler: h.handler.WithAttrs(attrs)}
}

func (h *contextHandler) WithGroup(name string) slog.Handler {
	return &contextHandler{handler: h.handler.WithGroup(name)}
}

// ContextWithRequestID returns a copy of ctx carrying the given request id, so that
// slog.*Context calls and downstream code can recover it.
func ContextWithRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey, id)
}

// RequestIDFromContext returns the request id stored on ctx, if any.
func RequestIDFromContext(ctx context.Context) (string, bool) {
	id, ok := ctx.Value(requestIDKey).(string)
	return id, ok
}
