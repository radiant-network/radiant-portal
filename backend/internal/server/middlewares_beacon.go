package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RequireTenantExists gates the anonymous Beacon framework endpoints (/info, /configuration, …).
// Unlike RequireTenantAccess it needs no caller: it only refuses a tenant that does not exist,
// with a 404 in the Beacon error envelope. Tenant codes are part of every public beacon URL,
// so confirming one exists discloses nothing. It stores the tenant like RequireTenantAccess does
// so the handlers behind it can call GetTenant.
func RequireTenantExists(repo tenantAccessChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		tenant := c.Param("tenant")
		exists, err := repo.TenantExists(c.Request.Context(), tenant)
		if err != nil {
			handleBeaconInternalError(c, tenant, err)
			c.Abort()
			return
		}
		if !exists {
			handleBeaconError(c, tenant, http.StatusNotFound, "unknown beacon: no such tenant")
			c.Abort()
			return
		}
		c.Set(TenantContextKey, tenant)
		c.Next()
	}
}
