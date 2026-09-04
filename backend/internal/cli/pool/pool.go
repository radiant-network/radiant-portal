// Package pool runs jobs on a fixed number of workers.
package pool

import (
	"context"
	"sync"
)

// Run executes fn over jobs with at most workers goroutines and returns one error slot per job,
// index aligned (nil on success). Jobs not started before ctx ends get ctx.Err().
func Run[T any](ctx context.Context, workers int, jobs []T, fn func(context.Context, T) error) []error {
	if workers < 1 {
		workers = 1
	}
	if workers > len(jobs) {
		workers = len(jobs)
	}
	errs := make([]error, len(jobs))
	indices := make(chan int)
	var wg sync.WaitGroup
	for w := 0; w < workers; w++ {
		wg.Go(func() {
			for i := range indices {
				if err := ctx.Err(); err != nil {
					errs[i] = err
					continue
				}
				errs[i] = fn(ctx, jobs[i])
			}
		})
	}
	for i := range jobs {
		indices <- i
	}
	close(indices)
	wg.Wait()
	return errs
}
