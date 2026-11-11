package server

import "github.com/gin-gonic/gin"

// tenantRouter mirrors RequireTenantAccess for handler unit tests: it stores the
// :tenant path segment under TenantContextKey so handlers can resolve GetTenant(c)
// without wiring the full auth middleware.
func tenantRouter() *gin.Engine {
	r := gin.Default()
	r.Use(func(c *gin.Context) { c.Set(TenantContextKey, c.Param("tenant")) })
	return r
}
