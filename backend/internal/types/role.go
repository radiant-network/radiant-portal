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
	ErrRoleActionsNotGrantable = errors.New("actions cannot be granted to a custom role")
	ErrRoleNotFound            = errors.New("role not found")
	ErrRoleIsDefault           = errors.New("cannot edit a default role")
)

// Fields a create-role conflict is reported on, named after the request's own JSON fields.
const (
	RoleFieldCode   = "code"
	RoleFieldNameEn = "name_en"
	RoleFieldNameFr = "name_fr"
)

type RoleConflictError struct {
	Field string
}

func (e *RoleConflictError) Error() string {
	return fmt.Sprintf("a role with the same %s already exists in this tenant", e.Field)
}

// CreateRoleRequest is the payload creating a custom role. The role's scope is not part of it —
// it is derived from the actions and resolved at assignment (ADR §5.4).
// @Description Payload to create a custom role in a tenant
// @Name CreateRoleRequest
type CreateRoleRequest struct {
	Code          TrimmedString `json:"code" binding:"required"`
	NameEn        TrimmedString `json:"name_en" binding:"required"`
	NameFr        TrimmedString `json:"name_fr,omitempty"`
	DescriptionEn TrimmedString `json:"description_en,omitempty"`
	DescriptionFr TrimmedString `json:"description_fr,omitempty"`
	Actions       []string      `json:"actions" binding:"required"`
}

func (r CreateRoleRequest) FrenchName() string {
	return frenchLabel(r.NameFr, r.NameEn)
}

func (r CreateRoleRequest) FrenchDescription() string {
	return frenchLabel(r.DescriptionFr, r.DescriptionEn)
}

func (r CreateRoleRequest) Validate() error {
	if !roleCodePattern.MatchString(r.Code.String()) {
		return fmt.Errorf("code %q is invalid: must start with a lowercase letter and contain only lowercase letters, digits, or underscores (max 50)", r.Code)
	}
	return validateRoleNameAndActions(r.NameEn, r.Actions)
}

// UpdateRoleRequest is the payload editing a custom role.
// Every editable field is replaced, so an omitted description clears it and the actions listed become the role's entire action set.
// @Description Payload to edit a custom role of a tenant
// @Name UpdateRoleRequest
type UpdateRoleRequest struct {
	NameEn        TrimmedString `json:"name_en" binding:"required"`
	NameFr        TrimmedString `json:"name_fr,omitempty"`
	DescriptionEn TrimmedString `json:"description_en,omitempty"`
	DescriptionFr TrimmedString `json:"description_fr,omitempty"`
	Actions       []string      `json:"actions" binding:"required"`
}

func (r UpdateRoleRequest) FrenchName() string {
	return frenchLabel(r.NameFr, r.NameEn)
}

func (r UpdateRoleRequest) FrenchDescription() string {
	return frenchLabel(r.DescriptionFr, r.DescriptionEn)
}

func (r UpdateRoleRequest) Validate() error {
	return validateRoleNameAndActions(r.NameEn, r.Actions)
}

func frenchLabel(french, english TrimmedString) string {
	if label := strings.TrimSpace(french.String()); label != "" {
		return label
	}
	return strings.TrimSpace(english.String())
}

func validateRoleNameAndActions(nameEn TrimmedString, actions []string) error {
	if strings.TrimSpace(nameEn.String()) == "" {
		return fmt.Errorf("name_en must not be blank")
	}
	if len(actions) == 0 {
		return fmt.Errorf("actions must not be empty")
	}
	seen := map[string]bool{}
	for _, action := range actions {
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

// RoleResult is one role of a tenant in the roles administration list, with the actions it maps,
// how many users hold it and how many organizations it is assigned at. Scope is derived from the
// actions and never stored (ADR §5.4).
// @Description Role of a tenant, with the actions it grants, the number of users holding it and the number of organizations it is assigned at
// @Name RoleResult
type RoleResult struct {
	Code               string             `json:"code" validate:"required"`
	Name               string             `json:"name" validate:"required"`
	Description        string             `json:"description,omitempty"`
	IsDefault          bool               `json:"is_default"`
	Scope              string             `json:"scope" validate:"required" enums:"tenant,org,mixed"`
	Actions            []RoleActionResult `gorm:"-" json:"actions" validate:"required"`
	AssignedUsersCount int64              `json:"assigned_users_count"`
	AssignedOrgsCount  int64              `json:"assigned_orgs_count"`
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
