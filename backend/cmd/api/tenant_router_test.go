package main

import (
	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/server"
)

// tenantRouter mirrors RequireTenantAccess for integration tests that register
// /:tenant routes directly: it stores the :tenant segment under TenantContextKey so
// handlers can resolve GetTenant(c) without the full auth middleware.
func tenantRouter() *gin.Engine {
	r := gin.Default()
	r.Use(func(c *gin.Context) { c.Set(server.TenantContextKey, c.Param("tenant")) })
	return r
}
