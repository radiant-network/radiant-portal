package types

var UserPreferenceTable = Table{
	Name:  "user_preference",
	Alias: "pref",
}

func (UserPreference) TableName() string {
	return UserPreferenceTable.Name
}

type UserPreference struct {
	UserID       string                       `json:"user_id" validate:"required" gorm:"type:uuid; primary_key; unique"`
	TableDisplay JsonMap[string, TableConfig] `gorm:"type:json" json:"table_display" validate:"required"`
}

type TableConfig struct {
	ColumnOrder      JsonArray[string]     `json:"columnOrder,omitempty"`
	ColumnPinning    *ColumnPinningConfig  `json:"columnPinning,omitempty"`
	ColumnSizing     JsonMap[string, int]  `json:"columnSizing,omitempty"`
	ColumnVisibility JsonMap[string, bool] `json:"columnVisibility,omitempty"`
	Pagination       *PaginationConfig     `json:"pagination,omitempty"`
}

type ColumnPinningConfig struct {
	Left  JsonArray[string] `json:"left,omitempty"`
	Right JsonArray[string] `json:"right,omitempty"`
}

type PaginationConfig struct {
	PageSize int `json:"pageSize,omitempty"`
}
