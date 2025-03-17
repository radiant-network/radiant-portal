import { z } from 'zod';
import { ZodSchema } from '@/components/lib/zod';
import { InterpretationGermline, InterpretationSomatic, InterpretationPubmed } from '@/api/api';

export const genericInterpretationFormSchema = z.object({
  interpretation: z.string(),
  pubmed: (
    z.object({
      citation: z.string(),
      citation_id: z.string(),
    }) satisfies ZodSchema<InterpretationPubmed>
  )
    .array()
    .optional(),
}) satisfies ZodSchema<Pick<InterpretationGermline, 'interpretation' | 'pubmed'>>;

export type GenericInterpretationSchemaType = z.infer<typeof genericInterpretationFormSchema>;

export const germlineInterpretationFormSchema = (
  z.object({
    classification: z.string(),
    classification_criterias: z.string().array(),
    condition: z.string(),
    transmission_modes: z.string().array(),
  }) satisfies ZodSchema<InterpretationGermline>
).merge(genericInterpretationFormSchema);

export type GermlineInterpretationSchemaType = z.infer<typeof germlineInterpretationFormSchema>;

export const somaticInterpretationFormSchema = (
  z.object({
    tumoral_type: z.string(),
    clinical_utility: z.string(),
    oncogenicity: z.string(),
    oncogenicity_classification_criterias: z.string().array(),
  }) satisfies ZodSchema<InterpretationSomatic>
).merge(genericInterpretationFormSchema);

export type SomaticInterpretationSchemaType = z.infer<typeof somaticInterpretationFormSchema>;
