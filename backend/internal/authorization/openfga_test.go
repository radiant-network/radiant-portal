package authorization

import (
	"net/http"
	"testing"

	. "github.com/openfga/go-sdk/client"
	"github.com/stretchr/testify/assert"
	"github.com/tbaehler/gin-keycloak/pkg/ginkeycloak"
)

func Test_ExtractRelation_Reader(t *testing.T) {
	req, _ := http.NewRequest("GET", "/sequencing/:seq_id", nil)
	expected := "sequencing_reader"
	result, err := extractRelation(req, req.URL.Path)
	assert.Nil(t, err)
	assert.Equal(t, expected, result)
}

func Test_ExtractRelation_Writer(t *testing.T) {
	for _, verb := range []string{"POST", "PUT", "PATCH", "DELETE"} {
		req, _ := http.NewRequest(verb, "/variants/germline/cases/uninterpreted", nil)
		expected := "variants_writer"
		result, err := extractRelation(req, req.URL.Path)
		assert.Nil(t, err)
		assert.Equal(t, expected, result)
	}
}

func Test_ExtractRelation_Other(t *testing.T) {
	req, _ := http.NewRequest("HEAD", "/variants/germline/:locus_id/cases/uninterpreted", nil)
	expected := ""
	result, err := extractRelation(req, req.URL.Path)
	assert.NotNil(t, err)
	assert.Equal(t, expected, result)
}

func Test_ExtractContextualTuples_ValidClaimsWithRoles(t *testing.T) {
	res := map[string]ginkeycloak.ServiceRole{
		"projectA": {
			Roles: []string{"admin", "editor"},
		},
		"projectB": {
			Roles: []string{"viewer"},
		},
	}
	expected := []ClientContextualTupleKey{
		{Object: "project:projectA", Relation: "admin", User: "user:user123"},
		{Object: "project:projectA", Relation: "editor", User: "user:user123"},
		{Object: "project:projectB", Relation: "viewer", User: "user:user123"},
	}
	result := extractContextualTuples("user123", "client123", res)
	assert.ElementsMatch(t, expected, result)
}

func Test_ExtractContextualTuples_MissingResourceAccessClaim(t *testing.T) {
	res := map[string]ginkeycloak.ServiceRole{}
	result := extractContextualTuples("user123", "client123", res)
	assert.Empty(t, result)
}

func Test_ExtractContextualTuples_EmptyRoles(t *testing.T) {
	res := map[string]ginkeycloak.ServiceRole{
		"projectA": {
			Roles: []string{},
		},
	}
	result := extractContextualTuples("user123", "client123", res)
	assert.Empty(t, result)
}

func Test_ExtractContextualTuples_SkipAccountResource(t *testing.T) {
	res := map[string]ginkeycloak.ServiceRole{
		"projectA": {
			Roles: []string{"admin"},
		},
	}
	expected := []ClientContextualTupleKey{
		{Object: "project:projectA", Relation: "admin", User: "user:user123"},
	}
	result := extractContextualTuples("user123", "client123", res)
	assert.ElementsMatch(t, expected, result)
}
