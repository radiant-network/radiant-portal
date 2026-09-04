package download

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"sync/atomic"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/api"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var payload = bytes.Repeat([]byte("0123456789"), 1000) // 10 000 bytes

// fileServer serves payload with Range support (http.ServeContent handles 206 / 416).
func fileServer(t *testing.T, before func(w http.ResponseWriter, r *http.Request) bool) *httptest.Server {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if before != nil && !before(w, r) {
			return
		}
		http.ServeContent(w, r, "data.bin", time.Time{}, bytes.NewReader(payload))
	}))
	t.Cleanup(srv.Close)
	return srv
}

func presign(url string, calls *atomic.Int32) func(context.Context) (string, error) {
	return func(context.Context) (string, error) {
		if calls != nil {
			calls.Add(1)
		}
		return url, nil
	}
}

func testOpts(dir string) Options {
	return Options{OutDir: dir, Threads: 2, Retries: 2, Backoff: time.Millisecond, Sleep: func(time.Duration) {}}
}

func Test_Run_DownloadsAllFiles(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	items := []Item{
		{Name: "a.bin", Size: int64(len(payload)), Presign: presign(srv.URL+"/x/a.bin", nil)},
		{Name: "b.bin", Presign: presign(srv.URL+"/x/b.bin", nil)},
	}
	res := Run(context.Background(), items, testOpts(dir))
	assert.Equal(t, Result{Downloaded: 2}, res)
	for _, n := range []string{"a.bin", "b.bin"} {
		got, err := os.ReadFile(filepath.Join(dir, n))
		require.NoError(t, err)
		assert.Equal(t, payload, got)
		_, err = os.Stat(filepath.Join(dir, n+".part"))
		assert.True(t, os.IsNotExist(err))
	}
}

func Test_Run_NameFromURLWhenMissing(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	res := Run(context.Background(), []Item{{Presign: presign(srv.URL+"/bucket/run%201/420010.cram?X-Amz-Signature=abc", nil)}}, testOpts(dir))
	assert.Equal(t, Result{Downloaded: 1}, res)
	_, err := os.Stat(filepath.Join(dir, "420010.cram"))
	assert.NoError(t, err)
}

func Test_Run_SameDerivedNameSecondIgnored(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	items := []Item{
		{ID: "900", Presign: presign(srv.URL+"/run1/420010.cram", nil)},
		{ID: "904", Presign: presign(srv.URL+"/run2/420010.cram", nil)},
	}
	opts := testOpts(dir)
	opts.Threads = 1 // deterministic order: 900 claims first
	res := Run(context.Background(), items, opts)
	assert.Equal(t, Result{Downloaded: 1, Ignored: []Ignored{{Name: "420010.cram", ID: "904", KeptID: "900"}}}, res)
	got, err := os.ReadFile(filepath.Join(dir, "420010.cram"))
	require.NoError(t, err)
	assert.Equal(t, payload, got)
}

func Test_Run_SameExplicitNameSecondIgnoredWithoutPresign(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	var second atomic.Int32
	items := []Item{
		{ID: "1", Name: "same.bin", Presign: presign(srv.URL+"/a", nil)},
		{ID: "2", Name: "same.bin", Presign: presign(srv.URL+"/b", &second)},
	}
	opts := testOpts(dir)
	opts.Threads = 1
	res := Run(context.Background(), items, opts)
	assert.Equal(t, 1, res.Downloaded)
	assert.Equal(t, []Ignored{{Name: "same.bin", ID: "2", KeptID: "1"}}, res.Ignored)
	assert.Equal(t, int32(0), second.Load(), "ignored item must not presign")
}

func Test_Run_NameIsBaseNameOnly(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	res := Run(context.Background(), []Item{{Name: "../escape.bin", Presign: presign(srv.URL+"/f", nil)}}, testOpts(dir))
	assert.Equal(t, Result{Downloaded: 1}, res)
	_, err := os.Stat(filepath.Join(dir, "escape.bin"))
	assert.NoError(t, err)
}

func Test_Run_DefaultOverwritesExisting(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin"), []byte("stale"), 0o644))
	var calls atomic.Int32
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", &calls)}}, testOpts(dir))
	assert.Equal(t, Result{Downloaded: 1}, res)
	assert.Equal(t, int32(1), calls.Load())
	got, _ := os.ReadFile(filepath.Join(dir, "a.bin"))
	assert.Equal(t, payload, got)
}

func Test_Run_Resume_SkipsExistingWithoutPresign(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin"), payload, 0o644))
	var calls atomic.Int32
	opts := testOpts(dir)
	opts.Resume = true
	res := Run(context.Background(), []Item{{Name: "a.bin", Size: int64(len(payload)), Presign: presign(srv.URL+"/a", &calls)}}, opts)
	assert.Equal(t, Result{Skipped: 1}, res)
	assert.Equal(t, int32(0), calls.Load())
}

