package mysqlproxy

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// testJWT builds an unsigned token whose payload carries the given sub — enough for the
// proxy, which reads the claim and lets StarRocks do the verifying.
func testJWT(sub string) string {
	payload, _ := json.Marshal(map[string]string{"sub": sub})
	return "eyJhbGciOiJSUzI1NiJ9." + base64.RawURLEncoding.EncodeToString(payload) + ".sig"
}

type stubExchanger struct {
	token       string
	err         error
	gotUsername string
	gotPassword string
}

func (s *stubExchanger) PasswordGrant(_ context.Context, username, password string) (string, error) {
	s.gotUsername, s.gotPassword = username, password
	return s.token, s.err
}

func Test_SubjectFromJWT_ReadsSubClaim(t *testing.T) {
	sub, err := SubjectFromJWT(testJWT("6f9619ff-8b86-d011-b42d-00c04fc964ff"))
	require.NoError(t, err)
	assert.Equal(t, "6f9619ff-8b86-d011-b42d-00c04fc964ff", sub)
}

func Test_SubjectFromJWT_RejectsTokenWithoutSub(t *testing.T) {
	payload, _ := json.Marshal(map[string]string{"preferred_username": "alice"})
	token := "eyJhbGciOiJSUzI1NiJ9." + base64.RawURLEncoding.EncodeToString(payload) + ".sig"
	_, err := SubjectFromJWT(token)
	assert.ErrorContains(t, err, "no sub claim")
}

func Test_SubjectFromJWT_RejectsNonToken(t *testing.T) {
	_, err := SubjectFromJWT("not-a-token")
	assert.ErrorContains(t, err, "malformed token")
}

func Test_JWTPassthrough_ResolvesUsernameFromTheTokenNotTheClient(t *testing.T) {
	// The client may connect under any handle; the StarRocks user is always the token's sub.
	user, jwt, err := JWTPassthrough{}.Authenticate(context.Background(), "whatever", testJWT("sub-123"))
	require.NoError(t, err)
	assert.Equal(t, "sub-123", user)
	assert.Equal(t, testJWT("sub-123"), jwt)
}

func Test_JWTPassthrough_RejectsAPasswordThatIsNotAToken(t *testing.T) {
	_, _, err := JWTPassthrough{}.Authenticate(context.Background(), "alice", "hunter2")
	assert.ErrorIs(t, err, ErrAuth)
	assert.ErrorContains(t, err, "expected a JWT")
}

func Test_PasswordExchange_ExchangesCredentialsAndReturnsSub(t *testing.T) {
	stub := &stubExchanger{token: testJWT("sub-abc")}
	user, jwt, err := PasswordExchange{Tokens: stub}.Authenticate(context.Background(), "alice", "hunter2")
	require.NoError(t, err)
	assert.Equal(t, "sub-abc", user)
	assert.Equal(t, stub.token, jwt)
	assert.Equal(t, "alice", stub.gotUsername)
	assert.Equal(t, "hunter2", stub.gotPassword)
}

func Test_PasswordExchange_HidesTheProviderReasonFromTheClient(t *testing.T) {
	// The Keycloak body distinguishes "no such user" from "wrong password"; the client is
	// told neither, since this message is relayed into the MySQL ERR packet.
	stub := &stubExchanger{err: errors.New("HTTP 401: {\"error\":\"invalid_grant\"}")}
	_, _, err := PasswordExchange{Tokens: stub}.Authenticate(context.Background(), "alice", "wrong")
	assert.ErrorIs(t, err, ErrAuth)
	assert.Equal(t, "authentication failed: invalid username or password", err.Error())
	assert.NotContains(t, err.Error(), "invalid_grant")
}

func Test_PasswordExchange_RejectsEmptyPasswordWithoutCallingKeycloak(t *testing.T) {
	stub := &stubExchanger{token: testJWT("sub-abc")}
	_, _, err := PasswordExchange{Tokens: stub}.Authenticate(context.Background(), "alice", "")
	assert.ErrorIs(t, err, ErrAuth)
	assert.Empty(t, stub.gotUsername, "must not spend a Keycloak login attempt on an empty password")
}

func Test_PasswordExchange_RejectsEmptyUsername(t *testing.T) {
	stub := &stubExchanger{token: testJWT("sub-abc")}
	_, _, err := PasswordExchange{Tokens: stub}.Authenticate(context.Background(), "", "hunter2")
	assert.ErrorIs(t, err, ErrAuth)
	assert.Empty(t, stub.gotUsername)
}
