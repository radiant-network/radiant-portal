/**
 * Add/Edit custom-role form values. A role is a named bundle of permissions (backend "actions").
 * `name`/`description` are author-typed for custom roles; `permissions` are action codes.
 */
export type RoleFormValues = {
  name: string;
  description: string;
  permissions: string[];
};
