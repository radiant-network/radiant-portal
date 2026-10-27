package testutils

import (
	"context"
	"crypto/rand"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
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

	db.Exec("DELETE FROM interpretation_germline WHERE case_id != '1'")
	db.Exec("TRUNCATE TABLE interpretation_germline_history")
	db.Exec("DELETE FROM interpretation_somatic WHERE case_id != '1'")
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
	db.Exec("DELETE FROM obs_string WHERE id >= 1000")
	// Deleted last: family/obs_categorical/obs_string above may reference fetus(id) via fetus_id.
	db.Exec("DELETE FROM fetus WHERE id >= 1000")
	db.Exec("DELETE FROM occurrence_note where case_id != 1 AND case_id != 71")
	db.Exec("DELETE FROM occurrence_flag WHERE case_id != 1")
	db.Exec("DELETE FROM case_assignment")
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
		database.MigrateWithParams("file://"+filepath.Join(ModuleRoot(), "scripts", "init-sql", "migrations"), host, port.Port(), "radiant", "radiant", "radiant", "disable", "")
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

// MigrationDatabase is a database of its own in the shared Postgres container, for tests of one migration:
// NewMigrationDatabase stops at the version before it, LoadFixtures and the test insert the rows the migration
// reads, then MigrateTo applies it. The fixtures must be valid at that version, so a migration test loads a
// folder of its own, never the clinical one: that one follows the latest schema.
type MigrationDatabase struct {
	DB  *gorm.DB
	url string
}

func NewMigrationDatabase(t *testing.T, version uint) *MigrationDatabase {
	t.Helper()
	ctx := context.Background()
	host, err := PostgresContainerSetup.Container.Host(ctx)
	if err != nil {
		t.Fatalf("failed to get container host: %v", err)
	}
	port, err := PostgresContainerSetup.Container.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatalf("failed to get container port: %v", err)
	}

	admin, err := gorm.Open(postgres.Open(fmt.Sprintf("host=%s user=radiant password=radiant dbname=radiant port=%s sslmode=disable", host, port.Port())), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open admin connection: %v", err)
	}
	name := "migration_" + strings.ToLower(rand.Text())
	if err := admin.Exec("CREATE DATABASE " + name).Error; err != nil {
		t.Fatalf("failed to create database %s: %v", name, err)
	}

	db, err := gorm.Open(postgres.Open(fmt.Sprintf("host=%s user=radiant password=radiant dbname=%s port=%s sslmode=disable", host, name, port.Port())), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to open database %s: %v", name, err)
	}
	t.Cleanup(func() {
		if sqlDB, err := db.DB(); err == nil {
			_ = sqlDB.Close()
		}
		admin.Exec("DROP DATABASE IF EXISTS " + name + " WITH (FORCE)")
		if sqlDB, err := admin.DB(); err == nil {
			_ = sqlDB.Close()
		}
	})

	m := &MigrationDatabase{DB: db, url: fmt.Sprintf("postgres://radiant:radiant@%s:%s/%s?sslmode=disable", host, port.Port(), name)}
	if err := m.MigrateTo(version); err != nil {
		t.Fatalf("failed to migrate %s to version %d: %v", name, version, err)
	}
	return m
}

func (m *MigrationDatabase) LoadFixtures(folder string) error {
	sqlDB, err := m.DB.DB()
	if err != nil {
		return fmt.Errorf("get sql.DB: %w", err)
	}
	return populateFolder(sqlDB, folder)
}

func (m *MigrationDatabase) MigrateTo(version uint) error {
	mig, err := migrate.New("file://"+filepath.Join(ModuleRoot(), "scripts", "init-sql", "migrations"), m.url)
	if err != nil {
		return fmt.Errorf("init migrations: %w", err)
	}
	defer func() { _, _ = mig.Close() }()
	return mig.Migrate(version)
}

func populateData(db *sql.DB) error {
	// Folders are loaded in order; auth fixtures are independent of clinical.
	for _, folder := range []string{"clinical", "auth"} {
		if err := populateFolder(db, folder); err != nil {
			return err
		}
	}
	return nil
}

func populateFolder(db *sql.DB, folder string) error {
	// Read the list of .sql files in the folder (os.ReadDir returns them sorted by name)
	files, err := os.ReadDir(filepath.Join(TestResources, folder))
	if err != nil {
		log.Fatalf("failed to read directory %s: %v", folder, err)
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".sql" {
			sqlFilePath := filepath.Join(TestResources, folder, file.Name())

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
