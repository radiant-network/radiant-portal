package testutils

import (
	"context"
	"log"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/authorization"
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

func SequentialTestWithPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB)) {
	starrocks, _, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	testFunc(t, starrocks, postgres)
}

func SequentialTestWithMinIO(t *testing.T, testFunc func(t *testing.T, context context.Context, client *minio.Client, endpoint string)) {
	ctx := context.Background()
	minioC, err := initMinioContainer(ctx)
	if err != nil {
		log.Fatalf("Failed to start MinIO container: %v", err)
	}

	client, err := initS3Client(minioC.Endpoint)
	if err != nil {
		log.Fatalf("Failed to init S3 bucket: %v", err)
	}

	t.Setenv("AWS_ENDPOINT_URL", minioC.Endpoint)
	t.Setenv("AWS_ACCESS_KEY_ID", "admin")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
	t.Setenv("AWS_USE_SSL", "false")

	testFunc(t, ctx, client, minioC.Endpoint)
}

func SequentialTestWithPostgresAndMinIO(t *testing.T, testFunc func(t *testing.T, context context.Context, client *minio.Client, endpoint string, db *gorm.DB)) {
	ctx := context.Background()
	minioC, err := initMinioContainer(ctx)
	if err != nil {
		log.Fatalf("Failed to start MinIO container: %v", err)
	}

	client, err := initS3Client(minioC.Endpoint)
	if err != nil {
		log.Fatalf("Failed to init S3 bucket: %v", err)
	}

	gormDb, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init db connection: ", err)
	}

	t.Setenv("AWS_ENDPOINT_URL", minioC.Endpoint)
	t.Setenv("AWS_ACCESS_KEY_ID", "admin")
	t.Setenv("AWS_SECRET_ACCESS_KEY", "password")
	t.Setenv("AWS_USE_SSL", "false")

	testFunc(t, ctx, client, minioC.Endpoint, gormDb)
}

func ParallelTestWithDb(t *testing.T, dbName string, testFunc func(t *testing.T, db *gorm.DB)) {
	t.Parallel()
	db, _, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	_, err = initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	testFunc(t, db)
}

func ParallelTestWithPostgres(t *testing.T, testFunc func(t *testing.T, postgres *gorm.DB)) {
	t.Parallel()
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	testFunc(t, postgres)
	// Clean up
	cleanUp(postgres)
}

func ParallelTestWithPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB)) {
	// NOTE: despite the helper's name, tests using this combined Postgres +
	// StarRocks helper do not call t.Parallel(). The StarRocks JDBC federation
	// catalog reads Postgres state mutated by these tests, and concurrent runs
	// race on visibility through the federation. Serializing them keeps the
	// helper's contract observable while only adding a few seconds total.
	starrocks, _, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	defer cleanUp(postgres)
	testFunc(t, starrocks, postgres)
}

func ParallelTestWithOpenFGAAndPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, openfga *authorization.OpenFGAModelConfiguration, starrocks *gorm.DB, postgres *gorm.DB)) {
	// See note on ParallelTestWithPostgresAndStarrocks — runs serially.
	storeID, err := initOpenFGA()
	if err != nil {
		log.Fatal("Failed to init OpenFGA store")
	}

	starrocks, _, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}
	defer cleanUp(postgres)
	testFunc(t, storeID, starrocks, postgres)
}

func ParallelTestWithAll(t *testing.T, dbName string, testFunc func(t *testing.T, client *minio.Client, endpoint string, postgres *gorm.DB, starrocks *gorm.DB)) {
	// See note on ParallelTestWithPostgresAndStarrocks — runs serially.
	starrocks, _, err := initDb(dbName)
	if err != nil {
		log.Fatal("Failed to init db connection:", err)

	}
	postgres, err := initPostgresDb()
	if err != nil {
		log.Fatal("Failed to init PostgreSQL db connection:", err)

	}

	ctx := context.Background()
	minioC, err := initMinioContainer(ctx)
	if err != nil {
		log.Fatalf("Failed to start MinIO container: %v", err)
	}

	client, err := initS3Client(minioC.Endpoint)
	if err != nil {
		log.Fatalf("Failed to init S3 bucket: %v", err)
	}
	defer cleanUp(postgres)
	testFunc(t, client, minioC.Endpoint, postgres, starrocks)
}