func Test_Run_Resume_SkipsExistingWhenSizeUnknown(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin"), []byte("whatever"), 0o644))
	opts := testOpts(dir)
	opts.Resume = true
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, Result{Skipped: 1}, res)
}

func Test_Run_Resume_RedownloadsSizeMismatch(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin"), []byte("short"), 0o644))
	opts := testOpts(dir)
	opts.Resume = true
	res := Run(context.Background(), []Item{{Name: "a.bin", Size: int64(len(payload)), Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, Result{Downloaded: 1}, res)
	got, _ := os.ReadFile(filepath.Join(dir, "a.bin"))
	assert.Equal(t, payload, got)
}

func Test_Run_Resume_AppendsPartWithRange(t *testing.T) {
	var sawRange atomic.Bool
	srv := fileServer(t, func(w http.ResponseWriter, r *http.Request) bool {
		if r.Header.Get("Range") == "bytes=4000-" {
			sawRange.Store(true)
		}
		return true
	})
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin.part"), payload[:4000], 0o644))
	opts := testOpts(dir)
	opts.Resume = true
	res := Run(context.Background(), []Item{{Name: "a.bin", Size: int64(len(payload)), Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, Result{Resumed: 1}, res)
	assert.True(t, sawRange.Load(), "must request a Range from the .part length")
	got, _ := os.ReadFile(filepath.Join(dir, "a.bin"))
	assert.Equal(t, payload, got)
}

func Test_Run_Resume_RestartsWhenRangeIgnored(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write(payload) // 200 regardless of Range
	}))
	t.Cleanup(srv.Close)
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin.part"), []byte("garbage"), 0o644))
	opts := testOpts(dir)
	opts.Resume = true
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, Result{Resumed: 1}, res)
	got, _ := os.ReadFile(filepath.Join(dir, "a.bin"))
	assert.Equal(t, payload, got)
}

func Test_Run_Resume_CompletePartFinalizedOn416(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "a.bin.part"), payload, 0o644))
	opts := testOpts(dir)
	opts.Resume = true
	res := Run(context.Background(), []Item{{Name: "a.bin", Size: int64(len(payload)), Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, Result{Resumed: 1}, res)
	got, _ := os.ReadFile(filepath.Join(dir, "a.bin"))
	assert.Equal(t, payload, got)
}

func Test_Run_RetriesOn503AndRepresigns(t *testing.T) {
	var hits atomic.Int32
	srv := fileServer(t, func(w http.ResponseWriter, r *http.Request) bool {
		if hits.Add(1) <= 2 {
			w.WriteHeader(503)
			return false
		}
		return true
	})
	var presigns atomic.Int32
	dir := t.TempDir()
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", &presigns)}}, testOpts(dir))
	assert.Equal(t, Result{Downloaded: 1}, res)
	assert.Equal(t, int32(3), presigns.Load(), "each attempt presigns again")
}

func Test_Run_RetriesOn403ExpiredURL(t *testing.T) {
	var hits atomic.Int32
	srv := fileServer(t, func(w http.ResponseWriter, r *http.Request) bool {
		if hits.Add(1) == 1 {
			w.WriteHeader(403)
			return false
		}
		return true
	})
	dir := t.TempDir()
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}}, testOpts(dir))
	assert.Equal(t, Result{Downloaded: 1}, res)
}

func Test_Run_FailsAfterRetriesExhausted(t *testing.T) {
	srv := fileServer(t, func(w http.ResponseWriter, r *http.Request) bool {
		w.WriteHeader(500)
		return false
	})
	dir := t.TempDir()
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}}, testOpts(dir))
	assert.Equal(t, 1, res.Failed)
	require.Len(t, res.Errors, 1)
	assert.ErrorContains(t, res.Errors[0], "a.bin: HTTP 500")
	_, err := os.Stat(filepath.Join(dir, "a.bin.part"))
	assert.True(t, os.IsNotExist(err), ".part removed without --resume")
}

func Test_Run_Resume_KeepsPartOnFailure(t *testing.T) {
	var hits atomic.Int32
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if hits.Add(1) == 1 {
			w.Header().Set("Content-Length", "10000")
			_, _ = w.Write(payload[:3000]) // truncated body
			return
		}
		w.WriteHeader(500)
	}))
	t.Cleanup(srv.Close)
	dir := t.TempDir()
	opts := testOpts(dir)
	opts.Resume = true
	opts.Retries = 1
	res := Run(context.Background(), []Item{{Name: "a.bin", Size: 10000, Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, 1, res.Failed)
	fi, err := os.Stat(filepath.Join(dir, "a.bin.part"))
	require.NoError(t, err)
	assert.Equal(t, int64(3000), fi.Size())
}

func Test_Run_404NotRetriedRecordedAsFailed(t *testing.T) {
	var hits atomic.Int32
	srv := fileServer(t, func(w http.ResponseWriter, r *http.Request) bool {
		hits.Add(1)
		w.WriteHeader(404)
		return false
	})
	dir := t.TempDir()
	res := Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}}, testOpts(dir))
	assert.Equal(t, 1, res.Failed)
	assert.Equal(t, int32(1), hits.Load())
}

