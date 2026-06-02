import { z } from 'zod';

/**
 * Ref for better solution still in discussion: https://github.com/colinhacks/zod/issues/2807
 */
export type ZodSchema<T> = z.ZodObject<{
  [K in keyof Partial<T>]: K extends keyof T ? z.ZodType<T[K]> : never;
}>;

/**
 * Helper function to check if a field is required in the Zod schema.
 * A field is required if its schema rejects `undefined`.
 */
export function isFieldRequired(schema: z.ZodObject<any>, fieldName: string): boolean {
  try {
    const fieldSchema = schema.shape[fieldName];
    if (!fieldSchema) return false;
    return !fieldSchema.safeParse(undefined).success;
  } catch (error) {
    console.error(`Error checking if field ${fieldName} is required:`, error);
    return false;
  }
}
