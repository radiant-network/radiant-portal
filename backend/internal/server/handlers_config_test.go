package server

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
)

func Test_ClientConfigFromEnv_Defaults(t *testing.T) {
	t.Setenv(keycloakHostEnv, "http://keycloak:8081")
	t.Setenv(keycloakRealmEnv, "radiant")
	t.Setenv(keycloakPublicURLEnv, "")
	t.Setenv(keycloakCliClientIDEnv, "")

	cfg := ClientConfigFromEnv()

	assert.Equal(t, types.ClientConfig{Auth: types.ClientAuthConfig{
		Method:      "device",
		KeycloakURL: "http://keycloak:8081",
		Realm:       "radiant",
		ClientID:    "radiant-client-cli",
	}}, cfg)
}

func Test_ClientConfigFromEnv_PublicURLOverridesHost(t *testing.T) {
	t.Setenv(keycloakHostEnv, "http://keycloak.svc:8080")
	t.Setenv(keycloakPublicURLEnv, "https://auth.example.org")
	t.Setenv(keycloakRealmEnv, "qlin")
	t.Setenv(keycloakCliClientIDEnv, "custom-cli")

	cfg := ClientConfigFromEnv()

	assert.Equal(t, "https://auth.example.org", cfg.Auth.KeycloakURL)
	assert.Equal(t, "qlin", cfg.Auth.Realm)
	assert.Equal(t, "custom-cli", cfg.Auth.ClientID)
}

func Test_ClientConfigFromEnv_MissingEnvGivesEmptyValues(t *testing.T) {
	t.Setenv(keycloakHostEnv, "")
	t.Setenv(keycloakPublicURLEnv, "")
	t.Setenv(keycloakRealmEnv, "")

	cfg := ClientConfigFromEnv()

	assert.Equal(t, "", cfg.Auth.KeycloakURL)
	assert.Equal(t, "", cfg.Auth.Realm)
	assert.Equal(t, "radiant-client-cli", cfg.Auth.ClientID)
}

func Test_GetClientConfigHandler_Success(t *testing.T) {
	cfg := types.ClientConfig{Auth: types.ClientAuthConfig{
		Method:      "device",
		KeycloakURL: "https://auth.example.org",
		Realm:       "qlin",
		ClientID:    "radiant-client-cli",
	}}
	router := gin.Default()
	router.GET("/config", GetClientConfigHandler(cfg))

	req, _ := http.NewRequest("GET", "/config", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, `{"auth": {"method": "device", "keycloak_url": "https://auth.example.org", "realm": "qlin", "client_id": "radiant-client-cli"}}`, w.Body.String())
}
