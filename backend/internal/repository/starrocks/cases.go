package starrocks

import (
	"context"
	"fmt"
	"slices"
	"strings"

	"github.com/Goldziher/go-utils/sliceutils"
	"github.com/radiant-network/radiant-api/internal/database"
	"github.com/radiant-network/radiant-api/internal/types"
	"github.com/radiant-network/radiant-api/internal/utils"
	"github.com/radiant-network/radiant-api/internal/utils/joins"
	"gorm.io/gorm"
)

type CaseResult = types.CaseResult
type AutocompleteResult = types.AutocompleteResult
type CaseFilters = types.CaseFilters
type CaseEntity = types.CaseEntity
type CaseSequencingExperiment = types.CaseSequencingExperiment
type CasePatientClinicalInformation = types.CasePatientClinicalInformation
type CaseTask = types.CaseTask

type CasesRepository struct {
	db     *gorm.DB
	joiner joins.Joiner
}

func NewCasesRepository(db database.StarrocksDB) *CasesRepository {
	return &CasesRepository{db: db.DB, joiner: joins.Starrocks()}
}

// GetCaseType returns the case_type_code (e.g., "germline" or "somatic") for a
// case. Used by handlers that need to dispatch to type-specific logic without
// duplicating the lookup.
func (r *CasesRepository) GetCaseType(ctx context.Context, caseID int) (string, error) {
	var caseType string
	tx := r.db.WithContext(ctx).Table(types.CaseTable.TenantQualifiedName(ctx))
	tx = tx.Select("case_type_code").Where("id = ?", caseID)
	err := tx.Scan(&caseType).Error
	return caseType, err
}

func (r *CasesRepository) SearchCases(ctx context.Context, userQuery types.ListQuery) (*[]CaseResult, *int64, error) {
	var cases []CaseResult
	var count int64

	db := r.db.WithContext(ctx)
	tx, err := prepareQuery(ctx, userQuery, r)
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

	txStg := db.Table(fmt.Sprintf("%s chse", types.CaseHasSequencingExperimentTable.TenantQualifiedName(ctx)))
	txStg = txStg.Select("DISTINCT(chse.case_id)")
	txStg = txStg.Where("se.ingested_at IS NOT NULL AND (se.task_type = 'radiant_germline_annotation' OR (se.task_type = 'radiant_somatic_annotation' AND se.histology_type = 'tumoral'))")
	txStg = txStg.Joins(fmt.Sprintf("JOIN %s se ON se.seq_id = chse.sequencing_experiment_id", types.SequencingTable.TenantQualifiedName(ctx)))

	txMembersCount := db.Table(types.FamilyTable.TenantQualifiedName(ctx)).Select("case_id, count(distinct family_member_id) as distinct_members_count").Group("case_id")

	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) stg ON stg.case_id=%s.id", types.CaseTable.Alias), txStg)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN (?) members_count ON members_count.case_id = %s.id", types.CaseTable.Alias), txMembersCount)
	tx = tx.Select(columns)
	utils.AddLimitAndSort(tx, userQuery)

	if err = tx.Find(&cases).Error; err != nil {
		return nil, nil, fmt.Errorf("error fetching cases: %w", err)
	}
	return &cases, &count, nil
}

