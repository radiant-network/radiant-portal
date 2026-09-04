package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/api"
	"github.com/radiant-network/radiant-api/internal/cli/auth"
	"github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/cli/diskspace"
	"github.com/radiant-network/radiant-api/internal/cli/download"
	"github.com/radiant-network/radiant-api/internal/cli/keycloak"
	"github.com/radiant-network/radiant-api/internal/cli/manifest"
	"github.com/radiant-network/radiant-api/internal/cli/prompt"
	"github.com/radiant-network/radiant-api/internal/cli/style"
	"github.com/radiant-network/radiant-api/internal/cli/units"
	"github.com/spf13/cobra"
	"golang.org/x/term"
)

// exitInterrupted follows the shell convention 128 + SIGINT.
const exitInterrupted = 130

type downloadFlags struct {
	manifestPath string
	outDir       string
	threads      int
	yes          bool
	resume       bool
	skipMissing  bool
}

func downloadCmd(resolve configPathResolver) *cobra.Command {
	var f downloadFlags
	cmd := &cobra.Command{
		Use:   "download",
		Short: "Download the documents listed in a TSV manifest",
		RunE: func(cmd *cobra.Command, args []string) error {
			return runDownload(cmd.Context(), cmd, f, resolve)
		},
	}
	cmd.Flags().StringVarP(&f.manifestPath, "manifest", "m", "", "TSV manifest (columns: tenant, document_id, optional name, size)")
	cmd.Flags().StringVarP(&f.outDir, "output", "o", ".", "output directory")
	cmd.Flags().IntVarP(&f.threads, "threads", "t", 4, "parallel downloads")
	cmd.Flags().BoolVarP(&f.yes, "yes", "y", false, "skip the confirmation prompt")
	cmd.Flags().BoolVar(&f.resume, "resume", false, "skip files already complete on disk and continue partial .part files")
	cmd.Flags().BoolVar(&f.skipMissing, "skip-missing", false, "exit 0 even when some documents were not found or not allowed")
	_ = cmd.MarkFlagRequired("manifest")
	return cmd
}

func runDownload(ctx context.Context, cmd *cobra.Command, f downloadFlags, resolve configPathResolver) error {
	out := cmd.OutOrStdout()
	p := style.For(out)
	path, err := resolve()
	if err != nil {
		return err
	}
	cfg, err := config.Load(path)
	if err != nil {
		return err
	}
	if err := cfg.Validate(); err != nil {
		return fmt.Errorf("%w: run `radiant-client configure` first", err)
	}

	outDir, err := prepareOutDir(f.outDir)
	if err != nil {
		return err
	}

	mf, err := os.Open(f.manifestPath)
	if err != nil {
		return fmt.Errorf("open manifest: %w", err)
	}
	entries, warnings, err := manifest.Parse(mf)
	_ = mf.Close()
	if err != nil {
		for _, w := range warnings {
			prompt.Printf(out, "%s %s\n", p.Yellow("warning:"), w)
		}
		return fmt.Errorf("manifest %s: %w", f.manifestPath, err)
	}
	prompt.Printf(out, "Manifest: %s documents\n", p.Bold(fmt.Sprint(len(entries))))
	for _, w := range warnings {
		prompt.Printf(out, "%s %s\n", p.Yellow("warning:"), w)
	}

	kc := keycloak.New(keycloak.Config{BaseURL: cfg.Auth.KeycloakURL, Realm: cfg.Auth.Realm, ClientID: cfg.Auth.ClientID})
	token, err := auth.EnsureToken(ctx, cfg, kc, out, time.Now())
	if err != nil {
		return err
	}
	if err := config.Save(path, cfg); err != nil {
		return err
	}

	total, unknown, toDownload := estimate(entries, outDir, f.resume)
	available, err := diskspace.Available(outDir)
	if err != nil {
		return err
	}
	if total > available {
		return fmt.Errorf("not enough disk space: %s needed, %s available in %s", units.FormatBytes(total), units.FormatBytes(available), outDir)
	}
	sizeNote := ""
	if unknown > 0 {
		sizeNote = p.Yellow(fmt.Sprintf(", %d without size in the manifest", unknown))
	}
	prompt.Printf(out, "\nSize to download: %s (%d files%s)   available: %s\n", p.Highlight(units.FormatBytes(total)), toDownload, sizeNote, p.Bold(units.FormatBytes(available)))
	if !f.yes {
		ok, err := prompt.Confirm(cmd.InOrStdin(), out, "Continue?")
		if err != nil {
			return err
		}
		if !ok {
			return errors.New("aborted by user")
		}
	}
	prompt.Println(out)

	client := api.New(cfg.APIURL)
	client.Token = func(context.Context) (string, error) { return token, nil }
	items := make([]download.Item, len(entries))
	for i, e := range entries {
		items[i] = download.Item{ID: fmt.Sprint(e.DocumentID), Name: e.Name, Size: e.Size, Presign: func(ctx context.Context) (string, error) {
			ps, err := client.DownloadURL(ctx, e.Tenant, e.DocumentID)
			if err != nil {
				return "", err
			}
			return ps.URL, nil
		}}
	}
	opts := download.Options{OutDir: outDir, Threads: f.threads, Resume: f.resume, Retries: 3}
	if isTerminal(out) {
		opts.Progress = out
	} else {
		opts.Log = out
	}
	ctx, stop := interruptible(ctx, cmd.ErrOrStderr())
	defer stop()
	res := download.Run(ctx, items, opts)

	return report(out, p, res, outDir, f.skipMissing, cfg, path)
}

