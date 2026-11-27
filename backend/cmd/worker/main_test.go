package main

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/batchval"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/repository/postgres"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/test/testutils"
	"github.com/stretchr/testify/assert"
)

// fakeBatchRepo satisfies the (unexported) batchProcessor interface used by
// BatchValidationContext.BatchRepo, returning no work so the poll loop spins without a DB.
type fakeBatchRepo struct{}

func (fakeBatchRepo) ClaimNextBatch(context.Context) (*types.Batch, error) {
	return nil, nil
}
func (fakeBatchRepo) UpdateBatch(context.Context, types.Batch) (int64, error) {
	return 1, nil
}
func (fakeBatchRepo) ReleaseBatch(context.Context, string) (int64, error) {
	return 1, nil
}

func waitWithTimeout(t *testing.T, wg *sync.WaitGroup, d time.Duration, name string) {
	t.Helper()
	done := make(chan struct{})
	go func() {
		wg.Wait()
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(d):
		t.Fatalf("%s did not stop within %v after context cancellation", name, d)
	}
}

func Test_runPollLoop_StopsOnContextCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	bv := &batchval.BatchValidationContext{BatchRepo: fakeBatchRepo{}}

	done := make(chan struct{})
	go func() {
		runPollLoop(ctx, nil, bv, 10*time.Millisecond)
		close(done)
	}()

	cancel()

	select {
	case <-done:
	case <-time.After(2 * time.Second):
		t.Fatal("runPollLoop did not return after context cancellation")
	}
}

func Test_StartCleanUpWorker_StopsOnContextCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	StartCleanUpWorker(ctx, &wg, nil) // db is only touched on a tick, which never fires here
	cancel()
	waitWithTimeout(t, &wg, 2*time.Second, "clean-up worker")
}

func Test_StartHealthProbe_ShutsDownOnContextCancel(t *testing.T) {
	t.Setenv("PROBE_PORT", "0") // random free port; the handler is never hit so db can be nil
	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	StartHealthProbe(ctx, &wg, nil)
	cancel()
	waitWithTimeout(t, &wg, 5*time.Second, "health probe")
}

// cancellingValueSets simulates a shutdown in the middle of validation: it cancels the worker's
// context and fails with a driver-like error that does not wrap context.Canceled.
type cancellingValueSets struct {
	cancel context.CancelFunc
}

func (f cancellingValueSets) GetCodes(context.Context, postgres.ValueSetType) ([]string, error) {
	f.cancel()
	return nil, errors.New("driver: bad connection")
}
func (cancellingValueSets) GetExamCodes(context.Context, string) ([]string, error) {
	return nil, nil
}

func Test_processBatch_RequeuesInflightBatchOnCancel(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres

		payload := `[{"submitter_patient_id":"REQUEUE-1","submitter_patient_id_type":"mrn","patient_organization_code":"CHUSJ","sex_code":"female","life_status_code":"alive","date_of_birth":"2010-05-15"}]`
		var id string
		// created_on far in the past so ClaimNextBatch (oldest-first) picks this batch.
		insertErr := db.Raw(`
			INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on, tenant_code)
			VALUES (?, 'PENDING', ?, true, 'user-requeue', '2000-01-01', 'radiant')
			RETURNING id;
		`, payload, types.CreatePatientBatchType).Scan(&id).Error
		if insertErr != nil {
			t.Fatal("failed to insert batch:", insertErr)
		}

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		bv := &batchval.BatchValidationContext{
			BatchRepo:     postgres.NewBatchRepository(database.PostgresDB{DB: db}),
			ValueSetsRepo: cancellingValueSets{cancel: cancel},
		}
		processBatch(ctx, db, bv)
		assert.Error(t, ctx.Err(), "the context must be cancelled during processing, after the claim")

		result := types.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&result)
		assert.Equal(t, types.BatchStatusPending, result.Status)
		assert.Nil(t, result.StartedOn)
		assert.Nil(t, result.FinishedOn)

		var patientCount int64
		db.Table("patient").Where("submitter_patient_id = ?", "REQUEUE-1").Count(&patientCount)
		assert.Equal(t, int64(0), patientCount)
	})
}

// lostClaimRepo simulates a shutdown during the claim: the UPDATE commits in Postgres, then the
// call fails if its own context was cancelled, as a driver would, and the claimed row is lost.
type lostClaimRepo struct {
	*postgres.BatchRepository
	cancel context.CancelFunc
}

func (r lostClaimRepo) ClaimNextBatch(ctx context.Context) (*types.Batch, error) {
	batch, err := r.BatchRepository.ClaimNextBatch(ctx)
	r.cancel()
	if ctx.Err() != nil {
		return nil, ctx.Err()
	}
	return batch, err
}

func Test_processBatch_ReleasesBatchClaimedDuringShutdown(t *testing.T) {
	testutils.RunTest(t, testutils.Need{Postgres: testutils.ExclusivePostgres}, func(t *testing.T, env *testutils.Env) {
		db := env.Postgres

		payload := `[{"submitter_patient_id":"CLAIM-1","submitter_patient_id_type":"mrn","patient_organization_code":"CHUSJ","sex_code":"female","life_status_code":"alive","date_of_birth":"2010-05-15"}]`
		var id string
		insertErr := db.Raw(`
			INSERT INTO batch (payload, status, batch_type, dry_run, username, created_on, tenant_code)
			VALUES (?, 'PENDING', ?, true, 'user-claim', '2000-01-01', 'radiant')
			RETURNING id;
		`, payload, types.CreatePatientBatchType).Scan(&id).Error
		if insertErr != nil {
			t.Fatal("failed to insert batch:", insertErr)
		}

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		// ValueSetsRepo is left nil: processing the batch would panic instead of passing silently.
		bv := &batchval.BatchValidationContext{
			BatchRepo: lostClaimRepo{BatchRepository: postgres.NewBatchRepository(database.PostgresDB{DB: db}), cancel: cancel},
		}
		processBatch(ctx, db, bv)
		assert.Error(t, ctx.Err(), "the context must be cancelled during the claim")

		result := types.Batch{}
		db.Table("batch").Where("id = ?", id).Scan(&result)
		assert.Equal(t, types.BatchStatusPending, result.Status)
		assert.Nil(t, result.StartedOn)
		assert.Nil(t, result.FinishedOn)

		var patientCount int64
		db.Table("patient").Where("submitter_patient_id = ?", "CLAIM-1").Count(&patientCount)
		assert.Equal(t, int64(0), patientCount)
	})
}
