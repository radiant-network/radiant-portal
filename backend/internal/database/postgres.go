package database

import (
	"fmt"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/joho/godotenv/autoload"
)

var (
	dbPgUser     = os.Getenv("PGUSER")
	dbPgPassword = os.Getenv("PGPASSWORD")
	dbPgPort     = os.Getenv("PGPORT")
	dbPgHost 	 = os.Getenv("PGHOST")
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
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
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
