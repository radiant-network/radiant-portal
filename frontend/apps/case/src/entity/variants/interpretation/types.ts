import { z } from 'zod';

import { InterpretationGermline, InterpretationPubmed, InterpretationSomatic } from '@/api/api';
import { ZodSchema } from '@/components/lib/zod';

export interface InterpretationFormRef {
  submit: () => void;
  isDirty: boolean;
}

export type Interpretation = InterpretationSomatic | InterpretationGermline;

export type InterpretationFormProps<T> = {
  interpretation: T | undefined;
  saveInterpretation: (data: T) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export const genericInterpretationFormSchema = z.object({
  interpretation: z.string().min(1, 'This field is required'),
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
    classification: z.string().min(1, 'This field is required'),
    classification_criterias: z.string().array().min(1, 'This field is required'),
    condition: z.string().min(1, 'This field is required'),
    transmission_modes: z.string().array().min(1, 'This field is required'),
  }) satisfies ZodSchema<InterpretationGermline>
).merge(genericInterpretationFormSchema);

export type GermlineInterpretationSchemaType = z.infer<typeof germlineInterpretationFormSchema>;

export const somaticInterpretationFormSchema = (
  z.object({
    tumoral_type: z.string().min(1, 'This field is required'),
    clinical_utility: z.string().min(1, 'This field is required'),
    oncogenicity: z.string().min(1, 'This field is required'),
    oncogenicity_classification_criterias: z.string().array().min(1, 'This field is required'),
  }) satisfies ZodSchema<InterpretationSomatic>
).merge(genericInterpretationFormSchema);

export type SomaticInterpretationSchemaType = z.infer<typeof somaticInterpretationFormSchema>;
