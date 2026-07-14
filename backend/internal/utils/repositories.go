package utils

import (
	"context"
	"fmt"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	MinLimit = 10
	MaxLimit = 200
)

// CtxOf returns the context carried on the query or context.Background() when none is bound.
// Useful to infer table qualification (tenant or shared).
func CtxOf(tx *gorm.DB) context.Context {
	if tx == nil || tx.Statement == nil || tx.Statement.Context == nil {
		return context.Background()
	}
	return tx.Statement.Context
}

func AddSort(tx *gorm.DB, userQuery types.ListQuery) {
	for _, sort := range userQuery.SortedFields() {
		s := fmt.Sprintf("%s.%s %s", sort.Field.Table.Alias, sort.Field.GetName(), sort.Order)
		tx = tx.Order(s)
	}
}

func AddWhere(userQuery types.Query, tx *gorm.DB) {
	if userQuery.Filters() != nil {
		filters, params := userQuery.Filters().ToSQL(nil)
		tx.Where(filters, params...)
	}
}

func AddLimit(tx *gorm.DB, userQuery types.ListQuery) {
	if userQuery.Pagination() != nil {
		var l int
		if userQuery.Pagination().Limit < MaxLimit {
			l = userQuery.Pagination().Limit
		} else {
			l = MaxLimit
		}
		if userQuery.Pagination().PageIndex != 0 {
			tx.Limit(l).Offset(userQuery.Pagination().PageIndex * l)
		} else {
			tx.Limit(l).Offset(userQuery.Pagination().Offset)
		}
	} else {
		tx.Limit(MinLimit)
	}
}

func AddLimitAndSort(tx *gorm.DB, userQuery types.ListQuery) {
	AddLimit(tx, userQuery)
	AddSort(tx, userQuery)
}

func GetDistinctTablesFromFields(fields []types.Field) []types.Table {
	tables := sliceutils.Unique(sliceutils.Map(fields, func(field types.Field, index int, slice []types.Field) types.Table {
		return field.Table
	}))
	return tables
}

func GetAggregatedPhenotypes(db *gorm.DB) *gorm.DB {
	tx := db.Table(fmt.Sprintf("%s obs", types.ObsCategoricalTable.TenantQualifiedName(CtxOf(db))))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s hpo ON hpo.id = obs.code_value", types.HPOTable.TenantQualifiedName(CtxOf(db))))
	tx = tx.Where("obs.observation_code = 'phenotype' AND obs.interpretation_code = 'positive'")
	tx = tx.Group("case_id, patient_id")
	tx = tx.Select("obs.case_id as case_id, obs.patient_id as patient_id, GROUP_CONCAT(CONCAT(hpo.id,'__',hpo.name) SEPARATOR '|') as phenotypes_term")

	return tx
}

func GetSequencingPart(seqId int, db *gorm.DB) (int, error) {
	tx := db.Table(types.SequencingTable.TenantQualifiedName(CtxOf(db))).Where("seq_id = ?", seqId).Select("part")
	var part int
	if err := tx.Scan(&part).Error; err != nil {
		return part, fmt.Errorf("error fetching part: %w", err)
	}
	return part, nil
}

func GetFilter(db *gorm.DB, filterTable types.Table, filterLabelColumn string, filterCondition *string) ([]types.FiltersValue, error) {
	var filter []types.FiltersValue
	tx := db.Table(fmt.Sprintf("%s %s", filterTable.TenantQualifiedName(CtxOf(db)), filterTable.Alias))
	tx = tx.Select(fmt.Sprintf("%s.code as `key`, %s.%s as label", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	tx = tx.Order("`key` asc")
	if filterCondition != nil {
		tx = tx.Where(*filterCondition)
	}

	if err := tx.Find(&filter).Error; err != nil {
		return nil, fmt.Errorf("error fetching filter %s: %w", filterTable.Name, err)
	}
	return filter, nil
}

func JoinCaseWithProband(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	ctx := CtxOf(tx)
	joinWithProbandSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", types.ProbandTable.TenantQualifiedName(ctx), types.ProbandTable.Alias, types.CaseTable.Alias, types.ProbandTable.Alias)
	joinWithProbandManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_code=%s.code AND %s.tenant_code=%s.tenant_code", types.ManagingOrganizationTable.TenantQualifiedName(ctx), types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithProbandSql).Joins(joinWithProbandManagingOrganizationSql)
	}
	return tx.Joins(joinWithProbandSql)
}

func JoinCaseWithPatients(tx *gorm.DB) *gorm.DB {
	ctx := CtxOf(tx)
	joinWithFamily := fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", types.FamilyTable.TenantQualifiedName(ctx), types.FamilyTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias)
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.TenantQualifiedName(ctx), types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias)
	return tx.Joins(joinWithFamily).Joins(joinWithPatientSql)
}

