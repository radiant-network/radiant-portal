package server

import (
	"context"
	"fmt"
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/observability"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// RequestIDHeader is the HTTP header carrying the per-request correlation id, both on
// the inbound request (when a caller or upstream proxy supplies one) and echoed on the
// response.
const RequestIDHeader = "X-Request-ID"

// RequestIDContextKey is the gin context key under which RequestID stores the resolved
// request id for gin-side handlers.
const RequestIDContextKey = "request_id"

// maxRequestIDLength bounds an accepted inbound request id. The id is logged on every
// request and reflected in the response, so an attacker-supplied value is untrusted
// input: capping the length prevents log-volume amplification (Go caps total headers
// near 1 MB, which would otherwise be logged verbatim per request).
const maxRequestIDLength = 128

// RequestID assigns each request a correlation id. It reuses an inbound X-Request-ID
// header when it is well-formed, otherwise generates a UUID. The id is stored on the
// request context (so slog.*Context calls correlate to it), exposed on the gin context,
// and echoed on the response. It must be registered first so every other middleware and
// handler sees the id.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader(RequestIDHeader)
		if !validRequestID(id) {
			id = uuid.NewString()
		}
		c.Request = c.Request.WithContext(observability.ContextWithRequestID(c.Request.Context(), id))
		c.Set(RequestIDContextKey, id)
		c.Header(RequestIDHeader, id)
		c.Next()
	}
}

// validRequestID reports whether an inbound request id is safe to trust and propagate.
// We accept a conservative, log- and header-safe charset (letters, digits, and -._:)
// up to maxRequestIDLength; anything else (empty, too long, control chars, CR/LF,
// arbitrary bytes) is rejected so RequestID mints a fresh UUID instead. This covers the
// common UUID/trace-id/hex formats upstream proxies emit while refusing untrusted junk.
func validRequestID(id string) bool {
	if id == "" || len(id) > maxRequestIDLength {
		return false
	}
	for _, r := range id {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9':
		case r == '-', r == '_', r == '.', r == ':':
		default:
			return false
		}
	}
	return true
}

// RequestLogger emits one structured JSON log line per request after it completes,
// carrying the method, matched route template, status, latency and client ip. The
// request id is added automatically by the context handler. It replaces gin.Logger and
// the gin-glog request logger.
//
// skipPaths are matched against the raw request path and logged only when they fail
// (non-2xx), so high-frequency probes (health checks on /status) don't drown the log.
func RequestLogger(skipPaths ...string) gin.HandlerFunc {
	skip := make(map[string]struct{}, len(skipPaths))
	for _, p := range skipPaths {
		skip[p] = struct{}{}
	}
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()

		if _, ok := skip[c.Request.URL.Path]; ok && c.Writer.Status() < 300 {
			return
		}

		path := c.FullPath()
		if path == "" {
			path = c.Request.URL.Path
		}
		slog.InfoContext(c.Request.Context(), "http_request",
			slog.String("method", c.Request.Method),
			slog.String("path", path),
			slog.Int("status", c.Writer.Status()),
			slog.Int64("latency_ms", time.Since(start).Milliseconds()),
			slog.String("client_ip", c.ClientIP()),
		)
	}
}

// TenantContextKey is the gin context key under which RequireTenantAccess stores the
// resolved tenant code for downstream handlers.
const TenantContextKey = "tenant"

// tenantViewsReadEnabledEnv gates whether RequireTenantAccess binds the resolved tenant to
// the request context. When set, repository reads resolve the tenant's view database
// (<code>_tenant) via types.TenantSchema instead of the radiant_jdbc federation. Off by
// default until every repository read path emits tenant-qualified table references.
const tenantViewsReadEnabledEnv = "TENANT_VIEWS_READ_ENABLED"

// tenantAccessChecker is the slice of the auth repository RequireTenantAccess needs: it
// resolves whether a tenant exists and whether a caller may access it.
type tenantAccessChecker interface {
	TenantExists(ctx context.Context, tenantCode string) (bool, error)
	HasTenantAccess(ctx context.Context, userID, tenantCode string) (bool, error)
}

// RequireTenantAccess gates tenant-scoped routes (`/:tenant/...`). It reads the `tenant`
// path param, rejects an unknown tenant with 403, verifies the caller holds at least one
// role in that tenant (rejecting cross-tenant access with 403), and stores the resolved
// tenant code in the request context.
//
// An unknown tenant is rejected with the same generic 403 as a cross-tenant denial so the
// response never discloses whether a tenant exists (an authenticated caller cannot
// distinguish "unknown tenant" from "not a member"). It also keeps a bad tenant_code from
// reaching a write and surfacing as an opaque 500 from a foreign-key violation.
func RequireTenantAccess(auth utils.Auth, repo tenantAccessChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant := c.Param("tenant")

		exists, err := repo.TenantExists(c.Request.Context(), tenant)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		if !exists {
			HandleForbiddenError(c)
			c.Abort()
			return
		}

		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			c.Abort()
			return
		}

		allowed, err := repo.HasTenantAccess(c.Request.Context(), *userID, tenant)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		if !allowed {
			HandleForbiddenError(c)
			c.Abort()
			return
		}

		c.Set(TenantContextKey, tenant)
		if utils.GetBoolEnvOrDefault(tenantViewsReadEnabledEnv, false) {
			c.Request = c.Request.WithContext(types.ContextWithTenant(c.Request.Context(), tenant))
		}
		c.Next()
	}
}

