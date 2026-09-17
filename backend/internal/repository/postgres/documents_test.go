package postgres

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_GetByUrl_Success(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewDocumentsRepository(database.PostgresDB{DB: env.Postgres})
		document, err := repo.GetDocumentByUrl(t.Context(), "s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz.tbi", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.NotNil(t, document)
		assert.Equal(t, 236, document.ID)
		assert.Equal(t, "SH032.exomiser.vcf.gz.tbi", document.Name)
		assert.Equal(t, "tbi", document.FileFormatCode)
	})
}

func Test_GetByUrl_NotFound(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		repo := NewDocumentsRepository(database.PostgresDB{DB: env.Postgres})
		document, err := repo.GetDocumentByUrl(t.Context(), "s3://radiant-data-test/case_999999/Fi9999999/S99999/Fi9999999.S99999.vcf.gz", types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, document)
	})
}

func Test_GetDocumentByUrl_OtherTenantRow_NotReturned(t *testing.T) {
	// document.url carries no UNIQUE constraint, so the same S3 URL can legitimately be
	// registered by two tenants — the lookup must return the caller's row, not the first match.
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		repo := NewDocumentsRepository(database.PostgresDB{DB: db})
		const url = "s3://bucket/tenant-iso/variants.vcf.gz"
		require.NoError(t, db.Exec(`
			INSERT INTO document (id, name, data_category_code, data_type_code, format_code, size, url, tenant_code)
			VALUES (1020, 'variants.vcf.gz', 'genomic', 'snv', 'vcf', 10, ?, 'tenant_b')
		`, url).Error)

		document, err := repo.GetDocumentByUrl(t.Context(), url, types.DefaultTenantCode)
		assert.NoError(t, err)
		assert.Nil(t, document, "a document that exists only in tenant_b must not resolve for radiant")

		document, err = repo.GetDocumentByUrl(t.Context(), url, "tenant_b")
		assert.NoError(t, err)
		require.NotNil(t, document)
		assert.Equal(t, 1020, document.ID)
	})
}
