package testutils

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"
	"testing"

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
	res, err := db.Exec("SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'radiant'")
	if err != nil {
		log.Fatal("failed to verify if schema already exist in Postgres", err)
		return nil, err
	}
	if count,_ := res.RowsAffected(); count == 0 {
		file, err := os.ReadFile("../../scripts/init-sql/init_postgres.sql")
		if err != nil {
			log.Fatal("Failed to read init_postgres.sql file: ", err)
		}
	
		_, err = db.Exec(string(file))
		if err != nil {
			log.Fatal("failed to init postgres tables: ", err)
		}
	} else {
		log.Print("Schema already exists")
	}

	return gormDb, nil
}
