package notification

import (
	"bytes"
	"context"
	"fmt"

	"github.com/wneessen/go-mail"
)

type Attachment struct {
	Filename    string
	ContentType string
	Content     []byte
}

type Message struct {
	To         []string
	CC         []string
	BCC        []string
	Subject    string
	HTMLBody   string
	Attachment *Attachment
}

// Mailer is what Service needs from the transport; SMTPMailer is the only implementation, tests
// substitute a capturing fake.
type Mailer interface {
	Send(ctx context.Context, msg Message) error
}

// SMTPMailer sends over SMTP with settings read at each Send, so a relay change needs no restart.
type SMTPMailer struct {
	config func() (SMTPConfig, error)
}

func NewSMTPMailer() *SMTPMailer {
	return &SMTPMailer{config: SMTPConfigFromEnv}
}

func (m *SMTPMailer) Send(ctx context.Context, msg Message) error {
	cfg, err := m.config()
	if err != nil {
		return fmt.Errorf("smtp settings: %w", err)
	}
	message, err := buildMessage(cfg.From, msg)
	if err != nil {
		return err
	}
	opts := []mail.Option{mail.WithPort(cfg.Port)}
	switch cfg.TLS {
	case TLSNone:
		opts = append(opts, mail.WithTLSPortPolicy(mail.NoTLS))
	case TLSImplicit:
		opts = append(opts, mail.WithSSLPort(false))
	default:
		opts = append(opts, mail.WithTLSPortPolicy(mail.TLSMandatory))
	}
	if cfg.User != "" {
		opts = append(opts, mail.WithSMTPAuth(mail.SMTPAuthPlain), mail.WithUsername(cfg.User), mail.WithPassword(cfg.Password))
	}
	client, err := mail.NewClient(cfg.Host, opts...)
	if err != nil {
		return fmt.Errorf("smtp client for %s:%d: %w", cfg.Host, cfg.Port, err)
	}
	if err := client.DialAndSendWithContext(ctx, message); err != nil {
		return fmt.Errorf("send email via %s:%d: %w", cfg.Host, cfg.Port, err)
	}
	return nil
}

func buildMessage(from string, msg Message) (*mail.Msg, error) {
	message := mail.NewMsg()
	if err := message.From(from); err != nil {
		return nil, fmt.Errorf("sender %q: %w", from, err)
	}
	if err := message.To(msg.To...); err != nil {
		return nil, fmt.Errorf("recipients %v: %w", msg.To, err)
	}
	if err := message.Cc(msg.CC...); err != nil {
		return nil, fmt.Errorf("cc %v: %w", msg.CC, err)
	}
	if err := message.Bcc(msg.BCC...); err != nil {
		return nil, fmt.Errorf("bcc %v: %w", msg.BCC, err)
	}
	message.Subject(msg.Subject)
	message.SetBodyString(mail.TypeTextHTML, msg.HTMLBody)
	if a := msg.Attachment; a != nil {
		if err := message.AttachReader(a.Filename, bytes.NewReader(a.Content), mail.WithFileContentType(mail.ContentType(a.ContentType))); err != nil {
			return nil, fmt.Errorf("attach %q: %w", a.Filename, err)
		}
	}
	return message, nil
}
