import { z } from "zod";

/**
 * Ref for better solution still in discussion: https://github.com/colinhacks/zod/issues/2807
 */
export type ZodSchema<T> = z.ZodObject<{
  [K in keyof Partial<T>]: K extends keyof T ? z.ZodType<T[K]> : never;
}>;
