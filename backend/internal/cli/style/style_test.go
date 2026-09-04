package style

import (
	"bytes"
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test_For_NonTerminalWriterDisabled(t *testing.T) {
	p := For(&bytes.Buffer{})
	assert.False(t, p.Enabled)
	assert.Equal(t, "x", p.Red("x"))
}

func Test_Wrap_EnabledAddsCodesAndReset(t *testing.T) {
	p := Palette{Enabled: true}
	assert.Equal(t, "\x1b[32mok\x1b[0m", p.Green("ok"))
	assert.Equal(t, "\x1b[1m\x1b[33mAB-12\x1b[0m", p.Code("AB-12"))
}

func Test_Wrap_EmptyStringStaysEmpty(t *testing.T) {
	assert.Equal(t, "", Palette{Enabled: true}.Bold(""))
}

func Test_Link_EnabledWrapsOSC8(t *testing.T) {
	got := Palette{Enabled: true}.Link("click", "https://x")
	assert.Equal(t, "\x1b]8;;https://x\x1b\\click\x1b]8;;\x1b\\", got)
}

func Test_Link_DisabledPlainText(t *testing.T) {
	assert.Equal(t, "click", Palette{}.Link("click", "https://x"))
}

func Test_URL_EnabledIsColoredAndClickable(t *testing.T) {
	got := Palette{Enabled: true}.URL("https://x")
	assert.Contains(t, got, "\x1b]8;;https://x\x1b\\")
	assert.Contains(t, got, "\x1b[36m\x1b[4m")
}

func Test_Path_EnabledUsesFileURL(t *testing.T) {
	got := Palette{Enabled: true}.Path("/tmp/out dir")
	assert.Contains(t, got, "\x1b]8;;file:///tmp/out%20dir\x1b\\/tmp/out dir\x1b]8;;\x1b\\")
	assert.Contains(t, got, "\x1b[1m")
}

func Test_Path_DisabledPlainText(t *testing.T) {
	assert.Equal(t, "/tmp/out", Palette{}.Path("/tmp/out"))
}

func Test_UsageTemplate_DisabledUnchanged(t *testing.T) {
	tmpl := "Usage:{{rpad .Name .NamePadding }}"
	assert.Equal(t, tmpl, Palette{}.UsageTemplate(tmpl))
}

func Test_UsageTemplate_EnabledColorsHeadingsAndNames(t *testing.T) {
	got := Palette{Enabled: true}.UsageTemplate("Usage:\n  x\n\nAvailable Commands:\n{{rpad .Name .NamePadding }}")
	assert.Contains(t, got, "\x1b[1mUsage:\x1b[0m")
	assert.Contains(t, got, "\x1b[1mAvailable Commands:\x1b[0m")
	assert.Contains(t, got, "{{cmdname (rpad .Name .NamePadding)}}")
}
