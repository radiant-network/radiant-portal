package authorization

import (
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

func Test_InitAuthorizer_ReturnsKeycloakMiddleware(t *testing.T) {
	auth, err := InitAuthorizer()
	assert.Nil(t, err)
	assert.NotNil(t, auth)
	// The middleware is ginkeycloak's auth chain (ginkeycloak.Auth → authChain). Inlining roots the
	// closure name in this package, so we match the stable ginkeycloak symbol rather than its import path.
	assert.Contains(t, extractMethodName(auth), "authChain")
}
