package database

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_starrocksTLSSecure_CASet_Secure(t *testing.T) {
	assert.True(t, starrocksTLSSecure("/etc/ssl/ca.pem", ""))
}

func Test_starrocksTLSSecure_TrueMode_Secure(t *testing.T) {
	assert.True(t, starrocksTLSSecure("", "true"))
}

func Test_starrocksTLSSecure_SkipVerifyMode_Secure(t *testing.T) {
	assert.True(t, starrocksTLSSecure("", "skip-verify"))
}

func Test_starrocksTLSSecure_EmptyMode_Insecure(t *testing.T) {
	assert.False(t, starrocksTLSSecure("", ""))
}

func Test_starrocksTLSSecure_FalseMode_Insecure(t *testing.T) {
	assert.False(t, starrocksTLSSecure("", "false"))
}

func Test_starrocksTLSSecure_DisableMode_Insecure(t *testing.T) {
	assert.False(t, starrocksTLSSecure("", "disable"))
}

func Test_starrocksTLSSecure_PreferredMode_Insecure(t *testing.T) {
	assert.False(t, starrocksTLSSecure("", "preferred"))
}

func Test_postgresTLSSecure_Require_Secure(t *testing.T) {
	assert.True(t, postgresTLSSecure("require"))
}

func Test_postgresTLSSecure_VerifyCA_Secure(t *testing.T) {
	assert.True(t, postgresTLSSecure("verify-ca"))
}

func Test_postgresTLSSecure_VerifyFull_Secure(t *testing.T) {
	assert.True(t, postgresTLSSecure("verify-full"))
}

func Test_postgresTLSSecure_Empty_Insecure(t *testing.T) {
	assert.False(t, postgresTLSSecure(""))
}

func Test_postgresTLSSecure_Disable_Insecure(t *testing.T) {
	assert.False(t, postgresTLSSecure("disable"))
}

func Test_postgresTLSSecure_Allow_Insecure(t *testing.T) {
	assert.False(t, postgresTLSSecure("allow"))
}

func Test_postgresTLSSecure_Prefer_Insecure(t *testing.T) {
	assert.False(t, postgresTLSSecure("prefer"))
}

func Test_tlsRequirementError_BothSecure_NoError(t *testing.T) {
	assert.NoError(t, tlsRequirementError("/etc/ssl/ca.pem", "", "require"))
}

func Test_tlsRequirementError_StarrocksInsecure_MentionsStarrocksOnly(t *testing.T) {
	err := tlsRequirementError("", "disable", "require")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "StarRocks")
	assert.NotContains(t, err.Error(), "Postgres")
}

func Test_tlsRequirementError_PostgresInsecure_MentionsPostgresOnly(t *testing.T) {
	err := tlsRequirementError("/etc/ssl/ca.pem", "", "disable")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "Postgres")
	assert.NotContains(t, err.Error(), "StarRocks")
}

func Test_tlsRequirementError_BothInsecure_MentionsBoth(t *testing.T) {
	err := tlsRequirementError("", "", "")
	require.Error(t, err)
	assert.Contains(t, err.Error(), "StarRocks")
	assert.Contains(t, err.Error(), "Postgres")
	assert.Contains(t, err.Error(), requireDBTLSEnv)
}
