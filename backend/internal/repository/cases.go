package repository

import (
	"fmt"
	"log"
	"sort"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"gorm.io/gorm"
)

type Case = types.Case
type CaseResult = types.CaseResult
type AutocompleteResult = types.AutocompleteResult
type CaseFilters = types.CaseFilters
type CaseEntity = types.CaseEntity
type CaseAssay = types.CaseAssay
type CasePatientClinicalInformation = types.CasePatientClinicalInformation
type CaseTask = types.CaseTask

type CasesRepository struct {
	db *gorm.DB
}

type CasesDAO interface {
	SearchCases(userQuery types.ListQuery) (*[]CaseResult, *int64, error)
	SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	GetCasesFilters(userQuery types.AggQuery) (*CaseFilters, error)
	GetCaseEntity(caseId int) (*CaseEntity, error)
}

func NewCasesRepository(db *gorm.DB) *CasesRepository {
	if db == nil {
		log.Print("CasesRepository: db is nil")
		return nil
	}
	return &CasesRepository{db: db}
}

func (r *CasesRepository) SearchCases(userQuery types.ListQuery) (*[]CaseResult, *int64, error) {
	var cases []CaseResult
	var count int64

	tx, err := prepareQuery(userQuery, r)
	if err != nil {
		return nil, nil, fmt.Errorf("error during query preparation %w", err)
	}
	var columns = sliceutils.Map(userQuery.SelectedFields(), func(field types.Field, index int, slice []types.Field) string {
		return fmt.Sprintf("%s.%s as %s", field.Table.Alias, field.Name, field.GetAlias())
	})

	columns = append(columns, "CASE WHEN c.case_type_code = 'somatic' OR members_count.distinct_members_count = 1 THEN c.case_type_code ELSE CONCAT(c.case_type_code, '_family') END AS case_type")
	columns = append(columns, "se.task_id IS NOT NULL AS has_variants")
	if err = tx.Count(&count).Error; err != nil {
		return nil, nil, fmt.Errorf("error counting cases: %w", err)
	}

	txSeqExp := r.db.Table("staging_sequencing_experiment se")
	txSeqExp = txSeqExp.Select("se.task_id, tctx.case_id")
	txSeqExp = txSeqExp.Where("ingested_at IS NOT NULL AND task_type = 'radiant_germline_annotation'")
	txSeqExp.Joins(fmt.Sprintf("LEFT JOIN %s tctx ON tctx.task_id = se.task_id", types.TaskContextTable.Name))

	txMembersCount := r.db.Table(types.FamilyTable.Name).Select("case_id, count(distinct family_member_id) as distinct_members_count").Group("case_id")

	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) se ON se.case_id=%s.id", types.CaseTable.Alias), txSeqExp)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) members_count ON members_count.case_id = %s.id", types.CaseTable.Alias), txMembersCount)
	tx = tx.Select(columns)
	utils.AddLimitAndSort(tx, userQuery)

	if err = tx.Find(&cases).Error; err != nil {
		return nil, nil, fmt.Errorf("error fetching cases: %w", err)
	}
	return &cases, &count, nil
}

