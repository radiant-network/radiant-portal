package authorization

import (
	"net/http"
	"testing"

	"github.com/golang-jwt/jwt/v5"
	. "github.com/openfga/go-sdk/client"
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

func Test_ExtractRelation_VariableOnly(t *testing.T) {
	req, _ := http.NewRequest("GET", "/:seq_id", nil)
	expected := "get__seq_id"
	result := extractRelation(req, req.URL.Path)
	assert.Equal(t, expected, result)
}

func Test_ExtractRelation_SimplePath(t *testing.T) {
	req, _ := http.NewRequest("GET", "/variants/germline/cases/uninterpreted", nil)
	expected := "get__variants_germline_cases_uninterpreted"
	result := extractRelation(req, req.URL.Path)
	assert.Equal(t, expected, result)
}

func Test_ExtractRelation_PathWithVariable(t *testing.T) {
	req, _ := http.NewRequest("DELETE", "/variants/germline/:locus_id/cases/uninterpreted", nil)
	expected := "delete__variants_germline_locus_id_cases_uninterpreted"
	result := extractRelation(req, req.URL.Path)
	assert.Equal(t, expected, result)
}

func Test_ExtractContextualTuples_ValidClaimsWithRoles(t *testing.T) {
	jwtClaims := jwt.MapClaims{
		"sub": "user123",
		"azp": "client123",
		"resource_access": map[string]interface{}{
			"projectA": map[string]interface{}{
				"roles": []interface{}{"admin", "editor"},
			},
			"projectB": map[string]interface{}{
				"roles": []interface{}{"viewer"},
			},
		},
	}
	expected := []ClientContextualTupleKey{
		{Object: "project:projectA", Relation: "admin", User: "user:user123"},
		{Object: "project:projectA", Relation: "editor", User: "user:user123"},
		{Object: "project:projectB", Relation: "viewer", User: "user:user123"},
	}
	result := extractContextualTuplesFromToken("user123", "client123", jwtClaims)
	assert.ElementsMatch(t, expected, result)
}

func Test_ExtractContextualTuples_MissingResourceAccessClaim(t *testing.T) {
	jwtClaims := jwt.MapClaims{}
	result := extractContextualTuplesFromToken("user123", "client123", jwtClaims)
	assert.Empty(t, result)
}

func Test_ExtractContextualTuples_EmptyRoles(t *testing.T) {
	jwtClaims := jwt.MapClaims{
		"resource_access": map[string]interface{}{
			"projectA": map[string]interface{}{
				"roles": []interface{}{},
			},
		},
	}
	result := extractContextualTuplesFromToken("user123", "client123", jwtClaims)
	assert.Empty(t, result)
}

func Test_ExtractContextualTuples_SkipAccountResource(t *testing.T) {
	jwtClaims := jwt.MapClaims{
		"resource_access": map[string]interface{}{
			"account": map[string]interface{}{
				"roles": []interface{}{"user"},
			},
			"projectA": map[string]interface{}{
				"roles": []interface{}{"admin"},
			},
		},
	}
	expected := []ClientContextualTupleKey{
		{Object: "project:projectA", Relation: "admin", User: "user:user123"},
	}
	result := extractContextualTuplesFromToken("user123", "client123", jwtClaims)
	assert.ElementsMatch(t, expected, result)
}
