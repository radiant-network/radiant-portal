package main

import (
	"context"

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
// migration changed the schema this boot. Gated (default off) and migration-gated so
// plain restarts don't churn; advisory-locked so one replica runs it per deploy;
// non-fatal so a failure never blocks serving (the break-glass
// `create-tenant -refresh-views` can recover). Uses only the StarRocks + Postgres
// connections the API already holds — no Ranger, no new credentials.
func maybeRefreshTenantViewsOnStartup(ctx context.Context, pg, sr *gorm.DB, migrated bool) {
	if !shouldRefreshViewsOnStartup(utils.GetBoolEnvOrDefault(viewRefreshOnStartupEnabledEnv, false), migrated) {
		return
	}
	if pg == nil || sr == nil {
		glog.Warning("startup tenant view refresh skipped: postgres or starrocks connection unavailable")
		return
	}

	lister := repository.NewTenantRepository(pg)
	srProvisioner := repository.NewStarrocksTenantRepository(sr, lister)

	// xact lock auto-releases on commit or crash, so a death mid-refresh never leaks it.
	err := pg.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var locked bool
		if err := tx.Raw("SELECT pg_try_advisory_xact_lock(?)", viewRefreshLockKey).Scan(&locked).Error; err != nil {
			return err
		}
		if !locked {
			glog.Info("another instance is refreshing tenant views; skipping")
			return nil
		}
		if err := service.RefreshAllTenantViews(ctx, lister, srProvisioner); err != nil {
			glog.Errorf("startup tenant view refresh failed (non-fatal): %v", err)
			return nil
		}
		glog.Info("startup tenant view refresh completed")
		return nil
	})
	if err != nil {
		glog.Errorf("startup tenant view refresh lock error (non-fatal): %v", err)
	}
}
