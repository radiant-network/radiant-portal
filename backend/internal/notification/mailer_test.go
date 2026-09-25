package notification

import (
	"errors"
	"net"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_buildMessage_RecipientsSubjectAttachment(t *testing.T) {
	msg, err := buildMessage("noreply@lab.invalid", Message{
		To: []string{"a@lab.invalid", "b@lab.invalid"}, CC: []string{"c@lab.invalid"}, BCC: []string{"d@lab.invalid"},
		Subject: "[STAT] New data", HTMLBody: "<p>hi</p>",
		Attachment: &Attachment{Filename: "run_manifest.tsv", ContentType: ManifestContentType, Content: []byte("tenant\tdocument_id\n")},
	})
	require.NoError(t, err)
	assert.Len(t, msg.GetTo(), 2)
	assert.Len(t, msg.GetCc(), 1)
	assert.Len(t, msg.GetBcc(), 1)
	assert.Equal(t, []string{"<noreply@lab.invalid>"}, msg.GetFromString())
	assert.Len(t, msg.GetAttachments(), 1)
	assert.Equal(t, "run_manifest.tsv", msg.GetAttachments()[0].Name)
}

func Test_buildMessage_NoAttachmentIsFine(t *testing.T) {
	msg, err := buildMessage("noreply@lab.invalid", Message{To: []string{"a@lab.invalid"}, Subject: "s", HTMLBody: "b"})
	require.NoError(t, err)
	assert.Empty(t, msg.GetAttachments())
}

func Test_buildMessage_InvalidRecipient_Error(t *testing.T) {
	_, err := buildMessage("noreply@lab.invalid", Message{To: []string{"not an address"}})
	assert.ErrorContains(t, err, "recipients")
}

func Test_SMTPMailer_ConfigError_NoDial(t *testing.T) {
	m := &SMTPMailer{config: func() (SMTPConfig, error) { return SMTPConfig{}, errors.New("SMTP_HOST is not set") }}
	err := m.Send(t.Context(), Message{To: []string{"a@lab.invalid"}})
	assert.ErrorContains(t, err, "smtp settings: SMTP_HOST is not set")
}

func Test_SMTPMailer_UnreachableRelay_Error(t *testing.T) {
	// Reserve a port then close it so nothing listens there.
	l, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)
	port := l.Addr().(*net.TCPAddr).Port
	require.NoError(t, l.Close())

	m := &SMTPMailer{config: func() (SMTPConfig, error) {
		return SMTPConfig{Host: "127.0.0.1", Port: port, TLS: TLSNone, From: "noreply@lab.invalid"}, nil
	}}
	err = m.Send(t.Context(), Message{To: []string{"a@lab.invalid"}, Subject: "s", HTMLBody: "b"})
	assert.ErrorContains(t, err, "send email via 127.0.0.1")
}
