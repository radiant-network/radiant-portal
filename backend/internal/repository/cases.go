package repository

import (
	"errors"
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
type CaseSequencingExperiment = types.CaseSequencingExperiment
type CasePatientClinicalInformation = types.CasePatientClinicalInformation
type CaseTask = types.CaseTask
type AnalysisCatalog = types.AnalysisCatalog

type CasesRepository struct {
	db *gorm.DB
}

type CasesDAO interface {
	SearchCases(userQuery types.ListQuery) (*[]CaseResult, *int64, error)
	SearchById(prefix string, limit int) (*[]AutocompleteResult, error)
	GetCasesFilters(userQuery types.AggQuery) (*CaseFilters, error)
	GetCaseEntity(caseId int) (*CaseEntity, error)
	CreateCase(*Case) error
	CreateCaseHasSequencingExperiment(caseHasSeqExp *types.CaseHasSequencingExperiment) error
	GetCaseAnalysisCatalogIdByCode(code string) (*AnalysisCatalog, error)
	GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*Case, error)
}

func NewCasesRepository(db *gorm.DB) *CasesRepository {
	if db == nil {
		log.Print("CasesRepository: db is nil")
		return nil
	}
	return &CasesRepository{db: db}
}

func (r *CasesRepository) CreateCase(c *Case) error {
	return r.db.Create(c).Error
}

func (r *CasesRepository) CreateCaseHasSequencingExperiment(caseHasSeqExp *types.CaseHasSequencingExperiment) error {
	return r.db.Create(caseHasSeqExp).Error
}

