package types

var UserPreferenceTable = Table{
	Name:  "user_preference",
	Alias: "pref",
}

func (UserPreference) TableName() string {
	return UserPreferenceTable.Name
}

type UserPreference struct {
	UserID  string                       `json:"-" validate:"required" gorm:"type:uuid; primary_key;"`
	Key     string                       `json:"key" validate:"required" gorm:"primary_key;"`
	Content JsonMap[string, interface{}] `gorm:"type:json" json:"content" validate:"required"`
}
