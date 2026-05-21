package testutils

import (
	"bufio"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// ErrStarrocksReadOnly is returned when test code attempts to write to StarRocks.
var ErrStarrocksReadOnly = errors.New("StarRocks is read-only in tests: writes are not allowed")

// StarRocks is treated as read-only by the test suite: no repository code writes
// to it. To avoid re-ingesting the same fixture folder for every test, we load
// each folder into a stable database name once per process and hand out fresh
// GORM connections pointed at the shared database on subsequent calls.
type fixtureState struct {
	once sync.Once
	err  error
}

var (
	fixtureStatesMu sync.Mutex
	fixtureStates   = map[string]*fixtureState{}
)

func fixtureStateFor(folderName string) *fixtureState {
	fixtureStatesMu.Lock()
	defer fixtureStatesMu.Unlock()
	st, ok := fixtureStates[folderName]
	if !ok {
		st = &fixtureState{}
		fixtureStates[folderName] = st
	}
	return st
}

func openStarrocksGorm(dbName string) (*gorm.DB, error) {
	ctx := context.Background()
	host, err := StarrocksContainerSetup.Container.Host(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get container host: %w", err)
	}
	port, err := StarrocksContainerSetup.Container.MappedPort(ctx, "9030")
	if err != nil {
		return nil, fmt.Errorf("failed to get container port: %w", err)
	}
	dsn := fmt.Sprintf("root:@tcp(%s:%s)/%s?interpolateParams=true&parseTime=true", host, port.Port(), dbName)
	return gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Info)})
}

func initStarrocksDb(folderName string) (*gorm.DB, string, error) {
	dbName := folderName

	st := fixtureStateFor(folderName)
	st.once.Do(func() {
		st.err = loadFixtureFolder(folderName, dbName)
	})
	if st.err != nil {
		log.Fatal("failed to load fixture folder ", folderName, ": ", st.err)
	}

	gormDb, err := openStarrocksGorm(dbName)
	if err != nil {
		log.Fatal("failed to open connection to StarRocks: ", err)
	}
	registerReadOnlyGuard(gormDb)
	return gormDb, dbName, nil
}

// registerReadOnlyGuard registers GORM callbacks that reject write operations.
// This enforces the read-only invariant at runtime: any production or test code
// that attempts to INSERT, UPDATE, or DELETE through the StarRocks *gorm.DB
// will get an immediate error instead of silently succeeding and breaking the
// shared fixture cache.
//
// Guards are registered on both the ORM pipeline (Create/Update/Delete) and
// the Raw pipeline (db.Exec) to cover all write paths.
func registerReadOnlyGuard(db *gorm.DB) {
	rejectWrite := func(db *gorm.DB) {
		db.AddError(ErrStarrocksReadOnly)
	}
	db.Callback().Create().Before("gorm:create").Register("starrocksReadOnly:create", rejectWrite)
	db.Callback().Update().Before("gorm:update").Register("starrocksReadOnly:update", rejectWrite)
	db.Callback().Delete().Before("gorm:delete").Register("starrocksReadOnly:delete", rejectWrite)
	db.Callback().Raw().Before("gorm:raw").Register("starrocksReadOnly:raw", func(db *gorm.DB) {
		if db.Statement != nil && db.Statement.SQL.Len() > 0 {
			upper := strings.ToUpper(db.Statement.SQL.String())
			if strings.HasPrefix(upper, "INSERT") ||
				strings.HasPrefix(upper, "UPDATE") ||
				strings.HasPrefix(upper, "DELETE") ||
				strings.HasPrefix(upper, "DROP") ||
				strings.HasPrefix(upper, "ALTER") ||
				strings.HasPrefix(upper, "TRUNCATE") {
				db.AddError(ErrStarrocksReadOnly)
			}
		}
	})
}

