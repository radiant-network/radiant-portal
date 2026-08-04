package database

import (
	"fmt"
	"strings"

	"github.com/radiant-network/radiant-api/internal/utils"
)

// requireDBTLSEnv gates the startup TLS assertion. It is off by default so local
// development is unaffected; production manifests should set it to true.
const requireDBTLSEnv = "REQUIRE_DB_TLS"

// AssertTLSRequirement fails fast when REQUIRE_DB_TLS is set but the StarRocks or
// PostgreSQL connection would not be encrypted. It reads the same package-level
// env vars the connection helpers use (DB_SSL_CA, DB_SSL_MODE, PGSSLMODE) and must
// be called before any database connection is opened (including migrations).
// When the gate is unset/false it is a no-op and returns nil.
func AssertTLSRequirement() error {
	if !utils.GetBoolEnvOrDefault(requireDBTLSEnv, false) {
		return nil
	}
	return tlsRequirementError(dbSSLCA, dbSSLMode, dbPgSSLMode)
}

// tlsRequirementError reports every database whose configuration would permit a
// plaintext connection, aggregated into a single error so an operator sees all the
// problems to fix at once. It returns nil when both connections are guaranteed encrypted.
func tlsRequirementError(starrocksCA, starrocksMode, pgSSLMode string) error {
	var problems []string
	if !starrocksTLSSecure(starrocksCA, starrocksMode) {
		problems = append(problems, "StarRocks: set DB_SSL_CA (recommended) or DB_SSL_MODE to true/skip-verify")
	}
	if !postgresTLSSecure(pgSSLMode) {
		problems = append(problems, "Postgres: set PGSSLMODE to require, verify-ca, or verify-full")
	}
	if len(problems) == 0 {
		return nil
	}
	return fmt.Errorf("%s is set but database TLS is not configured: %s", requireDBTLSEnv, strings.Join(problems, "; "))
}

// starrocksTLSSecure reports whether the StarRocks connection is guaranteed to be
// encrypted. A CA bundle (caPath) enables verified TLS; the "true" and "skip-verify"
// modes also force TLS. The plaintext modes ("", "false", "disable") and "preferred"
// (which silently falls back to plaintext when the server doesn't offer TLS) are insecure.
func starrocksTLSSecure(caPath, sslMode string) bool {
	if caPath != "" {
		return true
	}
	switch sslMode {
	case "true", "skip-verify":
		return true
	default:
		return false
	}
}

// postgresTLSSecure reports whether the PostgreSQL connection is guaranteed to be
// encrypted. Only require, verify-ca, and verify-full enforce TLS; the default (unset),
// disable, allow, and prefer all permit a plaintext fallback.
func postgresTLSSecure(sslMode string) bool {
	switch sslMode {
	case "require", "verify-ca", "verify-full":
		return true
	default:
		return false
	}
}
