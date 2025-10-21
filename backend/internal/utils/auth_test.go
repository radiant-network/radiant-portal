package utils

import (
	"fmt"
	"net/http"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/radiant-network/radiant-api/test/testutils/jwt"
	"github.com/stretchr/testify/assert"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func Test_RetrieveUserIdFromToken_ValidKeycloakToken(t *testing.T) {
	c := gin.Context{}
	c.Set("token", ginkeycloak.KeyCloakToken{Sub: "user123"})

	auth := KeycloakAuth{}
	userId, err := auth.RetrieveUserIdFromToken(&c)

	assert.NoError(t, err)
	assert.NotNil(t, userId)
	assert.Equal(t, "user123", *userId)
}

func Test_RetrieveUserIdFromToken_ValidJWT(t *testing.T) {
	c := gin.Context{}

	token, err := jwt.GenerateMockJWT()
	assert.NoError(t, err)

	c.Request = &http.Request{
		Header: http.Header{
			"Authorization": []string{fmt.Sprintf("Bearer %s", token)},
		},
	}

	auth := KeycloakAuth{}
	userId, err := auth.RetrieveUserIdFromToken(&c)

	assert.NoError(t, err)
	assert.NotNil(t, userId)
	assert.Equal(t, "test-subject", *userId)
}

func Test_RetrieveUserIdFromToken_InvalidKeycloakTokenType(t *testing.T) {
	c := gin.Context{}
	c.Set("token", "invalidTokenType")

	auth := KeycloakAuth{}
	userId, err := auth.RetrieveUserIdFromToken(&c)

	assert.Error(t, err)
	assert.Nil(t, userId)
}

func Test_RetrieveUserIdFromToken_NoTokenInContext(t *testing.T) {
	c := gin.Context{
		Request: &http.Request{},
	}

	auth := KeycloakAuth{}
	azp, err := auth.RetrieveUserIdFromToken(&c)

	assert.Error(t, err)
	assert.Nil(t, azp)
}

func Test_RetrieveAzpFromToken_ValidKeycloakToken(t *testing.T) {
	c := gin.Context{}
	c.Set("token", ginkeycloak.KeyCloakToken{Azp: "client123"})

	auth := KeycloakAuth{}
	azp, err := auth.RetrieveAzpFromToken(&c)

	assert.NoError(t, err)
	assert.NotNil(t, azp)
	assert.Equal(t, "client123", *azp)
}

func Test_RetrieveAzpFromToken_ValidJWT(t *testing.T) {
	c := gin.Context{}

	token, err := jwt.GenerateMockJWT()
	assert.NoError(t, err)

	c.Request = &http.Request{
		Header: http.Header{
			"Authorization": []string{fmt.Sprintf("Bearer %s", token)},
		},
	}

	auth := KeycloakAuth{}
	azp, err := auth.RetrieveAzpFromToken(&c)

	assert.NoError(t, err)
	assert.NotNil(t, azp)
	assert.Equal(t, "radiant", *azp)
}

func Test_RetrieveAzpFromToken_NoTokenInContext(t *testing.T) {
	c := gin.Context{
		Request: &http.Request{},
	}

	auth := KeycloakAuth{}
	azp, err := auth.RetrieveAzpFromToken(&c)

	assert.Error(t, err)
	assert.Nil(t, azp)
}

func Test_RetrieveResourceAccessFromToken_ValidKeycloakToken(t *testing.T) {
	resourceAccess := map[string]ginkeycloak.ServiceRole{"service": {}}
	c := gin.Context{}
	c.Set("token", ginkeycloak.KeyCloakToken{ResourceAccess: resourceAccess})

	auth := KeycloakAuth{}
	access, err := auth.RetrieveResourceAccessFromToken(&c)

	assert.NoError(t, err)
	assert.NotNil(t, access)
	assert.Equal(t, resourceAccess, *access)
}

func Test_RetrieveResourceAccessFromToken_InvalidKeycloakToken(t *testing.T) {
	c := gin.Context{}
	c.Set("token", "invalidToken")

	auth := KeycloakAuth{}
	access, err := auth.RetrieveResourceAccessFromToken(&c)

	assert.Error(t, err)
	assert.Nil(t, access)
}

func Test_RetrieveResourceAccessFromToken_ValidJWT(t *testing.T) {
	c := gin.Context{}

	token, err := jwt.GenerateMockJWT()
	assert.NoError(t, err)

	c.Request = &http.Request{
		Header: http.Header{
			"Authorization": []string{fmt.Sprintf("Bearer %s", token)},
		},
	}

	auth := KeycloakAuth{}
	resAcc, err := auth.RetrieveResourceAccessFromToken(&c)

	assert.NoError(t, err)
	assert.NotNil(t, resAcc)
	assert.Equal(t, map[string]ginkeycloak.ServiceRole{
		"CBTN":    {Roles: []string{"geneticist"}},
		"UDN":     {Roles: []string{"requester"}},
		"radiant": {Roles: []string{"data_manager"}},
	}, *resAcc)
}

func Test_ParseJWTFromHeader_ValidJWT(t *testing.T) {
	c := gin.Context{}

	token, err := jwt.GenerateMockJWT()
	assert.NoError(t, err)

	c.Request = &http.Request{
		Header: http.Header{
			"Authorization": []string{fmt.Sprintf("Bearer %s", token)},
		},
	}

	_, err = parseJWTFromHeader(&c)

	assert.NoError(t, err)

	kc, ok := c.Get("token")
	assert.True(t, ok)
	assert.NotNil(t, kc)
}

func Test_ParseJWTFromHeader_InvalidFormat(t *testing.T) {
	c := gin.Context{}
	c.Request = &http.Request{
		Header: http.Header{
			"Authorization": []string{"InvalidHeader"},
		},
	}

	token, err := parseJWTFromHeader(&c)

	assert.Error(t, err)
	assert.Nil(t, token)
}
