import { z } from 'zod';
import { ZodSchema } from '@/components/lib/zod';
import { InterpretationGermline, InterpretationSomatic, InterpretationPubmed } from '@/api/api';
import { RefObject } from 'react';

export interface InterpretationFormRef {
  submit: () => void;
  isDirty: boolean;
}

export type Interpretation = InterpretationSomatic | InterpretationGermline;

export type InterpretationFormProps<T> = {
  ref: RefObject<InterpretationFormRef | null>;
  interpretation: T | undefined;
  saveInterpretation: (data: T) => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export const genericInterpretationFormSchema = z.object({
  interpretation: z.string().min(1, 'Required'),
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
    classification: z.string().min(1, 'Required'),
    classification_criterias: z.string().array().min(1, 'Required'),
    condition: z.string().min(1, 'Required'),
    transmission_modes: z.string().array().min(1, 'Required'),
  }) satisfies ZodSchema<InterpretationGermline>
).merge(genericInterpretationFormSchema);

export type GermlineInterpretationSchemaType = z.infer<typeof germlineInterpretationFormSchema>;

export const somaticInterpretationFormSchema = (
  z.object({
    tumoral_type: z.string().min(1, 'Required'),
    clinical_utility: z.string().min(1, 'Required'),
    oncogenicity: z.string().min(1, 'Required'),
    oncogenicity_classification_criterias: z.string().array().min(1, 'Required'),
  }) satisfies ZodSchema<InterpretationSomatic>
).merge(genericInterpretationFormSchema);

export type SomaticInterpretationSchemaType = z.infer<typeof somaticInterpretationFormSchema>;
