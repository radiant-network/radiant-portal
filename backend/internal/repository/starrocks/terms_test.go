package starrocks

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_GetTermAutoComplete(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTermsRepository(database.StarrocksDB{DB: env.Starrocks})
		terms, err := repo.GetTermAutoComplete(t.Context(), types.MondoTable.Name, "blood", 20)
		assert.NoError(t, err)
		assert.Equal(t, 2, len(*terms))
		assert.Equal(t, "MONDO:0000001", (*terms)[0].Source.ID)
		assert.Equal(t, "blood group incompatibility", (*terms)[0].Source.Name)
		assert.Equal(t, "MONDO:0000001", (*terms)[0].HighLight.ID)
		assert.Equal(t, "<strong>blood</strong> group incompatibility", (*terms)[0].HighLight.Name)
		assert.Equal(t, "MONDO:0000002", (*terms)[1].Source.ID)
	})
}

func Test_GetTermAutoCompleteWithLimit(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTermsRepository(database.StarrocksDB{DB: env.Starrocks})
		terms, err := repo.GetTermAutoComplete(t.Context(), types.MondoTable.Name, "blood", 1)
		assert.NoError(t, err)
		assert.Equal(t, 1, len(*terms))
		assert.Equal(t, "MONDO:0000001", (*terms)[0].Source.ID)
		assert.Equal(t, "blood group incompatibility", (*terms)[0].Source.Name)
		assert.Equal(t, "MONDO:0000001", (*terms)[0].HighLight.ID)
		assert.Equal(t, "<strong>blood</strong> group incompatibility", (*terms)[0].HighLight.Name)
	})
}

func Test_GetTermAutoCompleteNoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTermsRepository(database.StarrocksDB{DB: env.Starrocks})
		terms, err := repo.GetTermAutoComplete(t.Context(), types.MondoTable.Name, "not_here", 20)
		assert.NoError(t, err)
		assert.Equal(t, 0, len(*terms))
	})
}

func Test_GetTermNameById(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTermsRepository(database.StarrocksDB{DB: env.Starrocks})
		term, err := repo.GetTermNameById(t.Context(), types.MondoTable.Name, "MONDO:0000003")
		assert.NoError(t, err)
		assert.Equal(t, "colorblindness, partial", *term)
	})
}

func Test_GetTermNameByIdNoResult(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "simple"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTermsRepository(database.StarrocksDB{DB: env.Starrocks})
		term, err := repo.GetTermNameById(t.Context(), types.MondoTable.Name, "MONDO:not_existing")
		assert.NoError(t, err)
		assert.Nil(t, term)
	})
}