func (r *CasesRepository) SearchById(prefix string, limit int) (*[]AutocompleteResult, error) {
	/**
	  	(SELECT "case_id" as type, id as value from `radiant_jdbc`.`public`.`cases` WHERE CAST(id AS TEXT) LIKE '1%')
	    UNION
	    (SELECT "patient_id" as type, proband_id as value from `radiant_jdbc`.`public`.`cases` WHERE CAST(proband_id AS TEXT) LIKE '1%')
	    UNION
	    (SELECT "mrn" as type, submitter_patient_id as value from `radiant_jdbc`.`public`.`patient` WHERE submitter_patient_id LIKE '1%')
	    ORDER BY value asc;
	*/
	var autocompleteResult []AutocompleteResult
	searchInput := fmt.Sprintf("%s%%", prefix)
	subQueryCaseId := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryProbandId := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.Name, types.PatientTable.Alias))
	subQueryProbandId = subQueryProbandId.Select("\"patient_id\" as type, id as value")
	subQueryProbandId = subQueryProbandId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryOrgPatID := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.Name, types.PatientTable.Alias))
	subQueryOrgPatID = subQueryOrgPatID.Select("submitter_patient_id_type as type, submitter_patient_id as value")
	subQueryOrgPatID = subQueryOrgPatID.Where("LOWER(submitter_patient_id) LIKE ?", strings.ToLower(searchInput))

	tx := r.db.Table("(? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryOrgPatID)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for case autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *CasesRepository) GetCasesFilters(query types.AggQuery) (*CaseFilters, error) {

	var status []Aggregation
	var priority []Aggregation
	var caseAnalysis []Aggregation
	var project []Aggregation
	var orderingOrg []Aggregation
	var diagnosisLab []Aggregation

	txCases, err := prepareQuery(query, r)
	if err != nil {
		return nil, fmt.Errorf("error during query preparation %w", err)
	}
	txCases = txCases.Select("c.id, c.status_code, c.priority_code, c.analysis_catalog_id, c.project_id, c.diagnosis_lab_id, c.ordering_organization_id")

	if err := r.getCasesFilter(txCases, &status, types.StatusTable, "status_code", "code", "name_en", nil); err != nil {
		return nil, err
	}

	if err := r.getCasesFilter(txCases, &priority, types.PriorityTable, "priority_code", "code", "name_en", nil); err != nil {
		return nil, err
	}

	if err := r.getCasesFilter(txCases, &caseAnalysis, types.AnalysisCatalogTable, "analysis_catalog_id", "id", "name", nil); err != nil {
		return nil, err
	}

	if err := r.getCasesFilter(txCases, &project, types.ProjectTable, "project_id", "id", "name", nil); err != nil {
		return nil, err
	}

	isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.DiagnosisLabTable.Alias)
	if err := r.getCasesFilter(txCases, &diagnosisLab, types.DiagnosisLabTable, "diagnosis_lab_id", "id", "name", &isDiagnosisLabCondition); err != nil {
		return nil, err
	}

	if err := r.getCasesFilter(txCases, &orderingOrg, types.OrderingOrganizationTable, "ordering_organization_id", "id", "name", nil); err != nil {
		return nil, err
	}

	return &CaseFilters{
		Status:               status,
		Priority:             priority,
		CaseAnalysis:         caseAnalysis,
		Project:              project,
		DiagnosisLab:         diagnosisLab,
		OrderingOrganization: orderingOrg,
	}, nil
}

func (r *CasesRepository) GetCaseEntity(caseId int) (*CaseEntity, error) {
	caseEntity, err := r.retrieveCaseLevelData(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching case level data: %w", err)
	}

	assays, err := r.retrieveCaseAssays(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching assays data: %w", err)
	}
	caseEntity.Assays = *assays

	members, err := r.retrieveCasePatients(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching members data: %w", err)
	}
	caseEntity.Members = *members

	tasks, err := r.retrieveCaseTasks(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching tasks: %w", err)
	}
	caseEntity.Tasks = *tasks

	caseType := calculateCaseType(*caseEntity)
	caseEntity.CaseType = caseType

	return caseEntity, nil
}

func (r *CasesRepository) getCasesFilter(txCases *gorm.DB, destination *[]Aggregation, filterTable types.Table, casesJoinColumn string, filterJoinColumn string, filterLabelColumn string, filterCondition *string) error {
	tx := r.db.Table(fmt.Sprintf("%s %s", filterTable.Name, filterTable.Alias))
	tx = tx.Select(fmt.Sprintf("%s.code as bucket, %s.%s as label, count(distinct cases.id) as count", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) cases ON cases.%s = %s.%s", casesJoinColumn, filterTable.Alias, filterJoinColumn), txCases)

	tx = tx.Group(fmt.Sprintf("%s.code, %s.%s", filterTable.Alias, filterTable.Alias, filterLabelColumn))
	tx = tx.Order("count desc, bucket asc")
	if filterCondition != nil {
		tx = tx.Where(*filterCondition)
	}
	if err := tx.Find(destination).Error; err != nil {
		return fmt.Errorf("error fetching filter %s: %w", filterTable.Name, err)
	}
	return nil
}

func prepareQuery(userQuery types.Query, r *CasesRepository) (*gorm.DB, error) {
	tx := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	tx = utils.JoinWithProband(tx, userQuery)
	tx = utils.JoinWithAnalysisCatalog(tx)
	tx = utils.JoinWithProject(tx)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)

		if userQuery.HasFieldFromTables(types.OrderingOrganizationTable) {
			tx = utils.JoinWithOrderingOrganization(tx)
		}

		if userQuery.HasFieldFromTables(types.DiagnosisLabTable) {
			tx = utils.JoinWithDiagnosisLab(tx)
		}

		if userQuery.HasFieldFromTables(types.MondoTable) {
			tx = utils.JoinWithMondoTerm(tx)
		}

		if userQuery.HasFieldFromTables(types.PatientTable) {
			tx = utils.JoinWithPatients(tx)
		}
	}
	return tx, nil
}

