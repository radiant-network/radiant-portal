package notification

import (
	"bytes"
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/radiant-network/radiant-api/internal/cli/manifest"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeGroups struct {
	group   *types.CaseGroup
	ids     []int
	cases   []types.CaseGroupCaseRow
	docs    []types.CaseGroupDocumentRow
	getErr  error
	listErr error
}

func (f *fakeGroups) GetCaseGroupByName(_ context.Context, _, _ string) (*types.CaseGroup, []int, error) {
	return f.group, f.ids, f.getErr
}
func (f *fakeGroups) ListCases(_ context.Context, _ string, _ []int) ([]types.CaseGroupCaseRow, error) {
	return f.cases, f.listErr
}
func (f *fakeGroups) ListDocuments(_ context.Context, _ string, _ []int) ([]types.CaseGroupDocumentRow, error) {
	return f.docs, f.listErr
}

type fakeOrgs struct{ emails map[string][]string }

func (f *fakeOrgs) NotificationEmailsByOrg(_ context.Context, _ string, _ []string) (map[string][]string, error) {
	return f.emails, nil
}

type fakeMailer struct {
	sent    []Message
	failFor string // recipient substring that makes Send fail
}

func (f *fakeMailer) Send(_ context.Context, msg Message) error {
	for _, to := range msg.To {
		if f.failFor != "" && to == f.failFor {
			return errors.New("relay refused")
		}
	}
	f.sent = append(f.sent, msg)
	return nil
}

var fixedNow = time.Date(2026, 9, 24, 15, 4, 0, 0, time.UTC)

func newTestService(t *testing.T, groups *fakeGroups, orgs *fakeOrgs, mailer *fakeMailer) *Service {
	t.Helper()
	dir := t.TempDir()
	require.NoError(t, os.WriteFile(filepath.Join(dir, "manifest_qlin.tmpl"), []byte(validTemplate), 0o600))
	svc := NewService(groups, orgs, LoadTemplates(dir), mailer)
	svc.now = func() time.Time { return fixedNow }
	svc.settings = func() (Settings, error) {
		return Settings{PortalURL: "https://portal.invalid", CC: []string{"cc@lab.invalid"}, BCC: []string{"bcc@lab.invalid"}, Location: time.UTC}, nil
	}
	return svc
}

func twoLabGroups() *fakeGroups {
	return &fakeGroups{
		group: &types.CaseGroup{TenantCode: "qlin", Name: "run-a"},
		ids:   []int{1, 2, 3},
		cases: []types.CaseGroupCaseRow{
			{CaseID: 1, PriorityCode: "routine", AnalysisCatalogCode: "WGS", DiagnosisLabCode: "LDM-A", DiagnosisLabName: "Lab A"},
			{CaseID: 2, PriorityCode: "stat", AnalysisCatalogCode: "RAPIDE", DiagnosisLabCode: "LDM-A", DiagnosisLabName: "Lab A"},
			{CaseID: 3, PriorityCode: "routine", AnalysisCatalogCode: "WGS", DiagnosisLabCode: "LDM-B", DiagnosisLabName: "Lab B"},
		},
		docs: []types.CaseGroupDocumentRow{
			{DocumentID: 10, Name: "a.cram", Size: 10, DataTypeCode: "alignment", FormatCode: "cram", SubmitterSampleID: "S1", PatientID: 1, CaseID: 1, DiagnosisLabCode: "LDM-A"},
			{DocumentID: 11, Name: "a.cram.crai", Size: 1, DataTypeCode: "alignment", FormatCode: "crai", SubmitterSampleID: "S1", PatientID: 1, CaseID: 1, DiagnosisLabCode: "LDM-A"},
			{DocumentID: 12, Name: "b.vcf.gz", Size: 5, DataTypeCode: "snv", FormatCode: "vcf", SubmitterSampleID: "S2", PatientID: 2, CaseID: 2, DiagnosisLabCode: "LDM-A"},
			{DocumentID: 13, Name: "c.cram", Size: 7, DataTypeCode: "alignment", FormatCode: "cram", SubmitterSampleID: "S3", PatientID: 3, CaseID: 3, DiagnosisLabCode: "LDM-B"},
		},
	}
}

func Test_Notify_GroupNotFound_Error(t *testing.T) {
	svc := newTestService(t, &fakeGroups{}, &fakeOrgs{}, &fakeMailer{})
	_, err := svc.Notify(t.Context(), "qlin", "nope")
	assert.ErrorIs(t, err, types.ErrCaseGroupNotFound)
}

func Test_Notify_TemplateMissing_Error_NothingSent(t *testing.T) {
	mailer := &fakeMailer{}
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{emails: map[string][]string{"LDM-A": {"a@lab.invalid"}}}, mailer)
	svc.templates = LoadTemplates(t.TempDir())

	_, err := svc.Notify(t.Context(), "qlin", "run-a")
	assert.ErrorIs(t, err, ErrTemplateMissing)
	assert.Empty(t, mailer.sent)
}

func Test_Notify_SettingsError_Error(t *testing.T) {
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{}, &fakeMailer{})
	svc.settings = func() (Settings, error) { return Settings{}, errors.New("NOTIFICATION_TIMEZONE bad") }
	_, err := svc.Notify(t.Context(), "qlin", "run-a")
	assert.ErrorContains(t, err, "notification settings")
}

