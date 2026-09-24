package notification

import (
	"bytes"
	"context"
	"fmt"
	"log/slog"
	"sort"
	"time"

	"github.com/radiant-network/radiant-api/internal/types"
)

type groupReader interface {
	GetCaseGroupByName(ctx context.Context, tenantCode, name string) (*types.CaseGroup, []int, error)
	ListCases(ctx context.Context, tenantCode string, caseIDs []int) ([]types.CaseGroupCaseRow, error)
	ListDocuments(ctx context.Context, tenantCode string, caseIDs []int) ([]types.CaseGroupDocumentRow, error)
}

type emailsReader interface {
	NotificationEmailsByOrg(ctx context.Context, tenantCode string, codes []string) (map[string][]string, error)
}

// Service notifies the diagnosis laboratories of a case group: one email per lab with the TSV
// manifest of its output documents. Stateless: calling it twice sends twice.
type Service struct {
	groups    groupReader
	orgs      emailsReader
	templates *Templates
	mailer    Mailer
	settings  func() (Settings, error)
	now       func() time.Time
}

func NewService(groups groupReader, orgs emailsReader, templates *Templates, mailer Mailer) *Service {
	return &Service{groups: groups, orgs: orgs, templates: templates, mailer: mailer, settings: SettingsFromEnv, now: time.Now}
}

// WithSettings replaces the env-backed settings source; tests use it because t.Setenv cannot run
// under a parallel test.
func (s *Service) WithSettings(settings func() (Settings, error)) *Service {
	s.settings = settings
	return s
}

// Notify returns an error only for a failure that happens before any email leaves (settings,
// unknown group, template missing for the tenant, database reads). A lab whose send fails is
// reported as failed and the other labs are still served.
func (s *Service) Notify(ctx context.Context, tenantCode, groupName string) (*types.NotifyCaseGroupResponse, error) {
	settings, err := s.settings()
	if err != nil {
		return nil, fmt.Errorf("notification settings: %w", err)
	}
	group, caseIDs, err := s.groups.GetCaseGroupByName(ctx, tenantCode, groupName)
	if err != nil {
		return nil, err
	}
	if group == nil {
		return nil, types.ErrCaseGroupNotFound
	}
	if _, ok := s.templates.For(tenantCode); !ok {
		return nil, fmt.Errorf("%w %q", ErrTemplateMissing, tenantCode)
	}
	cases, err := s.groups.ListCases(ctx, tenantCode, caseIDs)
	if err != nil {
		return nil, err
	}
	docs, err := s.groups.ListDocuments(ctx, tenantCode, caseIDs)
	if err != nil {
		return nil, err
	}

	byLab := map[string][]types.CaseGroupCaseRow{}
	labNames := map[string]string{}
	for _, c := range cases {
		byLab[c.DiagnosisLabCode] = append(byLab[c.DiagnosisLabCode], c)
		labNames[c.DiagnosisLabCode] = c.DiagnosisLabName
	}
	docsByLab := map[string][]types.CaseGroupDocumentRow{}
	for _, d := range docs {
		docsByLab[d.DiagnosisLabCode] = append(docsByLab[d.DiagnosisLabCode], d)
	}
	labs := make([]string, 0, len(byLab))
	for lab := range byLab {
		labs = append(labs, lab)
	}
	sort.Strings(labs)
	emails, err := s.orgs.NotificationEmailsByOrg(ctx, tenantCode, labs)
	if err != nil {
		return nil, err
	}

	generatedOn := s.now().In(settings.Location)
	manifestFilename := fmt.Sprintf("%s_%s_manifest.tsv", group.Name, generatedOn.Format("20060102"))
	reports := make([]types.CaseGroupEmailReport, 0, len(labs))
	for _, lab := range labs {
		reports = append(reports, s.notifyLab(ctx, tenantCode, group.Name, lab, labNames[lab], byLab[lab], docsByLab[lab], emails[lab], settings, generatedOn, manifestFilename))
	}
	return &types.NotifyCaseGroupResponse{Group: types.NewCaseGroupResponse(*group, caseIDs), Emails: reports}, nil
}

func (s *Service) notifyLab(ctx context.Context, tenantCode, groupName, lab, labName string, cases []types.CaseGroupCaseRow, docs []types.CaseGroupDocumentRow, recipients []string, settings Settings, generatedOn time.Time, manifestFilename string) types.CaseGroupEmailReport {
	rows := manifestRows(tenantCode, docs)
	data := TemplateData{
		Tenant:           tenantCode,
		GroupName:        groupName,
		OrganizationCode: lab,
		OrganizationName: labName,
		PortalURL:        settings.PortalURL,
		Cases:            make([]TemplateCase, 0, len(cases)),
		AnalysisCodes:    []string{},
		DocumentCount:    len(rows),
		ManifestFilename: manifestFilename,
		GeneratedOn:      generatedOn.Format("2006-01-02 15:04"),
	}
	caseIDs := make([]int, 0, len(cases))
	seenCodes := map[string]bool{}
	for _, c := range cases {
		caseIDs = append(caseIDs, c.CaseID)
		data.Cases = append(data.Cases, TemplateCase{CaseID: c.CaseID, Priority: c.PriorityCode, AnalysisCode: c.AnalysisCatalogCode})
		if c.PriorityCode == "stat" {
			data.HasStat = true
		}
		if c.AnalysisCatalogCode != "" && !seenCodes[c.AnalysisCatalogCode] {
			seenCodes[c.AnalysisCatalogCode] = true
			data.AnalysisCodes = append(data.AnalysisCodes, c.AnalysisCatalogCode)
		}
	}
	sort.Strings(data.AnalysisCodes)
	if recipients == nil {
		recipients = []string{}
	}
	report := types.CaseGroupEmailReport{
		OrganizationCode: lab,
		Recipients:       recipients,
		CaseCount:        len(cases),
		DocumentCount:    len(rows),
		Context:          types.CaseGroupEmailContext{HasStat: data.HasStat, AnalysisCodes: data.AnalysisCodes, CaseIDs: caseIDs, ManifestFilename: manifestFilename},
	}
	if tmpl, ok := s.templates.For(tenantCode); ok {
		report.Template = tmpl.File
	}
	switch {
	case len(rows) == 0:
		report.Status = types.CaseGroupEmailSkippedNoDocuments
		return report
	case len(recipients) == 0:
		report.Status = types.CaseGroupEmailSkippedNoContact
		return report
	}

	subject, body, _, err := s.templates.Render(tenantCode, data)
	if err != nil {
		return failed(report, fmt.Errorf("render template: %w", err))
	}
	var manifest bytes.Buffer
	if err := WriteManifest(&manifest, rows); err != nil {
		return failed(report, err)
	}
	err = s.mailer.Send(ctx, Message{
		To: recipients, CC: settings.CC, BCC: settings.BCC,
		Subject: subject, HTMLBody: body,
		Attachment: &Attachment{Filename: manifestFilename, ContentType: ManifestContentType, Content: manifest.Bytes()},
	})
	if err != nil {
		slog.WarnContext(ctx, "lab notification failed", slog.String("tenant", tenantCode), slog.String("group", groupName), slog.String("lab", lab), slog.Any("error", err))
		return failed(report, err)
	}
	report.Status = types.CaseGroupEmailSent
	return report
}

func failed(report types.CaseGroupEmailReport, err error) types.CaseGroupEmailReport {
	report.Status = types.CaseGroupEmailFailed
	report.Error = err.Error()
	return report
}
