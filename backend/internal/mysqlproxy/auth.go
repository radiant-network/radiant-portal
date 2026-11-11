package mysqlproxy

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

// Authenticator turns what the client sent at login into the pair StarRocks needs: the
// username to log in as (always the Keycloak `sub`, since StarRocks users are created with
// principal_field = "sub") and the JWT to present to its OIDC plugin.
//
// It is the ONLY difference between the two proxies built on this package: one takes a JWT
// straight from the client, the other exchanges a password for one.
type Authenticator interface {
	// Authenticate maps the client's username and cleartext secret to a StarRocks identity.
	// Returning an error aborts the login; the message reaches the client in an ERR packet,
	// so it must not leak anything sensitive.
	Authenticate(ctx context.Context, username, secret string) (starrocksUser, jwt string, err error)
}

// ErrAuth is the generic login failure. Authenticators should wrap it rather than returning
// provider-specific detail: the message is relayed to the client verbatim.
var ErrAuth = errors.New("authentication failed")

// JWTPassthrough is the original behavior: the client already holds a JWT and sends it as its
// password, so there is nothing to exchange. The username the client supplied is ignored in
// favor of the token's own `sub` — the two must agree anyway, and deriving it means a caller
// can connect with any placeholder username.
type JWTPassthrough struct{}

func (JWTPassthrough) Authenticate(_ context.Context, _, secret string) (string, string, error) {
	if !strings.HasPrefix(secret, "ey") { // every JWT starts with base64url({"alg"... → "ey"
		return "", "", fmt.Errorf("%w: expected a JWT as the password", ErrAuth)
	}
	sub, err := SubjectFromJWT(secret)
	if err != nil {
		return "", "", fmt.Errorf("%w: %s", ErrAuth, err)
	}
	return sub, secret, nil
}

// TokenExchanger mints a JWT from a username and password. Implemented by the Keycloak
// client; declared here because this package is the consumer.
type TokenExchanger interface {
	PasswordGrant(ctx context.Context, username, password string) (string, error)
}

// PasswordExchange lets a client authenticate the way it would to any MySQL server — with the
// username and password its user already knows — and does the OAuth2 password grant on their
// behalf, so no one has to obtain, store, or paste a token.
//
// The password crosses the client→proxy hop in cleartext (the MySQL cleartext plugin is the
// only way the proxy can see it at all; native_password is a challenge-response that never
// reveals it). A proxy configured with this authenticator therefore MUST run with TLS on its
// listener — Serve refuses to start otherwise.
type PasswordExchange struct {
	Tokens TokenExchanger
}

func (p PasswordExchange) Authenticate(ctx context.Context, username, secret string) (string, string, error) {
	if username == "" || secret == "" {
		return "", "", fmt.Errorf("%w: username and password are required", ErrAuth)
	}
	token, err := p.Tokens.PasswordGrant(ctx, username, secret)
	if err != nil {
		// Deliberately generic: the caller relays this to the client, and the provider's
		// message distinguishes "no such user" from "wrong password".
		return "", "", fmt.Errorf("%w: invalid username or password", ErrAuth)
	}
	sub, err := SubjectFromJWT(token)
	if err != nil {
		return "", "", fmt.Errorf("%w: %s", ErrAuth, err)
	}
	return sub, token, nil
}

// SubjectFromJWT decodes the `sub` claim without verifying the signature — StarRocks does the
// verification (jwks_url is baked into the user), and the proxy only needs the claim to know
// which user to log in as. A forged token gets no further than StarRocks' own check.
func SubjectFromJWT(token string) (string, error) {
	parts := strings.Split(token, ".")
	if len(parts) < 2 {
		return "", errors.New("malformed token")
	}
	payload, err := base64.RawURLEncoding.DecodeString(strings.TrimRight(parts[1], "="))
	if err != nil {
		return "", errors.New("malformed token payload")
	}
	var claims struct {
		Sub string `json:"sub"`
	}
	if err := json.Unmarshal(payload, &claims); err != nil {
		return "", errors.New("malformed token claims")
	}
	if claims.Sub == "" {
		return "", errors.New("token has no sub claim")
	}
	return claims.Sub, nil
}
