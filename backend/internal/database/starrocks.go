package database

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	gomysql "github.com/go-sql-driver/mysql"
	_ "github.com/joho/godotenv/autoload"
)

var (
	dbHost     = os.Getenv("DB_HOST")
	dbPort     = os.Getenv("DB_PORT")
	dbName     = os.Getenv("DB_NAME")
	dbUserName = os.Getenv("DB_USERNAME")
	dbPassword = os.Getenv("DB_PASSWORD")
)

// registerStarrocksTLS reads the CA bundle at caPath, registers a TLS config
// named configName with the mysql driver (verifying against serverName), and
// returns the DSN tls param ("&tls=<configName>"). An empty caPath is a no-op
// and returns ("", nil) — TLS stays disabled.
func registerStarrocksTLS(caPath, configName, serverName string) (string, error) {
	if caPath == "" {
		return "", nil
	}
	pem, err := os.ReadFile(caPath)
	if err != nil {
		return "", fmt.Errorf("read DB_SSL_CA: %w", err)
	}
	pool := x509.NewCertPool()
	if !pool.AppendCertsFromPEM(pem) {
		return "", fmt.Errorf("parse DB_SSL_CA: no certs found in %s", caPath)
	}
	if err := gomysql.RegisterTLSConfig(configName, &tls.Config{
		RootCAs:    pool,
		ServerName: serverName,
	}); err != nil {
		return "", fmt.Errorf("register TLS config: %w", err)
	}
	return "&tls=" + configName, nil
}

func NewStarrocksDB() (*gorm.DB, error) {
	if dbHost == "" {
		return nil, fmt.Errorf("DB_HOST is not set")
	}
	tlsParam, err := registerStarrocksTLS(os.Getenv("DB_SSL_CA"), "starrocks", dbHost)
	if err != nil {
		return nil, err
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?interpolateParams=true&parseTime=true%s",
		dbUserName, dbPassword, dbHost, dbPort, dbName, tlsParam)
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
