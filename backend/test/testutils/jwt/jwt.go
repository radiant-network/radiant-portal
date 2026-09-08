package jwt

import (
	"github.com/golang-jwt/jwt/v5"
)

// GenerateMockJWT builds a signed token shaped like a real Keycloak one. The API reads sub,
// azp, preferred_username and name; the other claims are kept so the parsing path is
// exercised against a token carrying more than it needs. No role claims: authorization is
// PostgreSQL-backed actions, and a role claim here would imply otherwise.
func GenerateMockJWT(azp string) (string, error) {
	claims := jwt.MapClaims{
		"jti":                "abc123",
		"exp":                0,
		"nbf":                0,
		"iat":                0,
		"iss":                "test-issuer",
		"sub":                "test-subject",
		"typ":                "test-type",
		"azp":                azp,
		"nonce":              "test-nonce",
		"auth_time":          0,
		"session_state":      "test-session",
		"acr":                "test-acr",
		"client_session":     "test-client-session",
		"allowed_origins":    nil,
		"name":               "Bob",
		"preferred_username": "superbob",
		"given_name":         "Bob",
		"family_name":        "Bobson",
		"email":              "bob@bobson.com",
		"custom_claims":      nil,
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return jwtToken.SignedString([]byte("super-secret"))
}
