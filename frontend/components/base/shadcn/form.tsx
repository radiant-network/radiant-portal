import * as React from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { InfoIcon } from 'lucide-react';
import z from 'zod';

import { Label } from '@/base/shadcn/label';
import { isFieldRequired } from '@/components/lib/zod';
import { cn } from '@/lib/utils';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);
const FormSchemaContext = React.createContext<z.ZodObject<any> | null>(null);

function FormSchemaProvider({ schema, children }: { schema: z.ZodObject<any>; children: React.ReactNode }) {
  return <FormSchemaContext.Provider value={schema}>{children}</FormSchemaContext.Provider>;
}

type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = ControllerProps<
  TFieldValues,
  TName
> & {
  schema: z.ZodObject<any> | null;
};
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: FormFieldProps<TFieldValues, TName>) => (
  <FormSchemaContext.Provider value={props.schema}>
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  </FormSchemaContext.Provider>
);

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

function FormItem({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-1', className)} {...props}>
        <div className="space-y-2.5">{children}</div>
        <FormMessage />
      </div>
    </FormItemContext.Provider>
  );
}
FormItem.displayName = 'FormItem';

function FormLabel({
  className,
  colon = false,
  infoCardContent,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  colon?: boolean;
  infoCardContent?: React.ReactNode;
}) {
  const { formItemId } = useFormField();
  const fieldContext = React.useContext(FormFieldContext);
  const schema = React.useContext(FormSchemaContext);
  const isRequired = schema && fieldContext?.name ? isFieldRequired(schema, fieldContext.name as string) : false;

  return (
    <Label className={cn('flex items-center gap-1', className)} htmlFor={formItemId} {...props}>
      {children}{' '}
      {infoCardContent && (
        <HoverCard openDelay={0}>
          <HoverCardTrigger asChild>
            <InfoIcon size={14} />
          </HoverCardTrigger>
          <HoverCardContent>{infoCardContent}</HoverCardContent>
        </HoverCard>
      )}{' '}
      {isRequired && <span className="text-destructive">*</span>}
      {colon && ':'}
    </Label>
  );
}
FormLabel.displayName = 'FormLabel';

function FormControl({ ...props }: React.ComponentPropsWithoutRef<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
}
FormControl.displayName = 'FormControl';

function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField();

  return <p id={formDescriptionId} className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
FormDescription.displayName = 'FormDescription';

function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p id={formMessageId} className={cn('text-xs font-medium text-destructive', className)} {...props}>
      {body}
    </p>
  );
}
FormMessage.displayName = 'FormMessage';

export {
  useFormField,
  FormSchemaProvider,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