// GetTenant returns the tenant code resolved by RequireTenantAccess. It errors when the
// context holds no tenant — i.e. the handler was reached outside the tenant-routing middleware.
func GetTenant(c *gin.Context) (*string, error) {
	value, exists := c.Get(TenantContextKey)
	if !exists {
		return nil, fmt.Errorf("tenant not found in context")
	}
	tenant, ok := value.(string)
	if !ok {
		return nil, fmt.Errorf("tenant in context is not a string")
	}
	return &tenant, nil
}

type actionChecker interface {
	HasAction(ctx context.Context, userID, tenantCode, orgCode, actionCode string) (bool, error)
}

// TenantWideOrg is the org code passed for tenant-scoped actions: HasAction ignores the org
// for those, so they need no resource lookup. Against an org-scoped action it would match
// only '*' grants — which is why every org-scoped route must carry a real OrgResolver.
const TenantWideOrg = ""

// OrgContextKey is the gin context key under which the action middlewares store the orgs
// they resolved, so a handler can reuse them instead of repeating the lookup.
const OrgContextKey = "authorized_orgs"

// OrgResolver resolves the organizations the request's target resource belongs to — the
// diagnosis labs of the cases it hangs off (see the resolvers in org_resolvers.go). The
// caller is admitted when they hold the action at any one of them.
//
// Resolving to no org denies. A resource that cannot be attributed to a case — it does not
// exist, belongs to another tenant, or the id is malformed — is never implicitly allowed,
// and the denial is the same generic 403 as a missing grant so the check does not become an
// existence oracle. A handler that runs has already been authorized, so it is free to 404 on
// its own lookup.
type OrgResolver func(c *gin.Context) ([]string, error)

// tenantWideOrg is the resolver for tenant-scoped actions, where the org is not consulted.
func tenantWideOrg(_ *gin.Context) ([]string, error) {
	return []string{TenantWideOrg}, nil
}

// GetAuthorizedOrgs returns the orgs the action middleware resolved for this request.
func GetAuthorizedOrgs(c *gin.Context) ([]string, bool) {
	value, exists := c.Get(OrgContextKey)
	if !exists {
		return nil, false
	}
	orgs, ok := value.([]string)
	return orgs, ok
}

// RequireAction gates a route on a tenant-scoped action, where the org is not consulted.
// An org-scoped action belongs on RequireActionAt, so the grant is checked against the
// resource's own organization — the one exception being the batch routes, whose org lives
// per record in the payload and is checked inline during validation.
func RequireAction(auth utils.Auth, repo actionChecker, action string) gin.HandlerFunc {
	return requireActions(auth, repo, tenantWideOrg, action)
}

// RequireAnyAction gates a route on holding at least one of several tenant-scoped actions.
// It serves the reads several admin sections share: the role catalog, for one, is read both
// by role management (can_manage_role) and by the role picker in the user screens
// (can_manage_user), and neither action implies the other.
func RequireAnyAction(auth utils.Auth, repo actionChecker, actions ...string) gin.HandlerFunc {
	return requireActions(auth, repo, tenantWideOrg, actions...)
}

// RequireActionAt gates a route on an org-scoped action, checked against the organizations
// the resolver attributes the target resource to.
func RequireActionAt(auth utils.Auth, repo actionChecker, action string, resolve OrgResolver) gin.HandlerFunc {
	return requireActions(auth, repo, resolve, action)
}

// requireActions is the shared gate. It reads the caller from the token and the tenant from
// context (RequireTenantAccess must run first), resolves the resource's orgs, and admits the
// caller holding any of the actions at any of those orgs. On denial the missing action is
// logged, not returned, so the 403 body stays generic.
func requireActions(auth utils.Auth, repo actionChecker, resolve OrgResolver, actions ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, err := auth.RetrieveUserIdFromToken(c)
		if err != nil {
			HandleUnauthorizedError(c)
			c.Abort()
			return
		}

		tenant, err := GetTenant(c)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}

		orgs, err := resolve(c)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		c.Set(OrgContextKey, orgs)

		for _, action := range actions {
			for _, org := range orgs {
				allowed, err := repo.HasAction(c.Request.Context(), *userID, *tenant, org, action)
				if err != nil {
					HandleError(c, err)
					c.Abort()
					return
				}
				if allowed {
					c.Next()
					return
				}
			}
		}

		slog.WarnContext(c.Request.Context(), "forbidden: caller lacks required action",
			slog.String("user_id", *userID),
			slog.Any("actions", actions),
			slog.String("tenant", *tenant),
			slog.Any("orgs", orgs),
		)
		HandleForbiddenError(c)
		c.Abort()
	}
}
