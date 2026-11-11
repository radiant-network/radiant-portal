package notification

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setSMTPEnv(t *testing.T, host, port, tls, from string) {
	t.Helper()
	t.Setenv("SMTP_HOST", host)
	t.Setenv("SMTP_PORT", port)
	t.Setenv("SMTP_TLS", tls)
	t.Setenv("SMTP_FROM", from)
	t.Setenv("SMTP_USER", "")
	t.Setenv("SMTP_PASSWORD", "")
}

func Test_SMTPConfigFromEnv_Defaults(t *testing.T) {
	setSMTPEnv(t, "relay.invalid", "", "", "noreply@lab.invalid")
	cfg, err := SMTPConfigFromEnv()
	require.NoError(t, err)
	assert.Equal(t, SMTPConfig{Host: "relay.invalid", Port: 587, TLS: TLSStartTLS, From: "noreply@lab.invalid"}, cfg)
}

func Test_SMTPConfigFromEnv_PlainPort25(t *testing.T) {
	setSMTPEnv(t, "relay.invalid", "25", "NONE", "noreply@lab.invalid")
	cfg, err := SMTPConfigFromEnv()
	require.NoError(t, err)
	assert.Equal(t, 25, cfg.Port)
	assert.Equal(t, TLSNone, cfg.TLS)
}

func Test_SMTPConfigFromEnv_MissingHostOrFrom(t *testing.T) {
	setSMTPEnv(t, "", "", "", "noreply@lab.invalid")
	_, err := SMTPConfigFromEnv()
	assert.ErrorContains(t, err, "SMTP_HOST")

	setSMTPEnv(t, "relay.invalid", "", "", "")
	_, err = SMTPConfigFromEnv()
	assert.ErrorContains(t, err, "SMTP_FROM")
}

func Test_SMTPConfigFromEnv_BadPortOrTLS(t *testing.T) {
	setSMTPEnv(t, "relay.invalid", "abc", "", "noreply@lab.invalid")
	_, err := SMTPConfigFromEnv()
	assert.ErrorContains(t, err, "SMTP_PORT")

	setSMTPEnv(t, "relay.invalid", "", "ssl", "noreply@lab.invalid")
	_, err = SMTPConfigFromEnv()
	assert.ErrorContains(t, err, "SMTP_TLS")
}

func Test_SettingsFromEnv_DefaultsAndSplit(t *testing.T) {
	t.Setenv("PORTAL_URL", "https://portal.invalid/")
	t.Setenv("NOTIFICATION_CC", "")
	t.Setenv("NOTIFICATION_BCC", " a@lab.invalid, ,b@lab.invalid ")
	t.Setenv("NOTIFICATION_TIMEZONE", "")
	s, err := SettingsFromEnv()
	require.NoError(t, err)
	assert.Equal(t, "https://portal.invalid", s.PortalURL)
	assert.Equal(t, []string{}, s.CC)
	assert.Equal(t, []string{"a@lab.invalid", "b@lab.invalid"}, s.BCC)
	assert.Equal(t, "America/Montreal", s.Location.String())
}

func Test_SettingsFromEnv_BadTimezone(t *testing.T) {
	t.Setenv("NOTIFICATION_TIMEZONE", "Mars/Olympus")
	_, err := SettingsFromEnv()
	assert.ErrorContains(t, err, "NOTIFICATION_TIMEZONE")
}
