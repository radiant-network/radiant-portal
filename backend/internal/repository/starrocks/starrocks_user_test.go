package starrocks

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var testJWTConfig = StarrocksJWTConfig{
	JwksURL:          "http://keycloak:8080/realms/CQDG/protocol/openid-connect/certs",
	RequiredIssuer:   "http://localhost:8080/realms/CQDG",
	RequiredAudience: "radiant",
}

func Test_buildCreateJWTUserStmt_UsesSubAsPrincipalAndUsername(t *testing.T) {
	sub := "11111111-2222-3333-4444-555555555555"

	stmt, err := buildCreateJWTUserStmt(sub, testJWTConfig)

	require.NoError(t, err)
	assert.Contains(t, stmt, "CREATE USER IF NOT EXISTS '11111111-2222-3333-4444-555555555555'@'%'")
	assert.Contains(t, stmt, "IDENTIFIED WITH authentication_jwt")
	assert.Contains(t, stmt, `"principal_field":"sub"`)
	assert.Contains(t, stmt, `"required_audience":"radiant"`)
}

func Test_buildCreateJWTUserStmt_RejectsNonUUIDSub(t *testing.T) {
	_, err := buildCreateJWTUserStmt("alice", testJWTConfig)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "not a valid UUID")
}

func Test_buildCreateJWTUserStmt_RejectsEmptySub(t *testing.T) {
	_, err := buildCreateJWTUserStmt("", testJWTConfig)

	require.Error(t, err)
	assert.Contains(t, err.Error(), "not a valid UUID")
}