func Test_Notify_SendsOneEmailPerLab_WithCCBCC(t *testing.T) {
	mailer := &fakeMailer{}
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{emails: map[string][]string{"LDM-A": {"a1@lab.invalid", "a2@lab.invalid"}, "LDM-B": {"b@lab.invalid"}}}, mailer)

	resp, err := svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)
	assert.Equal(t, types.CaseGroupResponse{Name: "run-a", TenantCode: "qlin", CaseIDs: []int{1, 2, 3}}, resp.Group)
	require.Len(t, resp.Emails, 2)
	require.Len(t, mailer.sent, 2)

	a := resp.Emails[0]
	assert.Equal(t, "LDM-A", a.OrganizationCode)
	assert.Equal(t, types.CaseGroupEmailSent, a.Status)
	assert.Equal(t, []string{"a1@lab.invalid", "a2@lab.invalid"}, a.Recipients)
	assert.Equal(t, 2, a.CaseCount)
	assert.Equal(t, 3, a.DocumentCount)
	assert.Equal(t, "manifest_qlin.tmpl", a.Template)
	assert.Equal(t, types.CaseGroupEmailContext{HasStat: true, AnalysisCodes: []string{"RAPIDE", "WGS"}, CaseIDs: []int{1, 2}, ManifestFilename: "run-a_20260924_manifest.tsv"}, a.Context)

	b := resp.Emails[1]
	assert.Equal(t, "LDM-B", b.OrganizationCode)
	assert.False(t, b.Context.HasStat)
	assert.Equal(t, []int{3}, b.Context.CaseIDs)

	assert.Equal(t, []string{"cc@lab.invalid"}, mailer.sent[0].CC)
	assert.Equal(t, []string{"bcc@lab.invalid"}, mailer.sent[0].BCC)
	assert.Equal(t, "[STAT][RAPIDE] New data for Lab A", mailer.sent[0].Subject)
	assert.Contains(t, mailer.sent[0].HTMLBody, "<b>Lab A</b>")
	assert.Contains(t, mailer.sent[0].HTMLBody, "https://portal.invalid/case")
	assert.Equal(t, "run-a_20260924_manifest.tsv", mailer.sent[0].Attachment.Filename)
	assert.Equal(t, ManifestContentType, mailer.sent[0].Attachment.ContentType)
}

func Test_Notify_ManifestParsesWithCLI_LabDocumentsOnly(t *testing.T) {
	mailer := &fakeMailer{}
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{emails: map[string][]string{"LDM-A": {"a@lab.invalid"}, "LDM-B": {"b@lab.invalid"}}}, mailer)
	_, err := svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)

	entries, warnings, err := manifest.Parse(bytes.NewReader(mailer.sent[0].Attachment.Content))
	require.NoError(t, err)
	assert.Empty(t, warnings)
	assert.Equal(t, []manifest.Entry{
		{Tenant: "qlin", DocumentID: 10, Name: "a.cram", Size: 10},
		{Tenant: "qlin", DocumentID: 11, Name: "a.cram.crai", Size: 1},
		{Tenant: "qlin", DocumentID: 12, Name: "b.vcf.gz", Size: 5},
	}, entries, "lab A's manifest holds only lab A's documents")
}

func Test_Notify_NoContact_Skipped(t *testing.T) {
	mailer := &fakeMailer{}
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{emails: map[string][]string{"LDM-B": {"b@lab.invalid"}}}, mailer)
	resp, err := svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)
	assert.Equal(t, types.CaseGroupEmailSkippedNoContact, resp.Emails[0].Status)
	assert.Equal(t, []string{}, resp.Emails[0].Recipients)
	assert.Equal(t, types.CaseGroupEmailSent, resp.Emails[1].Status)
	assert.Len(t, mailer.sent, 1)
}

func Test_Notify_NoDocuments_Skipped_BeforeContactCheck(t *testing.T) {
	groups := twoLabGroups()
	groups.docs = groups.docs[:3] // nothing left for LDM-B
	mailer := &fakeMailer{}
	svc := newTestService(t, groups, &fakeOrgs{emails: map[string][]string{"LDM-A": {"a@lab.invalid"}}}, mailer)
	resp, err := svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)
	assert.Equal(t, types.CaseGroupEmailSkippedNoDocuments, resp.Emails[1].Status)
	assert.Len(t, mailer.sent, 1)
}

func Test_Notify_SendFailure_ReportedPerLab_OthersStillSent(t *testing.T) {
	mailer := &fakeMailer{failFor: "a@lab.invalid"}
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{emails: map[string][]string{"LDM-A": {"a@lab.invalid"}, "LDM-B": {"b@lab.invalid"}}}, mailer)
	resp, err := svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)
	assert.Equal(t, types.CaseGroupEmailFailed, resp.Emails[0].Status)
	assert.Equal(t, "relay refused", resp.Emails[0].Error)
	assert.Equal(t, types.CaseGroupEmailSent, resp.Emails[1].Status)
	assert.Len(t, mailer.sent, 1)
}

func Test_Notify_SecondCallSendsAgain(t *testing.T) {
	mailer := &fakeMailer{}
	svc := newTestService(t, twoLabGroups(), &fakeOrgs{emails: map[string][]string{"LDM-A": {"a@lab.invalid"}, "LDM-B": {"b@lab.invalid"}}}, mailer)
	_, err := svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)
	_, err = svc.Notify(t.Context(), "qlin", "run-a")
	require.NoError(t, err)
	assert.Len(t, mailer.sent, 4)
}

func Test_Notify_EmptyGroup_NoEmails(t *testing.T) {
	mailer := &fakeMailer{}
	svc := newTestService(t, &fakeGroups{group: &types.CaseGroup{TenantCode: "qlin", Name: "empty"}, ids: []int{}}, &fakeOrgs{}, mailer)
	resp, err := svc.Notify(t.Context(), "qlin", "empty")
	require.NoError(t, err)
	assert.Equal(t, []types.CaseGroupEmailReport{}, resp.Emails)
	assert.Equal(t, []int{}, resp.Group.CaseIDs)
	assert.Empty(t, mailer.sent)
}
