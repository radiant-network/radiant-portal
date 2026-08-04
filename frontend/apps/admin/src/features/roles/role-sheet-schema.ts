import { z } from 'zod';

/**
 * Add/Edit custom-role form schema. Only `name` is zod-validated (message keys resolve under
 * `common.form.errors.*` via the shared `FormMessage`). `description` is optional. The
 * "at least one permission" rule is enforced in the sheet (revealed on submit) rather than here,
 * mirroring the Members sheet's org-required handling — the permission picker isn't a native input
 * RHF can focus. The duplicate-name check (409-equivalent) also lives in the sheet.
 */
export const roleFormSchema = z.object({
  name: z.string().min(1, { message: 'required' }),
  description: z.string(),
  permissions: z.array(z.string()),
});