func (r *CasesRepository) retrieveCaseLevelData(caseId int) (*CaseEntity, error) {
	var caseEntity CaseEntity

	txCase := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	txCase = utils.JoinWithAnalysisCatalog(txCase)
	txCase = utils.JoinWithMondoTerm(txCase)
	txCase = utils.JoinWithDiagnosisLab(txCase)
	txCase = utils.JoinWithOrderingOrganization(txCase)
	txCase = utils.JoinWithProject(txCase)
	txCase = txCase.Select("c.id as case_id, c.proband_id, c.case_type_code as case_type_code, ca.code as analysis_catalog_code, ca.name as analysis_catalog_name, c.created_on, c.updated_on, c.note, mondo.id as primary_condition_id, mondo.name as primary_condition_name, lab.code as diagnosis_lab_code, lab.name as diagnosis_lab_name, c.status_code, order_org.code as ordering_organization_code, order_org.name as ordering_organization_name, c.priority_code, c.ordering_physician as prescriber, prj.code as project_code, prj.name as project_name")
	txCase = txCase.Where("c.id = ?", caseId)
	if err := txCase.Find(&caseEntity).Error; err != nil {
		return nil, fmt.Errorf("error fetching case entity: %w", err)
	}

	return &caseEntity, nil
}

func (r *CasesRepository) retrieveCaseAssays(caseId int) (*[]CaseAssay, error) {
	var assays []CaseAssay

	txSeqExp := r.db.Table(fmt.Sprintf("%s %s", types.CaseHasSequencingExperimentTable.Name, types.CaseHasSequencingExperimentTable.Alias))
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.sequencing_experiment s ON s.id = chseq.sequencing_experiment_id")
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.sample spl ON spl.id = s.sample_id")
	txSeqExp = txSeqExp.Joins("LEFT JOIN radiant_jdbc.public.family f ON spl.patient_id = f.family_member_id AND chseq.case_id = f.case_id")
	txSeqExp = txSeqExp.Joins("LEFT JOIN staging_sequencing_experiment se on s.id = se.seq_id and se.ingested_at is not null")
	txSeqExp = txSeqExp.Select("s.id as seq_id, spl.patient_id, f.relationship_to_proband_code as relationship_to_proband, f.affected_status_code, s.sample_id, spl.submitter_sample_id as sample_submitter_id, spl.type_code as sample_type_code, spl.histology_code, s.status_code, s.updated_on, s.experimental_strategy_code, se.seq_id is not null as has_variants")
	txSeqExp = txSeqExp.Where("chseq.case_id = ?", caseId)
	txSeqExp = txSeqExp.Order("affected_status_code asc, s.run_date desc, relationship_to_proband desc")
	if err := txSeqExp.Find(&assays).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments: %w", err)
	}
	return &assays, nil
}

