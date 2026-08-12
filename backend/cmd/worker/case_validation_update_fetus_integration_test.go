package main

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

// fetusKey derives a submitter id from the case, because every case in this file hangs off the base
// scenario's proband and fetus keys are UNIQUE (mother_id, submitter_fetus_id) — a shared literal
// would make the second test's create batch collide.
func fetusKey(submitterCaseId string) types.TrimmedString {
	return types.TrimmedString("F-" + submitterCaseId)
}

// seedPrenatalCase creates a case through the POST path carrying one fetus with a phenotype and a
// free-text observation, so the PUT assertions below start from a real prenatal case.
func seedPrenatalCase(t *testing.T, env *testutils.Env, submitterCaseId string) *types.Case {
	db := env.Postgres
	payload := createBaseCasePayload(submitterCaseId)
	payload[0].CategoryCode = "prenatal"
	payload[0].Fetuses = []*types.CaseFetusBatch{
		{
			SubmitterFetusId:    fetusKey(submitterCaseId),
			SexCode:             "male",
			LifeStatusCode:      "alive",
			AffectedStatusCode:  "affected",
			LastMenstrualPeriod: dateISO8601Ptr(2026, time.February, 1),
			ObservationsCategorical: []*types.ObservationCategoricalBatch{
				{Code: "phenotype", System: "HPO", Value: "HP:0001631", OnsetCode: "antenatal", InterpretationCode: "positive"},
			},
			ObservationsText: []*types.ObservationTextBatch{
				{Code: "note", Value: "Anomaly seen at 20 weeks"},
			},
		},
	}
	createDocumentsForBatch(env.Ctx, env.MinIO.Client, payload)
	payloadBytes, _ := json.Marshal(payload)

	id := insertPayloadAndProcessBatch(db, string(payloadBytes), types.BatchStatusPending, types.CreateCaseBatchType, false, "user123", "2025-12-07")
	assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)

	var c types.Case
	db.Table("cases").Where("project_id = ? AND submitter_case_id = ?", 1, submitterCaseId).First(&c)
	require.NotZero(t, c.ID, "the prenatal case must have been created")
	return &c
}

// fetusesOfCase resolves the case's fetuses the same way the repository does — through family,
// since fetus carries no case reference.
func fetusesOfCase(db *gorm.DB, caseID int) []*types.Fetus {
	var fetuses []*types.Fetus
	db.Table("fetus").Select("fetus.*").
		Joins("JOIN family ON family.fetus_id = fetus.id").
		Where("family.case_id = ?", caseID).
		Order("fetus.id").Find(&fetuses)
	return fetuses
}

func prenatalUpdate(submitterCaseId string) []types.UpdateCaseBatch {
	updates := updateCaseForBase(submitterCaseId)
	updates[0].CategoryCode = "prenatal"
	return updates
}

func processUpdateExpectingSuccess(t *testing.T, db *gorm.DB, updates []types.UpdateCaseBatch) {
	updateBytes, _ := json.Marshal(updates)
	id := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-07")
	assertBatchProcessing(t, db, id, types.BatchStatusSuccess, false, "user123", emptyMsgs, emptyMsgs, emptyMsgs)
}

// PUT semantics: the body is the new state, so omitting `fetuses` means "this case has none" and is
// equivalent to sending an empty list — same as observations_text and family_history already behave.
func Test_ProcessBatch_UpdateCase_OmittedFetuses_RemovesThemLikeAnEmptyList(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		const submitterCaseId = "CASE-UPDATE-FETUS-OMITTED"

		c := seedPrenatalCase(t, env, submitterCaseId)
		before := fetusesOfCase(db, c.ID)
		require.Len(t, before, 1)

		updates := prenatalUpdate(submitterCaseId)
		require.Nil(t, updates[0].Fetuses, "this scenario must omit fetuses")
		processUpdateExpectingSuccess(t, db, updates)

		assert.Empty(t, fetusesOfCase(db, c.ID), "omitting fetuses removes them")

		var obsCat []*types.ObsCategorical
		db.Table("obs_categorical").Where("case_id = ? AND fetus_id IS NOT NULL", c.ID).Find(&obsCat)
		assert.Empty(t, obsCat, "and takes their observations with them")

		var orphan []*types.Fetus
		db.Table("fetus").Where("id = ?", before[0].ID).Find(&orphan)
		assert.Empty(t, orphan, "the fetus row itself must be deleted, not left orphaned")
	})
}

