package notification

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
	// The API image ships no zoneinfo; the embedded database keeps LoadLocation working there.
	_ "time/tzdata"
)

const (
	TLSNone     = "none"
	TLSStartTLS = "starttls"
	TLSImplicit = "tls"
)

type SMTPConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	TLS      string
	From     string
}

// Settings are the request-time notification settings; CC / BCC apply to every email.
type Settings struct {
	PortalURL string
	CC        []string
	BCC       []string
	Location  *time.Location
}

// SMTPConfigFromEnv reads SMTP_* at call time so a relay change needs no restart. The prod relay
// listens on plain port 25, hence the explicit TLS "none".
func SMTPConfigFromEnv() (SMTPConfig, error) {
	cfg := SMTPConfig{
		Host:     strings.TrimSpace(os.Getenv("SMTP_HOST")),
		User:     os.Getenv("SMTP_USER"),
		Password: os.Getenv("SMTP_PASSWORD"),
		TLS:      strings.ToLower(strings.TrimSpace(os.Getenv("SMTP_TLS"))),
		From:     strings.TrimSpace(os.Getenv("SMTP_FROM")),
		Port:     587,
	}
	if cfg.Host == "" {
		return SMTPConfig{}, errors.New("SMTP_HOST is not set")
	}
	if cfg.From == "" {
		return SMTPConfig{}, errors.New("SMTP_FROM is not set")
	}
	if raw := strings.TrimSpace(os.Getenv("SMTP_PORT")); raw != "" {
		port, err := strconv.Atoi(raw)
		if err != nil || port <= 0 || port > 65535 {
			return SMTPConfig{}, fmt.Errorf("SMTP_PORT %q is not a valid port", raw)
		}
		cfg.Port = port
	}
	switch cfg.TLS {
	case "":
		cfg.TLS = TLSStartTLS
	case TLSNone, TLSStartTLS, TLSImplicit:
	default:
		return SMTPConfig{}, fmt.Errorf("SMTP_TLS %q is not one of none, starttls, tls", cfg.TLS)
	}
	return cfg, nil
}

func SettingsFromEnv() (Settings, error) {
	tz := strings.TrimSpace(os.Getenv("NOTIFICATION_TIMEZONE"))
	if tz == "" {
		tz = "America/Montreal"
	}
	loc, err := time.LoadLocation(tz)
	if err != nil {
		return Settings{}, fmt.Errorf("NOTIFICATION_TIMEZONE %q: %w", tz, err)
	}
	return Settings{
		PortalURL: strings.TrimRight(strings.TrimSpace(os.Getenv("PORTAL_URL")), "/"),
		CC:        splitAddresses(os.Getenv("NOTIFICATION_CC")),
		BCC:       splitAddresses(os.Getenv("NOTIFICATION_BCC")),
		Location:  loc,
	}, nil
}

func splitAddresses(raw string) []string {
	out := []string{}
	for _, a := range strings.Split(raw, ",") {
		if t := strings.TrimSpace(a); t != "" {
			out = append(out, t)
		}
	}
	return out
}
