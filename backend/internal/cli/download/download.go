// Package download fetches presigned URLs into a directory with a worker pool, progress bars,
// retries and optional resume. Plain net/http: the S3 SDKs cannot consume presigned URLs.
package download

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"sync"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/api"
	"github.com/radiant-network/radiant-api/internal/cli/pool"
	"github.com/radiant-network/radiant-api/internal/cli/prompt"
	"github.com/radiant-network/radiant-api/internal/cli/style"
	"github.com/radiant-network/radiant-api/internal/cli/units"
	"github.com/vbauerster/mpb/v8"
	"github.com/vbauerster/mpb/v8/decor"
)

type Item struct {
	ID   string // document identifier, only used in messages
	Name string // empty = derived from the presigned URL path
	Size int64  // 0 = unknown, taken from Content-Length
	// Presign is called right before the GET, and again on every retry, so a URL never outlives
	// its use and S3_PRESIGNED_URL_EXPIRE is irrelevant.
	Presign func(ctx context.Context) (string, error)
}

type Options struct {
	OutDir   string
	Threads  int
	Resume   bool
	Retries  int
	HTTP     *http.Client
	Progress io.Writer // nil: no progress bars
	Log      io.Writer // nil: silent; otherwise one line per finished file
	Backoff  time.Duration
	Sleep    func(time.Duration)
}

type Result struct {
	Downloaded, Resumed, Skipped, Failed int
	// Interrupted counts files not completed because ctx was cancelled (Ctrl-C). Their .part is
	// kept, whatever Resume says, so the next --resume run continues them.
	Interrupted         int
	NotFound, Forbidden []string
	// Ignored lists items whose target file was already claimed by another item of the same run
	// (two documents resolving to the same file name). Nothing is written for them.
	Ignored []Ignored
	Errors  []error
}

type Ignored struct {
	Name   string
	ID     string // the ignored document
	KeptID string // the document that owns the file
}

type ignoredError struct{ Ignored }

func (e ignoredError) Error() string {
	return fmt.Sprintf("same file name as document %s, ignored", e.KeptID)
}

type outcome int

const (
	outcomeDownloaded outcome = iota
	outcomeResumed
	outcomeSkipped
)

type httpError struct{ code int }

func (e httpError) Error() string { return fmt.Sprintf("HTTP %d", e.code) }

func (e httpError) retryable() bool {
	return e.code == http.StatusForbidden || e.code == http.StatusTooManyRequests || e.code >= 500
}

type downloader struct {
	opts    Options
	palette style.Palette
	overall *mpb.Bar
	bars    *mpb.Progress
	claims  sync.Map // target path -> Item.ID of the first item that resolved to it
}

// barStyle renders `[████████░░░░░░]`, the filled part in the given color.
func barStyle(color func(string) string) mpb.BarStyleComposer {
	return mpb.BarStyle().Lbound("[").Filler("█").Tip("█").Padding("░").Rbound("]").FillerMeta(color).TipMeta(color)
}

