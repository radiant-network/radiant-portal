import { z } from 'zod';

/**
 * Add/Edit organization form schema. Messages are i18n keys under `common.form.errors.*` (the repo's
 * `FormMessage` auto-translates them). Code format matches the backend rule `[a-z][a-z0-9_]*`
 * (lowercase letters, numbers, underscores; must start with a letter). The duplicate-code check
 * (409-equivalent) is enforced in the sheet against the current list, not here.
 */
export const orgFormSchema = z.object({
  name: z.string().min(1, { message: 'required' }),
  code: z
    .string()
    .min(1, { message: 'required' })
    .regex(/^[a-z][a-z0-9_]*$/, { message: 'code_invalid' }),
  category_code: z.string().min(1, { message: 'required' }),
});
