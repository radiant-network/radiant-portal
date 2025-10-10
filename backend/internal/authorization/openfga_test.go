package authorization

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

const VALID_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvbiBEb2UiLCJhZG1pbiI6dHJ1ZX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
const INVALID_JWT = "invalid.token.here"

func Test_OpenFGAAuthrizer_parseJWT_Valid(t *testing.T) {
	claims, err := parseJWT(VALID_JWT)
	assert.Nil(t, err)
	assert.Equal(t, "1234567890", claims["sub"].(string))
	assert.Equal(t, "Jon Doe", claims["name"].(string))
	assert.Equal(t, true, claims["admin"].(bool))
}

func Test_OpenFGAAuthrizer_parseJWT_Invalid(t *testing.T) {
	claims, err := parseJWT(INVALID_JWT)
	assert.NotNil(t, err)
	assert.Empty(t, claims)
}
