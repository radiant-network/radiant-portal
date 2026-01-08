package jwt

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func GenerateMockJWT(azp string, roles []string) (string, error) {
	claims := jwt.MapClaims{
		"jti":             "abc123",
		"exp":             0,
		"nbf":             0,
		"iat":             0,
		"iss":             "test-issuer",
		"sub":             "test-subject",
		"typ":             "test-type",
		"azp":             azp,
		"nonce":           "test-nonce",
		"auth_time":       0,
		"session_state":   "test-session",
		"acr":             "test-acr",
		"client_session":  "test-client-session",
		"allowed_origins": nil,
		"resource_access": map[string]map[string][]string{
			"radiant": {
				"roles": roles,
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
