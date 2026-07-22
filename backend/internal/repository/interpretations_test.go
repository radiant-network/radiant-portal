package repository

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/client"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

type MockPubmedClient struct{}

func (m *MockPubmedClient) GetCitationById(id string) (*types.PubmedCitation, error) {
	return &types.PubmedCitation{
		ID:  id,
		Nlm: types.PubmedCitationDetails{Format: "citation_" + id},
	}, nil
}

func newTestInterpretationsRepo(db *gorm.DB) *InterpretationsRepository {
	return NewInterpretationsRepository(database.PostgresDB{DB: db}, client.PubmedClientService(&MockPubmedClient{}))
}

// --- Germline ---

func Test_Interpretations_FirstGermline(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		interpretation, err := repo.FirstGermline(t.Context(), "1", "1", "1000", "T001")
		assert.NoError(t, err)
		if assert.NotNil(t, interpretation) {
			assert.Equal(t, "1", interpretation.CaseId)
			assert.Equal(t, "1", interpretation.SequencingId)
			assert.Equal(t, "1000", interpretation.LocusId)
			assert.Equal(t, "T001", interpretation.TranscriptId)
			assert.Equal(t, "MONDO:0000001", interpretation.Condition)
			assert.Equal(t, "LA6668-3", interpretation.Classification)
			assert.Equal(t, []string{"PM1"}, interpretation.ClassificationCriterias)
			assert.Equal(t, []string{"autosomal_dominant_de_novo"}, interpretation.TransmissionModes)
		}
	})
}

// A row belonging to the radiant tenant must be invisible to a caller acting in another
// tenant — the WithTenant scope filters it out, and the handler surfaces nil as 404 (no
// existence leak). It is visible to the radiant tenant itself.
func Test_Interpretations_FirstGermline_CrossTenantIsInvisible(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ReadPostgres}, func(t *testing.T, env *testutils.Env) {
		repo := newTestInterpretationsRepo(env.Postgres)

		other := types.ContextWithTenant(t.Context(), "tenant_b")
		got, err := repo.FirstGermline(other, "1", "1", "1000", "T001")
		assert.NoError(t, err)
		assert.Nil(t, got, "radiant interpretation must be invisible to another tenant")

		radiant := types.ContextWithTenant(t.Context(), types.DefaultTenantCode)
		got, err = repo.FirstGermline(radiant, "1", "1", "1000", "T001")
		assert.NoError(t, err)
		assert.NotNil(t, got, "radiant interpretation must be visible to the radiant tenant")
	})
}

func Test_Interpretations_FirstGermline_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		interpretation, err := repo.FirstGermline(t.Context(), "999", "999", "999", "T999")
		assert.NoError(t, err)
		assert.Nil(t, interpretation)
	})
}

func Test_Interpretations_CreateOrUpdateGermline_Create(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		interpretation := &types.InterpretationGermline{
			InterpretationCommon: types.InterpretationCommon{
				TenantCode:    types.DefaultTenantCode,
				CaseId:        "99",
				SequencingId:  "99",
				LocusId:       "9999",
				TranscriptId:  "T099",
				CreatedBy:     "user1",
				CreatedByName: "User One",
				UpdatedBy:     "user1",
				UpdatedByName: "User One",
			},
			Condition:      "MONDO:0000099",
			Classification: "LA6675-8",
		}
		err := repo.CreateOrUpdateGermline(t.Context(), interpretation)
		assert.NoError(t, err)
		assert.NotEmpty(t, interpretation.ID)

		found, err := repo.FirstGermline(t.Context(), "99", "99", "9999", "T099")
		assert.NoError(t, err)
		if assert.NotNil(t, found) {
			assert.Equal(t, "MONDO:0000099", found.Condition)
			assert.Equal(t, "LA6675-8", found.Classification)
		}
	})
}

func Test_Interpretations_CreateOrUpdateGermline_Update(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)

		// Create a fresh record (not fixture) to update
		interpretation := &types.InterpretationGermline{
			InterpretationCommon: types.InterpretationCommon{
				TenantCode:    types.DefaultTenantCode,
				CaseId:        "98",
				SequencingId:  "98",
				LocusId:       "9998",
				TranscriptId:  "T098",
				CreatedBy:     "user1",
				CreatedByName: "User One",
				UpdatedBy:     "user1",
				UpdatedByName: "User One",
			},
			Condition:      "MONDO:0000001",
			Classification: "LA6668-3",
		}
		err := repo.CreateOrUpdateGermline(t.Context(), interpretation)
		assert.NoError(t, err)

		// Now update it
		interpretation.Classification = "LA26333-7"
		err = repo.CreateOrUpdateGermline(t.Context(), interpretation)
		assert.NoError(t, err)

		updated, err := repo.FirstGermline(t.Context(), "98", "98", "9998", "T098")
		assert.NoError(t, err)
		if assert.NotNil(t, updated) {
			assert.Equal(t, "LA26333-7", updated.Classification)
		}
	})
}

func Test_Interpretations_SearchGermline(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		results, err := repo.SearchGermline(t.Context(), []string{}, []string{}, []string{})
		assert.NoError(t, err)
		assert.NotNil(t, results)
	})
}

