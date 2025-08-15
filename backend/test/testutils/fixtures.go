package testutils

import (
	"context"
	"fmt"
	"log"
	"testing"

	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

func SequentialPostgresTestWithDb(t *testing.T, testFunc func(t *testing.T, db *gorm.DB)) {
	gormDb, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init db connection: ", err)
	}
	testFunc(t, gormDb)
	// Clean up
	cleanUp(gormDb)
}

func ParallelTestWithDb(t *testing.T, dbName string, testFunc func(t *testing.T, db *gorm.DB)) {
	t.Parallel()
	db, dbName, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	_, err = initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	testFunc(t, db)
	//Drop database
	db.Exec(fmt.Sprintf("DROP DATABASE %s;", dbName))
}

func ParallelTestWithPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB)) {
	t.Parallel()
	starrocks, dbName, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	testFunc(t, starrocks, postgres)
	//Drop database
	starrocks.Exec(fmt.Sprintf("DROP DATABASE %s;", dbName))
}

func ParallelTestWithAll(t *testing.T, dbName string, testFunc func(t *testing.T, client *minio.Client, endpoint string, postgres *gorm.DB, starrocks *gorm.DB)) {
	t.Parallel()

	starrocks, dbName, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}

	defer starrocks.Exec(fmt.Sprintf("DROP DATABASE %s;", dbName))

	ctx := context.Background()
	minioC, err := initMinioContainer(ctx)
	if err != nil {
		log.Fatalf("Failed to start MinIO container: %v", err)
	}

	client, err := initS3Client(minioC.Endpoint)
	if err != nil {
		log.Fatalf("Failed to init S3 bucket: %v", err)
	}
	testFunc(t, client, minioC.Endpoint, postgres, starrocks)
}
