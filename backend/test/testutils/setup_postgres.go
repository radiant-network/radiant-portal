package testutils

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"

	"github.com/radiant-network/radiant-api/internal/database"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	gormPostgresDb     *gorm.DB
	setupPostgresMutex sync.RWMutex
)

func cleanUp(gormDb *gorm.DB) {
	var db *sql.DB
	db, _ = gormDb.DB()

	db.Exec("TRUNCATE TABLE interpretation_germline_history")
	db.Exec("TRUNCATE TABLE interpretation_somatic")
	db.Exec("TRUNCATE TABLE interpretation_somatic_history")
	db.Exec("DELETE FROM saved_filter WHERE user_id != '1' AND user_id != '2'")
	db.Exec("DELETE FROM batch WHERE created_on > '2025-01-01'")
	db.Exec("DELETE FROM patient WHERE id >= 1000")
	db.Exec("DELETE FROM sample WHERE id >= 1000")
	db.Exec("DELETE FROM sequencing_experiment WHERE id >= 1000")
	db.Exec("DELETE FROM cases WHERE id >= 1000")
	db.Exec("DELETE FROM case_has_sequencing_experiment WHERE case_id >= 1000")
	db.Exec("DELETE FROM family WHERE id >= 1000")
	db.Exec("DELETE FROM obs_categorical WHERE id >= 1000")
	db.Exec("DELETE FROM task WHERE id >= 1000")
	db.Exec("DELETE FROM task_context WHERE task_id >= 1000")
	db.Exec("DELETE FROM task_has_document WHERE task_id >= 1000")
	db.Exec("DELETE FROM document WHERE id >= 1000")
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

	if gormPostgresDb == nil {
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", host, "radiant", "radiant", "radiant", port.Port(), "disable")
		local, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatal("failed to open connection to db", err)
			return nil, err
		}

		gormPostgresDb = local
	}

	var db *sql.DB
	db, err = gormPostgresDb.DB()
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
	if count, _ := res.RowsAffected(); count == 0 {
		database.MigrateWithParams("file://../../scripts/init-sql/migrations", host, port.Port(), "radiant", "radiant", "radiant", "disable", "")
		err := populateData(db)
		if err != nil {
			log.Fatal("failed to insert basic data in Postgres", err)
			return nil, err
		}
	} else {
		log.Print("radiant postgres database already setup")
	}

	return gormPostgresDb, nil
}

func populateData(db *sql.DB) error {
	// Read the list of .sql files in the folder
	files, err := os.ReadDir(filepath.Join(testResources, "clinical"))
	if err != nil {
		log.Fatal("failed to read directory test_resoures", err)
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".sql" {
			sqlFilePath := filepath.Join(testResources, "clinical", file.Name())

			// Read the SQL file
			sqlFile, err := os.ReadFile(sqlFilePath)
			if err != nil {
				return fmt.Errorf("failed to read SQL file: %v", err)
			}

			// Execute the SQL file to insert data
			_, err = db.Exec(string(sqlFile))
			if err != nil {
				return fmt.Errorf("failed to insert data: %v for file %s", err, sqlFilePath)
			}
		}
	}
	return nil
}
