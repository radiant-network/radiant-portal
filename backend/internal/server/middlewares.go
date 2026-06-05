package server

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/utils"
)

// TenantContextKey is the gin context key under which RequireTenantAccess stores the
// resolved tenant code for downstream handlers.
const TenantContextKey = "tenant"

// RequireTenantAccess gates tenant-scoped routes (`/:tenant/...`). It always reads the
// `tenant` path param and stores the resolved tenant code in the request context. When
// enforce is true it additionally verifies the caller holds at least one role in that
// tenant, rejecting cross-tenant access with 403.
//
// enforce is wired from TENANT_ENFORCEMENT_ENABLED so the path-prefix routing can be
// deployed before users are backfilled into user_role: with enforcement off, routing and
// context still work but nobody is locked out. Flip it on once the backfill lands.
func RequireTenantAccess(auth utils.Auth, repo repository.AuthRepositoryDAO, enforce bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant := c.Param("tenant")

		if enforce {
			email, err := auth.RetrieveEmailFromToken(c)
			if err != nil {
				HandleUnauthorizedError(c)
				c.Abort()
				return
			}

			allowed, err := repo.HasTenantAccess(*email, tenant)
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
