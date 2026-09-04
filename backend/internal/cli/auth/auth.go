// Package auth turns the stored tokens into a usable access token: reuse, refresh, or a fresh
// device flow, in that order.
package auth

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/config"
	"github.com/radiant-network/radiant-api/internal/cli/keycloak"
	"github.com/radiant-network/radiant-api/internal/cli/prompt"
	"github.com/radiant-network/radiant-api/internal/cli/style"
)

const expirySlack = 15 * time.Second

type tokenSource interface {
	StartDeviceAuth(ctx context.Context) (*keycloak.DeviceAuth, error)
	PollDeviceToken(ctx context.Context, da *keycloak.DeviceAuth) (*keycloak.Tokens, error)
	Refresh(ctx context.Context, refreshToken string) (*keycloak.Tokens, error)
}

// EnsureToken returns a valid access token, updating cfg.Tokens in place when it had to refresh
// or run the device flow. The caller persists cfg. Progress messages go to out.
func EnsureToken(ctx context.Context, cfg *config.Config, kc tokenSource, out io.Writer, now time.Time) (string, error) {
	p := style.For(out)
	if keycloak.AccessTokenValid(cfg.Tokens.AccessToken, now, expirySlack) {
		return cfg.Tokens.AccessToken, nil
	}
	if cfg.Tokens.RefreshToken != "" {
		tokens, err := kc.Refresh(ctx, cfg.Tokens.RefreshToken)
		if err == nil {
			store(cfg, tokens)
			return tokens.AccessToken, nil
		}
		prompt.Println(out, p.Yellow("Session expired, a new login is required."))
	}
	da, err := kc.StartDeviceAuth(ctx)
	if err != nil {
		return "", err
	}
	prompt.Printf(out, "\n%s Open this link in a browser and sign in:\n%s\n", p.Bold("Authentication required."), p.URL(da.VerificationURIComplete))
	prompt.Printf(out, "If the page asks for a code, enter %s  %s\n", p.Code(da.UserCode), p.Dim(fmt.Sprintf("(expires in %d min)", da.ExpiresIn/60)))
	prompt.Println(out, p.Dim("Waiting for the browser confirmation..."))
	tokens, err := kc.PollDeviceToken(ctx, da)
	if err != nil {
		return "", err
	}
	store(cfg, tokens)
	if claims, err := keycloak.Claims(tokens.AccessToken); err == nil {
		if user, ok := claims["preferred_username"].(string); ok {
			prompt.Printf(out, "Logged in as %s\n", p.Green(user))
		}
	}
	return tokens.AccessToken, nil
}

func store(cfg *config.Config, tokens *keycloak.Tokens) {
	cfg.Tokens.AccessToken = tokens.AccessToken
	if tokens.RefreshToken != "" {
		cfg.Tokens.RefreshToken = tokens.RefreshToken
	}
}