func (r *CasesRepository) retrieveCasePatients(caseId int) (*[]CasePatientClinicalInformation, error) {
	var members []CasePatientClinicalInformation
	var phenotypeObsCategoricals []types.PhenotypeObsCategorical

	txMembers := r.db.Table(fmt.Sprintf("%s %s", types.FamilyTable.Name, types.FamilyTable.Alias))
	txMembers = txMembers.Joins("LEFT JOIN `radiant_jdbc`.`public`.`patient` p ON p.id = f.family_member_id")
	txMembers = txMembers.Joins("LEFT JOIN `radiant_jdbc`.`public`.`organization` mgmt_org on p.organization_id = mgmt_org.id")
	txMembers = txMembers.Where("f.case_id = ?", caseId)
	txMembers = txMembers.Order("affected_status_code asc, relationship_to_proband_code desc")
	txMembers = txMembers.Select("p.id as patient_id, f.affected_status_code, f.relationship_to_proband_code as relationship_to_proband, p.date_of_birth, p.sex_code, p.submitter_patient_id, mgmt_org.code as organization_code, mgmt_org.name as organization_name")
	if err := txMembers.Find(&members).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case members: %w", err)
	}

	txObservations := r.db.Table(fmt.Sprintf("%s %s", types.ObsCategoricalTable.Name, types.ObsCategoricalTable.Alias))
	txObservations = txObservations.Joins("LEFT JOIN hpo_term hpo ON obs.observation_code = 'phenotype' AND hpo.id = obs.code_value")
	txObservations = txObservations.Where("obs.observation_code = 'phenotype' AND obs.case_id = ?", caseId)
	txObservations = txObservations.Order("phenotype_name asc")
	txObservations = txObservations.Select("obs.patient_id, hpo.id as phenotype_id, hpo.name as phenotype_name, obs.onset_code, obs.interpretation_code")
	if err := txObservations.Find(&phenotypeObsCategoricals).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case phenotypes: %w", err)
	}

	phenotypesPerPatient := utils.GroupByProperty(phenotypeObsCategoricals, func(p types.PhenotypeObsCategorical) int {
		return p.PatientID
	})

	for i, m := range members {
		members[i].ObservedPhenotypes = make(types.JsonArray[types.Term], 0)
		members[i].NonObservedPhenotypes = make(types.JsonArray[types.Term], 0)

		phenotypes, ok := phenotypesPerPatient[m.PatientID]

		if ok {
			for _, phenotype := range phenotypes {
				term := types.Term{
					ID:        phenotype.PhenotypeID,
					Name:      phenotype.PhenotypeName,
					OnsetCode: phenotype.OnsetCode,
				}

				if phenotype.InterpretationCode == "positive" {
					members[i].ObservedPhenotypes = append(members[i].ObservedPhenotypes, term)
				} else {
					members[i].NonObservedPhenotypes = append(members[i].NonObservedPhenotypes, term)
				}
			}
		}
	}

	return &members, nil
}

func (r *CasesRepository) retrieveCaseTasks(caseId int) (*[]CaseTask, error) {
	var tasks []CaseTask
	tx := r.db.Table("radiant_jdbc.public.task_context tctx")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.case_has_sequencing_experiment chseq ON tctx.sequencing_experiment_id = chseq.sequencing_experiment_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.task t ON t.id = tctx.task_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.task_type tt ON t.task_type_code = tt.code")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.sequencing_experiment s ON s.id = tctx.sequencing_experiment_id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.sample spl ON s.sample_id = spl.id")
	tx = tx.Joins("LEFT JOIN radiant_jdbc.public.family f ON f.family_member_id = spl.patient_id AND f.case_id = ?", caseId)
	tx = tx.Where("(tctx.case_id = ? OR tctx.case_id IS NULL) AND chseq.case_id = ?", caseId, caseId)
	tx = tx.Select("t.id, t.task_type_code as type_code, t.created_on, tt.name_en as type_name, group_concat(f.relationship_to_proband_code) as patients_unparsed, count(distinct spl.patient_id) as patient_count")
	tx = tx.Group("t.id, t.task_type_code, t.created_on, tt.type_name")
	tx = tx.Order("t.id asc")

	if err := tx.Find(&tasks).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case tasks: %w", err)
	}

	println(len(tasks))

	for i, task := range tasks {
		patients := utils.SplitRemoveEmptyString(task.PatientsUnparsed, ",")
		sort.Strings(patients)
		tasks[i].Patients = patients
	}

	return &tasks, nil
}

func (r *CasesRepository) retrieveCasesFamilyMembersIds(caseId int) ([]int, error) {
	var familyMembersIds []int
	txFamilyMembersID := r.db.Table(fmt.Sprintf("%s %s", types.FamilyTable.Name, types.FamilyTable.Alias))
	txFamilyMembersID = txFamilyMembersID.Where("f.case_id = ?", caseId)
	if err := txFamilyMembersID.Distinct("f.family_member_id").Find(&familyMembersIds).Error; err != nil {
		return nil, fmt.Errorf("error retrieving family members ids: %w", err)
	}
	return familyMembersIds, nil
}

func calculateCaseType(caseEntity CaseEntity) string {
	if caseEntity.CaseTypeCode == "somatic" || len(caseEntity.Members) == 1 {
		return caseEntity.CaseTypeCode
	} else {
		return fmt.Sprintf("%s_family", caseEntity.CaseTypeCode)
	}
}