func (r *CasesRepository) GetCaseAnalysisCatalogIdByCode(code string) (*AnalysisCatalog, error) {
	var analysisCatalog AnalysisCatalog
	tx := r.db.Table(types.AnalysisCatalogTable.Name).Where("code = ?", code)
	if err := tx.First(&analysisCatalog).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &analysisCatalog, nil
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
	columns = append(columns, "stg.case_id IS NOT NULL AS has_variants")
	if err = tx.Count(&count).Error; err != nil {
		return nil, nil, fmt.Errorf("error counting cases: %w", err)
	}

	txStg := r.db.Table(fmt.Sprintf("%s chse", types.CaseHasSequencingExperimentTable.FederationName))
	txStg = txStg.Select("DISTINCT(chse.case_id)")
	txStg = txStg.Where("se.ingested_at IS NOT NULL AND se.task_type = 'radiant_germline_annotation'")
	txStg.Joins(fmt.Sprintf("JOIN %s se ON se.seq_id = chse.sequencing_experiment_id", types.SequencingTable.Name))

	txMembersCount := r.db.Table(types.FamilyTable.FederationName).Select("case_id, count(distinct family_member_id) as distinct_members_count").Group("case_id")

	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) stg ON stg.case_id=%s.id", types.CaseTable.Alias), txStg)
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
		UNION
		(SELECT "sequencing_experiment_id" as type, id as value from radiant_jdbc.public.sequencing_experiment WHERE CAST(id AS TEXT) LIKE '1%')
	    ORDER BY value asc;
	*/
	var autocompleteResult []AutocompleteResult
	searchInput := fmt.Sprintf("%s%%", prefix)
	subQueryCaseId := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.FederationName, types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryProbandId := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.FederationName, types.PatientTable.Alias))
	subQueryProbandId = subQueryProbandId.Select("\"patient_id\" as type, id as value")
	subQueryProbandId = subQueryProbandId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryOrgPatID := r.db.Table(fmt.Sprintf("%s %s", types.PatientTable.FederationName, types.PatientTable.Alias))
	subQueryOrgPatID = subQueryOrgPatID.Select("submitter_patient_id_type as type, submitter_patient_id as value")
	subQueryOrgPatID = subQueryOrgPatID.Where("LOWER(submitter_patient_id) LIKE ?", strings.ToLower(searchInput))

	subQuerySeqId := r.db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.FederationName, types.SequencingExperimentTable.Alias))
	subQuerySeqId = subQuerySeqId.Select("\"sequencing_experiment_id\" as type, id as value")
	subQuerySeqId = subQuerySeqId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	tx := r.db.Table("(? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryOrgPatID, subQuerySeqId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for case autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *CasesRepository) GetCasesFilters(query types.AggQuery) (*CaseFilters, error) {
	status, err := utils.GetFilter(r.db, types.StatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	priority, err := utils.GetFilter(r.db, types.PriorityTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	analysisCatalog, err := utils.GetFilter(r.db, types.AnalysisCatalogTable, "name", nil)
	if err != nil {
		return nil, err
	}

	project, err := utils.GetFilter(r.db, types.ProjectTable, "name", nil)
	if err != nil {
		return nil, err
	}

	caseCategory, err := utils.GetFilter(r.db, types.CaseCategoryTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	resolution, err := utils.GetFilter(r.db, types.ResolutionStatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	caseType, err := utils.GetFilter(r.db, types.CaseTypeTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.SequencingLabTable.Alias)
	diagnosisLab, err := utils.GetFilter(r.db, types.SequencingLabTable, "name", &isDiagnosisLabCondition)
	if err != nil {
		return nil, err
	}

	orderingOrg, err := utils.GetFilter(r.db, types.OrderingOrganizationTable, "name", nil)
	if err != nil {
		return nil, err
	}

	lifeStatus, err := utils.GetFilter(r.db, types.LifeStatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	panel, err := utils.GetFilter(r.db, types.PanelTable, "name", nil)
	if err != nil {
		return nil, err
	}

	return &CaseFilters{
		Status:               status,
		Priority:             priority,
		AnalysisCatalog:      analysisCatalog,
		Project:              project,
		DiagnosisLab:         diagnosisLab,
		OrderingOrganization: orderingOrg,
		CaseCategory:         caseCategory,
		ResolutionStatus:     resolution,
		CaseType:             caseType,
		LifeStatus:           lifeStatus,
		Panel:                panel,
	}, nil
}

func (r *CasesRepository) GetCaseEntity(caseId int) (*CaseEntity, error) {
	caseEntity, err := r.retrieveCaseLevelData(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching case level data: %w", err)
	}

	sequencingExperiments, err := r.retrieveCaseSequencingExperiments(caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments data: %w", err)
	}
	caseEntity.SequencingExperiments = *sequencingExperiments

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

func prepareQuery(userQuery types.Query, r *CasesRepository) (*gorm.DB, error) {
	tx := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.FederationName, types.CaseTable.Alias))
	tx = utils.JoinCaseWithProband(tx, userQuery)
	tx = utils.JoinCaseWithAnalysisCatalog(tx)
	tx = utils.JoinCaseWithProject(tx)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)

		if userQuery.HasFieldFromTables(types.PanelTable) {
			tx = utils.JoinAnalysisCatalogWithPanel(tx)
		}

		if userQuery.HasFieldFromTables(types.OrderingOrganizationTable) {
			tx = utils.JoinCaseWithOrderingOrganization(tx)
		}

		if userQuery.HasFieldFromTables(types.SequencingLabTable) {
			tx = utils.JoinCaseWithDiagnosisLab(tx)
		}

		if userQuery.HasFieldFromTables(types.MondoTable) {
			tx = utils.JoinCaseWithMondoTerm(tx)
		}

		if userQuery.HasFieldFromTables(types.PatientTable) {
			tx = utils.JoinCaseWithPatients(tx)
		}

		if userQuery.HasFieldFromTables(types.CaseHasSequencingExperimentTable) {
			tx = utils.JoinCaseWithCaseHasSeqExp(tx)
		}
	}
	return tx, nil
}

func (r *CasesRepository) retrieveCaseLevelData(caseId int) (*CaseEntity, error) {
	var caseEntity CaseEntity

	txCase := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.FederationName, types.CaseTable.Alias))
	txCase = utils.JoinCaseWithAnalysisCatalog(txCase)
	txCase = utils.JoinCaseWithCaseCategory(txCase)
	txCase = utils.JoinAnalysisCatalogWithPanel(txCase)
	txCase = utils.JoinCaseWithMondoTerm(txCase)
	txCase = utils.JoinCaseWithDiagnosisLab(txCase)
	txCase = utils.JoinCaseWithOrderingOrganization(txCase)
	txCase = utils.JoinCaseWithProject(txCase)
	txCase = txCase.Select("c.id as case_id, c.proband_id, c.case_type_code as case_type_code, ca.code as analysis_catalog_code, ca.name as analysis_catalog_name, c.created_on, c.updated_on, c.note, c.case_category_code, case_cat.name_en as case_category_name, mondo.id as primary_condition_id, mondo.name as primary_condition_name, lab.code as diagnosis_lab_code, lab.name as diagnosis_lab_name, c.status_code, order_org.code as ordering_organization_code, order_org.name as ordering_organization_name, c.priority_code, c.ordering_physician as prescriber, prj.code as project_code, prj.name as project_name, panel.code as panel_code, panel.name as panel_name")
	txCase = txCase.Where("c.id = ?", caseId)
	if err := txCase.Find(&caseEntity).Error; err != nil {
		return nil, fmt.Errorf("error fetching case entity: %w", err)
	}

	return &caseEntity, nil
}

