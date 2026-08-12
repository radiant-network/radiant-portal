import { z } from 'zod';

/**
 * Add/Edit custom-role form schema (message keys resolve under `common.form.errors.*` via the
 * shared `FormMessage`). `description` is optional. `code` mirrors the org-code rules: required,
 * max 50, and `[a-z][a-z0-9_]*` (lowercase letters/numbers/underscores, must start with a letter);
 * it's immutable after creation, so the sheet only edits it in Add mode. The "at least one
 * permission" rule is enforced in the sheet (revealed on submit) rather than here — the permission
 * picker isn't a native input RHF can focus. The duplicate-code and duplicate-name checks
 * (409-equivalent) also live in the sheet.
 */
export const roleFormSchema = z.object({
  name: z.string().min(1, { message: 'required' }),
  code: z
    .string()
    .min(1, { message: 'required' })
    .max(50, { message: 'max_50' })
    .regex(/^[a-z][a-z0-9_]*$/, { message: 'code_invalid' }),
  description: z.string(),
  permissions: z.array(z.string()),
});
