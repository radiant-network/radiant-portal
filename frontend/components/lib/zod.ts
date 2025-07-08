import { z } from "zod";

/**
 * Ref for better solution still in discussion: https://github.com/colinhacks/zod/issues/2807
 */
export type ZodSchema<T> = z.ZodObject<{
  [K in keyof Partial<T>]: K extends keyof T ? z.ZodType<T[K]> : never;
}>;

/** 
  * Helper function to check if a field is required in the Zod schema
  */
export function isFieldRequired(schema: z.ZodObject<any>, fieldName: string): boolean {
  try {
    // Get the shape of the schema
    const shape =
      typeof schema._def.shape === "function"
        ? schema._def.shape()
        : schema._def.shape;

    if (!shape) return false;

    // Check if the field exists in the schema
    if (!(fieldName in shape)) {
      return false;
    }

    // Get the field's schema
    const fieldSchema = shape[fieldName];
    if (!fieldSchema) return false;

    // Check if the field is optional
    return !isOptionalField(fieldSchema);
  } catch (error) {
    console.error(`Error checking if field ${fieldName} is required:`, error);
    return false;
  }
}

/** 
  * Helper function to determine if a field is optional
  */
function isOptionalField(fieldSchema: any): boolean {
  // If the field is wrapped with .optional()
  if (fieldSchema._def?.typeName === "ZodOptional") {
    return true;
  }

  // If the field is nullable but not optional
  if (fieldSchema._def?.typeName === "ZodNullable") {
    // Check the inner type
    return isOptionalField(fieldSchema._def.innerType);
  }

  // Other complex cases like union types that include undefined
  if (fieldSchema._def?.typeName === "ZodUnion") {
    return fieldSchema._def.options.some(
      (option: any) =>
        option._def.typeName === "ZodUndefined" ||
        option._def.typeName === "ZodNull",
    );
  }

  return false;
}
