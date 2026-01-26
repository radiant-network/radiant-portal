package repository

import (
	"fmt"
	"log"

	"github.com/radiant-network/radiant-api/internal/types"
	"gorm.io/gorm"
)

type ValueSetType string

const (
	ValueSetAffectedStatus   ValueSetType = "affected_status"
	ValueSetAnalysisCatalog  ValueSetType = "analysis_catalog"
	ValueSetCaseCategory     ValueSetType = "case_category"
	ValueSetCaseType         ValueSetType = "case_type"
	ValueSetConsanguinity    ValueSetType = "consanguinity"
	ValueSetDataCategory     ValueSetType = "data_category"
	ValueSetDataType         ValueSetType = "data_type"
	ValueSetFileFormat       ValueSetType = "file_format"
	ValueSetHistologyType    ValueSetType = "histology_type"
	ValueSetLifeStatus       ValueSetType = "life_status"
	ValueSetObservation      ValueSetType = "observation"
	ValueSetOnset            ValueSetType = "onset"
	ValueSetPanelType        ValueSetType = "panel_type"
	ValueSetPlatform         ValueSetType = "platform"
	ValueSetResolutionStatus ValueSetType = "resolution_status"
	ValueSetSex              ValueSetType = "sex"
	ValueSetStatus           ValueSetType = "status"
	ValueSetTaskType         ValueSetType = "task_type"
)

type ValueSetsDAO interface {
	GetCodes(vsType ValueSetType) ([]string, error)
}

type ValueSetsRepository struct {
	db       *gorm.DB
	tableMap map[ValueSetType]string
}

func NewValueSetsRepository(db *gorm.DB) *ValueSetsRepository {
	if db == nil {
		log.Panic("ValueSetsRepository: provided gorm.DB is nil")
	}

	tableNameMap := map[ValueSetType]string{
		ValueSetAffectedStatus:   types.AffectedStatusTable.Name,
		ValueSetAnalysisCatalog:  types.AnalysisCatalogTable.Name,
		ValueSetCaseCategory:     types.CaseCategoryTable.Name,
		ValueSetCaseType:         types.CaseTypeTable.Name,
		ValueSetConsanguinity:    types.ConsanguinityTable.Name,
		ValueSetDataCategory:     types.DataCategoryTable.Name,
		ValueSetDataType:         types.DataTypeTable.Name,
		ValueSetFileFormat:       types.FileFormatTable.Name,
		ValueSetHistologyType:    types.HistologyTypeTable.Name,
		ValueSetLifeStatus:       types.LifeStatusTable.Name,
		ValueSetObservation:      types.ObservationTable.Name,
		ValueSetOnset:            types.OnsetTable.Name,
		ValueSetPanelType:        types.PanelTypeTable.Name,
		ValueSetPlatform:         types.PlatformTable.Name,
		ValueSetResolutionStatus: types.ResolutionStatusTable.Name,
		ValueSetSex:              types.SexTable.Name,
		ValueSetStatus:           types.StatusTable.Name,
		ValueSetTaskType:         types.TaskTypeTable.Name,
	}

	return &ValueSetsRepository{
		db:       db,
		tableMap: tableNameMap,
	}
}

func (r *ValueSetsRepository) GetCodes(vsType ValueSetType) ([]string, error) {
	tableName, ok := r.tableMap[vsType]
	if !ok {
		return nil, fmt.Errorf("unknown value set type: %s", vsType)
	}

	var codes []string
	err := r.db.
		Table(tableName).
		Select("code").
		Order("code asc").
		Find(&codes).Error

	if err != nil {
		return nil, fmt.Errorf("error retrieving codes for %s: %w", vsType, err)
	}

	return codes, nil
}
