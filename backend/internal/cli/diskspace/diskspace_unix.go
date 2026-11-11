//go:build !windows

// Package diskspace reports the usable space of the filesystem holding a path.
package diskspace

import (
	"fmt"
	"math"

	"golang.org/x/sys/unix"
)

// Available returns the free bytes for the current user, clamped to MaxInt64 so callers compare
// it against manifest sizes without conversions.
func Available(path string) (int64, error) {
	var st unix.Statfs_t
	if err := unix.Statfs(path, &st); err != nil {
		return 0, fmt.Errorf("statfs %s: %w", path, err)
	}
	// Bsize is int64 on linux and uint32 on darwin; both are small positive values.
	free := uint64(st.Bavail) * uint64(st.Bsize) //nolint:unconvert,gosec // G115: no overflow possible
	return clamp(free), nil
}

func clamp(n uint64) int64 {
	if n > math.MaxInt64 {
		return math.MaxInt64
	}
	return int64(n) //nolint:gosec // G115: bounded above
}
