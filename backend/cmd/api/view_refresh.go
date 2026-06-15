package main

import (
	"context"
	"errors"

	"github.com/golang/glog"
	"gorm.io/gorm"

	"github.com/radiant-network/radiant-api/internal/repository"
	"github.com/radiant-network/radiant-api/internal/service"
	"github.com/radiant-network/radiant-api/internal/utils"
)

const viewRefreshOnStartupEnabledEnv = "VIEW_REFRESH_ON_STARTUP_ENABLED"

// viewRefreshLockKey serializes the startup refresh across replicas via a Postgres
// advisory lock; any stable int64 works.
const viewRefreshLockKey int64 = 0x726164696e7401

func shouldRefreshViewsOnStartup(enabled, migrated bool) bool {
	return enabled && migrated
}

// maybeRefreshTenantViewsOnStartup recreates per-tenant StarRocks views when a
// migration changed the schema this boot. It runs BEFORE the server starts serving on
// purpose: a new build must not serve against views that don't match the new schema.
// Gated (default off) and migration-gated so plain restarts don't churn; advisory-
// locked so one replica runs it per deploy.
func maybeRefreshTenantViewsOnStartup(ctx context.Context, pg, sr *gorm.DB, migrated bool) {
	if !shouldRefreshViewsOnStartup(utils.GetBoolEnvOrDefault(viewRefreshOnStartupEnabledEnv, false), migrated) {
		return
	}
	if pg == nil || sr == nil {
		glog.Warning("startup tenant view refresh skipped: postgres or starrocks connection unavailable")
		return
	}

	lister := repository.NewTenantRepository(pg)
	srProvisioner := repository.NewStarrocksTenantRepository(sr)

	sqlDB, err := pg.DB()
	if err != nil {
		glog.Errorf("startup tenant view refresh skipped: %v", err)
		return
	}
	// Hold the advisory lock on a SESSION (a dedicated connection), not a transaction:
	// the StarRocks DDL runs outside any Postgres transaction, so the connection stays
	// merely idle (not idle-in-transaction) and avoids idle_in_transaction_session_timeout
	// and the VACUUM xmin hold. A crash still releases it — the session ends on disconnect.
	conn, err := sqlDB.Conn(ctx)
	if err != nil {
		glog.Errorf("startup tenant view refresh skipped: %v", err)
		return
	}
	defer func() { _ = conn.Close() }()

	var locked bool
	if err := conn.QueryRowContext(ctx, "SELECT pg_try_advisory_lock($1)", viewRefreshLockKey).Scan(&locked); err != nil {
		glog.Errorf("startup tenant view refresh lock error (non-fatal): %v", err)
		return
	}
	if !locked {
		glog.Info("another instance is refreshing tenant views; skipping")
		return
	}
	defer func() {
		// WithoutCancel: still release if ctx was cancelled (SIGTERM) mid-refresh.
		if _, err := conn.ExecContext(context.WithoutCancel(ctx), "SELECT pg_advisory_unlock($1)", viewRefreshLockKey); err != nil {
			glog.Errorf("startup tenant view refresh: failed to release advisory lock: %v", err)
		}
	}()

	codes, err := service.RefreshAllTenantViews(ctx, lister, lister, srProvisioner)
	if err != nil {
		if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
			glog.Warningf("startup tenant view refresh aborted (shutting down): %v", err)
		} else {
			glog.Errorf("startup tenant view refresh failed (non-fatal): %v", err)
		}
		return
	}
	glog.Infof("startup tenant view refresh completed for %d tenant(s)", len(codes))
}
