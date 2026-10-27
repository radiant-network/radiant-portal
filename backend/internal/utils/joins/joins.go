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

func (j Joiner) OrganizationWithCategory(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.category_code=%s.code", j.name(types.OrganizationCategoryTable, tx), types.OrganizationCategoryTable.Alias, types.OrganizationTable.Alias, types.OrganizationCategoryTable.Alias))
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

func (j Joiner) CaseWithCaseGroup(tx *gorm.DB) *gorm.DB {
	joinMembership := fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", j.name(types.CaseGroupCaseTable, tx), types.CaseGroupCaseTable.Alias, types.CaseGroupCaseTable.Alias, types.CaseTable.Alias)
	joinGroup := fmt.Sprintf("INNER JOIN %s %s ON %s.id=%s.case_group_id", j.name(types.CaseGroupTable, tx), types.CaseGroupTable.Alias, types.CaseGroupTable.Alias, types.CaseGroupCaseTable.Alias)
	return tx.Joins(joinMembership).Joins(joinGroup)
}

// CaseWithProbandSample joins, per case, the array of its proband samples' submitter ids, the most
// recently sequenced first: by run date, then sequencing id, as the case page orders its sequencings.
// A sample whose sequencing has no run date comes last. Every case gets a row, with an empty array when it
// has no proband sample: a NULL would make a not-in filter on the field drop the case.
func (j Joiner) CaseWithProbandSample(tx *gorm.DB) *gorm.DB {
	return j.caseWithArray(tx, j.ProbandSamples(tx), "submitter_sample_id", types.CaseProbandSampleTable, types.CaseProbandSubmitterSampleIdsField)
}

func (j Joiner) caseWithArray(tx *gorm.DB, rows string, column string, table types.Table, field types.Field) *gorm.DB {
	// The empty array is the aggregate of the case's one NULL row, filtered out. An ifnull(..., []) literal
	// instead breaks array_contains on StarRocks 3.4 (NULL or "get state failed"), which a single-value
	// not-in filter uses.
	perCase := fmt.Sprintf("SELECT %[1]s.id AS case_id, array_filter(x -> x IS NOT NULL, array_agg(samples.%[5]s ORDER BY samples.run_date DESC NULLS LAST, samples.seq_id DESC)) AS %[2]s "+
		"FROM %[3]s %[1]s LEFT JOIN (%[4]s) samples ON samples.case_id = %[1]s.id GROUP BY %[1]s.id",
		types.CaseTable.Alias, field.Name, j.name(types.CaseTable, tx), rows, column)
	return tx.Joins(fmt.Sprintf("LEFT JOIN (%s) %s ON %s.case_id=%s.id", perCase, table.Alias, table.Alias, types.CaseTable.Alias))
}

// ProbandSamples returns one (case_id, submitter_sample_id) row per proband sample the case sequenced, with
// the run_date and seq_id of its latest sequencing, to order them. A somatic case keeps the tumoral samples
// only. A prenatal case's proband is the mother, and a fetus's sample also carries her patient_id, so fetus
// samples (fetus_id set) are left out.
func (j Joiner) ProbandSamples(tx *gorm.DB) string {
	// Indexed verbs: %[1]s chseq, %[2]s c, %[3]s s, %[4]s spl, then their table names.
	return fmt.Sprintf(
		`SELECT %[1]s.case_id, %[4]s.submitter_sample_id, MAX(%[3]s.run_date) AS run_date, MAX(%[3]s.id) AS seq_id
        FROM %[5]s %[1]s
        INNER JOIN %[6]s %[2]s ON %[2]s.id = %[1]s.case_id
        INNER JOIN %[7]s %[3]s ON %[3]s.id = %[1]s.sequencing_experiment_id
        INNER JOIN %[8]s %[4]s ON %[4]s.id = %[3]s.sample_id AND %[4]s.patient_id = %[2]s.proband_id AND %[4]s.fetus_id IS NULL
        WHERE %[2]s.case_type_code <> 'somatic' OR %[4]s.histology_code = 'tumoral'
        GROUP BY %[1]s.case_id, %[4]s.submitter_sample_id`,
		types.CaseHasSequencingExperimentTable.Alias,
		types.CaseTable.Alias,
		types.SequencingExperimentTable.Alias,
		types.SampleTable.Alias,
		j.name(types.CaseHasSequencingExperimentTable, tx),
		j.name(types.CaseTable, tx),
		j.name(types.SequencingExperimentTable, tx),
		j.name(types.SampleTable, tx),
	)
}

// CaseWithRuns joins, per case, the array of the distinct run aliases of all its sequencings (every family
// member's), ordered like CaseWithProbandSample: by run date, a run without one last, then sequencing id.
// Every case gets a row, with an empty array when it has no run, built the same way.
func (j Joiner) CaseWithRuns(tx *gorm.DB) *gorm.DB {
	return j.caseWithArray(tx, j.CaseRuns(tx), "run_alias", types.CaseRunTable, types.CaseRunAliasesField)
}

// CaseRuns returns one (case_id, run_alias) row per distinct run of the case's sequencings, with the run_date
// and seq_id of its latest sequencing, to order them.
func (j Joiner) CaseRuns(tx *gorm.DB) string {
	// Indexed verbs: %[1]s chseq, %[2]s s, then their table names.
	return fmt.Sprintf(
		`SELECT %[1]s.case_id, %[2]s.run_alias, MAX(%[2]s.run_date) AS run_date, MAX(%[2]s.id) AS seq_id
        FROM %[3]s %[1]s
        INNER JOIN %[4]s %[2]s ON %[2]s.id = %[1]s.sequencing_experiment_id
        WHERE %[2]s.run_alias IS NOT NULL
        GROUP BY %[1]s.case_id, %[2]s.run_alias`,
		types.CaseHasSequencingExperimentTable.Alias,
		types.SequencingExperimentTable.Alias,
		j.name(types.CaseHasSequencingExperimentTable, tx),
		j.name(types.SequencingExperimentTable, tx),
	)
}

func (j Joiner) SeqExpWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", j.name(types.SampleTable, tx), types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

// A fetus's sample must match its own family row, not its mother's: sample.patient_id is always
// the mother, so match on fetus_id when the sample carries one.
func SampleToFamilyJoinCondition(caseIDColumn string) string {
	return fmt.Sprintf(
		"%s.case_id = %s AND ((%s.fetus_id IS NULL AND %s.family_member_id = %s.patient_id) OR (%s.fetus_id IS NOT NULL AND %s.fetus_id = %s.fetus_id))",
		types.FamilyTable.Alias, caseIDColumn,
		types.SampleTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias,
		types.SampleTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias,
	)
}

func (j Joiner) SampleAndCaseHasSeqExpWithFamily(tx *gorm.DB) *gorm.DB {
	caseIDColumn := fmt.Sprintf("%s.case_id", types.CaseHasSequencingExperimentTable.Alias)
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s", j.name(types.FamilyTable, tx), types.FamilyTable.Alias, SampleToFamilyJoinCondition(caseIDColumn)))
}

func (j Joiner) SampleAndCaseWithFamily(tx *gorm.DB) *gorm.DB {
	caseIDColumn := fmt.Sprintf("%s.id", types.CaseTable.Alias)
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s", j.name(types.FamilyTable, tx), types.FamilyTable.Alias, SampleToFamilyJoinCondition(caseIDColumn)))
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

func (j Joiner) FamilyWithFetus(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.fetus_id=%s.id", j.name(types.FetusTable, tx), types.FetusTable.Alias, types.FamilyTable.Alias, types.FetusTable.Alias))
}

func (j Joiner) SampleWithPatient(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.id=%s.patient_id", j.name(types.PatientTable, tx), types.PatientTable.Alias, types.PatientTable.Alias, types.SampleTable.Alias))
}

func (j Joiner) SampleWithFetus(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.id=%s.fetus_id", j.name(types.FetusTable, tx), types.FetusTable.Alias, types.FetusTable.Alias, types.SampleTable.Alias))
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
