package observability

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// defaultSlowQueryThreshold is the elapsed-time bar above which a query is logged as slow.
const defaultSlowQueryThreshold = 200 * time.Millisecond

// gormLogger adapts GORM's logger.Interface onto slog so database diagnostics are emitted
// as structured JSON like the rest of the backend, instead of GORM's default plain-text
// lines written straight to stdout.
type gormLogger struct {
	db                   string
	slowThreshold        time.Duration
	ignoreRecordNotFound bool
	parameterizedQueries bool
}

// NewGormLogger returns a GORM logger that writes structured slog records. dbName labels
// every line with the database it came from ("postgres" / "starrocks"). The slow-query
// threshold is read from DB_SLOW_QUERY_THRESHOLD_MS (default 200ms). SQL is always logged
// with placeholders rather than interpolated values (see ParamsFilter) so patient and
// clinical identifiers never reach the logs.
func NewGormLogger(dbName string) logger.Interface {
	return gormLogger{
		db:                   dbName,
		slowThreshold:        slowQueryThreshold(),
		ignoreRecordNotFound: true,
		parameterizedQueries: true,
	}
}

// slowQueryThreshold resolves the slow-query bar from DB_SLOW_QUERY_THRESHOLD_MS, falling
// back to the default for an unset, non-integer, or non-positive value.
func slowQueryThreshold() time.Duration {
	ms, err := strconv.Atoi(utils.GetEnvOrDefault("DB_SLOW_QUERY_THRESHOLD_MS", "200"))
	if err != nil || ms <= 0 {
		return defaultSlowQueryThreshold
	}
	return time.Duration(ms) * time.Millisecond
}

// LogMode returns the logger unchanged: verbosity is governed by LOG_LEVEL through slog,
// not by GORM's own level.
func (l gormLogger) LogMode(logger.LogLevel) logger.Interface { return l }

func (l gormLogger) Info(ctx context.Context, msg string, data ...any) {
	slog.InfoContext(ctx, gormMessage(msg, data...), slog.String("db", l.db))
}

func (l gormLogger) Warn(ctx context.Context, msg string, data ...any) {
	slog.WarnContext(ctx, gormMessage(msg, data...), slog.String("db", l.db))
}

func (l gormLogger) Error(ctx context.Context, msg string, data ...any) {
	slog.ErrorContext(ctx, gormMessage(msg, data...), slog.String("db", l.db))
}

// gormMessage renders GORM's printf-style diagnostic message, guarding the no-args case so
// a literal message isn't mangled by fmt verbs it doesn't contain.
func gormMessage(msg string, data ...any) string {
	if len(data) == 0 {
		return msg
	}
	return fmt.Sprintf(msg, data...)
}

// Trace logs one record per executed SQL statement.
//
// Query errors are logged at DEBUG, not ERROR, on purpose: the request boundary
// (server.HandleError) owns the single authoritative error log, so logging the same
// failure here too would double-count it. DEBUG keeps the SQL recoverable when
// investigating. Slow queries are logged at WARN; every other query at DEBUG (silent
// unless LOG_LEVEL=debug). The level is resolved before fc() is called so the SQL string
// is not built (via Dialector.Explain) for records that will be dropped — this runs on
// every query.
func (l gormLogger) Trace(ctx context.Context, begin time.Time, fc func() (string, int64), err error) {
	elapsed := time.Since(begin)
	isError := err != nil && (!l.ignoreRecordNotFound || !errors.Is(err, gorm.ErrRecordNotFound))
	isSlow := l.slowThreshold > 0 && elapsed > l.slowThreshold

	level := slog.LevelDebug
	msg := "gorm query"
	switch {
	case isError:
		msg = "gorm query failed"
	case isSlow:
		level, msg = slog.LevelWarn, "gorm slow query"
	}

	if !slog.Default().Enabled(ctx, level) {
		return
	}

	sql, rows := fc()
	attrs := []slog.Attr{
		slog.String("db", l.db),
		slog.String("sql", sql),
		slog.Int64("rows", rows),
		slog.Int64("elapsed_ms", elapsed.Milliseconds()),
	}
	if isError {
		attrs = append(attrs, slog.Any("error", err))
	} else if isSlow {
		attrs = append(attrs, slog.Int64("threshold_ms", l.slowThreshold.Milliseconds()))
	}
	slog.LogAttrs(ctx, level, msg, attrs...)
}

// ParamsFilter implements gorm.ParamsFilter. Returning nil params makes GORM render the
// logged SQL with placeholders instead of interpolating the actual bound values, keeping
// PII out of the logs.
func (l gormLogger) ParamsFilter(_ context.Context, sql string, params ...any) (string, []any) {
	if l.parameterizedQueries {
		return sql, nil
	}
	return sql, params
}