func Test_Run_PresignNotFoundRecorded(t *testing.T) {
	dir := t.TempDir()
	var calls atomic.Int32
	items := []Item{{Name: "missing.bin", Presign: func(context.Context) (string, error) { calls.Add(1); return "", api.ErrNotFound }}}
	res := Run(context.Background(), items, testOpts(dir))
	assert.Equal(t, Result{NotFound: []string{"missing.bin"}}, res)
	assert.Equal(t, int32(1), calls.Load(), "API errors are not retried")
}

func Test_Run_PresignForbiddenRecorded(t *testing.T) {
	dir := t.TempDir()
	items := []Item{{Name: "secret.bin", Presign: func(context.Context) (string, error) { return "", api.ErrForbidden }}}
	res := Run(context.Background(), items, testOpts(dir))
	assert.Equal(t, Result{Forbidden: []string{"secret.bin"}}, res)
}

func Test_Run_PresignUnauthorizedIsFailure(t *testing.T) {
	dir := t.TempDir()
	items := []Item{{Name: "a.bin", Presign: func(context.Context) (string, error) { return "", api.ErrUnauthorized }}}
	res := Run(context.Background(), items, testOpts(dir))
	assert.Equal(t, 1, res.Failed)
	assert.ErrorIs(t, res.Errors[0], api.ErrUnauthorized)
}

func Test_Run_RespectsThreads(t *testing.T) {
	var running, peak atomic.Int32
	srv := fileServer(t, func(w http.ResponseWriter, r *http.Request) bool {
		n := running.Add(1)
		for {
			p := peak.Load()
			if n <= p || peak.CompareAndSwap(p, n) {
				break
			}
		}
		time.Sleep(10 * time.Millisecond)
		running.Add(-1)
		return true
	})
	dir := t.TempDir()
	var items []Item
	for i := range 6 {
		items = append(items, Item{Name: string(rune('a'+i)) + ".bin", Presign: presign(srv.URL+"/f", nil)})
	}
	opts := testOpts(dir)
	opts.Threads = 2
	res := Run(context.Background(), items, opts)
	assert.Equal(t, 6, res.Downloaded)
	assert.LessOrEqual(t, peak.Load(), int32(2))
}

func Test_Run_ContextAlreadyCancelled(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	res := Run(ctx, []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}, {Name: "b.bin", Presign: presign(srv.URL+"/b", nil)}}, testOpts(dir))
	assert.Equal(t, Result{Interrupted: 2}, res)
}

func Test_Run_InterruptedMidDownload_KeepsPartWithoutResume(t *testing.T) {
	started := make(chan struct{})
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Length", "10000")
		_, _ = w.Write(payload[:2000])
		w.(http.Flusher).Flush()
		close(started)
		<-r.Context().Done() // hang until the client aborts
	}))
	t.Cleanup(srv.Close)
	dir := t.TempDir()
	ctx, cancel := context.WithCancel(context.Background())
	go func() {
		<-started
		// Interrupt once the first bytes are on disk, like a Ctrl-C mid-transfer.
		deadline := time.Now().Add(5 * time.Second)
		for time.Now().Before(deadline) {
			if fi, err := os.Stat(filepath.Join(dir, "a.bin.part")); err == nil && fi.Size() == 2000 {
				break
			}
			time.Sleep(5 * time.Millisecond)
		}
		cancel()
	}()
	opts := testOpts(dir)
	opts.Retries = 0
	res := Run(ctx, []Item{{Name: "a.bin", Size: 10000, Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Equal(t, Result{Interrupted: 1}, res)
	fi, err := os.Stat(filepath.Join(dir, "a.bin.part"))
	require.NoError(t, err, ".part must survive an interruption even without --resume")
	assert.Equal(t, int64(2000), fi.Size())
	_, err = os.Stat(filepath.Join(dir, "a.bin"))
	assert.True(t, os.IsNotExist(err))
}

func Test_Run_LogLinePerFile(t *testing.T) {
	srv := fileServer(t, nil)
	dir := t.TempDir()
	var log bytes.Buffer
	opts := testOpts(dir)
	opts.Log = &log
	Run(context.Background(), []Item{{Name: "a.bin", Presign: presign(srv.URL+"/a", nil)}}, opts)
	assert.Contains(t, log.String(), "a.bin")
	assert.Contains(t, log.String(), "10.0 KB")
	assert.Contains(t, log.String(), "ok")
}