// loadFixtureFolder is run exactly once per fixture folder per process. It
// drops any leftover database from a previous run, recreates it, ingests every
// .tsv in the folder and ensures the JDBC federation catalog exists.
func loadFixtureFolder(folderName, dbName string) error {
	bootstrap, err := openStarrocksGorm("")
	if err != nil {
		return fmt.Errorf("failed to open bootstrap connection: %w", err)
	}
	defer func() {
		if sqlDB, err := bootstrap.DB(); err == nil {
			_ = sqlDB.Close()
		}
	}()

	db, err := bootstrap.DB()
	if err != nil {
		return fmt.Errorf("failed to access bootstrap sql.DB: %w", err)
	}

	if _, err := db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS %s;", dbName)); err != nil {
		return fmt.Errorf("failed to drop existing database: %w", err)
	}
	if _, err := db.Exec(fmt.Sprintf("CREATE DATABASE %s;", dbName)); err != nil {
		return fmt.Errorf("failed to create database: %w", err)
	}
	if _, err := db.Exec(fmt.Sprintf("USE %s;", dbName)); err != nil {
		return fmt.Errorf("failed to use database: %w", err)
	}

	files, err := os.ReadDir(filepath.Join(TestResources, folderName))
	if err != nil {
		return fmt.Errorf("failed to read fixture directory: %w", err)
	}
	for _, file := range files {
		if filepath.Ext(file.Name()) != ".tsv" {
			continue
		}
		if err := createTableAndPopulateData(db, folderName, file); err != nil {
			return fmt.Errorf("failed to ingest %s: %w", file.Name(), err)
		}
	}

	federationQuery := fmt.Sprintf(
		`
		CREATE EXTERNAL CATALOG IF NOT EXISTS radiant_jdbc
		PROPERTIES
		(
			"type"="jdbc",
			"user"="radiant",
			"password"="radiant",
			"jdbc_uri"="jdbc:postgresql://%s:5432/radiant",
			"driver_url"="https://repo1.maven.org/maven2/org/postgresql/postgresql/42.3.3/postgresql-42.3.3.jar",
			"driver_class"="org.postgresql.Driver"
		);
	`, PostgresContainerName)
	if _, err := db.Exec(federationQuery); err != nil {
		return fmt.Errorf("failed to create federation catalog: %w", err)
	}
	return nil
}

func createTableAndPopulateData(db *sql.DB, folderName string, file os.DirEntry) error {
	if filepath.Ext(file.Name()) != ".tsv" {
		return nil
	}

	tableName := strings.TrimSuffix(file.Name(), ".tsv")
	sqlFilePath := filepath.Join(TestResources, "sql", tableName+".sql")

	// Read the SQL file
	sqlFile, err := os.ReadFile(sqlFilePath)
	if err != nil {
		return fmt.Errorf("failed to read SQL file: %v", err)
	}

	// Execute the SQL file to create the table
	_, err = db.Exec(string(sqlFile))
	if err != nil {
		return fmt.Errorf("failed to create table: %v", err)
	}

	// Populate the table with data from the .tsv file
	tsvFilePath := filepath.Join(TestResources, folderName, file.Name())
	tsvFile, err := os.Open(tsvFilePath)
	if err != nil {
		return fmt.Errorf("failed to open TSV file: %v", err)
	}
	defer tsvFile.Close()

	scanner := bufio.NewScanner(tsvFile)
	// Read the header line
	var columns []string
	if scanner.Scan() {
		header := scanner.Text()
		columns = strings.Split(header, "\t")
	}

	columnNames := strings.Join(columns, ", ")
	p := strings.Repeat("?, ", len(columns))
	p = p[:len(p)-2]
	insertQuery := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, columnNames, p)
	for scanner.Scan() {
		line := scanner.Text()
		values := strings.Split(line, "\t")

		// Convert to interface{} for stmt.Exec
		args := make([]interface{}, len(values))
		for i, v := range values {
			//if strings.HasPrefix(v, "[") {
			args[i] = fmt.Sprintf("array(%v)", v)
			//} else {
			args[i] = v // Database driver will handle type conversion
			//}
		}

		// Execute the prepared statement
		_, err = db.Exec(insertQuery, args...)
		if err != nil {
			return fmt.Errorf("failed to insert row: %v", err)
		}
	}

	if err = scanner.Err(); err != nil {
		return fmt.Errorf("error reading TSV file: %v", err)
	}

	return nil
}
