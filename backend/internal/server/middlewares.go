package server

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/observability"
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
func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()

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

// tenantAccessChecker reports whether a caller may access a tenant. RequireTenantAccess
// needs only this slice of the auth repository.
type tenantAccessChecker interface {
	HasTenantAccess(userID, tenantCode string) (bool, error)
}

// RequireTenantAccess gates tenant-scoped routes (`/:tenant/...`). It always reads the
// `tenant` path param and stores the resolved tenant code in the request context. When
// enforce is true it additionally verifies the caller holds at least one role in that
// tenant, rejecting cross-tenant access with 403.
//
// enforce is wired from TENANT_ENFORCEMENT_ENABLED so the path-prefix routing can be
// deployed before users are backfilled into user_role: with enforcement off, routing and
// context still work but nobody is locked out. Flip it on once the backfill lands.
func RequireTenantAccess(auth utils.Auth, repo tenantAccessChecker, enforce bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant := c.Param("tenant")

		if enforce {
			userID, err := auth.RetrieveUserIdFromToken(c)
			if err != nil {
				HandleUnauthorizedError(c)
				c.Abort()
				return
			}

			allowed, err := repo.HasTenantAccess(*userID, tenant)
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
		}

		c.Set(TenantContextKey, tenant)
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

func RequireRole(auth utils.Auth, role string, resourceName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		hasRole, err := auth.UserHasRole(c, role, resourceName)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		if !hasRole {
			HandleForbiddenError(c)
			c.Abort()
			return
		}
		c.Next()
	}
}

type actionChecker interface {
	HasAction(userID, tenantCode, orgCode, actionCode string) (bool, error)
}

// WildcardOnlyOrg matches only '*' grants in HasAction (GrantRole stores empty orgs as NULL),
// so it is correct while every grant is '*'. STEP 2 will resolve the real org per resource.
const WildcardOnlyOrg = ""

func resolveOrgCode(_ *gin.Context) (string, error) {
	return WildcardOnlyOrg, nil
}

// RequireAction gates a route on an action. It reads the caller from the token and the tenant
// from context (RequireTenantAccess must run first). enforce is wired from
// TENANT_ENFORCEMENT_ENABLED; when off it allows. On denial the missing action is logged, not
// returned, so the 403 body stays generic.
func RequireAction(auth utils.Auth, repo actionChecker, action string, enforce bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !enforce {
			c.Next()
			return
		}

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

		orgCode, err := resolveOrgCode(c)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}

		allowed, err := repo.HasAction(*userID, *tenant, orgCode, action)
		if err != nil {
			HandleError(c, err)
			c.Abort()
			return
		}
		if !allowed {
			slog.WarnContext(c.Request.Context(), "forbidden: caller lacks required action",
				slog.String("user_id", *userID),
				slog.String("action", action),
				slog.String("tenant", *tenant),
			)
			HandleForbiddenError(c)
			c.Abort()
			return
		}

		c.Next()
	}
}
