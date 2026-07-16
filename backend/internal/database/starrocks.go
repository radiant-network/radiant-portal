package database

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	gomysql "github.com/go-sql-driver/mysql"
	_ "github.com/joho/godotenv/autoload"
	"github.com/radiant-network/radiant-api/internal/observability"
)

var (
	dbHost      = os.Getenv("DB_HOST")
	dbPort      = os.Getenv("DB_PORT")
	dbName      = os.Getenv("DB_NAME")
	dbUserName  = os.Getenv("DB_USERNAME")
	dbPassword  = os.Getenv("DB_PASSWORD")
	dbSSLCA     = os.Getenv("DB_SSL_CA")
	dbSSLMode   = os.Getenv("DB_SSL_MODE")
	dbProxyAddr = os.Getenv("STARROCKS_PROXY_ADDR")
)

// registerStarrocksTLS reads the CA bundle at caPath, registers a TLS config
// named configName with the mysql driver (verifying against serverName), and
// returns the DSN tls param ("&tls=<configName>"). An empty caPath is a no-op
// and returns ("", nil) — TLS stays disabled.
func registerStarrocksTLS(caPath, configName, serverName string) (string, error) {
	if caPath == "" {
		return "", nil
	}
	pem, err := os.ReadFile(caPath) //nolint:gosec // G304: caPath is the operator-configured DB_SSL_CA path, not attacker-controlled input.
	if err != nil {
		return "", fmt.Errorf("read DB_SSL_CA: %w", err)
	}
	pool := x509.NewCertPool()
	if !pool.AppendCertsFromPEM(pem) {
		return "", fmt.Errorf("parse DB_SSL_CA: no certs found in %s", caPath)
	}
	if err := gomysql.RegisterTLSConfig(configName, &tls.Config{
		MinVersion: tls.VersionTLS12,
		RootCAs:    pool,
		ServerName: serverName,
	}); err != nil {
		return "", fmt.Errorf("register TLS config: %w", err)
	}
	return "&tls=" + configName, nil
}

// starrocksTLSParam resolves the DSN tls parameter from the SSL config. A CA bundle
// (caPath) registers a verifying TLS config named configName and takes precedence.
// Otherwise sslMode is passed to the mysql driver verbatim — it accepts "skip-verify",
// "preferred", and "true"; "", "false", and "disable" mean plaintext.
func starrocksTLSParam(caPath, sslMode, configName, serverName string) (string, error) {
	if caPath != "" {
		return registerStarrocksTLS(caPath, configName, serverName)
	}
	switch sslMode {
	case "", "false", "disable":
		return "", nil
	default:
		return "&tls=" + sslMode, nil
	}
}

func NewStarrocksDB() (*gorm.DB, error) {
	if dbHost == "" {
		return nil, fmt.Errorf("DB_HOST is not set")
	}
	tlsParam, err := starrocksTLSParam(dbSSLCA, dbSSLMode, "starrocks", dbHost)
	if err != nil {
		return nil, err
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?interpolateParams=true&parseTime=true%s",
		dbUserName, dbPassword, dbHost, dbPort, dbName, tlsParam)

	// The root pool (native auth) is the fallback. It is wrapped in routingConnPool so a request
	// carrying a per-user pool in its context (mysql-proxy path) runs as that user instead —
	// repositories are unaffected either way.
	root, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	root.SetMaxIdleConns(10)
	root.SetMaxOpenConns(100)
	root.SetConnMaxLifetime(time.Hour)

	db, err := gorm.Open(
		mysql.New(mysql.Config{Conn: &routingConnPool{root: root}}),
		&gorm.Config{Logger: observability.NewGormLogger("starrocks")},
	)
	if err != nil {
		return nil, err
	}
	return db, nil
}

// NewStarrocksUserPool opens a per-request StarRocks pool that authenticates as the end user
// through mysql-proxy: the user's Keycloak sub is the MySQL username and the raw JWT is the
// password. The proxy advertises mysql_clear_password (hence AllowCleartextPasswords) and
// translates it into the TLS + authentication_openid_connect_client handshake StarRocks expects,
// so every query runs as that user and Ranger applies per-user masking / row-filter / access. The
// client↔proxy hop is plaintext by design (the proxy runs on a trusted host), so no TLS param.
//
// defaultDB is the connection's default schema (e.g. "<tenant>_tenant"), forwarded via
// CLIENT_CONNECT_WITH_DB — StarRocks checks database access at login, which is the real tenant
// gate (Ranger access is inert on the views themselves, #72910). The returned pool is bound to
// the request context (ContextWithUserPool) and closed when the request completes.
func NewStarrocksUserPool(sub, jwt, defaultDB string) (*sql.DB, error) {
	if dbProxyAddr == "" {
		return nil, fmt.Errorf("STARROCKS_PROXY_ADDR is not set")
	}
	cfg := gomysql.NewConfig()
	cfg.User = sub
	cfg.Passwd = jwt
	cfg.Net = "tcp"
	cfg.Addr = dbProxyAddr
	cfg.DBName = defaultDB
	cfg.AllowCleartextPasswords = true
	cfg.InterpolateParams = true
	cfg.ParseTime = true

	pool, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		return nil, err
	}
	pool.SetMaxOpenConns(2)
	pool.SetConnMaxLifetime(5 * time.Minute)
	return pool, nil
}