func (r *CasesRepository) SearchById(ctx context.Context, prefix string, limit int) (*[]AutocompleteResult, error) {
	var autocompleteResult []AutocompleteResult
	db := r.db.WithContext(ctx)
	searchInput := fmt.Sprintf("%s%%", prefix)
	subQueryCaseId := db.Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	subQueryCaseId = subQueryCaseId.Select("\"case_id\" as type, id as value")
	subQueryCaseId = subQueryCaseId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryProbandId := db.Table(fmt.Sprintf("%s %s", types.PatientTable.TenantQualifiedName(ctx), types.PatientTable.Alias))
	subQueryProbandId = subQueryProbandId.Select("\"patient_id\" as type, id as value")
	subQueryProbandId = subQueryProbandId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	subQueryOrgPatID := db.Table(fmt.Sprintf("%s %s", types.PatientTable.TenantQualifiedName(ctx), types.PatientTable.Alias))
	subQueryOrgPatID = subQueryOrgPatID.Select("submitter_patient_id_type as type, submitter_patient_id as value")
	subQueryOrgPatID = subQueryOrgPatID.Where("LOWER(submitter_patient_id) LIKE ?", strings.ToLower(searchInput))

	subQuerySeqId := db.Table(fmt.Sprintf("%s %s", types.SequencingExperimentTable.TenantQualifiedName(ctx), types.SequencingExperimentTable.Alias))
	subQuerySeqId = subQuerySeqId.Select("\"sequencing_experiment_id\" as type, id as value")
	subQuerySeqId = subQuerySeqId.Where("CAST(id AS TEXT) LIKE ?", searchInput)

	tx := db.Table("(? UNION ? UNION ? UNION ?) autocompleteByIds", subQueryCaseId, subQueryProbandId, subQueryOrgPatID, subQuerySeqId)
	tx = tx.Order("value asc, type asc")
	tx = tx.Limit(limit)
	if err := tx.Find(&autocompleteResult).Error; err != nil {
		return nil, fmt.Errorf("error searching for case autocomplete: %w", err)
	}
	return &autocompleteResult, nil
}

