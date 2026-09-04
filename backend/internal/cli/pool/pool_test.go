package pool

import (
	"context"
	"errors"
	"sync/atomic"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func Test_Run_AllJobsExecuted(t *testing.T) {
	var sum atomic.Int64
	errs := Run(context.Background(), 3, []int{1, 2, 3, 4, 5}, func(_ context.Context, n int) error {
		sum.Add(int64(n))
		return nil
	})
	assert.Equal(t, int64(15), sum.Load())
	assert.Equal(t, []error{nil, nil, nil, nil, nil}, errs)
}

func Test_Run_RespectsWorkerCount(t *testing.T) {
	// Each job blocks until another job is running alongside it (or a timeout on a starved
	// runner), so two workers must overlap while a third never appears.
	var running, peak atomic.Int32
	errs := Run(context.Background(), 2, make([]int, 8), func(context.Context, int) error {
		n := running.Add(1)
		for {
			p := peak.Load()
			if n <= p || peak.CompareAndSwap(p, n) {
				break
			}
		}
		deadline := time.Now().Add(200 * time.Millisecond)
		for running.Load() < 2 && time.Now().Before(deadline) {
			time.Sleep(time.Millisecond)
		}
		running.Add(-1)
		return nil
	})
	assert.Len(t, errs, 8)
	assert.Equal(t, int32(2), peak.Load())
}

func Test_Run_ErrorsKeepOrder(t *testing.T) {
	boom := errors.New("boom")
	errs := Run(context.Background(), 4, []int{0, 1, 2, 3}, func(_ context.Context, n int) error {
		if n%2 == 1 {
			return boom
		}
		return nil
	})
	assert.Equal(t, []error{nil, boom, nil, boom}, errs)
}

func Test_Run_ContextCancelledSkipsRemaining(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	var executed atomic.Int32
	errs := Run(ctx, 1, []int{0, 1, 2}, func(_ context.Context, n int) error {
		executed.Add(1)
		cancel()
		return nil
	})
	assert.Equal(t, int32(1), executed.Load())
	assert.NoError(t, errs[0])
	assert.ErrorIs(t, errs[1], context.Canceled)
	assert.ErrorIs(t, errs[2], context.Canceled)
}

func Test_Run_ZeroWorkersDefaultsToOne(t *testing.T) {
	errs := Run(context.Background(), 0, []int{1}, func(context.Context, int) error { return nil })
	assert.Equal(t, []error{nil}, errs)
}

func Test_Run_NoJobs(t *testing.T) {
	errs := Run(context.Background(), 4, []int{}, func(context.Context, int) error { return nil })
	assert.Empty(t, errs)
}
