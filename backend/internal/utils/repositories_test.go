package utils

import (
	"context"
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_CtxOf_ReturnsStatementContext(t *testing.T) {
	t.Parallel()
	ctx := types.ContextWithTenant(context.Background(), "cbtn")
	tx := &gorm.DB{Statement: &gorm.Statement{Context: ctx}}
	code, ok := types.TenantFromContext(CtxOf(tx))
	assert.True(t, ok)
	assert.Equal(t, "cbtn", code)
}

func Test_CtxOf_NilOrEmpty_ReturnsBackground(t *testing.T) {
	t.Parallel()
	_, ok := types.TenantFromContext(CtxOf(nil))
	assert.False(t, ok)

	_, ok = types.TenantFromContext(CtxOf(&gorm.DB{}))
	assert.False(t, ok)
}