func (r *CasesRepository) retrieveCaseSequencingExperiments(caseId int) (*[]CaseSequencingExperiment, error) {
	var sequencingExperiments []CaseSequencingExperiment

	txSeqExp := r.db.Table(fmt.Sprintf("%s %s", types.CaseHasSequencingExperimentTable.FederationName, types.CaseHasSequencingExperimentTable.Alias))
	txSeqExp = utils.JoinCaseHasSeqExpWithSequencingExperiment(txSeqExp)
	txSeqExp = utils.JoinSeqExpWithSample(txSeqExp)
	txSeqExp = utils.JoinSampleAndCaseHasSeqExpWithFamily(txSeqExp)
	txSeqExp = txSeqExp.Joins("LEFT JOIN staging_sequencing_experiment se on s.id = se.seq_id and se.ingested_at is not null and se.task_type = 'radiant_germline_annotation'")
	txSeqExp = txSeqExp.Select("s.id as seq_id, spl.patient_id, f.relationship_to_proband_code as relationship_to_proband, f.affected_status_code, s.sample_id, spl.submitter_sample_id as sample_submitter_id, spl.type_code as sample_type_code, spl.histology_code, s.status_code, s.updated_on, s.experimental_strategy_code, se.seq_id is not null as has_variants")
	txSeqExp = txSeqExp.Where("chseq.case_id = ?", caseId)
	txSeqExp = txSeqExp.Order("affected_status_code asc, s.run_date desc, relationship_to_proband desc")
	if err := txSeqExp.Find(&sequencingExperiments).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments: %w", err)
	}

	return &sequencingExperiments, nil
}

func (r *CasesRepository) retrieveCasePatients(caseId int) (*[]CasePatientClinicalInformation, error) {
	var members []CasePatientClinicalInformation
	var phenotypeObsCategoricals []types.PhenotypeObsCategorical

	txMembers := r.db.Table(fmt.Sprintf("%s %s", types.FamilyTable.FederationName, types.FamilyTable.Alias))
	txMembers = utils.JoinFamilyWithPatient(txMembers)
	txMembers = utils.JoinPatientWithManagingOrg(txMembers)
	txMembers = txMembers.Where("f.case_id = ?", caseId)
	txMembers = txMembers.Order("affected_status_code asc, relationship_to_proband_code desc")
	txMembers = txMembers.Select("p.id as patient_id, p.last_name, p.first_name, f.affected_status_code, f.relationship_to_proband_code as relationship_to_proband, p.date_of_birth, p.life_status_code, p.sex_code, p.submitter_patient_id, p.jhn, mgmt_org.code as organization_code, mgmt_org.name as organization_name")
	if err := txMembers.Find(&members).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case members: %w", err)
	}

	txObservations := r.db.Table(fmt.Sprintf("%s %s", types.ObsCategoricalTable.FederationName, types.ObsCategoricalTable.Alias))
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
	tx := r.db.Table(fmt.Sprintf("%s %s", types.TaskContextTable.FederationName, types.TaskContextTable.Alias))
	tx = utils.JoinTaskContextWithCaseHasSeqExp(tx)
	tx = utils.JoinTaskContextWithTask(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_type_code = %s.code", types.TaskTypeTable.FederationName, types.TaskTypeTable.Alias, types.TaskTable.Alias, types.TaskTypeTable.Alias))
	tx = utils.JoinTaskContextWithSeqExp(tx)
	tx = utils.JoinSeqExpWithSample(tx)
	tx = utils.JoinSampleAndCaseHasSeqExpWithFamily(tx)
	tx = tx.Where("(tctx.case_id = ? OR tctx.case_id IS NULL) AND chseq.case_id = ?", caseId, caseId)
	tx = tx.Select("task.id, task.task_type_code as type_code, task.created_on, task_type.name_en as type_name, group_concat(f.relationship_to_proband_code) as patients_unparsed, count(distinct spl.patient_id) as patient_count")
	tx = tx.Group("task.id, task.task_type_code, task.created_on, task_type.name_en")
	tx = tx.Order("task.id asc")

	if err := tx.Find(&tasks).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case tasks: %w", err)
	}

	for i, task := range tasks {
		patients := utils.SplitRemoveEmptyString(task.PatientsUnparsed, ",")
		sort.Strings(patients)
		tasks[i].Patients = patients
	}

	return &tasks, nil
}

func (r *CasesRepository) retrieveCasesFamilyMembersIds(caseId int) ([]int, error) {
	var familyMembersIds []int
	txFamilyMembersID := r.db.Table(fmt.Sprintf("%s %s", types.FamilyTable.FederationName, types.FamilyTable.Alias))
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

func (r *CasesRepository) GetCaseBySubmitterCaseIdAndProjectId(submitterCaseId string, projectId int) (*Case, error) {
	var c Case
	tx := r.db.Table(fmt.Sprintf("%s %s", types.CaseTable.Name, types.CaseTable.Alias))
	tx = tx.Where("c.submitter_case_id = ? AND c.project_id = ?", submitterCaseId, projectId)
	if err := tx.First(&c).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("error fetching case by submitter_case_id and project_id: %w", err)
	}
	return &c, nil
}
