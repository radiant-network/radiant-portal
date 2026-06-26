package repository

import (
	"context"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

// WithTenant is a GORM scope that constrains a PostgreSQL query to the active tenant when one is
// bound to the context (set by server.RequireTenantAccess). It adds `tenant_code = ?` so that a
// row belonging to another tenant is invisible to reads/updates/deletes — handlers surface that
// as 404. When no tenant is bound it is a no-op: the worker (which processes every tenant's
// batches) and any path running before tenant isolation is enabled keep their current behavior.
//
// Use it only on single tenant-scoped tables, where the unqualified `tenant_code` is unambiguous.
func WithTenant(ctx context.Context) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if code, ok := types.TenantFromContext(ctx); ok && code != "" {
			return db.Where("tenant_code = ?", code)
		}
		return db
	}
}
