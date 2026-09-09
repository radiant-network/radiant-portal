//go:build windows

// Package diskspace reports the usable space of the filesystem holding a path.
package diskspace

import (
	"fmt"
	"math"

	"golang.org/x/sys/windows"
)

// Available returns the free bytes for the current user, clamped to MaxInt64 so callers compare
// it against manifest sizes without conversions.
func Available(path string) (int64, error) {
	p, err := windows.UTF16PtrFromString(path)
	if err != nil {
		return 0, fmt.Errorf("encode path %s: %w", path, err)
	}
	var free, total, totalFree uint64
	if err := windows.GetDiskFreeSpaceEx(p, &free, &total, &totalFree); err != nil {
		return 0, fmt.Errorf("disk free space %s: %w", path, err)
	}
	return clamp(free), nil
}

func clamp(n uint64) int64 {
	if n > math.MaxInt64 {
		return math.MaxInt64
	}
	return int64(n) //nolint:gosec // G115: bounded above
}
