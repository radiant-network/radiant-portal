package database

import (
	"context"
	"database/sql"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// openLazy returns a *sql.DB handle without connecting (sql.Open is lazy), enough to assert
// routing identity without a live StarRocks.
func openLazy(t *testing.T, addr string) *sql.DB {
	t.Helper()
	db, err := sql.Open("mysql", "u:p@tcp("+addr+")/")
	require.NoError(t, err)
	t.Cleanup(func() { _ = db.Close() })
	return db
}

func Test_routingConnPool_resolve_FallsBackToRootWhenNoUserPool(t *testing.T) {
	root := openLazy(t, "127.0.0.1:9999")
	r := &routingConnPool{root: root}

	assert.Same(t, root, r.resolve(context.Background()).(*sql.DB))
}

func Test_routingConnPool_resolve_UsesUserPoolFromContext(t *testing.T) {
	root := openLazy(t, "127.0.0.1:9999")
	user := openLazy(t, "127.0.0.1:9998")
	r := &routingConnPool{root: root}

	ctx := ContextWithUserPool(context.Background(), user)

	assert.Same(t, user, r.resolve(ctx).(*sql.DB), "a context-bound user pool wins over root")
}

func Test_routingConnPool_GetDBConn_ReturnsRoot(t *testing.T) {
	root := openLazy(t, "127.0.0.1:9999")
	r := &routingConnPool{root: root}

	got, err := r.GetDBConn()

	require.NoError(t, err)
	assert.Same(t, root, got, "db.DB() (health pings) must reach the root pool")
}
