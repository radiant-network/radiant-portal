/** One role assignment as edited in the sheet. `orgCodes`: [] for tenant-only roles, ['*'] = all orgs. */
export type RoleAssignmentForm = {
  roleCode: string;
  orgCodes: string[];
};

/** Add/Edit user form values. `assignments` excludes the implicit baseline `member`. */
export type UserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  assignments: RoleAssignmentForm[];
};