func Test_Interpretations_RetrieveGermlineClassificationCounts(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		counts, err := repo.RetrieveGermlineInterpretationClassificationCounts(t.Context(), 1000)
		assert.NoError(t, err)
		if assert.NotNil(t, counts) {
			assert.Equal(t, 1, counts["pathogenic"])
			assert.Equal(t, 1, counts["benign"])
			assert.Equal(t, 1, counts["likelyPathogenic"])
		}
	})
}

func Test_Interpretations_RetrieveGermlineClassificationCounts_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		counts, err := repo.RetrieveGermlineInterpretationClassificationCounts(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Nil(t, counts)
	})
}

// --- Somatic ---

func Test_Interpretations_FirstSomatic(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		interpretation, err := repo.FirstSomatic(t.Context(), "1", "1", "1000", "T001")
		assert.NoError(t, err)
		if assert.NotNil(t, interpretation) {
			assert.Equal(t, "1", interpretation.CaseId)
			assert.Equal(t, "1", interpretation.SequencingId)
			assert.Equal(t, "1000", interpretation.LocusId)
			assert.Equal(t, "T001", interpretation.TranscriptId)
			assert.Equal(t, "MONDO:0000004", interpretation.TumoralType)
			assert.Equal(t, "Oncogenic", interpretation.Oncogenicity)
			assert.Equal(t, []string{"OS1"}, interpretation.OncogenicityClassificationCriterias)
			assert.Equal(t, "tier_1", interpretation.ClinicalUtility)
		}
	})
}

func Test_Interpretations_FirstSomatic_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		interpretation, err := repo.FirstSomatic(t.Context(), "999", "999", "999", "T999")
		assert.NoError(t, err)
		assert.Nil(t, interpretation)
	})
}

func Test_Interpretations_CreateOrUpdateSomatic_Create(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		interpretation := &types.InterpretationSomatic{
			InterpretationCommon: types.InterpretationCommon{
				TenantCode:    types.DefaultTenantCode,
				CaseId:        "97",
				SequencingId:  "97",
				LocusId:       "9997",
				TranscriptId:  "T097",
				CreatedBy:     "user1",
				CreatedByName: "User One",
				UpdatedBy:     "user1",
				UpdatedByName: "User One",
			},
			TumoralType:  "MONDO:0000004",
			Oncogenicity: "Oncogenic",
		}
		err := repo.CreateOrUpdateSomatic(t.Context(), interpretation)
		assert.NoError(t, err)
		assert.NotEmpty(t, interpretation.ID)

		found, err := repo.FirstSomatic(t.Context(), "97", "97", "9997", "T097")
		assert.NoError(t, err)
		if assert.NotNil(t, found) {
			assert.Equal(t, "MONDO:0000004", found.TumoralType)
			assert.Equal(t, "Oncogenic", found.Oncogenicity)
		}
	})
}

func Test_Interpretations_CreateOrUpdateSomatic_Update(t *testing.T) {
	testutils.SequentialTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)

		interpretation := &types.InterpretationSomatic{
			InterpretationCommon: types.InterpretationCommon{
				TenantCode:    types.DefaultTenantCode,
				CaseId:        "96",
				SequencingId:  "96",
				LocusId:       "9996",
				TranscriptId:  "T096",
				CreatedBy:     "user1",
				CreatedByName: "User One",
				UpdatedBy:     "user1",
				UpdatedByName: "User One",
			},
			TumoralType:  "MONDO:TEST00001",
			Oncogenicity: "Likely Oncogenic",
		}
		err := repo.CreateOrUpdateSomatic(t.Context(), interpretation)
		assert.NoError(t, err)

		interpretation.Oncogenicity = "Oncogenic"
		err = repo.CreateOrUpdateSomatic(t.Context(), interpretation)
		assert.NoError(t, err)

		updated, err := repo.FirstSomatic(t.Context(), "96", "96", "9996", "T096")
		assert.NoError(t, err)
		if assert.NotNil(t, updated) {
			assert.Equal(t, "Oncogenic", updated.Oncogenicity)
		}
	})
}

func Test_Interpretations_SearchSomatic(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		results, err := repo.SearchSomatic(t.Context(), []string{}, []string{}, []string{})
		assert.NoError(t, err)
		assert.NotNil(t, results)
	})
}

func Test_Interpretations_RetrieveSomaticClassificationCounts(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		counts, err := repo.RetrieveSomaticInterpretationClassificationCounts(t.Context(), 1000)
		assert.NoError(t, err)
		if assert.NotNil(t, counts) {
			assert.Equal(t, 2, counts["Oncogenic"])
			assert.Equal(t, 1, counts["Likely Oncogenic"])
		}
	})
}

func Test_Interpretations_RetrieveSomaticClassificationCounts_NotFound(t *testing.T) {
	testutils.ParallelTestWithPostgres(t, func(t *testing.T, db *gorm.DB) {
		repo := newTestInterpretationsRepo(db)
		counts, err := repo.RetrieveSomaticInterpretationClassificationCounts(t.Context(), 999999)
		assert.NoError(t, err)
		assert.Nil(t, counts)
	})
}
