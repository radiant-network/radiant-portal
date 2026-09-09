package server

import (
	"encoding/json"
	"testing"

	cliconfig "github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// The CLI keeps its own copy of the /config shape (it must not import internal/types). This
// pins the two together so a field rename on either side fails here.
func Test_ClientConfig_MatchesCLIContract(t *testing.T) {
	server := types.ClientConfig{Auth: types.ClientAuthConfig{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "radiant-client-cli"}}
	serverJSON, err := json.Marshal(server)
	require.NoError(t, err)

	var cli cliconfig.ClientConfig
	require.NoError(t, json.Unmarshal(serverJSON, &cli))
	assert.Equal(t, cliconfig.Auth{Method: "device", KeycloakURL: "https://auth", Realm: "qlin", ClientID: "radiant-client-cli"}, cli.Auth)

	cliJSON, err := json.Marshal(cli)
	require.NoError(t, err)
	assert.JSONEq(t, string(serverJSON), string(cliJSON))
}
