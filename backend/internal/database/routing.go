package database

import (
	"context"
	"database/sql"
	"errors"

	"gorm.io/gorm"
)

type userPoolKey struct{}

// ContextWithUserPool binds a per-request StarRocks pool (authenticated as the end user through
// mysql-proxy) to ctx. The shared StarRocks *gorm.DB is backed by routingConnPool, which routes
// any query whose context carries such a pool to it instead of the root pool — so every existing
// repository runs unchanged while its reads execute as the authenticated user and Ranger applies
// per-user masking / row-filter / access.
func ContextWithUserPool(ctx context.Context, pool *sql.DB) context.Context {
	return context.WithValue(ctx, userPoolKey{}, pool)
}

func userPoolFromContext(ctx context.Context) (*sql.DB, bool) {
	pool, ok := ctx.Value(userPoolKey{}).(*sql.DB)
	return pool, ok && pool != nil
}

// routingConnPool is the gorm.ConnPool backing the shared StarRocks handle. Per query it picks
// the per-request user pool bound to the context, falling back to the root pool when none is
// bound (the worker, /status, unauthenticated paths, and the proxy-read flag being off).
//
// SECURITY — the root fallback is UNMASKED, so it is fail-open. It is safe only because
// BindStarrocksUserPool is applied at the /:tenant group level: every tenant read therefore
// arrives with a user pool bound, or the request was aborted before reaching a handler. Never
// read tenant data off a context that skipped that middleware (e.g. a detached or background
// context) — it would silently run as root and bypass Ranger. Keep such reads under the tenant
// group, not around it.
//
// Do NOT enable gorm PrepareStmt on this handle: its prepared-statement cache is keyed on the
// (shared) ConnPool, so a statement prepared on one user's connection could be reused on
// another's. Without PrepareStmt (the default) each query runs directly on the resolved pool.
type routingConnPool struct {
	root *sql.DB
}

func (r *routingConnPool) resolve(ctx context.Context) gorm.ConnPool {
	if pool, ok := userPoolFromContext(ctx); ok {
		return pool
	}
	return r.root
}

func (r *routingConnPool) PrepareContext(ctx context.Context, query string) (*sql.Stmt, error) {
	return r.resolve(ctx).PrepareContext(ctx, query)
}

func (r *routingConnPool) ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return r.resolve(ctx).ExecContext(ctx, query, args...)
}

func (r *routingConnPool) QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error) {
	return r.resolve(ctx).QueryContext(ctx, query, args...)
}

func (r *routingConnPool) QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row {
	return r.resolve(ctx).QueryRowContext(ctx, query, args...)
}

// BeginTx satisfies gorm.ConnPoolBeginner, routing the transaction to whichever pool the context
// selects; the whole transaction then runs on that pool (a *sql.Tx is itself a gorm.ConnPool).
func (r *routingConnPool) BeginTx(ctx context.Context, opts *sql.TxOptions) (gorm.ConnPool, error) {
	beginner, ok := r.resolve(ctx).(interface {
		BeginTx(context.Context, *sql.TxOptions) (*sql.Tx, error)
	})
	if !ok {
		return nil, errors.New("starrocks pool does not support transactions")
	}
	return beginner.BeginTx(ctx, opts)
}

// GetDBConn returns the root pool so gorm's db.DB() (health-check pings) keeps working.
func (r *routingConnPool) GetDBConn() (*sql.DB, error) {
	return r.root, nil
}
