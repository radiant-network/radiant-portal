package testutils

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

type MockAuth struct{}

func (mockAut *MockAuth) RetrieveUserIdFromToken(_ *gin.Context) (*string, error) {
	result := "1"
	return &result, nil
}

type MockAuthUserPreferences struct{}

func (mockAut *MockAuthUserPreferences) RetrieveUserIdFromToken(c *gin.Context) (*string, error) {
	result := "b3a74785-b0a9-4a45-879e-f13c476976f7"
	return &result, nil
}

func GenerateJWT() (string, error) {
	claims := jwt.MapClaims{
		"jti":             "abc123",
		"exp":             0,
		"nbf":             0,
		"iat":             0,
		"iss":             "test-issuer",
		"sub":             "test-subject",
		"typ":             "test-type",
		"azp":             "radiant",
		"nonce":           "test-nonce",
		"auth_time":       0,
		"session_state":   "test-session",
		"acr":             "test-acr",
		"client_session":  "test-client-session",
		"allowed_origins": nil,
		"resource_access": map[string]map[string][]string{
			"radiant": {
				"roles": []string{"data_manager"},
			},
			"CBTN": {
				"roles": []string{"geneticist"},
			},
			"UDN": {
				"roles": []string{"requester"},
			},
		},
		"name":               "Bob",
		"preferred_username": "superbob",
		"given_name":         "Bob",
		"family_name":        "Bobson",
		"email":              "bob@bobson.com",
		"realm_access":       ginkeycloak.ServiceRole{},
		"custom_claims":      nil,
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return jwtToken.SignedString([]byte("super-secret"))
}
