import { z } from 'zod';

/**
 * Add/Edit user form schema. Messages are i18n keys under `common.form.errors.*` (the repo's
 * `FormMessage` auto-translates them). Org-required and last-admin are enforced in the sheet, not here.
 */
export const userFormSchema = z.object({
  firstName: z.string().min(1, { message: 'required' }),
  lastName: z.string().min(1, { message: 'required' }),
  // min(1) first so an empty field reads "required"; .email() catches a malformed address.
  email: z.string().min(1, { message: 'required' }).email({ message: 'invalid_email' }),
  assignments: z.array(
    z.object({
      roleCode: z.string(),
      orgCodes: z.array(z.string()),
    }),
  ),
});