func JoinCaseWithAnalysisCatalog(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.analysis_catalog_id=%s.id", types.AnalysisCatalogTable.TenantQualifiedName(CtxOf(tx)), types.AnalysisCatalogTable.Alias, types.CaseTable.Alias, types.AnalysisCatalogTable.Alias))
}

func JoinCaseWithCaseCategory(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_category_code=%s.code", types.CaseCategoryTable.TenantQualifiedName(CtxOf(tx)), types.CaseCategoryTable.Alias, types.CaseTable.Alias, types.CaseCategoryTable.Alias))
}

func JoinAnalysisCatalogWithPanel(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.panel_id=%s.id", types.PanelTable.TenantQualifiedName(CtxOf(tx)), types.PanelTable.Alias, types.AnalysisCatalogTable.Alias, types.PanelTable.Alias))
}

func JoinCaseWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.TenantQualifiedName(CtxOf(tx)), types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func JoinCaseWithDiagnosisLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.diagnosis_lab_code=%s.code AND %s.tenant_code=%s.tenant_code", types.SequencingLabTable.TenantQualifiedName(CtxOf(tx)), types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias))
}

func JoinCaseWithMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", types.MondoTable.TenantQualifiedName(CtxOf(tx)), types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func JoinDocumentWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id AND %s.type = 'output'", types.TaskHasDocumentTable.TenantQualifiedName(CtxOf(tx)), types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinCaseHasSeqExpWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.TenantQualifiedName(CtxOf(tx)), types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func JoinCaseWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.id=%s.case_id", types.CaseHasSequencingExperimentTable.TenantQualifiedName(CtxOf(tx)), types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func JoinSeqExpWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.TenantQualifiedName(CtxOf(tx)), types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func JoinSampleAndCaseHasSeqExpWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.TenantQualifiedName(CtxOf(tx)), types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func JoinSampleAndCaseWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.id", types.FamilyTable.TenantQualifiedName(CtxOf(tx)), types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias))
}

func JoinCaseWithOrderingOrganization(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_code=%s.code AND %s.tenant_code=%s.tenant_code", types.OrderingOrganizationTable.TenantQualifiedName(CtxOf(tx)), types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias))
}

func JoinSeqExpWithSequencingLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_lab_code=%s.code AND %s.tenant_code=%s.tenant_code", types.SequencingLabTable.TenantQualifiedName(CtxOf(tx)), types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias))
}

func JoinTaskHasDocWithTaskContext(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskContextTable.TenantQualifiedName(CtxOf(tx)), types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinTaskContextWithTaskHasDoc(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskHasDocumentTable.TenantQualifiedName(CtxOf(tx)), types.TaskHasDocumentTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinTaskContextWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.sequencing_experiment_id AND (%s.case_id = %s.case_id OR %s.case_id IS NULL)", types.CaseHasSequencingExperimentTable.TenantQualifiedName(CtxOf(tx)), types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.TaskContextTable.Alias))
}

func JoinTaskContextWithSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.TenantQualifiedName(CtxOf(tx)), types.SequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinTaskContextWithTask(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.id", types.TaskTable.TenantQualifiedName(CtxOf(tx)), types.TaskTable.Alias, types.TaskContextTable.Alias, types.TaskTable.Alias))
}

func JoinCaseHasSeqExpWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.TenantQualifiedName(CtxOf(tx)), types.SequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinTaskHasDocWithDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id", types.DocumentTable.TenantQualifiedName(CtxOf(tx)), types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func JoinFamilyWithPatient(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.TenantQualifiedName(CtxOf(tx)), types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias))
}

func JoinPatientWithManagingOrg(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_code=%s.code AND %s.tenant_code=%s.tenant_code", types.ManagingOrganizationTable.TenantQualifiedName(CtxOf(tx)), types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias))
}

func JoinGermlineInterpretationWithSNVOccurrence(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_id = %s.seq_id and %s.locus_id = %s.locus_id", types.GermlineSNVOccurrenceTable.TenantQualifiedName(CtxOf(tx)), types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func JoinGermlineInterpretationWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id = %s.id", types.CaseTable.TenantQualifiedName(CtxOf(tx)), types.CaseTable.Alias, types.InterpretationGermlineTable.Alias, types.CaseTable.Alias))
}
