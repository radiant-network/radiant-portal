package main

import "testing"

func Test_shouldRefreshViewsOnStartup(t *testing.T) {
	if got := shouldRefreshViewsOnStartup(true); !got {
		t.Errorf("shouldRefreshViewsOnStartup(true) = false; want true")
	}
	if got := shouldRefreshViewsOnStartup(false); got {
		t.Errorf("shouldRefreshViewsOnStartup(false) = true; want false")
	}
}
