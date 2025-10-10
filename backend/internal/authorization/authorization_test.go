package authorization

import (
	"os"
	"reflect"
	"runtime"
	"testing"

	"github.com/stretchr/testify/assert"
)

func extractMethodName(fn interface{}) string {
	// For testing purposes, because `InitAuthorizer` returns a `gin.HandlerFunc` (function type),
	// we need to use reflection to get the function name and do validation on it.
	fnValue := reflect.ValueOf(fn)
	if fnValue.Kind() != reflect.Func {
		return ""
	}
	fnPtr := fnValue.Pointer()
	name := runtime.FuncForPC(fnPtr).Name()
	return name
}

func Test_InitAuthorizer_FromEnvVarConfiguration(t *testing.T) {
	err := os.Setenv("RADIANT_AUTHORIZATION_PROVIDER", "keycloak")
	assert.Nil(t, err)
	auth, err := InitAuthorizer()
	assert.Nil(t, err)
	assert.Contains(t, extractMethodName(auth), "github.com/tbaehler/gin-keycloak/pkg/ginkeycloak")

	err = os.Setenv("RADIANT_AUTHORIZATION_PROVIDER", "openfga")
	assert.Nil(t, err)
	auth, err = InitAuthorizer()
	// We are only testing that NewOpenFGAAuthorizer was called, not that it succeeded
	assert.Equal(t, "openfga: invalid endpoint: ", err.Error())

	err = os.Setenv("RADIANT_AUTHORIZATION_PROVIDER", "unknown")
	assert.Nil(t, err)
	auth, err = InitAuthorizer()
	assert.Nil(t, err)
	assert.NotNil(t, auth)
	assert.Contains(t, extractMethodName(auth), "github.com/tbaehler/gin-keycloak/pkg/ginkeycloak")

	err = os.Unsetenv("RADIANT_AUTHORIZATION_PROVIDER")
	assert.Nil(t, err)
	auth, err = InitAuthorizer()
	assert.Nil(t, err)
	assert.NotNil(t, auth)
	assert.Contains(t, extractMethodName(auth), "github.com/tbaehler/gin-keycloak/pkg/ginkeycloak")
}
