package main

import "testing"

func Test_shouldRefreshViewsOnStartup(t *testing.T) {
	cases := []struct {
		enabled, migrated, want bool
	}{
		{enabled: true, migrated: true, want: true},    // opted in + schema changed → run
		{enabled: true, migrated: false, want: false},  // opted in but nothing changed → skip (no churn)
		{enabled: false, migrated: true, want: false},  // not opted in → skip even on a migration
		{enabled: false, migrated: false, want: false}, // off and unchanged → skip
	}
	for _, c := range cases {
		if got := shouldRefreshViewsOnStartup(c.enabled, c.migrated); got != c.want {
			t.Errorf("shouldRefreshViewsOnStartup(%t, %t) = %t; want %t", c.enabled, c.migrated, got, c.want)
		}
	}
}
