package types

type OccurrenceFlagType = string

const (
	OccurrenceFlagTypeFlag OccurrenceFlagType = "flag"
	OccurrenceFlagTypePin  OccurrenceFlagType = "pin"
	OccurrenceFlagTypeStar OccurrenceFlagType = "star"
)

var ValidOccurrenceFlagTypes = []OccurrenceFlagType{OccurrenceFlagTypeFlag, OccurrenceFlagTypePin, OccurrenceFlagTypeStar}

var OccurrenceFlagTable = Table{
	Name:           "occurrence_flag",
	FederationName: "radiant_jdbc.public.occurrence_flag",
	Alias:          "flag",
}

// OccurrenceFlag is both the GORM model and the API response type.
// composite primary key on case_id + occurrence_id + seq_id + task_id
type OccurrenceFlag struct {
	CaseID       int                `gorm:"primaryKey;column:case_id"        json:"case_id"       validate:"required"`
	OccurrenceID string             `gorm:"primaryKey;column:occurrence_id"  json:"occurrence_id" validate:"required"`
	SeqID        int                `gorm:"primaryKey;column:seq_id"         json:"seq_id"        validate:"required"`
	TaskID       int                `gorm:"primaryKey;column:task_id"        json:"task_id"       validate:"required"`
	FlagType     OccurrenceFlagType `gorm:"column:flag_type"                 json:"flag_type"     validate:"required,oneof=flag pin star" enums:"flag,pin,star"`
	TenantCode   string             `gorm:"column:tenant_code"               json:"-"`
}

func (OccurrenceFlag) TableName() string {
	return OccurrenceFlagTable.Name
}
