package utils

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
	"gorm.io/gorm/utils/tests"
)

// paginatedQuery renders the SQL a paginated query produces and its bound values, without
// executing it. LIMIT and OFFSET are placeholders, so the values land in Vars.
func paginatedQuery(t *testing.T, pagination *types.Pagination) (string, []any) {
	t.Helper()
	db, err := gorm.Open(tests.DummyDialector{}, &gorm.Config{DryRun: true})
	require.NoError(t, err)

	var rows []map[string]any
	tx := db.Session(&gorm.Session{DryRun: true}).Table("users")
	AddPagination(tx, pagination)
	statement := tx.Find(&rows).Statement
	return statement.SQL.String(), statement.Vars
}

func Test_AddPagination_AppliesLimitAndOffset(t *testing.T) {
	t.Parallel()
	sql, vars := paginatedQuery(t, &types.Pagination{Limit: 25, Offset: 50})
	assert.Contains(t, sql, "LIMIT ? OFFSET ?")
	assert.Equal(t, []any{25, 50}, vars)
}

func Test_AddPagination_CapsLimitAtMaxLimit(t *testing.T) {
	t.Parallel()
	_, vars := paginatedQuery(t, &types.Pagination{Limit: 5000})
	assert.Equal(t, []any{MaxLimit}, vars, "an oversized limit is clamped, offset 0 adds no clause")
}

func Test_AddPagination_PageIndexReplacesOffset(t *testing.T) {
	t.Parallel()
	_, vars := paginatedQuery(t, &types.Pagination{Limit: 20, PageIndex: 3})
	assert.Equal(t, []any{20, 60}, vars, "page 3 of 20 starts at row 60")
}

func Test_AddPagination_NoPaginationFallsBackToMinLimit(t *testing.T) {
	t.Parallel()
	sql, vars := paginatedQuery(t, nil)
	assert.NotContains(t, sql, "OFFSET")
	assert.Equal(t, []any{MinLimit}, vars)
}
