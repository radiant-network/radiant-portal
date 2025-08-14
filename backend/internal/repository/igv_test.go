package repository

import (
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func Test_IGVInternal_GetIGV(t *testing.T) {
	testutils.ParallelTestWithPostgresAndStarrocks(t, "simple", func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB) {
		repo := NewIGVRepository(starrocks)
		igvInternal, err := repo.GetIGV(1)
		assert.NoError(t, err)
		assert.Len(t, igvInternal, 6)
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 1,
			PatientId:              3,
			FamilyRole:             "proband",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "crai",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12878/NA12878.recal.crai",
		}, igvInternal[0])
		assert.Equal(t, IGVTrack{
			SequencingExperimentId: 3,
			PatientId:              2,
			FamilyRole:             "father",
			SexCode:                "male",
			DataTypeCode:           "alignment",
			FormatCode:             "cram",
			URL:                    "s3://cqdg-prod-file-workspace/sarek/preprocessing/recalibrated/NA12892/NA12892.recal.cram",
		}, igvInternal[5])
	})
}
