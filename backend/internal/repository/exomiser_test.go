package repository

import (
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"testing"
)

func Test_GetExomiser(t *testing.T) {
	testutils.ParallelTestWithDb(t, "exomiser", func(t *testing.T, db *gorm.DB) {
		repo := NewExomiserRepository(db)
		expected := []types.Exomiser{
			{
				Part:               1,
				SeqId:              1,
				LocusId:            "1000",
				Id:                 "exomiser1000",
				LocusHash:          "hash1000",
				Moi:                "AD",
				VariantScore:       0.95,
				GeneCombinedScore:  0.85,
				VariantRank:        1,
				Rank:               1,
				Symbol:             "GENE1000",
				AcmgClassification: "Pathogenic",
				AcmgEvidence:       types.JsonArray[string]{"PVS1", "PS1"},
			},
			{
				Part:               2,
				SeqId:              2,
				LocusId:            "1000",
				Id:                 "exomiser1001",
				LocusHash:          "hash1001",
				Moi:                "AR",
				VariantScore:       0.90,
				GeneCombinedScore:  0.80,
				VariantRank:        1,
				Rank:               2,
				Symbol:             "GENE1001",
				AcmgClassification: "Pathogenic",
				AcmgEvidence:       types.JsonArray[string]{"PS4", "PM2"},
			},
			{
				Part:               3,
				SeqId:              3,
				LocusId:            "1000",
				Id:                 "exomiser1002",
				LocusHash:          "hash1002",
				Moi:                "XR",
				VariantScore:       0.80,
				GeneCombinedScore:  0.75,
				VariantRank:        1,
				Rank:               3,
				Symbol:             "GENE1002",
				AcmgClassification: "VUS",
				AcmgEvidence:       types.JsonArray[string]{"PP3", "PM1"},
			},
		}

		exomiser, err := repo.GetExomiser(1000)
		assert.NoError(t, err)
		assert.ElementsMatch(t, expected, exomiser)
	})
}

func Test_GetExomiser_Empty(t *testing.T) {
	testutils.ParallelTestWithDb(t, "exomiser", func(t *testing.T, db *gorm.DB) {
		repo := NewExomiserRepository(db)
		exomiser, err := repo.GetExomiser(42)
		assert.NoError(t, err)
		assert.Nil(t, exomiser)
	})
}

func Test_GetExomiserACMGClassificationCounts(t *testing.T) {
	testutils.ParallelTestWithDb(t, "exomiser", func(t *testing.T, db *gorm.DB) {
		repo := NewExomiserRepository(db)
		expected := map[string]int{"Pathogenic": 2, "VUS": 1}

		exomiser, err := repo.GetExomiserACMGClassificationCounts(1000)
		assert.NoError(t, err)
		assert.Equal(t, expected, exomiser)
	})
}

func Test_GetExomiserACMGClassificationCounts_Empty(t *testing.T) {
	testutils.ParallelTestWithDb(t, "exomiser", func(t *testing.T, db *gorm.DB) {
		repo := NewExomiserRepository(db)
		exomiser, err := repo.GetExomiserACMGClassificationCounts(42)
		assert.NoError(t, err)
		assert.Nil(t, exomiser)
	})
}
