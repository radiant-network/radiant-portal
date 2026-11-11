package observability

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"log/slog"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// captureLogs redirects the default slog logger to a JSON buffer at the given level for
// the duration of the test, returning the buffer and a restore func.
func captureLogs(t *testing.T, level slog.Level) *bytes.Buffer {
	t.Helper()
	var buf bytes.Buffer
	prev := slog.Default()
	slog.SetDefault(slog.New(slog.NewJSONHandler(&buf, &slog.HandlerOptions{Level: level})))
	t.Cleanup(func() { slog.SetDefault(prev) })
	return &buf
}

func testGormLogger() gormLogger {
	return gormLogger{
		db:                   "postgres",
		slowThreshold:        200 * time.Millisecond,
		ignoreRecordNotFound: true,
		parameterizedQueries: true,
	}
}

func fakeQuery(sql string, rows int64) func() (string, int64) {
	return func() (string, int64) { return sql, rows }
}

func Test_GormLogger_SlowQueryLogsWarn(t *testing.T) {
	buf := captureLogs(t, slog.LevelInfo)
	l := testGormLogger()

	begin := time.Now().Add(-300 * time.Millisecond)
	l.Trace(context.Background(), begin, fakeQuery("SELECT * FROM cases WHERE id = $1", 30), nil)

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	assert.Equal(t, "WARN", line["level"])
	assert.Equal(t, "gorm slow query", line["msg"])
	assert.Equal(t, "postgres", line["db"])
	assert.Equal(t, "SELECT * FROM cases WHERE id = $1", line["sql"])
	assert.Equal(t, float64(30), line["rows"])
	assert.GreaterOrEqual(t, line["elapsed_ms"], float64(200))
	assert.Equal(t, float64(200), line["threshold_ms"])
}

func Test_GormLogger_FastQuerySilentAtInfo(t *testing.T) {
	buf := captureLogs(t, slog.LevelInfo)
	l := testGormLogger()

	l.Trace(context.Background(), time.Now(), fakeQuery("SELECT 1", 1), nil)

	assert.Empty(t, buf.String(), "a fast query should produce no output at INFO level")
}

func Test_GormLogger_FastQueryLogsDebugWhenEnabled(t *testing.T) {
	buf := captureLogs(t, slog.LevelDebug)
	l := testGormLogger()

	l.Trace(context.Background(), time.Now(), fakeQuery("SELECT 1", 1), nil)

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	assert.Equal(t, "DEBUG", line["level"])
	assert.Equal(t, "gorm query", line["msg"])
}

func Test_GormLogger_QueryErrorLogsDebugNotError(t *testing.T) {
	buf := captureLogs(t, slog.LevelDebug)
	l := testGormLogger()

	l.Trace(context.Background(), time.Now(), fakeQuery("SELECT 1", 0), errors.New("connection refused"))

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	// Errors are logged at DEBUG, never ERROR/WARN — the request boundary owns the
	// authoritative error log (no double-logging).
	assert.Equal(t, "DEBUG", line["level"])
	assert.Equal(t, "gorm query failed", line["msg"])
	assert.Equal(t, "connection refused", line["error"])
}

func Test_GormLogger_QueryErrorSilentAtInfo(t *testing.T) {
	buf := captureLogs(t, slog.LevelInfo)
	l := testGormLogger()

	l.Trace(context.Background(), time.Now(), fakeQuery("SELECT 1", 0), errors.New("boom"))

	assert.Empty(t, buf.String(), "query errors are DEBUG, so silent at INFO; the boundary logs them")
}

func Test_GormLogger_RecordNotFoundSuppressed(t *testing.T) {
	buf := captureLogs(t, slog.LevelInfo)
	l := testGormLogger()

	l.Trace(context.Background(), time.Now(), fakeQuery("SELECT 1", 0), gorm.ErrRecordNotFound)

	assert.Empty(t, buf.String(), "ErrRecordNotFound is not an error condition and must not log as failure")
}

func Test_GormLogger_ParamsFilterStripsValuesWhenParameterized(t *testing.T) {
	l := testGormLogger()
	sql, params := l.ParamsFilter(context.Background(), "SELECT * FROM patient WHERE id = $1", "secret-mrn")
	assert.Equal(t, "SELECT * FROM patient WHERE id = $1", sql)
	assert.Nil(t, params, "parameterized mode must drop bound values so PII never reaches logs")
}

func Test_GormLogger_ParamsFilterKeepsValuesWhenDisabled(t *testing.T) {
	l := testGormLogger()
	l.parameterizedQueries = false
	sql, params := l.ParamsFilter(context.Background(), "SELECT 1", "v")
	assert.Equal(t, "SELECT 1", sql)
	assert.Equal(t, []any{"v"}, params)
}

func Test_GormMessage_WithAndWithoutData(t *testing.T) {
	assert.Equal(t, "plain message", gormMessage("plain message"))
	assert.Equal(t, "rows: 5", gormMessage("rows: %d", 5))
}

func Test_GormLogger_PassthroughLevels(t *testing.T) {
	buf := captureLogs(t, slog.LevelInfo)
	l := testGormLogger()

	l.Error(context.Background(), "migrator failed: %s", "table x")

	var line map[string]any
	require.NoError(t, json.Unmarshal(buf.Bytes(), &line))
	assert.Equal(t, "ERROR", line["level"])
	assert.Equal(t, "migrator failed: table x", line["msg"])
	assert.Equal(t, "postgres", line["db"])
}
