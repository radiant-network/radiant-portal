package database

import (
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/joho/godotenv/autoload"
	"github.com/radiant-network/radiant-api/internal/observability"
)

var (
	dbPgUser     = os.Getenv("PGUSER")
	dbPgPassword = os.Getenv("PGPASSWORD")
	dbPgPort     = os.Getenv("PGPORT")
	dbPgHost     = os.Getenv("PGHOST")
	dbPgDatabase = os.Getenv("PGDATABASE")
	dbPgSSLMode  = os.Getenv("PGSSLMODE")
	dbPgSSLCert  = os.Getenv("PGSSLROOTCERT")
)

func NewPostgresDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s",
		dbPgHost, dbPgUser, dbPgPassword, dbPgDatabase, dbPgPort)
	if dbPgSSLMode != "" {
		dsn += fmt.Sprintf(" sslmode=%s", dbPgSSLMode)
	}
	if dbPgSSLCert != "" {
		dsn += fmt.Sprintf(" sslrootcert=%s", dbPgSSLCert)
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: observability.NewGormLogger("postgres")})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	// SetMaxIdleConns sets the maximum number of connections in the idle connection pool.
	sqlDB.SetMaxIdleConns(10)

	// SetMaxOpenConns sets the maximum number of open connections to the database.
	sqlDB.SetMaxOpenConns(100)

	// SetConnMaxLifetime sets the maximum amount of time a connection may be reused.
	sqlDB.SetConnMaxLifetime(time.Hour)

	return db, nil
}

func MigrateWithParams(path string, host string, port string, database string, user string, password string, sslmode string, sslcert string) {
	slog.Info("migrating postgres database")
	conn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?", user, url.QueryEscape(password), host, port, database)
	if sslmode != "" {
		conn += fmt.Sprintf("&sslmode=%s", sslmode)
	}
	if sslcert != "" {
		conn += fmt.Sprintf("&sslrootcert=%s", url.QueryEscape(sslcert))
	}
	m, err := migrate.New(
		path,
		conn,
	)
	if err != nil {
		slog.Error("failed to initialize migrations", slog.Any("error", err))
		os.Exit(1)
	}
	if err := m.Up(); err != nil {
		if err.Error() == "no change" {
			slog.Info("no migration changes to apply")
		} else {
			slog.Error("failed to apply migrations", slog.Any("error", err))
			os.Exit(1)
		}
	}
}

func MigrateWithEnvDefault() {
	MigrateWithParams("file://scripts/init-sql/migrations", dbPgHost, dbPgPort, dbPgDatabase, dbPgUser, dbPgPassword, dbPgSSLMode, dbPgSSLCert)
}
