package server

import (
	"database/sql"

	"github.com/gin-gonic/gin"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// StarrocksProxyReadEnabledEnv gates whether tenant-scoped reads run through mysql-proxy as the
// calling user (BindStarrocksUserPool). Off by default; enable together with
// TENANT_VIEWS_READ_ENABLED — the per-user connection targets the tenant's view database, so
// reads must already resolve to <code>_tenant.
const StarrocksProxyReadEnabledEnv = "STARROCKS_PROXY_READ_ENABLED"

// StarrocksUserPoolFactory opens a per-request StarRocks pool authenticated as the user (sub)
// with their raw JWT, defaulted to the given database. Declared here (consumer side) so server
// stays decoupled from the connection details; main wires database.NewStarrocksUserPool.
type StarrocksUserPoolFactory func(sub, jwt, defaultDB string) (*sql.DB, error)

// BindStarrocksUserPool routes this request's StarRocks reads through mysql-proxy as the calling
// user, so Ranger enforces per-user masking / row-filter / access — no masking logic in the API.
// It opens a per-request pool whose default database is the tenant's view schema (which makes
// StarRocks enforce tenant access at login, the real gate since Ranger access is inert on the
// views themselves), binds it to the request context for the routing ConnPool, and closes it when
// the request completes. Must run after RequireTenantAccess (it reads the resolved tenant).
func BindStarrocksUserPool(auth utils.Auth, newPool StarrocksUserPoolFactory) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		sub, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			c.Abort()
			return
		}
		jwt, err := utils.RetrieveRawToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			c.Abort()
			return
		}

		pool, err := newPool(*sub, jwt, types.TenantDatabase(*tenant))
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		defer func() { _ = pool.Close() }()

		c.Request = c.Request.WithContext(database.ContextWithUserPool(c.Request.Context(), pool))
		c.Next()
	}
}
