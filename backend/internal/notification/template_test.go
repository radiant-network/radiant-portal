package notification

import (
	"errors"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const validTemplate = `{{define "subject"}}{{if .HasStat}}[STAT]{{end}}{{if .HasAnalysis "RAPIDE"}}[RAPIDE]{{end}} New data for {{.OrganizationName}}{{end}}
{{define "body"}}<p style="color: red;">Hello <b>{{.OrganizationName}}</b></p>
<ul>{{range .Cases}}<li>{{.CaseID}} ({{.AnalysisCode}}, {{.Priority}})</li>{{end}}</ul>
<a href="{{.PortalURL}}/case">portal</a>{{end}}`

func writeTemplate(t *testing.T, dir, name, content string) {
	t.Helper()
	require.NoError(t, os.WriteFile(filepath.Join(dir, name), []byte(content), 0o600))
}

func sampleData() TemplateData {
	return TemplateData{
		Tenant:           "qlin",
		GroupName:        "run-1",
		OrganizationCode: "LDM-A",
		OrganizationName: "Lab A",
		PortalURL:        "https://portal.example",
		Cases:            []TemplateCase{{CaseID: 1, Priority: "routine", AnalysisCode: "WGS"}},
		AnalysisCodes:    []string{"WGS"},
		DocumentCount:    3,
		ManifestFilename: "run-1_20260918_manifest.tsv",
		GeneratedOn:      "2026-09-18 10:00",
	}
}

func Test_LoadTemplates_EmptyDirEnv_NoTemplates(t *testing.T) {
	templates := LoadTemplates("")

	assert.Empty(t, templates.Tenants())
	_, ok := templates.For("qlin")
	assert.False(t, ok)
}

func Test_LoadTemplates_MissingDir_NoTemplates(t *testing.T) {
	templates := LoadTemplates(filepath.Join(t.TempDir(), "does-not-exist"))

	assert.Empty(t, templates.Tenants())
}

func Test_LoadTemplates_ParsesOneTemplatePerTenant(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)
	writeTemplate(t, dir, "manifest_radiant.tmpl", validTemplate)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"qlin", "radiant"}, templates.Tenants())
	tmpl, ok := templates.For("qlin")
	require.True(t, ok)
	assert.Equal(t, "manifest_qlin.tmpl", tmpl.File)
}

func Test_LoadTemplates_InvalidTemplate_SkippedNotFatal(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "subject"}}{{.Unclosed{{end}}`)
	writeTemplate(t, dir, "manifest_radiant.tmpl", validTemplate)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"radiant"}, templates.Tenants())
}

func Test_LoadTemplates_MissingSubjectDefine_Skipped(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "body"}}<p>no subject</p>{{end}}`)

	templates := LoadTemplates(dir)

	assert.Empty(t, templates.Tenants())
}

func Test_LoadTemplates_MissingBodyDefine_Skipped(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "subject"}}no body{{end}}`)

	templates := LoadTemplates(dir)

	assert.Empty(t, templates.Tenants())
}

func Test_LoadTemplates_UnexpectedFile_Ignored(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "README.md", "not a template")
	writeTemplate(t, dir, "manifest_.tmpl", validTemplate)
	writeTemplate(t, dir, "default.tmpl", validTemplate)
	require.NoError(t, os.Mkdir(filepath.Join(dir, "manifest_sub.tmpl.d"), 0o750))
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"qlin"}, templates.Tenants())
}

// Kubernetes ConfigMap volume layout: real files under ..<timestamp>/, a ..data symlink to it,
// and one symlink per key at the root.
func Test_LoadTemplates_KubernetesConfigMapLayout_NoSkip(t *testing.T) {
	dir := t.TempDir()
	tsDir := filepath.Join(dir, "..2026_09_21_15_27_15.123456789")
	require.NoError(t, os.Mkdir(tsDir, 0o750))
	writeTemplate(t, tsDir, "manifest_qlin.tmpl", validTemplate)
	require.NoError(t, os.Symlink(tsDir, filepath.Join(dir, "..data")))
	require.NoError(t, os.Symlink(filepath.Join("..data", "manifest_qlin.tmpl"), filepath.Join(dir, "manifest_qlin.tmpl")))

	templates := LoadTemplates(dir)

	assert.Equal(t, []string{"qlin"}, templates.Tenants())
	assert.Equal(t, StatusOK, templates.Status())
}

func Test_Render_TenantWithoutTemplate_ErrTemplateMissing(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_radiant.tmpl", validTemplate)
	templates := LoadTemplates(dir)

	_, _, _, err := templates.Render("qlin", sampleData())

	require.Error(t, err)
	assert.True(t, errors.Is(err, ErrTemplateMissing), "got %v", err)
	assert.Contains(t, err.Error(), `"qlin"`)
}

func Test_Render_NilTemplates_ErrTemplateMissing(t *testing.T) {
	var templates *Templates

	_, _, _, err := templates.Render("qlin", sampleData())

	assert.True(t, errors.Is(err, ErrTemplateMissing), "got %v", err)
}

func Test_Render_ReturnsSubjectBodyAndFile(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)
	templates := LoadTemplates(dir)

	subject, body, file, err := templates.Render("qlin", sampleData())

	require.NoError(t, err)
	assert.Equal(t, "New data for Lab A", subject)
	assert.Equal(t, "manifest_qlin.tmpl", file)
	assert.Contains(t, body, `<p style="color: red;">Hello <b>Lab A</b></p>`)
	assert.Contains(t, body, `<li>1 (WGS, routine)</li>`)
	assert.Contains(t, body, `<a href="https://portal.example/case">portal</a>`)
}

func Test_Render_BodyEscapesValuesNotMarkup(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)
	templates := LoadTemplates(dir)
	data := sampleData()
	data.OrganizationName = `Lab <script>alert("x")</script> & Co`

	_, body, _, err := templates.Render("qlin", data)

	require.NoError(t, err)
	assert.NotContains(t, body, "<script>")
	assert.Contains(t, body, `Lab &lt;script&gt;alert(&#34;x&#34;)&lt;/script&gt; &amp; Co`)
	assert.Contains(t, body, `<p style="color: red;">`)
}