func Test_ProcessBatch_UpdateCase_Fetuses_ReplacesThem(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		const submitterCaseId = "CASE-UPDATE-FETUS-REPLACE"

		c := seedPrenatalCase(t, env, submitterCaseId)
		before := fetusesOfCase(db, c.ID)
		require.Len(t, before, 1)

		// Keep the seeded key while correcting its sex and phenotype, and add a twin under a new key.
		updates := prenatalUpdate(submitterCaseId)
		updates[0].Fetuses = []*types.CaseFetusBatch{
			{
				SubmitterFetusId:    fetusKey(submitterCaseId),
				SexCode:             "female",
				LifeStatusCode:      "alive",
				AffectedStatusCode:  "affected",
				LastMenstrualPeriod: dateISO8601Ptr(2026, time.February, 1),
				ObservationsCategorical: []*types.ObservationCategoricalBatch{
					{Code: "phenotype", System: "HPO", Value: "HP:0001561", OnsetCode: "antenatal", InterpretationCode: "positive"},
				},
			},
			{SubmitterFetusId: fetusKey(submitterCaseId) + "-TWIN", SexCode: "male", LifeStatusCode: "deceased", AffectedStatusCode: "unknown"},
		}
		processUpdateExpectingSuccess(t, db, updates)

		after := fetusesOfCase(db, c.ID)
		require.Len(t, after, 2, "the payload's list is authoritative")

		byKey := map[string]*types.Fetus{}
		for _, f := range after {
			byKey[f.SubmitterFetusId] = f
		}
		require.Contains(t, byKey, string(fetusKey(submitterCaseId)))
		require.Contains(t, byKey, string(fetusKey(submitterCaseId))+"-TWIN")
		// The whole point of matching by key: the row id is kept, so anything referencing it holds.
		assert.Equal(t, before[0].ID, byKey[string(fetusKey(submitterCaseId))].ID, "the kept key must be updated in place, not recreated")
		assert.Equal(t, "female", byKey[string(fetusKey(submitterCaseId))].SexCode, "its sex must have been corrected")
		assert.Equal(t, "male", byKey[string(fetusKey(submitterCaseId))+"-TWIN"].SexCode)

		var obsCat []*types.ObsCategorical
		db.Table("obs_categorical").Where("case_id = ? AND fetus_id IS NOT NULL", c.ID).Find(&obsCat)
		require.Len(t, obsCat, 1, "the old fetus phenotype is replaced, not accumulated")
		assert.Equal(t, "HP:0001561", obsCat[0].CodeValue)

		var obsStr []*types.ObsString
		db.Table("obs_string").Where("case_id = ? AND fetus_id IS NOT NULL", c.ID).Find(&obsStr)
		assert.Empty(t, obsStr, "an observation text absent from the new payload must be gone")
	})
}

func Test_ProcessBatch_UpdateCase_EmptyFetuses_RemovesThem(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		const submitterCaseId = "CASE-UPDATE-FETUS-CLEAR"

		c := seedPrenatalCase(t, env, submitterCaseId)
		before := fetusesOfCase(db, c.ID)
		require.Len(t, before, 1)

		updates := prenatalUpdate(submitterCaseId)
		updates[0].Fetuses = []*types.CaseFetusBatch{}
		processUpdateExpectingSuccess(t, db, updates)

		assert.Empty(t, fetusesOfCase(db, c.ID), "an empty array removes the case's fetuses")

		var obsCat []*types.ObsCategorical
		db.Table("obs_categorical").Where("case_id = ? AND fetus_id IS NOT NULL", c.ID).Find(&obsCat)
		assert.Empty(t, obsCat)

		// Assert on this fetus row rather than on mother_id: the base scenario's proband is shared
		// by the sibling tests, whose own fetuses would show up here.
		var orphan []*types.Fetus
		db.Table("fetus").Where("id = ?", before[0].ID).Find(&orphan)
		assert.Empty(t, orphan, "the fetus row itself must be deleted, not left orphaned")
	})
}

