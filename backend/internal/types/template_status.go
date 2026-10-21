package types

// Load outcome of a per-tenant template directory, reported by GET /status: ok = every file
// loaded, warning = usable but at least one file skipped or ignored, error = no tenant served.
const (
	TemplateStatusOK      = "ok"
	TemplateStatusWarning = "warning"
	TemplateStatusError   = "error"
)
