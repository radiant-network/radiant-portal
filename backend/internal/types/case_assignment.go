package types

var CaseAssignmentTable = Table{
	Name:  "case_assignment",
	Alias: "assignment",
}

// CaseAssignment links a case to a user made responsible for reviewing and interpreting it.
type CaseAssignment struct {
	CaseID     int    `gorm:"primaryKey;column:case_id"`
	UserID     string `gorm:"primaryKey;column:user_id"`
	TenantCode string `gorm:"column:tenant_code"`
}

func (CaseAssignment) TableName() string {
	return CaseAssignmentTable.Name
}

// CaseAssignee - User assigned to a case
// @Description User assigned to a case, as shown in the cases list and on the case entity page.
// @Description Name and email are the attributes the identity registry holds for them, and are
// @Description absent for an account that never filled them in.
// @Name CaseAssignee
type CaseAssignee struct {
	UserID    string `json:"user_id" validate:"required"`
	FirstName string `json:"first_name,omitempty"`
	LastName  string `json:"last_name,omitempty"`
	Email     string `json:"email,omitempty"`
}
