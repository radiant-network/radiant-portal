package types

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

// roleCodePattern is lowercase-only, starts with a letter, and allows digits and underscores up to the column's 50 characters.
var roleCodePattern = regexp.MustCompile(`^[a-z][a-z0-9_]{0,49}$`)

var (
	ErrRoleCodeExists          = errors.New("role code already exists in this tenant")
	ErrRoleNameExists          = errors.New("role name already exists in this tenant")
	ErrRoleActionsNotGrantable = errors.New("actions cannot be granted to a custom role")
)

// CreateRoleRequest is the payload creating a custom role. The role's scope is not part of it —
// it is derived from the actions and resolved at assignment (ADR §5.4).
// @Description Payload to create a custom role in a tenant
// @Name CreateRoleRequest
type CreateRoleRequest struct {
	Code        string   `json:"code" binding:"required"`
	Name        string   `json:"name" binding:"required"`
	Description string   `json:"description,omitempty"`
	Actions     []string `json:"actions" binding:"required"`
}

func (r CreateRoleRequest) Validate() error {
	if !roleCodePattern.MatchString(r.Code) {
		return fmt.Errorf("code %q is invalid: must start with a lowercase letter and contain only lowercase letters, digits, or underscores (max 50)", r.Code)
	}
	if strings.TrimSpace(r.Name) == "" {
		return fmt.Errorf("name must not be blank")
	}
	if len(r.Actions) == 0 {
		return fmt.Errorf("actions must not be empty")
	}
	seen := map[string]bool{}
	for _, action := range r.Actions {
		if strings.TrimSpace(action) == "" {
			return fmt.Errorf("action must not be blank")
		}
		if seen[action] {
			return fmt.Errorf("action %q is listed more than once", action)
		}
		seen[action] = true
	}
	return nil
}

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

// RoleActionResult is one action a role maps, carrying its labels so the roles list renders
// without a second call to the action catalog.
// @Description Action granted by a role
// @Name RoleActionResult
type RoleActionResult struct {
	Code        string `json:"code" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
	Scope       string `json:"scope" validate:"required" enums:"tenant,org"`
}
