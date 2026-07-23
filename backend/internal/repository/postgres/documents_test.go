package postgres

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_GetByUrl_Success(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(database.PostgresDB{DB: db})
		document, err := repo.GetDocumentByUrl(t.Context(), "s3://cqdg-prod-file-workspace/Postprocessing/exomiser/SH032.exomiser.vcf.gz.tbi")
		assert.NoError(t, err)
		assert.NotNil(t, document)
		assert.Equal(t, 236, document.ID)
		assert.Equal(t, "SH032.exomiser.vcf.gz.tbi", document.Name)
		assert.Equal(t, "tbi", document.FileFormatCode)
	})
}

func Test_GetByUrl_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := NewDocumentsRepository(database.PostgresDB{DB: db})
		document, err := repo.GetDocumentByUrl(t.Context(), "s3://radiant-data-test/case_999999/Fi9999999/S99999/Fi9999999.S99999.vcf.gz")
		assert.NoError(t, err)
		assert.Nil(t, document)
	})
}
