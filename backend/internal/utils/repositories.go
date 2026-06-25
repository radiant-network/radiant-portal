package utils

import (
	"fmt"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

const (
	MinLimit = 10
	MaxLimit = 200
)

// tenantSchemaOf resolves the StarRocks schema for federated reads from the context carried
// on the query (set by RequireTenantAccess when the tenant-views read path is enabled). With
// no tenant bound it returns the radiant_jdbc federation, so the generated SQL is unchanged.
func tenantSchemaOf(tx *gorm.DB) string {
	if tx == nil || tx.Statement == nil || tx.Statement.Context == nil {
		return types.FederationSchema
	}
	return types.TenantSchema(tx.Statement.Context)
}

func AddSort(tx *gorm.DB, userQuery types.ListQuery) {
	for _, sort := range userQuery.SortedFields() {
		s := fmt.Sprintf("%s.%s %s", sort.Field.Table.Alias, sort.Field.GetName(), sort.Order)
		tx = tx.Order(s)
	}
}
func AddGroupBy(tx *gorm.DB, fields []types.Field) {
	for _, field := range fields {
		s := fmt.Sprintf("%s.%s", field.Table.Alias, field.GetName())
		tx = tx.Group(s)
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
	tx := db.Table(fmt.Sprintf("%s obs", types.ObsCategoricalTable.In(tenantSchemaOf(db))))
	tx = tx.Joins("LEFT JOIN hpo_term hpo ON hpo.id = obs.code_value")
	tx = tx.Where("obs.observation_code = 'phenotype' AND obs.interpretation_code = 'positive'")
	tx = tx.Group("case_id, patient_id")
	tx = tx.Select("obs.case_id as case_id, obs.patient_id as patient_id, GROUP_CONCAT(CONCAT(hpo.id,'__',hpo.name) SEPARATOR '|') as phenotypes_term")

	return tx
}

func GetSequencingPart(seqId int, db *gorm.DB) (int, error) {
	tx := db.Table("staging_sequencing_experiment").Where("seq_id = ?", seqId).Select("part")
	var part int
	if err := tx.Scan(&part).Error; err != nil {
		return part, fmt.Errorf("error fetching part: %w", err)
	}
	return part, nil
}

func GetFilter(db *gorm.DB, filterTable types.Table, filterLabelColumn string, filterCondition *string) ([]types.FiltersValue, error) {
	var filter []types.FiltersValue
	tx := db.Table(fmt.Sprintf("%s %s", filterTable.In(tenantSchemaOf(db)), filterTable.Alias))
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
	schema := tenantSchemaOf(tx)
	joinWithProbandSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", types.ProbandTable.In(schema), types.ProbandTable.Alias, types.CaseTable.Alias, types.ProbandTable.Alias)
	joinWithProbandManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_code=%s.code AND %s.tenant_code=%s.tenant_code", types.ManagingOrganizationTable.In(schema), types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithProbandSql).Joins(joinWithProbandManagingOrganizationSql)
	}
	return tx.Joins(joinWithProbandSql)
}

func JoinCaseWithPatients(tx *gorm.DB) *gorm.DB {
	schema := tenantSchemaOf(tx)
	joinWithFamily := fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", types.FamilyTable.In(schema), types.FamilyTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias)
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.In(schema), types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias)
	return tx.Joins(joinWithFamily).Joins(joinWithPatientSql)
}

func JoinCaseWithAnalysisCatalog(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.analysis_catalog_id=%s.id", types.AnalysisCatalogTable.In(tenantSchemaOf(tx)), types.AnalysisCatalogTable.Alias, types.CaseTable.Alias, types.AnalysisCatalogTable.Alias))
}

func JoinCaseWithCaseCategory(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_category_code=%s.code", types.CaseCategoryTable.In(tenantSchemaOf(tx)), types.CaseCategoryTable.Alias, types.CaseTable.Alias, types.CaseCategoryTable.Alias))
}

func JoinAnalysisCatalogWithPanel(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.panel_id=%s.id", types.PanelTable.In(tenantSchemaOf(tx)), types.PanelTable.Alias, types.AnalysisCatalogTable.Alias, types.PanelTable.Alias))
}

func JoinCaseWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.In(tenantSchemaOf(tx)), types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func JoinCaseWithDiagnosisLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.diagnosis_lab_code=%s.code AND %s.tenant_code=%s.tenant_code", types.SequencingLabTable.In(tenantSchemaOf(tx)), types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias))
}

func JoinCaseWithMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", types.MondoTable.Name, types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func JoinDocumentWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id AND %s.type = 'output'", types.TaskHasDocumentTable.In(tenantSchemaOf(tx)), types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinCaseHasSeqExpWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.In(tenantSchemaOf(tx)), types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func JoinCaseWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.id=%s.case_id", types.CaseHasSequencingExperimentTable.In(tenantSchemaOf(tx)), types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func JoinSeqExpWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.In(tenantSchemaOf(tx)), types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func JoinSampleAndCaseHasSeqExpWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.In(tenantSchemaOf(tx)), types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func JoinSampleAndCaseWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.id", types.FamilyTable.In(tenantSchemaOf(tx)), types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias))
}

func JoinCaseWithOrderingOrganization(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_code=%s.code AND %s.tenant_code=%s.tenant_code", types.OrderingOrganizationTable.In(tenantSchemaOf(tx)), types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias))
}

func JoinSeqExpWithSequencingLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_lab_code=%s.code AND %s.tenant_code=%s.tenant_code", types.SequencingLabTable.In(tenantSchemaOf(tx)), types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias))
}

func JoinTaskHasDocWithTaskContext(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskContextTable.In(tenantSchemaOf(tx)), types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinTaskContextWithTaskHasDoc(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskHasDocumentTable.In(tenantSchemaOf(tx)), types.TaskHasDocumentTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinTaskContextWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.sequencing_experiment_id AND (%s.case_id = %s.case_id OR %s.case_id IS NULL)", types.CaseHasSequencingExperimentTable.In(tenantSchemaOf(tx)), types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.TaskContextTable.Alias))
}

func JoinTaskContextWithSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.In(tenantSchemaOf(tx)), types.SequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinTaskContextWithTask(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.id", types.TaskTable.In(tenantSchemaOf(tx)), types.TaskTable.Alias, types.TaskContextTable.Alias, types.TaskTable.Alias))
}

func JoinCaseHasSeqExpWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.In(tenantSchemaOf(tx)), types.SequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinTaskHasDocWithDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id", types.DocumentTable.In(tenantSchemaOf(tx)), types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func JoinFamilyWithPatient(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.In(tenantSchemaOf(tx)), types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias))
}

func JoinPatientWithManagingOrg(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_code=%s.code AND %s.tenant_code=%s.tenant_code", types.ManagingOrganizationTable.In(tenantSchemaOf(tx)), types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias))
}

func JoinGermlineInterpretationWithSNVOccurrence(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_id = %s.seq_id and %s.locus_id = %s.locus_id", types.GermlineSNVOccurrenceTable.Name, types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func JoinGermlineInterpretationWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id = %s.id", types.CaseTable.In(tenantSchemaOf(tx)), types.CaseTable.Alias, types.InterpretationGermlineTable.Alias, types.CaseTable.Alias))
}
