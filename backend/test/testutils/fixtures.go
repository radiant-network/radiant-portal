package testutils

import (
	"context"
	"log"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/radiant-network/radiant-api/internal/authorization"
	"gorm.io/gorm"
)

// =============================================================================
// RunTest is the single entry point for setting up an integration test.
// Callers describe what they need via Need; RunTest figures out the rest:
//   - which resources to initialize
//   - whether the test can run in parallel
//   - whether to clean up Postgres after the test
//
// Resources requested via Need are exposed on Env. Unrequested fields are nil.
// =============================================================================

// PostgresMode describes how a test interacts with Postgres.
type PostgresMode int

const (
	NoPostgres        PostgresMode = iota
	ReadPostgres                         // exposed; test must not write
	WritePostgres                        // writes with unique keys; cleanUp runs; can run in parallel
	ExclusivePostgres                    // writes to shared state; cleanUp runs; forces serial execution
)

// Need declares which test resources are required.
type Need struct {
	Starrocks string       // fixture folder name under test/data/; "" = no StarRocks
	Postgres  PostgresMode // see PostgresMode constants
	MinIO     bool         // spin up a per-test MinIO container
	OpenFGA   bool         // initialize a per-test OpenFGA store
}

// MinIOEnv groups the MinIO connection details exposed to a test.
type MinIOEnv struct {
	Client   *minio.Client
	Endpoint string
}

// Env holds the resources requested via Need. Unrequested fields are nil.
type Env struct {
	Ctx       context.Context
	Starrocks *gorm.DB
	Postgres  *gorm.DB
	OpenFGA   *authorization.OpenFGAModelConfiguration
	MinIO     *MinIOEnv
}

// RunTest sets up the requested resources and runs the test body.
//
// The test runs in parallel UNLESS one of the following makes that unsafe:
//   - ExclusivePostgres: the test touches shared rows (seed data, count
//     assertions on shared keys) and needs the database to itself.
//   - MinIO: the helper sets AWS_* env vars via t.Setenv, which is mutually
//     exclusive with t.Parallel.
//   - OpenFGA: in this codebase, OpenFGA tests mutate process env via
//     os.Setenv, which would race with parallel tests.
func RunTest(t *testing.T, need Need, fn func(t *testing.T, env *Env)) {
	serial := need.Postgres == ExclusivePostgres || need.MinIO || need.OpenFGA
	if !serial {
		t.Parallel()
	}

	env := &Env{Ctx: context.Background()}

	// StarRocks (always pulls Postgres up alongside it for the federation catalog).
	if need.Starrocks != "" {
		sr, _, err := initStarrocksDb(need.Starrocks)
		if err != nil {
			log.Fatal("Failed to init StarRocks: ", err)
		}
		env.Starrocks = sr
	}

	// Postgres (always required when StarRocks is requested, even if not exposed).
	if need.Postgres != NoPostgres || need.Starrocks != "" {
		pg, err := initPostgresDb()
		if err != nil {
			log.Fatal("Failed to init Postgres: ", err)
		}
		if need.Postgres != NoPostgres {
			env.Postgres = pg
		}
		if need.Postgres == WritePostgres || need.Postgres == ExclusivePostgres {
			defer cleanUp(pg)
		}
	}

	// OpenFGA (per-test store within the shared OpenFGA container).
	if need.OpenFGA {
		store, err := initOpenFGA()
		if err != nil {
			log.Fatal("Failed to init OpenFGA store: ", err)
		}
		env.OpenFGA = store
	}

	// MinIO (per-test container; AWS_* env vars are exported via t.Setenv).
	if need.MinIO {
		minioC, err := initMinioContainer(env.Ctx)
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
		env.MinIO = &MinIOEnv{Client: client, Endpoint: minioC.Endpoint}
	}

	fn(t, env)
}

// =============================================================================
// Backward-compatible shims around RunTest.
//
// These exist so the call sites don't have to be migrated all at once.
// New code should prefer RunTest directly. The shims will be removed once
// every caller has been migrated.
// =============================================================================

func ParallelTestWithStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, db *gorm.DB)) {
	RunTest(t, Need{Starrocks: dbName}, func(t *testing.T, env *Env) {
		testFunc(t, env.Starrocks)
	})
}

func ParallelTestWithPostgres(t *testing.T, testFunc func(t *testing.T, postgres *gorm.DB)) {
	RunTest(t, Need{Postgres: WritePostgres}, func(t *testing.T, env *Env) {
		testFunc(t, env.Postgres)
	})
}

func ParallelTestWithReadOnlyPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB)) {
	RunTest(t, Need{Starrocks: dbName, Postgres: ReadPostgres}, func(t *testing.T, env *Env) {
		testFunc(t, env.Starrocks, env.Postgres)
	})
}

func SequentialTestWithPostgres(t *testing.T, testFunc func(t *testing.T, db *gorm.DB)) {
	RunTest(t, Need{Postgres: ExclusivePostgres}, func(t *testing.T, env *Env) {
		testFunc(t, env.Postgres)
	})
}

func SequentialTestWithMinIO(t *testing.T, testFunc func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string)) {
	RunTest(t, Need{MinIO: true}, func(t *testing.T, env *Env) {
		testFunc(t, env.Ctx, env.MinIO.Client, env.MinIO.Endpoint)
	})
}

func SequentialTestWithPostgresAndMinIO(t *testing.T, testFunc func(t *testing.T, ctx context.Context, client *minio.Client, endpoint string, db *gorm.DB)) {
	RunTest(t, Need{Postgres: ExclusivePostgres, MinIO: true}, func(t *testing.T, env *Env) {
		testFunc(t, env.Ctx, env.MinIO.Client, env.MinIO.Endpoint, env.Postgres)
	})
}

func SequentialTestWithPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, starrocks *gorm.DB, postgres *gorm.DB)) {
	RunTest(t, Need{Starrocks: dbName, Postgres: ExclusivePostgres}, func(t *testing.T, env *Env) {
		testFunc(t, env.Starrocks, env.Postgres)
	})
}

func SequentialTestWithOpenFGAAndPostgresAndStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, openfga *authorization.OpenFGAModelConfiguration, starrocks *gorm.DB, postgres *gorm.DB)) {
	RunTest(t, Need{Starrocks: dbName, Postgres: ExclusivePostgres, OpenFGA: true}, func(t *testing.T, env *Env) {
		testFunc(t, env.OpenFGA, env.Starrocks, env.Postgres)
	})
}

func SequentialTestWithMinIOPostgresStarrocks(t *testing.T, dbName string, testFunc func(t *testing.T, client *minio.Client, endpoint string, postgres *gorm.DB, starrocks *gorm.DB)) {
	RunTest(t, Need{Starrocks: dbName, Postgres: ExclusivePostgres, MinIO: true}, func(t *testing.T, env *Env) {
		testFunc(t, env.MinIO.Client, env.MinIO.Endpoint, env.Postgres, env.Starrocks)
	})
}
