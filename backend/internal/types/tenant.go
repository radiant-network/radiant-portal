package types

import (
	"fmt"
	"regexp"
)

// tenantCodePattern is strict because a tenant code becomes a StarRocks database name
// (<code>_tenant) and a Ranger resource: lowercase, starts with a letter, ends alphanumeric
// (no trailing '_'), 2–50 characters.
var tenantCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,48}[a-z0-9]$`)

// ValidateTenantCode reports whether code is a syntactically valid tenant code. It is shared by
// the PostgreSQL tenant repository (row creation) and the StarRocks tenant repository (view
// creation), so it lives here rather than in either repository package.
func ValidateTenantCode(code string) error {
	if !tenantCodePattern.MatchString(code) {
		return fmt.Errorf("invalid tenant code %q: must be lowercase letters/digits/underscore, start with a letter, be at least 2 characters, and not end with '_'", code)
	}
	return nil
}

// ViewTables are the tables the API reads through the radiant_jdbc federation; each gets a
// per-tenant view in StarRocks (created from the StarRocks tenant repository) and its
// federatable columns are resolved from PostgreSQL (from the Postgres tenant repository).
var ViewTables = []string{
	// Tenant-scoped clinical data.
	"patient",
	"organization", "cases", "sample", "sequencing_experiment",
	"analysis_catalog", "document", "exam", "family", "family_history", "fetus",
	"interpretation_germline", "interpretation_germline_history",
	"interpretation_somatic", "interpretation_somatic_history",
	"obs_categorical", "obs_string", "occurrence_flag", "occurrence_note",
	"panel", "project", "task",
	// Junctions.
	"case_has_sequencing_experiment", "task_context", "task_has_document",
	// Reference / value-set tables.
	"affected_status", "ancestry", "case_category", "case_status", "case_type", "consanguinity",
	"data_category", "data_type", "experimental_strategy", "family_relationship", "file_format",
	"histology_type", "life_status", "obs_interpretation", "observation", "onset",
	"organization_category", "panel_type", "platform", "priority", "resolution_status",
	"sample_type", "sequencing_experiment_status", "sequencing_read_technology", "sex",
	"task_type",
}
