/**
 * Add/Edit organization form values. Mirrors the generated `CreateOrganizationRequest`
 * (`code`, `name`, `category_code`). On Edit only `name` is mutable (code + category are locked).
 */
export type OrgFormValues = {
  code: string;
  name: string;
  category_code: string;
};
