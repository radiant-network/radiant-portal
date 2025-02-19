package testutils

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"sync"
	"testing"

	"github.com/Ferlab-Ste-Justine/radiant-api/internal/database"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var setupPostgresMutex sync.RWMutex

func ParallelPostgresTestWithDb(t *testing.T, testFunc func(t *testing.T, db *gorm.DB)) {
	t.Parallel()
	gormDb, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init db connection: ", err)
	}
	testFunc(t, gormDb)
	// Clean up
	cleanUp(gormDb)
}

func cleanUp(gormDb *gorm.DB) {
	var db *sql.DB
	db, _ = gormDb.DB();
	db.Exec("TRUNCATE TABLE interpretation_germline")
	db.Exec("TRUNCATE TABLE interpretation_germline_history")
	db.Exec("TRUNCATE TABLE interpretation_somatic")
	db.Exec("TRUNCATE TABLE interpretation_somatic_history")
}

func initPostgresDb() (*gorm.DB, error) {
	ctx := context.Background()
	host, err := PostgresContainerSetup.Container.Host(ctx)
	if err != nil {
		log.Fatal("failed to get container host: ", err)
	}

	port, err := PostgresContainerSetup.Container.MappedPort(ctx, "5432")
	if err != nil {
		log.Fatal("failed to get container port: ", err)
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", host, "radiant", "radiant", "radiant", port.Port(), "disable")
	gormDb, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to open connection to tb", err)
		return nil, err
	}

	var db *sql.DB
	db, err = gormDb.DB()
	if err != nil {
		log.Fatal("failed to connect to Postgres: ", err)
		return nil, err
	}

	// parallel tests can create the schema at the same time
	setupPostgresMutex.Lock()
	defer setupPostgresMutex.Unlock()
	res, err := db.Exec("SELECT * FROM pg_catalog.pg_tables WHERE tablename = 'interpretation_germline'")
	if err != nil {
		log.Fatal("failed to verify if table already exist in Postgres", err)
		return nil, err
	}
	if count,_ := res.RowsAffected(); count == 0 {
		database.MigrateWithParams("file://../../scripts/init-sql/migrations", host, port.Port(), "radiant", "radiant", "radiant", "disable", "")
	} else {
		log.Print("radiant postgres database already setup")
	}

	return gormDb, nil
}
