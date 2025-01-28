package database

import (
	"fmt"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/joho/godotenv/autoload"
)

var (
	dbHost     = os.Getenv("DB_HOST")
	dbPort     = os.Getenv("DB_PORT")
	dbName     = os.Getenv("DB_NAME")
	dbUserName = os.Getenv("DB_USERNAME")
	dbPassword = os.Getenv("DB_PASSWORD")
)

func NewStarrocksDB() (*gorm.DB, error) {
	if dbHost == "" {
		return nil, fmt.Errorf("DB_HOST is not set")
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?interpolateParams=true",
		dbUserName, dbPassword, dbHost, dbPort, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
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
