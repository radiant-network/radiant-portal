import { z } from 'zod';

/**
 * Add/Edit user form schema. Messages are i18n keys under `common.form.errors.*` (the repo's
 * `FormMessage` auto-translates them). Org-required and last-admin are enforced in the sheet, not here.
 */
export const userFormSchema = z.object({
  firstName: z.string().min(1, { message: 'required' }),
  lastName: z.string().min(1, { message: 'required' }),
  email: z.string().min(1, { message: 'required' }),
  assignments: z.array(
    z.object({
      roleCode: z.string(),
      orgCodes: z.array(z.string()),
    }),
  ),
});
