package testutils

import (
	"bufio"
	"context"
	"database/sql"
	"fmt"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"strings"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func initDb(folderName string) (*gorm.DB, string, error) {
	ctx := context.Background()
	host, err := StarrocksContainerSetup.Container.Host(ctx)
	if err != nil {
		log.Fatal("failed to get container host: ", err)
	}

	port, err := StarrocksContainerSetup.Container.MappedPort(ctx, "9030")
	if err != nil {
		log.Fatal("failed to get container port: ", err)
	}

	dsn := fmt.Sprintf("root:@tcp(%s:%s)/?interpolateParams=true&parseTime=true", host, port.Port())
	gormDb, err := gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Info)})
	if err != nil {
		log.Fatal("failed to open connection to tb", err)
		return nil, "", nil
	}
	var db *sql.DB
	db, err = gormDb.DB()
	if err != nil {
		log.Fatal("failed to connect to StarRocks", err)
		return nil, "", nil
	}

	// Create a database with the name of the folder and a random number
	dbName := fmt.Sprintf("%s_%d", folderName, rand.Intn(1000000))
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s;", dbName))
	if err != nil {
		log.Fatal("failed to create database", err)
	}
	_, err = db.Exec(fmt.Sprintf("USE %s;", dbName))
	if err != nil {
		log.Fatal("failed to use database", err)
	}

	// Read the list of .tsv files in the folder
	files, err := os.ReadDir(filepath.Join(testResources, folderName))
	if err != nil {
		log.Fatal("failed to read directory test_resoures", err)
	}

	for _, file := range files {
		if filepath.Ext(file.Name()) == ".tsv" {
			err = createTableAndPopulateData(db, folderName, file)
			if err != nil {
				log.Println("file", file)
				log.Fatal("failed to create table and populate data", err)
			}
		}
	}

	if err != nil {
		log.Fatal("failed to get container port: ", err)
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
	_, err = db.Exec(federationQuery)
	if err != nil {
		log.Fatal("failed to create federation", err)
	}

	return gormDb, dbName, nil
}

func createTableAndPopulateData(db *sql.DB, folderName string, file os.DirEntry) error {
	if filepath.Ext(file.Name()) != ".tsv" {
		return nil
	}

	tableName := strings.TrimSuffix(file.Name(), ".tsv")
	sqlFilePath := filepath.Join(testResources, "sql", tableName+".sql")

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
	tsvFilePath := filepath.Join(testResources, folderName, file.Name())
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