func Run(ctx context.Context, items []Item, opts Options) Result {
	if opts.HTTP == nil {
		opts.HTTP = &http.Client{}
	}
	if opts.Threads < 1 {
		opts.Threads = 1
	}
	if opts.Backoff <= 0 {
		opts.Backoff = 500 * time.Millisecond
	}
	if opts.Sleep == nil {
		opts.Sleep = time.Sleep
	}
	progressOut := opts.Progress
	if progressOut == nil {
		progressOut = io.Discard
	}
	d := &downloader{opts: opts, palette: style.For(opts.Progress)}
	d.bars = mpb.New(mpb.WithOutput(progressOut), mpb.WithWidth(32), mpb.WithRefreshRate(120*time.Millisecond))
	d.overall = d.bars.New(int64(len(items)), barStyle(d.palette.Green),
		mpb.BarPriority(1<<20),
		mpb.PrependDecorators(decor.Name(d.palette.Bold("total"), decor.WC{W: 22, C: decor.DindentRight})),
		mpb.AppendDecorators(
			decor.Percentage(decor.WC{W: 5}),
			decor.CountersNoUnit("  %d / %d files", decor.WC{W: 18}),
			decor.Elapsed(decor.ET_STYLE_MMSS, decor.WC{W: 8}),
		),
	)

	outcomes := make([]outcome, len(items))
	names := make([]string, len(items))
	indices := make([]int, len(items))
	for i := range items {
		indices[i] = i
	}
	errs := pool.Run(ctx, opts.Threads, indices, func(ctx context.Context, i int) error {
		out, name, err := d.one(ctx, items[i])
		outcomes[i], names[i] = out, name
		d.overall.Increment()
		return err
	})
	if ctx.Err() != nil {
		d.overall.Abort(false)
	}
	d.bars.Wait()

	var res Result
	for i, err := range errs {
		var ignored ignoredError
		switch {
		case err == nil:
			switch outcomes[i] {
			case outcomeDownloaded:
				res.Downloaded++
			case outcomeResumed:
				res.Resumed++
			case outcomeSkipped:
				res.Skipped++
			}
		case errors.Is(err, context.Canceled), errors.Is(err, context.DeadlineExceeded):
			res.Interrupted++
		case errors.As(err, &ignored):
			res.Ignored = append(res.Ignored, ignored.Ignored)
		case errors.Is(err, api.ErrNotFound):
			res.NotFound = append(res.NotFound, names[i])
		case errors.Is(err, api.ErrForbidden):
			res.Forbidden = append(res.Forbidden, names[i])
		default:
			res.Failed++
			res.Errors = append(res.Errors, fmt.Errorf("%s: %w", names[i], err))
		}
	}
	return res
}

// one processes a single item and returns its outcome and display name.
func (d *downloader) one(ctx context.Context, it Item) (outcome, string, error) {
	name := filepath.Base(it.Name)
	if it.Name == "" {
		name = ""
	}
	var target, part string
	var offset int64
	var bar *mpb.Bar
	prepare := func() (bool, error) {
		target = filepath.Join(d.opts.OutDir, name)
		part = target + ".part"
		if owner, taken := d.claims.LoadOrStore(target, it.ID); taken {
			ig := Ignored{Name: name, ID: it.ID, KeptID: owner.(string)}
			d.log(name, 0, "ignored, same file name as document "+ig.KeptID)
			return false, ignoredError{ig}
		}
		if !d.opts.Resume {
			return false, nil
		}
		if fi, err := os.Stat(target); err == nil {
			if it.Size == 0 || fi.Size() == it.Size {
				d.log(name, fi.Size(), "skipped")
				return true, nil
			}
		}
		if fi, err := os.Stat(part); err == nil {
			offset = fi.Size()
		}
		return false, nil
	}
	if name != "" {
		if skip, err := prepare(); skip || err != nil {
			return outcomeSkipped, name, err
		}
	}

	for attempt := 0; ; attempt++ {
		rawURL, err := it.Presign(ctx)
		if err != nil {
			if attempt < d.opts.Retries && !isAPIError(err) && ctx.Err() == nil {
				d.backoff(attempt)
				continue
			}
			return 0, displayName(name, it), err
		}
		if name == "" {
			name = nameFromURL(rawURL)
			if name == "" {
				return 0, displayName(name, it), errors.New("cannot derive a file name from the download URL")
			}
			if skip, err := prepare(); skip || err != nil {
				return outcomeSkipped, name, err
			}
		}
		if bar == nil {
			bar = d.fileBar(name, it.Size)
		}
		resumed := offset > 0
		err = d.fetch(ctx, rawURL, part, &offset, it.Size, bar)
		if err == nil {
			_ = os.Remove(target) // Windows cannot rename over an existing file
			if err := os.Rename(part, target); err != nil {
				bar.Abort(true)
				return 0, name, fmt.Errorf("finalize %s: %w", name, err)
			}
			bar.SetTotal(-1, true)
			fi, _ := os.Stat(target)
			var size int64
			if fi != nil {
				size = fi.Size()
			}
			if resumed {
				d.log(name, size, "resumed")
				return outcomeResumed, name, nil
			}
			d.log(name, size, "ok")
			return outcomeDownloaded, name, nil
		}
		var herr httpError
		retryable := errors.As(err, &herr) && herr.retryable() || !errors.As(err, &herr)
		if retryable && attempt < d.opts.Retries && ctx.Err() == nil {
			if fi, statErr := os.Stat(part); statErr == nil && d.opts.Resume {
				offset = fi.Size()
			} else {
				offset = 0
			}
			d.backoff(attempt)
			continue
		}
		bar.Abort(true)
		if ctx.Err() != nil {
			d.log(name, 0, "interrupted")
			return 0, name, ctx.Err()
		}
		if !d.opts.Resume {
			_ = os.Remove(part)
		}
		d.log(name, 0, "failed: "+err.Error())
		return 0, name, err
	}
}

