// Package notification builds and sends the lab (LDM) manifest emails.
package notification

import (
	"bytes"
	"errors"
	"fmt"
	htmltemplate "html/template"
	"log/slog"
	"os"
	"path/filepath"
	"sort"
	"strings"
	texttemplate "text/template"
)

var ErrTemplateMissing = errors.New("notification template missing for tenant")

const (
	TemplateDirEnv = "NOTIFICATION_TEMPLATE_DIR"

	// Load outcome reported by GET /status: ok = every file loaded, warning = usable but at least
	// one file skipped or ignored, error = no tenant can be notified.
	StatusOK      = "ok"
	StatusWarning = "warning"
	StatusError   = "error"

	templatePrefix = "manifest_"
	templateExt    = ".tmpl"
	subjectDefine  = "subject"
	bodyDefine     = "body"
)

// TemplateData is the contract between the API and the tenant templates: adding a field here is
// an API-only change, templates opt in with {{if}}.
type TemplateData struct {
	Tenant           string
	GroupName        string
	OrganizationCode string
	OrganizationName string
	PortalURL        string
	Cases            []TemplateCase
	HasStat          bool
	AnalysisCodes    []string
	DocumentCount    int
	ManifestFilename string
	GeneratedOn      string
}

type TemplateCase struct {
	CaseID       int
	Priority     string
	AnalysisCode string
}

// HasAnalysis is callable from templates as {{if .HasAnalysis "RAPIDE"}}.
func (d TemplateData) HasAnalysis(code string) bool {
	for _, c := range d.AnalysisCodes {
		if strings.EqualFold(c, code) {
			return true
		}
	}
	return false
}

type Template struct {
	File    string
	subject *texttemplate.Template
	body    *htmltemplate.Template
}

// Templates holds one parsed template per tenant. The zero value / nil is usable and knows no tenant.
type Templates struct {
	byTenant map[string]*Template
	skipped  int
}

// LoadTemplates parses every manifest_<tenant>.tmpl in dir. It never fails: a broken or incomplete
// file is logged and skipped, so a bad template can't keep the API from booting; notify on that
// tenant fails with ErrTemplateMissing instead.
func LoadTemplates(dir string) *Templates {
	t := &Templates{byTenant: map[string]*Template{}}
	if dir == "" {
		slog.Warn("notification templates disabled", slog.String("reason", TemplateDirEnv+" unset"))
		return t
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		slog.Warn("notification template dir unreadable", slog.String("dir", dir), slog.Any("error", err))
		return t
	}
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		tenant, ok := tenantFromFilename(e.Name())
		if !ok {
			slog.Warn("notification template dir holds an unexpected file, ignored", slog.String("file", e.Name()))
			t.skipped++
			continue
		}
		tmpl, err := parseTemplate(filepath.Join(dir, e.Name()))
		if err != nil {
			slog.Warn("notification template skipped", slog.String("file", e.Name()), slog.Any("error", err))
			t.skipped++
			continue
		}
		t.byTenant[tenant] = tmpl
	}
	if len(t.byTenant) == 0 {
		slog.Warn("no notification template loaded", slog.String("dir", dir))
		return t
	}
	slog.Info("notification templates loaded", slog.String("dir", dir), slog.Int("count", len(t.byTenant)), slog.Any("tenants", t.Tenants()))
	return t
}

func tenantFromFilename(name string) (string, bool) {
	if !strings.HasPrefix(name, templatePrefix) || !strings.HasSuffix(name, templateExt) {
		return "", false
	}
	tenant := strings.TrimSuffix(strings.TrimPrefix(name, templatePrefix), templateExt)
	return tenant, tenant != ""
}

func parseTemplate(path string) (*Template, error) {
	raw, err := os.ReadFile(path) // #nosec G304 -- path comes from the operator-controlled template dir
	if err != nil {
		return nil, fmt.Errorf("read template: %w", err)
	}
	src := string(raw)
	// Two parsers over the same file: the subject is plain text (a mail header), the body is HTML
	// so only the {{.Var}} values get escaped and the markup written in the template passes as-is.
	subject, err := texttemplate.New(filepath.Base(path)).Parse(src)
	if err != nil {
		return nil, fmt.Errorf("parse template: %w", err)
	}
	if subject.Lookup(subjectDefine) == nil {
		return nil, fmt.Errorf("template has no {{define %q}}", subjectDefine)
	}
	body, err := htmltemplate.New(filepath.Base(path)).Parse(src)
	if err != nil {
		return nil, fmt.Errorf("parse template as html: %w", err)
	}
	if body.Lookup(bodyDefine) == nil {
		return nil, fmt.Errorf("template has no {{define %q}}", bodyDefine)
	}
	return &Template{File: filepath.Base(path), subject: subject, body: body}, nil
}

func (t *Templates) For(tenant string) (*Template, bool) {
	if t == nil {
		return nil, false
	}
	tmpl, ok := t.byTenant[tenant]
	return tmpl, ok
}

func (t *Templates) Status() string {
	switch {
	case t == nil || len(t.byTenant) == 0:
		return StatusError
	case t.skipped > 0:
		return StatusWarning
	default:
		return StatusOK
	}
}

func (t *Templates) Tenants() []string {
	if t == nil {
		return nil
	}
	tenants := make([]string, 0, len(t.byTenant))
	for tenant := range t.byTenant {
		tenants = append(tenants, tenant)
	}
	sort.Strings(tenants)
	return tenants
}

// Render returns the one-line subject, the HTML body and the template file name used.
func (t *Templates) Render(tenant string, data TemplateData) (subject, body, file string, err error) {
	tmpl, ok := t.For(tenant)
	if !ok {
		return "", "", "", fmt.Errorf("%w %q", ErrTemplateMissing, tenant)
	}
	var buf bytes.Buffer
	if err := tmpl.subject.ExecuteTemplate(&buf, subjectDefine, data); err != nil {
		return "", "", "", fmt.Errorf("render subject %s: %w", tmpl.File, err)
	}
	// A subject is a single mail header line; collapse any whitespace the template leaks.
	subject = strings.Join(strings.Fields(buf.String()), " ")
	buf.Reset()
	if err := tmpl.body.ExecuteTemplate(&buf, bodyDefine, data); err != nil {
		return "", "", "", fmt.Errorf("render body %s: %w", tmpl.File, err)
	}
	return subject, buf.String(), tmpl.File, nil
}
