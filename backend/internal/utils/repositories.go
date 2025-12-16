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
			tx = tx.Limit(l).Offset(userQuery.Pagination().PageIndex * l)
		} else {
			tx = tx.Limit(l).Offset(userQuery.Pagination().Offset)
		}
	} else {
		tx = tx.Limit(MinLimit)
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
	tx := db.Table("`radiant_jdbc`.`public`.`obs_categorical` obs")
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

func JoinCaseWithProband(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	joinWithProbandSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", types.ProbandTable.FederationName, types.ProbandTable.Alias, types.CaseTable.Alias, types.ProbandTable.Alias)
	joinWithProbandManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_id=%s.id", types.ManagingOrganizationTable.FederationName, types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithProbandSql).Joins(joinWithProbandManagingOrganizationSql)
	}
	return tx.Joins(joinWithProbandSql)
}

func JoinCaseWithPatients(tx *gorm.DB) *gorm.DB {
	joinWithFamily := fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias)
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.FederationName, types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias)
	return tx.Joins(joinWithFamily).Joins(joinWithPatientSql)
}

func JoinCaseWithAnalysisCatalog(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.analysis_catalog_id=%s.id", types.AnalysisCatalogTable.FederationName, types.AnalysisCatalogTable.Alias, types.CaseTable.Alias, types.AnalysisCatalogTable.Alias))
}

func JoinCaseWithCaseCategory(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_category_code=%s.code", types.CaseCategoryTable.FederationName, types.CaseCategoryTable.Alias, types.CaseTable.Alias, types.CaseCategoryTable.Alias))
}

func JoinAnalysisCatalogWithPanel(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.panel_id=%s.id", types.PanelTable.FederationName, types.PanelTable.Alias, types.AnalysisCatalogTable.Alias, types.PanelTable.Alias))
}

func JoinCaseWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.FederationName, types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func JoinCaseWithDiagnosisLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.diagnosis_lab_id=%s.id", types.SequencingLabTable.FederationName, types.SequencingLabTable.Alias, types.CaseTable.Alias, types.SequencingLabTable.Alias))
}

func JoinCaseWithMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", types.MondoTable.Name, types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func JoinDocumentWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id AND %s.type = 'output'", types.TaskHasDocumentTable.FederationName, types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinCaseHasSeqExpWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.FederationName, types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func JoinSeqExpWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.FederationName, types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func JoinSampleAndCaseHasSeqExpWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func JoinSampleAndTaskContextWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.TaskContextTable.Alias))
}

func JoinSampleAndCaseWithFamily(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias))
}

func JoinCaseWithOrderingOrganization(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_id=%s.id", types.OrderingOrganizationTable.FederationName, types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias))
}

func JoinSeqExpWithSequencingLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_lab_id=%s.id", types.SequencingLabTable.FederationName, types.SequencingLabTable.Alias, types.SequencingExperimentTable.Alias, types.SequencingLabTable.Alias))
}

func JoinTaskHasDocWithTaskContext(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskContextTable.FederationName, types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinTaskContextWithTaskHasDoc(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskHasDocumentTable.FederationName, types.TaskHasDocumentTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinTaskContextWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.sequencing_experiment_id", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias))
}

func JoinTaskContextWithSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias, types.TaskContextTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinTaskContextWithTask(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.id", types.TaskTable.FederationName, types.TaskTable.Alias, types.TaskContextTable.Alias, types.TaskTable.Alias))
}

func JoinCaseHasSeqExpWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinTaskHasDocWithDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id", types.DocumentTable.FederationName, types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func JoinFamilyWithPatient(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.FederationName, types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias))
}

func JoinPatientWithManagingOrg(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_id=%s.id", types.ManagingOrganizationTable.FederationName, types.ManagingOrganizationTable.Alias, types.PatientTable.Alias, types.ManagingOrganizationTable.Alias))
}

func JoinGermlineInterpretationWithSnvOccurrence(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_id = %s.seq_id and %s.locus_id = %s.locus_id", types.GermlineSNVOccurrenceTable.Name, types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias, types.InterpretationGermlineTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func JoinGermlineInterpretationWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id = %s.id", types.CaseTable.FederationName, types.CaseTable.Alias, types.InterpretationGermlineTable.Alias, types.CaseTable.Alias))
}

func JoinGermlineSNVOccurrenceWithSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.id = %s.seq_id", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func JoinGermlineSNVOccurrenceWithCaseHasSeqExp(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_experiment_id = %s.seq_id", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func JoinCaseHasSeqExpWithGermlineSnvOccurrence(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_experiment_id = %s.seq_id", types.GermlineSNVOccurrenceTable.Name, types.GermlineSNVOccurrenceTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.GermlineSNVOccurrenceTable.Alias))
}

func JoinGermlineInterpretationWithVariant(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.locus_id = %s.locus_id", types.VariantTable.Name, types.VariantTable.Alias, types.VariantTable.Alias, types.InterpretationGermlineTable.Alias))
}

func AntiJoinCaseHasSeqExpWithGermlineInterpretationForLocus(tx *gorm.DB, locusIdString string) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT ANTI JOIN %s %s ON %s.locus_id = ? AND %s.sequencing_id = %s.sequencing_experiment_id AND %s.case_id = %s.case_id", types.InterpretationGermlineTable.FederationName, types.InterpretationGermlineTable.Alias, types.InterpretationGermlineTable.Alias, types.InterpretationGermlineTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.InterpretationGermlineTable.Alias, types.CaseHasSequencingExperimentTable.Alias), locusIdString)
}