// fetch writes the body to part, appending from *offset with a Range request when *offset > 0.
func (d *downloader) fetch(ctx context.Context, rawURL, part string, offset *int64, size int64, bar *mpb.Bar) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, rawURL, nil)
	if err != nil {
		return err
	}
	if *offset > 0 {
		req.Header.Set("Range", fmt.Sprintf("bytes=%d-", *offset))
	}
	resp, err := d.opts.HTTP.Do(req)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()

	var f *os.File
	switch resp.StatusCode {
	// Downloads hold clinical data: files are created user-only (0600). part is built from a
	// sanitized base name under OutDir, never from raw input.
	case http.StatusOK:
		*offset = 0
		f, err = os.OpenFile(part, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0o600) //nolint:gosec // G304: see above
		if size == 0 && resp.ContentLength > 0 {
			bar.SetTotal(resp.ContentLength, false)
		}
	case http.StatusPartialContent:
		f, err = os.OpenFile(part, os.O_WRONLY|os.O_APPEND, 0o600) //nolint:gosec // G304: see above
		if size == 0 && resp.ContentLength > 0 {
			bar.SetTotal(*offset+resp.ContentLength, false)
		}
	case http.StatusRequestedRangeNotSatisfiable:
		// The .part already holds every byte.
		return nil
	default:
		return httpError{code: resp.StatusCode}
	}
	if err != nil {
		return fmt.Errorf("open %s: %w", part, err)
	}
	defer func() { _ = f.Close() }()

	bar.SetCurrent(*offset)
	var body io.Reader = resp.Body
	if proxy, perr := bar.ProxyReader(resp.Body); perr == nil {
		defer func() { _ = proxy.Close() }()
		body = proxy
	}
	n, err := io.Copy(f, body)
	*offset += n
	if err != nil {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		return fmt.Errorf("read body: %w", err)
	}
	if err := f.Sync(); err != nil {
		return fmt.Errorf("sync %s: %w", part, err)
	}
	return nil
}

func (d *downloader) fileBar(name string, size int64) *mpb.Bar {
	return d.bars.New(size, barStyle(d.palette.Cyan),
		mpb.BarRemoveOnComplete(),
		mpb.PrependDecorators(decor.Name(truncate(name, 22), decor.WC{W: 22, C: decor.DindentRight})),
		mpb.AppendDecorators(
			decor.Percentage(decor.WC{W: 5}),
			decor.CountersKibiByte("  % .1f / % .1f", decor.WC{W: 22}),
			decor.AverageSpeed(decor.SizeB1024(0), "% .1f", decor.WC{W: 12}),
			decor.AverageETA(decor.ET_STYLE_MMSS, decor.WC{W: 8}),
		),
	)
}

func (d *downloader) backoff(attempt int) {
	d.opts.Sleep(d.opts.Backoff << attempt)
}

func (d *downloader) log(name string, size int64, status string) {
	if d.opts.Log == nil {
		return
	}
	if size > 0 {
		prompt.Printf(d.opts.Log, "%-40s %10s  %s\n", name, units.FormatBytes(size), status)
		return
	}
	prompt.Printf(d.opts.Log, "%-40s %10s  %s\n", name, "", status)
}

func isAPIError(err error) bool {
	return errors.Is(err, api.ErrNotFound) || errors.Is(err, api.ErrForbidden) || errors.Is(err, api.ErrUnauthorized)
}

func nameFromURL(rawURL string) string {
	u, err := url.Parse(rawURL)
	if err != nil {
		return ""
	}
	base := path.Base(u.Path)
	if base == "." || base == "/" {
		return ""
	}
	return base
}

func displayName(name string, it Item) string {
	if name != "" {
		return name
	}
	if it.Name != "" {
		return it.Name
	}
	return "<unnamed>"
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return "..." + s[len(s)-(max-3):]
}
