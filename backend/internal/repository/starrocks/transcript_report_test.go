package starrocks

import (
	"testing"

	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

func Test_TranscriptReport_GetGermlineReportContext(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		reportContext, err := repo.GetGermlineReportContext(t.Context(), 1, 1, 5)
		assert.NoError(t, err)
		if assert.NotNil(t, reportContext) {
			assert.Equal(t, 1, reportContext.Part)
			assert.Equal(t, "MRN-283775", reportContext.SubmitterPatientID)
			assert.Equal(t, "S13224", reportContext.SubmitterSampleID)
			assert.True(t, reportContext.IsProband)
			assert.Equal(t, "GRch38", reportContext.GenomeBuild)
		}
	})
}

func Test_TranscriptReport_GetGermlineReportContext_TaskNotOfCase_ReturnsNil(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		reportContext, err := repo.GetGermlineReportContext(t.Context(), 1, 1, 77)
		assert.NoError(t, err)
		assert.Nil(t, reportContext)
	})
}

func Test_TranscriptReport_ListGermlineReportOccurrences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		rows, err := repo.ListGermlineReportOccurrences(t.Context(), 1, 1, 5, []int{1000, 2000, 3000, 4000})
		assert.NoError(t, err)
		if assert.Len(t, rows, 2) {
			braf := rows[0]
			assert.Equal(t, int64(1000), braf.LocusID)
			assert.Equal(t, "chr7:g.140753336A>T", braf.Hgvsg)
			assert.Equal(t, "rs113488022", braf.Rsnumber)
			assert.Equal(t, "7", braf.Chromosome)
			assert.Equal(t, int64(140753336), braf.Start)
			assert.Equal(t, "A", braf.Reference)
			assert.Equal(t, "T", braf.Alternate)
			assert.Equal(t, "BRAF", braf.Symbol)
			assert.Equal(t, "13961", braf.ClinvarName)
			assert.Equal(t, []string{"Pathogenic", "Likely_pathogenic"}, []string(braf.ClinvarInterpretation))
			assert.Equal(t, "HET", braf.Zygosity)
			assert.Equal(t, "mother", braf.ParentalOrigin)
			assert.Equal(t, "WT", braf.FatherZygosity)
			assert.Equal(t, "HET", braf.MotherZygosity)
			assert.Equal(t, "autosomal_dominant", braf.TransmissionMode)
			assert.Equal(t, float32(0.5), braf.AdRatio)
			assert.Equal(t, 10, braf.AdAlt)
			assert.Equal(t, 20, braf.AdTotal)
			if assert.NotNil(t, braf.GnomadAf) {
				assert.InDelta(t, 0.0000123, *braf.GnomadAf, 1e-9)
				assert.Equal(t, 2, *braf.GnomadAc)
				assert.Equal(t, 152000, *braf.GnomadAn)
				assert.Equal(t, 0, *braf.GnomadHom)
			}

			intergenic := rows[1]
			assert.Equal(t, int64(2000), intergenic.LocusID)
			assert.Equal(t, "", intergenic.Symbol)
			assert.Equal(t, "", intergenic.ClinvarName)
			assert.Nil(t, intergenic.ClinvarInterpretation)
			assert.Equal(t, "HOM", intergenic.Zygosity)
			assert.Equal(t, "denovo", intergenic.ParentalOrigin)
			assert.Nil(t, intergenic.GnomadAf)
			assert.Nil(t, intergenic.GnomadAc)
		}
	})
}

func Test_TranscriptReport_ListGermlineReportOccurrences_OtherPart_NotReturned(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		rows, err := repo.ListGermlineReportOccurrences(t.Context(), 2, 1, 5, []int{1000, 4000})
		assert.NoError(t, err)
		if assert.Len(t, rows, 1) {
			assert.Equal(t, int64(4000), rows[0].LocusID)
		}
	})
}

func Test_TranscriptReport_ListReportConsequences(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		rows, err := repo.ListReportConsequences(t.Context(), []int{1000, 2000})
		assert.NoError(t, err)
		if assert.Len(t, rows, 6) {
			ids := make([]string, len(rows))
			for i, row := range rows {
				ids[i] = row.TranscriptID
			}
			assert.Equal(t, []string{"ENST00000288602", "ENST00000646891", "NM_001374258", "NM_004333", "T001", "NR_027010"}, ids)

			mane := rows[1]
			assert.Equal(t, int64(1000), mane.LocusID)
			assert.Equal(t, "BRAF", mane.Symbol)
			assert.Equal(t, "6", mane.TranscriptVersion)
			assert.Equal(t, "Ensembl", mane.Source)
			assert.True(t, mane.IsManeSelect)
			assert.False(t, mane.IsManePlus)
			assert.True(t, mane.IsCanonical)
			assert.Equal(t, "NM_004333.6", mane.ManeSelect)
			assert.Equal(t, "NM_004333", mane.ManePairTranscriptID)
			assert.Equal(t, "15", mane.ExonRank)
			assert.Equal(t, "18", mane.ExonTotal)
			assert.Equal(t, "c.1799T>A", mane.DnaChange)
			assert.Equal(t, "p.Val600Glu", mane.AaChange)
			if assert.NotNil(t, mane.RevelScore) {
				assert.InDelta(t, 0.931, *mane.RevelScore, 1e-4)
			}
			if assert.NotNil(t, mane.CaddPhred) {
				assert.InDelta(t, 32, *mane.CaddPhred, 1e-4)
			}
			assert.Equal(t, []string{"missense_variant"}, []string(mane.Consequences))
			assert.Equal(t, "MODERATE", mane.VepImpact)

			legacy := rows[4]
			assert.Equal(t, "T001", legacy.TranscriptID)
			assert.Equal(t, "", legacy.Source)
			assert.Equal(t, "", legacy.TranscriptVersion)
			assert.Equal(t, "", legacy.ExonRank)
			assert.Nil(t, legacy.RevelScore)
			assert.Nil(t, legacy.CaddPhred)
		}
	})
}

func Test_TranscriptReport_ListReportConsequences_NoRows(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		rows, err := repo.ListReportConsequences(t.Context(), []int{2000})
		assert.NoError(t, err)
		assert.Empty(t, rows)
	})
}

func Test_TranscriptReport_ListReportOmim(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		rows, err := repo.ListReportOmim(t.Context(), []string{"BRAF", "LINC01"})
		assert.NoError(t, err)
		if assert.Len(t, rows, 2) {
			assert.Equal(t, "BRAF", rows[0].Symbol)
			assert.Equal(t, "613706", rows[0].OmimPhenotypeID)
			assert.Equal(t, "Noonan syndrome 7", rows[0].Panel)
			assert.Equal(t, []string{"AD"}, []string(rows[0].InheritanceCode))
			assert.Equal(t, "613707", rows[1].OmimPhenotypeID)
			assert.Equal(t, "LEOPARD syndrome 3", rows[1].Panel)
		}
	})
}

func Test_TranscriptReport_ListReportOmim_NoSymbol(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Starrocks: "transcript_report"}, func(t *testing.T, env *testutils.Env) {
		repo := NewTranscriptReportRepository(database.StarrocksDB{DB: env.Starrocks})
		rows, err := repo.ListReportOmim(t.Context(), nil)
		assert.NoError(t, err)
		assert.Empty(t, rows)
	})
}
