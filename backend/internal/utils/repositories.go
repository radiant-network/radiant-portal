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

func JoinWithRequest(tx *gorm.DB) *gorm.DB {
	joinWithRequestSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.request_id=%s.id", types.RequestTable.Name, types.RequestTable.Alias, types.CaseTable.Alias, types.RequestTable.Alias)
	joinWithOrderingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.ordering_organization_id=%s.id", types.OrderingOrganizationTable.Name, types.OrderingOrganizationTable.Alias, types.RequestTable.Alias, types.OrderingOrganizationTable.Alias)
	return tx.Joins(joinWithRequestSql).Joins(joinWithOrderingOrganizationSql)
}

func JoinWithProband(tx *gorm.DB, userQuery types.Query) *gorm.DB {
	joinWithProbandSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.proband_id=%s.id", types.ProbandTable.Name, types.ProbandTable.Alias, types.CaseTable.Alias, types.ProbandTable.Alias)
	joinWithProbandManagingOrganizationSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.organization_id=%s.id", types.ManagingOrganizationTable.Name, types.ManagingOrganizationTable.Alias, types.ProbandTable.Alias, types.ManagingOrganizationTable.Alias)
	if userQuery != nil && userQuery.HasFieldFromTables(types.ManagingOrganizationTable) {
		return tx.Joins(joinWithProbandSql).Joins(joinWithProbandManagingOrganizationSql)
	}
	return tx.Joins(joinWithProbandSql)
}

func JoinWithPatients(tx *gorm.DB) *gorm.DB {
	joinWithSeqExp := fmt.Sprintf("LEFT JOIN %s %s ON %s.case_id=%s.id", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias, types.CaseTable.Alias)
	joinWithPatientSql := fmt.Sprintf("LEFT JOIN %s %s ON %s.patient_id=%s.id", types.PatientTable.Name, types.PatientTable.Alias, types.SequencingExperimentTable.Alias, types.PatientTable.Alias)
	return tx.Joins(joinWithSeqExp).Joins(joinWithPatientSql)
}

func JoinWithCaseAnalysis(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.case_analysis_id=%s.id", types.CaseAnalysisTable.Name, types.CaseAnalysisTable.Alias, types.CaseTable.Alias, types.CaseAnalysisTable.Alias))
}

func JoinWithProject(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.project_id=%s.id", types.ProjectTable.Name, types.ProjectTable.Alias, types.CaseTable.Alias, types.ProjectTable.Alias))
}

func JoinWithPerformerLab(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.performer_lab_id=%s.id", types.PerformerLabTable.Name, types.PerformerLabTable.Alias, types.CaseTable.Alias, types.PerformerLabTable.Alias))
}

func JoinWithMondoTerm(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.primary_condition=%s.id", types.MondoTable.Name, types.MondoTable.Alias, types.CaseTable.Alias, types.MondoTable.Alias))
}

func JoinWithTaskHasDocument(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.document_id=%s.id", types.TaskHasDocumentTable.Name, types.TaskHasDocumentTable.Alias, types.TaskHasDocumentTable.Alias, types.DocumentTable.Alias))
}

func JoinWithTaskHasSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.task_id=%s.task_id", types.TaskHasSequencingExperimentTable.Name, types.TaskHasSequencingExperimentTable.Alias, types.TaskHasDocumentTable.Alias, types.TaskHasSequencingExperimentTable.Alias))
}

func JoinWithSequencingExperiment(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.sequencing_experiment_id=%s.id", types.SequencingExperimentTable.Name, types.SequencingExperimentTable.Alias, types.TaskHasSequencingExperimentTable.Alias, types.SequencingExperimentTable.Alias))
}

func JoinWithCase(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("INNER JOIN %s %s ON %s.case_id=%s.id", types.CaseTable.Name, types.CaseTable.Alias, types.SequencingExperimentTable.Alias, types.CaseTable.Alias))
}

func JoinWithSample(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.sample_id=%s.id", types.SampleTable.Name, types.SampleTable.Alias, types.SequencingExperimentTable.Alias, types.SampleTable.Alias))
}

func JoinWithFamilyRelationship(tx *gorm.DB) *gorm.DB {
	return tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.family_member_id=%s.patient_id AND %s.case_id = %s.case_id", types.FamilyTable.Name, types.FamilyTable.Alias, types.FamilyTable.Alias, types.SequencingExperimentTable.Alias, types.FamilyTable.Alias, types.SequencingExperimentTable.Alias))
}
