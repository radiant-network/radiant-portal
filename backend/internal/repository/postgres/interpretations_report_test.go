package postgres

import (
	"database/sql"
	"strconv"
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

// partialPubmedClient resolves id 1 only: id 2 is unknown to PubMed, like a retracted or mistyped id.
type partialPubmedClient struct{}

func (m *partialPubmedClient) GetCitationById(id string) (*types.PubmedCitation, error) {
	if id == "1" {
		return &types.PubmedCitation{ID: id, Nlm: types.PubmedCitationDetails{Format: "citation_1"}}, nil
	}
	return nil, nil
}

// insertReportInterpretations seeds one case (caseId) and a sibling case (caseId+1) so the
// tests run in parallel on disjoint keys; cleanUp drops every case but '1'.
func insertReportInterpretations(t *testing.T, db *gorm.DB, caseId int) {
	err := db.Exec(`INSERT INTO interpretation_germline (sequencing_id, case_id, locus_id, transcript_id, condition, classification, classification_criterias, transmission_modes, pubmed, updated_at, tenant_code)
		VALUES ('1', @case, '1000', 'ENST1', 'MONDO:0000001', 'LA6668-3', 'PM1,PM2', 'autosomal_dominant', '1,2', '2025-05-23 14:57:36.0', 'radiant'),
		       ('1', @case, '2000', 'ENST2', 'MONDO:0000002', 'LA6675-8', '', '', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('1', @case, '3000', 'ENST3', 'MONDO:0000003', 'LA6675-8', '', '', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2', @case, '1000', 'ENST1', 'MONDO:0000001', 'LA6668-3', '', '', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('1', @sibling, '1000', 'ENST1', 'MONDO:0000001', 'LA6668-3', '', '', '', '2025-05-23 14:57:36.0', 'radiant')`,
		sql.Named("case", strconv.Itoa(caseId)), sql.Named("sibling", strconv.Itoa(caseId+1))).Error
	assert.NoError(t, err)
}

func Test_Interpretations_ListGermlineForReport(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		insertReportInterpretations(t, env.Postgres, 1100)
		repo := NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &partialPubmedClient{})

		interpretations, err := repo.ListGermlineForReport(t.Context(), "1100", "1", []string{"1000", "2000"})

		assert.NoError(t, err)
		if assert.Len(t, interpretations, 2) {
			first := interpretations[0]
			assert.Equal(t, "1100", first.CaseId)
			assert.Equal(t, "1", first.SequencingId)
			assert.Equal(t, "1000", first.LocusId)
			assert.Equal(t, "ENST1", first.TranscriptId)
			assert.Equal(t, "MONDO:0000001", first.Condition)
			assert.Equal(t, "LA6668-3", first.Classification)
			assert.Equal(t, []string{"PM1", "PM2"}, first.ClassificationCriterias)
			assert.Equal(t, []string{"autosomal_dominant"}, first.TransmissionModes)
			assert.Equal(t, []types.InterpretationPubmed{{CitationID: "1", Citation: "citation_1"}, {CitationID: "2"}}, first.Pubmed)

			second := interpretations[1]
			assert.Equal(t, "2000", second.LocusId)
			assert.Equal(t, "ENST2", second.TranscriptId)
			assert.Empty(t, second.Pubmed)
			assert.Empty(t, second.ClassificationCriterias)
		}
	})
}

func Test_Interpretations_ListGermlineForReport_NoMatch_ReturnsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		insertReportInterpretations(t, env.Postgres, 1200)
		repo := NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &partialPubmedClient{})

		interpretations, err := repo.ListGermlineForReport(t.Context(), "1200", "1", []string{"9000"})

		assert.NoError(t, err)
		assert.Empty(t, interpretations)
	})
}

func Test_Interpretations_FirstGermline_StillFailsOnUnknownCitation(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		insertReportInterpretations(t, env.Postgres, 1300)
		repo := NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &partialPubmedClient{})

		interpretation, err := repo.FirstGermline(t.Context(), "1300", "1", "1000", "ENST1")

		assert.Nil(t, interpretation)
		assert.EqualError(t, err, "pubmed citation not found: 2")
	})
}

func insertSomaticReportInterpretations(t *testing.T, db *gorm.DB, caseId int) {
	err := db.Exec(`INSERT INTO interpretation_somatic (sequencing_id, case_id, locus_id, transcript_id, tumoral_type, oncogenicity, oncogenicity_classification_criterias, clinical_utility, pubmed, updated_at, tenant_code)
		VALUES ('1', @case, '1000', 'ENST1', 'MONDO:0000004', 'LA26332-9', 'OS1,OS2', 'category_ib', '1,2', '2025-05-23 14:57:36.0', 'radiant'),
		       ('1', @case, '2000', 'ENST2', 'MONDO:0000005', '', '', 'category_iii', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('2', @case, '1000', 'ENST1', 'MONDO:0000004', 'LA6668-3', '', 'category_ia', '', '2025-05-23 14:57:36.0', 'radiant'),
		       ('1', @sibling, '1000', 'ENST1', 'MONDO:0000004', 'LA6668-3', '', 'category_ia', '', '2025-05-23 14:57:36.0', 'radiant')`,
		sql.Named("case", strconv.Itoa(caseId)), sql.Named("sibling", strconv.Itoa(caseId+1))).Error
	assert.NoError(t, err)
}

func Test_Interpretations_ListSomaticForReport(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		insertSomaticReportInterpretations(t, env.Postgres, 1300)
		repo := NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &partialPubmedClient{})

		interpretations, err := repo.ListSomaticForReport(t.Context(), "1300", "1", []string{"1000", "2000"})

		assert.NoError(t, err)
		if assert.Len(t, interpretations, 2) {
			first := interpretations[0]
			assert.Equal(t, "1300", first.CaseId)
			assert.Equal(t, "1", first.SequencingId)
			assert.Equal(t, "1000", first.LocusId)
			assert.Equal(t, "ENST1", first.TranscriptId)
			assert.Equal(t, "MONDO:0000004", first.TumoralType)
			assert.Equal(t, "LA26332-9", first.Oncogenicity)
			assert.Equal(t, []string{"OS1", "OS2"}, first.OncogenicityClassificationCriterias)
			assert.Equal(t, "category_ib", first.ClinicalUtility)
			assert.Equal(t, []types.InterpretationPubmed{{CitationID: "1", Citation: "citation_1"}, {CitationID: "2"}}, first.Pubmed)

			second := interpretations[1]
			assert.Equal(t, "2000", second.LocusId)
			assert.Equal(t, "category_iii", second.ClinicalUtility)
			assert.Empty(t, second.Oncogenicity)
			assert.Empty(t, second.Pubmed)
		}
	})
}

func Test_Interpretations_ListSomaticForReport_NoMatch_ReturnsEmpty(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.WritePostgres}, func(t *testing.T, env *testutils.Env) {
		insertSomaticReportInterpretations(t, env.Postgres, 1400)
		repo := NewInterpretationsRepository(database.PostgresDB{DB: env.Postgres}, &partialPubmedClient{})

		interpretations, err := repo.ListSomaticForReport(t.Context(), "1400", "1", []string{"9000"})

		assert.NoError(t, err)
		assert.Empty(t, interpretations)
	})
}
