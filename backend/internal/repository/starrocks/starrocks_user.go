package starrocks

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/google/uuid"
	"github.com/radiant-network/radiant-api/internal/database"
	"gorm.io/gorm"
)

// principalFieldSub is the JWT claim StarRocks uses as the username. We key on the
// immutable Keycloak `sub` (was preferred_username), so the StarRocks username,
// Postgres users.user_id, and Ranger user name are all the same id.
const principalFieldSub = "sub"

// StarrocksJWTConfig holds the authentication_jwt parameters baked into each user.
type StarrocksJWTConfig struct {
	JwksURL          string
	RequiredIssuer   string
	RequiredAudience string
}

// StarrocksJWTConfigFromEnv builds the JWT config from the environment.
func StarrocksJWTConfigFromEnv() StarrocksJWTConfig {
	return StarrocksJWTConfig{
		JwksURL:          os.Getenv("STARROCKS_JWT_JWKS_URL"),
		RequiredIssuer:   os.Getenv("STARROCKS_JWT_REQUIRED_ISSUER"),
		RequiredAudience: os.Getenv("STARROCKS_JWT_REQUIRED_AUDIENCE"),
	}
}

// StarrocksUserRepository creates JWT-authenticated StarRocks users over a GORM
// connection (the MySQL-protocol StarRocks DB).
type StarrocksUserRepository struct {
	db  *gorm.DB
	cfg StarrocksJWTConfig
}

func NewStarrocksUserRepository(db database.StarrocksDB, cfg StarrocksJWTConfig) *StarrocksUserRepository {
	return &StarrocksUserRepository{db: db.DB, cfg: cfg}
}

// EnsureJWTUser runs CREATE USER IF NOT EXISTS for the given sub with
// authentication_jwt (principal_field "sub"). Idempotent.
//
// The username can't be a bound parameter (it's DDL), so sub is validated as a
// UUID before being interpolated — this both matches the Keycloak id format and
// closes the door to injection when this path is later driven by the API.
func (p *StarrocksUserRepository) EnsureJWTUser(ctx context.Context, sub string) error {
	stmt, err := buildCreateJWTUserStmt(sub, p.cfg)
	if err != nil {
		return err
	}
	if err := p.db.WithContext(ctx).Exec(stmt).Error; err != nil {
		return fmt.Errorf("create starrocks user %q: %w", sub, err)
	}
	return nil
}

// buildCreateJWTUserStmt assembles the CREATE USER DDL for a JWT-authenticated user.
//
// The username can't be a bound parameter (it's DDL), so sub is validated as a
// UUID before being interpolated — this both matches the Keycloak id format and
// closes the door to injection when this path is later driven by the API. The
// auth JSON is machine-generated (no single quotes), so the SQL string is safe.
func buildCreateJWTUserStmt(sub string, cfg StarrocksJWTConfig) (string, error) {
	if _, err := uuid.Parse(sub); err != nil {
		return "", fmt.Errorf("sub %q is not a valid UUID: %w", sub, err)
	}
	authJSON, err := json.Marshal(map[string]string{
		"jwks_url":          cfg.JwksURL,
		"principal_field":   principalFieldSub,
		"required_issuer":   cfg.RequiredIssuer,
		"required_audience": cfg.RequiredAudience,
	})
	if err != nil {
		return "", err
	}
	return fmt.Sprintf(
		"CREATE USER IF NOT EXISTS '%s'@'%%' IDENTIFIED WITH authentication_jwt AS '%s'",
		sub, string(authJSON),
	), nil
}