// attachSampleToFetus wires a sample to a fetus the way a sequencing batch would, so the tests
// below can exercise the FK that blocks deletion.
func attachSampleToFetus(t *testing.T, db *gorm.DB, sampleID, probandID, fetusID int, submitterSampleId string) {
	require.NoError(t, db.Exec(
		`INSERT INTO sample (id, type_code, histology_code, submitter_sample_id, patient_id, organization_code, fetus_id, tenant_code)
		 VALUES (?, 'blood', 'normal', ?, ?, 'CHUSJ', ?, 'radiant')`,
		sampleID, submitterSampleId, probandID, fetusID).Error)
	t.Cleanup(func() { db.Exec("DELETE FROM sample WHERE id = ?", sampleID) })
}

// What matching by submitter id buys: a fetus whose sample is already sequenced stays correctable,
// because the row is updated in place rather than deleted and recreated.
func Test_ProcessBatch_UpdateCase_FetusWithSample_StillUpdatableUnderSameKey(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		const submitterCaseId = "CASE-UPDATE-FETUS-SEQUENCED"

		c := seedPrenatalCase(t, env, submitterCaseId)
		before := fetusesOfCase(db, c.ID)
		require.Len(t, before, 1)
		attachSampleToFetus(t, db, 100778, c.ProbandID, before[0].ID, "SAMPLE-FETUS-SEQUENCED")

		updates := prenatalUpdate(submitterCaseId)
		updates[0].Fetuses = []*types.CaseFetusBatch{
			{SubmitterFetusId: fetusKey(submitterCaseId), SexCode: "female", LifeStatusCode: "alive", AffectedStatusCode: "affected", LastMenstrualPeriod: dateISO8601Ptr(2026, time.February, 1)},
		}
		processUpdateExpectingSuccess(t, db, updates)

		after := fetusesOfCase(db, c.ID)
		require.Len(t, after, 1)
		assert.Equal(t, before[0].ID, after[0].ID, "the row id must be preserved so sample.fetus_id holds")
		assert.Equal(t, "female", after[0].SexCode, "the sex must have been corrected in place")

		var sampleFetusIDs []int
		db.Table("sample").Where("id = ?", 100778).Pluck("fetus_id", &sampleFetusIDs)
		require.Len(t, sampleFetusIDs, 1, "the sample row must still exist")
		assert.Equal(t, before[0].ID, sampleFetusIDs[0], "and still point at the same fetus")
	})
}

// Dropping the key is the destructive half: sample.fetus_id has no ON DELETE CASCADE, so the worker
// must report it instead of dying on a raw FK violation.
func Test_ProcessBatch_UpdateCase_FetusWithSample_RefusedWhenKeyDropped(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres, MinIO: true}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres
		const submitterCaseId = "CASE-UPDATE-FETUS-BLOCKED"

		c := seedPrenatalCase(t, env, submitterCaseId)
		fetuses := fetusesOfCase(db, c.ID)
		require.Len(t, fetuses, 1)

		attachSampleToFetus(t, db, 100777, c.ProbandID, fetuses[0].ID, "SAMPLE-FETUS-BLOCKED")

		// A different key: F-A is dropped, which means deleted — and it has a sample.
		updates := prenatalUpdate(submitterCaseId)
		updates[0].Fetuses = []*types.CaseFetusBatch{
			{SubmitterFetusId: fetusKey(submitterCaseId) + "-OTHER", SexCode: "female", LifeStatusCode: "alive", AffectedStatusCode: "affected", LastMenstrualPeriod: dateISO8601Ptr(2026, time.February, 1)},
		}
		updateBytes, _ := json.Marshal(updates)
		id := insertPayloadAndProcessBatch(db, string(updateBytes), types.BatchStatusPending, types.UpdateCaseBatchType, false, "user123", "2025-12-07")

		var batch types.Batch
		db.Table("batch").Where("id = ?", id).First(&batch)
		assert.Equal(t, types.BatchStatusError, batch.Status)
		// The message carries the blocking fetus ids, which are dynamic — assert on the code.
		report, _ := json.Marshal(batch.Report)
		assert.Contains(t, string(report), FetusHasSample)

		after := fetusesOfCase(db, c.ID)
		require.Len(t, after, 1, "the refused update must leave the fetus in place")
		assert.Equal(t, fetuses[0].ID, after[0].ID)
		assert.Equal(t, "male", after[0].SexCode, "and must not have applied the new sex")
	})
}
