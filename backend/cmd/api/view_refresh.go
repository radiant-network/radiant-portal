package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"gorm.io/gorm"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/utils"
)

const viewRefreshOnStartupEnabledEnv = "VIEW_REFRESH_ON_STARTUP_ENABLED"

// viewRefreshLockKey serializes the startup refresh across replicas via a Postgres
// advisory lock; any stable int64 works.
const viewRefreshLockKey int64 = 0x726164696e7401

func shouldRefreshViewsOnStartup(enabled bool) bool {
	return enabled
}

// maybeRefreshTenantViewsOnStartup recreates every tenant's StarRocks views on each boot
// when enabled. It runs BEFORE the server starts serving on purpose: a new build must not
// serve against views that don't match the current schema. The refresh is CREATE OR REPLACE
// (idempotent), so running it on every startup — not only after a migration — is safe and
// self-heals drift; gated (default off) and advisory-locked so one replica runs it per deploy.
//
// A returned error is fatal to the caller (don't serve a build whose views don't match
// the schema). Cases that are NOT errors and return nil: the refresh is disabled, another
// replica holds the lock, or a shutdown cancelled it mid-run.
func maybeRefreshTenantViewsOnStartup(ctx context.Context, pg, sr *gorm.DB) error {
	if !shouldRefreshViewsOnStartup(utils.GetBoolEnvOrDefault(viewRefreshOnStartupEnabledEnv, false)) {
		return nil
	}

	tenants := repository.NewTenantRepository(pg)
	views := repository.NewStarrocksTenantRepository(sr)

	sqlDB, err := pg.DB()
	if err != nil {
		return fmt.Errorf("postgres handle: %w", err)
	}
	// Hold the advisory lock on a SESSION (a dedicated connection), not a transaction:
	// the StarRocks DDL runs outside any Postgres transaction, so the connection stays
	// merely idle (not idle-in-transaction) and avoids idle_in_transaction_session_timeout
	// and the VACUUM xmin hold. A crash still releases it — the session ends on disconnect.
	conn, err := sqlDB.Conn(ctx)
	if err != nil {
		return fmt.Errorf("acquire postgres connection: %w", err)
	}
	defer func() { _ = conn.Close() }()

	var locked bool
	if err := conn.QueryRowContext(ctx, "SELECT pg_try_advisory_lock($1)", viewRefreshLockKey).Scan(&locked); err != nil {
		return fmt.Errorf("acquire advisory lock: %w", err)
	}
	if !locked {
		slog.Info("startup tenant view refresh skipped: another instance holds the lock")
		return nil
	}
	defer func() {
		// WithoutCancel: still release if ctx was cancelled (SIGTERM) mid-refresh.
		if _, err := conn.ExecContext(context.WithoutCancel(ctx), "SELECT pg_advisory_unlock($1)", viewRefreshLockKey); err != nil {
			slog.Error("startup tenant view refresh: failed to release advisory lock", slog.Any("error", err))
		}
	}()

	codes, err := service.RefreshAllTenantViews(ctx, tenants, views)
	if err != nil {
		// A shutdown cancelling the refresh is not a failure — we're exiting anyway.
		if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
			slog.Warn("startup tenant view refresh aborted (shutting down)", slog.Any("error", err))
			return nil
		}
		return err
	}
	slog.Info("startup tenant view refresh completed", slog.Int("tenants", len(codes)))
	return nil
}
