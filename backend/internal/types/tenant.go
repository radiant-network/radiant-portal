package types

import (
	"fmt"
	"regexp"
)

var tenantCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,48}[a-z0-9]$`)

// ValidateTenantCode reports whether code is a syntactically valid tenant code. It is shared by
// the PostgreSQL tenant repository (row creation) and the StarRocks tenant repository (view
// creation), so it lives here rather than in either repository package.
func ValidateTenantCode(code string) error {
	if !tenantCodePattern.MatchString(code) {
		return fmt.Errorf("invalid tenant code %q: must match %s", code, tenantCodePattern.String())
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
	"analysis_catalog", "document", "exam", "family", "family_history",
	"interpretation_germline", "interpretation_germline_history",
	"interpretation_somatic", "interpretation_somatic_history",
	"obs_categorical", "obs_string", "occurrence_flag", "occurrence_note",
	"panel", "project", "task",
	// Junctions.
	"case_has_sequencing_experiment", "task_context", "task_has_document",
	// Reference / value-set tables.
	"affected_status", "ancestry", "case_category", "case_type", "consanguinity", "data_category",
	"data_type", "experimental_strategy", "family_relationship", "file_format",
	"histology_type", "life_status", "obs_interpretation", "observation", "onset",
	"organization_category", "panel_type", "platform", "priority", "resolution_status",
	"sample_type", "sequencing_read_technology", "sex", "status", "task_type",
}
