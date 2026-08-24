package types

// RoleResult is one role of a tenant in the roles administration list, with the actions it maps
// and how many users hold it. Scope is derived from the actions and never stored (ADR §5.4).
// @Description Role of a tenant, with the actions it grants and the number of users holding it
// @Name RoleResult
type RoleResult struct {
	Code               string             `json:"code" validate:"required"`
	Name               string             `json:"name" validate:"required"`
	Description        string             `json:"description,omitempty"`
	IsDefault          bool               `json:"is_default"`
	Scope              string             `json:"scope" validate:"required" enums:"tenant,org,mixed"`
	Actions            []RoleActionResult `gorm:"-" json:"actions" validate:"required"`
	AssignedUsersCount int64              `json:"assigned_users_count"`
}

// RoleActionResult is one action a role maps, carrying its label so the roles list renders
// without a second call to the action catalog.
// @Description Action granted by a role
// @Name RoleActionResult
type RoleActionResult struct {
	Code  string `json:"code" validate:"required"`
	Name  string `json:"name" validate:"required"`
	Scope string `json:"scope" validate:"required" enums:"tenant,org"`
}
