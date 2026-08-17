/**
 * Add/Edit custom-role form values. A role is a named bundle of permissions (backend "actions").
 * `name`/`description` are author-typed for custom roles; `permissions` are action codes.
 */
export type RoleFormValues = {
  name: string;
  /** URL/system id, immutable after creation. `[a-z][a-z0-9_]*`, max 50; unique within the tenant. */
  code: string;
  description: string;
  permissions: string[];
};
