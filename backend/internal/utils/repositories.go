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

func JoinWithProband(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	joinWithProbandSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", types.ProbandTable.FederationName, types.ProbandTable.Alias, types.CaseTable.Alias, types.ProbandTable.Alias)
	joinWithProbandManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_id=%s.id", types.ManagingOrganizationTable.FederationName, types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithProbandSql).Joins(joinWithProbandManagingOrganizationSql)
	}
	return tx.Joins(joinWithProbandSql)
}

func JoinWithPatients(tx *gorm.DB) *gorm.DB {
	joinWithFamily := fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.CaseTable.Alias)
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.id", types.PatientTable.FederationName, types.PatientTable.Alias, types.FamilyTable.Alias, types.PatientTable.Alias)
	return tx.Joins(joinWithFamily).Joins(joinWithPatientSql)
}

func JoinWithAnalysisCatalog(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.analysis_catalog_id=%s.id", types.AnalysisCatalogTable.FederationName, types.AnalysisCatalogTable.Alias, types.CaseTable.Alias, types.AnalysisCatalogTable.Alias))
}

func JoinWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.FederationName, types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func JoinWithDiagnosisLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.diagnosis_lab_id=%s.id", types.DiagnosisLabTable.FederationName, types.DiagnosisLabTable.Alias, types.CaseTable.Alias, types.DiagnosisLabTable.Alias))
}

func JoinWithMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", types.MondoTable.Name, types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func JoinWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.document_id=%s.id AND %s.type = 'output'", types.TaskHasDocumentTable.FederationName, types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.FederationName, types.CaseTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func JoinWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.FederationName, types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func JoinWithFamilyRelationship(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.FederationName, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SampleTable.Alias, types.FamilyTable.Alias, types.CaseHasSequencingExperimentTable.Alias))
}

func JoinWithOrderingOrganization(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_id=%s.id", types.OrderingOrganizationTable.FederationName, types.OrderingOrganizationTable.Alias, types.CaseTable.Alias, types.OrderingOrganizationTable.Alias))
}

func JoinWithTaskContext(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_id=%s.task_id", types.TaskContextTable.FederationName, types.TaskContextTable.Alias, types.TaskContextTable.Alias, types.TaskHasDocumentTable.Alias))
}

func JoinWithCaseHasSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.sequencing_experiment_id", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.TaskContextTable.Alias))
}

func JoinWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias, types.CaseHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}
