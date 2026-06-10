package server

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/golang/glog"
	"github.com/radiant-network/radiant-api/internal/utils"
)

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
			glog.Warningf("forbidden: user %q lacks action %q in tenant %q", *userID, action, *tenant)
			HandleForbiddenError(c)
			c.Abort()
			return
		}

		c.Next()
	}
}