// interruptible cancels ctx on the first Ctrl-C / SIGTERM so in-flight downloads stop cleanly,
// then restores default signal handling so a second Ctrl-C force-quits. Installed only around
// the download phase: before it there is nothing to clean up, and a blocking prompt read could
// not honour the cancellation anyway.
func interruptible(parent context.Context, msgOut io.Writer) (context.Context, func()) {
	ctx, cancel := context.WithCancel(parent)
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt, syscall.SIGTERM)
	go func() {
		select {
		case <-sigs:
			signal.Stop(sigs)
			prompt.Println(msgOut, "\nStopping... (Ctrl-C again to force quit)")
			cancel()
		case <-ctx.Done():
		}
	}()
	return ctx, func() {
		signal.Stop(sigs)
		cancel()
	}
}

// exitCodeError carries a shell exit code for outcomes already reported to the user.
type exitCodeError struct {
	code int
	msg  string
}

func (e exitCodeError) Error() string { return e.msg }

func prepareOutDir(dir string) (string, error) {
	abs, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	if err := os.MkdirAll(abs, 0o750); err != nil {
		return "", fmt.Errorf("create output directory: %w", err)
	}
	probe, err := os.CreateTemp(abs, ".radiant-client-*")
	if err != nil {
		return "", fmt.Errorf("output directory %s is not writable: %w", abs, err)
	}
	_ = probe.Close()
	_ = os.Remove(probe.Name())
	return abs, nil
}

// estimate sums the manifest sizes. With resume, files already complete on disk are excluded.
func estimate(entries []manifest.Entry, outDir string, resume bool) (total int64, unknown, count int) {
	for _, e := range entries {
		if resume && e.Name != "" {
			if fi, err := os.Stat(filepath.Join(outDir, filepath.Base(e.Name))); err == nil && (e.Size == 0 || fi.Size() == e.Size) {
				continue
			}
		}
		count++
		if e.Size == 0 {
			unknown++
			continue
		}
		total += e.Size
	}
	return total, unknown, count
}

func report(out io.Writer, p style.Palette, res download.Result, outDir string, skipMissing bool, cfg *config.Config, path string) error {
	for _, n := range res.NotFound {
		prompt.Printf(out, "%s  %s\n", p.Yellow("not found:"), n)
	}
	for _, n := range res.Forbidden {
		prompt.Printf(out, "%s  %s\n", p.Yellow("forbidden:"), n)
	}
	for _, ig := range res.Ignored {
		prompt.Printf(out, "%s    %s (document %s has the same file name as document %s, only the latter was downloaded)\n", p.Yellow("ignored:"), ig.Name, ig.ID, ig.KeptID)
	}
	for _, e := range res.Errors {
		prompt.Printf(out, "%s     %v\n", p.Red("failed:"), e)
	}
	downloaded := fmt.Sprint(res.Downloaded + res.Resumed)
	failed := fmt.Sprint(res.Failed)
	if res.Failed > 0 {
		failed = p.Red(failed)
	} else {
		downloaded = p.Green(downloaded)
	}
	prompt.Printf(out, "\nTotal downloaded files: %s (resumed %d, skipped %d, failed %s)\nlocated here: %s\n", downloaded, res.Resumed, res.Skipped, failed, p.Path(outDir))

	if res.Interrupted > 0 {
		prompt.Printf(out, "%s %d file(s) not downloaded. Run again with --resume to continue.\n", p.Yellow("Interrupted:"), res.Interrupted)
		return exitCodeError{code: exitInterrupted, msg: "interrupted"}
	}
	for _, e := range res.Errors {
		if errors.Is(e, api.ErrUnauthorized) {
			cfg.Tokens = config.Tokens{}
			_ = config.Save(path, cfg)
			return errors.New("session rejected by the API, stored tokens were cleared: run the command again")
		}
	}
	if res.Failed > 0 {
		return fmt.Errorf("%d download(s) failed", res.Failed)
	}
	if missing := len(res.NotFound) + len(res.Forbidden); missing > 0 && !skipMissing {
		return fmt.Errorf("%d document(s) not found or not allowed (use --skip-missing to ignore)", missing)
	}
	return nil
}

func isTerminal(w io.Writer) bool {
	f, ok := w.(*os.File)
	return ok && term.IsTerminal(int(f.Fd()))
}
