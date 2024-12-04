package testutils

import (
	"bufio"
	"context"
	"database/sql"
	"fmt"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"math/rand"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"
)

const (
	testResources          = "../../test/data"
	starrocksContainerName = "starrocks_radiant"
)

var (
	starrocksContainer testcontainers.Container
	once               sync.Once
	containerStarted   bool
)

func StopContainer() {
	if containerStarted {
		fmt.Println("Stopping StarRocks container..")
		if err := starrocksContainer.Terminate(context.Background()); err != nil {
			log.Fatal("Failed to stop StarRocks container: ", err)
		}
		fmt.Println("StarRocks container stopped")
	} else {
		fmt.Println("StarRocks container is still running because it was started outside the tests")
	}
}

func ParallelTestWithDb(t *testing.T, dbName string, testFunc func(t *testing.T, db *gorm.DB)) {
	t.Parallel()
	db, dbName, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	testFunc(t, db)
	//Drop database
	db.Exec(fmt.Sprintf("DROP DATABASE %s;", dbName))

}
func initDb(folderName string) (*gorm.DB, string, error) {
	ctx := context.Background()
	host, err := starrocksContainer.Host(ctx)
	if err != nil {
		log.Fatal("failed to get container host: ", err)
	}

	port, err := starrocksContainer.MappedPort(ctx, "9030")
	if err != nil {
		log.Fatal("failed to get container port: ", err)
	}

	dsn := fmt.Sprintf("root:@tcp(%s:%s)/?interpolateParams=true", host, port.Port())
	gormDb, err := gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Info)})
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
				log.Fatal("failed to create table and populate data", err)
			}
		}
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
			args[i] = v // Database driver will handle type conversion
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

func startStarRocksContainer() (testcontainers.Container, error) {
	ctx := context.Background()

	req := testcontainers.ContainerRequest{
		Image:        "starrocks/allin1-ubuntu",
		ExposedPorts: []string{"9030/tcp", "8030/tcp", "8040/tcp"},
		WaitingFor: wait.ForAll(
			wait.ForListeningPort("9030/tcp"),
			wait.ForListeningPort("8030/tcp"),
			wait.ForListeningPort("8040/tcp"),
			wait.ForLog("Enjoy the journey to StarRocks").WithPollInterval(1*time.Second),
		),
	}

	container, err := testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})
	if err != nil {
		return nil, err
	}

	return container, nil
}

func SetupContainer() {
	once.Do(func() {
		// Run the script to start the container if it's not already running
		cmd := exec.Command("docker", "ps", "-q", "-f", fmt.Sprintf("name=%s", starrocksContainerName))
		output, err := cmd.Output()
		if err != nil {
			log.Fatal("Failed to check if StarRocks container is running: ", err)
		}

		if len(output) == 0 {
			// Container is not running, start a new one
			starrocksContainer, err = startStarRocksContainer()
			if err != nil {
				log.Fatal("Failed to start StarRocks container: ", err)
			}
			containerStarted = true
		} else {
			// Container is already running, attach to it
			fmt.Println("StarRocks container is already running.")
			ctx := context.Background()
			starrocksContainer, err = testcontainers.GenericContainer(ctx, testcontainers.GenericContainerRequest{
				ContainerRequest: testcontainers.ContainerRequest{
					Name: starrocksContainerName,
				},
				Started: true,
				Reuse:   true,
			})
			if err != nil {
				log.Fatal("Failed to attach to StarRocks container: ", err)
			}
			containerStarted = false
		}
	})
}