func Test_Render_SubjectIsOneLine(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", "{{define \"subject\"}}\n  Line one\n   {{.GroupName}}  \n{{end}}{{define \"body\"}}x{{end}}")
	templates := LoadTemplates(dir)

	subject, _, _, err := templates.Render("qlin", sampleData())

	require.NoError(t, err)
	assert.Equal(t, "Line one run-1", subject)
}

func Test_Render_SubjectNotHTMLEscaped(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "subject"}}{{.OrganizationName}}{{end}}{{define "body"}}x{{end}}`)
	templates := LoadTemplates(dir)
	data := sampleData()
	data.OrganizationName = "Lab R&D"

	subject, _, _, err := templates.Render("qlin", data)

	require.NoError(t, err)
	assert.Equal(t, "Lab R&D", subject)
}

func Test_Render_HasStatAndHasAnalysis(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)
	templates := LoadTemplates(dir)
	data := sampleData()
	data.HasStat = true
	data.AnalysisCodes = []string{"WGS", "rapide"}

	subject, _, _, err := templates.Render("qlin", data)

	require.NoError(t, err)
	assert.Equal(t, "[STAT][RAPIDE] New data for Lab A", subject)
}

func Test_Render_UnknownField_Error(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "subject"}}{{.Nope}}{{end}}{{define "body"}}x{{end}}`)
	templates := LoadTemplates(dir)

	_, _, _, err := templates.Render("qlin", sampleData())

	require.Error(t, err)
	assert.Contains(t, err.Error(), "render subject manifest_qlin.tmpl")
}

func Test_HasAnalysis_CaseInsensitive_EmptyFalse(t *testing.T) {
	data := TemplateData{AnalysisCodes: []string{"WGS", "RAPIDE"}}

	assert.True(t, data.HasAnalysis("rapide"))
	assert.False(t, data.HasAnalysis("WXS"))
	assert.False(t, data.HasAnalysis(""))
	assert.False(t, TemplateData{}.HasAnalysis("WGS"))
}

func Test_LoadTemplates_LocalstackShapedTemplates_Render(t *testing.T) {
	// Mirrors the templates shipped in clin-localstack / qlin-qa-infra so a data-contract change
	// here breaks a test before it breaks a deployment.
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "subject"}}{{if .HasStat}}[STAT]{{end}}{{if .HasAnalysis "RAPIDE"}}[RAPIDE]{{end}}{{if or .HasStat (.HasAnalysis "RAPIDE")}} {{end}}Nouvelles données du CQGC{{end}}
{{define "body"}}<a href="{{.PortalURL}}/case">{{.PortalURL}}/case</a>
<p>Cas concernés ({{len .Cases}}) :</p>
<ul>{{range .Cases}}<li>{{.CaseID}} <i>({{.AnalysisCode}}, {{.Priority}})</i></li>{{end}}</ul>
<p>{{.DocumentCount}} fichiers</p><pre>radiant-client download -m {{.ManifestFilename}}</pre>
<p><i>Généré le {{.GeneratedOn}}.</i></p>{{end}}`)
	templates := LoadTemplates(dir)

	subject, body, _, err := templates.Render("qlin", sampleData())

	require.NoError(t, err)
	assert.Equal(t, "Nouvelles données du CQGC", subject)
	assert.Contains(t, body, "Cas concernés (1) :")
	assert.Contains(t, body, "radiant-client download -m run-1_20260918_manifest.tsv")
}

func Test_Status_AllLoaded_OK(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)

	assert.Equal(t, StatusOK, LoadTemplates(dir).Status())
}

func Test_Status_OneSkipped_Warning(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)
	writeTemplate(t, dir, "manifest_radiant.tmpl", `{{define "subject"}}no body{{end}}`)

	assert.Equal(t, StatusWarning, LoadTemplates(dir).Status())
}

func Test_Status_UnexpectedFile_Warning(t *testing.T) {
	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", validTemplate)
	writeTemplate(t, dir, "README.md", "x")

	assert.Equal(t, StatusWarning, LoadTemplates(dir).Status())
}

func Test_Status_NothingLoaded_Error(t *testing.T) {
	var nilTemplates *Templates
	assert.Equal(t, StatusError, nilTemplates.Status())
	assert.Equal(t, StatusError, LoadTemplates("").Status())
	assert.Equal(t, StatusError, LoadTemplates(t.TempDir()).Status())

	dir := t.TempDir()
	writeTemplate(t, dir, "manifest_qlin.tmpl", `{{define "subject"}}no body{{end}}`)
	assert.Equal(t, StatusError, LoadTemplates(dir).Status())
}
