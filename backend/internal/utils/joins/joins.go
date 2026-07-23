package joins

import (
	"context"
	"fmt"

	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

// Joiner builds the LEFT/INNER JOIN clauses shared across repositories. Each join's SQL lives
// here in exactly one place; the only thing that varies per database is how a table name is
// resolved, which the connection-specific constructor injects via resolve. A repository picks
// Postgres() or Starrocks() once (in its own constructor) and calls the methods; the dispatch
// never leaks to individual call sites.
type Joiner struct {
	resolve func(types.Table, context.Context) string
}

// Starrocks resolves table names through TenantQualifiedName, which yields the radiant_jdbc
// federation name (no tenant bound) or the per-tenant view database (tenant bound).
func Starrocks() Joiner {
	return Joiner{resolve: func(t types.Table, ctx context.Context) string {
		return t.TenantQualifiedName(ctx)
	}}
}

// Postgres resolves table names to their bare PostgreSQL name.
func Postgres() Joiner {
	return Joiner{resolve: func(t types.Table, _ context.Context) string {
		return t.Name
	}}
}

func (j Joiner) name(t types.Table, tx *gorm.DB) string {
	return j.resolve(t, utils.CtxOf(tx))
}

func (j Joiner) CaseWithProband(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	joinWithProbandSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", j.name(types.ProbandTable, tx), types.ProbandTable.Alias, types.CaseTable.Alias, types.ProbandTable.Alias)
	joinWithProbandManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_code=%s.code AND %s.tenant_code=%s.tenant_code", j.name(types.ManagingOrganizationTable, tx), types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithProbandSql).Joins(joinWithProbandManagingOrganizationSql)
	}
	return tx.Joins(joinWithProbandSql)
}

func (j Joiner) CaseWithPatients(tx *gorm.DB) *gorm.DB {
	joinWithFamily := fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", j.name(types.FamilyTable, tx), types.FamilyTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias)
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", j.name(types.PatientTable, tx), types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias)
	return tx.Joins(joinWithFamily).Joins(joinWithPatientSql)
}

func (j Joiner) CaseWithAnalysisCatalog(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.analysis_catalog_id=%s.id", j.name(types.AnalysisCatalogTable, tx), types.AnalysisCatalogTable.Alias, types.CaseTable.Alias, types.AnalysisCatalogTable.Alias))
}

func (j Joiner) CaseWithCaseCategory(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_category_code=%s.code", j.name(types.CaseCategoryTable, tx), types.CaseCategoryTable.Alias, types.CaseTable.Alias, types.CaseCategoryTable.Alias))
}

func (j Joiner) AnalysisCatalogWithPanel(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.panel_id=%s.id", j.name(types.PanelTable, tx), types.PanelTable.Alias, types.AnalysisCatalogTable.Alias, types.PanelTable.Alias))
}

func (j Joiner) CaseWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", j.name(types.ProjectTable, tx), types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func (j Joiner) CaseWithDiagnosisLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.diagnosis_lab_code=%s.code AND %s.tenant_code=%s.tenant_code", j.name(types.SequencingLabTable, tx), types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias))
}

func (j Joiner) CaseWithMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", j.name(types.MondoTable, tx), types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func (j Joiner) DocumentWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id AND %s.type = 'output'", j.name(types.TaskHasDocumentTable, tx), types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias))
}

func (j Joiner) CaseHasSeqExpWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", j.name(types.CaseTable, tx), types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func (j Joiner) CaseWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.id=%s.case_id", j.name(types.CaseHasSequencingExperimentTable, tx), types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func (j Joiner) SeqExpWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", j.name(types.SampleTable, tx), types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func (j Joiner) SampleAndCaseHasSeqExpWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", j.name(types.FamilyTable, tx), types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func (j Joiner) SampleAndCaseWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.id", j.name(types.FamilyTable, tx), types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias))
}

func (j Joiner) CaseWithOrderingOrganization(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_code=%s.code AND %s.tenant_code=%s.tenant_code", j.name(types.OrderingOrganizationTable, tx), types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias))
}

func (j Joiner) SeqExpWithSequencingLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_lab_code=%s.code AND %s.tenant_code=%s.tenant_code", j.name(types.SequencingLabTable, tx), types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias))
}

func (j Joiner) TaskHasDocWithTaskContext(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", j.name(types.TaskContextTable, tx), types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func (j Joiner) TaskContextWithTaskHasDoc(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", j.name(types.TaskHasDocumentTable, tx), types.TaskHasDocumentTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func (j Joiner) TaskContextWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.sequencing_experiment_id AND (%s.case_id = %s.case_id OR %s.case_id IS NULL)", j.name(types.CaseHasSequencingExperimentTable, tx), types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.TaskContextTable.Alias))
}

func (j Joiner) TaskContextWithSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", j.name(types.SequencingExperimentTable, tx), types.SequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
}

func (j Joiner) TaskContextWithTask(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.id", j.name(types.TaskTable, tx), types.TaskTable.Alias, types.TaskContextTable.Alias, types.TaskTable.Alias))
}

func (j Joiner) CaseHasSeqExpWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", j.name(types.SequencingExperimentTable, tx), types.SequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func (j Joiner) TaskHasDocWithDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id", j.name(types.DocumentTable, tx), types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func (j Joiner) FamilyWithPatient(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", j.name(types.PatientTable, tx), types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias))
}

func (j Joiner) PatientWithManagingOrg(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_code=%s.code AND %s.tenant_code=%s.tenant_code", j.name(types.ManagingOrganizationTable, tx), types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias))
}

func (j Joiner) GermlineInterpretationWithSNVOccurrence(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_id = %s.seq_id and %s.locus_id = %s.locus_id", j.name(types.GermlineSNVOccurrenceTable, tx), types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func (j Joiner) GermlineInterpretationWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id = %s.id", j.name(types.CaseTable, tx), types.CaseTable.Alias, types.InterpretationGermlineTable.Alias, types.CaseTable.Alias))
}
