// Package style adds ANSI colors to console output, only when the destination is an interactive
// terminal that supports them (NO_COLOR and TERM=dumb honoured, VT enabled on Windows).
package style

import (
	"io"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/term"
)

type Palette struct {
	Enabled bool
}

// For decides from the writer: a terminal file descriptor with colors allowed, or nothing.
func For(w io.Writer) Palette {
	f, ok := w.(*os.File)
	if !ok || !term.IsTerminal(int(f.Fd())) {
		return Palette{}
	}
	if _, noColor := os.LookupEnv("NO_COLOR"); noColor || os.Getenv("TERM") == "dumb" {
		return Palette{}
	}
	return Palette{Enabled: enableVirtualTerminal(f)}
}

const (
	reset     = "\x1b[0m"
	bold      = "\x1b[1m"
	dim       = "\x1b[2m"
	underline = "\x1b[4m"
	red       = "\x1b[31m"
	green     = "\x1b[32m"
	yellow    = "\x1b[33m"
	cyan      = "\x1b[36m"
)

func (p Palette) wrap(code, s string) string {
	if !p.Enabled || s == "" {
		return s
	}
	return code + s + reset
}

func (p Palette) Bold(s string) string      { return p.wrap(bold, s) }
func (p Palette) Dim(s string) string       { return p.wrap(dim, s) }
func (p Palette) Red(s string) string       { return p.wrap(red, s) }
func (p Palette) Green(s string) string     { return p.wrap(green, s) }
func (p Palette) Yellow(s string) string    { return p.wrap(yellow, s) }
func (p Palette) Cyan(s string) string      { return p.wrap(cyan, s) }
func (p Palette) URL(s string) string       { return p.wrap(cyan+underline, p.Link(s, s)) }
func (p Palette) Code(s string) string      { return p.wrap(bold+yellow, s) }
func (p Palette) Highlight(s string) string { return p.wrap(bold+cyan, s) }

// Link makes text clickable with an OSC 8 hyperlink (Ctrl/Cmd-click in modern terminals).
// Terminals without OSC 8 support show the plain text. Disabled together with colors.
func (p Palette) Link(text, target string) string {
	if !p.Enabled || text == "" || target == "" {
		return text
	}
	return "\x1b]8;;" + target + "\x1b\\" + text + "\x1b]8;;\x1b\\"
}

// Path renders a local directory or file as a clickable file:// link opening the OS file manager.
func (p Palette) Path(path string) string {
	abs, err := filepath.Abs(path)
	if err != nil {
		return p.Bold(path)
	}
	u := url.URL{Scheme: "file", Path: "/" + strings.TrimPrefix(filepath.ToSlash(abs), "/")}
	return p.Bold(p.Link(path, u.String()))
}

// UsageTemplate colors the section headings of a cobra usage template. Command names are
// colored through the `cmdname` template function (see TemplateFuncs).
func (p Palette) UsageTemplate(tmpl string) string {
	if !p.Enabled {
		return tmpl
	}
	for _, heading := range []string{"Usage:", "Aliases:", "Examples:", "Available Commands:", "Additional Commands:", "Flags:", "Global Flags:", "Additional help topics:"} {
		tmpl = strings.ReplaceAll(tmpl, heading, bold+heading+reset)
	}
	tmpl = strings.ReplaceAll(tmpl, "{{rpad .Name .NamePadding }}", "{{cmdname (rpad .Name .NamePadding)}}")
	return tmpl
}

// TemplateFuncs returns the functions the colored usage template needs.
func (p Palette) TemplateFuncs() map[string]any {
	return map[string]any{"cmdname": p.Cyan}
}