func (r *CasesRepository) GetCasesFilters(ctx context.Context) (*CaseFilters, error) {
	db := r.db.WithContext(ctx)
	status, err := utils.GetFilter(db, types.StatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	priority, err := utils.GetFilter(db, types.PriorityTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	analysisCatalog, err := utils.GetFilter(db, types.AnalysisCatalogTable, "name", nil)
	if err != nil {
		return nil, err
	}

	project, err := utils.GetFilter(db, types.ProjectTable, "name", nil)
	if err != nil {
		return nil, err
	}

	caseCategory, err := utils.GetFilter(db, types.CaseCategoryTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	resolution, err := utils.GetFilter(db, types.ResolutionStatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	caseType, err := utils.GetFilter(db, types.CaseTypeTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	isDiagnosisLabCondition := fmt.Sprintf("%s.category_code = 'diagnostic_laboratory'", types.SequencingLabTable.Alias)
	diagnosisLab, err := utils.GetFilter(db, types.SequencingLabTable, "name", &isDiagnosisLabCondition)
	if err != nil {
		return nil, err
	}

	orderingOrg, err := utils.GetFilter(db, types.OrderingOrganizationTable, "name", nil)
	if err != nil {
		return nil, err
	}

	lifeStatus, err := utils.GetFilter(db, types.LifeStatusTable, "name_en", nil)
	if err != nil {
		return nil, err
	}

	panel, err := utils.GetFilter(db, types.PanelTable, "name", nil)
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

func (r *CasesRepository) GetCaseEntity(ctx context.Context, caseId int) (*CaseEntity, error) {
	caseEntity, err := r.retrieveCaseLevelData(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching case level data: %w", err)
	}

	sequencingExperiments, err := r.retrieveCaseSequencingExperiments(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments data: %w", err)
	}
	caseEntity.SequencingExperiments = *sequencingExperiments

	members, err := r.retrieveCasePatients(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching members data: %w", err)
	}
	caseEntity.Members = *members

	tasks, err := r.retrieveCaseTasks(ctx, caseId)
	if err != nil {
		return nil, fmt.Errorf("error fetching tasks: %w", err)
	}
	caseEntity.Tasks = *tasks

	caseType := calculateCaseType(*caseEntity)
	caseEntity.CaseType = caseType

	return caseEntity, nil
}

func prepareQuery(ctx context.Context, userQuery types.Query, r *CasesRepository) (*gorm.DB, error) {
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	tx = r.joiner.CaseWithProband(tx, userQuery)
	tx = r.joiner.CaseWithAnalysisCatalog(tx)
	tx = r.joiner.CaseWithProject(tx)
	if userQuery != nil {
		utils.AddWhere(userQuery, tx)

		if userQuery.HasFieldFromTables(types.PanelTable) {
			tx = r.joiner.AnalysisCatalogWithPanel(tx)
		}

		if userQuery.HasFieldFromTables(types.OrderingOrganizationTable) {
			tx = r.joiner.CaseWithOrderingOrganization(tx)
		}

		if userQuery.HasFieldFromTables(types.SequencingLabTable) {
			tx = r.joiner.CaseWithDiagnosisLab(tx)
		}

		if userQuery.HasFieldFromTables(types.MondoTable) {
			tx = r.joiner.CaseWithMondoTerm(tx)
		}

		if userQuery.HasFieldFromTables(types.PatientTable) {
			tx = r.joiner.CaseWithPatients(tx)
		}

		if userQuery.HasFieldFromTables(types.CaseHasSequencingExperimentTable) {
			tx = r.joiner.CaseWithCaseHasSeqExp(tx)
		}
	}
	return tx, nil
}

func (r *CasesRepository) retrieveCaseLevelData(ctx context.Context, caseId int) (*CaseEntity, error) {
	var caseEntity CaseEntity

	txCase := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseTable.TenantQualifiedName(ctx), types.CaseTable.Alias))
	txCase = r.joiner.CaseWithAnalysisCatalog(txCase)
	txCase = r.joiner.CaseWithCaseCategory(txCase)
	txCase = r.joiner.AnalysisCatalogWithPanel(txCase)
	txCase = r.joiner.CaseWithMondoTerm(txCase)
	txCase = r.joiner.CaseWithDiagnosisLab(txCase)
	txCase = r.joiner.CaseWithOrderingOrganization(txCase)
	txCase = r.joiner.CaseWithProject(txCase)
	txCase = txCase.Select("c.id as case_id, c.proband_id, c.case_type_code as case_type_code, ca.code as analysis_catalog_code, ca.name as analysis_catalog_name, c.created_on, c.updated_on, c.note, c.case_category_code, case_cat.name_en as case_category_name, mondo.id as primary_condition_id, mondo.name as primary_condition_name, lab.code as diagnosis_lab_code, lab.name as diagnosis_lab_name, c.status_code, order_org.code as ordering_organization_code, order_org.name as ordering_organization_name, c.priority_code, c.ordering_physician as prescriber, prj.code as project_code, prj.name as project_name, panel.code as panel_code, panel.name as panel_name")
	txCase = txCase.Where("c.id = ?", caseId)
	if err := txCase.Find(&caseEntity).Error; err != nil {
		return nil, fmt.Errorf("error fetching case entity: %w", err)
	}

	return &caseEntity, nil
}

func (r *CasesRepository) retrieveCaseSequencingExperiments(ctx context.Context, caseId int) (*[]CaseSequencingExperiment, error) {
	var sequencingExperiments []CaseSequencingExperiment

	txSeqExp := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.CaseHasSequencingExperimentTable.TenantQualifiedName(ctx), types.CaseHasSequencingExperimentTable.Alias))
	txSeqExp = r.joiner.CaseHasSeqExpWithSequencingExperiment(txSeqExp)
	txSeqExp = r.joiner.SeqExpWithSample(txSeqExp)
	txSeqExp = r.joiner.SampleAndCaseHasSeqExpWithFamily(txSeqExp)
	txSeqExp = txSeqExp.Joins(fmt.Sprintf("LEFT JOIN %s se on s.id = se.seq_id and se.ingested_at is not null and (se.task_type = 'radiant_germline_annotation' OR (se.task_type = 'radiant_somatic_annotation' AND se.histology_type = 'tumoral')) and se.case_id = ?", types.SequencingTable.TenantQualifiedName(ctx)), caseId)
	txSeqExp = txSeqExp.Select("s.id as seq_id, spl.patient_id, f.relationship_to_proband_code as relationship_to_proband, f.affected_status_code, s.sample_id, spl.submitter_sample_id as sample_submitter_id, spl.type_code as sample_type_code, spl.histology_code, s.status_code, s.updated_on, s.experimental_strategy_code, se.seq_id is not null as has_variants")
	txSeqExp = txSeqExp.Where("chseq.case_id = ?", caseId)
	txSeqExp = txSeqExp.Order("affected_status_code asc, s.run_date desc, relationship_to_proband desc, seq_id desc")
	if err := txSeqExp.Find(&sequencingExperiments).Error; err != nil {
		return nil, fmt.Errorf("error fetching sequencing experiments: %w", err)
	}
	return &sequencingExperiments, nil
}

func (r *CasesRepository) retrieveCasePatients(ctx context.Context, caseId int) (*[]CasePatientClinicalInformation, error) {
	var members []CasePatientClinicalInformation
	var phenotypeObsCategoricals []types.PhenotypeObsCategorical

	db := r.db.WithContext(ctx)
	txMembers := db.Table(fmt.Sprintf("%s %s", types.FamilyTable.TenantQualifiedName(ctx), types.FamilyTable.Alias))
	txMembers = r.joiner.FamilyWithPatient(txMembers)
	txMembers = r.joiner.PatientWithManagingOrg(txMembers)
	txMembers = txMembers.Where("f.case_id = ?", caseId)
	txMembers = txMembers.Order("affected_status_code asc, relationship_to_proband_code desc")
	txMembers = txMembers.Select("p.id as patient_id, p.last_name, p.first_name, f.affected_status_code, f.relationship_to_proband_code as relationship_to_proband, p.date_of_birth, p.life_status_code, p.sex_code, p.submitter_patient_id, p.jhn, mgmt_org.code as organization_code, mgmt_org.name as organization_name")
	if err := txMembers.Find(&members).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case members: %w", err)
	}

	txObservations := db.Table(fmt.Sprintf("%s %s", types.ObsCategoricalTable.TenantQualifiedName(ctx), types.ObsCategoricalTable.Alias))
	txObservations = txObservations.Joins(fmt.Sprintf("LEFT JOIN %s hpo ON obs.observation_code = 'phenotype' AND hpo.id = obs.code_value", types.HPOTable.TenantQualifiedName(ctx)))
	txObservations = txObservations.Where("obs.observation_code = 'phenotype' AND obs.case_id = ?", caseId)
	txObservations = txObservations.Order("phenotype_name asc")
	txObservations = txObservations.Select("obs.patient_id, COALESCE(hpo.id, obs.code_value) as phenotype_id, hpo.name as phenotype_name, obs.onset_code, obs.interpretation_code")
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

func (r *CasesRepository) retrieveCaseTasks(ctx context.Context, caseId int) (*[]CaseTask, error) {
	var tasks []CaseTask
	tx := r.db.WithContext(ctx).Table(fmt.Sprintf("%s %s", types.TaskContextTable.TenantQualifiedName(ctx), types.TaskContextTable.Alias))
	tx = r.joiner.TaskContextWithCaseHasSeqExp(tx)
	tx = r.joiner.TaskContextWithTask(tx)
	tx = tx.Joins(fmt.Sprintf("LEFT JOIN %s %s ON %s.task_type_code = %s.code", types.TaskTypeTable.TenantQualifiedName(ctx), types.TaskTypeTable.Alias, types.TaskTable.Alias, types.TaskTypeTable.Alias))
	tx = r.joiner.TaskContextWithSeqExp(tx)
	tx = r.joiner.SeqExpWithSample(tx)
	tx = r.joiner.SampleAndCaseHasSeqExpWithFamily(tx)
	tx = tx.Where("chseq.case_id = ?", caseId)
	tx = tx.Select("task.id, task.task_type_code as type_code, task.created_on, task_type.name_en as type_name, group_concat(f.relationship_to_proband_code) as patients_unparsed, count(distinct spl.patient_id) as patient_count")
	tx = tx.Group("task.id, task.task_type_code, task.created_on, task_type.name_en")
	tx = tx.Order("task.id asc")

	if err := tx.Find(&tasks).Error; err != nil {
		return nil, fmt.Errorf("error retrieving case tasks: %w", err)
	}

	for i, task := range tasks {
		patients := utils.SplitRemoveEmptyString(task.PatientsUnparsed, ",")
		patients = utils.RemoveDuplicates(patients)
		slices.Sort(patients)
		tasks[i].Patients = patients
	}

	return &tasks, nil
}

func calculateCaseType(caseEntity CaseEntity) string {
	if caseEntity.CaseTypeCode == "somatic" || len(caseEntity.Members) == 1 {
		return caseEntity.CaseTypeCode
	} else {
		return fmt.Sprintf("%s_family", caseEntity.CaseTypeCode)
	}
}
